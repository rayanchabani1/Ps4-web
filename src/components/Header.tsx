import React from 'react';
import { Bookmark, Plus, CheckSquare, Search, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenChecklistModal: () => void;
  onSelectTab: (tab: 'all' | 'bookmarks' | 'about') => void;
  activeTab: 'all' | 'bookmarks' | 'about';
  savedCount: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenChecklistModal,
  onSelectTab,
  activeTab,
  savedCount,
  mobileMenuOpen,
  setMobileMenuOpen,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200 lg:hidden"
            aria-label="القائمة الجانبية"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <button
            onClick={() => onSelectTab('all')}
            className="text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer text-right"
          >
            دليل الأجهزة والنظم
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('all')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 border-b-2 ${
              activeTab === 'all'
                ? 'border-cyan-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            كافة الشروحات
          </button>

          <button
            onClick={onOpenChecklistModal}
            className="flex items-center gap-1.5 py-1 text-slate-400 hover:text-cyan-300 transition-colors whitespace-nowrap cursor-pointer"
          >
            <CheckSquare className="h-4 w-4 text-emerald-400" />
            <span>فحص ما بعد التحديث</span>
          </button>

          <button
            onClick={() => onSelectTab('bookmarks')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer py-1 border-b-2 ${
              activeTab === 'bookmarks'
                ? 'border-cyan-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            <span>المقالات المحفوظة</span>
            {savedCount > 0 && (
              <span className="text-xs text-cyan-400 tabular-nums font-mono">
                ({savedCount})
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('about')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 border-b-2 ${
              activeTab === 'about'
                ? 'border-cyan-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            عن الدليل وطريقة التوسيع
          </button>
        </nav>

        {/* Zone 3: Primary actions & quick search */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block w-48 lg:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الشروحات..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900/90 py-1.5 pr-8 pl-3 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            <Search className="absolute right-2.5 top-2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-cyan-500 active:bg-cyan-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>إضافة شرح جديد</span>
          </button>
        </div>

      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-800/90 bg-slate-950 px-4 py-3 md:hidden space-y-2">
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الشروحات والعناوين..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2 pr-9 pl-3 text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
          </div>

          <div className="flex flex-col gap-1 text-sm font-medium">
            <button
              onClick={() => {
                onSelectTab('all');
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-right text-slate-300 hover:bg-slate-900"
            >
              <span>كافة الشروحات</span>
            </button>
            <button
              onClick={() => {
                onOpenChecklistModal();
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-right text-slate-300 hover:bg-slate-900"
            >
              <span>فحص ما بعد التحديث (Checklist)</span>
              <CheckSquare className="h-4 w-4 text-emerald-400" />
            </button>
            <button
              onClick={() => {
                onSelectTab('bookmarks');
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-right text-slate-300 hover:bg-slate-900"
            >
              <span>المقالات المحفوظة</span>
              <span className="font-mono text-cyan-400 text-xs">({savedCount})</span>
            </button>
            <button
              onClick={() => {
                onSelectTab('about');
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-right text-slate-300 hover:bg-slate-900"
            >
              <span>عن الدليل وطريقة التوسيع</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
