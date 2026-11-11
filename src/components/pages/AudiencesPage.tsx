import React from 'react';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { audiencesData } from '../../content/audiences';
import { ArrowLeft, Stethoscope, Scale, Briefcase, Building2, GraduationCap } from 'lucide-react';
import { useDocumentMeta } from '../../lib/useDocumentMeta';

interface AudiencesPageProps {
  onNavigate: (path: string) => void;
}

export const AudiencesPage: React.FC<AudiencesPageProps> = ({ onNavigate }) => {
  useDocumentMeta({
    title: 'گروه‌های مخاطب و حوزه‌های تخصصی',
    description: 'راهکارهای اختصاصی گروه بین‌المللی مهام برای کادر درمان، مدیران ارشد، حقوق‌دانان، صاحبان صنایع و سرمایه‌گذاران، و خانواده‌ها.',
    canonicalPath: '/audiences'
  });
  const getAudienceIcon = (id: string) => {
    switch (id) {
      case 'health':
        return <Stethoscope className="w-6 h-6 text-[#0D5A63]" />;
      case 'law':
        return <Scale className="w-6 h-6 text-[#3658B6]" />;
      case 'management':
        return <Briefcase className="w-6 h-6 text-[#0C2340]" />;
      case 'business':
        return <Building2 className="w-6 h-6 text-[#6DA616]" />;
      case 'specialists':
      default:
        return <GraduationCap className="w-6 h-6 text-[#3658B6]" />;
    }
  };

  return (
    <div className="bg-[#F8F6F1] min-h-screen">
      <Breadcrumbs items={[{ label: 'گروه‌های مخاطب' }]} onNavigate={onNavigate} />

      <section className="bg-gradient-to-b from-[#081525] to-[#0C2340] text-white py-16 md:py-24 border-b border-white/10 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#9FC9E8]">
            <span>شناخت هویت و مسئله مخاطب</span>
            <span aria-hidden="true">·</span>
            <span>Audience Layer</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            شما در کدام گروه قرار می‌گیرید؟
          </h1>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
            ما خدمات یکسان و کلیشه‌ای ارائه نمی‌کنیم؛ ابتدا حوزه تخصصی و واقعیت‌های شغلی شما شناخته می‌شود تا مسیر مناسب مشخص شود.
          </p>
        </div>
      </section>

      {/* Audiences List */}
      <section className="py-16 md:py-24 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {audiencesData.map((aud) => (
              <div
                key={aud.id}
                className="bg-white rounded-3xl p-8 border border-[#BAC3CE]/40 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF1F3] flex items-center justify-center group-hover:bg-[#9FC9E8]/20 transition-colors">
                      {getAudienceIcon(aud.id)}
                    </div>
                    <span className="text-xs font-semibold text-[#0D5A63]">
                      {aud.decisionStage.split(' ')[0]}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#0C2340] group-hover:text-[#3658B6] transition-colors">
                    {aud.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {aud.heroSubheadline}
                  </p>

                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-2">مخاطبان هدف:</span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {aud.targetPersonas.slice(0, 3).map((p, pIdx) => (
                        <li key={pIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3658B6]" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#EEF1F3] flex items-center justify-between">
                  <button
                    onClick={() => onNavigate(`/audiences/${aud.slug}`)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#3658B6] group-hover:text-[#2B4696]"
                  >
                    <span>{aud.primaryCtaText}</span>
                    <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Assessment Callout */}
          <div className="bg-[#0C2340] rounded-3xl p-8 md:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-right">
              <h3 className="text-xl font-bold">نمی‌دانید از کدام گروه شروع کنید؟</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                ابزار ارزیابی و تصمیم گروه مهام ظرف ۳ دقیقه جایگاه و مسیر بهینه شما را مشخص می‌کند.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/decision-engine')}
              className="px-6 py-3.5 text-xs font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] rounded-xl shrink-0 transition-colors"
            >
              شروع ارزیابی هوشمند
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
