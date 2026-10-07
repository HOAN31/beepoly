import React, { useState } from 'react';
import { 
  Users, UserCheck, Key, BookOpen, Clock, Award, 
  TrendingUp, Download, ShieldCheck, CheckCircle2, Sparkles, ChevronRight
} from 'lucide-react';

export const ClassroomPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'parent'>('student');
  const [classCode, setClassCode] = useState<string>('');
  const [joinedClass, setJoinedClass] = useState<boolean>(true);
  const [joinSuccessMsg, setJoinSuccessMsg] = useState<string | null>(null);

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classCode.trim()) return;
    setJoinedClass(true);
    setJoinSuccessMsg(`Đã tham gia lớp học thành công với mã: ${classCode.toUpperCase()}`);
    setTimeout(() => setJoinSuccessMsg(null), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="mb-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-indigo-200">
                School & Parent Portal 2026
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
              Cổng Kết Nối Lớp Học & Phụ Huynh
            </h1>
            <p className="text-indigo-200 text-sm max-w-xl">
              Nơi giao nhận bài tập từ giáo viên, theo dõi thứ hạng lớp học và cho phép phụ huynh giám sát tiến độ học tập từ xa bằng AI.
            </p>
          </div>

          {/* Tab Navigation Segment */}
          <div className="bg-black/30 p-1.5 rounded-2xl border border-white/10 flex gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'student'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" /> Lớp Học Sinh
            </button>
            <button
              onClick={() => setActiveTab('parent')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'parent'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Cổng Phụ Huynh
            </button>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {joinSuccessMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-semibold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          {joinSuccessMsg}
        </div>
      )}

      {/* TAB 1: STUDENT CLASSROOM */}
      {activeTab === 'student' && (
        <div className="space-y-8">
          {/* Join Code Box & Active Class Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Join Code Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm md:col-span-1">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-600" /> Nhập Mã Lớp Học
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Nhận mã tham gia 6 ký tự từ giáo viên của bạn (VD: BEEP26).
              </p>

              <form onSubmit={handleJoinClass} className="space-y-3">
                <input
                  type="text"
                  placeholder="Mã lớp (VD: BEEP26)"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono uppercase font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/20"
                >
                  Tham Gia Lớp Mới
                </button>
              </form>
            </div>

            {/* Active Class Details Card */}
            {joinedClass ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm md:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" /> Đang Hoạt Động
                    </span>
                    <span className="text-xs text-slate-400 font-mono">MÃ: BEEP2026</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Lớp Chuyên Anh 12A1 - IELTS Academic 7.5+
                  </h2>
                  <p className="text-slate-500 text-xs mb-4">
                    Giáo viên chủ nhiệm: <strong className="text-slate-800">Ms. Sarah Nguyen</strong> • Trường THPT Chuyên Hà Nội - Amsterdam
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <div>
                    <span className="text-xs text-slate-500 block">Sĩ số lớp</span>
                    <strong className="text-base font-bold text-slate-900">36 Học Sinh</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Bài tập hoàn thành</span>
                    <strong className="text-base font-bold text-emerald-600">85%</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Thứ hạng của bạn</span>
                    <strong className="text-base font-bold text-purple-600">Hạng #3</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-300 md:col-span-2 flex items-center justify-center text-center">
                <p className="text-slate-500 text-sm">Bạn chưa tham gia lớp học nào. Nhập mã lớp ở bên trái để bắt đầu!</p>
              </div>
            )}
          </div>

          {/* Assigned Homework Decks */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" /> Bài Tập Bộ Thẻ Được Giao Từ Giáo Viên
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all flex justify-between items-center">
                <div>
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md uppercase">
                    Hạn nộp: Hôm nay 23:59
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">IELTS Environment & Climate Change</h4>
                  <p className="text-xs text-slate-500 mt-0.5">30 Thẻ từ vựng • Cần ôn lại 12 thẻ</p>
                </div>
                <a
                  href="/review/1"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1"
                >
                  Làm Bài <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all flex justify-between items-center">
                <div>
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase">
                    Hạn nộp: Ngày mai 18:00
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">TOEIC Business Negotiation Collocations</h4>
                  <p className="text-xs text-slate-500 mt-0.5">45 Thẻ từ vựng • Cần ôn lại 5 thẻ</p>
                </div>
                <a
                  href="/review/2"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1"
                >
                  Làm Bài <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Class Leaderboard */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Bảng Xếp Hạng Lớp Học (Top Streak & Memory)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase">
                    <th className="py-3 px-4">Thứ Hạng</th>
                    <th className="py-3 px-4">Học Sinh</th>
                    <th className="py-3 px-4">Chuỗi Streak</th>
                    <th className="py-3 px-4">Tỷ Lệ Nhớ Thẻ</th>
                    <th className="py-3 px-4 text-right">Danh Hiệu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-amber-50/50 font-medium">
                    <td className="py-3.5 px-4 font-black text-amber-600">🥇 #1</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">Minh Anh (Cán sự)</td>
                    <td className="py-3.5 px-4 text-amber-600 font-bold">🔥 24 Ngày</td>
                    <td className="py-3.5 px-4 text-emerald-600 font-bold">96%</td>
                    <td className="py-3.5 px-4 text-right"><span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded-lg">Master Poly</span></td>
                  </tr>
                  <tr className="bg-slate-50/50 font-medium">
                    <td className="py-3.5 px-4 font-black text-slate-500">🥈 #2</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">Hoàng Nam</td>
                    <td className="py-3.5 px-4 text-amber-600 font-bold">🔥 19 Ngày</td>
                    <td className="py-3.5 px-4 text-emerald-600 font-bold">92%</td>
                    <td className="py-3.5 px-4 text-right"><span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-extrabold rounded-lg">Pro Scholar</span></td>
                  </tr>
                  <tr className="bg-purple-50/50 font-bold text-purple-900">
                    <td className="py-3.5 px-4 font-black text-purple-700">🥉 #3</td>
                    <td className="py-3.5 px-4">Bạn (Học sinh hiện tại)</td>
                    <td className="py-3.5 px-4 text-amber-600">🔥 14 Ngày</td>
                    <td className="py-3.5 px-4 text-emerald-600">89%</td>
                    <td className="py-3.5 px-4 text-right"><span className="px-2.5 py-1 bg-purple-200 text-purple-900 text-xs font-extrabold rounded-lg">Rising Star</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PARENT MONITORING PORTAL */}
      {activeTab === 'parent' && (
        <div className="space-y-8">
          {/* Summary Alert */}
          <div className="bg-purple-50 border border-purple-200 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-purple-900">Cổng Giám Sát Tiến Độ Dành Cho Phụ Huynh</h3>
                <p className="text-xs text-purple-700 mt-0.5">
                  Báo cáo minh bạch về thời gian học tập, thói quen ghi nhớ từ vựng và chất lượng phát âm chuẩn AI của con.
                </p>
              </div>
            </div>

            <button
              onClick={() => alert('Đang khởi tạo bản PDF báo cáo tiến độ tuần cho Phụ Phụ Huynh...')}
              className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all shrink-0"
            >
              <Download className="w-4 h-4" /> Tải Báo Cáo PDF Tuần
            </button>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Tổng Thời Gian Học Tuần</span>
              <strong className="text-2xl font-black text-slate-900">4 Giờ 15 Phút</strong>
              <div className="mt-2 text-xs text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +22% so với tuần trước
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Thẻ Từ Vựng Đã Thuộc</span>
              <strong className="text-2xl font-black text-blue-600">142 Thẻ</strong>
              <div className="mt-2 text-xs text-slate-500">Thuộc thuật toán SM-2 dài hạn</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Độ Chính Xác Phát Âm AI</span>
              <strong className="text-2xl font-black text-emerald-600">89.4%</strong>
              <div className="mt-2 text-xs text-emerald-600 font-semibold">Đạt chuẩn bản ngữ Accent AI</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Đánh Giá Tính Kỷ Luật</span>
              <strong className="text-2xl font-black text-purple-600">Xuất Sắc</strong>
              <div className="mt-2 text-xs text-purple-600 font-semibold">Duy trì streak 14 ngày liên tiếp</div>
            </div>
          </div>

          {/* Detailed Study Log for Parents */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" /> Nhật Ký Học Tập Chi Tiết Trong Tuần
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-sm">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Hôm nay - 15:30</span>
                  <strong className="text-slate-900">Hoàn thành bài Luyện Phát Âm AI (Accent Training)</strong>
                  <p className="text-xs text-slate-500 mt-0.5">Phát âm 12 câu từ vựng chủ đề IELTS Environment</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg">92% Khớp</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-sm">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Hôm qua - 20:15</span>
                  <strong className="text-slate-900">Thi Giả Lập TOEIC Mini Mock Test 01</strong>
                  <p className="text-xs text-slate-500 mt-0.5">Thời gian làm: 14 phút • Đạt 4/5 câu đúng</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-lg">TOEIC ~ 780</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-sm">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">3 ngày trước - 19:00</span>
                  <strong className="text-slate-900">Ôn tập ngắt quãng 25 thẻ từ vựng Oxford 3000</strong>
                  <p className="text-xs text-slate-500 mt-0.5">Thời gian học: 18 phút</p>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-lg">Hoàn thành</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
