import React, { useState } from 'react';
import { BookOpen, CheckCircle, Send, ArrowLeft } from 'lucide-react';

export const LeadMagnetSection: React.FC = () => {
  const [name, setName] = useState('');
  const [field, setField] = useState('');
  const [goal, setGoal] = useState('توسعه حرفه‌ای');
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section className="py-20 md:py-24 bg-[#081525] text-white border-b border-white/10 relative overflow-hidden">
      
      {/* Decorative background grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `radial-gradient(rgba(159, 201, 232, 0.4) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-[#0C2340] rounded-3xl border border-white/15 p-8 sm:p-12 shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Right column: Description */}
            <div className="lg:col-span-6 space-y-5 text-right">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#9FC9E8]">
                <BookOpen className="w-4 h-4" />
                <span>راهنمای جامع کارشناسی</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                راهنمای انتخاب مسیر مناسب
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                یک راهنمای مدون و فشرده برای کمک به شما جهت تشخیص اینکه بر اساس حوزه فعالیت و اهداف‌تان، از کدام مسیر باید بررسی را آغاز کنید.
              </p>

              <div className="space-y-2.5 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#6DA616]" />
                  <span>بررسی مقایسه‌ای ۴ مسیر بین‌المللی اصلی</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#6DA616]" />
                  <span>شاخص‌های سنجش آمادگی فردی و سازمانی</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#6DA616]" />
                  <span>چک‌لیست راستی‌آزمایی مشاوره‌ها و کاهش ریسک</span>
                </div>
              </div>
            </div>

            {/* Left column: Form */}
            <div className="lg:col-span-6 bg-[#081525]/90 rounded-2xl p-6 sm:p-8 border border-white/10 text-right">
              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#6DA616]/20 text-[#6DA616] flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    درخواست راهنما با موفقیت ثبت شد
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    نسخه دیجیتال «راهنمای انتخاب مسیر مناسب» برای شما آماده شده و هماهنگی‌های لازم انجام خواهد شد.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-[#9FC9E8] hover:underline pt-2"
                  >
                    ارسال مجدد یا برای فرد دیگر
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      نام و نام خانوادگی
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: دکتر سهراب علوی"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#3658B6] transition-colors text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      حوزه فعالیت تخصصی
                    </label>
                    <input
                      type="text"
                      required
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                      placeholder="مثال: پزشکی و درمان / مدیریت پروژه / فناوری"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#3658B6] transition-colors text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      مهم‌ترین هدف شما
                    </label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#081525] border border-white/15 text-white focus:outline-none focus:border-[#3658B6] transition-colors text-right"
                    >
                      <option value="توسعه حرفه‌ای">توسعه حرفه‌ای</option>
                      <option value="توسعه کسب‌وکار">توسعه کسب‌وکار</option>
                      <option value="تجربه بین‌المللی">تجربه بین‌المللی</option>
                      <option value="شناخت فرصت‌ها">شناخت فرصت‌ها</option>
                      <option value="سایر">سایر</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      شماره تماس یا ایمیل جهت دریافت
                    </label>
                    <input
                      type="text"
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="۰۹۱۲... یا ایمیل شما"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#3658B6] transition-colors text-right"
                      dir="ltr"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] active:scale-[0.98] rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>{loading ? 'در حال ثبت...' : 'دریافت راهنمای انتخاب مسیر'}</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>

                  <span className="block text-[10px] text-slate-400 text-center pt-1">
                    اطلاعات شما کاملاً محرمانه بوده و تنها برای ارسال راهنما استفاده می‌شود.
                  </span>
                </form>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
