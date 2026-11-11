import React from 'react';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { AudienceItem } from '../../types';
import { ArrowLeft, CheckCircle2, AlertCircle, Compass, HelpCircle } from 'lucide-react';
import { useDocumentMeta } from '../../lib/useDocumentMeta';

interface AudienceDetailPageProps {
  audience: AudienceItem;
  onNavigate: (path: string) => void;
}

export const AudienceDetailPage: React.FC<AudienceDetailPageProps> = ({ audience, onNavigate }) => {
  useDocumentMeta({
    title: `${audience.title} | راهکارهای اختصاصی گروه مهام`,
    description: audience.heroDescription,
    canonicalPath: `/audiences/${audience.slug}`
  });
  return (
    <div className="bg-[#F8F6F1] min-h-screen">
      <Breadcrumbs 
        items={[
          { label: 'گروه‌های مخاطب', path: '/audiences' },
          { label: audience.title }
        ]} 
        onNavigate={onNavigate} 
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#081525] to-[#0C2340] text-white py-16 md:py-24 border-b border-white/10 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#9FC9E8]">
            <span>مخاطب اختصاصی</span>
            <span aria-hidden="true">·</span>
            <span>{audience.decisionStage}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            {audience.heroHeadline}
          </h1>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-3xl">
            {audience.heroSubheadline}
          </p>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            {audience.heroDescription}
          </p>

          {/* Target Personas */}
          <div className="pt-4 border-t border-white/10">
            <span className="block text-xs font-semibold text-[#9FC9E8] mb-3">
              جامعه هدف این مسیر:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {audience.targetPersonas.map((persona, idx) => (
                <div 
                  key={idx}
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6DA616]" />
                  <span>{persona}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => onNavigate('/decision-engine')}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] rounded-xl shadow-lg transition-colors"
            >
              <span>{audience.primaryCtaText}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/contact')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
            >
              <span>{audience.secondaryCtaText}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-16 md:py-20 border-b border-[#BAC3CE]/40 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-semibold text-[#0D5A63] block mb-1">تحلیل نیازها</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
              {audience.challengesTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {audience.challenges.map((ch, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl p-6 border border-[#BAC3CE]/40 shadow-sm space-y-2.5"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-[#0C2340]">
                  <AlertCircle className="w-4 h-4 text-[#3658B6] shrink-0" />
                  <h3>{ch.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pr-6">
                  {ch.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-16 md:py-20 bg-[#EEF1F3] border-b border-[#BAC3CE]/40 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-semibold text-[#0D5A63] block mb-1">فرآیند گام‌به‌گام</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
              {audience.approachTitle}
            </h2>
          </div>

          <div className="space-y-4">
            {audience.approachSteps.map((st, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-6 border border-[#BAC3CE]/40 shadow-sm flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-[#0C2340] text-white text-xs font-bold font-sans flex items-center justify-center shrink-0 mt-0.5">
                  ۰{idx + 1}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#0C2340]">{st.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{st.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Relevant Journeys */}
      <section className="py-16 md:py-20 border-b border-[#BAC3CE]/40 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-semibold text-[#0D5A63] block mb-1">مسیرهای مرتبط</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
              مسیرهای پیشنهادی برای این گروه
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {audience.relevantJourneys.map((j, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-6 border border-[#BAC3CE]/40 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF1F3] flex items-center justify-center text-[#3658B6] mb-3">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0C2340]">{j.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{j.description}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#EEF1F3]">
                  <button
                    onClick={() => onNavigate(`/journeys/${j.slug}`)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#3658B6] hover:text-[#2B4696]"
                  >
                    <span>بررسی این مسیر</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specific FAQ Section */}
      {audience.faqs.length > 0 && (
        <section className="py-16 md:py-20 bg-white border-b border-[#BAC3CE]/40 text-right">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div>
              <span className="text-xs font-semibold text-[#0D5A63] block mb-1">پرسش‌های ویژه</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
                پرسش‌های متداول {audience.shortTitle}
              </h2>
            </div>

            <div className="space-y-4">
              {audience.faqs.map((f, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#F8F6F1] border border-[#BAC3CE]/30 space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#0C2340]">{f.question}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final Audience CTA */}
      <section className="py-16 md:py-20 bg-[#0C2340] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold">{audience.finalCta.headline}</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{audience.finalCta.description}</p>
          <div className="pt-3">
            <button
              onClick={() => onNavigate('/decision-engine')}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-xs font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] rounded-xl shadow-lg transition-colors"
            >
              <span>{audience.finalCta.buttonText}</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
