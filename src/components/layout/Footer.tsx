import React from 'react';
import { Mail, Phone, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { siteConfig } from '../../content/siteConfig';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#081525] text-slate-300 border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10 text-right">
          
          {/* Brand Column (2 spans on desktop) */}
          <div className="lg:col-span-2 space-y-5">
            <div className="inline-block bg-white rounded-2xl p-3 shadow-md border border-white/20">
              <img 
                src="/site_logo.png" 
                alt="لوگوی رسمی گروه بین‌المللی مهام" 
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              {siteConfig.description}
            </p>

            <div className="pt-2">
              <button
                onClick={() => handleLinkClick('/decision-engine')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] rounded-lg transition-colors"
              >
                <span>شروع ارزیابی شرایط من</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Column 1: مخاطبان */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold tracking-wide">
              گروه‌های مخاطب
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleLinkClick('/audiences/health')} className="hover:text-white transition-colors">
                  پزشکان و حوزه سلامت
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/audiences/law')} className="hover:text-white transition-colors">
                  وکلا و متخصصان حقوقی
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/audiences/management')} className="hover:text-white transition-colors">
                  مدیران ارشد و سازمانی
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/audiences/business')} className="hover:text-white transition-colors">
                  صاحبان کسب‌وکار
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/audiences/specialists')} className="hover:text-white transition-colors">
                  متخصصان و پژوهشگران
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: مسیرها */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold tracking-wide">
              مسیرهای بین‌المللی
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleLinkClick('/journeys/discovery')} className="hover:text-white transition-colors">
                  کشف فرصت‌ها
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/journeys/experience')} className="hover:text-white transition-colors">
                  تجربه‌های بین‌المللی
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/journeys/development')} className="hover:text-white transition-colors">
                  استقرار و توسعه
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/journeys/growth')} className="hover:text-white transition-colors">
                  رشد و همکاری بلندمدت
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/decision-engine')} className="hover:text-white transition-colors">
                  موتور تصمیم‌گیری
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: ارتباط و نشانی */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold tracking-wide">
              اطلاعات ارتباط
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#9FC9E8] shrink-0 mt-0.5" />
                <span className="leading-snug">{siteConfig.contact.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#9FC9E8] shrink-0" />
                <span dir="ltr">{siteConfig.contact.phone} | {siteConfig.contact.phoneSecondary}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#9FC9E8] shrink-0" />
                <span>{siteConfig.contact.email}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#9FC9E8] shrink-0" />
                <span>{siteConfig.contact.workingHours}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. تمامی حقوق محفوظ است.
          </p>

          <div className="flex items-center gap-6">
            <button onClick={() => handleLinkClick('/privacy')} className="hover:text-slate-300 transition-colors">
              حریم خصوصی و محرمانگی
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button onClick={() => handleLinkClick('/terms')} className="hover:text-slate-300 transition-colors">
              شرایط و قوانین
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button onClick={() => handleLinkClick('/faq')} className="hover:text-slate-300 transition-colors">
              پرسش‌های متداول
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
