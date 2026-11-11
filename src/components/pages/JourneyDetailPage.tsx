import React from 'react';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { JourneyItem } from '../../types';
import { ArrowLeft, CheckCircle2, AlertCircle, Compass, ListOrdered, CheckSquare } from 'lucide-react';
import { useDocumentMeta } from '../../lib/useDocumentMeta';

interface JourneyDetailPageProps {
  journey: JourneyItem;
  onNavigate: (path: string) => void;
}

export const JourneyDetailPage: React.FC<JourneyDetailPageProps> = ({ journey, onNavigate }) => {
  useDocumentMeta({
    title: `${journey.title} | مسیرهای اقدام مهام`,
    description: journey.heroDescription,
    canonicalPath: `/journeys/${journey.slug}`
  });
  return (
    <div className="bg-[#F8F6F1] min-h-screen">
      <Breadcrumbs
        items={[
          { label: 'مسیرهای بین‌المللی', path: '/journeys' },
          { label: journey.title }
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#081525] to-[#0C2340] text-white py-16 md:py-24 border-b border-white/10 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#9FC9E8]">
            <Compass className="w-4 h-4" />
            <span>{journey.stageBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            {journey.heroHeadline}
          </h1>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-3xl">
            {journey.heroSubheadline}
          </p>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            {journey.heroDescription}
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs text-slate-400">
            <span>مخاطب اصلی:</span>
            <span className="text-white font-medium">{journey.targetAudience}</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => onNavigate('/decision-engine')}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              <span>{journey.primaryCtaText}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/contact')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <span>{journey.secondaryCtaText}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 md:py-20 border-b border-[#BAC3CE]/40 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <span className="text-xs font-semibold text-[#0D5A63] block">هدف راهبردی</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
            {journey.overviewTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-3xl">
            {journey.overviewDescription}
          </p>
        </div>
      </section>

      {/* Steps Timeline Section */}
      <section className="py-16 md:py-20 bg-[#EEF1F3] border-b border-[#BAC3CE]/40 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-semibold text-[#0D5A63] block mb-1">فرآیند اجرایی</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
              مراحل گام‌به‌گام این مسیر
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {journey.steps.map((st, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-7 border border-[#BAC3CE]/40 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-sans text-white bg-[#0C2340] px-2.5 py-1 rounded-md">
                      گام {st.stepNumber}
                    </span>
                    <span className="text-xs text-slate-400">مرحله {idx + 1} از ۴</span>
                  </div>

                  <h3 className="text-base font-bold text-[#0C2340]">
                    {st.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {st.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suitability & Considerations Section */}
      <section className="py-16 md:py-20 border-b border-[#BAC3CE]/40 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Suitable For */}
            <div className="bg-white rounded-2xl p-7 border border-[#BAC3CE]/40 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#0D5A63] font-bold">
                <CheckSquare className="w-5 h-5 text-[#6DA616]" />
                <h3 className="text-lg">این مسیر برای چه کسانی مناسب است؟</h3>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                {journey.suitability.suitableFor.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6DA616] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Considerations */}
            <div className="bg-white rounded-2xl p-7 border border-[#BAC3CE]/40 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#0C2340] font-bold">
                <AlertCircle className="w-5 h-5 text-[#3658B6]" />
                <h3 className="text-lg">ملاحظات و پیش‌شرط‌ها</h3>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                {journey.suitability.considerations.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3658B6] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Expected Outcomes */}
      <section className="py-16 md:py-20 bg-white border-b border-[#BAC3CE]/40 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs font-semibold text-[#0D5A63] block">ارزش عینی</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
            دستاوردهای مورد انتظار این سفر
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {journey.expectedOutcomes.map((out, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-[#F8F6F1] border border-[#BAC3CE]/30">
                <CheckCircle2 className="w-5 h-5 text-[#6DA616] shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-slate-800">{out}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specific FAQ Section */}
      {journey.faqs.length > 0 && (
        <section className="py-16 md:py-20 bg-[#EEF1F3] border-b border-[#BAC3CE]/40 text-right">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div>
              <span className="text-xs font-semibold text-[#0D5A63] block mb-1">پرسش‌های ویژه مسیر</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
                پرسش‌های متداول {journey.shortTitle}
              </h2>
            </div>

            <div className="space-y-4">
              {journey.faqs.map((f, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-[#BAC3CE]/30 space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#0C2340]">{f.question}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final Journey CTA */}
      <section className="py-16 md:py-20 bg-[#0C2340] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold">{journey.finalCta.headline}</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{journey.finalCta.description}</p>
          <div className="pt-3">
            <button
              onClick={() => onNavigate('/decision-engine')}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-xs font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              <span>{journey.finalCta.buttonText}</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
