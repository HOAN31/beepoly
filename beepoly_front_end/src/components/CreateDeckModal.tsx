import React, { useState } from 'react';
import { useDeckStore } from '../stores/deckStore';
import type { Deck } from '../types/deck';
import { X } from 'lucide-react';

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateDeckModal: React.FC<CreateDeckModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState<Deck['theme']>('theme-blue');
  const addDeck = useDeckStore((state) => state.addDeck);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addDeck(title.trim(), theme);
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Create new deck</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Deck Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. TOEIC Part 5"
              required
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/12 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Icon Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as Deck['theme'])}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/12 transition-all"
            >
              <option value="theme-blue">Book (Blue)</option>
              <option value="theme-green">Chart (Green)</option>
              <option value="theme-yellow">Graduation Cap (Yellow)</option>
              <option value="theme-purple">Language (Purple)</option>
              <option value="theme-emerald">Code (Emerald)</option>
              <option value="theme-orange">Speaking (Orange)</option>
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
              Create Deck
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
