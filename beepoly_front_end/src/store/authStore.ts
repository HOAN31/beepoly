import { create } from 'zustand';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  targetExam?: 'TOEIC' | 'IELTS' | 'General';
  role?: 'student' | 'teacher';
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, fullName?: string) => void;
  logout: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'user-001',
  email: 'hocvien@beepoly.edu.vn',
  fullName: 'Nguyễn Văn Anh',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  targetExam: 'IELTS',
  role: 'student'
};

export const useAuthStore = create<AuthState>((set) => ({
  user: DEFAULT_USER,
  isAuthenticated: true,

  login: (email: string, fullName?: string) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      fullName: fullName || email.split('@')[0],
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      targetExam: 'IELTS',
      role: 'student'
    };
    localStorage.setItem('beepoly_user', JSON.stringify(newUser));
    set({ user: newUser, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('beepoly_user');
    set({ user: null, isAuthenticated: false });
  }
}));
