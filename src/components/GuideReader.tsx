import React, { useState } from 'react';
import { Guide } from '../data/guides';
import {
  ArrowRight,
  Bookmark,
  Printer,
  Copy,
  Check,
  Clock,
  AlertTriangle,
  Lightbulb,
  CheckSquare,
  Square,
  HelpCircle,
  Share2,
  ChevronDown,
  ChevronUp,
  FileCode,
} from 'lucide-react';

interface GuideReaderProps {
  guide: Guide;
  onBack: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (guideId: string) => void;
  onSelectAnotherGuide: (guideId: string) => void;
  allGuides: Guide[];
}

export const GuideReader: React.FC<GuideReaderProps> = ({
  guide,
  onBack,
  isBookmarked,
  onToggleBookmark,
  onSelectAnotherGuide,
  allGuides,
}) => {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<Record<number, boolean>>({ 0: true });
  const [copiedShare, setCopiedShare] = useState(false);
  const [showCodeExport, setShowCodeExport] = useState(false);

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: guide.title,
        text: guide.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const currentIndex = allGuides.findIndex((g) => g.id === guide.id);
  const prevGuide = currentIndex > 0 ? allGuides[currentIndex - 1] : null;
  const nextGuide = currentIndex < allGuides.length - 1 ? allGuides[currentIndex + 1] : null;

  const fontClass =
    fontSize === 'sm'
      ? 'text-xs sm:text-sm'
      : fontSize === 'lg'
      ? 'text-base sm:text-lg'
      : 'text-sm sm:text-base';

  return (
    <article className="mx-auto max-w-4xl py-6 px-4 sm:px-6 text-right">
      {/* Top Bar / Navigation Actions */}
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowRight className="h-4 w-4" />
          <span>العودة لكافة الشروحات</span>
        </button>

        {/* Reader Tools */}
        <div className="flex items-center gap-2">
          {/* Font Size Selector */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/80 p-1 text-xs">
            <span className="px-1.5 text-[11px] text-slate-400">الخط:</span>
            <button
              onClick={() => setFontSize('sm')}
              className={`rounded px-2 py-0.5 font-medium transition-colors cursor-pointer ${
                fontSize === 'sm' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              أصغر
            </button>
            <button
              onClick={() => setFontSize('base')}
              className={`rounded px-2 py-0.5 font-medium transition-colors cursor-pointer ${
                fontSize === 'base' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              افتراضي
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`rounded px-2 py-0.5 font-medium transition-colors cursor-pointer ${
                fontSize === 'lg' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              أكبر
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(guide.id)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              isBookmarked
                ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300'
                : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-cyan-400' : ''}`} />
            <span>{isBookmarked ? 'محفوظ' : 'حفظ'}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="مشاركة رابط الدليل"
          >
            {copiedShare ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
            <span>{copiedShare ? 'تم النسخ!' : 'مشاركة'}</span>
          </button>

          {/* Print */}
          <button
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="طباعة الدليل كملف PDF"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>طباعة</span>
          </button>
        </div>
      </div>

      {/* Header & Meta (Zero-Pill Anti-Slop Rule) */}
      <header className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-cyan-400">{guide.category}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span>وقت القراءة: {guide.estimatedTime}</span>
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>مستوى الصعوبة: {guide.difficulty}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>آخر تحديث: {guide.lastUpdated}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-4">
          {guide.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
          {guide.summary}
        </p>
      </header>

      {/* Technical Specifications Table */}
      {guide.specs && guide.specs.length > 0 && (
        <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
          <h2 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
            <span>المواصفات والبيانات الفنية للدليل</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {guide.specs.map((spec, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-950/60 px-3 py-2 text-xs"
              >
                <span className="text-slate-400 font-medium">{spec.label}</span>
                <span className="text-slate-200 font-semibold font-mono tabular-nums text-left dir-ltr">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Prerequisites Checklist */}
      {guide.prerequisites && guide.prerequisites.length > 0 && (
        <section className="mb-8 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 sm:p-5">
          <h2 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
            <span>المتطلبات الأساسية قبل البدء:</span>
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            {guide.prerequisites.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Main Content Sections */}
      <div className="space-y-8 mb-10">
        {guide.sections.map((section, sIdx) => (
          <section
            key={sIdx}
            className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 sm:p-6"
          >
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3">
              {section.title}
            </h2>

            <p className={`text-slate-300 leading-relaxed mb-4 ${fontClass}`}>
              {section.content}
            </p>

            {/* Steps Checklist */}
            {section.steps && section.steps.length > 0 && (
              <div className="my-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-semibold text-slate-300">خطوات التنفيذ التفاعلية:</span>
                  <span className="text-[11px] text-cyan-400">انقر على الخطوة لتحديد إتمامها</span>
                </div>

                {section.steps.map((step, stepIdx) => {
                  const stepKey = `${guide.id}-s${sIdx}-step${stepIdx}`;
                  const isDone = !!completedSteps[stepKey];
                  return (
                    <div
                      key={stepIdx}
                      onClick={() => toggleStep(stepKey)}
                      className={`group flex items-start gap-3 rounded-lg border p-3 transition-colors cursor-pointer ${
                        isDone
                          ? 'border-emerald-800/60 bg-emerald-950/20 text-slate-400'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
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
                        <div className="flex items-center justify-between">
                          <h3
                            className={`text-xs sm:text-sm font-semibold transition-colors ${
                              isDone ? 'line-through text-slate-500' : 'text-slate-200'
                            }`}
                          >
                            {step.title}
                          </h3>
                          <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                            خطوة {stepIdx + 1}
                          </span>
                        </div>
                        <p className={`text-xs text-slate-400 leading-relaxed ${isDone ? 'line-through opacity-70' : ''}`}>
                          {step.description}
                        </p>
                        {step.commandOrPath && (
                          <div className="mt-2 flex items-center justify-between rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 font-mono text-xs text-cyan-300 dir-ltr text-left">
                            <span className="truncate">{step.commandOrPath}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyCode(step.commandOrPath!, stepKey);
                              }}
                              className="ml-2 text-slate-400 hover:text-white"
                              title="نسخ الأمر"
                            >
                              {copiedCodeId === stepKey ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        )}
                        {step.note && (
                          <p className="text-[11px] text-amber-400/90 mt-1">
                            ملاحظة: {step.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Code Snippet Box */}
            {section.codeSnippet && (
              <div className="my-5 rounded-lg border border-slate-800 bg-slate-950 overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-3.5 py-2 text-xs">
                  <span className="font-mono text-slate-400 text-[11px] uppercase">
                    {section.codeSnippet.language}
                  </span>
                  <div className="flex items-center gap-2">
                    {section.codeSnippet.caption && (
                      <span className="text-[11px] text-slate-400">
                        {section.codeSnippet.caption}
                      </span>
                    )}
                    <button
                      onClick={() =>
                        handleCopyCode(section.codeSnippet!.code, `code-${sIdx}`)
                      }
                      className="flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[11px] text-slate-200 transition-colors cursor-pointer"
                    >
                      {copiedCodeId === `code-${sIdx}` ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span>تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>نسخ الكود</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <pre className="p-4 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed dir-ltr text-left">
                  <code>{section.codeSnippet.code}</code>
                </pre>
              </div>
            )}

            {/* Tip Callout */}
            {section.tip && (
              <div className="my-4 flex items-start gap-3 rounded-lg border border-cyan-800/50 bg-cyan-950/20 p-3.5 text-xs text-cyan-200">
                <Lightbulb className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">إرشاد فني مفيد:</span>
                  <span>{section.tip}</span>
                </div>
              </div>
            )}

            {/* Warning Callout */}
            {section.warning && (
              <div className="my-4 flex items-start gap-3 rounded-lg border border-rose-800/50 bg-rose-950/20 p-3.5 text-xs text-rose-200">
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">تنبيه أمان هام:</span>
                  <span>{section.warning}</span>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Frequently Asked Questions */}
      {guide.faq && guide.faq.length > 0 && (
        <section className="mb-10 rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-cyan-400" />
            <span>الأسئلة الشائعة والأخطاء المحتملة</span>
          </h2>
          <div className="space-y-3">
            {guide.faq.map((item, idx) => {
              const isOpen = !!expandedFaq[idx];
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-800/70 bg-slate-950/50 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedFaq((prev) => ({ ...prev, [idx]: !prev[idx] }))
                    }
                    className="flex w-full items-center justify-between p-3.5 text-right text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{item.question}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-800/60 p-3.5 text-xs sm:text-sm text-slate-400 leading-relaxed bg-slate-900/30">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Developer Export: Copy JSON to duplicate easily */}
      <div className="no-print mb-10 rounded-xl border border-slate-800 bg-slate-950 p-4 text-right">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <FileCode className="h-4 w-4 text-cyan-400" />
            <span>تصدير هيكل الشرح ككود (لإضافة المزيد من الشروحات)</span>
          </div>
          <button
            onClick={() => setShowCodeExport(!showCodeExport)}
            className="text-xs text-cyan-400 hover:underline cursor-pointer"
          >
            {showCodeExport ? 'إخفاء الكود' : 'عرض الكود البرمجي'}
          </button>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          يمكنك نسخ بنية كائن TypeScript هذا ولصقه داخل ملف <code className="text-cyan-300">src/data/guides.ts</code> لإنشاء مقالاتك الخاصة وتوسيع المنصة بسرعة.
        </p>

        {showCodeExport && (
          <div className="mt-3 relative">
            <pre className="max-h-60 overflow-y-auto rounded-lg bg-slate-900 border border-slate-800 p-3 text-[11px] font-mono text-cyan-200 text-left dir-ltr">
              <code>{JSON.stringify(guide, null, 2)}</code>
            </pre>
            <button
              onClick={() => handleCopyCode(JSON.stringify(guide, null, 2), 'export-json')}
              className="absolute top-2 right-2 flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700 cursor-pointer"
            >
              {copiedCodeId === 'export-json' ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span>تم نسخ الكائن</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>نسخ الكود</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Next & Previous Guides Navigation */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800 pt-6">
        {prevGuide ? (
          <button
            onClick={() => onSelectAnotherGuide(prevGuide.id)}
            className="group flex flex-col text-right rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-slate-700 hover:bg-slate-900/80 transition-colors cursor-pointer"
          >
            <span className="text-[11px] text-slate-500 mb-1">الشرح السابق:</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-cyan-300 line-clamp-1">
              {prevGuide.title}
            </span>
          </button>
        ) : (
          <div />
        )}

        {nextGuide && (
          <button
            onClick={() => onSelectAnotherGuide(nextGuide.id)}
            className="group flex flex-col text-left rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-slate-700 hover:bg-slate-900/80 transition-colors cursor-pointer text-right"
          >
            <span className="text-[11px] text-slate-500 mb-1">الشرح التالي:</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-cyan-300 line-clamp-1">
              {nextGuide.title}
            </span>
          </button>
        )}
      </div>
    </article>
  );
};
