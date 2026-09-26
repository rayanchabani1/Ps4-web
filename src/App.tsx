/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_GUIDES, Guide, CategoryType } from './data/guides';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GuideCard } from './components/GuideCard';
import { GuideReader } from './components/GuideReader';
import { AddGuideModal } from './components/AddGuideModal';
import { PostUpdateChecklistModal } from './components/PostUpdateChecklistModal';
import { AboutGuide } from './components/AboutGuide';
import heroBanner from './assets/images/hero_device_guide_1790444664626.jpg';
import {
  Search,
  BookOpen,
  FilterX,
  Bookmark,
  CheckCircle2,
  HardDrive,
  Cpu,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  // Guides State (Initial + LocalStorage Custom Guides)
  const [guides, setGuides] = useState<Guide[]>(() => {
    try {
      const stored = localStorage.getItem('custom_guides');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge custom guides with initial
          const existingIds = new Set(INITIAL_GUIDES.map((g) => g.id));
          const uniqueCustom = parsed.filter((g: Guide) => !existingIds.has(g.id));
          return [...INITIAL_GUIDES, ...uniqueCustom];
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_GUIDES;
  });

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saved_guides_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'all' | 'bookmarks' | 'about'>('all');
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('الكل');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'مبتدئ' | 'متوسط' | 'متقدم'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Mobile Menu
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync Bookmarks to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('saved_guides_bookmarks', JSON.stringify(bookmarks));
    } catch {
      // ignore
    }
  }, [bookmarks]);

  const handleToggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddGuide = (newGuide: Guide) => {
    setGuides((prev) => {
      const updated = [newGuide, ...prev];
      try {
        const customOnly = updated.filter(
          (g) => !INITIAL_GUIDES.some((orig) => orig.id === g.id)
        );
        localStorage.setItem('custom_guides', JSON.stringify(customOnly));
      } catch {
        // ignore
      }
      return updated;
    });
    // Open the new guide immediately
    setSelectedGuideId(newGuide.id);
  };

  // Derive unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    guides.forEach((g) => g.tags.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet).slice(0, 15);
  }, [guides]);

  // Derive category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    guides.forEach((g) => {
      counts[g.category] = (counts[g.category] || 0) + 1;
    });
    return counts;
  }, [guides]);

  // Filtered Guides
  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      // Tab filter
      if (activeTab === 'bookmarks' && !bookmarks.includes(guide.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'الكل' && guide.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'all' && guide.difficulty !== selectedDifficulty) {
        return false;
      }

      // Tag filter
      if (selectedTag && !guide.tags.includes(selectedTag)) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = guide.title.toLowerCase().includes(query);
        const inSummary = guide.summary.toLowerCase().includes(query);
        const inTags = guide.tags.some((t) => t.toLowerCase().includes(query));
        const inSections = guide.sections.some(
          (s) =>
            s.title.toLowerCase().includes(query) ||
            s.content.toLowerCase().includes(query)
        );
        return inTitle || inSummary || inTags || inSections;
      }

      return true;
    });
  }, [
    guides,
    activeTab,
    bookmarks,
    selectedCategory,
    selectedDifficulty,
    selectedTag,
    searchQuery,
  ]);

  const activeGuide = useMemo(() => {
    if (!selectedGuideId) return null;
    return guides.find((g) => g.id === selectedGuideId) || null;
  }, [guides, selectedGuideId]);

  const resetAllFilters = () => {
    setSelectedCategory('الكل');
    setSelectedDifficulty('all');
    setSelectedTag(null);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Header */}
      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenChecklistModal={() => setIsChecklistModalOpen(true)}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedGuideId(null);
        }}
        activeTab={activeTab}
        savedCount={bookmarks.length}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Container */}
      <main className="flex-1">
        {/* If Reader Mode is Active */}
        {activeGuide ? (
          <GuideReader
            guide={activeGuide}
            onBack={() => setSelectedGuideId(null)}
            isBookmarked={bookmarks.includes(activeGuide.id)}
            onToggleBookmark={handleToggleBookmark}
            onSelectAnotherGuide={(id) => setSelectedGuideId(id)}
            allGuides={guides}
          />
        ) : activeTab === 'about' ? (
          <AboutGuide />
        ) : (
          <div>
            {/* Hero Section */}
            {activeTab === 'all' && !searchQuery && selectedCategory === 'الكل' && !selectedTag && selectedDifficulty === 'all' && (
              <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950">
                <div className="absolute inset-0 z-0 opacity-20">
                  <img
                    src={heroBanner}
                    alt="صيانة وإعداد الأجهزة الإلكترونية"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 text-right">
                  <div className="max-w-3xl">
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-cyan-400">
                      <BookOpen className="h-4 w-4" />
                      <span>دليل استرشادي تقني شامل ومفتوح المصدر</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 text-balance">
                      المرجع المعتمد لإعداد الأجهزة، إدارة الملفات، وصيانة الأنظمة
                    </h1>

                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-2xl">
                      دليل تفصيلي مجاني يحتوي على خطوات عملية موثوقة لإعداد وحدات التخزين (exFAT)، تسريع الأنظمة، إعادة بناء قواعد البيانات، وتفادي أخطاء ما بعد التحديثات الكبرى.
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setIsChecklistModalOpen(true)}
                        className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-cyan-500 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>فحص الجهاز بعد التحديث</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedCategory('صيانة النظام');
                        }}
                        className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:border-slate-600 hover:text-white transition-colors cursor-pointer"
                      >
                        <Cpu className="h-4 w-4 text-slate-400" />
                        <span>شروحات صيانة النظام</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Catalog Layout */}
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              {/* Tab Header if in Bookmarks Mode */}
              {activeTab === 'bookmarks' && (
                <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/40 p-5 text-right">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
                    <Bookmark className="h-4 w-4 fill-cyan-400" />
                    <span>المقالات المحفوظة للقراءة دون إنترنت</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    شروحاتك المفضلة ({bookmarks.length})
                  </h2>
                  <p className="text-xs text-slate-400">
                    يمكنك الوصول السريع للشروحات التي قمت بحفظها للرجوع إليها لاحقاً أثناء ضبط جهازك.
                  </p>
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Sidebar Navigation & Filters */}
                <Sidebar
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  selectedDifficulty={selectedDifficulty}
                  onSelectDifficulty={setSelectedDifficulty}
                  selectedTag={selectedTag}
                  onSelectTag={setSelectedTag}
                  allTags={allTags}
                  totalGuidesCount={guides.length}
                  categoryCounts={categoryCounts}
                  onOpenChecklistModal={() => setIsChecklistModalOpen(true)}
                />

                {/* Content Grid */}
                <div className="flex-1 w-full space-y-6">
                  {/* Active Filter Bar if applied */}
                  {(selectedCategory !== 'الكل' ||
                    selectedDifficulty !== 'all' ||
                    selectedTag ||
                    searchQuery) && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs text-right">
                      <div className="flex flex-wrap items-center gap-2 text-slate-300">
                        <span className="font-semibold text-slate-400">التصفية النشطة:</span>
                        {selectedCategory !== 'الكل' && (
                          <span className="rounded bg-slate-800 px-2 py-0.5 text-cyan-300">
                            {selectedCategory}
                          </span>
                        )}
                        {selectedDifficulty !== 'all' && (
                          <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300">
                            مستوى: {selectedDifficulty}
                          </span>
                        )}
                        {selectedTag && (
                          <span className="rounded bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5">
                            #{selectedTag}
                          </span>
                        )}
                        {searchQuery && (
                          <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300">
                            البحث: "{searchQuery}"
                          </span>
                        )}
                      </div>

                      <button
                        onClick={resetAllFilters}
                        className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
                      >
                        <FilterX className="h-3.5 w-3.5" />
                        <span>إلغاء التصفية</span>
                      </button>
                    </div>
                  )}

                  {/* Results Count & Section Header */}
                  <div className="flex items-center justify-between text-xs text-slate-400 text-right">
                    <span>
                      عرض{' '}
                      <span className="font-semibold text-white font-mono tabular-nums">
                        {filteredGuides.length}
                      </span>{' '}
                      شرح فني موثق
                    </span>
                    {filteredGuides.length > 0 && (
                      <span className="text-[11px] text-slate-500">
                        مرتبة بحسب الأهمية والأحدث
                      </span>
                    )}
                  </div>

                  {/* Cards Grid */}
                  {filteredGuides.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {filteredGuides.map((guide) => (
                        <GuideCard
                          key={guide.id}
                          guide={guide}
                          onOpenGuide={(g) => setSelectedGuideId(g.id)}
                          isBookmarked={bookmarks.includes(guide.id)}
                          onToggleBookmark={handleToggleBookmark}
                        />
                      ))}
                    </div>
                  ) : (
                    /* Empty State */
                    <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-400">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 mb-3 text-slate-500">
                        <Search className="h-6 w-6" />
                      </div>
                      <h3 className="text-base font-bold text-slate-200 mb-1">
                        لم يتم العثور على شروحات مطابقة
                      </h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                        جرب تغيير الكلمات المفتاحية أو إعادة ضبط فلاتر البحث للعثور على الشرح المطلوب.
                      </p>
                      <button
                        onClick={resetAllFilters}
                        className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        إعادة تعيين الفلاتر
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-800/80 bg-slate-950 py-8 text-right text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-400">
              دليل الأجهزة والنظم التقنية — منصة تعليمية للمستخدمين والمطورين
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              كافة الشروحات والنماذج معدة لأغراض الصيانة الوقائية والاستخدام التعليمي السليم.
            </p>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button
              onClick={() => setActiveTab('about')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              طريقة إضافة مقالات
            </button>
            <button
              onClick={() => setIsChecklistModalOpen(true)}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              قائمة الفحص
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              أعلى الصفحة ↑
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddGuideModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGuide={handleAddGuide}
      />

      <PostUpdateChecklistModal
        isOpen={isChecklistModalOpen}
        onClose={() => setIsChecklistModalOpen(false)}
      />
    </div>
  );
}
