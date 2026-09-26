import React from 'react';
import { Guide } from '../data/guides';
import { Bookmark, Clock, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface GuideCardProps {
  guide: Guide;
  onOpenGuide: (guide: Guide) => void;
  isBookmarked: boolean;
  onToggleBookmark: (guideId: string) => void;
}

export const GuideCard: React.FC<GuideCardProps> = ({
  guide,
  onOpenGuide,
  isBookmarked,
  onToggleBookmark,
}) => {
  return (
    <article className="group relative flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-900/50 p-6 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-cyan-950/20 text-right">
      <div>
        {/* Anti-Slop Zero-Pill Metadata Line */}
        <div className="flex flex-wrap items-center justify-between gap-y-2 mb-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-cyan-400">{guide.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="h-3 w-3 text-slate-500" />
              <span>{guide.estimatedTime}</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className={
              guide.difficulty === 'مبتدئ'
                ? 'text-emerald-400'
                : guide.difficulty === 'متوسط'
                ? 'text-amber-400'
                : 'text-rose-400'
            }>
              {guide.difficulty}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(guide.id);
            }}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
              isBookmarked
                ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-400'
                : 'border-slate-800 bg-slate-950/40 text-slate-500 hover:border-slate-700 hover:text-slate-300'
            }`}
            title={isBookmarked ? 'إزالة من المحفوظات' : 'حفظ في المفضلة'}
            aria-label={isBookmarked ? 'إزالة من المحفوظات' : 'حفظ في المفضلة'}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-cyan-400' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3
          onClick={() => onOpenGuide(guide)}
          className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-2 leading-snug mb-2"
        >
          {guide.title}
        </h3>

        {/* Summary */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 mb-4">
          {guide.summary}
        </p>

        {/* Quick Highlights / Specs preview */}
        {guide.specs && guide.specs.length > 0 && (
          <div className="mb-4 rounded-lg border border-slate-800/60 bg-slate-950/40 p-2.5 space-y-1">
            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-cyan-400" />
              <span>أبرز المتطلبات:</span>
              <span className="text-slate-200">{guide.specs[0].value}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer: Tags and Read Action */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-400">
          {guide.tags.slice(0, 3).map((tag, idx) => (
            <span key={tag} className="hover:text-slate-200 transition-colors">
              #{tag}
              {idx < Math.min(guide.tags.length - 1, 2) && <span className="mr-1 text-slate-600">,</span>}
            </span>
          ))}
          {guide.tags.length > 3 && (
            <span className="text-slate-600">+{guide.tags.length - 3}</span>
          )}
        </div>

        <button
          onClick={() => onOpenGuide(guide)}
          className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer whitespace-nowrap"
        >
          <span>عرض الشرح</span>
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
        </button>
      </div>
    </article>
  );
};
