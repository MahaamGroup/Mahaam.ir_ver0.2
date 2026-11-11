/**
 * Assessment Database Store for Mahaam International Group
 * Handles persistence of assessment submissions, role-based case referrals, and trash lifecycle.
 */

export interface AssessmentRecord {
  id: string;
  trackingCode: string;
  createdAt: string;
  timestamp: number;
  salutation: string; // e.g. دکتر, مهندس, استاد, وکیل, مدیر, جناب آقای, سرکار خانم
  fullName: string;
  preferredChannels: string[]; // واتساپ, تلگرام, بله, پیامک, تماس تلفنی
  phone: string;
  mainObjective: string; // خواسته اصلی
  additionalNotes: string; // توضیحات بیشتر
  diagnosticAnswers: {
    questionId: number;
    stageName: string;
    questionText: string;
    selectedOption: string;
  }[];
  recommendedJourney: {
    title: string;
    slug: string;
    badge: string;
  };
  status: 'new' | 'reviewed' | 'contacted' | 'completed';
  assignedTo: string[]; // Array of assigned expert IDs
  assignedExpertNames: string[]; // Names of assigned experts
  isTrashed?: boolean;
  trashedAt?: string;
  internalNotes?: string;
}

const STORAGE_KEY = 'mahaam_assessments_db_v1';

// Initial realistic seed records for demonstration
const initialSeeds: AssessmentRecord[] = [
  {
    id: 'eval-1',
    trackingCode: 'MHM-EV-84192',
    createdAt: '۱۴۰۳/۰۸/۱۸ - ۱۶:۴۵',
    timestamp: Date.now() - 86400000 * 2,
    salutation: 'دکتر',
    fullName: 'کیانوش رادمنش',
    preferredChannels: ['واتساپ', 'پیامک'],
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    mainObjective: 'معادل‌سازی دانشنامه پزشکی تخصصی جراحی و بررسی دوره‌های فلوشیپ در آلمان یا سوئیس',
    additionalNotes: 'دارای مدرک ب۲ زبان آلمانی و ۱۰ سال سابقه جراحی، اولویت حفظ موقعیت مطب تا زمان تأیید مدارک است.',
    diagnosticAnswers: [
      { questionId: 1, stageName: 'شناخت شما', questionText: 'شما در کدام گروه حرفه‌ای قرار می‌گیرید؟', selectedOption: 'متخصص، پژوهشگر یا استاد دانشگاه' },
      { questionId: 2, stageName: 'حوزه فعالیت', questionText: 'حوزه تخصصی و زمینه کاری شما کدام است؟', selectedOption: 'پزشکی و حوزه سلامت' },
      { questionId: 3, stageName: 'هدف اصلی', questionText: 'مهم‌ترین هدف و انگیزه شما از بررسی مسیر چیست؟', selectedOption: 'شناخت میدانی و تجربه محیط‌های جدید' },
      { questionId: 4, stageName: 'وضعیت تصمیم', questionText: 'اکنون در کدام مرحله از تصمیم‌گیری قرار دارید؟', selectedOption: 'در حال مقایسه چند مقصد یا سناریوی مشخص هستم' },
      { questionId: 5, stageName: 'اولویت حیاتی', questionText: 'مهم‌ترین معیار شما در کیفیت تصمیم‌گیری کدام است؟', selectedOption: 'حفظ موقعیت شغلی فعلی هم‌زمان با ارزیابی فرامرزی' },
    ],
    recommendedJourney: {
      title: 'تجربه‌های بین‌المللی (International Experiences)',
      slug: 'experience',
      badge: 'شناخت میدانی و نزدیک محیط‌ها'
    },
    status: 'contacted',
    assignedTo: ['user_exp_1'],
    assignedExpertNames: ['دکتر محمدرضا احمدی'],
    isTrashed: false,
    internalNotes: 'با ایشان در واتساپ ارتباط اولیه گرفته شد. مدارک دانشنامه جهت بررسی به دپارتمان سلامت ارسال شد.'
  },
  {
    id: 'eval-2',
    trackingCode: 'MHM-EV-95214',
    createdAt: '۱۴۰۳/۰۸/۱۹ - ۱۰:۱۵',
    timestamp: Date.now() - 86400000,
    salutation: 'مهندس',
    fullName: 'علیرضا شمس‌آبادی',
    preferredChannels: ['تلگرام', 'پیام‌رسان بله (Bale)', 'تماس تلفنی'],
    phone: '۰۹۱۲۸۸۸۴۳۲۱',
    mainObjective: 'تأسیس بازوی تجاری و ثبت شرکت برای صادرات خدمات فنی مهندسی به هلند و آلمان',
    additionalNotes: 'شرکت دارای مجوز دانش‌بنیان در ایران و نیازمند افتتاح حساب بانکی شرکتی اروپایی.',
    diagnosticAnswers: [
      { questionId: 1, stageName: 'شناخت شما', questionText: 'شما در کدام گروه حرفه‌ای قرار می‌گیرید؟', selectedOption: 'صاحب کسب‌وکار یا کارآفرین' },
      { questionId: 2, stageName: 'حوزه فعالیت', questionText: 'حوزه تخصصی و زمینه کاری شما کدام است؟', selectedOption: 'فنی، مهندسی و فناوری اطلاعات' },
      { questionId: 3, stageName: 'هدف اصلی', questionText: 'مهم‌ترین هدف و انگیزه شما از بررسی مسیر چیست؟', selectedOption: 'توسعه کسب‌وکار و راه‌اندازی زیرساخت' },
      { questionId: 4, stageName: 'وضعیت تصمیم', questionText: 'اکنون در کدام مرحله از تصمیم‌گیری قرار دارید؟', selectedOption: 'آماده بررسی جدی و تدوین نقشه اقدام هستم' },
      { questionId: 5, stageName: 'اولویت حیاتی', questionText: 'مهم‌ترین معیار شما در کیفیت تصمیم‌گیری کدام است؟', selectedOption: 'حداکثر اطمینان، شفافیت و حداقل ریسک' },
    ],
    recommendedJourney: {
      title: 'استقرار و توسعه (Setup & Expansion)',
      slug: 'development',
      badge: 'زیرساخت و حضور پایدار'
    },
    status: 'new',
    assignedTo: [],
    assignedExpertNames: [],
    isTrashed: false,
    internalNotes: ''
  }
];

export const getAssessments = (): AssessmentRecord[] => {
  if (typeof window === 'undefined') return initialSeeds;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSeeds));
      return initialSeeds;
    }
    const parsed: AssessmentRecord[] = JSON.parse(raw);
    // Ensure new fields exist for backward compatibility
    return parsed.map(item => ({
      ...item,
      assignedTo: item.assignedTo || [],
      assignedExpertNames: item.assignedExpertNames || [],
      isTrashed: !!item.isTrashed
    }));
  } catch {
    return initialSeeds;
  }
};

const saveAssessmentsList = (list: AssessmentRecord[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event('mahaam_assessments_updated'));
    } catch (e) {
      console.error('Failed to save assessment to localStorage', e);
    }
  }
};

export const saveAssessment = (record: Omit<AssessmentRecord, 'id' | 'trackingCode' | 'createdAt' | 'timestamp' | 'status' | 'assignedTo' | 'assignedExpertNames' | 'isTrashed'>): AssessmentRecord => {
  const current = getAssessments();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const now = new Date();
  
  const persianDate = new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);

  const newRecord: AssessmentRecord = {
    ...record,
    id: `eval-${Date.now()}`,
    trackingCode: `MHM-EV-${randomNum}`,
    createdAt: persianDate,
    timestamp: Date.now(),
    status: 'new',
    assignedTo: [],
    assignedExpertNames: [],
    isTrashed: false
  };

  saveAssessmentsList([newRecord, ...current]);
  return newRecord;
};

export const updateAssessmentStatus = (id: string, status: AssessmentRecord['status'], notes?: string): void => {
  const current = getAssessments();
  const updated = current.map(item => {
    if (item.id === id) {
      return {
        ...item,
        status,
        ...(notes !== undefined ? { internalNotes: notes } : {})
      };
    }
    return item;
  });
  saveAssessmentsList(updated);
};

export const batchUpdateStatus = (ids: string[], status: AssessmentRecord['status']): void => {
  const current = getAssessments();
  const updated = current.map(item => {
    if (ids.includes(item.id)) {
      return { ...item, status };
    }
    return item;
  });
  saveAssessmentsList(updated);
};

export const assignCasesToExperts = (caseIds: string[], expertIds: string[], expertNames: string[]): void => {
  const current = getAssessments();
  const updated = current.map(item => {
    if (caseIds.includes(item.id)) {
      return {
        ...item,
        assignedTo: expertIds,
        assignedExpertNames: expertNames,
        status: item.status === 'new' ? 'reviewed' : item.status
      };
    }
    return item;
  });
  saveAssessmentsList(updated);
};

export const moveCasesToTrash = (caseIds: string[]): void => {
  const current = getAssessments();
  const now = new Date();
  const persianDate = new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);

  const updated = current.map(item => {
    if (caseIds.includes(item.id)) {
      return { ...item, isTrashed: true, trashedAt: persianDate };
    }
    return item;
  });
  saveAssessmentsList(updated);
};

export const restoreCasesFromTrash = (caseIds: string[]): void => {
  const current = getAssessments();
  const updated = current.map(item => {
    if (caseIds.includes(item.id)) {
      return { ...item, isTrashed: false, trashedAt: undefined };
    }
    return item;
  });
  saveAssessmentsList(updated);
};

export const deleteCasesPermanently = (caseIds: string[]): void => {
  const current = getAssessments();
  const updated = current.filter(item => !caseIds.includes(item.id));
  saveAssessmentsList(updated);
};

/**
 * Filter assessments according to user role:
 * - Admin and Senior Expert see all cases.
 * - Regular Expert sees ONLY cases assigned to them.
 */
export const getAssessmentsForUser = (
  userRole: string,
  userId: string,
  showTrash = false
): AssessmentRecord[] => {
  const all = getAssessments();
  return all.filter(item => {
    const matchesTrash = showTrash ? item.isTrashed === true : !item.isTrashed;
    if (!matchesTrash) return false;

    if (userRole === 'admin' || userRole === 'senior_expert') {
      return true;
    }
    // Expert only sees assigned cases
    return item.assignedTo && item.assignedTo.includes(userId);
  });
};
