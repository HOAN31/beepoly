import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeckStore } from '../stores/deckStore';
import { CreateDeckModal } from '../components/CreateDeckModal';
import { Plus, Search, BookOpen, BarChart3, GraduationCap, Languages, Code2, Mic, ChevronRight, ChevronLeft } from 'lucide-react';

export const DeckListPage: React.FC = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    decks,
    filter,
    searchQuery,
    currentPage,
    pageSize,
    setFilter,
    setSearchQuery,
    setCurrentPage,
  } = useDeckStore();

  // Icon selector helper
  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'book': return <BookOpen className="w-5 h-5 text-sky-600" />;
      case 'chart': return <BarChart3 className="w-5 h-5 text-emerald-600" />;
      case 'graduation': return <GraduationCap className="w-5 h-5 text-amber-600" />;
      case 'language': return <Languages className="w-5 h-5 text-indigo-600" />;
      case 'code': return <Code2 className="w-5 h-5 text-emerald-600" />;
      case 'sound': return <Mic className="w-5 h-5 text-orange-600" />;
      default: return <BookOpen className="w-5 h-5 text-sky-600" />;
    }
  };

  const getThemeBg = (theme: string) => {
    switch (theme) {
      case 'theme-blue': return 'bg-sky-100';
      case 'theme-green': return 'bg-emerald-100';
      case 'theme-yellow': return 'bg-amber-100';
      case 'theme-purple': return 'bg-indigo-100';
      case 'theme-emerald': return 'bg-emerald-100';
      case 'theme-orange': return 'bg-orange-100';
      default: return 'bg-sky-100';
    }
  };

  // Filter & Search Logic
  const filteredDecks = decks.filter((deck) => {
    const matchesSearch = deck.title.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesTab = true;
    if (filter === 'due') matchesTab = deck.mastered < 100;
    if (filter === 'mastered') matchesTab = deck.mastered === 100;
    return matchesSearch && matchesTab;
  });

  const totalItems = filteredDecks.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pageItems = filteredDecks.slice(startIndex, endIndex);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            Your library
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            My Vocabulary
          </h1>
          <p className="text-sm text-slate-500">
            Your decks, organized and ready to review
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold text-sm hover:bg-blue-700 shadow-md shadow-blue-600/25 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create new deck</span>
        </button>
      </div>

      {/* Controls Bar: Search & Filter Tabs */}
      <div className="bg-slate-100/80 rounded-2xl p-3 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-8">
        {/* Search Box */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search decks..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/12 transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="inline-flex bg-slate-200/60 p-1 rounded-xl gap-1 self-start md:self-auto w-full md:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-white text-blue-600 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('due')}
            className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-xs font-medium transition-all ${
              filter === 'due'
                ? 'bg-white text-blue-600 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Due for review
          </button>
          <button
            onClick={() => setFilter('mastered')}
            className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-xs font-medium transition-all ${
              filter === 'mastered'
                ? 'bg-white text-blue-600 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mastered
          </button>
        </div>
      </div>

      {/* Summary Info Row */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm font-bold text-slate-900">
          {totalItems} deck{totalItems === 1 ? '' : 's'}
        </div>
        <div className="text-xs text-slate-400">
          {totalItems > 0 ? `Showing ${startIndex + 1}–${endIndex} of ${totalItems}` : 'Showing 0 of 0'}
        </div>
      </div>

      {/* Deck Grid */}
      {pageItems.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 mb-8">
          <p className="text-base font-semibold text-slate-700">No decks found</p>
          <p className="text-xs mt-1">Try changing your search query or filter status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {pageItems.map((deck) => (
            <div
              key={deck.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-slate-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${getThemeBg(deck.theme)}`}>
                    {renderIcon(deck.icon)}
                  </div>
                  {deck.complete && (
                    <span className="text-xs font-semibold text-emerald-600">Complete</span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{deck.title}</h3>
                <p className="text-xs text-slate-400 mb-6">{deck.created}</p>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-bold text-slate-900">{deck.cards} cards</span>
                  <span className="font-semibold text-slate-500">{deck.mastered}% mastered</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${deck.mastered}%` }}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => navigate(`/deck/${deck.id}`)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span>Open Deck</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      <div className="flex justify-end items-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-9 h-9 rounded-lg font-semibold text-xs transition-all ${
              page === currentPage
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Create Deck Modal */}
      <CreateDeckModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};
