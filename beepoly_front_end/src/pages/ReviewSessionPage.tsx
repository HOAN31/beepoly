import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDeckStore } from '../stores/deckStore';
import type { Flashcard } from '../types/deck';
import { calculateSM2, type SM2Rating } from '../utils/sm2';
import { DeckService } from '../services/deckService';
import { ChevronLeft, Volume2, RotateCw, Trophy, CheckCircle2, Clock, Zap, ArrowRight } from 'lucide-react';

export const ReviewSessionPage: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const id = Number(deckId);

  const { decks, flashcards } = useDeckStore();

  const deck = decks.find((d) => d.id === id);
  const deckCards = flashcards.filter((f) => f.deckId === id);

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [secondsSpent, setSecondsSpent] = useState(0);

  // Session Ratings Stats Tracker
  const [stats, setStats] = useState({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0
  });

  // Timer counter
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setSecondsSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (!isFlipped) {
          setIsFlipped(true);
        }
      }

      if (isFlipped) {
        if (e.key === '1') handleRating('again');
        if (e.key === '2') handleRating('hard');
        if (e.key === '3') handleRating('good');
        if (e.key === '4') handleRating('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, isCompleted, currentIndex]);

  if (!deck || deckCards.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No flashcards available</h2>
        <p className="text-slate-500 text-sm mb-6">This deck does not have any flashcards to review yet.</p>
        <button
          onClick={() => navigate(`/deck/${id}`)}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-600/25"
        >
          Return to Deck Detail
        </button>
      </div>
    );
  }

  const currentCard: Flashcard = deckCards[currentIndex];

  // Text-to-Speech Web Audio Playback
  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle Review Rating Selection
  const handleRating = async (rating: SM2Rating) => {
    // 1. Calculate SM-2 Spaced Repetition Next Review Date
    const sm2Result = calculateSM2(
      { repetitions: 1, easeFactor: 2.5, interval: 1 },
      rating
    );

    // 2. Persist to Supabase Database
    await DeckService.saveReviewHistory(
      1,
      currentCard.id,
      sm2Result.easeFactor,
      sm2Result.interval,
      sm2Result.nextReviewDate
    );

    // 3. Track Rating Statistics
    setStats((prev) => ({
      ...prev,
      [rating]: prev[rating] + 1
    }));

    // 4. Advance to Next Card or Complete Session
    setIsFlipped(false);
    if (currentIndex + 1 < deckCards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ==================== SUMMARY SCREEN ====================
  if (isCompleted) {
    const expGained = deckCards.length * 15;
    return (
      <div className="max-w-xl mx-auto px-4 py-12 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center">
          <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Trophy className="w-10 h-10 stroke-[2.5]" />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Session Completed! 🎉
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Great job! You have reviewed all <strong className="text-slate-900">{deckCards.length} flashcards</strong> in <strong className="text-blue-600">{deck.title}</strong>.
          </p>

          {/* EXP Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-4 flex items-center justify-between mb-8 shadow-md shadow-blue-600/20">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 fill-amber-400 text-amber-400" />
              <span className="font-bold text-sm">Experience Points Earned</span>
            </div>
            <span className="font-extrabold text-xl text-amber-300">+{expGained} EXP</span>
          </div>

          {/* Stats Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <div className="text-[11px] font-bold text-rose-600 uppercase mb-1">🔴 Again</div>
              <div className="text-xl font-black text-slate-900">{stats.again}</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <div className="text-[11px] font-bold text-amber-600 uppercase mb-1">🟠 Hard</div>
              <div className="text-xl font-black text-slate-900">{stats.hard}</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <div className="text-[11px] font-bold text-emerald-600 uppercase mb-1">🟢 Good</div>
              <div className="text-xl font-black text-slate-900">{stats.good}</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <div className="text-[11px] font-bold text-blue-600 uppercase mb-1">🔵 Easy</div>
              <div className="text-xl font-black text-slate-900">{stats.easy}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setIsFlipped(false);
                setIsCompleted(false);
                setSecondsSpent(0);
                setStats({ again: 0, hard: 0, good: 0, easy: 0 });
              }}
              className="flex-1 py-3 px-6 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              <span>Review Again</span>
            </button>

            <button
              onClick={() => navigate(`/deck/${id}`)}
              className="flex-1 py-3 px-6 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2"
            >
              <span>Back to Deck Detail</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== ACTIVE REVIEW SESSION VIEW ====================
  const progressPercent = Math.round(((currentIndex + 1) / deckCards.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      
      {/* Session Progress Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(`/deck/${id}`)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Exit Session</span>
        </button>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{formatTimer(secondsSpent)}</span>
          </div>

          <span>
            Card <strong className="text-blue-600 font-bold">{currentIndex + 1}</strong> / {deckCards.length}
          </span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 3D Flip Card Container */}
      <div className="perspective-1000 mb-8">
        <div
          onClick={() => !isFlipped && setIsFlipped(true)}
          className={`relative w-full min-h-[360px] bg-white border border-slate-200 rounded-3xl p-8 shadow-xl cursor-pointer transition-all duration-500 flex flex-col justify-between select-none ${
            isFlipped ? 'bg-slate-50/50' : 'hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-600/5'
          }`}
        >
          {/* Card Top Row */}
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isFlipped ? 'Back • Answer & Meaning' : 'Front • Question / Word'}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playAudio(currentCard.question);
              }}
              className="p-2.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              title="Listen to Pronunciation"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Card Center Content */}
          <div className="my-auto text-center py-6">
            {!isFlipped ? (
              <div>
                <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                  {currentCard.question}
                </h2>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  English Vocabulary
                </p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-200">
                <div className="text-3xl font-extrabold text-slate-900 mb-2">
                  {currentCard.question}
                </div>
                <div className="text-2xl font-bold text-blue-600 italic mb-4">
                  {currentCard.answer}
                </div>
                <p className="text-sm text-slate-500 italic max-w-md mx-auto">
                  "Practice this word in daily conversations to master it permanently."
                </p>
              </div>
            )}
          </div>

          {/* Card Bottom Helper */}
          <div className="text-center text-xs text-slate-400 font-medium pt-4 border-t border-slate-100">
            {!isFlipped ? (
              <div className="flex items-center justify-center gap-1.5 text-blue-600 font-semibold">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Click card or press Space to flip answer</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1 text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Select your rating below or press 1-4</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Rating Controls (Show after flipped) */}
      {isFlipped ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <button
            onClick={() => handleRating('again')}
            className="py-3.5 px-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl font-bold text-sm hover:bg-rose-100 transition-all flex flex-col items-center justify-center gap-0.5 shadow-2xs"
          >
            <span>🔴 Again</span>
            <span className="text-[11px] font-normal text-rose-500">&lt; 1 day (1)</span>
          </button>

          <button
            onClick={() => handleRating('hard')}
            className="py-3.5 px-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl font-bold text-sm hover:bg-amber-100 transition-all flex flex-col items-center justify-center gap-0.5 shadow-2xs"
          >
            <span>🟠 Hard</span>
            <span className="text-[11px] font-normal text-amber-500">2 days (2)</span>
          </button>

          <button
            onClick={() => handleRating('good')}
            className="py-3.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl font-bold text-sm hover:bg-emerald-100 transition-all flex flex-col items-center justify-center gap-0.5 shadow-2xs"
          >
            <span>🟢 Good</span>
            <span className="text-[11px] font-normal text-emerald-600">4 days (3)</span>
          </button>

          <button
            onClick={() => handleRating('easy')}
            className="py-3.5 px-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl font-bold text-sm hover:bg-blue-100 transition-all flex flex-col items-center justify-center gap-0.5 shadow-2xs"
          >
            <span>🔵 Easy</span>
            <span className="text-[11px] font-normal text-blue-500">7 days (4)</span>
          </button>
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={() => setIsFlipped(true)}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
          >
            <span>Show Answer (Space)</span>
          </button>
        </div>
      )}

    </div>
  );
};
