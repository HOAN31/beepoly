import React, { useState, useEffect } from 'react';
import { 
  Clock, Volume2, CheckCircle2, 
  AlertCircle, ChevronRight, ChevronLeft, Flag, Award, 
  RotateCcw, Sparkles, Headphones, BookOpen, Target
} from 'lucide-react';

interface Question {
  id: number;
  type: 'listening' | 'reading';
  passage?: string;
  audioText?: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ExamSuite {
  id: string;
  title: string;
  category: 'TOEIC' | 'IELTS';
  durationMinutes: number;
  totalQuestions: number;
  description: string;
  questions: Question[];
}

const MOCK_EXAMS: ExamSuite[] = [
  {
    id: 'toeic-mini-01',
    title: 'TOEIC Mini Mock Test 01 - Business Communication',
    category: 'TOEIC',
    durationMinutes: 15,
    totalQuestions: 5,
    description: 'Thử thách nhanh Part 1, Part 5 & Part 7 chuẩn định dạng TOEIC 2026.',
    questions: [
      {
        id: 1,
        type: 'listening',
        audioText: 'The woman is presenting quarterly sales data on the interactive whiteboard while colleagues take notes.',
        questionText: 'Look at the picture. Select the statement that best describes what you hear:',
        options: [
          'A) She is cleaning the white board.',
          'B) She is delivering a business presentation.',
          'C) The attendees are leaving the conference room.',
          'D) A project plan is being printed.'
        ],
        correctAnswer: 1,
        explanation: 'Người phụ nữ đang thuyết trình báo cáo kinh doanh trước các đồng nghiệp.'
      },
      {
        id: 2,
        type: 'reading',
        questionText: 'The human resources department requests that all new employees submit their tax documents _______ Friday afternoon.',
        options: [
          'A) prior',
          'B) until',
          'C) before',
          'D) ahead'
        ],
        correctAnswer: 2,
        explanation: '"before Friday afternoon" là cụm chỉ mốc thời gian hoàn thành chính xác nhất. (ahead cần kèm "of", prior cần "to").'
      },
      {
        id: 3,
        type: 'reading',
        passage: 'MEMORANDUM\nTo: All Marketing Personnel\nFrom: Executive Board\nSubject: Digital Media Transformation\n\nStarting next month, all brand campaign assets must undergo AI-driven compliance checks prior to public distribution. This initiative aims to streamline international copyright verification.',
        questionText: 'What is the main purpose of the new policy mentioned in the memorandum?',
        options: [
          'A) To reduce marketing personnel budget',
          'B) To verify copyright compliance automatically before campaign distribution',
          'C) To hire new copyright lawyers',
          'D) To cancel digital brand campaigns'
        ],
        correctAnswer: 1,
        explanation: 'Mục đích chính là kiểm tra tuân thủ bản quyền tự động thông qua AI trước khi công bố chiến dịch.'
      },
      {
        id: 4,
        type: 'listening',
        audioText: 'Could you tell me when the annual financial audit report will be finalized?',
        questionText: 'Listen to the audio question and choose the best response:',
        options: [
          'A) Yes, I like financial accounting.',
          'B) By the end of this week at the latest.',
          'C) The auditor was very polite.',
          'D) We should audit the inventory.'
        ],
        correctAnswer: 1,
        explanation: 'Câu hỏi "when" đòi hỏi câu trả lời chỉ mốc thời gian: "By the end of this week at the latest".'
      },
      {
        id: 5,
        type: 'reading',
        questionText: 'Despite severe weather disruptions, the supply chain logistics team managed to deliver the equipment _______ on schedule.',
        options: [
          'A) exact',
          'B) exactly',
          'C) exactness',
          'D) exacting'
        ],
        correctAnswer: 1,
        explanation: 'Cần trạng từ "exactly" để bổ nghĩa cho cụm giới từ "on schedule".'
      }
    ]
  },
  {
    id: 'ielts-reading-01',
    title: 'IELTS Academic Reading - AI & Cognitive Science',
    category: 'IELTS',
    durationMinutes: 20,
    totalQuestions: 4,
    description: 'Bài thi đọc hiểu chuẩn Band 7.0+ về ứng dụng trí tuệ nhân tạo trong khoa học nhận thức.',
    questions: [
      {
        id: 1,
        type: 'reading',
        passage: 'Paragraph A: Recent breakthroughs in artificial neural networks have permitted computational models to emulate human memory consolidation during sleep. Researchers at Cambridge demonstrated that spaced repetition algorithm parameters match synaptic plasticity decay functions in the hippocampus.',
        questionText: 'According to Paragraph A, what similarity was discovered by Cambridge researchers?',
        options: [
          'A) Human sleep patterns are identical to computer processors.',
          'B) Spaced repetition algorithms mirror hippocampal synaptic plasticity decay.',
          'C) AI can replace natural human memory entirely.',
          'D) Memory consolidation only occurs during computational modeling.'
        ],
        correctAnswer: 1,
        explanation: 'Đoạn A chỉ ra tham số thuật toán lặp lại ngắt quãng trùng khớp với hàm suy giảm dẻo thần kinh ở não bộ (hippocampus).'
      },
      {
        id: 2,
        type: 'reading',
        passage: 'Paragraph B: Traditional rote learning methods often fail due to cognitive overload. In contrast, adaptive micro-learning breaks complex semantic concepts into digestible flashcards, decreasing cognitive friction by up to 42%.',
        questionText: 'What advantage of adaptive micro-learning is explicitly highlighted in Paragraph B?',
        options: [
          'A) It eliminates the need for vocabulary reviews.',
          'B) It reduces cognitive friction by up to 42%.',
          'C) It requires longer study sessions.',
          'D) It is cheaper than traditional textbooks.'
        ],
        correctAnswer: 1,
        explanation: 'Bài viết khẳng định học nhỏ thích ứng giảm ma sát nhận thức (cognitive friction) lên tới 42%.'
      },
      {
        id: 3,
        type: 'listening',
        audioText: 'Welcome to IELTS Academic Listening Task. Listen carefully: The lecture on cognitive neuroscience will commence in Seminar Hall B at 10:30 AM tomorrow.',
        questionText: 'Where and when will the neuroscience lecture take place?',
        options: [
          'A) Main Auditorium at 10:00 AM',
          'B) Seminar Hall B at 10:30 AM',
          'C) Biology Lab at 11:30 AM',
          'D) Online via Zoom at 10:30 AM'
        ],
        correctAnswer: 1,
        explanation: 'Thông tin trong đĩa nghe: "Seminar Hall B at 10:30 AM tomorrow".'
      },
      {
        id: 4,
        type: 'reading',
        questionText: 'Which term best replaces "emulate" in Paragraph A without changing its meaning?',
        options: [
          'A) Imitate / replicate',
          'B) Contradict / oppose',
          'C) Ignore / disregard',
          'D) Accelerate / hasten'
        ],
        correctAnswer: 0,
        explanation: '"Emulate" nghĩa là mô phỏng, bắt chước theo (imitate/replicate).'
      }
    ]
  }
];

export const ExamPracticePage: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState<ExamSuite | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Timer logic
  useEffect(() => {
    if (!selectedExam || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedExam, isSubmitted]);

  const startExam = (exam: ExamSuite) => {
    setSelectedExam(exam);
    setCurrentQIndex(0);
    setUserAnswers({});
    setFlagged({});
    setTimeLeft(exam.durationMinutes * 60);
    setIsSubmitted(false);
  };

  const handleSelectOption = (qId: number, optionIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const toggleFlag = (qId: number) => {
    setFlagged((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const playAudioPrompt = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt không hỗ trợ phát âm tự động.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const calculateScore = () => {
    if (!selectedExam) return { correct: 0, total: 0, percentage: 0, estimatedBand: '' };
    let correct = 0;
    selectedExam.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) correct++;
    });
    const total = selectedExam.questions.length;
    const percentage = Math.round((correct / total) * 100);
    
    let estimatedBand = '';
    if (selectedExam.category === 'TOEIC') {
      const estimatedTOEIC = Math.round(400 + (percentage / 100) * 550);
      estimatedBand = `TOEIC ~ ${estimatedTOEIC}/990`;
    } else {
      const band = (5.0 + (percentage / 100) * 4.0).toFixed(1);
      estimatedBand = `IELTS Band ~ ${band}`;
    }
    
    return { correct, total, percentage, estimatedBand };
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Exam Selection Dashboard
  if (!selectedExam) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-blue-100">
              Exam Simulator 2026
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mt-3 mb-2 tracking-tight">
              Phòng Thi Giả Lập TOEIC & IELTS AI
            </h1>
            <p className="text-blue-100 max-w-2xl text-sm sm:text-base">
              Luyện thi với ngân hàng đề tiêu chuẩn, giao diện thi thực tế có đồng hồ đếm ngược và hệ thống phân tích kết quả dự đoán điểm Band tự động.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-blue-100">
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                <Clock className="w-4 h-4 text-amber-300" /> Đồng hồ đếm ngược chuẩn
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                <Headphones className="w-4 h-4 text-emerald-300" /> Giọng đọc chuẩn bản ngữ AI
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                <Award className="w-4 h-4 text-purple-300" /> Dự đoán điểm TOEIC / IELTS
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" /> Danh Sách Đề Thi Khả Dụng
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_EXAMS.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                      exam.category === 'TOEIC'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {exam.category}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {exam.durationMinutes} phút
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{exam.title}</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{exam.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  {exam.totalQuestions} câu hỏi đầy đủ
                </span>
                <button
                  onClick={() => startExam(exam)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                >
                  Bắt Đầu Làm Bài <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Active Exam Interface
  const currentQ = selectedExam.questions[currentQIndex];
  const score = calculateScore();

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top Header Controls */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4 sticky top-16 z-30">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{selectedExam.category} Exam</span>
            <h2 className="text-base font-bold text-slate-900">{selectedExam.title}</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer Badge */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-extrabold font-mono border ${
              timeLeft < 180 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>

            {!isSubmitted ? (
              <button
                onClick={() => setIsSubmitted(true)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Nộp Bài
              </button>
            ) : (
              <button
                onClick={() => setSelectedExam(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Thoát Đề Thi
              </button>
            )}
          </div>
        </div>

        {/* Results Screen if Submitted */}
        {isSubmitted && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg mb-8 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-1">Kết Quả Bài Thi Đã Hoàn Thành!</h3>
            <p className="text-slate-500 text-sm mb-6">Chi tiết kết quả đánh giá năng lực AI theo tiêu chuẩn chuẩn quốc tế.</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">Số Câu Đúng</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600">{score.correct} / {score.total}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">Tỷ Lệ Chính Xác</span>
                <span className="text-xl sm:text-2xl font-black text-blue-600">{score.percentage}%</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 col-span-2">
                <span className="text-xs text-slate-500 block mb-1">Dự Đoán Năng Lực AI</span>
                <span className="text-lg sm:text-xl font-black text-purple-700">{score.estimatedBand}</span>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-left max-w-3xl mx-auto mb-6">
              <div className="flex items-center gap-2 text-purple-900 font-bold mb-1">
                <Sparkles className="w-4 h-4 text-purple-600" /> Nhận Xét & Khuyến Nghị Tự Động từ AI Beepoly:
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                {score.percentage >= 80 
                  ? 'Tuyệt vời! Bạn có vốn từ vựng phong phú và kỹ năng xử lý ngữ cảnh rất tốt. Hãy duy trì tốc độ làm bài này!'
                  : score.percentage >= 50
                  ? 'Khá tốt! Bạn hiểu cấu trúc câu cơ bản nhưng cần nâng cao từ vựng chuyên ngành trong bài đọc và phát âm nối âm trong bài nghe.'
                  : 'Cần luyện tập thêm! Hãy dành thời gian xem kỹ phần giải thích đáp án bên dưới và ôn lại bộ từ vựng ngắt quãng trong mục My Vocabulary.'}
              </p>
            </div>
          </div>
        )}

        {/* Main Test Body */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question View Area (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Câu hỏi {currentQIndex + 1} / {selectedExam.questions.length} ({currentQ.type.toUpperCase()})
                </span>
                <button
                  onClick={() => toggleFlag(currentQ.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    flagged[currentQ.id] ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" /> {flagged[currentQ.id] ? 'Đã đánh dấu' : 'Đánh dấu xem lại'}
                </button>
              </div>

              {/* Listening Audio Button if Listening question */}
              {currentQ.type === 'listening' && currentQ.audioText && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-blue-900">Audio Bài Nghe TOEIC/IELTS</h4>
                      <p className="text-xs text-blue-700">Nhấn nút bên cạnh để nghe đoạn audio bản ngữ</p>
                    </div>
                  </div>
                  <button
                    onClick={() => playAudioPrompt(currentQ.audioText!)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      isPlayingAudio
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" /> {isPlayingAudio ? 'Đang phát...' : 'Phát Audio'}
                  </button>
                </div>
              )}

              {/* Reading Passage if available */}
              {currentQ.passage && (
                <div className="mb-6 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm font-serif leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto">
                  {currentQ.passage}
                </div>
              )}

              {/* Question Title */}
              <h3 className="text-lg font-bold text-slate-900 mb-6 leading-snug">
                {currentQ.questionText}
              </h3>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = userAnswers[currentQ.id] === idx;
                  const isCorrect = currentQ.correctAnswer === idx;

                  let optionStyle = 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700';

                  if (isSubmitted) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'bg-red-50 border-red-400 text-red-900 font-semibold';
                    } else {
                      optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-2 ring-blue-600/20';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(currentQ.id, idx)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-4 rounded-2xl border text-sm transition-all flex items-start justify-between gap-3 ${optionStyle}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
                      {isSubmitted && isSelected && !isCorrect && <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {isSubmitted && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed mb-6">
                  <span className="font-bold block mb-1">💡 Giải thích chi tiết từ AI Beepoly:</span>
                  {currentQ.explanation}
                </div>
              )}

              {/* Next / Previous Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQIndex === 0}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 text-xs font-bold flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Câu Trước
                </button>

                <span className="text-xs text-slate-500 font-semibold">
                  {currentQIndex + 1} trên {selectedExam.questions.length}
                </span>

                <button
                  onClick={() => setCurrentQIndex((prev) => Math.min(selectedExam.questions.length - 1, prev + 1))}
                  disabled={currentQIndex === selectedExam.questions.length - 1}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl disabled:opacity-40 text-xs font-bold flex items-center gap-1.5"
                >
                  Câu Tiết <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Question Palette Grid Sidebar (1 Col) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm sticky top-36">
              <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" /> Sơ Đồ Câu Hỏi
              </h4>

              <div className="grid grid-cols-4 gap-2 mb-6">
                {selectedExam.questions.map((q, index) => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isCurrent = currentQIndex === index;
                  const isFlag = flagged[q.id];

                  let btnClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                  if (isSubmitted) {
                    btnClass = userAnswers[q.id] === q.correctAnswer
                      ? 'bg-emerald-500 text-white font-bold'
                      : 'bg-red-500 text-white font-bold';
                  } else if (isCurrent) {
                    btnClass = 'ring-2 ring-blue-600 bg-blue-600 text-white font-bold';
                  } else if (isAnswered) {
                    btnClass = 'bg-blue-100 text-blue-800 font-bold';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQIndex(index)}
                      className={`h-10 rounded-xl text-xs flex items-center justify-center relative transition-all ${btnClass}`}
                    >
                      {index + 1}
                      {isFlag && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Status Legend */}
              <div className="space-y-2 text-xs text-slate-600 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-600"></div> Đang làm
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-100 border border-blue-400"></div> Đã trả lời
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber-500"></div> Đã đánh dấu xem lại
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
