import React, { useState } from 'react';
import { Eye, BarChart3, Compass, CheckCircle, ArrowLeft } from 'lucide-react';

interface ApproachSectionProps {
  onNavigate: (path: string) => void;
}

export const ApproachSection: React.FC<ApproachSectionProps> = ({ onNavigate }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '۰۱',
      title: 'شناخت (Discovery)',
      short: 'بررسی شرایط و اولویت‌ها',
      icon: <Eye className="w-5 h-5" />,
      desc: 'ابتدا شرایط، اهداف و اولویت‌های شما به دور از هرگونه پیش‌داوری بررسی می‌شود. ما در این مرحله گوش می‌دهیم، سوابق و ظرفیت‌های واقعی را ممیزی می‌کنیم تا زمینه اصلی شفاف شود.',
      details: [
        'ممیزی مدارک، سوابق بالینی، حقوقی یا کسب‌وکار',
        'شناخت دغدغه‌های خانوادگی و محدودیت‌های زمانی',
        'تعریف افق انتظارات و شاخص‌های موفقیت مدنظر شما'
      ]
    },
    {
      num: '۰۲',
      title: 'تحلیل (Analysis)',
      short: 'ارزیابی گزینه‌ها و الزامات',
      icon: <BarChart3 className="w-5 h-5" />,
      desc: 'گزینه‌های قابل بررسی و الزامات هر مسیر ارزیابی می‌شوند. سناریوهایی که با شرایط شما همخوانی ندارند یا دارای ریسک ناموجه هستند کنار گذاشته می‌شوند.',
      details: [
        'تطبیق با قوانین رگولاتوری و نظام‌های حرفه‌ای مقصد',
        'امکان‌سنجی مالیاتی، سرمایه‌ای و بانکی',
        'طراحی گزارش شفاف مقایسه سناریوها (Plan Matrix)'
      ]
    },
    {
      num: '۰۳',
      title: 'تجربه (Experience)',
      short: 'شناخت میدانی و نزدیک',
      icon: <Compass className="w-5 h-5" />,
      desc: 'در صورت نیاز، امکان شناخت نزدیک‌تر محیط‌ها، مجموعه‌ها و فرصت‌ها فراهم می‌شود تا قبل از تعهد قطعی، فضا و جامعه حرفه‌ای مقصد را لمس کنید.',
      details: [
        'بازدید میدانی از مراکز درمانی، دفاتر حقوقی یا انکوباتورها',
        'دیدار مستقیم با همکاران و مشاوران مستقر در مقصد',
        'راستی‌آزمایی انتظارات سبک زندگی و کار واقعی'
      ]
    },
    {
      num: '۰۴',
      title: 'تصمیم (Decision)',
      short: 'انتخاب آگاهانه و استقرار',
      icon: <CheckCircle className="w-5 h-5" />,
      desc: 'هدف، کمک به تصمیم‌گیری آگاهانه‌تر است. با در دست داشتن اطلاعات مستند و تجربه ملموس، تصمیم نهایی را با حداکثر اطمینان و کمترین ابهام اتخاذ می‌فرمایید.',
      details: [
        'تدوین نقشه راه اجرایی گام‌به‌گام',
        'همراهی در اقدامات اداری، حقوقی و ثبتی',
        'پشتیبانی مستمر تا مرحله تثبیت و رشد'
      ]
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#0C2340] text-white border-b border-white/10 relative overflow-hidden">
      
      {/* Background architectural aura */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0D5A63]/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#9FC9E8]">
            <span>متدولوژی ۴ مرحله‌ای</span>
            <span aria-hidden="true">·</span>
            <span>Mahaam Method</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            رویکرد گروه مهام؛ چهار گام تا تصمیم آگاهانه
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            تفاوت رویکرد گروه مهام در این است که هرگز پیش از شناخت و تحلیل عمیق، نسخه‌ای صادر نمی‌شود.
          </p>
        </div>

        {/* Desktop & Mobile Interactive Steps Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-xl border text-right transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                activeStep === idx 
                  ? 'bg-white/10 border-[#9FC9E8] shadow-lg ring-1 ring-[#9FC9E8]/30' 
                  : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold font-sans ${activeStep === idx ? 'text-[#9FC9E8]' : 'text-slate-400'}`}>
                  {step.num}
                </span>
                <div className={`p-1.5 rounded-lg ${activeStep === idx ? 'bg-[#3658B6] text-white' : 'text-slate-400'}`}>
                  {step.icon}
                </div>
              </div>

              <div>
                <span className="block text-sm font-bold text-white mb-0.5">
                  {step.title}
                </span>
                <span className="text-[11px] text-slate-300">
                  {step.short}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Active Step Detailed Showcase Panel */}
        <div className="bg-[#081525] rounded-2xl border border-white/15 p-6 sm:p-10 shadow-2xl text-right">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold font-sans text-[#9FC9E8]">
                  {steps[activeStep].num}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {steps[activeStep].title}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {steps[activeStep].desc}
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-[#9FC9E8] block mb-2">
                  محورهای اجرایی این مرحله:
                </span>
                {steps[activeStep].details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6DA616]" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center items-center lg:items-end border-t lg:border-t-0 lg:border-r border-white/10 pt-6 lg:pt-0 lg:pr-8">
              <div className="w-full space-y-3">
                <span className="text-xs text-slate-400 block text-center lg:text-right">
                  آماده‌اید از این گام آغاز کنید؟
                </span>
                <button
                  onClick={() => onNavigate('/decision-engine')}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] rounded-xl transition-colors cursor-pointer"
                >
                  <span>شروع فرآیند شناخت من</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
