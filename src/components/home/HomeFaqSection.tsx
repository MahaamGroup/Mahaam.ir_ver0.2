import React, { useState } from 'react';
import { ChevronDown, ArrowLeft, HelpCircle } from 'lucide-react';
import { faqData } from '../../content/faq';

interface HomeFaqSectionProps {
  onNavigate: (path: string) => void;
}

export const HomeFaqSection: React.FC<HomeFaqSectionProps> = ({ onNavigate }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const homeFaqs = faqData.slice(0, 4);

  return (
    <section className="py-20 md:py-28 bg-[#F8F6F1] text-[#253244] border-b border-[#BAC3CE]/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0D5A63]">
            <HelpCircle className="w-4 h-4" />
            <span>پاسخ به ابهامات رایج</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0C2340]">
            پرسش‌های متداول
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            پاسخ‌های شفاف به پرتکرارترین پرسش‌های مخاطبان در نقطه آغاز تصمیم‌گیری.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {homeFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-[#BAC3CE]/40 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-right flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-bold text-[#0C2340] leading-snug">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-[#EEF1F3] flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#3658B6] text-white' : 'text-slate-600'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-right border-t border-[#EEF1F3]">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* View all FAQs link */}
        <div className="text-center mt-10">
          <button
            onClick={() => onNavigate('/faq')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#3658B6] hover:text-[#2B4696] transition-colors"
          >
            <span>مشاهده همه پرسش‌ها و پاسخ‌های تفصیلی</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
