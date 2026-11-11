import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, FileDown, Send, MessageCircle, Smartphone, Check, Copy, X } from 'lucide-react';

interface ShareFloatingBarProps {
  currentPath?: string;
}

export const ShareFloatingBar: React.FC<ShareFloatingBarProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 280);
  };

  const getShareData = () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://mahaam.ir';
    const title = typeof document !== 'undefined' ? document.title : 'گروه بین‌المللی مهام';
    return { url, title };
  };

  const handleShareTelegram = () => {
    const { url, title } = getShareData();
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + ' | گروه بین‌المللی مهام')}`;
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    const { url, title } = getShareData();
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + '\n' + url)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareSms = () => {
    const { url, title } = getShareData();
    const smsUrl = `sms:?body=${encodeURIComponent(title + ':\n' + url)}`;
    window.location.href = smsUrl;
  };

  const handleCopyLink = async () => {
    const { url } = getShareData();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrintPdf = () => {
    window.print();
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
            initial={{ opacity: 0, scale: 0.85, x: -14 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: -14 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-14 top-0 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#BAC3CE]/60 p-2.5 flex flex-col gap-1.5 min-w-[195px] text-right z-50 pointer-events-auto"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-[#EEF1F3] px-1">
              <span className="text-[11px] font-bold text-[#0C2340]">اشتراک‌گذاری و خروجی</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer"
                aria-label="بستن"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Telegram */}
            <button
              onClick={handleShareTelegram}
              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-sky-50 text-slate-700 hover:text-sky-700 transition-colors text-xs font-medium cursor-pointer"
              title="اشتراک‌گذاری در تلگرام"
            >
              <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                <Send className="w-3.5 h-3.5" />
              </div>
              <span>ارسال در تلگرام</span>
            </button>

            {/* WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors text-xs font-medium cursor-pointer"
              title="اشتراک‌گذاری در واتساپ"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <MessageCircle className="w-3.5 h-3.5" />
              </div>
              <span>ارسال در واتساپ</span>
            </button>

            {/* SMS */}
            <button
              onClick={handleShareSms}
              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-50 text-slate-700 hover:text-amber-700 transition-colors text-xs font-medium cursor-pointer"
              title="اشتراک‌گذاری با پیامک"
            >
              <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <span>پیامک (SMS)</span>
            </button>

            {/* Copy URL */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-[#3658B6] transition-colors text-xs font-medium cursor-pointer"
              title="کپی لینک صفحه"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-[#3658B6] flex items-center justify-center shrink-0">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </div>
              <span>{copied ? 'لینک کپی شد!' : 'کپی لینک صفحه'}</span>
            </button>

            <div className="border-t border-[#EEF1F3] pt-1">
              {/* Save as PDF */}
              <button
                onClick={handlePrintPdf}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-[#0C2340] hover:bg-[#3658B6] text-white transition-colors text-xs font-medium cursor-pointer shadow-sm"
                title="ذخیره و چاپ PDF صفحه"
              >
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <FileDown className="w-3.5 h-3.5" />
                </div>
                <span>ذخیره PDF صفحه</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating icon trigger */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-full shadow-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3658B6] ${
          isOpen
            ? 'bg-[#3658B6] text-white border-white/20 shadow-[#3658B6]/30'
            : 'bg-white text-[#0C2340] border-[#BAC3CE]/60 hover:bg-[#EEF1F3]'
        }`}
        aria-label="اشتراک‌گذاری و ذخیره PDF صفحه"
        title="اشتراک‌گذاری و ذخیره PDF صفحه"
      >
        <Share2 className="w-4 h-4" />
      </motion.button>
    </div>
  );
};
