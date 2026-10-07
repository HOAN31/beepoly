import React from 'react';
import type { Flashcard } from '../types/deck';
import { X } from 'lucide-react';

interface ViewCardModalProps {
  card: Flashcard | null;
  onClose: () => void;
}

export const ViewCardModal: React.FC<ViewCardModalProps> = ({ card, onClose }) => {
  if (!card) return null;

  let badgeColor = 'bg-amber-100 text-amber-700';
  if (card.status === 'New') badgeColor = 'bg-blue-100 text-blue-700';
  if (card.status === 'Mastered') badgeColor = 'bg-emerald-100 text-emerald-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Flashcard Detail</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center mb-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Question / Word</div>
          <div className="text-2xl font-extrabold text-slate-900 mb-4">{card.question}</div>
          
          <hr className="border-slate-200 my-4" />

          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Meaning / Answer</div>
          <div className="text-lg italic text-slate-600">{card.answer}</div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
            • {card.status}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-sm hover:bg-slate-200 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
