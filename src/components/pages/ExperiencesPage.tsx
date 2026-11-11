import React from 'react';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { experiencesData } from '../../content/experiences';
import { ArrowLeft, Quote, CheckCircle2, Compass } from 'lucide-react';
import { useDocumentMeta } from '../../lib/useDocumentMeta';

interface ExperiencesPageProps {
  onNavigate: (path: string) => void;
}

export const ExperiencesPage: React.FC<ExperiencesPageProps> = ({ onNavigate }) => {
  useDocumentMeta({
    title: 'تجربه‌های واقعی و مطالعات موردی',
    description: 'روایت‌های مستند از پزشکان، مدیران ارشد و حقوق‌دانانی که مسیر تطبیق بین‌المللی خود را با گروه مهام پیموده‌اند.',
    canonicalPath: '/experiences'
  });
  return (
    <div className="bg-[#F8F6F1] min-h-screen">
      <Breadcrumbs items={[{ label: 'تجربه‌های واقعی' }]} onNavigate={onNavigate} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#081525] to-[#0C2340] text-white py-16 md:py-24 border-b border-white/10 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#9FC9E8]">
            <span>روایت‌های واقعی و مستند</span>
            <span aria-hidden="true">·</span>
            <span>Verified Case Studies</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            تجربه‌های بین‌المللی؛ گذار از تردید به شفافیت
          </h1>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
            روایت مستند متخصصان، وکلا، مدیران و کارآفرینانی که با رویکرد تحلیلی گروه مهام، مسیرهای بین‌المللی خود را سنجیده و پایه‌ریزی کردند.
          </p>
        </div>
      </section>

      {/* Stories List */}
      <section className="py-16 md:py-24 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {experiencesData.map((exp, idx) => (
            <div
              key={exp.id}
              className="bg-white rounded-3xl p-8 sm:p-12 border border-[#BAC3CE]/40 shadow-sm space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EEF1F3] pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#0D5A63] bg-[#EEF1F3] px-3 py-1 rounded-full">
                    {exp.field}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {exp.persona}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-sans">
                  پرونده شماره ۰{idx + 1}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#0C2340] leading-snug">
                {exp.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="space-y-2 p-5 rounded-2xl bg-[#F8F6F1] border border-[#BAC3CE]/30">
                  <span className="text-xs font-bold text-[#0C2340] block">۱. موقعیت اولیه و دغدغه</span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {exp.initialSituation}
                  </p>
                </div>

                <div className="space-y-2 p-5 rounded-2xl bg-[#EEF1F3] border border-[#BAC3CE]/30">
                  <span className="text-xs font-bold text-[#3658B6] block">۲. فرآیند ارزیابی و تجربه</span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {exp.explorationPhase}
                  </p>
                </div>

                <div className="space-y-2 p-5 rounded-2xl bg-[#F8F6F1] border border-[#BAC3CE]/30">
                  <span className="text-xs font-bold text-[#6DA616] block">۳. تصمیم و نتیجه ملموس</span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {exp.decisionMade}
                  </p>
                </div>
              </div>

              {/* Reflection Quote */}
              <div className="p-6 rounded-2xl bg-[#081525] text-white flex items-start gap-4">
                <Quote className="w-8 h-8 text-[#9FC9E8] shrink-0 rotate-180 opacity-60 mt-1" />
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                    {exp.reflection}
                  </p>
                  <span className="text-[11px] text-[#9FC9E8] font-medium block pt-1">
                    — {exp.persona}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Bottom Banner */}
          <div className="bg-[#0C2340] rounded-3xl p-8 md:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-right">
              <h3 className="text-xl font-bold">می‌خواهید تجربه مشابهی را برای شرایط خود رقم بزنید؟</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                ارزیابی اولیه گام نخست برای شناخت شفاف گزینه‌های پیش روی شماست.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/decision-engine')}
              className="px-6 py-3.5 text-xs font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] rounded-xl shrink-0 transition-colors cursor-pointer"
            >
              شروع ارزیابی شرایط من
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
