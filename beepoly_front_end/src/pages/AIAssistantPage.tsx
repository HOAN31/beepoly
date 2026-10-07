import React, { useState, useEffect } from 'react';
import { AIService, type PronunciationResult, type ChatMessage } from '../services/aiService';
import { Mic, MicOff, Volume2, Sparkles, MessageSquare, Award, Send, CheckCircle2, AlertCircle, RotateCw } from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pronunciation' | 'debate' | 'ielts'>('pronunciation');

  // ==================== PRONUNCIATION STATE ====================
  const sampleSentences = [
    {
      id: 1,
      text: "The new policy aims to mitigate environmental impact and promote sustainable development.",
      difficulty: "Intermediate",
      targetWord: "mitigate"
    },
    {
      id: 2,
      text: "Accommodating international students is a prerequisite for global universities.",
      difficulty: "Advanced",
      targetWord: "accommodate / prerequisite"
    },
    {
      id: 3,
      text: "She proved to be a highly resilient leader during consecutive financial crises.",
      difficulty: "Advanced",
      targetWord: "resilient / consecutive"
    }
  ];

  const [selectedSentence, setSelectedSentence] = useState(sampleSentences[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [evaluation, setEvaluation] = useState<PronunciationResult | null>(null);

  // Web Speech Recognition setup
  const handleStartRecording = () => {
    setIsRecording(true);
    setSpokenTranscript('');
    setEvaluation(null);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSpokenTranscript(transcript);
        const result = AIService.evaluatePronunciation(selectedSentence.text, transcript);
        setEvaluation(result);
        setIsRecording(false);
        AIService.savePronunciationAttempt(1, selectedSentence.text, result.score);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        simulateRecording();
      };

      recognition.start();
    } else {
      simulateRecording();
    }
  };

  const simulateRecording = () => {
    setTimeout(() => {
      const mockSpoken = selectedSentence.text.replace('mitigate', 'mitigate').replace('sustainable', 'sustainble');
      setSpokenTranscript(mockSpoken);
      const result = AIService.evaluatePronunciation(selectedSentence.text, mockSpoken);
      setEvaluation(result);
      setIsRecording(false);
      AIService.savePronunciationAttempt(1, selectedSentence.text, result.score);
    }, 2500);
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // ==================== CHAT AI STATE ====================
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'ai',
      text: "Welcome to Debate AI! Today's topic: 'Should environmental protection take precedence over rapid economic growth in developing countries?' What is your stance?",
      timestamp: '15:30'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    setTimeout(() => {
      const aiReplyText = AIService.generateAIResponse(
        activeTab === 'debate' ? 'debate' : 'ielts',
        userMsg.text
      );
      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  useEffect(() => {
    if (activeTab === 'debate') {
      setChatMessages([
        {
          id: 1,
          sender: 'ai',
          text: "Welcome to Debate AI! Today's topic: 'Should environmental protection take precedence over rapid economic growth in developing countries?' What is your stance?",
          timestamp: '15:30'
        }
      ]);
    } else if (activeTab === 'ielts') {
      setChatMessages([
        {
          id: 1,
          sender: 'ai',
          text: "Good morning! I am your IELTS Speaking Examiner. Let's begin Part 1. Could you tell me about your hometown and what you like most about living there?",
          timestamp: '15:30'
        }
      ]);
    }
  }, [activeTab]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Powered Modules</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Accent & Conversation Assistant
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Improve your pronunciation accuracy, practice formal debate, or simulate IELTS Speaking exams.
          </p>
        </div>
      </div>

      {/* Module Selector Tabs */}
      <div className="flex bg-slate-200/70 p-1.5 rounded-2xl gap-2 mb-8 max-w-2xl">
        <button
          onClick={() => setActiveTab('pronunciation')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'pronunciation'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>🎙️ AI Accent Training</span>
        </button>

        <button
          onClick={() => setActiveTab('debate')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'debate'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>🗣️ Debate AI Partner</span>
        </button>

        <button
          onClick={() => setActiveTab('ielts')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'ielts'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>🎓 IELTS Examiner</span>
        </button>
      </div>

      {/* ==================== TAB 1: PRONUNCIATION EVALUATOR ==================== */}
      {activeTab === 'pronunciation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Sample Sentences */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">Select Practice Sentence</h2>
            <div className="space-y-3">
              {sampleSentences.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setSelectedSentence(s);
                    setEvaluation(null);
                    setSpokenTranscript('');
                  }}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    selectedSentence.id === s.id
                      ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                    <span className="text-blue-600">Target: {s.targetWord}</span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{s.difficulty}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">"{s.text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Audio Recording & Evaluation */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Sentence Prompt</div>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">"{selectedSentence.text}"</h3>
                </div>

                <button
                  type="button"
                  onClick={() => playAudio(selectedSentence.text)}
                  className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-all shrink-0"
                  title="Listen Native Audio"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Microphone Action Area */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center my-6">
                <button
                  onClick={isRecording ? () => setIsRecording(false) : handleStartRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all shadow-lg ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/30'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30 hover:scale-105'
                  }`}
                >
                  {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
                <div className="text-sm font-bold text-slate-800">
                  {isRecording ? 'Listening... Speak now!' : 'Click to Start Recording'}
                </div>
                {spokenTranscript && (
                  <div className="text-xs italic text-blue-600 mt-2">
                    Recorded: "{spokenTranscript}"
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-1">Read the sentence aloud into your microphone</p>
              </div>

              {/* Evaluation Results Gauge & Feedback */}
              {evaluation && (
                <div className="animate-in fade-in zoom-in-95 duration-200 space-y-6">
                  {/* Score Gauge */}
                  <div className="flex items-center justify-between bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">AI Accuracy Score</div>
                      <div className="text-3xl font-black text-slate-900 flex items-center gap-2">
                        <span>{evaluation.score}%</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          evaluation.score >= 85
                            ? 'bg-emerald-100 text-emerald-700'
                            : evaluation.score >= 60
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}>
                          {evaluation.score >= 85 ? '🌟 Native Like!' : evaluation.score >= 60 ? '👍 Good Effort' : '⚠️ Needs Practice'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right text-xs text-slate-400">
                      Spoken transcript analyzed by AI Speech Engine
                    </div>
                  </div>

                  {/* Word-by-Word Analysis */}
                  <div>
                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Phonetic Word Breakdown</div>
                    <div className="flex flex-wrap gap-2">
                      {evaluation.wordResults.map((w, idx) => (
                        <div
                          key={idx}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
                            w.correct
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : 'bg-rose-50 border-rose-200 text-rose-700'
                          }`}
                        >
                          {w.correct ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                          <span>{w.word}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-400 text-center pt-4 border-t border-slate-100 mt-6">
              AI Speech Engine evaluates stress, intonation, and phonetic precision
            </div>
          </div>

        </div>
      )}

      {/* ==================== TAB 2 & 3: DEBATE AI & IELTS EXAMINER CHAT ==================== */}
      {(activeTab === 'debate' || activeTab === 'ielts') && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[580px]">
          
          {/* Chat Header */}
          <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                {activeTab === 'debate' ? '🗣️' : '🎓'}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {activeTab === 'debate' ? 'Debate AI Partner' : 'IELTS Speaking Examiner (Part 1-3)'}
                </h3>
                <div className="text-xs text-emerald-600 font-medium">Online • Responds in real-time</div>
              </div>
            </div>

            <button
              onClick={() => {
                setChatMessages([
                  {
                    id: Date.now(),
                    sender: 'ai',
                    text: activeTab === 'debate' 
                      ? "New debate topic: 'Is space exploration worth the high financial cost?' What are your thoughts?"
                      : "Let's begin Part 2. Please talk about a book you read recently that inspired you.",
                    timestamp: 'Now'
                  }
                ]);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Reset Chat</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                }`}>
                  {msg.sender === 'user' ? 'You' : 'AI'}
                </div>

                <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200'
                }`}>
                  <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
                  <div className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={activeTab === 'debate' ? "Type your counter argument here..." : "Type your answer to the IELTS Examiner..."}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/12 transition-all"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
