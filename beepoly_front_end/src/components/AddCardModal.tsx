import React, { useState } from 'react';
import { useDeckStore } from '../stores/deckStore';
import type { Flashcard } from '../types/deck';
import { X } from 'lucide-react';

interface AddCardModalProps {
  isOpen: boolean;
  deckId: number;
  onClose: () => void;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, deckId, onClose }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<Flashcard['status']>('New');
  const addFlashcard = useDeckStore((state) => state.addFlashcard);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    addFlashcard(deckId, question.trim(), answer.trim(), status);
    setQuestion('');
    setAnswer('');
    setStatus('New');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Add new flashcard</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Question / Word (English)
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. articulate"
              required
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/12 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Answer Preview (Meaning)
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="e.g. diễn đạt lưu loát"
              required
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/12 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Flashcard['status'])}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/12 transition-all"
            >
              <option value="New">New</option>
              <option value="Learning">Learning</option>
              <option value="Mastered">Mastered</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-sm hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-md shadow-blue-600/25 transition-all"
            >
              Add Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
