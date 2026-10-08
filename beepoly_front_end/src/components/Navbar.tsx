import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Layers, Sparkles, GraduationCap, Users, LogOut, LogIn, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 text-slate-900 font-extrabold text-lg">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
            <BookOpen className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span>Beepoly</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/dashboard"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              location.pathname === '/dashboard'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              location.pathname === '/' || location.pathname.startsWith('/deck')
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>My Vocabulary</span>
          </Link>

          <Link
            to="/exam-practice"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              location.pathname === '/exam-practice'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Exam Simulator</span>
          </Link>

          <Link
            to="/classroom"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              location.pathname === '/classroom'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Classroom</span>
          </Link>

          <Link
            to="/ai-assistant"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              location.pathname === '/ai-assistant'
                ? 'bg-purple-50 text-purple-700 font-bold ring-1 ring-purple-200'
                : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>AI Assistant</span>
          </Link>

          {/* User Account / Auth Dropdown */}
          <div className="relative ml-2 pl-2 border-l border-slate-200">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-all outline-none"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-blue-600/20"
                  />
                  <span className="hidden sm:inline text-xs font-bold text-slate-800 max-w-[100px] truncate">
                    {user.fullName}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md uppercase">
                        {user.role === 'teacher' ? 'Giáo viên' : 'Học sinh'} • {user.targetExam || 'IELTS'}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                    >
                      <User className="w-4 h-4 text-slate-400" /> Trang Cá Nhân
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all text-left"
                    >
                      <LogOut className="w-4 h-4" /> Đăng Xuất Tài Khoản
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" /> Đăng Nhập
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
