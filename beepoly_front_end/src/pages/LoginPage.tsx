import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  BookOpen, Mail, Lock, User, ArrowRight, CheckCircle2, Shield
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [targetExam, setTargetExam] = useState<'TOEIC' | 'IELTS' | 'General'>('IELTS');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    login(email, fullName || undefined);
    navigate('/dashboard');
  };

  const handleQuickLogin = (demoEmail: string, demoName: string) => {
    login(demoEmail, demoName);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side Banner */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-white text-blue-600 flex items-center justify-center font-black shadow-lg">
                <BookOpen className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">Beepoly AI</span>
            </div>

            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-blue-100">
              Nền Tảng Học Tiếng Anh AI 2026
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-3 mb-4 leading-tight">
              Chinh Phục Từ Vựng & Kỹ Năng Anh Văn Chuẩn Quốc Tế
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              Thuật toán lặp lại ngắt quãng SM-2, giả lập đề thi TOEIC/IELTS và trợ lý AI sửa lỗi phát âm trực tiếp.
            </p>

            <div className="space-y-3 text-xs text-blue-100 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Ôn tập thông minh 3D Flipcard
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Chấm điểm giọng nói Accent AI
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Báo cáo giám sát tiến độ phụ huynh
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-xs text-blue-200">
            © 2026 Beepoly. Powered by Supabase & OpenAI.
          </div>
        </div>

        {/* Right Side Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900">
                {isRegister ? 'Đăng Ký Tài Khoản Mới' : 'Đăng Nhập Beepoly'}
              </h3>
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setErrorMsg(null);
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 underline"
              >
                {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Họ và Tên</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    placeholder="hocvien@beepoly.edu.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mục Tiêu Học Tập</label>
                  <select
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800"
                  >
                    <option value="IELTS">Luyện Thi IELTS Academic (Band 7.0+)</option>
                    <option value="TOEIC">Luyện Thi TOEIC Quốc Tế (800+)</option>
                    <option value="General">Tiếng Anh Giao Tiếp Tổng Quát</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 mt-2"
              >
                {isRegister ? 'Tạo Tài Khoản Mới' : 'Đăng Nhập Ngay'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3 text-center">
                Đăng nhập nhanh dùng thử (Demo)
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('student@beepoly.edu.vn', 'Hoàng Minh (Học sinh)')}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold text-center transition-all"
                >
                  🎓 Demo Học Sinh
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('teacher@beepoly.edu.vn', 'Ms. Sarah (Giáo viên)')}
                  className="px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-xl text-xs font-bold text-center transition-all"
                >
                  👩‍🏫 Demo Giáo Viên
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Bảo mật thông tin bằng mã hóa Supabase Auth
          </div>
        </div>
      </div>
    </div>
  );
};
