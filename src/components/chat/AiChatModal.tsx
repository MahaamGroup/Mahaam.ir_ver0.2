import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Phone, 
  UserCheck, 
  RefreshCw, 
  MessageSquare,
  ShieldCheck,
  ChevronLeft,
  CheckCircle2,
  User,
  ArrowRight
} from 'lucide-react';
import { chatStore, ChatMessage as StoreMessage } from '../../lib/chatStore';

interface Message {
  id: string;
  sender: 'bot' | 'user' | 'expert';
  senderName?: string;
  senderRole?: string;
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
}

export const AiChatModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHandoffModal, setShowHandoffModal] = useState(false);
  const [handoffSuccess, setHandoffSuccess] = useState<string | null>(null);

  // User contact info state
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [titlePrefix, setTitlePrefix] = useState('جناب آقای');
  const [hasSavedContact, setHasSavedContact] = useState(false);
  const [showContactPrompt, setShowContactPrompt] = useState(true);

  // Session ID
  const [sessionId, setSessionId] = useState<string>('');

  // Handoff form fields
  const [expertName, setExpertName] = useState('');
  const [expertPhone, setExpertPhone] = useState('');
  const [expertCategory, setExpertCategory] = useState('health');
  const [expertNote, setExpertNote] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialWelcomeText = 'درود بر شما. من مشاور هوشمند گروه بین‌المللی مهام هستم. رویکرد ما در مهام بر پایه «ارزیابی دقیق صلاحیت و واقع‌بینی حقوقی» است، نه وعده‌های تبلیغاتی. در چه زمینه‌ای مایلید اطلاعات تخصصی و دقیق دریافت کنید؟';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'bot',
      senderName: 'مشاور هوشمند مهام',
      text: initialWelcomeText,
      timestamp: 'هم‌اکنون',
      suggestedActions: [
        { label: 'شرایط کادر درمان و پزشکان', action: 'health' },
        { label: 'هیئت‌های تخصصی حقوقی لاهه', action: 'legal' },
        { label: 'توسعه شرکت‌ها و سرمایه‌گذاری', action: 'business' },
        { label: 'کدام مسیر برای من مناسب است؟', action: 'guidance' }
      ]
    }
  ]);

  // Initialize or restore session
  useEffect(() => {
    let currentSessId = localStorage.getItem('mahaam_current_chat_session_id');
    if (!currentSessId) {
      currentSessId = 'sess-' + Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem('mahaam_current_chat_session_id', currentSessId);
    }
    setSessionId(currentSessId);

    // Check if session exists in chatStore
    const existingSession = chatStore.getSessionById(currentSessId);
    if (existingSession) {
      if (existingSession.userName && existingSession.userName !== 'کاربر مهمان') {
        setUserName(existingSession.userName);
        setUserPhone(existingSession.userPhone || '');
        setHasSavedContact(true);
        setShowContactPrompt(false);
      }
      if (existingSession.messages && existingSession.messages.length > 0) {
        setMessages(
          existingSession.messages.map((m: StoreMessage) => ({
            id: m.id,
            sender: m.sender === 'assistant' ? 'bot' : m.sender,
            senderName: m.senderName,
            senderRole: m.senderRole,
            text: m.text,
            timestamp: new Date(m.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
          }))
        );
      }
    }

    // Subscribe to chatStore updates (e.g. expert replies sent from Admin)
    const unsubscribe = chatStore.subscribe(() => {
      const updated = chatStore.getSessionById(currentSessId!);
      if (updated && updated.messages) {
        setMessages(
          updated.messages.map((m: StoreMessage) => ({
            id: m.id,
            sender: m.sender === 'assistant' ? 'bot' : m.sender,
            senderName: m.senderName,
            senderRole: m.senderRole,
            text: m.text,
            timestamp: new Date(m.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
          }))
        );
      }
    });

    return () => unsubscribe();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  // Handle saving contact information
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim()) return;

    const fullNameWithPrefix = titlePrefix ? `${titlePrefix} ${userName.trim()}` : userName.trim();
    chatStore.updateContact(sessionId, fullNameWithPrefix, userPhone.trim(), titlePrefix);
    setHasSavedContact(true);
    setShowContactPrompt(false);

    // Append acknowledgment in chat
    const ackMsg: Message = {
      id: `ack-${Date.now()}`,
      sender: 'bot',
      senderName: 'سیستم مهام',
      text: `اطلاعات تماس شما (${fullNameWithPrefix} - ${userPhone}) جهت تداوم ارتباط با کارشناسان ارشد ثبت گردید. تمامی پیام‌های این گفتگو برای کارشناسان مهام قابل پیگیری و پاسخگویی خواهد بود.`,
      timestamp: 'هم‌اکنون'
    };
    setMessages(prev => [...prev, ackMsg]);
    chatStore.saveClientMessage({
      sessionId,
      userName: fullNameWithPrefix,
      userPhone: userPhone.trim(),
      message: { sender: 'assistant', text: ackMsg.text, senderName: 'سیستم مهام' }
    });
  };

  // Knowledge response generator
  const generateAiResponse = (userInput: string): { text: string; actions?: { label: string; action: string }[] } => {
    const input = userInput.toLowerCase();

    // 1. Health & Medical
    if (input.includes('پزشک') || input.includes('درمان') || input.includes('پرستار') || input.includes('دندانپزشک') || input.includes('معادل') || input.includes('health')) {
      return {
        text: 'در خصوص کادر درمان و پزشکان محترم: مسیر مهام شامل ارزیابی دقیق دانشنامه، تعیین سطح زبان تخصصی پزشکی (Fachsprachprüfung در آلمان و زبان‌های مقصد)، اخذ تأییدیه مدارک (Approbation / Gleichwertigkeit) و تطبیق دوره‌های کارورزی بالینی است. مهام از عقد قراردادهای بدون بررسی صلاحیت قبلی خودداری می‌کند تا پرونده شما با بیشترین درصد انطباق به جریان بیفتد.',
        actions: [
          { label: 'اتصال به کارشناس سلامت و درمان', action: 'handoff-health' },
          { label: 'مشاهده مسیر بالینی', action: 'view-journey-health' }
        ]
      };
    }

    // 2. Legal / Hague / Courts
    if (input.includes('حقوق') || input.includes('وکالت') || input.includes('دادگاه') || input.includes('لاهه') || input.includes('قضا') || input.includes('hague') || input.includes('legal')) {
      return {
        text: 'گروه بین‌المللی مهام رکورددار برگزاری ۹ دوره متوالی اعزام هیئت‌های تخصصی حقوقی به لاهه هلند (مقر دیوان بین‌المللی دادگستری ICJ و دیوان بین‌المللی کیفری ICC) با همکاری رسمی دانشگاه‌ها و مؤسسات حقوقی برجسته اروپاست. این برنامه‌ها فرصتی کم‌نظیر برای پژوهش، شبکه‌سازی بین‌المللی و کارگاه‌های تخصصی داوری تجاری است.',
        actions: [
          { label: 'رزرو مشاوره با بخش حقوق بین‌الملل', action: 'handoff-legal' },
          { label: 'مشاهده جزئیات دوره لاهه', action: 'view-journey-legal' }
        ]
      };
    }

    // 3. Business / Investment / Enterprise
    if (input.includes('شرکت') || input.includes('سرمایه') || input.includes('تجارت') || input.includes('صادرات') || input.includes('بیزنس') || input.includes('توسعه بازرگانی')) {
      return {
        text: 'برای مدیران عامل و شرکت‌ها، مهام چارچوب ورود قانونی به بازارهای اروپایی و بین‌المللی، ثبت شرکت، اعتبارسنجی شرکای تجاری و ساختارهای انتقال فناوری را با نظارت رسمی و مجوز سازمان توسعه تجارت (TPO) پیاده‌سازی می‌کند. رویکرد ما حفاظت از سرمایه و پایداری زنجیره تأمین است.',
        actions: [
          { label: 'اتصال به مشاور توسعه تجاری', action: 'handoff-business' },
          { label: 'مشاهده مسیر مشارکت تجاری', action: 'view-journey-business' }
        ]
      };
    }

    // 4. Guarantees / Promises / Realism
    if (input.includes('تضمین') || input.includes('گارانتی') || input.includes('صد در صد') || input.includes('وعده') || input.includes('ریسک')) {
      return {
        text: 'اصل محوری گروه مهام «صداقت حرفه‌ای و عدم ارائه وعده‌های پوچ» است. تصمیم‌گیری فرامرزی و اخذ مجوزهای بین‌المللی دارای ضوابط قانونی و بررسی‌های حاکمیتی است؛ لذا مهام به جای وعده تضمین صددرصدی، اقدام به غربالگری اولیه، ارزیابی شفاف شانس موفقیت و عقد قراردادهای شفاف با تعهدات گام‌به‌گام می‌نماید.',
        actions: [
          { label: 'انجام ارزیابی اولیه شایستگی', action: 'eval' },
          { label: 'تماس تلفنی با مشاوران', action: 'call' }
        ]
      };
    }

    // 5. Contact / Phone / Office Address
    if (input.includes('تماس') || input.includes('تلفن') || input.includes('آدرس') || input.includes('دفتر') || input.includes('نوبت') || input.includes('کجاست')) {
      return {
        text: 'دفتر مرکزی مهام در تهران: خیابان جردن (نلسون ماندلا)، خیابان سلطانی (سایه)، پلاک ۸۲، طبقه ۴ مستقر است.\nخطوط اختصاصی مشاوره: ۰۲۱-۲۲۶۶۳۰۰۲ | ۰۲۱-۲۲۶۶۳۰۰۱\nساعات پاسخگویی: شنبه تا چهارشنبه ۹:۰۰ الی ۱۷:۰۰، پنج‌شنبه ۹:۰۰ الی ۱۳:۰۰.\nهمچنین پیام شما در سامانه ثبت شده و کارشناسان ما پاسخگو خواهند بود.',
        actions: [
          { label: 'اتصال به کارشناسان ارشد', action: 'handoff' },
          { label: 'شماره‌گیری تلفن مستقیم', action: 'call' }
        ]
      };
    }

    // Default intelligent guidance
    return {
      text: 'پرسش شما دریافت و در سامانه مهام آرشیو شد. خدمات گروه بین‌المللی مهام در پنج حوزه تخصصی ساماندهی شده است: کادر درمان، مدیران ارشد، حقوق‌دانان، صاحبان صنایع و سرمایه‌گذاران، و خانواده‌ها. کارشناسان ما نیز این گفتگو را مشاهده کرده و در صورت نیاز مستقیماً پاسخ می‌دهند.',
      actions: [
        { label: 'اتصال به کارشناسان ارشد مهام', action: 'handoff' },
        { label: 'بررسی ۵ گام ارزیابی هوشمند', action: 'eval' }
      ]
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'هم‌اکنون'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');

    // Archive user message to chatStore
    chatStore.saveClientMessage({
      sessionId,
      userName: hasSavedContact ? `${titlePrefix ? titlePrefix + ' ' : ''}${userName}` : undefined,
      userPhone: hasSavedContact ? userPhone : undefined,
      message: { sender: 'user', text }
    });

    setIsTyping(true);

    setTimeout(() => {
      const response = generateAiResponse(text);
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        senderName: 'مشاور هوشمند مهام',
        text: response.text,
        timestamp: 'هم‌اکنون',
        suggestedActions: response.actions
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);

      // Archive AI response to chatStore
      chatStore.saveClientMessage({
        sessionId,
        message: { sender: 'assistant', text: response.text, senderName: 'مشاور هوشمند مهام' }
      });
    }, 700);
  };

  const handleActionClick = (action: string) => {
    if (action.startsWith('handoff') || action === 'handoff') {
      setShowHandoffModal(true);
      return;
    }
    if (action === 'call') {
      window.location.href = 'tel:+982122663002';
      return;
    }
    if (action === 'eval') {
      window.location.href = '/decision-engine';
      setIsOpen(false);
      return;
    }
    if (action === 'view-journey-health') {
      window.location.href = '/journeys/clinical-healthcare';
      setIsOpen(false);
      return;
    }
    if (action === 'view-journey-legal') {
      window.location.href = '/journeys/international-law-justice';
      setIsOpen(false);
      return;
    }
    if (action === 'view-journey-business') {
      window.location.href = '/journeys/enterprise-partnership';
      setIsOpen(false);
      return;
    }
    if (action === 'health') {
      handleSendMessage('شرایط و مراحل تطبیق مدرک کادر درمان و پزشکان چگونه است؟');
    } else if (action === 'legal') {
      handleSendMessage('درباره هیئت‌های تخصصی حقوقی لاهه و دیوان‌های بین‌المللی توضیح دهید.');
    } else if (action === 'business') {
      handleSendMessage('برای ثبت شرکت و سرمایه‌گذاری بین‌المللی چه روندی دارید؟');
    } else if (action === 'guidance') {
      handleSendMessage('بر چه اساسی مسیر مناسب برای هر شخص تعیین می‌شود؟');
    }
  };

  const handleHandoffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expertName || !expertPhone) return;

    const refNumber = 'MHM-' + Math.floor(10000 + Math.random() * 90000);
    setHandoffSuccess(refNumber);

    // Also update current session contact
    chatStore.updateContact(sessionId, expertName, expertPhone);
    setUserName(expertName);
    setUserPhone(expertPhone);
    setHasSavedContact(true);
    setShowContactPrompt(false);

    // Add notification inside chat
    const handoffMsg: Message = {
      id: `h-${Date.now()}`,
      sender: 'bot',
      senderName: 'سیستم مهام',
      text: `درخواست ارتباط مستقیم شما با کارشناسان ثبت شد.\nکد رهگیری: ${refNumber}\nکارشناس ارشد مهام به زودی با شماره ${expertPhone} تماس حاصل خواهد کرد.`,
      timestamp: 'هم‌اکنون'
    };
    setMessages(prev => [...prev, handoffMsg]);
    chatStore.saveClientMessage({
      sessionId,
      userName: expertName,
      userPhone: expertPhone,
      message: { sender: 'assistant', text: handoffMsg.text, senderName: 'سیستم مهام' }
    });
  };

  const resetChat = () => {
    const newSessId = 'sess-' + Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem('mahaam_current_chat_session_id', newSessId);
    setSessionId(newSessId);
    setMessages([
      {
        id: `m-init-${Date.now()}`,
        sender: 'bot',
        senderName: 'مشاور هوشمند مهام',
        text: initialWelcomeText,
        timestamp: 'هم‌اکنون',
        suggestedActions: [
          { label: 'شرایط کادر درمان و پزشکان', action: 'health' },
          { label: 'هیئت‌های تخصصی حقوقی لاهه', action: 'legal' },
          { label: 'توسعه شرکت‌ها و سرمایه‌گذاری', action: 'business' },
          { label: 'کدام مسیر برای من مناسب است؟', action: 'guidance' }
        ]
      }
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden font-sans">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#0C2340] to-[#1a3d6d] hover:from-[#123157] hover:to-[#224e87] text-white shadow-xl border border-white/20 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3658B6] group"
          aria-label="چت آنلاین با مشاور هوشمند مهام"
          title="چت آنلاین با مشاور هوشمند مهام"
        >
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-[#3658B6] flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#9FC9E8]" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#6DA616]" />
          </div>
          <div className="text-right leading-tight">
            <span className="text-xs font-bold block text-white">مشاور هوشمند مهام</span>
            <span className="text-[10px] text-[#9FC9E8] block">پاسخگویی سریع ۲۴/۷</span>
          </div>
        </motion.button>
      </div>

      {/* Main Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 w-[94vw] sm:w-[440px] max-h-[82vh] h-[610px] bg-white rounded-3xl shadow-2xl border border-[#BAC3CE]/50 flex flex-col z-50 overflow-hidden font-sans text-right"
          >
            {/* Header */}
            <div className="bg-[#0C2340] text-white p-4 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-[#3658B6] flex items-center justify-center text-white shadow-inner">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#6DA616] border-2 border-[#0C2340]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">مشاور هوشمند و کارشناسان مهام</span>
                    <span className="text-[9px] bg-white/10 text-[#9FC9E8] px-1.5 py-0.5 rounded-md font-mono">
                      {sessionId ? `#${sessionId.slice(-6)}` : 'آنلاین'}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#9FC9E8] block">راهنمای تخصصی مسیرهای بین‌المللی</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={resetChat}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  title="گفتگوی جدید"
                  aria-label="شروع مجدد گفتگو"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  title="بستن"
                  aria-label="بستن پنجره چت"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Action Top Bar: Connect to Human Expert */}
            <div className="bg-[#EEF1F3] px-3.5 py-2 flex items-center justify-between border-b border-[#BAC3CE]/30 text-xs shrink-0">
              <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0D5A63]" />
                <span>پاسخگویی مستند و آرشیو رسمی</span>
              </div>
              <button
                onClick={() => setShowHandoffModal(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#3658B6] hover:bg-[#2B4696] text-white text-[11px] font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <UserCheck className="w-3 h-3" />
                <span>اتصال به کارشناسان ارشد</span>
              </button>
            </div>

            {/* User contact capture notification banner if not yet saved */}
            {!hasSavedContact && showContactPrompt && (
              <div className="bg-amber-50 border-b border-amber-200/80 p-3 shrink-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-900 leading-snug font-medium">
                      «برای از دست نرفتن پیام‌ها و تداوم ارتباط با کارشناسان، لطفاً نام و شماره همراه خود را وارد نمایید.»
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowContactPrompt(false)}
                    className="text-amber-500 hover:text-amber-800 p-0.5"
                    title="رد کردن موقت"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <form onSubmit={handleSaveContact} className="grid grid-cols-12 gap-1.5">
                  <div className="col-span-3">
                    <select
                      value={titlePrefix}
                      onChange={(e) => setTitlePrefix(e.target.value)}
                      className="w-full text-[11px] py-1 px-1 rounded-lg border border-amber-300 bg-white text-slate-800"
                    >
                      <option value="جناب آقای">آقای</option>
                      <option value="سرکار خانم">خانم</option>
                      <option value="دکتر">دکتر</option>
                      <option value="مهندس">مهندس</option>
                      <option value="استاد">استاد</option>
                    </select>
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      required
                      placeholder="نام و نام خانوادگی"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full text-[11px] py-1 px-2 rounded-lg border border-amber-300 bg-white placeholder-slate-400 focus:outline-none focus:border-[#3658B6]"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="tel"
                      required
                      placeholder="۰۹۱۲۰۰۰۰۰۰۰"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      dir="ltr"
                      className="w-full text-[11px] py-1 px-2 rounded-lg border border-amber-300 bg-white placeholder-slate-400 focus:outline-none focus:border-[#3658B6] text-right"
                    />
                  </div>
                  <div className="col-span-2">
                    <button
                      type="submit"
                      className="w-full py-1 rounded-lg bg-[#0C2340] hover:bg-[#3658B6] text-white text-[11px] font-bold transition-colors cursor-pointer text-center"
                    >
                      ثبت
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F6F1]/50">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isExpert = msg.sender === 'expert';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    {/* Sender Label */}
                    {!isUser && (
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        {isExpert ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[11px] font-bold text-emerald-800">
                              {msg.senderName || 'کارشناس رسمی مهام'}
                            </span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-medium">
                              پاسخ مستقیم کارشناس
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3658B6]" />
                            <span className="text-[11px] font-medium text-slate-500">
                              {msg.senderName || 'مشاور هوشمند مهام'}
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed ${
                        isUser
                          ? 'bg-[#3658B6] text-white rounded-tl-none shadow-md'
                          : isExpert
                          ? 'bg-emerald-50 text-slate-800 border-2 border-emerald-400/80 rounded-tr-none shadow-sm whitespace-pre-line'
                          : 'bg-white text-slate-800 border border-[#BAC3CE]/40 rounded-tr-none shadow-xs whitespace-pre-line'
                      }`}
                    >
                      {msg.text}
                    </div>

                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>

                    {/* Suggested Quick Action Chips */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                        {msg.suggestedActions.map((act, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleActionClick(act.action)}
                            className="px-2.5 py-1 rounded-lg bg-white border border-[#3658B6]/30 text-[#0C2340] hover:bg-[#3658B6] hover:text-white transition-all text-[11px] font-medium shadow-2xs cursor-pointer flex items-center gap-1"
                          >
                            <span>{act.label}</span>
                            <ChevronLeft className="w-2.5 h-2.5 opacity-60" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-1.5 bg-white p-3 rounded-2xl border border-[#BAC3CE]/40 w-20 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#3658B6] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#3658B6] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#3658B6] animate-bounce [animation-delay:0.4s]" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-[#EEF1F3] shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="پرسش خود را بنویسید (مثلاً شرایط پزشکان یا دوره‌های لاهه)..."
                  className="flex-1 bg-[#EEF1F3] text-slate-800 placeholder-slate-400 text-xs sm:text-[13px] rounded-xl px-3.5 py-2.5 border border-transparent focus:border-[#3658B6] focus:bg-white focus:outline-none transition-all text-right"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 rounded-xl bg-[#0C2340] hover:bg-[#3658B6] text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                  aria-label="ارسال پیام"
                >
                  <Send className="w-4 h-4 rotate-180" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Human Expert Handoff Modal */}
      <AnimatePresence>
        {showHandoffModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans text-right">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#BAC3CE]/40 relative overflow-hidden"
            >
              <button
                onClick={() => {
                  setShowHandoffModal(false);
                  setHandoffSuccess(null);
                }}
                className="absolute top-4 left-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>

              {handoffSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0C2340]">درخواست شما با موفقیت ثبت گردید</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    اطلاعات پرونده به کارشناس ارشد دپارتمان مربوطه ارجاع گردید.
                  </p>
                  <div className="p-3 bg-[#EEF1F3] rounded-2xl border border-[#BAC3CE]/40 inline-block font-mono text-sm font-bold text-[#0C2340]">
                    کد رهگیری: {handoffSuccess}
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setShowHandoffModal(false);
                        setHandoffSuccess(null);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-[#0C2340] hover:bg-[#3658B6] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      بازگشت به گفتگو
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleHandoffSubmit} className="space-y-4">
                  <div className="flex items-center gap-2.5 text-[#0C2340] border-b border-[#EEF1F3] pb-3">
                    <div className="w-8 h-8 rounded-xl bg-[#0C2340] text-white flex items-center justify-center">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">اتصال مستقیم به کارشناسان ارشد مهام</h3>
                      <span className="text-[11px] text-slate-500">بررسی تخصصی و تماس مشاور ذی‌صلاح</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">نام و نام‌خانوادگی</label>
                      <input
                        type="text"
                        required
                        value={expertName}
                        onChange={(e) => setExpertName(e.target.value)}
                        placeholder="مثال: دکتر سهرابی"
                        className="w-full text-xs p-2.5 rounded-xl border border-[#BAC3CE]/60 focus:border-[#3658B6] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">شماره تماس (همراه یا ثابت)</label>
                      <input
                        type="tel"
                        required
                        value={expertPhone}
                        onChange={(e) => setExpertPhone(e.target.value)}
                        placeholder="۰۹۱۲۰۰۰۰۰۰۰ یا ۰۲۱۲۲۶۶۳۰۰۲"
                        className="w-full text-xs p-2.5 rounded-xl border border-[#BAC3CE]/60 focus:border-[#3658B6] focus:outline-none dir-ltr text-right"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">دپارتمان تخصصی مدنظر</label>
                      <select
                        value={expertCategory}
                        onChange={(e) => setExpertCategory(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-[#BAC3CE]/60 focus:border-[#3658B6] focus:outline-none bg-white"
                      >
                        <option value="health">دپارتمان سلامت و کادر درمان (تطبیق و معادل‌سازی)</option>
                        <option value="legal">دپارتمان حقوق بین‌الملل و هیئت‌های تخصصی لاهه</option>
                        <option value="enterprise">دپارتمان شرکت‌ها، سرمایه‌گذاری و تجارت فرامرزی</option>
                        <option value="executive">دپارتمان رهبری و مدیران ارشد اجرایی</option>
                        <option value="family">دپارتمان خانواده و آینده تحصیلی</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">توضیح مختصر یا سوال اصلی (اختیاری)</label>
                      <textarea
                        rows={2}
                        value={expertNote}
                        onChange={(e) => setExpertNote(e.target.value)}
                        placeholder="خلاصه‌ای از وضعیت پرونده یا مقصد مدنظر..."
                        className="w-full text-xs p-2.5 rounded-xl border border-[#BAC3CE]/60 focus:border-[#3658B6] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <a
                      href="tel:+982122663002"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#3658B6] transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>تماس مستقیم: ۰۲۱-۲۲۶۶۳۰۰۲</span>
                    </a>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#0C2340] hover:bg-[#3658B6] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                    >
                      ثبت و تخصیص کارشناس
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
