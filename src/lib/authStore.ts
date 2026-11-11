/**
 * Authentication, User Management, and Presence Store
 * Multi-role access control for Mahaam International Group
 */

export type UserRole = 'admin' | 'senior_expert' | 'expert';

export interface AdminUser {
  id: string;
  username: string;
  password: string; // Plaintext for site administrator management
  fullName: string;
  displayName: string;
  role: UserRole;
  department?: string;
  createdAt: string;
  isActive: boolean;
}

const USERS_STORAGE_KEY = 'mahaam_admin_users_db_v1';
const CURRENT_USER_SESSION_KEY = 'mahaam_current_user_session_v1';
const PRESENCE_STORAGE_KEY = 'mahaam_expert_presence_v1';
const AUTH_EVENT = 'mahaam_auth_changed';
const USERS_EVENT = 'mahaam_users_updated';
const PRESENCE_EVENT = 'mahaam_presence_changed';

const defaultUsers: AdminUser[] = [
  {
    id: 'user_admin',
    username: 'admin',
    password: 'admin',
    fullName: 'مدیریت کل سامانه گروه مهام',
    displayName: 'مدیریت کل سامانه گروه مهام',
    role: 'admin',
    department: 'مدیریت اجرایی و راهبردی',
    createdAt: '۱۴۰۳/۰۱/۰۱',
    isActive: true
  },
  {
    id: 'user_exp_1',
    username: 'dr_ahmadi',
    password: '123',
    fullName: 'دکتر محمدرضا احمدی',
    displayName: 'دکتر محمدرضا احمدی',
    role: 'senior_expert',
    department: 'دپارتمان سلامت و کادر درمان',
    createdAt: '۱۴۰۳/۰۲/۱۵',
    isActive: true
  },
  {
    id: 'user_exp_2',
    username: 'dr_moradi',
    password: '123',
    fullName: 'دکتر سارا مرادی',
    displayName: 'دکتر سارا مرادی',
    role: 'expert',
    department: 'دپارتمان حقوق بین‌الملل و لاهه',
    createdAt: '۱۴۰۳/۰۳/۰۱',
    isActive: true
  },
  {
    id: 'user_exp_3',
    username: 'eng_tehrani',
    password: '123',
    fullName: 'مهندس نوید تهرانی',
    displayName: 'مهندس نوید تهرانی',
    role: 'expert',
    department: 'دپارتمان شرکت‌ها و سرمایه‌گذاری',
    createdAt: '۱۴۰۳/۰۴/۱۰',
    isActive: true
  }
];

export const getAllUsers = (): AdminUser[] => {
  if (typeof window === 'undefined') return defaultUsers;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    const parsed = JSON.parse(raw);
    return parsed.map((u: any) => ({
      ...u,
      displayName: u.displayName || u.fullName,
      fullName: u.fullName || u.displayName,
      isActive: u.isActive !== false
    }));
  } catch {
    return defaultUsers;
  }
};

const saveUsers = (users: AdminUser[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    window.dispatchEvent(new Event(USERS_EVENT));
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
};

export const getCurrentUser = (): AdminUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(CURRENT_USER_SESSION_KEY) || localStorage.getItem(CURRENT_USER_SESSION_KEY);
    if (!raw) return null;
    const sessionData = JSON.parse(raw);
    const users = getAllUsers();
    return users.find(u => u.id === sessionData.id) || null;
  } catch {
    return null;
  }
};

export const loginUser = (username: string, password: string): AdminUser | null => {
  const users = getAllUsers();
  const matched = users.find(
    u => u.username.trim().toLowerCase() === username.trim().toLowerCase() && u.password === password
  );
  if (matched && typeof window !== 'undefined') {
    sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify({ id: matched.id }));
    localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify({ id: matched.id }));
    
    // Record presence
    recordPresence(matched.id);
    
    window.dispatchEvent(new Event(AUTH_EVENT));
    window.dispatchEvent(new Event(PRESENCE_EVENT));
    return matched;
  }
  return null;
};

export const logoutUser = (): void => {
  if (typeof window !== 'undefined') {
    const current = getCurrentUser();
    if (current) {
      removePresence(current.id);
    }
    sessionStorage.removeItem(CURRENT_USER_SESSION_KEY);
    localStorage.removeItem(CURRENT_USER_SESSION_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT));
    window.dispatchEvent(new Event(PRESENCE_EVENT));
  }
};

function recordPresence(userId: string) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(PRESENCE_STORAGE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[userId] = Date.now();
    localStorage.setItem(PRESENCE_STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

function removePresence(userId: string) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(PRESENCE_STORAGE_KEY);
    if (raw) {
      const map = JSON.parse(raw);
      delete map[userId];
      localStorage.setItem(PRESENCE_STORAGE_KEY, JSON.stringify(map));
    }
  } catch {}
}

export const authStore = {
  subscribe(callback: () => void) {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener(AUTH_EVENT, callback);
    window.addEventListener(USERS_EVENT, callback);
    window.addEventListener(PRESENCE_EVENT, callback);
    return () => {
      window.removeEventListener(AUTH_EVENT, callback);
      window.removeEventListener(USERS_EVENT, callback);
      window.removeEventListener(PRESENCE_EVENT, callback);
    };
  },

  getCurrentUser(): AdminUser | null {
    return getCurrentUser();
  },

  getAllUsers(): AdminUser[] {
    return getAllUsers();
  },

  login(username: string, password: string): AdminUser | null {
    return loginUser(username, password);
  },

  logout(): void {
    logoutUser();
  },

  /**
   * Automatic detection of online experts:
   * Returns true if any authenticated user is logged in or has active presence in the last 20 minutes.
   */
  areExpertsOnline(): boolean {
    if (typeof window === 'undefined') return false;
    
    // Check manual override if any
    const override = localStorage.getItem('mahaam_presence_manual_override');
    if (override === 'online') return true;
    if (override === 'offline') return false;

    // Check active session of current window
    const current = getCurrentUser();
    if (current) return true;

    // Check presence heartbeat of all experts
    try {
      const raw = localStorage.getItem(PRESENCE_STORAGE_KEY);
      if (!raw) return false;
      const map: Record<string, number> = JSON.parse(raw);
      const now = Date.now();
      const cutoff = 20 * 60 * 1000; // 20 minutes

      const activeIds = Object.entries(map).filter(([_, ts]) => now - ts < cutoff);
      return activeIds.length > 0;
    } catch {
      return false;
    }
  },

  setPresenceOverride(status: 'auto' | 'online' | 'offline') {
    if (typeof window === 'undefined') return;
    if (status === 'auto') {
      localStorage.removeItem('mahaam_presence_manual_override');
    } else {
      localStorage.setItem('mahaam_presence_manual_override', status);
    }
    window.dispatchEvent(new Event(PRESENCE_EVENT));
  },

  getPresenceOverride(): 'auto' | 'online' | 'offline' {
    if (typeof window === 'undefined') return 'auto';
    return (localStorage.getItem('mahaam_presence_manual_override') as any) || 'auto';
  },

  addUser(data: {
    username: string;
    password: string;
    displayName: string;
    role: UserRole;
    department?: string;
  }): { success: boolean; message?: string; user?: AdminUser } {
    const users = getAllUsers();
    if (users.some(u => u.username.toLowerCase() === data.username.toLowerCase())) {
      return { success: false, message: 'این نام کاربری قبلاً تعریف شده است.' };
    }

    const now = new Date();
    const persianDate = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);

    const newUser: AdminUser = {
      id: `user_${Date.now()}`,
      username: data.username,
      password: data.password,
      fullName: data.displayName,
      displayName: data.displayName,
      role: data.role,
      department: data.department || '',
      createdAt: persianDate,
      isActive: true
    };

    saveUsers([...users, newUser]);
    return { success: true, user: newUser };
  },

  updateCredentials(
    userId: string,
    currentPasswordInput: string,
    newPassword?: string,
    newUsername?: string
  ): { success: boolean; message?: string } {
    const users = getAllUsers();
    const target = users.find(u => u.id === userId);
    if (!target) return { success: false, message: 'کاربر یافت نشد.' };

    if (target.password !== currentPasswordInput) {
      return { success: false, message: 'رمز عبور فعلی وارد شده نادرست است.' };
    }

    if (newUsername && newUsername.toLowerCase() !== target.username.toLowerCase()) {
      if (users.some(u => u.id !== userId && u.username.toLowerCase() === newUsername.toLowerCase())) {
        return { success: false, message: 'این نام کاربری قبلاً استفاده شده است.' };
      }
      target.username = newUsername;
    }

    if (newPassword) {
      target.password = newPassword;
    }

    saveUsers([...users]);
    return { success: true };
  },

  adminChangeUserPassword(userId: string, newPassword: string): boolean {
    const users = getAllUsers();
    const target = users.find(u => u.id === userId);
    if (!target) return false;
    target.password = newPassword;
    saveUsers([...users]);
    return true;
  },

  deleteUser(userId: string): { success: boolean; message?: string } {
    if (userId === 'user_admin') {
      return { success: false, message: 'حساب مدیر ارشد اصلی قابل حذف نیست.' };
    }
    const users = getAllUsers();
    const filtered = users.filter(u => u.id !== userId);
    saveUsers(filtered);
    return { success: true };
  }
};
