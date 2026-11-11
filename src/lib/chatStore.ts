// Chat Archive and Live/Offline Messaging Store for Mahaam International Group

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'expert';
  senderName?: string;
  senderRole?: 'expert' | 'senior_expert' | 'admin' | 'ai';
  text: string;
  timestamp: string; // ISO string
}

export interface ChatSession {
  id: string;
  sessionId: string;
  userName?: string;
  userPhone?: string;
  titlePrefix?: string;
  createdAt: string;
  updatedAt: string;
  lastMessageSnippet: string;
  unreadByAdmin: boolean;
  status: 'active' | 'waiting_for_expert' | 'resolved' | 'closed';
  assignedTo?: string; // expert ID
  assignedExpertName?: string;
  isTrashed?: boolean;
  messages: ChatMessage[];
}

const CHAT_STORAGE_KEY = 'mahaam_chat_sessions_db_v1';
const CHAT_EVENT = 'mahaam_chats_updated';

// Realistic sample seed data to showcase live & offline conversations
const SEED_CHATS: ChatSession[] = [
  {
    id: 'chat-001',
    sessionId: 'sess-849201',
    userName: 'دکتر آرش پارسا',
    userPhone: '09123456789',
    titlePrefix: 'دکتر',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    lastMessageSnippet: 'کارشناس محترم، آیا ثبت شرکت برای من در امارات ملزم به حضور فیزیکی دائم هست؟',
    unreadByAdmin: true,
    status: 'waiting_for_expert',
    assignedTo: 'user-expert-1',
    assignedExpertName: 'دکتر علیرضا رضایی (کارشناس ارشد حقوق بین‌الملل)',
    isTrashed: false,
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'سلام و وقت بخیر، من جراح عمومی هستم و می‌خواهم در مورد شرایط ثبت کلینیک و اقامت امارات سوال بپرسم.',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'm2',
        sender: 'assistant',
        senderName: 'دستیار هوشمند مهام',
        senderRole: 'ai',
        text: 'درود بر شما دکتر پارسای عزیز. گروه بین‌المللی مهام سال‌ها تجربه موفق در حوزه لاین‌های تخصصی سلامت و راه‌اندازی مراکز پزشکی در دبی و شارجه دارد. برای پزشکان، معادل‌سازی مدرک DHA/MOH و ثبت شرکت در مناطق آزاد تجاری (Free Zone) یا سرزمین اصلی امکان‌پذیر است.',
        timestamp: new Date(Date.now() - 3600000 * 4.9).toISOString(),
      },
      {
        id: 'm3',
        sender: 'user',
        text: 'کارشناس محترم، آیا ثبت شرکت برای من در امارات ملزم به حضور فیزیکی دائم هست یا با مدیریت از راه دور هم میشه؟',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      }
    ]
  },
  {
    id: 'chat-002',
    sessionId: 'sess-719342',
    userName: 'مهندس سارا کیانی',
    userPhone: '09129876543',
    titlePrefix: 'مهندس',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    lastMessageSnippet: 'پاسخ ارسالی کارشناس: مدارک اولیه استارتاپ ویزای کانادا برای شما بررسی شد.',
    unreadByAdmin: false,
    status: 'active',
    assignedTo: 'user-expert-2',
    assignedExpertName: 'مهندس مریم کاظمی (کارشناس مهاجرت کاری و سرمایه‌گذاری)',
    isTrashed: false,
    messages: [
      {
        id: 'm2-1',
        sender: 'user',
        text: 'سلام وقت بخیر، یک استارتاپ حوزه هوش مصنوعی در حوزه تجهیزات پزشکی داریم و می‌خواهیم برای ویزای استارتاپ اقدام کنیم.',
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
      {
        id: 'm2-2',
        sender: 'expert',
        senderName: 'مهندس مریم کاظمی',
        senderRole: 'expert',
        text: 'سلام و احترام خانم مهندس کیانی. پیچ‌دک اولیه و طرح تجاری شما بسیار نویدبخش است. برای استارتاپ ویزای کانادا، دریافت Letter of Support از انکوباتورهای منتخب الزامی است. جهت تنظیم جلسه اسکایپ با وکیل رسمی CICC با شما تماس خواهیم گرفت.',
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
      }
    ]
  },
  {
    id: 'chat-003',
    sessionId: 'sess-anonymous-391',
    userName: 'کاربر مهمان',
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    lastMessageSnippet: 'شرایط جاب‌آفر آلمان و بلوکارت برای مهندسی مکانیک چیست؟',
    unreadByAdmin: true,
    status: 'active',
    isTrashed: false,
    messages: [
      {
        id: 'm3-1',
        sender: 'user',
        text: 'شرایط جاب‌آفر آلمان و بلوکارت برای مهندسی مکانیک چیست؟',
        timestamp: new Date(Date.now() - 3600000 * 30).toISOString(),
      },
      {
        id: 'm3-2',
        sender: 'assistant',
        senderName: 'دستیار هوشمند مهام',
        senderRole: 'ai',
        text: 'سلام کاربر گرامی. طبق قانون جدید مهاجرت نیروی متخصص آلمان (Chancenkarte و Blue Card)، حداقل سابقه کار و حقوق مصوب سالانه متناسب با مدرک تحصیلی ارزیابی‌شده در زاب (ZAB) ملاک عمل است. جهت ارتباط مستقیم کارشناسان مهاجرت کاری ما، می‌توانید نام و شماره همراه خود را ثبت نمایید.',
        timestamp: new Date(Date.now() - 3600000 * 29.8).toISOString(),
      }
    ]
  }
];

function getStoredSessions(): ChatSession[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(CHAT_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(SEED_CHATS));
    return SEED_CHATS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return SEED_CHATS;
  }
}

function saveSessions(sessions: ChatSession[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions));
  window.dispatchEvent(new Event(CHAT_EVENT));
}

export const chatStore = {
  subscribe(callback: () => void) {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener(CHAT_EVENT, callback);
    return () => window.removeEventListener(CHAT_EVENT, callback);
  },

  getAllSessions(): ChatSession[] {
    return getStoredSessions();
  },

  getActiveSessions(expertId?: string): ChatSession[] {
    const list = getStoredSessions().filter(s => !s.isTrashed);
    if (!expertId) return list;
    // An expert sees either unassigned or assigned to them
    return list.filter(s => !s.assignedTo || s.assignedTo === expertId);
  },

  getTrashedSessions(): ChatSession[] {
    return getStoredSessions().filter(s => s.isTrashed);
  },

  getSessionById(id: string): ChatSession | undefined {
    return getStoredSessions().find(s => s.id === id || s.sessionId === id);
  },

  // Save or update an existing session from client
  saveClientMessage(params: {
    sessionId: string;
    userName?: string;
    userPhone?: string;
    message: { sender: 'user' | 'assistant'; text: string; senderName?: string };
  }): ChatSession {
    const sessions = getStoredSessions();
    let session = sessions.find(s => s.sessionId === params.sessionId);

    const now = new Date().toISOString();
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      sender: params.message.sender,
      senderName: params.message.senderName,
      senderRole: params.message.sender === 'assistant' ? 'ai' : undefined,
      text: params.message.text,
      timestamp: now,
    };

    if (!session) {
      session = {
        id: 'chat-' + Date.now(),
        sessionId: params.sessionId,
        userName: params.userName || 'کاربر مهمان',
        userPhone: params.userPhone,
        createdAt: now,
        updatedAt: now,
        lastMessageSnippet: params.message.text.slice(0, 80),
        unreadByAdmin: params.message.sender === 'user',
        status: 'active',
        isTrashed: false,
        messages: [newMsg],
      };
      sessions.unshift(session);
    } else {
      if (params.userName && !session.userName) session.userName = params.userName;
      if (params.userPhone && !session.userPhone) session.userPhone = params.userPhone;
      session.updatedAt = now;
      session.lastMessageSnippet = params.message.text.slice(0, 80);
      if (params.message.sender === 'user') {
        session.unreadByAdmin = true;
      }
      session.messages.push(newMsg);
    }

    saveSessions(sessions);
    return session;
  },

  // Update contact information for an existing session
  updateContact(sessionId: string, userName: string, userPhone: string, titlePrefix?: string): boolean {
    const sessions = getStoredSessions();
    const session = sessions.find(s => s.sessionId === sessionId || s.id === sessionId);
    if (!session) return false;

    session.userName = userName;
    session.userPhone = userPhone;
    if (titlePrefix) session.titlePrefix = titlePrefix;
    session.updatedAt = new Date().toISOString();

    saveSessions(sessions);
    return true;
  },

  // Send expert live or offline reply
  replyAsExpert(params: {
    sessionId: string;
    expertId: string;
    expertName: string;
    expertRole: 'expert' | 'senior_expert' | 'admin';
    text: string;
  }): boolean {
    const sessions = getStoredSessions();
    const session = sessions.find(s => s.id === params.sessionId || s.sessionId === params.sessionId);
    if (!session) return false;

    const now = new Date().toISOString();
    const newMsg: ChatMessage = {
      id: 'msg-exp-' + Date.now(),
      sender: 'expert',
      senderName: params.expertName,
      senderRole: params.expertRole,
      text: params.text,
      timestamp: now,
    };

    session.messages.push(newMsg);
    session.updatedAt = now;
    session.lastMessageSnippet = `پاسخ ${params.expertName}: ${params.text.slice(0, 60)}`;
    session.unreadByAdmin = false;
    session.status = 'active';
    if (!session.assignedTo) {
      session.assignedTo = params.expertId;
      session.assignedExpertName = params.expertName;
    }

    saveSessions(sessions);
    return true;
  },

  // Assign session to an expert
  assignSession(sessionId: string, expertId: string, expertName: string): boolean {
    const sessions = getStoredSessions();
    const session = sessions.find(s => s.id === sessionId || s.sessionId === sessionId);
    if (!session) return false;

    session.assignedTo = expertId;
    session.assignedExpertName = expertName;
    session.updatedAt = new Date().toISOString();

    saveSessions(sessions);
    return true;
  },

  // Move session to trash
  moveToTrash(sessionId: string): boolean {
    const sessions = getStoredSessions();
    const session = sessions.find(s => s.id === sessionId || s.sessionId === sessionId);
    if (!session) return false;

    session.isTrashed = true;
    saveSessions(sessions);
    return true;
  },

  // Restore session
  restoreFromTrash(sessionId: string): boolean {
    const sessions = getStoredSessions();
    const session = sessions.find(s => s.id === sessionId || s.sessionId === sessionId);
    if (!session) return false;

    session.isTrashed = false;
    saveSessions(sessions);
    return true;
  },

  // Delete permanently
  deletePermanently(sessionId: string): boolean {
    let sessions = getStoredSessions();
    sessions = sessions.filter(s => s.id !== sessionId && s.sessionId !== sessionId);
    saveSessions(sessions);
    return true;
  }
};
