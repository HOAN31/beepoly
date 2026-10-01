# Implementation Plan

## Tech Stack

- React
- Vite
- CSS
- localStorage

## Components

1. App
2. AppHeader (title "My Vocabulary" + Create new deck button)
3. FilterBar
4. DeckList
5. DeckCard

## State Design

decks: Deck[]

Each deck has:
- id
- title
- description
- createdAt

Derived in component:
- cardCount (from cards array)
- masteryPercent (from cards array)

## Data Flow

1. App loads decks from localStorage on mount.
2. User clicks filter → filteredDeck list recalculates.
3. User clicks "Open Deck" → navigate to Deck Detail screen (xem specs/deck-detail/).
4. App saves deck changes to localStorage.

## Implementation Order

1. Create base layout for Deck List screen
2. Add sample deck + card data
3. Build AppHeader with title and Create button
4. Build FilterBar
5. Build DeckCard component
6. Build DeckList with filtering logic
7. Add navigation to Deck Detail
8. Add localStorage persistence
9. Polish UI
10. Test acceptance checklist

## Testing Approach

- Manual testing against specs/deck-list/acceptance-criteria.md.
- No automated tests required for this classroom MVP.
