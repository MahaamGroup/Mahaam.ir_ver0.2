import React from 'react';
import { ArrowLeft, Stethoscope, Scale, Briefcase, Building2, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { audiencesData } from '../../content/audiences';

interface AudienceSectionProps {
  onNavigate: (path: string) => void;
}

export const AudienceSection: React.FC<AudienceSectionProps> = ({ onNavigate }) => {
  const getAudienceIcon = (id: string) => {
    switch (id) {
      case 'health':
        return <Stethoscope className="w-5 h-5 text-[#0D5A63]" />;
      case 'law':
        return <Scale className="w-5 h-5 text-[#3658B6]" />;
      case 'management':
        return <Briefcase className="w-5 h-5 text-[#0C2340]" />;
      case 'business':
        return <Building2 className="w-5 h-5 text-[#6DA616]" />;
      case 'specialists':
      default:
        return <GraduationCap className="w-5 h-5 text-[#3658B6]" />;
    }
  };

  return (
    <section className="py-20 md:py-28 bg-[#F8F6F1] text-[#253244] border-b border-[#BAC3CE]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0D5A63]">
            <span>بخش اول: شناسایی جایگاه</span>
            <span aria-hidden="true">·</span>
            <span>Audience Layer</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0C2340]">
            گروه مهام برای چه کسانی است؟
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            کاربر باید سریع جایگاه و شرایط خود را در گروه بین‌المللی مهام پیدا کند؛ ما به جای تحمیل خدمات، بستر را متناسب با هویت حرفه‌ای شما تنظیم می‌کنیم.
          </p>
        </div>

        {/* 5 Audience Cards Grid + Quick Assessment Callout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiencesData.map((aud, idx) => (
            <motion.div
              key={aud.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-7 border border-[#BAC3CE]/40 shadow-sm hover:shadow-xl hover:border-[#3658B6]/40 transition-colors flex flex-col justify-between text-right group relative overflow-hidden"
            >
              {/* Subtle hover accent line */}
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-l from-transparent via-[#3658B6]/0 to-transparent group-hover:via-[#3658B6] transition-all duration-300" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-[#EEF1F3] flex items-center justify-center group-hover:bg-[#9FC9E8]/20 transition-colors">
                    {getAudienceIcon(aud.id)}
                  </div>
                  <span className="text-xs text-slate-400 font-sans tracking-wide">
                    {aud.slug.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#0C2340] group-hover:text-[#3658B6] transition-colors">
                  {aud.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {aud.challenges[0]?.description || aud.heroDescription}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#EEF1F3] flex items-center justify-between">
                <button
                  onClick={() => onNavigate(`/audiences/${aud.slug}`)}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#0C2340] group-hover:text-[#3658B6] transition-colors cursor-pointer"
                >
                  <span>{aud.primaryCtaText}</span>
                  <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
                </button>

                <span className="text-[11px] text-slate-400">
                  {aud.decisionStage.split(' ')[0]}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Quick Assessment Callout Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-[#0C2340] to-[#081525] rounded-2xl p-7 border border-white/10 shadow-lg text-white flex flex-col justify-between text-right"
          >
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#9FC9E8] block">هنوز مطمئن نیستید؟</span>
              <h3 className="text-lg font-bold text-white">
                تطبیق هوشمند با Decision Engine
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                با پاسخ به ۵ پرسش کوتاه، شرایط و اولویت‌های شما بررسی شده و گروه و مسیر منطقی به شما پیشنهاد می‌شود.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10">
              <button
                onClick={() => onNavigate('/decision-engine')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] rounded-xl transition-colors cursor-pointer"
              >
                <span>شروع ارزیابی هوشمند</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
