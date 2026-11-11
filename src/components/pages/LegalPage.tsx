import React from 'react';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { ShieldCheck, FileText } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms';
  onNavigate: (path: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onNavigate }) => {
  const isPrivacy = type === 'privacy';

  return (
    <div className="bg-[#F8F6F1] min-h-screen">
      <Breadcrumbs 
        items={[{ label: isPrivacy ? 'حریم خصوصی و محرمانگی' : 'شرایط و قوانین استفاده' }]} 
        onNavigate={onNavigate} 
      />

      <section className="bg-gradient-to-b from-[#081525] to-[#0C2340] text-white py-14 md:py-20 border-b border-white/10 text-right">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#9FC9E8]">
            {isPrivacy ? <ShieldCheck className="w-4 h-4 text-[#6DA616]" /> : <FileText className="w-4 h-4" />}
            <span>اسناد حقوقی و انطباق سازمانی</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
            {isPrivacy ? 'بیانیه حریم خصوصی و محرمانگی اطلاعات' : 'شرایط، مقررات و تعهدات متقابل'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            اصول حاکم بر مدیریت داده‌ها، مشاوره‌ها و ارتباطات در گروه بین‌المللی مهام.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 text-right">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#BAC3CE]/40 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm">
            
            {isPrivacy ? (
              <>
                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-[#0C2340]">۱. تعهد بنیادین به محرمانگی (Confidentiality)</h2>
                  <p>
                    گروه بین‌المللی مهام حفاظت از اطلاعات، مدارک شغلی، سوابق بالینی، اسناد شرکتی و اهداف تجاری مراجعان را بالاترین اصل اخلاقی و حرفه‌ای خود می‌داند. تمامی اطلاعات ثبت‌شده در پرسش‌نامه‌های ارزیابی و فرم‌های ارتباطی در سرورهای امن رمزنگاری‌شده نگهداری می‌شوند.
                  </p>
                </div>

                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-[#0C2340]">۲. عدم واگذاری به اشخاص ثالث</h2>
                  <p>
                    گروه مهام هیچ‌گونه اطلاعات شخصی یا تجاری مراجعان را تحت هیچ شرایطی برای مقاصد تبلیغاتی، بازاریابی بیرونی یا مؤسسات مهاجرتی متفرقه افشا نکرده و به اشتراک نمی‌گذارد. هرگونه دسترسی به داده‌ها صرفاً توسط تیم کارشناسی بررسی اولیه و تحت موافقت‌نامه عدم افشا (NDA) صورت می‌پذیرد.
                  </p>
                </div>

                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-[#0C2340]">۳. حق دسترسی و اصلاح اطلاعات</h2>
                  <p>
                    کاربران در هر زمان می‌توانند با ارسال ایمیل به <span className="font-sans text-[#3658B6]">privacy@mahaam.ir</span> درخواست حذف کامل اطلاعات یا به‌روزرسانی سوابق ارسالی خود را ارائه نمایند.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-[#0C2340]">۱. ماهیت خدمات مشاوره‌ای و تصمیم‌گیری</h2>
                  <p>
                    وب‌سایت و ابزارهای گروه بین‌المللی مهام از جمله «موتور تصمیم‌گیری» پلتفرم ارزیابی، تحلیل گزینه‌ها و تسهیل تصمیم‌گیری هستند. تکمیل پرسش‌نامه‌ها یا ارسال فرم به منزله آغاز قرارداد تجاری یا تعهد حقوقی دوجانبه نبوده و صرفاً برای بررسی کارشناسی اولیه است.
                  </p>
                </div>

                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-[#0C2340]">۲. عدم صدور ادعاها و نتایج تضمینی</h2>
                  <p>
                    طبق منشور سازمانی گروه بین‌المللی مهام، کلیه تحلیل‌ها، برآوردها و پیشنهادات بر مبنای قوانین و نظام‌های حاکم بر بازارهای مقصد تنظیم می‌شوند. تصمیم‌گیری نهایی همواره بر عهده مخاطب بوده و قوانین مراجع دولتی و رگولاتوری کشورهای مقصد در اولویت قرار دارد.
                  </p>
                </div>

                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-[#0C2340]">۳. حقوق مالکیت معنوی</h2>
                  <p>
                    کلیه محتویات، ماتریس‌های تصمیم، نشان تجاری و چارچوب‌های طبقه‌بندی ارائه شده در این پایگاه مشمول حمایت‌های قانونی مالکیت معنوی گروه بین‌المللی مهام بوده و هرگونه بازنشر تجاری بدون اجازه مکتوب ممنوع است.
                  </p>
                </div>
              </>
            )}

          </div>
        </div>
      </section>
    </div>
  );
};
