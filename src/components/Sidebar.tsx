import React from 'react';
import { CATEGORIES, CategoryType } from '../data/guides';
import { HardDrive, Cpu, Wifi, RefreshCw, Monitor, Layers, Filter, CheckCircle2 } from 'lucide-react';

interface SidebarProps {
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  selectedDifficulty: 'all' | 'مبتدئ' | 'متوسط' | 'متقدم';
  onSelectDifficulty: (diff: 'all' | 'مبتدئ' | 'متوسط' | 'متقدم') => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  allTags: string[];
  totalGuidesCount: number;
  categoryCounts: Record<string, number>;
  onOpenChecklistModal: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'الكل': <Layers className="h-4 w-4" />,
  'التخزين والملفات': <HardDrive className="h-4 w-4" />,
  'صيانة النظام': <Cpu className="h-4 w-4" />,
  'الشبكات والاتصال': <Wifi className="h-4 w-4" />,
  'التحديثات والترقيات': <RefreshCw className="h-4 w-4" />,
  'العرض والأداء': <Monitor className="h-4 w-4" />,
};

export const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedDifficulty,
  onSelectDifficulty,
  selectedTag,
  onSelectTag,
  allTags,
  totalGuidesCount,
  categoryCounts,
  onOpenChecklistModal,
}) => {
  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      {/* Category Navigation */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
        <div className="mb-3 flex items-center justify-between text-xs font-semibold tracking-wider text-slate-400">
          <span>التصنيفات الرئيسية</span>
          <span className="font-mono text-slate-500 tabular-nums">({totalGuidesCount})</span>
        </div>

        <div className="space-y-1">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            const count = category === 'الكل' ? totalGuidesCount : categoryCounts[category] || 0;
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer text-right ${
                  isSelected
                    ? 'bg-cyan-950/70 border border-cyan-800/60 text-cyan-200'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isSelected ? 'text-cyan-400' : 'text-slate-400'}>
                    {CATEGORY_ICONS[category] || <Layers className="h-4 w-4" />}
                  </span>
                  <span>{category}</span>
                </div>
                <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
        <div className="mb-3 flex items-center justify-between text-xs font-semibold tracking-wider text-slate-400">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <span>مستوى الصعوبة</span>
          </div>
          {selectedDifficulty !== 'all' && (
            <button
              onClick={() => onSelectDifficulty('all')}
              className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
            >
              إلغاء التصفية
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/60 rounded-lg border border-slate-800/70">
          {(['all', 'مبتدئ', 'متوسط', 'متقدم'] as const).map((diff) => {
            const isSelected = selectedDifficulty === diff;
            const label = diff === 'all' ? 'الكل' : diff;
            return (
              <button
                key={diff}
                onClick={() => onSelectDifficulty(diff)}
                className={`rounded-md py-1.5 px-2 text-center text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular Tags */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
        <div className="mb-3 flex items-center justify-between text-xs font-semibold tracking-wider text-slate-400">
          <span>الكلمات المفتاحية</span>
          {selectedTag && (
            <button
              onClick={() => onSelectTag(null)}
              className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
            >
              إظهار الكل
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => onSelectTag(isSelected ? null : tag)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Post-update Diagnostic Banner */}
      <div className="rounded-xl border border-emerald-900/40 bg-linear-to-b from-emerald-950/30 to-slate-900/50 p-4 text-right">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <h4 className="text-xs font-semibold text-emerald-300">
            فحص الأجهزة بعد التحديثات
          </h4>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
          قائمة تفاعلية للتأكد من استقرار نظام الملفات، سلامة المنافذ، وحرارة المعالج بعد تثبيت أي ترقية نظامية.
        </p>
        <button
          onClick={onOpenChecklistModal}
          className="w-full rounded-lg border border-emerald-700/50 bg-emerald-900/30 py-2 text-center text-xs font-medium text-emerald-200 hover:bg-emerald-900/50 transition-colors cursor-pointer"
        >
          فتح أداة الفحص التفاعلية
        </button>
      </div>
    </aside>
  );
};
