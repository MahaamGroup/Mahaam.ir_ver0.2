import React from 'react';
import { Target, Sliders, Users, ArrowLeft } from 'lucide-react';

interface WhyMahaamSectionProps {
  onNavigate: (path: string) => void;
}

export const WhyMahaamSection: React.FC<WhyMahaamSectionProps> = ({ onNavigate }) => {
  const pillars = [
    {
      icon: <Target className="w-6 h-6 text-[#3658B6]" />,
      title: 'شناخت قبل از پیشنهاد',
      desc: 'مهام ابتدا شرایط، اهداف و اولویت‌های شما را بررسی می‌کند، سپس مسیرهای قابل بررسی را پیشنهاد می‌دهد. ما هیچ‌گاه پیش از شناخت عمیق، بسته‌ای آماده ارائه نمی‌کنیم.'
    },
    {
      icon: <Sliders className="w-6 h-6 text-[#0D5A63]" />,
      title: 'طراحی متناسب با شرایط',
      desc: 'هیچ مسیر یکسانی برای همه افراد و سازمان‌ها وجود ندارد. مدل پیشنهادی برای شما دقیقاً بر اساس واقعیت‌های خانوادگی، مالی، شغلی و افق ریسک شما ترسیم می‌شود.'
    },
    {
      icon: <Users className="w-6 h-6 text-[#6DA616]" />,
      title: 'همراهی در مراحل مختلف',
      desc: 'از شناخت اولیه تا توسعه همکاری‌های آینده، ارتباط بر اساس نیاز واقعی شکل می‌گیرد؛ بدون تحمیل هزینه‌های بیهوده یا ترک مخاطب در میانه راه.'
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#EEF1F3] text-[#253244] border-b border-[#BAC3CE]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0D5A63]">
            <span>اعتماد و اصالت</span>
            <span aria-hidden="true">·</span>
            <span>Why Mahaam</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0C2340]">
            چرا مهام؟
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            اعتمادسازی از طریق شفافیت کامل و رد الگوهای تجاری تهاجمی.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-8 border border-[#BAC3CE]/40 shadow-sm hover:shadow-lg transition-all text-right space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#EEF1F3] flex items-center justify-center">
                  {pillar.icon}
                </div>

                <h3 className="text-lg font-bold text-[#0C2340]">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EEF1F3]">
                <button
                  onClick={() => onNavigate('/about')}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#3658B6] hover:text-[#2B4696] transition-colors"
                >
                  <span>اطلاعات بیشتر در درباره ما</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
