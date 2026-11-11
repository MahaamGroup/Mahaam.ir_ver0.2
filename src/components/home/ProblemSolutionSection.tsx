import React from 'react';
import { HelpCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

interface ProblemSolutionSectionProps {
  onNavigate: (path: string) => void;
}

export const ProblemSolutionSection: React.FC<ProblemSolutionSectionProps> = ({ onNavigate }) => {
  const coreQuestions = [
    {
      q: 'کدام فرصت با شرایط من هماهنگ‌تر است؟',
      a: 'تطبیق واقعی سوابق، ظرفیت مالی و اهداف شما با بیش از ۲۰ شاخص رگولاتوری بین‌المللی.'
    },
    {
      q: 'از کجا باید شروع کنم؟',
      a: 'تفکیک گام‌های فوری از مراحل درازمدت و جلوگیری از اقدامات موازی و سردرگم‌کننده.'
    },
    {
      q: 'چه چیزهایی را باید قبل از تصمیم بدانم؟',
      a: 'شناخت هزینه‌های پنهان، تعهدات مالیاتی و واقعیت‌های اقامتی و کاری حوزه مقصد.'
    },
    {
      q: 'چگونه می‌توانم ریسک تصمیم را کاهش دهم؟',
      a: 'طراحی سناریوهای بازگشت‌پذیر و تجربه میدانی بدون نیاز به قطع ریشه‌های فعلی.'
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#EEF1F3] text-[#253244] border-b border-[#BAC3CE]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Right column: Statement & Philosophy */}
          <div className="lg:col-span-5 space-y-6 text-right">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0D5A63]">
              <span>مسئله بنیادین</span>
              <span aria-hidden="true">·</span>
              <span>Value Proposition</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0C2340] leading-snug">
              مسئله‌ای که مهام حل می‌کند
            </h2>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              در بسیاری از تصمیم‌های مهم، مشکل اصلی کمبود اطلاعات نیست؛ بلکه نداشتن یک تصویر روشن از گزینه‌ها، شرایط و مسیر مناسب است.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              انبوه تبلیغات مهاجرتی، قوانین متغیر بین‌المللی و توصیه‌های تجربی دیگران معمولاً موجب سردرگمی می‌شود. مهام کمک می‌کند این پرسش‌ها ساختارمند، علمی و با آرامش بررسی شوند.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('/about')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#0C2340] bg-white hover:bg-slate-50 border border-[#BAC3CE] rounded-xl shadow-sm transition-all"
              >
                <span>مطالعه نگرش و فلسفه مهام</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Left column: 4 Core Questions Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coreQuestions.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-xl p-6 border border-[#BAC3CE]/40 shadow-sm hover:shadow-md transition-shadow text-right space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#9FC9E8]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <HelpCircle className="w-4 h-4 text-[#3658B6]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0C2340] leading-snug">
                    {item.q}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pr-11">
                  {item.a}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
