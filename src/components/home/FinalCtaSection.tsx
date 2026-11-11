import React from 'react';
import { ArrowLeft, Compass, Shield } from 'lucide-react';

interface FinalCtaSectionProps {
  onNavigate: (path: string) => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-20 md:py-28 bg-[#0C2340] text-white relative overflow-hidden">
      
      {/* Background Decorative Arcs */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `radial-gradient(rgba(159, 201, 232, 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
        aria-hidden="true"
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3658B6]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-7">
        
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#9FC9E8]">
          <Compass className="w-4 h-4" />
          <span>قدم بعدی شما</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          آینده بهتر، با شناخت بهتر شروع می‌شود.
        </h2>

        <p className="text-sm sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
          اگر می‌خواهید بدانید کدام مسیر برای شرایط شما مناسب‌تر است، اولین قدم را با یک بررسی اولیه شروع کنید.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('/decision-engine')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] active:scale-[0.98] rounded-xl shadow-xl shadow-[#3658B6]/25 transition-all duration-200 cursor-pointer"
          >
            <span>انتخاب مسیر مناسب من</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('/contact')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200 cursor-pointer"
          >
            <span>ارتباط مستقیم با کارشناسان مهام</span>
          </button>
        </div>

        <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Shield className="w-4 h-4 text-[#6DA616]" />
          <span>تمام درخواست‌ها و اطلاعات در چارچوب محرمانگی بررسی می‌شوند.</span>
        </div>

      </div>
    </section>
  );
};
