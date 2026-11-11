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
  ArrowRight,
  Radio,
  Wifi,
  WifiOff,
  Clock
} from 'lucide-react';
import { chatStore, ChatMessage as StoreMessage } from '../../lib/chatStore';
import { authStore } from '../../lib/authStore';
import { aiKnowledgeStore } from '../../lib/aiKnowledgeStore';

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

  // Online / Offline Status of Experts
  const [isExpertsOnline, setIsExpertsOnline] = useState<boolean>(() => authStore.areExpertsOnline());

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

  const initialWelcomeText = 'درود بر شما. من مشاور هوشمند گروه بین‌المللی مهام هستم. پاسخگویی من صرفاً محدود و منطبق بر پایگاه دانش مکتوب و مصوب گروه مهام است. در چه زمینه‌ای مایلید اطلاعات تخصصی و مستند دریافت فرمایید؟';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'bot',
      senderName: 'مشاور هوشمند گروه مهام',
      text: initialWelcomeText,
      timestamp: 'هم‌اکنون',
      suggestedActions: [
        { label: 'شرایط کادر درمان و پزشکان', action: 'health' },
        { label: 'هیئت‌های تخصصی حقوقی لاهه', action: 'legal' },
        { label: 'توسعه شرکت‌ها و سرمایه‌گذاری', action: 'business' },
        { label: 'خط‌مشی واقع‌بینی و تضمین‌ها', action: 'realism' }
      ]
    }
  ]);

  // Monitor online status & session initialization
  useEffect(() => {
    // Check initial online status
    setIsExpertsOnline(authStore.areExpertsOnline());

    const unsubAuth = authStore.subscribe(() => {
      setIsExpertsOnline(authStore.areExpertsOnline());
    });

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
    const unsubChats = chatStore.subscribe(() => {
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

    return () => {
      unsubAuth();
      unsubChats();
    };
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
      senderName: 'سیستم ثبت گروه مهام',
      text: `اطلاعات تماس شما (${fullNameWithPrefix} - ${userPhone}) با موفقیت ثبت شد. پیام‌ها و درخواست شما جهت پیگیری مستقیم در کارتابل کارشناسان رسمی گروه بین‌المللی مهام قرار گرفت.`,
      timestamp: 'هم‌اکنون'
    };
    setMessages(prev => [...prev, ackMsg]);
    chatStore.saveClientMessage({
      sessionId,
      userName: fullNameWithPrefix,
      userPhone: userPhone.trim(),
      message: { sender: 'assistant', text: ackMsg.text, senderName: 'سیستم ثبت گروه مهام' }
    });
  };

  // Strictly evaluated AI response using the admin-managed knowledge base
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
      // STRICT MATCH ONLY from admin knowledge store
      const matchResult = aiKnowledgeStore.findStrictMatch(text);

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        senderName: 'مشاور هوشمند گروه مهام',
        text: matchResult.response,
        timestamp: 'هم‌اکنون',
        suggestedActions: matchResult.action ? [matchResult.action] : undefined
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);

      // Archive AI response to chatStore
      chatStore.saveClientMessage({
        sessionId,
        message: { sender: 'assistant', text: matchResult.response, senderName: 'مشاور هوشمند گروه مهام' }
      });
    }, 600);
  };

  const handleActionClick = (action: string) => {
    if (action.startsWith('handoff') || action === 'handoff') {
      setShowHandoffModal(true);
      return;
    }
    if (action.startsWith('tel:') || action === 'call') {
      window.location.href = 'tel:+982122663002';
      return;
    }
    if (action === 'health') {
      handleSendMessage('شرایط و مراحل تطبیق مدرک کادر درمان و پزشکان در گروه مهام');
      return;
    }
    if (action === 'legal') {
      handleSendMessage('درباره هیئت‌های تخصصی حقوقی لاهه گروه مهام توضیح دهید');
      return;
    }
    if (action === 'business') {
      handleSendMessage('برای ثبت شرکت و سرمایه‌گذاری بین‌المللی در گروه مهام چه روندی وجود دارد؟');
      return;
    }
    if (action === 'realism') {
      handleSendMessage('خط مشی واقع‌بینی حقوقی و عدم وعده تضمین در گروه مهام');
      return;
    }
    if (action.startsWith('/')) {
      window.location.href = action;
      setIsOpen(false);
      return;
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
      senderName: 'سیستم گروه مهام',
      text: `درخواست ارتباط مستقیم شما با کارشناسان گروه مهام ثبت گردید.\nکد رهگیری: ${refNumber}\nکارشناس ذی‌صلاح در دپارتمان تخصصی در اسرع وقت با شماره ${expertPhone} تماس حاصل خواهد کرد.`,
      timestamp: 'هم‌اکنون'
    };
    setMessages(prev => [...prev, handoffMsg]);
    chatStore.saveClientMessage({
      sessionId,
      userName: expertName,
      userPhone: expertPhone,
      message: { sender: 'assistant', text: handoffMsg.text, senderName: 'سیستم گروه مهام' }
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
        senderName: 'مشاور هوشمند گروه مهام',
        text: initialWelcomeText,
        timestamp: 'هم‌اکنون',
        suggestedActions: [
          { label: 'شرایط کادر درمان و پزشکان', action: 'health' },
          { label: 'هیئت‌های تخصصی حقوقی لاهه', action: 'legal' },
          { label: 'توسعه شرکت‌ها و سرمایه‌گذاری', action: 'business' },
          { label: 'خط‌مشی واقع‌بینی و تضمین‌ها', action: 'realism' }
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
          aria-label="چت آنلاین با مشاور هوشمند گروه مهام"
          title="چت آنلاین با مشاور هوشمند گروه مهام"
        >
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-[#3658B6] flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#9FC9E8]" />
            </div>
            <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${
              isExpertsOnline ? 'bg-[#6DA616]' : 'bg-amber-400'
            }`} />
          </div>
          <div className="text-right leading-tight">
            <span className="text-xs font-bold block text-white">مشاور هوشمند گروه مهام</span>
            <span className="text-[10px] text-[#9FC9E8] block">
              {isExpertsOnline ? 'کارشناسان هم‌اکنون آنلاینند' : 'پاسخگویی سریع ۲۴/۷'}
            </span>
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
            className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 w-[94vw] sm:w-[450px] max-h-[84vh] h-[630px] bg-white rounded-3xl shadow-2xl border border-[#BAC3CE]/50 flex flex-col z-50 overflow-hidden font-sans text-right"
          >
            {/* Header */}
            <div className="bg-[#0C2340] text-white p-4 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-[#3658B6] flex items-center justify-center text-white shadow-inner">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0C2340] ${
                    isExpertsOnline ? 'bg-[#6DA616]' : 'bg-amber-400'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">مشاور هوشمند گروه مهام</span>
                    <span className="text-[9px] bg-white/10 text-[#9FC9E8] px-1.5 py-0.5 rounded-md font-mono">
                      {sessionId ? `#${sessionId.slice(-6)}` : 'فعال'}
                    </span>
                  </div>
                  {/* Real-time Online/Offline indicator */}
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {isExpertsOnline ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>کارشناسان گروه مهام هم‌اکنون آنلاین هستند</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 font-medium">
                        <Clock className="w-3 h-3 text-amber-300" />
                        <span>کارشناسان آفلاین | پاسخ در اولین فرصت</span>
                      </span>
                    )}
                  </div>
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

            {/* Offline Status Alert Banner if experts are currently offline */}
            {!isExpertsOnline && (
              <div className="bg-amber-500/10 border-b border-amber-500/20 px-3.5 py-2.5 flex items-start gap-2.5 text-xs text-amber-950 shrink-0">
                <WifiOff className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-justify text-justify-inter-word font-medium">
                  در حال حاضر کارشناسان گروه مهام آنلاین نیستند. لطفاً پیامتون رو ثبت کنید و شماره‌تون رو وارد نمایید. کارشناسان گروه مهام در اولین فرصت به پیام شما پاسخ خواهند داد.
                </p>
              </div>
            )}

            {/* Quick Action Top Bar: Connect to Human Expert */}
            <div className="bg-[#EEF1F3] px-3.5 py-2 flex items-center justify-between border-b border-[#BAC3CE]/30 text-xs shrink-0">
              <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0D5A63]" />
                <span>پاسخگویی صرفاً منطبق بر پایگاه دانش مصوب</span>
              </div>
              <button
                onClick={() => setShowHandoffModal(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#3658B6] hover:bg-[#2B4696] text-white text-[11px] font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <UserCheck className="w-3 h-3" />
                <span>اتصال به کارشناسان گروه مهام</span>
              </button>
            </div>

            {/* User contact capture notification banner if not yet saved */}
            {!hasSavedContact && showContactPrompt && (
              <div className="bg-amber-50 border-b border-amber-200/80 p-3 shrink-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-900 leading-snug font-medium text-justify text-justify-inter-word">
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
                              {msg.senderName || 'کارشناس رسمی گروه مهام'}
                            </span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-medium">
                              پاسخ مستقیم کارشناس
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3658B6]" />
                            <span className="text-[11px] font-medium text-slate-500">
                              {msg.senderName || 'مشاور هوشمند گروه مهام'}
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed text-justify text-justify-inter-word ${
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
                  placeholder="پرسش خود را بنویسید (مثلاً شرایط کادر درمان یا دوره‌های لاهه)..."
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
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto text-justify text-justify-inter-word">
                    اطلاعات پرونده و پیام شما به کارشناس ارشد دپارتمان مربوطه در گروه بین‌المللی مهام ارجاع گردید.
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
                      <h3 className="text-sm font-bold">اتصال مستقیم به کارشناسان گروه بین‌المللی مهام</h3>
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
                      <label className="text-xs font-semibold text-slate-700 block mb-1">دپارتمان تخصصی مدنظر در گروه مهام</label>
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
                        className="w-full text-xs p-2.5 rounded-xl border border-[#BAC3CE]/60 focus:border-[#3658B6] focus:outline-none text-justify text-justify-inter-word"
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
