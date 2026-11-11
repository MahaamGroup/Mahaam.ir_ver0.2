/**
 * AI Knowledge Base Store for Mahaam International Group
 * Strict knowledge boundary: The AI assistant is constrained to ONLY answer
 * based on entries and policy defined here by the senior admin.
 */

export interface KnowledgeItem {
  id: string;
  category: 'health' | 'legal' | 'enterprise' | 'executive' | 'family' | 'general';
  title: string;
  keywords: string[];
  approvedResponse: string;
  suggestedActionLabel?: string;
  suggestedActionUrl?: string;
  updatedAt: string;
}

export interface AiKnowledgeConfig {
  systemPolicy: string;
  strictModeFallbackMessage: string;
  items: KnowledgeItem[];
}

const AI_KNOWLEDGE_STORAGE_KEY = 'mahaam_ai_knowledge_base_v1';
const AI_KNOWLEDGE_EVENT = 'mahaam_ai_knowledge_updated';

const DEFAULT_CONFIG: AiKnowledgeConfig = {
  systemPolicy: `شما مشاور رسمی و هوشمند گروه بین‌المللی مهام (گروه مهام) هستید. شما صرفاً و منحصراً بر مبنای اطلاعات مصوب و مکتوب این پایگاه دانش به کاربران پاسخ می‌دهید. در صورت عدم تطابق دقیق پرسش کاربر با این مستندات، به هیچ وجه از خود پاسخ حدس نزنید یا اطلاعات خارج از چارچوب ارائه ندهید؛ بلکه بلافاصله کاربر را به کارشناسان رسمی گروه مهام ارجاع دهید.`,
  strictModeFallbackMessage: `پاسخ به این پرسش مستلزم بررسی کارشناسی و فراتر از مستندات عمومی پایگاه دانش است. برای پاسخ به این پرسش می‌توانید به کارشناسان گروه مهام متصل شوید.`,
  items: [
    {
      id: 'kb-health-1',
      category: 'health',
      title: 'ارزیابی صلاحیت و معادل‌سازی مدارک کادر درمان و پزشکان',
      keywords: ['پزشک', 'پزشکی', 'درمان', 'کادر درمان', 'پرستار', 'دندانپزشک', 'معادل', 'تطبیق', 'آپروباسیون', 'approbation', 'dha'],
      approvedResponse: `در گروه بین‌المللی مهام، فرآیند کادر درمان و پزشکان محترم بر پایه «ارزیابی دقیق صلاحیت و واقع‌بینی حقوقی» انجام می‌شود. مراحل شامل سنجش دقیق دانشنامه، تعیین سطح زبان تخصصی پزشکی، اخذ تأییدیه مدارک بالینی و تطبیق دوره‌های کارورزی است. گروه مهام از عقد قراردادهای بدون بررسی صلاحیت قبلی خودداری می‌کند تا پرونده شما با بیشترین درصد انطباق به جریان بیفتد.`,
      suggestedActionLabel: 'مشاهده مسیر کادر درمان در گروه مهام',
      suggestedActionUrl: '/journeys/clinical-healthcare',
      updatedAt: '۱۴۰۳/۰۲/۰۱'
    },
    {
      id: 'kb-legal-1',
      category: 'legal',
      title: 'هیئت‌های تخصصی حقوقی لاهه و دادگاه‌های بین‌المللی',
      keywords: ['حقوق', 'وکالت', 'وکیل', 'دادگاه', 'لاهه', 'قضا', 'قضات', 'hague', 'دیوان', 'داوری'],
      approvedResponse: `گروه بین‌المللی مهام رکورددار برگزاری ۹ دوره متوالی اعزام هیئت‌های تخصصی حقوقی به لاهه هلند (مقر دیوان بین‌المللی دادگستری ICJ و دیوان بین‌المللی کیفری ICC) با همکاری رسمی دانشگاه‌ها و مؤسسات حقوقی برجسته اروپاست. این برنامه‌ها فرصتی کم‌نظیر برای پژوهش، شبکه‌سازی فرامرزی و کارگاه‌های داوری تجاری بین‌المللی فراهم می‌سازد.`,
      suggestedActionLabel: 'جزئیات دوره تخصصی لاهه گروه مهام',
      suggestedActionUrl: '/journeys/international-law-justice',
      updatedAt: '۱۴۰۳/۰۲/۰۱'
    },
    {
      id: 'kb-enterprise-1',
      category: 'enterprise',
      title: 'توسعه شرکت‌ها، سرمایه‌گذاری و تجارت بین‌الملل',
      keywords: ['شرکت', 'سرمایه', 'تجارت', 'صادرات', 'بیزنس', 'توسعه بازرگانی', 'فرانچایز', 'ثبت شرکت'],
      approvedResponse: `برای مدیران عامل و شرکت‌ها، گروه مهام چارچوب ورود قانونی به بازارهای اروپایی و بین‌المللی، ثبت شرکت، اعتبارسنجی شرکای تجاری و ساختارهای انتقال فناوری را با نظارت رسمی و مجوز سازمان توسعه تجارت پیاده‌سازی می‌کند. رویکرد گروه مهام حفظ سرمایه و پایداری زنجیره ارزش است.`,
      suggestedActionLabel: 'مشاهده مسیر مشارکت تجاری گروه مهام',
      suggestedActionUrl: '/journeys/enterprise-partnership',
      updatedAt: '۱۴۰۳/۰۲/۰۱'
    },
    {
      id: 'kb-realism-1',
      category: 'general',
      title: 'تضمین، ریسک و خط‌مشی شفافیت گروه مهام',
      keywords: ['تضمین', 'گارانتی', 'صد در صد', 'وعده', 'ریسک', 'رد ویزا', 'شانس'],
      approvedResponse: `اصل بنیادین گروه بین‌المللی مهام «صداقت حرفه‌ای و عدم ارائه وعده‌های پوچ» است. تصمیم‌گیری فرامرزی و صدور مجوزها دارای ضوابط حاکمیتی کشورهای مقصد است؛ لذا گروه مهام به جای وعده‌های ناممکن، با غربالگری علمی اولیه و ارزیابی شفاف شانس موفقیت، قراردادهایی با تعهدات گام‌به‌گام منعقد می‌نماید.`,
      suggestedActionLabel: 'شروع ارزیابی مسیر در گروه مهام',
      suggestedActionUrl: '/decision-engine',
      updatedAt: '۱۴۰۳/۰۲/۰۱'
    },
    {
      id: 'kb-contact-1',
      category: 'general',
      title: 'اطلاعات تماس، آدرس و ساعات کاری گروه مهام',
      keywords: ['تماس', 'تلفن', 'آدرس', 'دفتر', 'ساعت کاری', 'کجاست', 'ملاقات'],
      approvedResponse: `دفتر مرکزی گروه بین‌المللی مهام در تهران: خیابان جردن (نلسون ماندلا)، خیابان سلطانی (سایه)، پلاک ۸۲، طبقه ۴ مستقر است.\nخطوط ارتباطی مستقیم: ۰۲۱-۲۲۶۶۳۰۰۲ | ۰۲۱-۲۲۶۶۳۰۰۱\nساعات پاسخگویی: شنبه تا چهارشنبه ۹:۰۰ الی ۱۷:۰۰، پنج‌شنبه ۹:۰۰ الی ۱۳:۰۰.`,
      suggestedActionLabel: 'تماس مستقیم با کارشناسان گروه مهام',
      suggestedActionUrl: 'tel:+982122663002',
      updatedAt: '۱۴۰۳/۰۲/۰۱'
    }
  ]
};

function getStoredConfig(): AiKnowledgeConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  const raw = localStorage.getItem(AI_KNOWLEDGE_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(AI_KNOWLEDGE_STORAGE_KEY, JSON.stringify(DEFAULT_CONFIG));
    return DEFAULT_CONFIG;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CONFIG;
  }
}

function saveConfig(config: AiKnowledgeConfig) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AI_KNOWLEDGE_STORAGE_KEY, JSON.stringify(config));
  window.dispatchEvent(new Event(AI_KNOWLEDGE_EVENT));
}

export const aiKnowledgeStore = {
  subscribe(callback: () => void) {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener(AI_KNOWLEDGE_EVENT, callback);
    return () => window.removeEventListener(AI_KNOWLEDGE_EVENT, callback);
  },

  getConfig(): AiKnowledgeConfig {
    return getStoredConfig();
  },

  updateSystemPolicy(policy: string, fallbackMessage: string): boolean {
    const config = getStoredConfig();
    config.systemPolicy = policy;
    config.strictModeFallbackMessage = fallbackMessage;
    saveConfig(config);
    return true;
  },

  addItem(item: Omit<KnowledgeItem, 'id' | 'updatedAt'>): KnowledgeItem {
    const config = getStoredConfig();
    const persianDate = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());

    const newItem: KnowledgeItem = {
      ...item,
      id: `kb-${Date.now()}`,
      updatedAt: persianDate
    };

    config.items.unshift(newItem);
    saveConfig(config);
    return newItem;
  },

  updateItem(id: string, updates: Partial<Omit<KnowledgeItem, 'id' | 'updatedAt'>>): boolean {
    const config = getStoredConfig();
    const idx = config.items.findIndex(it => it.id === id);
    if (idx === -1) return false;

    const persianDate = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());

    config.items[idx] = {
      ...config.items[idx],
      ...updates,
      updatedAt: persianDate
    };

    saveConfig(config);
    return true;
  },

  deleteItem(id: string): boolean {
    const config = getStoredConfig();
    config.items = config.items.filter(it => it.id !== id);
    saveConfig(config);
    return true;
  },

  /**
   * Strict Knowledge Matcher:
   * Only returns an approved response if keywords definitively match.
   * Otherwise returns strictly null so that fallback message is triggered.
   */
  findStrictMatch(query: string): { 
    matchedItem: KnowledgeItem | null; 
    response: string; 
    action?: { label: string; action: string } 
  } {
    const config = getStoredConfig();
    const normalized = query.toLowerCase().trim();

    if (!normalized) {
      return {
        matchedItem: null,
        response: config.strictModeFallbackMessage
      };
    }

    // Check each approved knowledge item against query keywords
    let bestItem: KnowledgeItem | null = null;
    let maxMatchCount = 0;

    for (const item of config.items) {
      let matches = 0;
      for (const kw of item.keywords) {
        const cleanKw = kw.toLowerCase().trim();
        if (cleanKw && normalized.includes(cleanKw)) {
          matches += 1;
        }
      }
      if (matches > maxMatchCount) {
        maxMatchCount = matches;
        bestItem = item;
      }
    }

    if (bestItem && maxMatchCount > 0) {
      return {
        matchedItem: bestItem,
        response: bestItem.approvedResponse,
        action: bestItem.suggestedActionLabel
          ? { label: bestItem.suggestedActionLabel, action: bestItem.suggestedActionUrl || 'handoff' }
          : undefined
      };
    }

    // No match: STRICT RULE as requested by user:
    // هوشمصنوعی فقط از اطلاعات مشخصی که در پنل مدیریتی براش مشخص شده استفاده کنه
    // و به هیچوجه اصلا و ابدا خارج از اون اطلاعات مشخص شده اطلاعاتی به کاربران نده
    // و اعلام کنه که برای پاسخ به این پرسش میتوانید به کارشناسان گروه مهام متصل شوید.
    return {
      matchedItem: null,
      response: config.strictModeFallbackMessage,
      action: { label: 'اتصال به کارشناسان گروه مهام', action: 'handoff' }
    };
  }
};
