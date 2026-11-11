import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, Send, Instagram, X } from 'lucide-react';
import { siteConfig } from '../../content/siteConfig';

export const SocialFloatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const phone1 = siteConfig.contact.phone; // ۰۲۱-۲۲۶۶۳۰۰۲
  const phone2 = siteConfig.contact.phoneSecondary; // ۰۲۱-۲۲۶۶۳۰۰۱
  const rawPhone1 = siteConfig.contact.rawPhone;
  const rawPhone2 = siteConfig.contact.rawPhoneSecondary;
  const defaultWhatsappMsg = encodeURIComponent('با سلام و احترام، جهت دریافت راهنمایی و بررسی شرایط با گروه بین‌المللی مهام ارتباط برقرار می‌نمایم.');

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 280);
  };

  return (
    <div 
      className="relative font-sans text-right"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -12 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-14 top-0 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#BAC3CE]/60 p-4 space-y-3 w-72 z-50 text-right pointer-events-auto"
          >
            <div className="flex items-center justify-between border-b border-[#EEF1F3] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] animate-pulse" />
                <span className="text-xs font-bold text-[#0C2340]">ارتباط مستقیم با کارشناسان</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer"
                aria-label="بستن پنجره ارتباط"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Direct Phone Lines */}
            <div className="p-2.5 rounded-xl bg-[#F8F6F1] border border-[#BAC3CE]/30 text-center space-y-1.5">
              <span className="text-[11px] text-slate-500 block">خطوط مستقیم ارتباطی مهام:</span>
              <div className="flex items-center justify-center gap-2 text-xs font-bold font-sans dir-ltr" dir="ltr">
                <a href={`tel:${rawPhone1}`} className="text-[#0C2340] hover:text-[#2E7D32] transition-colors">{phone1}</a>
                <span className="text-slate-300">|</span>
                <a href={`tel:${rawPhone2}`} className="text-[#0C2340] hover:text-[#2E7D32] transition-colors">{phone2}</a>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${rawPhone1.replace(/[^0-9]/g, '')}?text=${defaultWhatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors border border-transparent hover:border-emerald-200 group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium">ارتباط در واتساپ (WhatsApp)</span>
                </div>
                <span className="text-[10px] text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">ارسال پیام</span>
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/MahaamGroup"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50 text-slate-700 hover:text-sky-700 transition-colors border border-transparent hover:border-sky-200 group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium">ارتباط در تلگرام (Telegram)</span>
                </div>
                <span className="text-[10px] text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity">مشاهده</span>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/mahaamgroup"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-pink-50 text-slate-700 hover:text-pink-700 transition-colors border border-transparent hover:border-pink-200 group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium">اینستاگرام رسمی (Instagram)</span>
                </div>
                <span className="text-[10px] text-pink-600 opacity-0 group-hover:opacity-100 transition-opacity">دنبال کردن</span>
              </a>

              {/* Direct Phone Call 1 */}
              <a
                href={`tel:${rawPhone1}`}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-[#2E7D32] transition-colors border border-transparent hover:border-emerald-200 group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#2E7D32] flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium">تماس تلفنی با خط ۱: {phone1}</span>
                </div>
                <span className="text-[10px] text-[#2E7D32] opacity-0 group-hover:opacity-100 transition-opacity">تماس</span>
              </a>

              {/* Direct Phone Call 2 */}
              <a
                href={`tel:${rawPhone2}`}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-[#2E7D32] transition-colors border border-transparent hover:border-emerald-200 group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#2E7D32] flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium">تماس تلفنی با خط ۲: {phone2}</span>
                </div>
                <span className="text-[10px] text-[#2E7D32] opacity-0 group-hover:opacity-100 transition-opacity">تماس</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Icon Trigger Button (Light Green per user request) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-3.5 rounded-full shadow-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#84CC16] relative bg-gradient-to-tr from-[#6DA616] to-[#84CC16] hover:from-[#5B8C12] hover:to-[#6DA616] text-white border border-lime-200/50 shadow-lime-950/20"
        aria-label="ارتباط مستقیم در شبکه‌های اجتماعی و تلفن مهام"
        title="ارتباط مستقیم در شبکه‌های اجتماعی و تلفن مهام"
      >
        <Phone className="w-4 h-4 text-white" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-[#6DA616] animate-pulse" />
      </motion.button>
    </div>
  );
};
