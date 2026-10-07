export interface DeckStats {
  total: number;
  mastered: number;
  learning: number;
  new: number;
  accuracy: string;
}

export interface Deck {
  id: number;
  title: string;
  created: string;
  cards: number;
  mastered: number;
  theme: 'theme-blue' | 'theme-green' | 'theme-yellow' | 'theme-purple' | 'theme-emerald' | 'theme-orange';
  icon: 'book' | 'chart' | 'graduation' | 'language' | 'code' | 'sound';
  complete: boolean;
  stats: DeckStats;
}

export interface Flashcard {
  id: number;
  deckId: number;
  question: string;
  answer: string;
  status: 'New' | 'Learning' | 'Mastered';
}
