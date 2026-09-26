import React, { useState } from 'react';
import { FileCode, Copy, Check, Layers, Terminal, Sparkles, BookOpen } from 'lucide-react';

export const AboutGuide: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);

  const sampleTemplate = `// مثال لإضافة شرح جديد داخل src/data/guides.ts
{
  id: 'my-custom-guide-slug',
  title: 'عنوان الشرح الفني الجديد هنا',
  summary: 'ملخص موجز يشرح ما سيتعلمه القارئ في سطرين واضحين.',
  category: 'التخزين والملفات', // أو 'صيانة النظام' | 'الشبكات والاتصال' | 'التحديثات والترقيات' | 'العرض والأداء'
  difficulty: 'متوسط', // 'مبتدئ' | 'متوسط' | 'متقدم'
  estimatedTime: '15 دقيقة',
  lastUpdated: 'سبتمبر 2026',
  tags: ['SSD', 'نسخ احتياطي', 'صيانة'],
  prerequisites: [
    'جهاز متصل بمصدر طاقة مستمر',
    'فلاش USB مهيأ بنظام exFAT'
  ],
  specs: [
    { label: 'البروتوكول المستهدف', value: 'USB 3.2 Gen 2' },
    { label: 'المستوى الأمني', value: 'آمن ولا يحذف بيانات' }
  ],
  sections: [
    {
      title: '1. المقدمة والشرح النظري',
      content: 'شرح مفصل لكيفية عمل النظام ولماذا نحتاج لهذا الإجراء...',
      tip: 'احرص دائماً على أخذ نسخة احتياطية أولاً.'
    },
    {
      title: '2. خطوات التطبيق العملية',
      content: 'اتبع التعليمات التالية بالتسلسل:',
      steps: [
        {
          title: 'الخطوة الأولى',
          description: 'توصيل الوحدة والتحقق من قراءتها.',
          commandOrPath: 'diskmgmt.msc'
        },
        {
          title: 'الخطوة الثانية',
          description: 'بدء نقل الملفات المحددة والتأكد من الاكتمال.'
        }
      ],
      warning: 'لا تفصل الكيبل أثناء وميض مؤشر القراءة والكتابة.'
    }
  ],
  faq: [
    {
      question: 'هل يمكن تطبيق هذا الدليل على أجهزة أخرى؟',
      answer: 'نعم، نفس الخطوات تنطبق على أغلب الأنظمة المتوافقة مع معايير التخزين الموحدة.'
    }
  ]
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleTemplate);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl py-6 px-4 sm:px-6 text-right space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
          <BookOpen className="h-4 w-4" />
          <span>التوثيق البرمجي وبنية النظام</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
          كيفية إضافة وتوسيع الشروحات والأدلة في المنصة
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed bg-slate-900/40 border border-slate-800 rounded-xl p-4">
          تم تصميم هذه المنصة التعليمية ببنية نظيفة ومفتوحة تماماً (Modular Architecture) بحيث يمكن لأي مطور أو مدون تقني نسخ نموذج الشرح ولصقه، ليظهر تلقائياً في محرك البحث الداخلي، وقوائم التصفية، ونظام القراءة التفاعلي، ونظام حفظ المقالات.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="h-8 w-8 rounded-lg bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-3">
            <Layers className="h-4 w-4" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-white mb-1">
            فهرسة تلقائية وتصفية ذكية
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            بمجرد إضافة المقال إلى مصفوفة الشروحات، يتولى التطبيق حساب إحصائيات التصنيف والكلمات المفتاحية تلقائياً.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="h-8 w-8 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-3">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-white mb-1">
            خطوات تفاعلية Checklist
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            كل خطوة في الشرح تحتوي على مربع اختيار تفاعلي يمكن للقارئ النقر عليه لحفظ مستوى تقدمه أثناء التطبيق.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="h-8 w-8 rounded-lg bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mb-3">
            <Terminal className="h-4 w-4" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-white mb-1">
            أوامر قابلة للنسخ الفوري
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            دعم كامل للأكواد والمسارات (Commands & Paths) مع زر نسخ فوري إلى حافظة المستخدم بنقرة واحدة.
          </p>
        </div>
      </div>

      {/* Copy-paste Template */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-cyan-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              نموذج TypeScript الجاهز للنسخ المباشر
            </h2>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors cursor-pointer"
          >
            {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedCode ? 'تم النسخ بنجاح!' : 'نسخ النموذج'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          الملف المسؤول عن الشروحات هو: <code className="text-cyan-300 font-mono">/src/data/guides.ts</code>. انسخ هذا الكائن وألصقه داخل مصفوفة <code className="text-cyan-300 font-mono">INITIAL_GUIDES</code>:
        </p>

        <pre className="max-h-96 overflow-y-auto rounded-lg bg-slate-900 border border-slate-800 p-4 text-xs font-mono text-cyan-200 dir-ltr text-left leading-relaxed">
          <code>{sampleTemplate}</code>
        </pre>
      </div>
    </div>
  );
};
