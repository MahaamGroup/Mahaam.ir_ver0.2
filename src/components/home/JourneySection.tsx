import React from 'react';
import { ArrowLeft, Compass, Globe2, Building, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { journeysData } from '../../content/journeys';

interface JourneySectionProps {
  onNavigate: (path: string) => void;
}

export const JourneySection: React.FC<JourneySectionProps> = ({ onNavigate }) => {
  const getJourneyIcon = (slug: string) => {
    switch (slug) {
      case 'discovery':
        return <Compass className="w-5 h-5 text-[#3658B6]" />;
      case 'experience':
        return <Globe2 className="w-5 h-5 text-[#0D5A63]" />;
      case 'development':
        return <Building className="w-5 h-5 text-[#0C2340]" />;
      case 'growth':
      default:
        return <TrendingUp className="w-5 h-5 text-[#6DA616]" />;
    }
  };

  return (
    <section className="py-20 md:py-28 bg-[#F8F6F1] text-[#253244] border-b border-[#BAC3CE]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0D5A63]">
            <span>بخش دوم: مسیرهای راهبردی</span>
            <span aria-hidden="true">·</span>
            <span>Journey Layer</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0C2340]">
            مسیر شما از کجا شروع می‌شود؟
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            به جای گم شدن در فهرست‌های طویل خدمات، در یکی از ۴ مسیر ساختاریافته بین‌المللی گام بردارید.
          </p>
        </div>

        {/* 4 Journey Cards Grid with sequential flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {journeysData.map((journey, idx) => (
            <motion.div
              key={journey.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-7 border border-[#BAC3CE]/40 shadow-sm hover:shadow-xl hover:border-[#3658B6]/50 transition-colors flex flex-col justify-between text-right group relative"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF1F3] flex items-center justify-center group-hover:bg-[#9FC9E8]/20 transition-colors">
                    {getJourneyIcon(journey.slug)}
                  </div>
                  <span className="text-xs font-bold font-sans text-slate-400 group-hover:text-[#3658B6]">
                    ۰{idx + 1}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] text-[#0D5A63] font-medium block">
                    {journey.stageBadge.split(':')[0]}
                  </span>
                  <h3 className="text-lg font-bold text-[#0C2340] group-hover:text-[#3658B6] transition-colors leading-snug">
                    {journey.shortTitle}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {journey.heroSubheadline}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#EEF1F3]">
                <button
                  onClick={() => onNavigate(`/journeys/${journey.slug}`)}
                  className="w-full inline-flex items-center justify-between text-xs font-semibold text-[#0C2340] group-hover:text-[#3658B6] transition-colors cursor-pointer"
                >
                  <span>{journey.primaryCtaText.replace('آغاز ', '').replace('درخواست ', '').replace('بررسی ', '')}</span>
                  <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Journey Bottom Action Link */}
        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('/journeys')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#3658B6] hover:text-[#2B4696] transition-colors cursor-pointer"
          >
            <span>مشاهده نقشه جامع و مقایسه تفصیلی همه مسیرها</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
