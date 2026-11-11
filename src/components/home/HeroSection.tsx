import React from 'react';
import { ArrowLeft, Compass, ShieldCheck, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#081525] via-[#0C2340] to-[#0A1B30] text-white pt-32 pb-24 md:pt-40 md:pb-32 border-b border-white/10">
      
      {/* Background Decorative Grid & Subtle Coordinates */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `radial-gradient(rgba(159, 201, 232, 0.4) 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
        aria-hidden="true"
      />

      {/* Atmospheric Diffuse Bloom */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#3658B6] rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1.8, delay: 0.2, ease: "easeOut" }}
        className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#0D5A63] rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Right Column: Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-7 text-right"
          >
            
            {/* Context Kicker */}
            <motion.div 
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 text-xs font-medium text-[#9FC9E8]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#6DA616]" />
              <span>پلتفرم جامع تصمیم‌گیری و راهبری مسیرهای فرامرزی</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">نسخه ۲.۰ سازمانی</span>
            </motion.div>

            {/* H1 Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.3] tracking-tight text-white max-w-2xl text-balance"
            >
              فرصت‌های بزرگ، از شناخت درست آغاز می‌شوند.
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl"
            >
              گروه بین‌المللی مهام همراه افراد، متخصصان، مدیران و سازمان‌هاست تا فرصت‌های توسعه، ارتباطات حرفه‌ای و تجربه‌های بین‌المللی متناسب با شرایط واقعی خود را بهتر بشناسند.
            </motion.p>

            {/* Explanatory Callout */}
            <motion.p 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm text-slate-300/90 leading-relaxed max-w-xl pr-3 border-r-2 border-[#3658B6]"
            >
              هر فرد و هر مجموعه، شرایط متفاوتی دارد. به همین دلیل مهام به جای ارائه یک مسیر یکسان برای همه، ابتدا به شناخت شرایط، اهداف و ظرفیت‌های شما کمک می‌کند تا مسیر مناسب‌تر مشخص شود.
            </motion.p>

            {/* Primary & Secondary Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <button
                onClick={() => onNavigate('/decision-engine')}
                className="inline-flex items-center justify-center gap-3 px-7 py-3.5 text-sm font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] active:scale-[0.98] rounded-xl shadow-lg shadow-[#3658B6]/25 transition-all duration-200 cursor-pointer"
              >
                <span>مسیر مناسب خود را پیدا کنید</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('/about')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <span>آشنایی با رویکرد مهام</span>
              </button>
            </motion.div>

            {/* Credibility Keypoints */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#6DA616]" />
                <span>بررسی عاری از مبالغه و فشار فروش</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#9FC9E8]" />
                <span>طراحی چندسناریویی متناسب با شرایط واقعی</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#9FC9E8]" />
                <span>پشتیبانی گام‌به‌گام تا استقرار نهایی</span>
              </div>
            </motion.div>

          </motion.div>

          {/* Left Column: Visual Focal Anchor */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#081525]">
              <img 
                src="/images/hero_international_consultation_1794322855600.jpg"
                alt="فضای گفت‌وگوی استراتژیک و مشاوره معماری بین‌المللی گروه مهام"
                referrerPolicy="no-referrer"
                className="w-full h-[380px] sm:h-[440px] object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#081525]/90 via-[#081525]/30 to-transparent pointer-events-none" />

              {/* Discreet Editorial Caption Card inside Image */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute bottom-4 right-4 left-4 p-4 rounded-xl bg-[#0C2340]/90 backdrop-blur-md border border-white/10 text-right"
              >
                <div className="flex items-center justify-between text-xs text-[#9FC9E8] mb-1">
                  <span className="font-semibold">Mahaam Decision Framework</span>
                  <span>گام اول: شناخت</span>
                </div>
                <p className="text-xs text-slate-200 leading-snug">
                  «تصمیم‌گیری آگاهانه زمانی شکل می‌گیرد که ابعاد حقوقی، مالی و حرفه‌ای در هماهنگی کامل ارزیابی شوند.»
                </p>
              </motion.div>
            </div>

            {/* Corner Decorative Coordinate Marker */}
            <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-[#9FC9E8]/40 pointer-events-none hidden sm:block" />
            <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-[#9FC9E8]/40 pointer-events-none hidden sm:block" />
          </motion.div>

        </div>
      </div>

    </section>
  );
};
