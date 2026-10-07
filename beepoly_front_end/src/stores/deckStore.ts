import { create } from 'zustand';
import type { Deck, Flashcard } from '../types/deck';
import { DeckService } from '../services/deckService';

interface DeckState {
  decks: Deck[];
  flashcards: Flashcard[];
  filter: 'all' | 'due' | 'mastered';
  searchQuery: string;
  flashcardSearchQuery: string;
  currentPage: number;
  pageSize: number;
  isLoadingBackend: boolean;
  
  // Actions
  initializeBackend: () => Promise<void>;
  setFilter: (filter: 'all' | 'due' | 'mastered') => void;
  setSearchQuery: (query: string) => void;
  setFlashcardSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  addDeck: (title: string, theme: Deck['theme']) => Promise<void>;
  deleteDeck: (deckId: number) => Promise<void>;
  addFlashcard: (deckId: number, question: string, answer: string, status: Flashcard['status']) => Promise<void>;
}

const initialDecks: Deck[] = [
  {
    id: 1,
    title: 'English Vocabulary',
    created: 'Created Mar 14, 2026',
    cards: 120,
    mastered: 75,
    theme: 'theme-blue',
    icon: 'book',
    complete: false,
    stats: { total: 120, mastered: 62, learning: 28, new: 30, accuracy: '82%' }
  },
  {
    id: 2,
    title: 'Java OOP',
    created: 'Created Apr 2, 2026',
    cards: 85,
    mastered: 30,
    theme: 'theme-green',
    icon: 'chart',
    complete: false,
    stats: { total: 85, mastered: 25, learning: 40, new: 20, accuracy: '65%' }
  },
  {
    id: 3,
    title: 'Database SQL',
    created: 'Created Apr 18, 2026',
    cards: 60,
    mastered: 10,
    theme: 'theme-yellow',
    icon: 'graduation',
    complete: false,
    stats: { total: 60, mastered: 6, learning: 24, new: 30, accuracy: '50%' }
  },
  {
    id: 4,
    title: 'Business Emails',
    created: 'Created May 6, 2026',
    cards: 48,
    mastered: 100,
    theme: 'theme-purple',
    icon: 'language',
    complete: true,
    stats: { total: 48, mastered: 48, learning: 0, new: 0, accuracy: '98%' }
  },
  {
    id: 5,
    title: 'Travel English',
    created: 'Created May 21, 2026',
    cards: 36,
    mastered: 100,
    theme: 'theme-emerald',
    icon: 'code',
    complete: true,
    stats: { total: 36, mastered: 36, learning: 0, new: 0, accuracy: '95%' }
  },
  {
    id: 6,
    title: 'IELTS Speaking',
    created: 'Created Jun 9, 2026',
    cards: 200,
    mastered: 45,
    theme: 'theme-orange',
    icon: 'sound',
    complete: false,
    stats: { total: 200, mastered: 90, learning: 60, new: 50, accuracy: '78%' }
  },
  {
    id: 7,
    title: 'French Basics',
    created: 'Created Jul 3, 2026',
    cards: 80,
    mastered: 60,
    theme: 'theme-blue',
    icon: 'book',
    complete: false,
    stats: { total: 80, mastered: 48, learning: 20, new: 12, accuracy: '80%' }
  },
  {
    id: 8,
    title: 'Machine Learning',
    created: 'Created Aug 15, 2026',
    cards: 95,
    mastered: 85,
    theme: 'theme-green',
    icon: 'chart',
    complete: false,
    stats: { total: 95, mastered: 80, learning: 10, new: 5, accuracy: '92%' }
  }
];

const initialFlashcards: Flashcard[] = [
  { id: 1, deckId: 1, question: 'accommodate', answer: 'thích nghi, cung cấp đủ chỗ', status: 'Learning' },
  { id: 2, deckId: 1, question: 'mitigate', answer: 'giảm nhẹ, làm giảm tác hại', status: 'New' },
  { id: 3, deckId: 1, question: 'resilient', answer: 'kiên cường, có khả năng phục hồi', status: 'Mastered' },
  { id: 4, deckId: 1, question: 'prerequisite', answer: 'điều kiện tiên quyết', status: 'Learning' },
  { id: 5, deckId: 1, question: 'coherent', answer: 'mạch lạc, chặt chẽ', status: 'Mastered' },
  { id: 6, deckId: 1, question: 'proficient', answer: 'thành thạo, có năng lực', status: 'New' },
  { id: 7, deckId: 1, question: 'substantial', answer: 'đáng kể, quan trọng', status: 'Learning' },
  { id: 8, deckId: 1, question: 'consecutive', answer: 'liên tiếp', status: 'Mastered' },
  { id: 9, deckId: 1, question: 'ambiguous', answer: 'mơ hồ, không rõ nghĩa', status: 'New' },
  { id: 10, deckId: 1, question: 'comprehensive', answer: 'toàn diện, bao quát', status: 'Learning' }
];

export const useDeckStore = create<DeckState>((set) => ({
  decks: initialDecks,
  flashcards: initialFlashcards,
  filter: 'all',
  searchQuery: '',
  flashcardSearchQuery: '',
  currentPage: 1,
  pageSize: 6,
  isLoadingBackend: false,

  initializeBackend: async () => {
    set({ isLoadingBackend: true });
    const remoteDecks = await DeckService.fetchDecks();
    if (remoteDecks && remoteDecks.length > 0) {
      set({ decks: remoteDecks, isLoadingBackend: false });
    } else {
      set({ isLoadingBackend: false });
    }
  },

  setFilter: (filter) => set({ filter, currentPage: 1 }),
  setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),
  setFlashcardSearchQuery: (flashcardSearchQuery) => set({ flashcardSearchQuery }),
  setCurrentPage: (currentPage) => set({ currentPage }),

  addDeck: async (title, theme) => {
    let icon: Deck['icon'] = 'book';
    if (theme === 'theme-green') icon = 'chart';
    if (theme === 'theme-yellow') icon = 'graduation';
    if (theme === 'theme-purple') icon = 'language';
    if (theme === 'theme-emerald') icon = 'code';
    if (theme === 'theme-orange') icon = 'sound';

    const createdId = await DeckService.createDeck(title);

    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newDeck: Deck = {
      id: createdId || Date.now(),
      title,
      created: `Created ${dateStr}`,
      cards: 0,
      mastered: 0,
      theme,
      icon,
      complete: false,
      stats: { total: 0, mastered: 0, learning: 0, new: 0, accuracy: '0%' }
    };

    set((state) => ({
      decks: [newDeck, ...state.decks],
      currentPage: 1
    }));
  },

  deleteDeck: async (deckId) => {
    await DeckService.deleteDeck(deckId);
    set((state) => ({
      decks: state.decks.filter((d) => d.id !== deckId),
      flashcards: state.flashcards.filter((f) => f.deckId !== deckId)
    }));
  },

  addFlashcard: async (deckId, question, answer, status) => {
    const createdCardId = await DeckService.createFlashcard(deckId, question, answer);

    const newCard: Flashcard = {
      id: createdCardId || Date.now(),
      deckId,
      question,
      answer,
      status
    };

    set((state) => {
      const updatedCards = [newCard, ...state.flashcards];
      const updatedDecks = state.decks.map((deck) => {
        if (deck.id === deckId) {
          const deckCards = updatedCards.filter((c) => c.deckId === deckId);
          const total = deckCards.length;
          const masteredCount = deckCards.filter((c) => c.status === 'Mastered').length;
          const learningCount = deckCards.filter((c) => c.status === 'Learning').length;
          const newCount = deckCards.filter((c) => c.status === 'New').length;
          const masteredPercent = total > 0 ? Math.round((masteredCount / total) * 100) : 0;

          return {
            ...deck,
            cards: total,
            mastered: masteredPercent,
            complete: masteredPercent === 100,
            stats: {
              ...deck.stats,
              total,
              mastered: masteredCount,
              learning: learningCount,
              new: newCount
            }
          };
        }
        return deck;
      });

      return {
        flashcards: updatedCards,
        decks: updatedDecks
      };
    });
  }
}));
