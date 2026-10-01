# Implementation Plan

## Tech Stack

- React
- Vite
- CSS
- localStorage

## Components

1. App
2. DeckDetail (page)
3. DeckHeader (title, description, Edit/Delete buttons, Back button)
4. DeckStatistics
5. VocabularyList
6. VocabularyCard
7. StatusBadge

## State Design

The main states are:

currentDeck: Deck | null
cards: Card[] (cards belonging to currentDeck)

Each deck has:
- id
- title
- description
- createdAt

Each card has:
- id
- deckId
- word
- meaning
- example
- status

## Data Flow

1. App loads currentDeck and its cards from localStorage (or navigated state).
2. DeckStatistics calculates stats from cards.
3. VocabularyList renders cards.
4. User edits/deletes deck → state updates.
5. App saves changes to localStorage.
6. User clicks Back → navigate to Deck List.

## Implementation Order

1. Create base layout for Deck Detail screen
2. Build DeckHeader with title, description, Edit/Delete/Back buttons
3. Build DeckStatistics
4. Build VocabularyCard + StatusBadge
5. Build VocabularyList
6. Add empty state for no cards
7. Add UI action buttons (Add Card, Start Review)
8. Add localStorage persistence for deck/card changes
9. Polish UI
10. Test acceptance checklist

## Testing Approach

- Manual testing against specs/deck-detail/acceptance-criteria.md.
- No automated tests required for this classroom MVP.
