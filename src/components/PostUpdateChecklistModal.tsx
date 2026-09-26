import React, { useState } from 'react';
import { X, CheckSquare, Square, RotateCcw, AlertCircle, ShieldCheck } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  critical: boolean;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'boot-cycle',
    category: 'الإقلاع والطاقة',
    title: 'اكتمال دورة الإقلاع دون إعادة تشغيل تلقائية (Bootloop)',
    description: 'تأكد من استقرار الضوء الدليلي واستقرار شاشة الترحيب الرئيسية دون ظهور شاشة رمادية أو توقف عند الشعار.',
    critical: true,
  },
  {
    id: 'filesystem-check',
    category: 'نظام الملفات',
    title: 'التحقق من عدم ظهور رسالة تلف الملفات أو فحص القرص التلقائي',
    description: 'إذا طلب الجهاز فحص القرص التلقائي، دعه يكتمل 100% دون فصل السلك لتفادي أخطاء القطاعات التالفة.',
    critical: true,
  },
  {
    id: 'free-space-headroom',
    category: 'سعة التخزين',
    title: 'تأمين مساحة تخزين احتياطية لا تقل عن 10% إلى 15%',
    description: 'تحتاج معالجات التحديث لمساحة فارغة لكتابة ملفات التبديل Swap وملفات الكاش المؤقتة وتجنب بطء القوائم.',
    critical: false,
  },
  {
    id: 'database-indexing',
    category: 'قاعدة البيانات',
    title: 'فحص سرعة تحميل التطبيقات والأيقونات في القوائم',
    description: 'في حال بطء القوائم أو ظهور مربعات بيضاء مكان الأيقونات، نفذ إجراء Rebuild Database من وضع الأمان.',
    critical: false,
  },
  {
    id: 'network-handshake',
    category: 'الشبكة والاتصال',
    title: 'اختبار الاتصال بالشبكة المحلية واستقرار خوادم DNS',
    description: 'قم بعمل اختبار اتصال للتأكد من الحصول على عنوان IP صحيح وزمن استجابة منخفض لا يتجاوز 30ms محلياً.',
    critical: false,
  },
  {
    id: 'display-resolution',
    category: 'العرض والشاشة',
    title: 'التحقق من إشارة HDMI ونطاق الألوان ومعدل التحديث (HDR/VRR)',
    description: 'تأكد من عدم وجود وميض بالشاشة السوداء ومطابقة إعدادات RGB Full/Limited مع إعدادات الشاشة.',
    critical: false,
  },
  {
    id: 'thermal-check',
    category: 'الحرارة والتهوية',
    title: 'مراقبة مستوى صوت مروحة التبريد بعد التشغيل بـ 15 دقيقة',
    description: 'إذا تصاعد صوت المروحة فور تشغيل الجهاز، تأكد من نظافة منافذ سحب الهواء وعدم وجود تراكم للغبار.',
    critical: true,
  },
  {
    id: 'savedata-backup',
    category: 'النسخ الاحتياطي',
    title: 'إنشاء نسخة احتياطية جديدة لملفات الحفظ على وحدة USB الخارجية',
    description: 'إجراء وقائي بديهي بعد التحديثات الكبرى لتفادي فقدان الإعدادات أو الإنجازات في حال حدوث عطل لاحق.',
    critical: false,
  },
];

interface PostUpdateChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostUpdateChecklistModal: React.FC<PostUpdateChecklistModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReset = () => {
    setCompleted({});
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto text-right">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                دليل الفحص السريع بعد التحديثات النظامية
              </h2>
              <span className="text-xs text-slate-400">
                8 اختبارات وقائية للتأكد من سلامة واستقرار الجهاز بعد الترقية
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-300">نسبة اكتمال الفحص</span>
            <span className="font-mono text-emerald-400 tabular-nums">
              {completedCount} من {CHECKLIST_ITEMS.length} مكتملة ({progressPercent}%)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
          {CHECKLIST_ITEMS.map((item) => {
            const isDone = !!completed[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`group flex items-start gap-3 rounded-xl border p-3.5 transition-colors cursor-pointer ${
                  isDone
                    ? 'border-emerald-900/60 bg-emerald-950/20 text-slate-400'
                    : 'border-slate-800/90 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-slate-400 group-hover:text-cyan-400 shrink-0"
                >
                  {isDone ? (
                    <CheckSquare className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Square className="h-4 w-4 text-slate-500" />
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs sm:text-sm font-semibold transition-colors ${
                        isDone ? 'line-through text-slate-500' : 'text-slate-200'
                      }`}
                    >
                      {item.title}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.critical && (
                        <span className="rounded bg-rose-950/60 border border-rose-800/50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-300">
                          حرج
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <p className={`text-xs text-slate-400 leading-relaxed ${isDone ? 'line-through opacity-70' : ''}`}>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>إعادة تعيين الفحص</span>
          </button>

          <button
            onClick={onClose}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors cursor-pointer"
          >
            إغلاق أداة الفحص
          </button>
        </div>
      </div>
    </div>
  );
};
