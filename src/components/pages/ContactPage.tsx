import React, { useState } from 'react';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { siteConfig } from '../../content/siteConfig';
import { 
  ArrowLeft, Send, CheckCircle2, Phone, Mail, MapPin, Clock, 
  HelpCircle, ShieldCheck, ChevronDown 
} from 'lucide-react';
import { useDocumentMeta } from '../../lib/useDocumentMeta';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  useDocumentMeta({
    title: 'ارتباط با ما و تعیین وقت مشاوره',
    description: 'نقطه ورود هوشمند به خدمات مهام؛ فرم ارزیابی اولیه، شماره تماس مستقیم ۰۲۱-۷۹۲۴۱۰۰۰ و نشانی دفتر مرکزی تهران.',
    canonicalPath: '/contact'
  });
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [audienceType, setAudienceType] = useState('متخصص');
  const [subject, setSubject] = useState('شناخت مسیر');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');

  // Handle intent cards clicking
  const handleSelectIntent = (newSubject: string, directToAssessment?: boolean) => {
    if (directToAssessment) {
      onNavigate('/decision-engine');
      return;
    }
    setSubject(newSubject);
    const formElement = document.getElementById('contact-form-section');
    formElement?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setTrackingCode(`MHM-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="bg-[#F8F6F1] min-h-screen">
      <Breadcrumbs items={[{ label: 'ارتباط با مهام' }]} onNavigate={onNavigate} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#081525] to-[#0C2340] text-white py-16 md:py-24 border-b border-white/10 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#9FC9E8]">
            <span>نقطه ورود هوشمند</span>
            <span aria-hidden="true">·</span>
            <span>Contact Mahaam</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            از کجا شروع کنیم؟
          </h1>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
            هر گفت‌وگوی مؤثر با شناخت درست آغاز می‌شود. اگر در حال بررسی یک تصمیم مهم هستید یا می‌خواهید درباره شرایط خود گفت‌وگو کنید، ابتدا نوع درخواست خود را انتخاب کنید تا ارتباط از مسیر مناسب آغاز شود.
          </p>
        </div>
      </section>

      {/* Section 02: Intent Selector Cards */}
      <section className="py-16 md:py-20 border-b border-[#BAC3CE]/40 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-semibold text-[#0D5A63] block mb-1">تعیین مسیر ارتباط</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
              موضوع ارتباط شما چیست؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              برای اینکه درخواست شما به گروه کارشناسی مرتبط هدایت شود، موضوع اصلی را انتخاب نمایید:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* CARD 01 */}
            <div className="bg-white rounded-2xl p-6 border border-[#BAC3CE]/40 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-[#0D5A63] block">ارزیابی و شناخت</span>
                <h3 className="text-base font-bold text-[#0C2340]">
                  می‌خواهم شرایط خود را بررسی کنم.
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  مناسب برای افرادی که هنوز در مرحله شناخت و مقایسه سناریوها هستند.
                </p>
              </div>
              <button
                onClick={() => handleSelectIntent('', true)}
                className="w-full inline-flex items-center justify-between text-xs font-semibold text-[#3658B6] hover:text-[#2B4696] pt-3 border-t border-[#EEF1F3]"
              >
                <span>شروع ارزیابی اولیه</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* CARD 02 */}
            <div className="bg-white rounded-2xl p-6 border border-[#BAC3CE]/40 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-[#3658B6] block">مسیر مشخص</span>
                <h3 className="text-base font-bold text-[#0C2340]">
                  درباره یک مسیر مشخص سؤال دارم.
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  مناسب برای افرادی که یکی از Journeyهای مهام را از قبل بررسی کرده‌اند.
                </p>
              </div>
              <button
                onClick={() => handleSelectIntent('بررسی یک Journey')}
                className="w-full inline-flex items-center justify-between text-xs font-semibold text-[#3658B6] hover:text-[#2B4696] pt-3 border-t border-[#EEF1F3]"
              >
                <span>ارسال درخواست بررسی</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* CARD 03 */}
            <div className="bg-white rounded-2xl p-6 border border-[#BAC3CE]/40 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-[#0C2340] block">همکاری سازمانی</span>
                <h3 className="text-base font-bold text-[#0C2340]">
                  به دنبال همکاری حرفه‌ای یا سازمانی هستم.
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  مناسب برای مدیران، سازمان‌ها، مؤسسات و صاحبان صنایع.
                </p>
              </div>
              <button
                onClick={() => handleSelectIntent('همکاری')}
                className="w-full inline-flex items-center justify-between text-xs font-semibold text-[#3658B6] hover:text-[#2B4696] pt-3 border-t border-[#EEF1F3]"
              >
                <span>شروع گفت‌وگوی همکاری</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* CARD 04 */}
            <div className="bg-white rounded-2xl p-6 border border-[#BAC3CE]/40 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 block">سایر درخواست‌ها</span>
                <h3 className="text-base font-bold text-[#0C2340]">
                  سؤال یا موضوع دیگری دارم.
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  برای سایر پرسش‌ها، دعوت به رویدادها یا ارتباط عمومی.
                </p>
              </div>
              <button
                onClick={() => handleSelectIntent('سؤال عمومی')}
                className="w-full inline-flex items-center justify-between text-xs font-semibold text-[#3658B6] hover:text-[#2B4696] pt-3 border-t border-[#EEF1F3]"
              >
                <span>ارسال پیام</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Section 03: Smart Contact Form */}
      <section id="contact-form-section" className="py-16 md:py-24 bg-[#EEF1F3] border-b border-[#BAC3CE]/40 text-right">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#BAC3CE]/40 shadow-sm space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#0D5A63] block">فرم ارتباط هوشمند</span>
              <h2 className="text-2xl font-bold text-[#0C2340]">
                اطلاعات اولیه جهت بررسی
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                لطفاً اطلاعات زیر را با دقت تکمیل کنید تا کارشناس حوزه تخصصی شما برای ارتباط آماده باشد.
              </p>
            </div>

            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#6DA616]/20 text-[#6DA616] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#0C2340]">
                  درخواست شما با موفقیت ثبت شد
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  کد پیگیری اختصاصی شما: <span className="font-mono font-bold text-[#3658B6]">{trackingCode}</span> است. تیم مشاوران مهام پس از بررسی اولیه سوابق، ظرف ۲۴ الی ۴۸ ساعت کاری با شما ارتباط برقرار خواهند کرد.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="inline-flex items-center gap-2 text-xs text-[#3658B6] hover:underline pt-4"
                >
                  <span>ارسال پیام جدید</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      نام <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="نام"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#3658B6] focus:ring-1 focus:ring-[#3658B6] transition-all text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      نام خانوادگی <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="نام خانوادگی"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#3658B6] focus:ring-1 focus:ring-[#3658B6] transition-all text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      شماره تماس مستقیم <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="۰۹۱۲..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#3658B6] focus:ring-1 focus:ring-[#3658B6] transition-all text-right"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      ایمیل رسمی (اختیاری)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#3658B6] focus:ring-1 focus:ring-[#3658B6] transition-all text-right"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      نوع مخاطب
                    </label>
                    <select
                      value={audienceType}
                      onChange={(e) => setAudienceType(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#3658B6] transition-all text-right"
                    >
                      <option value="متخصص">متخصص / پژوهشگر</option>
                      <option value="مدیر">مدیر ارشد یا سازمانی</option>
                      <option value="صاحب کسب‌وکار">صاحب کسب‌وکار / کارآفرین</option>
                      <option value="سازمان">سازمان یا نهاد</option>
                      <option value="سایر">سایر</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      موضوع ارتباط
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#3658B6] transition-all text-right"
                    >
                      <option value="شناخت مسیر">شناخت مسیر (Discovery)</option>
                      <option value="بررسی یک Journey">بررسی یک Journey مشخص</option>
                      <option value="همکاری">همکاری سازمانی و راهبردی</option>
                      <option value="سؤال عمومی">سؤال عمومی</option>
                      <option value="سایر">سایر موارد</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    شرح درخواست یا پیام شما (حداکثر ۱۰۰۰ کاراکتر)
                  </label>
                  <textarea
                    rows={4}
                    maxLength={1000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="توضیح کوتاه درباره موقعیت شغلی، مقاصد مدنظر، یا پرسش‌های خاص شما..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#3658B6] focus:ring-1 focus:ring-[#3658B6] transition-all text-right resize-none"
                  />
                  <div className="flex justify-end text-[10px] text-slate-400 mt-1">
                    <span>{message.length} / ۱۰۰۰ کاراکتر</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] active:scale-[0.98] rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'در حال ثبت درخواست...' : 'ثبت درخواست ارتباط'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-[#EEF1F3]">
                  <ShieldCheck className="w-4 h-4 text-[#6DA616] shrink-0" />
                  <span>کلیه اطلاعات ارسالی در چارچوب حریم خصوصی و محرمانگی مهام محافظت می‌گردد.</span>
                </div>

              </form>
            )}

          </div>

        </div>
      </section>

      {/* Section 04: What Happens After Submission */}
      <section className="py-16 md:py-20 border-b border-[#BAC3CE]/40 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-semibold text-[#0D5A63] block mb-1">فرآیند رسیدگی</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
              پس از ارسال درخواست چه اتفاقی می‌افتد؟
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#BAC3CE]/40 shadow-sm space-y-2">
              <span className="text-xs font-bold font-sans text-white bg-[#0C2340] px-2.5 py-1 rounded-md inline-block">
                مرحله اول
              </span>
              <h3 className="text-base font-bold text-[#0C2340]">بررسی اولیه</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                درخواست شما بر اساس موضوع، سوابق حرفه‌ای و اطلاعات ثبت‌شده توسط کارشناس مربوطه ممیزی می‌شود.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#BAC3CE]/40 shadow-sm space-y-2">
              <span className="text-xs font-bold font-sans text-white bg-[#3658B6] px-2.5 py-1 rounded-md inline-block">
                مرحله دوم
              </span>
              <h3 className="text-base font-bold text-[#0C2340]">تعیین مسیر ارتباط</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                مشخص می‌شود که مناسب‌ترین ادامه ارتباط (جلسه حضوری، تماس تصویری یا پاسخ مکتوب) چیست.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#BAC3CE]/40 shadow-sm space-y-2">
              <span className="text-xs font-bold font-sans text-white bg-[#6DA616] px-2.5 py-1 rounded-md inline-block">
                مرحله سوم
              </span>
              <h3 className="text-base font-bold text-[#0C2340]">پاسخ اولیه و هماهنگی</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                در صورت نیاز، برای هماهنگی جلسه و دریافت اطلاعات تکمیلی با شما تماس گرفته خواهد شد.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 05: Direct Channels */}
      <section className="py-16 md:py-20 bg-white border-b border-[#BAC3CE]/40 text-right">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-semibold text-[#0D5A63] block mb-1">راه‌های ارتباط مستقیم</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
              کانال‌های رسمی گروه بین‌المللی مهام
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#F8F6F1] border border-[#BAC3CE]/40 space-y-2">
              <Phone className="w-5 h-5 text-[#3658B6]" />
              <h3 className="text-sm font-bold text-[#0C2340]">تلفن تماس</h3>
              <p className="text-xs text-slate-600 font-sans" dir="ltr">{siteConfig.contact.phone} | {siteConfig.contact.phoneSecondary}</p>
              <span className="text-[11px] text-slate-400 block pt-1">پاسخ‌گویی ساعات اداری</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8F6F1] border border-[#BAC3CE]/40 space-y-2">
              <Mail className="w-5 h-5 text-[#3658B6]" />
              <h3 className="text-sm font-bold text-[#0C2340]">مکاتبات رسمی</h3>
              <p className="text-xs text-slate-600 font-sans">{siteConfig.contact.email}</p>
              <span className="text-[11px] text-slate-400 block pt-1">برای اسناد و مدارک</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8F6F1] border border-[#BAC3CE]/40 space-y-2">
              <MapPin className="w-5 h-5 text-[#3658B6]" />
              <h3 className="text-sm font-bold text-[#0C2340]">دفتر مرکزی</h3>
              <p className="text-xs text-slate-600 leading-snug">{siteConfig.contact.address}</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8F6F1] border border-[#BAC3CE]/40 space-y-2">
              <Clock className="w-5 h-5 text-[#3658B6]" />
              <h3 className="text-sm font-bold text-[#0C2340]">ساعات کاری</h3>
              <p className="text-xs text-slate-600 leading-snug">{siteConfig.contact.workingHours}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 06: Contact FAQs */}
      <section className="py-16 md:py-20 bg-[#EEF1F3] border-b border-[#BAC3CE]/40 text-right">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl font-bold text-[#0C2340]">پرسش‌های رایج پیش از ارتباط</h2>
          <div className="space-y-3">
            <div className="p-5 rounded-2xl bg-white border border-[#BAC3CE]/30 space-y-1.5">
              <h3 className="text-sm font-bold text-[#0C2340]">آیا ثبت درخواست به معنی شروع همکاری یا تعهد مالی است؟</h3>
              <p className="text-xs text-slate-600 leading-relaxed">خیر. ثبت درخواست فقط نقطه شروع بررسی اولیه کارشناسی است و هیچ تعهدی برای شما ایجاد نمی‌کند.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#BAC3CE]/30 space-y-1.5">
              <h3 className="text-sm font-bold text-[#0C2340]">اگر هنوز مسیر مشخصی نداشته باشم چه باید بکنم؟</h3>
              <p className="text-xs text-slate-600 leading-relaxed">پیشنهاد می‌کنیم از ابزار «ارزیابی هوشمند مسیر» (Decision Engine) شروع کنید تا شرایط شما ابتدا شفاف شود.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#BAC3CE]/30 space-y-1.5">
              <h3 className="text-sm font-bold text-[#0C2340]">آیا برای سازمان‌ها فرآیند جداگانه‌ای وجود دارد؟</h3>
              <p className="text-xs text-slate-600 leading-relaxed">بله؛ درخواست‌های سازمانی، هلدینگ‌ها و پروژه‌های مشترک مستقیماً به واحد توسعه راهبردی مهام ارجاع می‌گردند.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Contact CTA */}
      <section className="py-16 md:py-20 bg-[#0C2340] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold">گفت‌وگو را از نقطه درست آغاز کنید.</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            اگر هنوز مطمئن نیستید بهترین نقطه شروع برای شما کدام است، ارزیابی اولیه می‌تواند مسیر مناسب‌تر را مشخص کند.
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
