import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, ArrowLeft } from 'lucide-react';
import { siteConfig } from '../../content/siteConfig';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (path: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 flex items-center ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-[#BAC3CE]/50 shadow-sm' 
          : 'bg-[#F8F6F1]/95 backdrop-blur-md border-b border-[#BAC3CE]/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between gap-8 h-full">
          
          {/* Zone 1: Pure Pictorial Logo Mark with transparent background */}
          <button 
            onClick={() => handleLinkClick('/')}
            className="flex items-center text-right group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3658B6] rounded-md transition-opacity cursor-pointer shrink-0"
            aria-label="صفحه اصلی گروه بین‌المللی مهام"
          >
            <img 
              src="/site_logo.png" 
              alt="لوگوی گروه بین‌المللی مهام" 
              className="h-11 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </button>

          {/* Zone 2: Navigation Links (centered vertically) */}
          <nav className="hidden lg:flex items-center justify-center gap-7 text-sm font-medium text-slate-700 h-full my-auto" aria-label="ناوبری اصلی">
            <button
              onClick={() => handleLinkClick('/')}
              className={`inline-flex items-center justify-center hover:text-[#0C2340] transition-colors py-2 relative whitespace-nowrap cursor-pointer ${
                currentPath === '/' ? 'text-[#0C2340] font-bold' : ''
              }`}
            >
              <span>خانه</span>
              {currentPath === '/' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3658B6] rounded-full" />
              )}
            </button>

            {/* Audiences Menu */}
            <div 
              className="relative flex items-center h-full"
              onMouseEnter={() => setActiveDropdown('audiences')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleLinkClick('/audiences')}
                className={`inline-flex items-center justify-center gap-1.5 hover:text-[#0C2340] transition-colors py-2 whitespace-nowrap cursor-pointer ${
                  currentPath.startsWith('/audiences') ? 'text-[#0C2340] font-bold' : ''
                }`}
              >
                <span>مخاطبان</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'audiences' ? 'rotate-180 text-[#3658B6]' : 'text-slate-400'}`} />
              </button>

              {activeDropdown === 'audiences' && (
                <div className="absolute top-full right-0 w-64 pt-2 z-50">
                  <div className="bg-white border border-[#BAC3CE]/50 rounded-xl shadow-xl p-2 text-right">
                    <button
                      onClick={() => handleLinkClick('/audiences')}
                      className="w-full text-right px-3 py-2 text-xs font-semibold text-[#0D5A63] hover:bg-slate-50 rounded-lg flex items-center justify-between cursor-pointer"
                    >
                      <span>همه گروه‌های مخاطب</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <div className="h-px bg-[#EEF1F3] my-1.5" />
                    {siteConfig.navigation.find(n => n.href === '/audiences')?.children?.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => handleLinkClick(item.href)}
                        className="w-full text-right px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors group flex flex-col cursor-pointer"
                      >
                        <span className="text-sm font-medium text-[#0C2340] group-hover:text-[#3658B6]">
                          {item.label}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Journeys Menu */}
            <div 
              className="relative flex items-center h-full"
              onMouseEnter={() => setActiveDropdown('journeys')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleLinkClick('/journeys')}
                className={`inline-flex items-center justify-center gap-1.5 hover:text-[#0C2340] transition-colors py-2 whitespace-nowrap cursor-pointer ${
                  currentPath.startsWith('/journeys') ? 'text-[#0C2340] font-bold' : ''
                }`}
              >
                <span>مسیرها</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'journeys' ? 'rotate-180 text-[#3658B6]' : 'text-slate-400'}`} />
              </button>

              {activeDropdown === 'journeys' && (
                <div className="absolute top-full right-0 w-64 pt-2 z-50">
                  <div className="bg-white border border-[#BAC3CE]/50 rounded-xl shadow-xl p-2 text-right">
                    <button
                      onClick={() => handleLinkClick('/journeys')}
                      className="w-full text-right px-3 py-2 text-xs font-semibold text-[#0D5A63] hover:bg-slate-50 rounded-lg flex items-center justify-between cursor-pointer"
                    >
                      <span>نقشه جامع مسیرها</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <div className="h-px bg-[#EEF1F3] my-1.5" />
                    {siteConfig.navigation.find(n => n.href === '/journeys')?.children?.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => handleLinkClick(item.href)}
                        className="w-full text-right px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors group flex flex-col cursor-pointer"
                      >
                        <span className="text-sm font-medium text-[#0C2340] group-hover:text-[#3658B6]">
                          {item.label}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Links */}
            <button
              onClick={() => handleLinkClick('/decision-engine')}
              className={`inline-flex items-center justify-center hover:text-[#0C2340] transition-colors py-2 relative whitespace-nowrap cursor-pointer ${
                currentPath === '/decision-engine' ? 'text-[#3658B6] font-bold' : ''
              }`}
            >
              <span>ارزیابی مسیر</span>
            </button>

            <button
              onClick={() => handleLinkClick('/experiences')}
              className={`inline-flex items-center justify-center hover:text-[#0C2340] transition-colors py-2 relative whitespace-nowrap cursor-pointer ${
                currentPath === '/experiences' ? 'text-[#0C2340] font-bold' : ''
              }`}
            >
              <span>تجربه‌ها</span>
            </button>

            <button
              onClick={() => handleLinkClick('/insights')}
              className={`inline-flex items-center justify-center hover:text-[#0C2340] transition-colors py-2 relative whitespace-nowrap cursor-pointer ${
                currentPath === '/insights' ? 'text-[#0C2340] font-bold' : ''
              }`}
            >
              <span>بینش‌ها</span>
            </button>

            <button
              onClick={() => handleLinkClick('/about')}
              className={`inline-flex items-center justify-center hover:text-[#0C2340] transition-colors py-2 relative whitespace-nowrap cursor-pointer ${
                currentPath === '/about' ? 'text-[#0C2340] font-bold' : ''
              }`}
            >
              <span>درباره مهام</span>
            </button>

            <button
              onClick={() => handleLinkClick('/contact')}
              className={`inline-flex items-center justify-center hover:text-[#0C2340] transition-colors py-2 relative whitespace-nowrap cursor-pointer ${
                currentPath === '/contact' ? 'text-[#0C2340] font-bold' : ''
              }`}
            >
              <span>ارتباط با ما</span>
            </button>
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLinkClick('/decision-engine')}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] active:scale-[0.98] rounded-xl shadow-sm transition-all duration-200 whitespace-nowrap cursor-pointer"
            >
              <span>شروع ارزیابی مسیر</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-[#0C2340] hover:bg-slate-100 rounded-lg transition-colors focus:outline-none cursor-pointer"
              aria-label="باز کردن منوی موبایل"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#BAC3CE]/40 shadow-xl px-4 pt-4 pb-6 space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col space-y-2 text-right">
            <button
              onClick={() => handleLinkClick('/')}
              className="text-right px-3 py-2 text-[#0C2340] font-semibold hover:bg-slate-50 rounded-lg"
            >
              خانه
            </button>

            <div className="pt-2 border-t border-[#EEF1F3]">
              <span className="block px-3 py-1 text-xs font-semibold text-[#0D5A63]">گروه‌های مخاطب</span>
              {siteConfig.navigation.find(n => n.href === '/audiences')?.children?.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleLinkClick(item.href)}
                  className="w-full text-right px-4 py-2 text-sm text-slate-700 hover:text-[#0C2340] hover:bg-slate-50 rounded-lg flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <span className="text-[11px] text-slate-400">{item.desc}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-[#EEF1F3]">
              <span className="block px-3 py-1 text-xs font-semibold text-[#0D5A63]">مسیرهای بین‌المللی</span>
              {siteConfig.navigation.find(n => n.href === '/journeys')?.children?.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleLinkClick(item.href)}
                  className="w-full text-right px-4 py-2 text-sm text-slate-700 hover:text-[#0C2340] hover:bg-slate-50 rounded-lg flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <span className="text-[11px] text-slate-400">{item.desc}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-[#EEF1F3] space-y-1">
              <button
                onClick={() => handleLinkClick('/decision-engine')}
                className="w-full text-right px-3 py-2 text-[#0C2340] font-medium hover:bg-slate-50 rounded-lg flex items-center justify-between"
              >
                <span>ارزیابی هوشمند مسیر</span>
                <span className="text-xs bg-[#3658B6] px-2 py-0.5 rounded text-white">ابزار تحلیل</span>
              </button>

              <button
                onClick={() => handleLinkClick('/experiences')}
                className="w-full text-right px-3 py-2 text-slate-700 hover:text-[#0C2340] hover:bg-slate-50 rounded-lg"
              >
                تجربه‌های واقعی
              </button>

              <button
                onClick={() => handleLinkClick('/insights')}
                className="w-full text-right px-3 py-2 text-slate-700 hover:text-[#0C2340] hover:bg-slate-50 rounded-lg"
              >
                بینش‌ها و تحلیل‌ها
              </button>

              <button
                onClick={() => handleLinkClick('/about')}
                className="w-full text-right px-3 py-2 text-slate-700 hover:text-[#0C2340] hover:bg-slate-50 rounded-lg"
              >
                درباره مهام
              </button>

              <button
                onClick={() => handleLinkClick('/contact')}
                className="w-full text-right px-3 py-2 text-slate-700 hover:text-[#0C2340] hover:bg-slate-50 rounded-lg"
              >
                ارتباط با مهام
              </button>
            </div>

            <div className="pt-4">
              <button
                onClick={() => handleLinkClick('/decision-engine')}
                className="w-full py-3 text-center text-sm font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] rounded-xl shadow-md transition-colors"
              >
                شروع ارزیابی مسیر
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
