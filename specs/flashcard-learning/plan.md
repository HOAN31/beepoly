# Implementation Plan

## Tech Stack

- React 18+ (with TypeScript)
- Vite
- Tailwind CSS
- Supabase (Auth + PostgreSQL + Storage)
- Zustand (state management)
- React Router (navigation)
- date-fns (date handling)
- Supabase Realtime (optional for sync)

## Architecture

```
src/
  components/        # Reusable UI components
  pages/             # Route-level page components
  stores/            # Zustand stores
  services/          # Supabase API calls
  types/             # TypeScript type definitions
  utils/             # Helper functions (SM-2 algorithm, date math)
  hooks/             # Custom React hooks
```

## Components

1. AppShell (layout with navigation)
2. DashboardPage
3. DashboardCards
4. SkillRadarChart
5. DeckListPage
6. DeckCard (card in deck list)
7. DeckDetailPage
8. FlashcardViewer
9. ReviewControls (Again/Hard/Good/Easy)
10. ReviewSessionPage
11. ReviewSummary
12. AddCardForm
13. CreateDeckForm
14. PdfImportModal

## State Design

### Store: deckStore

```typescript
{
  decks: Deck[]
  currentDeck: Deck | null
  cards: Card[]
  loading: boolean
  fetchDecks: () => void
  createDeck: (data: { title: string; description?: string }) => void
  editDeck: (id: number, data: { title: string; description?: string }) => void
  deleteDeck: (id: number) => void
  fetchCards: (deckId: number) => void
  addCard: (deckId: number, data: { word: string; meaning: string; example?: string }) => void
  deleteCard: (id: number) => void
}
```

### Store: reviewStore

```typescript
{
  currentSession: ReviewSession | null
  queue: Card[]
  currentIndex: number
  isFlipped: boolean
  results: { cardId: number; rating: string }[]
  startSession: (deckId?: number) => void
  flipCard: () => void
  rateCard: (rating: 'again' | 'hard' | 'good' | 'easy') => void
  endSession: () => void
}
```

### Store: statsStore

```typescript
{
  userStats: UserStats
  dailyScores: DailySkillScore[]
  streak: number
  cardsDueToday: number
  fetchStats: () => void
}
```

## Data Flow

### Review Session Flow

1. User taps "Start Review".
2. reviewStore queries cards where nextReviewAt <= now OR no ReviewLog entry exists.
3. Cards are sorted: new cards first, then by earliest nextReviewAt.
4. FlashcardViewer displays card (word side).
5. User taps to flip -> reveals meaning + example.
6. User taps rating button.
7. SM-2 algorithm calculates new easeFactor, interval, nextReviewAt.
8. reviewStore upserts ReviewLog in Supabase (insert if new, update if existing).
9. Next card shows.
10. When queue is empty, ReviewSummary displays session stats.

### Streak Calculation Flow

1. On app load, statsStore fetches last 30 days of ReviewSession records.
2. Counts consecutive days with at least one session.
3. If today has a session, streak includes today.
4. If yesterday was last session, streak is maintained.
5. If gap > 1 day, streak resets to 0.

## SM-2 Algorithm Implementation

```typescript
function calculateSM2(
  rating: 'again' | 'hard' | 'good' | 'easy',
  currentEaseFactor: number,
  currentInterval: number
) {
  let newEF = currentEaseFactor
  let newInterval = currentInterval

  switch (rating) {
    case 'again':
      newEF = Math.max(1.3, newEF - 0.2)
      newInterval = 1
      break
    case 'hard':
      newEF = Math.max(1.3, newEF - 0.15)
      newInterval = Math.max(1, Math.round(currentInterval * 0.8))
      break
    case 'good':
      if (currentInterval <= 1) newInterval = 3
      else if (currentInterval <= 6) newInterval = 7
      else newInterval = Math.round(currentInterval * newEF)
      break
    case 'easy':
      newEF = newEF + 0.15
      newInterval = Math.round(currentInterval * newEF * 1.3)
      break
  }

  return { easeFactor: newEF, interval: newInterval }
}
```

## Implementation Order

1. Set up project scaffolding (Vite + React + Tailwind + Supabase)
2. Create database schema in Supabase
3. Build Supabase service layer
4. Build AppShell and navigation
5. Build DashboardPage with stats
6. Build DeckListPage
7. Build CreateDeckForm
8. Build DeckDetailPage
9. Build AddCardForm
10. Implement SM-2 algorithm utility
11. Build ReviewSessionPage with FlashcardViewer
12. Build ReviewControls and ReviewSummary
13. Add streak tracking
14. Build PDF import (premium)
15. Polish UI and responsive design
16. Test acceptance checklist

## Testing Approach

- Manual testing against specs/flashcard-learning/acceptance-criteria.md
- SM-2 algorithm unit tests (critical business logic)
- Supabase integration tests for CRUD operations
- Mobile responsive testing on actual devices
