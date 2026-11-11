import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { faqData } from '../../content/faq';
import { HelpCircle, ChevronDown, ArrowLeft, Search, X, MessageSquareQuote } from 'lucide-react';
import { useDocumentMeta } from '../../lib/useDocumentMeta';

interface FaqPageProps {
  onNavigate: (path: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ 'faq-1': true });

  useDocumentMeta({
    title: 'پرسش‌های متداول و دغدغه‌های تصمیم',
    description: 'پاسخ‌های شفاف، حقوقی و بدون ابهام به سوالات متداول درباره مهاجرت کادر درمان، دوره‌های لاهه، ثبت شرکت و ارزیابی شایستگی در گروه مهام.',
    canonicalPath: '/faq'
  });

  const toggleFaq = (id: string) => {
    setOpenIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { id: 'all', label: 'همه پرسش‌ها' },
    { id: 'general', label: 'رویکرد عمومی گروه مهام' },
    { id: 'audiences', label: 'گروه‌های مخاطب' },
    { id: 'journeys', label: 'مسیرهای بین‌المللی' },
    { id: 'decision', label: 'موتور تصمیم‌گیری' },
    { id: 'contact', label: 'ارتباط و مشاوره' },
  ];

  const filteredFaqs = useMemo(() => {
    return faqData.filter((faq) => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      if (!searchQuery.trim()) {
        return matchesCategory;
      }

      const q = searchQuery.toLowerCase().trim();
      const inQuestion = faq.question.toLowerCase().includes(q);
      const inAnswer = faq.answer.toLowerCase().includes(q);

      return matchesCategory && (inQuestion || inAnswer);
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="bg-[#F8F6F1] min-h-screen">
      <Breadcrumbs items={[{ label: 'پرسش‌های متداول' }]} onNavigate={onNavigate} />

      <section className="bg-gradient-to-b from-[#081525] to-[#0C2340] text-white py-16 md:py-20 border-b border-white/10 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#9FC9E8]">
            <HelpCircle className="w-4 h-4" />
            <span>پاسخ به ابهامات رایج</span>
            <span aria-hidden="true">·</span>
            <span>Mahaam Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            پرسش‌های متداول و دغدغه‌های تصمیم
          </h1>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
            پاسخ‌های شفاف و بدون ابهام به سوالاتی که پیش از ورود به هر تصمیم بین‌المللی با آن مواجه می‌شوید.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 text-right">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Search Index Bar */}
          <div className="bg-white rounded-3xl p-5 border border-[#BAC3CE]/40 shadow-sm space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در پرسش‌ها و پاسخ‌ها (مثلاً تضمین، لاهه، پزشکان، هزینه)..."
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

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#EEF1F3]">
              <div className="flex flex-wrap items-center gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-[#0C2340] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-[#EEF1F3] hover:text-[#0C2340]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-500 font-medium self-end sm:self-auto">
                <span>نمایش {filteredFaqs.length} از {faqData.length} پرسش</span>
              </div>
            </div>
          </div>

          {/* FAQ Accordion List or Empty State */}
          {filteredFaqs.length > 0 ? (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = !!openIds[faq.id];
                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl border border-[#BAC3CE]/40 overflow-hidden shadow-sm transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-6 text-right flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <MessageSquareQuote className="w-4 h-4 text-[#3658B6] shrink-0 hidden sm:block" />
                        <span className="text-sm sm:text-base font-bold text-[#0C2340] leading-snug">
                          {faq.question}
                        </span>
                      </div>
                      <div className={`w-8 h-8 rounded-full bg-[#EEF1F3] flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#3658B6] text-white' : 'text-slate-600'}`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 text-right border-t border-[#EEF1F3]">
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 border border-[#BAC3CE]/40 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF1F3] text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0C2340]">پرسشی با عبارت مورد نظر پیدا نشد</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                می‌توانید عبارت جستجو را ویرایش کنید یا پرسش اختصاصی خود را با کارشناسان گروه مهام در میان بگذارید.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-4 py-2 bg-[#EEF1F3] hover:bg-[#BAC3CE]/40 text-[#0C2340] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  نمایش همه پرسش‌ها
                </button>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="px-4 py-2 bg-[#0C2340] hover:bg-[#3658B6] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  ارسال پرسش در فرم ارتباط
                </button>
              </div>
            </div>
          )}

          {/* Still Have Questions Banner */}
          <div className="bg-[#0C2340] rounded-3xl p-8 md:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-right">
              <h3 className="text-lg sm:text-xl font-bold">پاسخ سوال خود را پیدا نکردید؟</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                کارشناسان گروه مهام آماده پاسخ‌گویی به شرایط و پرسش‌های منحصربه‌فرد شما هستند.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/contact')}
              className="px-6 py-3.5 text-xs font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] rounded-xl shrink-0 transition-colors cursor-pointer shadow-sm"
            >
              طرح پرسش در فرم ارتباط
            </button>
          </div>

        </div>
      </section>
    </div>
  );
};
