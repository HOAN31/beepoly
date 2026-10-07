import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDeckStore } from '../stores/deckStore';
import type { Flashcard } from '../types/deck';
import { AddCardModal } from '../components/AddCardModal';
import { ViewCardModal } from '../components/ViewCardModal';
import { ChevronLeft, Pencil, Trash2, Plus, Search, Eye } from 'lucide-react';

export const DeckDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deckId = Number(id);

  const { decks, flashcards, flashcardSearchQuery, setFlashcardSearchQuery, deleteDeck } = useDeckStore();

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);

  const deck = decks.find((d) => d.id === deckId);

  if (!deck) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Deck not found</h2>
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 font-semibold hover:underline"
        >
          Return to Deck List
        </button>
      </div>
    );
  }

  const deckCards = flashcards.filter((f) => f.deckId === deckId);
  const filteredCards = deckCards.filter(
    (card) =>
      card.question.toLowerCase().includes(flashcardSearchQuery.toLowerCase()) ||
      card.answer.toLowerCase().includes(flashcardSearchQuery.toLowerCase())
  );

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this deck?')) {
      deleteDeck(deckId);
      navigate('/');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to decks</span>
      </button>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            Vocabulary deck
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            {deck.title}
          </h1>
          <p className="text-sm text-slate-400">{deck.created}</p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => alert('Edit deck title')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-rose-200 rounded-full text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <button
            onClick={() => setIsAddCardOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add card</span>
          </button>

          <button
            onClick={() => alert('Review session starting...')}
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full text-xs font-semibold hover:bg-blue-700 shadow-md shadow-blue-600/25 transition-all"
          >
            <span>Start Review</span>
          </button>
        </div>
      </div>

      {/* Learning Overview Section */}
      <section className="mb-10">
        <h2 className="text-base font-bold text-slate-900 mb-4">Learning overview</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-3">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="text-xs font-semibold text-slate-500 mb-2">Total</div>
            <div className="text-3xl font-extrabold text-slate-900">{deck.stats.total}</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="text-xs font-semibold text-slate-500 mb-2">Mastered</div>
            <div className="text-3xl font-extrabold text-emerald-600">{deck.stats.mastered}</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="text-xs font-semibold text-slate-500 mb-2">Learning</div>
            <div className="text-3xl font-extrabold text-amber-600">{deck.stats.learning}</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="text-xs font-semibold text-slate-500 mb-2">New</div>
            <div className="text-3xl font-extrabold text-blue-600">{deck.stats.new}</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="text-xs font-semibold text-slate-500 mb-2">Accuracy</div>
            <div className="text-3xl font-extrabold text-sky-600">{deck.stats.accuracy}</div>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Est. learning time: <span className="font-semibold text-slate-600">~40 min</span>
        </p>
      </section>

      {/* Flashcards Table Section */}
      <section className="pt-6 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Flashcards in this deck</h2>
            <div className="text-xs text-slate-400">{deckCards.length} cards</div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={flashcardSearchQuery}
              onChange={(e) => setFlashcardSearchQuery(e.target.value)}
              placeholder="Search flashcards..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/12 transition-all"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6 w-16">#</th>
                  <th className="py-3.5 px-6">Question</th>
                  <th className="py-3.5 px-6">Answer Preview</th>
                  <th className="py-3.5 px-6 w-36">Status</th>
                  <th className="py-3.5 px-6 text-right w-32">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCards.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400 text-sm">
                      No flashcards found
                    </td>
                  </tr>
                ) : (
                  filteredCards.map((card, idx) => {
                    let badgeBg = 'bg-amber-100 text-amber-700';
                    if (card.status === 'New') badgeBg = 'bg-blue-100 text-blue-700';
                    if (card.status === 'Mastered') badgeBg = 'bg-emerald-100 text-emerald-700';

                    return (
                      <tr key={card.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 text-slate-400 font-medium">{idx + 1}</td>
                        <td className="py-4 px-6 font-bold text-slate-900">{card.question}</td>
                        <td className="py-4 px-6 italic text-slate-600">{card.answer}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeBg}`}>
                            • {card.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedCard(card)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View card</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modals */}
      <AddCardModal isOpen={isAddCardOpen} deckId={deckId} onClose={() => setIsAddCardOpen(false)} />
      <ViewCardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
    </div>
  );
};
