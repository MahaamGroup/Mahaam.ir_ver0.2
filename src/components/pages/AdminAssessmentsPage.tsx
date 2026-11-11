import React, { useState, useEffect, useMemo } from 'react';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { 
  getAssessmentsForUser, 
  updateAssessmentStatus, 
  assignCasesToExperts, 
  moveCasesToTrash, 
  restoreCasesFromTrash, 
  deleteCasesPermanently,
  AssessmentRecord 
} from '../../lib/assessmentStore';
import { 
  authStore, 
  AdminUser 
} from '../../lib/authStore';
import { 
  chatStore, 
  ChatSession, 
  ChatMessage 
} from '../../lib/chatStore';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Phone, 
  MessageCircle, 
  Download, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  X, 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  User, 
  Users, 
  UserPlus, 
  Lock, 
  LogIn, 
  LogOut, 
  KeyRound, 
  Send, 
  CheckSquare, 
  Square, 
  RotateCcw, 
  Briefcase, 
  MessageSquare,
  Sparkles,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useDocumentMeta } from '../../lib/useDocumentMeta';

interface AdminAssessmentsPageProps {
  onNavigate: (path: string) => void;
}

export const AdminAssessmentsPage: React.FC<AdminAssessmentsPageProps> = ({ onNavigate }) => {
  useDocumentMeta({
    title: 'سامانه جامع مدیریت و کارتابل کارشناسان مهام',
    description: 'سامانه یکپارچه ممیزی پرونده‌های ارزیابی، مدیریت پاسخگویی چت آنلاین، دسترسی کارشناسان و امنیت اطلاعات گروه بین‌المللی مهام.',
    canonicalPath: '/admin'
  });

  // Current logged in user
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => authStore.getCurrentUser());

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'cases' | 'chats' | 'trash' | 'users'>('cases');

  // Change self password modal
  const [showSelfPasswordModal, setShowSelfPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newSelfPassword, setNewSelfPassword] = useState('');
  const [newSelfUsername, setNewSelfUsername] = useState('');
  const [selfPasswordMsg, setSelfPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // --------------------------------------------------------------------------
  // CASES STATE
  // --------------------------------------------------------------------------
  const [cases, setCases] = useState<AssessmentRecord[]>([]);
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);
  const [caseSearchQuery, setCaseSearchQuery] = useState('');
  const [caseStatusFilter, setCaseStatusFilter] = useState<string>('all');
  const [caseExpertFilter, setCaseExpertFilter] = useState<string>('all');
  const [activeCase, setActiveCase] = useState<AssessmentRecord | null>(null);
  const [caseNoteInput, setCaseNoteInput] = useState('');

  // Batch assign modal state
  const [showBatchAssignModal, setShowBatchAssignModal] = useState(false);
  const [batchTargetExpertIds, setBatchTargetExpertIds] = useState<string[]>([]);

  // --------------------------------------------------------------------------
  // CHATS STATE
  // --------------------------------------------------------------------------
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [chatReplyText, setChatReplyText] = useState('');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [chatAssignExpertId, setChatAssignExpertId] = useState('');

  // --------------------------------------------------------------------------
  // TRASH STATE
  // --------------------------------------------------------------------------
  const [trashTab, setTrashTab] = useState<'cases' | 'chats'>('cases');

  // --------------------------------------------------------------------------
  // USER MANAGEMENT STATE (Admin only)
  // --------------------------------------------------------------------------
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [revealedPasswords, setRevealedPasswords] = useState<{ [id: string]: boolean }>({});
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newRole, setNewRole] = useState<'expert' | 'senior_expert'>('expert');
  const [newDepartment, setNewDepartment] = useState('');
  const [editingUserPasswordId, setEditingUserPasswordId] = useState<string | null>(null);
  const [changeUserPasswordValue, setChangeUserPasswordValue] = useState('');

  // Subscribe to auth state
  useEffect(() => {
    const unsubAuth = authStore.subscribe(() => {
      const user = authStore.getCurrentUser();
      setCurrentUser(user);
      setAllUsers(authStore.getAllUsers());
    });
    setAllUsers(authStore.getAllUsers());
    return () => unsubAuth();
  }, []);

  // Reload data
  const loadData = () => {
    if (!currentUser) return;
    setCases(getAssessmentsForUser(currentUser.id, currentUser.role));
    setChats(chatStore.getActiveSessions(currentUser.role === 'expert' ? currentUser.id : undefined));
    setAllUsers(authStore.getAllUsers());
  };

  useEffect(() => {
    loadData();
    const handleCaseUpdate = () => loadData();
    const handleChatUpdate = () => loadData();
    window.addEventListener('mahaam_assessments_updated', handleCaseUpdate);
    const unsubChats = chatStore.subscribe(loadData);
    return () => {
      window.removeEventListener('mahaam_assessments_updated', handleCaseUpdate);
      unsubChats();
    };
  }, [currentUser]);

  // Keep selectedChat in sync with updated messages
  useEffect(() => {
    if (selectedChat) {
      const fresh = chatStore.getSessionById(selectedChat.id);
      if (fresh) setSelectedChat(fresh);
    }
  }, [chats]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const user = authStore.login(loginUsername.trim(), loginPassword.trim());
    if (user) {
      setCurrentUser(user);
      setLoginUsername('');
      setLoginPassword('');
    } else {
      setLoginError('نام کاربری یا رمز عبور اشتباه است.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    authStore.logout();
    setCurrentUser(null);
    setSelectedCaseIds([]);
    setActiveCase(null);
    setSelectedChat(null);
  };

  // Handle Change Self Password / Username
  const handleUpdateSelfCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSelfPasswordMsg(null);

    const res = authStore.updateCredentials(
      currentUser.id,
      oldPassword,
      newSelfPassword.trim() || undefined,
      newSelfUsername.trim() || undefined
    );

    if (res.success) {
      setSelfPasswordMsg({ type: 'success', text: 'اطلاعات ورود شما با موفقیت به‌روزرسانی شد.' });
      setOldPassword('');
      setNewSelfPassword('');
      setTimeout(() => setShowSelfPasswordModal(false), 1500);
    } else {
      setSelfPasswordMsg({ type: 'error', text: res.message || 'خطا در ثبت اطلاعات.' });
    }
  };

  // Experts list for assignment (only active experts)
  const expertUsers = useMemo(() => {
    return allUsers.filter(u => u.isActive && (u.role === 'expert' || u.role === 'senior_expert'));
  }, [allUsers]);

  // Filtered cases
  const filteredCases = useMemo(() => {
    return cases.filter(rec => {
      if (rec.isTrashed) return false;
      const matchesStatus = caseStatusFilter === 'all' || rec.status === caseStatusFilter;
      const matchesExpert = caseExpertFilter === 'all' || 
        (rec.assignedTo && rec.assignedTo.includes(caseExpertFilter));

      if (!caseSearchQuery.trim()) return matchesStatus && matchesExpert;

      const q = caseSearchQuery.toLowerCase().trim();
      const inName = rec.fullName.toLowerCase().includes(q);
      const inPhone = rec.phone.includes(q);
      const inCode = rec.trackingCode.toLowerCase().includes(q);
      const inObj = rec.mainObjective.toLowerCase().includes(q);

      return matchesStatus && matchesExpert && (inName || inPhone || inCode || inObj);
    });
  }, [cases, caseStatusFilter, caseExpertFilter, caseSearchQuery]);

  // Batch Selection Helpers
  const handleToggleSelectCase = (id: string) => {
    setSelectedCaseIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllFilteredCases = () => {
    if (selectedCaseIds.length === filteredCases.length) {
      setSelectedCaseIds([]);
    } else {
      setSelectedCaseIds(filteredCases.map(c => c.id));
    }
  };

  // Batch Assign Action
  const handleExecuteBatchAssign = () => {
    if (selectedCaseIds.length === 0 || batchTargetExpertIds.length === 0) return;
    const targetExperts = allUsers.filter(u => batchTargetExpertIds.includes(u.id));
    const expertNames = targetExperts.map(u => `${u.displayName} (${u.department || 'کارشناس'})`);

    assignCasesToExperts(selectedCaseIds, batchTargetExpertIds, expertNames);
    setShowBatchAssignModal(false);
    setSelectedCaseIds([]);
    setBatchTargetExpertIds([]);
    loadData();
  };

  // Batch Status Change
  const handleBatchStatusChange = (newStatus: AssessmentRecord['status']) => {
    if (selectedCaseIds.length === 0) return;
    selectedCaseIds.forEach(id => updateAssessmentStatus(id, newStatus));
    setSelectedCaseIds([]);
    loadData();
  };

  // Move Cases to Trash
  const handleMoveCasesToTrash = (ids: string[]) => {
    if (ids.length === 0) return;
    if (confirm(`آیا از انتقال ${ids.length} پرونده به سطل آشغال اطمینان دارید؟`)) {
      moveCasesToTrash(ids);
      setSelectedCaseIds(prev => prev.filter(id => !ids.includes(id)));
      if (activeCase && ids.includes(activeCase.id)) setActiveCase(null);
      loadData();
    }
  };

  // Save Case Notes
  const handleSaveCaseNote = (caseId: string) => {
    updateAssessmentStatus(caseId, activeCase?.status || 'new', caseNoteInput);
    loadData();
    if (activeCase) {
      setActiveCase(prev => prev ? { ...prev, internalNotes: caseNoteInput } : null);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    if (cases.length === 0) return;
    const headers = ['کد رهگیری', 'تاریخ', 'عنوان', 'نام و نام خانوادگی', 'تلفن', 'کانال ارتباطی', 'خواسته اصلی', 'مسیر پیشنهادی', 'وضعیت', 'کارشناس انتسابی', 'یادداشت داخلی'];
    const rows = cases.filter(c => !c.isTrashed).map(r => [
      r.trackingCode,
      r.createdAt,
      r.salutation,
      `"${r.fullName}"`,
      `"${r.phone}"`,
      `"${r.preferredChannels.join(' - ')}"`,
      `"${r.mainObjective.replace(/"/g, '""')}"`,
      `"${r.recommendedJourney.title}"`,
      r.status,
      `"${(r.assignedExpertNames || []).join('، ')}"`,
      `"${(r.internalNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mahaam-cases-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Send expert reply to chat
  const handleSendChatReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat || !chatReplyText.trim() || !currentUser) return;

    chatStore.replyAsExpert({
      sessionId: selectedChat.id,
      expertId: currentUser.id,
      expertName: currentUser.displayName,
      expertRole: currentUser.role,
      text: chatReplyText.trim()
    });

    setChatReplyText('');
    loadData();
  };

  // Assign chat to expert
  const handleAssignChat = (chatId: string, expertId: string) => {
    const expert = allUsers.find(u => u.id === expertId);
    if (!expert) return;
    chatStore.assignSession(chatId, expertId, `${expert.displayName} (${expert.department || 'کارشناس'})`);
    loadData();
  };

  // Add user handler (Admin only)
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim() || !newDisplayName.trim()) return;

    const res = authStore.addUser({
      username: newUsername.trim(),
      password: newPassword.trim(),
      displayName: newDisplayName.trim(),
      role: newRole,
      department: newDepartment.trim() || undefined
    });

    if (res.success) {
      setShowAddUserModal(false);
      setNewUsername('');
      setNewPassword('');
      setNewDisplayName('');
      setNewDepartment('');
      loadData();
    } else {
      alert(res.message);
    }
  };

  // Update specific user password (Admin only)
  const handleSaveUserPassword = (userId: string) => {
    if (!changeUserPasswordValue.trim()) return;
    authStore.adminChangeUserPassword(userId, changeUserPasswordValue.trim());
    setEditingUserPasswordId(null);
    setChangeUserPasswordValue('');
    loadData();
  };

  // Delete user (Admin only)
  const handleDeleteUser = (userId: string) => {
    if (confirm('آیا از حذف این کارشناس اطمینان دارید؟')) {
      const res = authStore.deleteUser(userId);
      if (!res.success) alert(res.message);
      else loadData();
    }
  };

  // --------------------------------------------------------------------------
  // RENDER: LOGIN GATE IF NOT AUTHENTICATED
  // --------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="bg-[#081525] min-h-screen text-right flex flex-col justify-center items-center px-4 font-sans py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-white/10 space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-block bg-[#0C2340] rounded-2xl p-4 shadow-md">
              <img 
                src="/site_logo.png" 
                alt="لوگوی گروه بین‌المللی مهام" 
                className="h-10 w-auto object-contain mx-auto" 
              />
            </div>
            <h1 className="text-xl font-bold text-[#0C2340]">سامانه احراز هویت کارشناسان مهام</h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              جهت ورود به کارتابل ارزیابی‌ها، پاسخگویی به چت‌ها و دسترسی به اطلاعات متقاضیان، وارد حساب کاربری خود شوید.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">نام کاربری</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="نام کاربری کارشناس یا مدیر..."
                  className="w-full text-xs pr-9 pl-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#3658B6] focus:outline-none text-right dir-rtl"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">رمز عبور</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="رمز عبور..."
                  className="w-full text-xs pr-9 pl-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#3658B6] focus:outline-none text-right"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0C2340] hover:bg-[#3658B6] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>ورود به سامانه</span>
            </button>
          </form>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-800 space-y-1">
            <span className="font-bold block">اطلاعات ورود پیش‌فرض مدیر سامانه:</span>
            <div className="font-mono text-left dir-ltr bg-white/80 p-1.5 rounded text-[11px]">
              username: <span className="font-bold text-[#0C2340]">admin</span> | password: <span className="font-bold text-[#0C2340]">admin</span>
            </div>
            <span className="text-[10px] text-amber-700 block pt-0.5">
              (پس از ورود، مدیر می‌تواند رمز عبور خود را تغییر دهد و برای سایر کارشناسان نام کاربری و رمز تعریف کند.)
            </span>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('/')}
              className="text-xs text-slate-500 hover:text-[#3658B6] transition-colors"
            >
              ← بازگشت به صفحه اصلی وب‌سایت مهام
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: AUTHENTICATED ADMIN / EXPERT PORTAL
  // --------------------------------------------------------------------------
  const isSeniorOrAdmin = currentUser.role === 'admin' || currentUser.role === 'senior_expert';
  const isAdmin = currentUser.role === 'admin';

  const trashedCases = cases.filter(c => c.isTrashed);
  const trashedChats = chatStore.getTrashedSessions();

  return (
    <div className="bg-[#F8F6F1] min-h-screen text-right font-sans">
      <Breadcrumbs items={[{ label: 'سامانه مدیریت مهام (/admin)' }]} onNavigate={onNavigate} />

      {/* Top Header & Session Bar */}
      <section className="bg-gradient-to-b from-[#081525] to-[#0C2340] text-white py-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-md">
                <img src="/site_logo.png" alt="Mahaam Logo" className="h-full w-auto object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-white">سامانه مدیریت و کارتابل مهام</h1>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    currentUser.role === 'admin' 
                      ? 'bg-amber-400 text-amber-950' 
                      : currentUser.role === 'senior_expert' 
                      ? 'bg-blue-400 text-blue-950' 
                      : 'bg-emerald-400 text-emerald-950'
                  }`}>
                    {currentUser.role === 'admin' ? 'مدیر ارشد سامانه' : currentUser.role === 'senior_expert' ? 'کارشناس ارشد' : 'کارشناس'}
                  </span>
                </div>
                <span className="text-xs text-[#9FC9E8]">
                  کاربر: {currentUser.displayName} ({currentUser.username})
                  {currentUser.department && ` · ${currentUser.department}`}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setNewSelfUsername(currentUser.username);
                  setShowSelfPasswordModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors border border-white/20 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                <span>تغییر نام کاربری / رمز عبور</span>
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج از حساب</span>
              </button>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('cases')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'cases'
                  ? 'bg-white text-[#0C2340] shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Briefcase className="w-4 h-4 text-[#3658B6]" />
              <span>پرونده‌های ارزیابی</span>
              <span className="text-[10px] bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded-full font-mono">
                {cases.filter(c => !c.isTrashed).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('chats')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'chats'
                  ? 'bg-white text-[#0C2340] shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>چت‌های آنلاین و پیام‌ها</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-mono">
                {chats.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('trash')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'trash'
                  ? 'bg-white text-[#0C2340] shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span>سطل آشغال</span>
              <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full font-mono">
                {trashedCases.length + trashedChats.length}
              </span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('users')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'bg-white text-[#0C2340] shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Users className="w-4 h-4 text-amber-500" />
                <span>مدیریت کارشناسان و دسترسی‌ها (ادمین)</span>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full font-mono">
                  {allUsers.length}
                </span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Body per Tab */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ================================================================ */}
          {/* TAB 1: CASES MANAGEMENT                                          */}
          {/* ================================================================ */}
          {activeTab === 'cases' && (
            <div className="space-y-6">
              
              {/* Toolbar & Filters */}
              <div className="bg-white rounded-3xl p-5 border border-[#BAC3CE]/40 shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                  
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={caseSearchQuery}
                      onChange={(e) => setCaseSearchQuery(e.target.value)}
                      placeholder="جستجو در نام متقاضی، شماره تماس، کد رهگیری، خواسته..."
                      className="w-full pl-10 pr-10 py-2.5 bg-[#F8F6F1] rounded-2xl border border-transparent focus:border-[#3658B6] focus:bg-white focus:outline-none text-xs sm:text-sm text-slate-800 transition-all text-right"
                    />
                    {caseSearchQuery && (
                      <button
                        onClick={() => setCaseSearchQuery('')}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Status Filters */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'all', label: 'همه وضعیت‌ها' },
                      { id: 'new', label: 'جدید' },
                      { id: 'reviewed', label: 'در حال بررسی' },
                      { id: 'contacted', label: 'تماس برقرار شده' },
                      { id: 'completed', label: 'مختومه' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setCaseStatusFilter(st.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          caseStatusFilter === st.id
                            ? 'bg-[#0C2340] text-white shadow-xs'
                            : 'bg-[#EEF1F3] text-slate-600 hover:bg-[#BAC3CE]/40'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  {/* Expert Filter for Admin / Senior Expert */}
                  {isSeniorOrAdmin && (
                    <div className="flex items-center gap-2">
                      <select
                        value={caseExpertFilter}
                        onChange={(e) => setCaseExpertFilter(e.target.value)}
                        className="text-xs py-2 px-3 rounded-xl border border-slate-300 bg-[#F8F6F1] text-slate-800 font-medium"
                      >
                        <option value="all">فیلتر کارشناس: همه</option>
                        {expertUsers.map(exp => (
                          <option key={exp.id} value={exp.id}>
                            {exp.displayName} ({exp.department || 'کارشناس'})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Export CSV Button */}
                  <button
                    onClick={handleExportCsv}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#BAC3CE]/60 text-slate-700 hover:bg-[#EEF1F3] text-xs font-semibold transition-colors cursor-pointer shrink-0"
                    title="دانلود فایل اکسل پرونده‌ها"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>خروجی CSV</span>
                  </button>

                </div>

                {/* Batch Actions Bar (When cases are selected) */}
                {selectedCaseIds.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-blue-900 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-[#3658B6]" />
                      <span>{selectedCaseIds.length} پرونده انتخاب شده است</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {isSeniorOrAdmin && (
                        <button
                          onClick={() => {
                            setBatchTargetExpertIds([]);
                            setShowBatchAssignModal(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#3658B6] hover:bg-[#2B4696] text-white font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>ارجاع به کارشناس(ها)</span>
                        </button>
                      )}

                      <select
                        onChange={(e) => {
                          if (e.target.value) handleBatchStatusChange(e.target.value as any);
                          e.target.value = '';
                        }}
                        className="py-1.5 px-3 rounded-xl bg-white border border-blue-300 text-slate-700 font-semibold"
                        defaultValue=""
                      >
                        <option value="" disabled>تغییر وضعیت دسته‌جمعی...</option>
                        <option value="new">جدید</option>
                        <option value="reviewed">در حال بررسی</option>
                        <option value="contacted">تماس برقرار شد</option>
                        <option value="completed">مختومه</option>
                      </select>

                      <button
                        onClick={() => handleMoveCasesToTrash(selectedCaseIds)}
                        className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-semibold transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>انتقال به سطل آشغال</span>
                      </button>

                      <button
                        onClick={() => setSelectedCaseIds([])}
                        className="text-slate-500 hover:text-slate-800 px-2 py-1"
                      >
                        لغو انتخاب
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cases Grid / Split view */}
              {filteredCases.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Cases List */}
                  <div className="lg:col-span-2 space-y-3">
                    {/* Select All Checkbox */}
                    <div className="flex items-center justify-between px-2 text-xs text-slate-500">
                      <button
                        onClick={handleSelectAllFilteredCases}
                        className="inline-flex items-center gap-2 font-semibold hover:text-[#0C2340] cursor-pointer"
                      >
                        {selectedCaseIds.length === filteredCases.length ? (
                          <CheckSquare className="w-4 h-4 text-[#3658B6]" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                        <span>انتخاب تمام پرونده‌های این لیست ({filteredCases.length})</span>
                      </button>
                      <span>
                        {currentUser.role === 'expert' && 'فقط پرونده‌های منتسب به شما نمایش داده می‌شوند'}
                      </span>
                    </div>

                    {filteredCases.map((item) => {
                      const isSelected = selectedCaseIds.includes(item.id);
                      const isActive = activeCase?.id === item.id;

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setActiveCase(item);
                            setCaseNoteInput(item.internalNotes || '');
                          }}
                          className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer shadow-sm hover:shadow-md relative ${
                            isActive
                              ? 'border-[#3658B6] ring-2 ring-[#3658B6]/20'
                              : 'border-[#BAC3CE]/40'
                          }`}
                        >
                          <div className="flex items-center justify-between border-b border-[#EEF1F3] pb-3 mb-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleSelectCase(item.id);
                                }}
                                className="p-1 hover:text-[#3658B6]"
                              >
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-[#3658B6]" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300" />
                                )}
                              </button>

                              <span className="font-mono text-xs font-bold text-[#3658B6] bg-blue-50 px-2 py-0.5 rounded-md">
                                {item.trackingCode}
                              </span>
                              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{item.createdAt}</span>
                              </span>
                            </div>

                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              item.status === 'new' ? 'bg-amber-100 text-amber-800' :
                              item.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                              item.status === 'contacted' ? 'bg-purple-100 text-purple-800' :
                              'bg-emerald-100 text-emerald-800'
                            }`}>
                              {item.status === 'new' ? 'جدید' : item.status === 'reviewed' ? 'در حال بررسی' : item.status === 'contacted' ? 'تماس برقرار شد' : 'مختومه'}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold text-[#0C2340] flex items-center gap-1.5">
                                <User className="w-4 h-4 text-[#3658B6]" />
                                <span>{item.salutation} {item.fullName}</span>
                              </h3>

                              <a
                                href={`tel:${item.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-xs font-mono font-bold text-slate-600 hover:text-[#3658B6] dir-ltr flex items-center gap-1"
                                dir="ltr"
                              >
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                <span>{item.phone}</span>
                              </a>
                            </div>

                            <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              <strong className="text-slate-700 ml-1">خواسته:</strong>
                              {item.mainObjective}
                            </div>

                            {/* Assigned Experts Badge */}
                            {item.assignedExpertNames && item.assignedExpertNames.length > 0 && (
                              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                                <Users className="w-3 h-3 text-[#0D5A63]" />
                                <span>کارشناسان پرونده:</span>
                                <span className="font-semibold text-[#0C2340]">
                                  {item.assignedExpertNames.join('، ')}
                                </span>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EEF1F3] text-[11px] text-slate-500">
                              <span className="bg-[#EEF1F3] px-2 py-0.5 rounded-md text-[#0D5A63] font-medium">
                                {item.recommendedJourney.title}
                              </span>

                              <div className="flex items-center gap-1">
                                <span className="text-slate-400">کانال ارتباطی:</span>
                                <span className="font-semibold text-slate-700">{item.preferredChannels.join('، ')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Case Detail Drawer */}
                  <div className="lg:col-span-1">
                    {activeCase ? (
                      <div className="bg-white rounded-3xl p-6 border border-[#BAC3CE]/40 shadow-sm space-y-5 sticky top-24">
                        <div className="flex items-center justify-between border-b border-[#EEF1F3] pb-3">
                          <div>
                            <span className="text-[11px] font-mono font-bold text-[#3658B6] block">
                              {activeCase.trackingCode}
                            </span>
                            <h3 className="text-base font-bold text-[#0C2340]">
                              {activeCase.salutation} {activeCase.fullName}
                            </h3>
                          </div>

                          <button
                            onClick={() => handleMoveCasesToTrash([activeCase.id])}
                            className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="انتقال پرونده به سطل آشغال"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Status update */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-700">تغییر وضعیت پرونده:</label>
                          <select
                            value={activeCase.status}
                            onChange={(e) => {
                              updateAssessmentStatus(activeCase.id, e.target.value as any);
                              loadData();
                              setActiveCase(prev => prev ? { ...prev, status: e.target.value as any } : null);
                            }}
                            className="w-full text-xs p-2.5 rounded-xl border border-[#BAC3CE]/60 bg-[#F8F6F1] font-semibold text-[#0C2340]"
                          >
                            <option value="new">جدید / بررسی نشده</option>
                            <option value="reviewed">در حال بررسی ممیزی</option>
                            <option value="contacted">تماس برقرار شد</option>
                            <option value="completed">تکمیل و مختومه</option>
                          </select>
                        </div>

                        {/* Quick Contact Actions */}
                        <div className="space-y-2 pt-1 border-t border-[#EEF1F3]">
                          <span className="text-xs font-semibold text-slate-700 block">ارتباط با متقاضی:</span>
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${activeCase.phone}`}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0C2340] hover:bg-[#123157] text-white text-xs font-medium transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>تماس تلفنی</span>
                            </a>

                            <a
                              href={`https://wa.me/${activeCase.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>واتساپ</span>
                            </a>
                          </div>
                        </div>

                        {/* Diagnostic 5-stage Answers */}
                        <div className="space-y-2 pt-2 border-t border-[#EEF1F3]">
                          <span className="text-xs font-bold text-[#0C2340] block">پاسخ‌های ثبت شده در ۵ گام ارزیابی:</span>
                          <div className="space-y-2 text-xs">
                            {activeCase.diagnosticAnswers.map((ans, idx) => (
                              <div key={idx} className="p-2.5 rounded-xl bg-[#F8F6F1] border border-[#BAC3CE]/30 space-y-0.5">
                                <span className="text-[10px] text-slate-400 block">{ans.stageName}: {ans.questionText}</span>
                                <span className="font-semibold text-[#0C2340] block">{ans.selectedOption}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Additional applicant notes */}
                        {activeCase.additionalNotes && (
                          <div className="space-y-1 pt-2 border-t border-[#EEF1F3]">
                            <span className="text-xs font-semibold text-slate-700 block">توضیحات تکمیلی متقاضی:</span>
                            <p className="text-xs text-slate-600 bg-[#F8F6F1] p-3 rounded-xl leading-relaxed whitespace-pre-line">
                              {activeCase.additionalNotes}
                            </p>
                          </div>
                        )}

                        {/* Internal staff notes */}
                        <div className="space-y-2 pt-2 border-t border-[#EEF1F3]">
                          <span className="text-xs font-bold text-[#0C2340] block">یادداشت داخلی کارشناسان مهام:</span>
                          <textarea
                            rows={3}
                            value={caseNoteInput}
                            onChange={(e) => setCaseNoteInput(e.target.value)}
                            placeholder="ثبت اقدامات صورت گرفته، نیاز به ترجمه یا ارجاع..."
                            className="w-full text-xs p-2.5 rounded-xl border border-[#BAC3CE]/60 focus:border-[#3658B6] focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveCaseNote(activeCase.id)}
                            className="w-full py-2 bg-[#3658B6] hover:bg-[#2B4696] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                          >
                            ذخیره یادداشت پرونده
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-3xl p-8 border border-[#BAC3CE]/40 text-center space-y-3">
                        <Eye className="w-8 h-8 text-slate-400 mx-auto" />
                        <h4 className="text-sm font-bold text-[#0C2340]">یک پرونده را انتخاب فرمایید</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          برای مشاهده پاسخ‌های ۵ مرحله، شماره تماس و درج یادداشت ممیزی روی کارت پرونده کلیک کنید.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 border border-[#BAC3CE]/40 text-center space-y-4">
                  <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="text-base font-bold text-[#0C2340]">پرونده‌ای مطابق شرایط فعلی یافت نشد</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    می‌توانید فیلترها را پاک کنید یا عبارت جستجو را تغییر دهید.
                  </p>
                </div>
              )}

            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 2: CHAT SESSIONS & LIVE / OFFLINE REPLIES                    */}
          {/* ================================================================ */}
          {activeTab === 'chats' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Chat Sessions List */}
              <div className="lg:col-span-5 space-y-3">
                <div className="bg-white rounded-3xl p-4 border border-[#BAC3CE]/40 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#0C2340] flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>فهرست جلسات چت آنلاین ({chats.length})</span>
                    </h3>
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={chatSearchQuery}
                      onChange={(e) => setChatSearchQuery(e.target.value)}
                      placeholder="جستجو در چت‌ها (نام، شماره، پیام)..."
                      className="w-full text-xs pr-8 pl-3 py-2 bg-[#F8F6F1] rounded-xl border border-transparent focus:border-[#3658B6] focus:bg-white text-right"
                    />
                  </div>
                </div>

                <div className="space-y-2 max-h-[650px] overflow-y-auto">
                  {chats
                    .filter(c => {
                      if (!chatSearchQuery.trim()) return true;
                      const q = chatSearchQuery.toLowerCase();
                      return (c.userName || '').toLowerCase().includes(q) ||
                        (c.userPhone || '').includes(q) ||
                        c.lastMessageSnippet.toLowerCase().includes(q);
                    })
                    .map((session) => {
                      const isSelected = selectedChat?.id === session.id;

                      return (
                        <div
                          key={session.id}
                          onClick={() => {
                            setSelectedChat(session);
                            setChatAssignExpertId(session.assignedTo || '');
                          }}
                          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-sm hover:shadow-md ${
                            isSelected
                              ? 'border-[#3658B6] ring-2 ring-[#3658B6]/20 bg-blue-50/20'
                              : 'border-[#BAC3CE]/40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                              {session.unreadByAdmin && (
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              )}
                              <span className="text-xs font-bold text-[#0C2340]">
                                {session.userName || 'کاربر مهمان'}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(session.updatedAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          {session.userPhone && (
                            <div className="text-[11px] text-emerald-800 font-mono dir-ltr text-right mb-1">
                              📞 {session.userPhone}
                            </div>
                          )}

                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {session.lastMessageSnippet}
                          </p>

                          <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#EEF1F3] text-[10px] text-slate-400 font-mono">
                            <span>کد: #{session.sessionId ? session.sessionId.slice(-6) : session.id.slice(-6)}</span>
                            {session.assignedExpertName && (
                              <span className="text-[#3658B6] font-medium font-sans">
                                {session.assignedExpertName}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Right Column: Chat Thread & Reply Input */}
              <div className="lg:col-span-7">
                {selectedChat ? (
                  <div className="bg-white rounded-3xl border border-[#BAC3CE]/40 shadow-sm flex flex-col h-[650px] overflow-hidden">
                    
                    {/* Chat Header */}
                    <div className="p-4 bg-[#0C2340] text-white flex items-center justify-between border-b border-white/10 shrink-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold">{selectedChat.userName || 'کاربر مهمان'}</h3>
                          <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-mono">
                            {selectedChat.sessionId}
                          </span>
                        </div>
                        {selectedChat.userPhone ? (
                          <span className="text-xs text-[#9FC9E8] font-mono dir-ltr inline-block">
                            شماره تماس: {selectedChat.userPhone}
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-300">
                            (کاربر هنوز نام و شماره ثبت نکرده است)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Assign Chat */}
                        {isSeniorOrAdmin && (
                          <select
                            value={chatAssignExpertId}
                            onChange={(e) => {
                              setChatAssignExpertId(e.target.value);
                              handleAssignChat(selectedChat.id, e.target.value);
                            }}
                            className="text-[11px] bg-white/10 text-white rounded-xl px-2 py-1.5 border border-white/20"
                          >
                            <option value="" className="text-slate-800">ارجاع به کارشناس...</option>
                            {expertUsers.map(u => (
                              <option key={u.id} value={u.id} className="text-slate-800">
                                {u.displayName}
                              </option>
                            ))}
                          </select>
                        )}

                        <button
                          onClick={() => {
                            if (confirm('انتقال این گفتگو به سطل آشغال؟')) {
                              chatStore.moveToTrash(selectedChat.id);
                              setSelectedChat(null);
                              loadData();
                            }
                          }}
                          className="p-1.5 rounded-lg text-red-300 hover:text-white hover:bg-red-500/20"
                          title="انتقال چت به سطل آشغال"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F6F1]/50">
                      {selectedChat.messages.map((msg) => {
                        const isUser = msg.sender === 'user';
                        const isExpert = msg.sender === 'expert';

                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                          >
                            <div className="text-[10px] text-slate-400 mb-0.5 px-1 flex items-center gap-1.5">
                              {isUser ? (
                                <span className="font-bold text-slate-600">{selectedChat.userName || 'کاربر'}</span>
                              ) : isExpert ? (
                                <span className="font-bold text-emerald-800">{msg.senderName} (کارشناس)</span>
                              ) : (
                                <span className="text-[#3658B6]">دستیار هوشمند مهام</span>
                              )}
                              <span>·</span>
                              <span>{new Date(msg.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>

                            <div
                              className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                                isUser
                                  ? 'bg-white text-slate-800 border border-[#BAC3CE]/40 rounded-tl-none shadow-xs'
                                  : isExpert
                                  ? 'bg-emerald-600 text-white rounded-tr-none shadow-sm whitespace-pre-line'
                                  : 'bg-[#0C2340] text-white rounded-tr-none shadow-xs whitespace-pre-line'
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Expert Reply Input Box */}
                    <form onSubmit={handleSendChatReply} className="p-3 bg-white border-t border-[#EEF1F3] flex gap-2">
                      <input
                        type="text"
                        required
                        value={chatReplyText}
                        onChange={(e) => setChatReplyText(e.target.value)}
                        placeholder={`پاسخ شما به عنوان ${currentUser.displayName} (لایو یا آفلاین برای متقاضی ذخیره می‌شود)...`}
                        className="flex-1 text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:border-[#3658B6] focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!chatReplyText.trim()}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-40 flex items-center gap-1.5 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5 rotate-180" />
                        <span>ارسال پاسخ کارشناس</span>
                      </button>
                    </form>

                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-16 border border-[#BAC3CE]/40 text-center space-y-3 h-[650px] flex flex-col justify-center items-center">
                    <MessageSquare className="w-10 h-10 text-slate-300" />
                    <h4 className="text-sm font-bold text-[#0C2340]">یک گفتگو را از ستون سمت راست انتخاب فرمایید</h4>
                    <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                      کلیه پیام‌های ارسال‌شده توسط کاربران در اینجا ذخیره شده و می‌توانید پاسخ رسمی کارشناس را ارسال کنید.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 3: TRASH CAN (Cases & Chats)                                 */}
          {/* ================================================================ */}
          {activeTab === 'trash' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-5 border border-[#BAC3CE]/40 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0C2340] flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-red-500" />
                    <span>سطل زباله و موارد حذف‌شده</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    موارد انتقال‌یافته به سطل زباله قابل بازیابی مجدد هستند یا می‌توانید آن‌ها را به صورت دائمی حذف فرمایید.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTrashTab('cases')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                      trashTab === 'cases' ? 'bg-[#0C2340] text-white' : 'bg-[#EEF1F3] text-slate-700'
                    }`}
                  >
                    پرونده‌ها ({trashedCases.length})
                  </button>
                  <button
                    onClick={() => setTrashTab('chats')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                      trashTab === 'chats' ? 'bg-[#0C2340] text-white' : 'bg-[#EEF1F3] text-slate-700'
                    }`}
                  >
                    چت‌ها ({trashedChats.length})
                  </button>
                </div>
              </div>

              {trashTab === 'cases' ? (
                trashedCases.length > 0 ? (
                  <div className="space-y-3">
                    {trashedCases.map((tc) => (
                      <div key={tc.id} className="bg-white rounded-2xl p-4 border border-red-200 shadow-xs flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-500">{tc.trackingCode}</span>
                            <span className="text-sm font-bold text-[#0C2340]">{tc.salutation} {tc.fullName}</span>
                            <span className="text-xs font-mono text-slate-500 dir-ltr">{tc.phone}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{tc.mainObjective}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              restoreCasesFromTrash([tc.id]);
                              loadData();
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-semibold hover:bg-emerald-100"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>بازیابی</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm('آیا از حذف دائمی و غیرقابل بازگشت این پرونده اطمینان دارید؟')) {
                                deleteCasesPermanently([tc.id]);
                                loadData();
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف دائمی</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-400">
                    هیچ پرونده‌ای در سطل آشغال وجود ندارد.
                  </div>
                )
              ) : (
                trashedChats.length > 0 ? (
                  <div className="space-y-3">
                    {trashedChats.map((tc) => (
                      <div key={tc.id} className="bg-white rounded-2xl p-4 border border-red-200 shadow-xs flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#0C2340]">{tc.userName || 'کاربر مهمان'}</span>
                            {tc.userPhone && <span className="text-xs font-mono text-emerald-800 dir-ltr">{tc.userPhone}</span>}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{tc.lastMessageSnippet}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              chatStore.restoreFromTrash(tc.id);
                              loadData();
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-semibold hover:bg-emerald-100"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>بازیابی</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm('حذف دائمی این گفتگو؟')) {
                                chatStore.deletePermanently(tc.id);
                                loadData();
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف دائمی</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-400">
                    هیچ گفتگویی در سطل آشغال وجود ندارد.
                  </div>
                )
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 4: USERS & PERMISSIONS MANAGEMENT (ADMIN ONLY)               */}
          {/* ================================================================ */}
          {activeTab === 'users' && isAdmin && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-5 border border-[#BAC3CE]/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[#0C2340] flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-500" />
                    <span>مدیریت کاربران، کارشناسان و سطوح دسترسی</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    تنها مدیر ارشد سامانه به این بخش دسترسی دارد و می‌تواند کارشناسان جدید تعریف نموده، پسوردها را مشاهده یا ویرایش کند.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0C2340] hover:bg-[#3658B6] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>افزودن کارشناس جدید</span>
                </button>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-3xl border border-[#BAC3CE]/40 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-[#EEF1F3] text-slate-700 font-bold border-b border-[#BAC3CE]/40">
                      <tr>
                        <th className="p-3.5">نام و عنوان</th>
                        <th className="p-3.5">نام کاربری</th>
                        <th className="p-3.5">سطح دسترسی (Role)</th>
                        <th className="p-3.5">دپارتمان تخصصی</th>
                        <th className="p-3.5">رمز عبور (مدیر)</th>
                        <th className="p-3.5 text-center">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEF1F3]">
                      {allUsers.map((user) => {
                        const isRevealed = revealedPasswords[user.id];

                        return (
                          <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3.5 font-bold text-[#0C2340]">
                              {user.displayName}
                            </td>
                            <td className="p-3.5 font-mono text-slate-700">
                              {user.username}
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                user.role === 'admin' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                                user.role === 'senior_expert' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                                'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              }`}>
                                {user.role === 'admin' ? 'مدیر ارشد' : user.role === 'senior_expert' ? 'کارشناس ارشد' : 'کارشناس'}
                              </span>
                            </td>
                            <td className="p-3.5 text-slate-600">
                              {user.department || '—'}
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs bg-[#F8F6F1] px-2 py-1 rounded-lg border border-slate-200">
                                  {isRevealed ? user.password : '••••••••'}
                                </span>
                                <button
                                  onClick={() => setRevealedPasswords(prev => ({ ...prev, [user.id]: !prev[user.id] }))}
                                  className="text-slate-400 hover:text-slate-700 p-1"
                                  title={isRevealed ? 'مخفی کردن' : 'مشاهده رمز'}
                                >
                                  {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </td>
                            <td className="p-3.5 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => {
                                    setEditingUserPasswordId(user.id);
                                    setChangeUserPasswordValue('');
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-semibold"
                                >
                                  تغییر پسورد
                                </button>

                                {user.role !== 'admin' && (
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="p-1 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                                    title="حذف کارشناس"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* ==================================================================== */}
      {/* MODAL: BATCH ASSIGN CASES TO EXPERTS                                 */}
      {/* ==================================================================== */}
      {showBatchAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans text-right">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-[#0C2340]">
                ارجاع {selectedCaseIds.length} پرونده به کارشناسان منتخب
              </h3>
              <button onClick={() => setShowBatchAssignModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              کارشناس یا کارشناسان موردنظر را جهت رسیدگی به پرونده‌های انتخاب‌شده علامت بزنید:
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {expertUsers.map(exp => {
                const isChecked = batchTargetExpertIds.includes(exp.id);

                return (
                  <label
                    key={exp.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#0C2340] block">{exp.displayName}</span>
                      <span className="text-[11px] text-slate-500">{exp.department || 'کارشناس'}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setBatchTargetExpertIds(prev => 
                          prev.includes(exp.id) ? prev.filter(x => x !== exp.id) : [...prev, exp.id]
                        );
                      }}
                      className="w-4 h-4 text-[#3658B6] rounded"
                    />
                  </label>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBatchAssignModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                انصراف
              </button>
              <button
                type="button"
                disabled={batchTargetExpertIds.length === 0}
                onClick={handleExecuteBatchAssign}
                className="px-5 py-2 rounded-xl bg-[#0C2340] hover:bg-[#3658B6] text-white text-xs font-bold disabled:opacity-40"
              >
                تأیید و ارجاع پرونده‌ها
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: ADMIN CHANGE USER PASSWORD                                    */}
      {/* ==================================================================== */}
      {editingUserPasswordId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans text-right">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-[#0C2340]">تنظیم رمز عبور جدید برای کارشناس</h3>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">رمز عبور جدید</label>
              <input
                type="text"
                required
                value={changeUserPasswordValue}
                onChange={(e) => setChangeUserPasswordValue(e.target.value)}
                placeholder="رمز عبور دلخواه..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingUserPasswordId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                انصراف
              </button>
              <button
                onClick={() => handleSaveUserPassword(editingUserPasswordId)}
                disabled={!changeUserPasswordValue.trim()}
                className="px-4 py-1.5 bg-[#0C2340] text-white text-xs font-bold rounded-xl hover:bg-[#3658B6] disabled:opacity-40"
              >
                ذخیره رمز جدید
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: ADD NEW EXPERT USER (ADMIN ONLY)                              */}
      {/* ==================================================================== */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans text-right">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-[#0C2340]">افزودن کارشناس یا کارشناس ارشد جدید</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">نام و نام خانوادگی (نمایشی)</label>
                <input
                  type="text"
                  required
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="مثال: دکتر علیرضا نادری"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">نام کاربری (جهت لاگین)</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="مثال: naderi"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none font-mono dir-ltr text-right"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">رمز عبور</label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="رمز عبور..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none font-mono dir-ltr text-right"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">سطح دسترسی</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="expert">کارشناس (دسترسی به پرونده‌های اختصاص‌یافته و چت‌های فعال)</option>
                  <option value="senior_expert">کارشناس ارشد (دسترسی به تمام پرونده‌ها و ارجاع پرونده‌ها)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">دپارتمان تخصصی</label>
                <input
                  type="text"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  placeholder="مثال: دپارتمان کادر درمان و سلامت"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0C2340] hover:bg-[#3658B6] text-white text-xs font-bold"
                >
                  ثبت کاربر جدید
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: SELF UPDATE CREDENTIALS (USERNAME & PASSWORD)                 */}
      {/* ==================================================================== */}
      {showSelfPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans text-right">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-[#0C2340]">تغییر نام کاربری و رمز عبور</h3>
              <button onClick={() => setShowSelfPasswordModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {selfPasswordMsg && (
              <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                selfPasswordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
              }`}>
                {selfPasswordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{selfPasswordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateSelfCredentials} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">نام کاربری جدید (اختیاری)</label>
                <input
                  type="text"
                  value={newSelfUsername}
                  onChange={(e) => setNewSelfUsername(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono dir-ltr text-right"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">رمز عبور فعلی (جهت تأیید هویت)</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="رمز عبور فعلی..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono dir-ltr text-right"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">رمز عبور جدید</label>
                <input
                  type="password"
                  value={newSelfPassword}
                  onChange={(e) => setNewSelfPassword(e.target.value)}
                  placeholder="در صورت عدم تغییر، خالی بگذارید..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono dir-ltr text-right"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSelfPasswordModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0C2340] text-white text-xs font-bold rounded-xl hover:bg-[#3658B6]"
                >
                  ذخیره تغییرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
