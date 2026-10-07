import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeckStore } from '../stores/deckStore';
import { Flame, Trophy, Clock, BookOpen, ChevronRight, Zap, Target, Sparkles } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { decks } = useDeckStore();

  // Decks that need review
  const dueDecks = decks.filter((d) => d.mastered < 100);
  const totalMasteredCount = decks.reduce((acc, d) => acc + d.stats.mastered, 0);
  const totalCardsCount = decks.reduce((acc, d) => acc + d.cards, 0);

  // Skill Scores (0 - 100)
  const skillScores = {
    listening: 85,
    speaking: 68,
    reading: 92,
    writing: 74
  };

  // Weekdays Streak Tracker
  const weekDays = [
    { day: 'Mon', active: true },
    { day: 'Tue', active: true },
    { day: 'Wed', active: true },
    { day: 'Thu', active: true },
    { day: 'Fri', active: true },
    { day: 'Sat', active: true },
    { day: 'Sun', active: true }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Welcome back, Learner!</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Ready to boost your vocabulary today?
          </h1>
          <p className="text-blue-100 text-sm mb-6 leading-relaxed">
            You have <strong className="text-white font-bold">{dueDecks.length} decks</strong> waiting for review. Keep up your study streak to achieve your target CEFR level!
          </p>
          <button
            onClick={() => navigate(`/deck/${dueDecks[0]?.id || 1}`)}
            className="px-6 py-3 bg-white text-blue-600 font-bold text-sm rounded-full shadow-lg hover:bg-blue-50 transition-all inline-flex items-center gap-2"
          >
            <span>Start Today's Review</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Metric 1: Streak */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Study Streak</div>
            <div className="text-3xl font-extrabold text-slate-900 flex items-center gap-1">
              <span>7</span>
              <span className="text-base font-bold text-amber-500">Days</span>
            </div>
            <div className="text-xs text-emerald-600 font-medium mt-1">🔥 Personal Record!</div>
          </div>
          <div className="w-12 h-12 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center">
            <Flame className="w-6 h-6 fill-amber-500" />
          </div>
        </div>

        {/* Metric 2: Total EXP */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Experience</div>
            <div className="text-3xl font-extrabold text-slate-900">2,450</div>
            <div className="text-xs text-blue-600 font-medium mt-1">+180 EXP this week</div>
          </div>
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <Zap className="w-6 h-6 fill-blue-600" />
          </div>
        </div>

        {/* Metric 3: Mastered Words */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Mastered Words</div>
            <div className="text-3xl font-extrabold text-slate-900">{totalMasteredCount}</div>
            <div className="text-xs text-slate-400 font-medium mt-1">out of {totalCardsCount} total cards</div>
          </div>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Daily Study Time */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Avg Study Time</div>
            <div className="text-3xl font-extrabold text-slate-900">35<span className="text-base font-bold text-slate-400">m</span></div>
            <div className="text-xs text-slate-400 font-medium mt-1">Daily target: 30m</div>
          </div>
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid Section: Streak & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Left Col (2 cols): Weekly Streak & Recommended Decks */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Weekly Activity Tracker */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Weekly Activity</h2>
                <p className="text-xs text-slate-400">Complete 1 session daily to keep your flame burning</p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold text-amber-700">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>7 Day Streak</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-3 text-center">
              {weekDays.map((w, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    w.active ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {w.active ? <Flame className="w-5 h-5 fill-white" /> : w.day[0]}
                  </div>
                  <span className="text-xs font-semibold text-slate-600">{w.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Decks Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recommended for Review</h2>
                <p className="text-xs text-slate-400">Decks containing cards due for spaced repetition today</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View all decks
              </button>
            </div>

            <div className="space-y-4">
              {dueDecks.slice(0, 3).map((deck) => (
                <div
                  key={deck.id}
                  onClick={() => navigate(`/deck/${deck.id}`)}
                  className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{deck.title}</h3>
                      <div className="text-xs text-slate-400">{deck.cards} cards • {deck.mastered}% mastered</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${deck.mastered}%` }} />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col (1 col): Skill Radar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Skill Radar</h2>
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Your overall proficiency score across 4 core English language skills
            </p>

            {/* Visual Skill Progress Bars */}
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700">🎧 Listening</span>
                  <span className="text-blue-600">{skillScores.listening}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${skillScores.listening}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700">🗣 Speaking</span>
                  <span className="text-amber-600">{skillScores.speaking}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${skillScores.speaking}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700">📖 Reading</span>
                  <span className="text-emerald-600">{skillScores.reading}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${skillScores.reading}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700">✍️ Writing</span>
                  <span className="text-purple-600">{skillScores.writing}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${skillScores.writing}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <div className="text-xs font-bold text-slate-700 mb-1">Target CEFR Level: B2</div>
            <p className="text-[11px] text-slate-400">Keep practicing speaking to balance your overall radar score!</p>
          </div>
        </div>

      </div>

    </div>
  );
};
