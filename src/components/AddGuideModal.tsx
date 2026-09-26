import React, { useState } from 'react';
import { Guide, CATEGORIES, CategoryType } from '../data/guides';
import { X, Plus, Trash2, Copy, Check, Sparkles, FileText } from 'lucide-react';

interface AddGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGuide: (guide: Guide) => void;
}

export const AddGuideModal: React.FC<AddGuideModalProps> = ({
  isOpen,
  onClose,
  onAddGuide,
}) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState<CategoryType>('التخزين والملفات');
  const [difficulty, setDifficulty] = useState<'مبتدئ' | 'متوسط' | 'متقدم'>('متوسط');
  const [estimatedTime, setEstimatedTime] = useState('15 دقيقة');
  const [tagsInput, setTagsInput] = useState('إعدادات, ملفات, صيانة');
  
  // Prerequisites
  const [prereqInput, setPrereqInput] = useState('حاسوب أو جهاز متصل بالشبكة\nوحدة تخزين خارجية متوافقة');
  
  // Section 1
  const [sec1Title, setSec1Title] = useState('1. المتطلبات والتمهيد النظري');
  const [sec1Content, setSec1Content] = useState('شرح توضيحي حول أهمية هذا الإجراء وكيفية تنفيذه بالشكل الأمثل...');
  const [sec1Tip, setSec1Tip] = useState('تأكد دائماً من وجود مساحة فارغة كافية في القرص قبل البدء.');
  
  // Section 2 (Steps)
  const [sec2Title, setSec2Title] = useState('2. خطوات التطبيق العملية');
  const [sec2Content, setSec2Content] = useState('اتبع الخطوات التالية بالتسلسل لضمان الحصول على أفضل نتيجة:');
  const [steps, setSteps] = useState([
    { title: 'التحقق من سلامة الاتصال', description: 'تأكد من ثبات الأسلاك ومصدر الطاقة.', command: '' },
    { title: 'تنفيذ الإعداد الأساسي', description: 'ادخل إلى قائمة الإعدادات ثم حدد الخيار المستهدف.', command: '' },
  ]);

  const [copiedTs, setCopiedTs] = useState(false);

  if (!isOpen) return null;

  const handleAddStep = () => {
    setSteps([...steps, { title: 'خطوة جديدة', description: 'وصف الخطوة...', command: '' }]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleStepChange = (index: number, field: 'title' | 'description' | 'command', val: string) => {
    const updated = [...steps];
    updated[index][field] = val;
    setSteps(updated);
  };

  const constructGuideObject = (): Guide => {
    const idSlug = title
      ? title.toLowerCase().replace(/[^\w\u0600-\u06FF]+/g, '-').slice(0, 30)
      : `guide-${Date.now()}`;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const prerequisites = prereqInput
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    return {
      id: idSlug || `guide-${Date.now()}`,
      title: title || 'دليل جديد بدون عنوان',
      summary: summary || 'ملخص الدليل التوضيحي...',
      category: category === 'الكل' ? 'التخزين والملفات' : category,
      difficulty,
      estimatedTime: estimatedTime || '15 دقيقة',
      lastUpdated: 'سبتمبر 2026',
      tags: tags.length > 0 ? tags : ['عام', 'أجهزة'],
      prerequisites: prerequisites.length > 0 ? prerequisites : ['لا توجد متطلبات خاصة'],
      specs: [
        { label: 'التصنيف الأساسي', value: category },
        { label: 'مستوى التنفيذ', value: difficulty },
        { label: 'الوقت المستغرق', value: estimatedTime },
      ],
      sections: [
        {
          title: sec1Title,
          content: sec1Content,
          tip: sec1Tip || undefined,
        },
        {
          title: sec2Title,
          content: sec2Content,
          steps: steps.map((s) => ({
            title: s.title,
            description: s.description,
            commandOrPath: s.command || undefined,
          })),
        },
      ],
      faq: [
        {
          question: 'هل يمكن تطبيق هذا الشرح على كافة الطرازات؟',
          answer: 'نعم، الخطوات عامة ومعيارية لمعظم الأنظمة الحديثة ما لم يذكر خلاف ذلك.',
        },
      ],
    };
  };

  const handleSaveToSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('يرجى كتابة عنوان للشرح على الأقل.');
      return;
    }
    const newGuide = constructGuideObject();
    onAddGuide(newGuide);
    onClose();
  };

  const handleCopyCodeSnippet = () => {
    const guideObj = constructGuideObject();
    const tsCode = `  // شرح إضافي جديد
  {
    id: ${JSON.stringify(guideObj.id)},
    title: ${JSON.stringify(guideObj.title)},
    summary: ${JSON.stringify(guideObj.summary)},
    category: ${JSON.stringify(guideObj.category)},
    difficulty: ${JSON.stringify(guideObj.difficulty)},
    estimatedTime: ${JSON.stringify(guideObj.estimatedTime)},
    lastUpdated: ${JSON.stringify(guideObj.lastUpdated)},
    tags: ${JSON.stringify(guideObj.tags)},
    prerequisites: ${JSON.stringify(guideObj.prerequisites, null, 6)},
    specs: ${JSON.stringify(guideObj.specs, null, 6)},
    sections: ${JSON.stringify(guideObj.sections, null, 6)},
    faq: ${JSON.stringify(guideObj.faq, null, 6)}
  },`;

    navigator.clipboard.writeText(tsCode);
    setCopiedTs(true);
    setTimeout(() => setCopiedTs(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto text-right">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              إضافة وتوليد كود شرح جديد
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="mb-5 rounded-lg border border-cyan-800/40 bg-cyan-950/20 p-3 text-xs text-cyan-200 leading-relaxed">
          <span className="font-semibold block mb-0.5">طريقة إضافة الشروحات بسهولة:</span>
          يمكنك تعبئة هذا النموذج إما لتجربة المقال فوراً في المتصفح، أو الضغط على زر "نسخ كود TypeScript" ولصقه مباشرة في مصفوفة <code className="text-cyan-300 font-mono">INITIAL_GUIDES</code> داخل ملف <code className="text-cyan-300 font-mono">guides.ts</code>.
        </div>

        <form onSubmit={handleSaveToSession} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              عنوان الشرح المقترح *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: ضبط إعدادات الذاكرة العشوائية وحل مشكلات التوقف المفاجئ"
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-hidden"
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ملخص موجز للشرح *
            </label>
            <textarea
              rows={2}
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="وصف مختصر في سطرين يوضح الفائدة الأساسية من المقال..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-hidden"
            />
          </div>

          {/* Category & Difficulty & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                التصنيف
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
              >
                {CATEGORIES.filter((c) => c !== 'الكل').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                مستوى الصعوبة
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
              >
                <option value="مبتدئ">مبتدئ</option>
                <option value="متوسط">متوسط</option>
                <option value="متقدم">متقدم</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                الوقت التقديري
              </label>
              <input
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="مثال: 15 دقيقة"
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
              >
              </input>
            </div>
          </div>

          {/* Tags & Prerequisites */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                الكلمات المفتاحية (مفصولة بفاصلة)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="RAM, تسريع, ضبط, كاش"
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                المتطلبات الأساسية (سطر لكل متطلب)
              </label>
              <textarea
                rows={2}
                value={prereqInput}
                onChange={(e) => setPrereqInput(e.target.value)}
                placeholder="كيبل شبكة ثابت&#10;شاشة تدعم الدقة المطلوبة"
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Section 1 */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-3">
            <h3 className="text-xs font-bold text-cyan-400">القسم الأول: الشرح النظري</h3>
            <input
              type="text"
              value={sec1Title}
              onChange={(e) => setSec1Title(e.target.value)}
              placeholder="عنوان القسم الأول"
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white"
            />
            <textarea
              rows={2}
              value={sec1Content}
              onChange={(e) => setSec1Content(e.target.value)}
              placeholder="محتوى القسم..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white"
            />
            <input
              type="text"
              value={sec1Tip}
              onChange={(e) => setSec1Tip(e.target.value)}
              placeholder="نصيحة اختيارية (Tip)..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-amber-300"
            />
          </div>

          {/* Section 2 (Steps) */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-cyan-400">القسم الثاني: خطوات التنفيذ</h3>
              <button
                type="button"
                onClick={handleAddStep}
                className="flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[11px] text-slate-200 cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>إضافة خطوة</span>
              </button>
            </div>

            <div className="space-y-2">
              {steps.map((st, i) => (
                <div key={i} className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">خطوة {i + 1}</span>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(i)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={st.title}
                    onChange={(e) => handleStepChange(i, 'title', e.target.value)}
                    placeholder="عنوان الخطوة"
                    className="w-full rounded border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={st.description}
                    onChange={(e) => handleStepChange(i, 'description', e.target.value)}
                    placeholder="تفاصيل التنفيذ..."
                    className="w-full rounded border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleCopyCodeSnippet}
              className="flex items-center gap-1.5 rounded-lg border border-cyan-800 bg-cyan-950/40 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/50 transition-colors cursor-pointer"
            >
              {copiedTs ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copiedTs ? 'تم نسخ الكود للحافظة!' : 'نسخ كود TypeScript للإدراج الدائم'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-5 py-2 text-xs font-bold text-white hover:bg-cyan-500 transition-colors cursor-pointer"
              >
                <FileText className="h-4 w-4" />
                <span>إضافة وعرض في المنصة</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
