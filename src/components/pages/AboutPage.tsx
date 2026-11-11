import React from 'react';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { aboutData } from '../../content/about';
import { ArrowLeft, ShieldCheck, Target, Layers, Users, CheckCircle2, Award, Briefcase, Globe2 } from 'lucide-react';
import { useDocumentMeta } from '../../lib/useDocumentMeta';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  useDocumentMeta({
    title: 'درباره ما | هویت، رویکرد و سوابق سازمانی',
    description: 'آشنایی با گروه بین‌المللی مهام؛ پیشرو در تطبیق صلاحیت بین‌المللی، سابقه ۹ دوره اعزام هیئت‌های تخصصی حقوقی به لاهه و مجوز سازمان توسعه تجارت.',
    canonicalPath: '/about'
  });
  return (
    <div className="bg-[#F8F6F1] min-h-screen">
      <Breadcrumbs items={[{ label: 'درباره گروه مهام' }]} onNavigate={onNavigate} />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#081525] to-[#0C2340] text-white py-16 md:py-24 border-b border-white/10 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#9FC9E8]">
            <span>هویت، رویکرد و سوابق سازمانی</span>
            <span aria-hidden="true">·</span>
            <span>About Mahaam</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            {aboutData.hero.h1}
          </h1>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-3xl">
            {aboutData.hero.subheadline}
          </p>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            {aboutData.hero.description}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => onNavigate('/decision-engine')}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              <span>{aboutData.hero.ctaSecondary}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <span>{aboutData.hero.ctaPrimary}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Origin Section */}
      <section className="py-16 md:py-24 border-b border-[#BAC3CE]/40 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#BAC3CE]/40 shadow-sm space-y-4">
            <span className="text-xs font-semibold text-[#0D5A63] block">ریشه شکل‌گیری</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
              {aboutData.origin.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {aboutData.origin.description}
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="py-16 md:py-24 bg-[#EEF1F3] border-b border-[#BAC3CE]/40 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-semibold text-[#0D5A63] block">نگاه گروه مهام</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
              {aboutData.principlesSection.h2}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {aboutData.principlesSection.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aboutData.principlesSection.items.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-7 border border-[#BAC3CE]/40 shadow-sm space-y-3"
              >
                <div className="w-9 h-9 rounded-xl bg-[#EEF1F3] flex items-center justify-center text-[#3658B6]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0C2340]">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Track Record Section (From Live mahaam.ir/fa) */}
      <section className="py-16 md:py-24 border-b border-[#BAC3CE]/40 text-right bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0D5A63]">
              <Briefcase className="w-4 h-4" />
              <span>پروژه‌ها و تجارب عینی</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
              {aboutData.trackRecord.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {aboutData.trackRecord.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aboutData.trackRecord.projects.map((proj, idx) => (
              <div 
                key={idx}
                className="p-7 rounded-2xl bg-[#F8F6F1] border border-[#BAC3CE]/40 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <span className="text-[11px] font-sans font-bold text-[#3658B6] bg-white px-3 py-1 rounded-full border border-slate-200 inline-block">
                    {proj.stats}
                  </span>
                  <h3 className="text-base font-bold text-[#0C2340] leading-snug">
                    {proj.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {proj.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#BAC3CE]/30 text-[11px] text-[#0D5A63] font-medium flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 shrink-0" />
                  <span>مقاصد: {proj.destinations}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Credentials & Licenses Section */}
      <section className="py-16 md:py-24 bg-[#EEF1F3] border-b border-[#BAC3CE]/40 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#6DA616]">
              <Award className="w-4 h-4 text-[#6DA616]" />
              <span>اعتبارنامه و صلاحیت‌های حاکمیتی</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
              {aboutData.institutionalCredentials.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {aboutData.institutionalCredentials.items.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-6 border border-[#BAC3CE]/40 shadow-sm flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-[#6DA616] mt-0.5 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Mahaam Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 border-b border-[#BAC3CE]/40 text-right bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-semibold text-[#0D5A63] block">فرآیند عملیاتی</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
              {aboutData.howMahaamWorks.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {aboutData.howMahaamWorks.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aboutData.howMahaamWorks.steps.map((step, idx) => (
              <div 
                key={idx}
                className="bg-[#F8F6F1] rounded-2xl p-7 border border-[#BAC3CE]/40 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold font-sans text-white bg-[#0C2340] px-2.5 py-1 rounded-md inline-block">
                    {step.number}
                  </span>
                  <h3 className="text-base font-bold text-[#0C2340]">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Credibility Section */}
      <section className="py-16 md:py-24 bg-[#EEF1F3] border-b border-[#BAC3CE]/40 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-semibold text-[#0D5A63] block">تعهد به اخلاق حرفه‌ای</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
              {aboutData.trustAndCredibility.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {aboutData.trustAndCredibility.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aboutData.trustAndCredibility.pillars.map((pil, idx) => (
              <div 
                key={idx}
                className="p-7 rounded-2xl bg-white border border-[#BAC3CE]/40 space-y-2.5"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-[#0C2340]">
                  <ShieldCheck className="w-5 h-5 text-[#6DA616] shrink-0" />
                  <h3>{pil.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pr-7">
                  {pil.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final About CTA */}
      <section className="py-16 md:py-20 bg-[#0C2340] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold">آینده بهتر با شناخت بهتر آغاز می‌شود.</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            اگر در حال سبک‌سنگین کردن یک تصمیم بزرگ هستید، ما آماده‌ایم در کنار شما به بررسی گزینه‌های واقعی بپردازیم.
          </p>
          <div className="pt-3">
            <button
              onClick={() => onNavigate('/decision-engine')}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-xs font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              <span>شروع ارزیابی مسیر</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
