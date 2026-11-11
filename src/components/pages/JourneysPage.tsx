import React from 'react';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { journeysData } from '../../content/journeys';
import { ArrowLeft, Compass, Globe2, Building, TrendingUp } from 'lucide-react';
import { useDocumentMeta } from '../../lib/useDocumentMeta';

interface JourneysPageProps {
  onNavigate: (path: string) => void;
}

export const JourneysPage: React.FC<JourneysPageProps> = ({ onNavigate }) => {
  useDocumentMeta({
    title: 'مسیرهای بین‌المللی و چارچوب‌های اقدام',
    description: '۴ مسیر هدایت‌شده برای ورود قانونمند و ساختاریافته به سیستم‌های بین‌المللی سلامت، رهبری، حقوق و مشارکت تجاری.',
    canonicalPath: '/journeys'
  });
  const getJourneyIcon = (slug: string) => {
    switch (slug) {
      case 'discovery':
        return <Compass className="w-6 h-6 text-[#3658B6]" />;
      case 'experience':
        return <Globe2 className="w-6 h-6 text-[#0D5A63]" />;
      case 'development':
        return <Building className="w-6 h-6 text-[#0C2340]" />;
      case 'growth':
      default:
        return <TrendingUp className="w-6 h-6 text-[#6DA616]" />;
    }
  };

  return (
    <div className="bg-[#F8F6F1] min-h-screen">
      <Breadcrumbs items={[{ label: 'مسیرهای بین‌المللی' }]} onNavigate={onNavigate} />

      <section className="bg-gradient-to-b from-[#081525] to-[#0C2340] text-white py-16 md:py-24 border-b border-white/10 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#9FC9E8]">
            <span>نقشه جامع تصمیم‌گیری</span>
            <span aria-hidden="true">·</span>
            <span>Journey Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            مسیرهای ۴ گانه گروه بین‌المللی مهام
          </h1>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
            ما به جای ارائه منویی نامنسجم از خدمات پراکنده، شما را در یک پیوستار ساختاریافته از کشف تا رشد قرار می‌دهیم.
          </p>
        </div>
      </section>

      {/* Journeys Grid */}
      <section className="py-16 md:py-24 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {journeysData.map((journey, idx) => (
              <div
                key={journey.id}
                className="bg-white rounded-3xl p-8 border border-[#BAC3CE]/40 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF1F3] flex items-center justify-center group-hover:bg-[#9FC9E8]/20 transition-colors">
                      {getJourneyIcon(journey.slug)}
                    </div>
                    <span className="text-xs font-bold font-sans text-slate-400">
                      مرحله ۰{idx + 1}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-[#0D5A63] block">
                    {journey.stageBadge}
                  </span>

                  <h2 className="text-xl font-bold text-[#0C2340] group-hover:text-[#3658B6] transition-colors">
                    {journey.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {journey.heroSubheadline}
                  </p>

                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-2">مراحل اصلی:</span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {journey.steps.map((s, sIdx) => (
                        <li key={sIdx} className="flex items-center gap-2">
                          <span className="text-[11px] font-sans font-bold text-[#3658B6]">{s.stepNumber}</span>
                          <span>{s.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#EEF1F3] flex items-center justify-between">
                  <button
                    onClick={() => onNavigate(`/journeys/${journey.slug}`)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#3658B6] group-hover:text-[#2B4696]"
                  >
                    <span>بررسی جزئیات این مسیر</span>
                    <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Assessment Trigger Banner */}
          <div className="bg-[#0C2340] rounded-3xl p-8 md:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-right">
              <h3 className="text-xl font-bold">می‌خواهید بدانید کدام سفر متناسب با شماست؟</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                ابزار ارزیابی تصمیم گروه مهام شرایط شما را سنجیده و مسیر بهینه شروع را پیشنهاد می‌کند.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/decision-engine')}
              className="px-6 py-3.5 text-xs font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] rounded-xl shrink-0 transition-colors cursor-pointer"
            >
              شروع ارزیابی مسیر من
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
