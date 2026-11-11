import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { insightsData } from '../../content/insights';
import { ArrowLeft, BookOpen, Clock, Calendar, CheckCircle2, Search, X, Tag } from 'lucide-react';
import { useDocumentMeta } from '../../lib/useDocumentMeta';

interface InsightsPageProps {
  onNavigate: (path: string) => void;
  selectedArticleSlug?: string;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ onNavigate, selectedArticleSlug }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const selectedArticle = selectedArticleSlug 
    ? insightsData.find(a => a.slug === selectedArticleSlug)
    : null;

  // Dynamic SEO Metadata for individual article or overview
  useDocumentMeta(
    selectedArticle
      ? {
          title: selectedArticle.title,
          description: selectedArticle.excerpt,
          canonicalPath: `/insights/${selectedArticle.slug}`,
          ogType: 'article'
        }
      : {
          title: 'بینش‌ها و تحلیل‌های راهبردی',
          description: 'مجموعه تحلیل‌ها و یادداشت‌های تخصصی گروه بین‌المللی مهام در حوزه تصمیم‌گیری، سیستم‌های سلامت و توسعه فرامرزی.',
          canonicalPath: '/insights'
        }
  );

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(insightsData.map(a => a.category)));
    return ['همه دسته‌ها', ...cats];
  }, []);

  // Filtered insights based on search and category
  const filteredArticles = useMemo(() => {
    return insightsData.filter((article) => {
      const matchesCategory = selectedCategory === 'همه دسته‌ها' || selectedCategory === 'all' 
        ? true 
        : article.category === selectedCategory;

      if (!searchQuery.trim()) {
        return matchesCategory;
      }

      const q = searchQuery.toLowerCase().trim();
      const inTitle = article.title.toLowerCase().includes(q);
      const inExcerpt = article.excerpt.toLowerCase().includes(q);
      const inCategory = article.category.toLowerCase().includes(q);
      const inContent = article.content.some(p => p.toLowerCase().includes(q));
      const inKeyTakeaways = article.keyTakeaways.some(k => k.toLowerCase().includes(q));

      return matchesCategory && (inTitle || inExcerpt || inCategory || inContent || inKeyTakeaways);
    });
  }, [searchQuery, selectedCategory]);

  if (selectedArticle) {
    return (
      <div className="bg-[#F8F6F1] min-h-screen">
        <Breadcrumbs
          items={[
            { label: 'بینش‌ها و تحلیل‌ها', path: '/insights' },
            { label: selectedArticle.title }
          ]}
          onNavigate={onNavigate}
        />

        <article className="py-16 md:py-24 text-right">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="text-[#0D5A63] font-semibold bg-[#0D5A63]/10 px-2.5 py-1 rounded-md">{selectedArticle.category}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedArticle.readTime}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedArticle.publishDate}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0C2340] leading-tight">
                {selectedArticle.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed border-r-2 border-[#3658B6] pr-4">
                {selectedArticle.excerpt}
              </p>
            </div>

            {/* Key Takeaways Box */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#EEF1F3] border border-[#BAC3CE]/40 space-y-3">
              <span className="text-xs font-bold text-[#0C2340] block">نکات کلیدی این تحلیل:</span>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {selectedArticle.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#6DA616] mt-0.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Article Content Paragraphs */}
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-loose">
              {selectedArticle.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Related Journey Link */}
            {selectedArticle.relatedJourneySlug && (
              <div className="pt-8 border-t border-[#BAC3CE]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => onNavigate(`/journeys/${selectedArticle.relatedJourneySlug}`)}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#3658B6] hover:text-[#2B4696] cursor-pointer"
                >
                  <span>مشاهده مسیر مرتبط با این تحلیل</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onNavigate('/insights')}
                  className="text-xs text-slate-500 hover:text-[#0C2340] cursor-pointer"
                >
                  بازگشت به فهرست مقالات
                </button>
              </div>
            )}

          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F6F1] min-h-screen">
      <Breadcrumbs items={[{ label: 'بینش‌ها و تحلیل‌ها' }]} onNavigate={onNavigate} />

      <section className="bg-gradient-to-b from-[#081525] to-[#0C2340] text-white py-16 md:py-20 border-b border-white/10 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#9FC9E8]">
            <BookOpen className="w-4 h-4" />
            <span>اتاق فکر و تحلیل راهبردی</span>
            <span aria-hidden="true">·</span>
            <span>Mahaam Insights</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            بینش‌ها، تحلیل‌ها و جایگاه فکری
          </h1>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
            مجموعه یادداشت‌های تحلیلی پیرامون الگوهای تصمیم‌گیری، سیستم‌های سلامت، بازارهای بین‌المللی و قواعد پایداری حضور فرامرزی.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Search and Filter Index Bar */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#BAC3CE]/40 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجو در عنوان، موضوع، یا متن مقالات تحلیلی..."
                  className="w-full pl-10 pr-10 py-3 bg-[#F8F6F1] rounded-2xl border border-transparent focus:border-[#3658B6] focus:bg-white focus:outline-none text-xs sm:text-sm text-slate-800 transition-all text-right"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="پاک کردن جستجو"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Match Counter Badge */}
              <div className="flex items-center gap-2 self-end md:self-auto text-xs text-slate-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#6DA616]" />
                <span>نمایش {filteredArticles.length} از {insightsData.length} مقاله</span>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#EEF1F3]">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 ml-1">
                <Tag className="w-3 h-3" />
                <span>دسته‌بندی:</span>
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0C2340] text-white shadow-xs'
                      : 'bg-[#EEF1F3] text-slate-600 hover:bg-[#BAC3CE]/30 hover:text-[#0C2340]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid or Empty State */}
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  className="bg-white rounded-3xl p-7 border border-[#BAC3CE]/40 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-[#0D5A63] bg-[#0D5A63]/10 px-2 py-0.5 rounded-md">{art.category}</span>
                      <span>{art.readTime}</span>
                    </div>

                    <h2 className="text-lg font-bold text-[#0C2340] group-hover:text-[#3658B6] transition-colors leading-snug">
                      {art.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#EEF1F3] flex items-center justify-between">
                    <button
                      onClick={() => onNavigate(`/insights/${art.slug}`)}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[#3658B6] group-hover:text-[#2B4696] cursor-pointer"
                    >
                      <span>مطالعه تحلیل کامل</span>
                      <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <span className="text-[11px] text-slate-400">{art.publishDate}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-[#BAC3CE]/40 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF1F3] text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0C2340]">مقاله‌ای با عبارت جستجو شده یافت نشد</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                می‌توانید عبارت دیگری جستجو کنید یا فیلتر دسته‌بندی را بر روی «همه دسته‌ها» تنظیم نمایید.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('همه دسته‌ها');
                }}
                className="px-4 py-2 bg-[#0C2340] hover:bg-[#3658B6] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                پاکسازی فیلترها و مشاهده همه
              </button>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};
