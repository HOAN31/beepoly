# Implementation Plan

## Tech Stack

- React
- Vite
- CSS
- Supabase (PostgreSQL)
- React Router

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
- title (tieu_de)
- userId (nguoi_dung_id)
- createdAt (ngay_tao)

Derived in component (computed via queries):
- cardCount
- masteryPercent
- hasDueCards
- isFullyMastered

## Data Flow

1. App queries Supabase: `SELECT * FROM bo_the_tu_vung WHERE nguoi_dung_id = <current_user>`.
2. For each deck, query `the_tu_vung` and `lich_su_on_the` to compute cardCount, mastery %, and due status.
3. User clicks filter → filteredDeck list recalculates client-side (or via targeted query).
4. User clicks "Open Deck" → navigate to Deck Detail screen (xem specs/deck-detail/).
5. Changes to deck data (future: create/edit/delete) write back to `bo_the_tu_vung`.

## Implementation Order

1. Create base layout for Deck List screen
2. Set up Supabase client and seed sample data (decks + cards + review logs)
3. Build AppHeader with title and Create button
4. Build FilterBar
5. Build DeckCard component
6. Build DeckList with data fetching + filtering logic
7. Add navigation to Deck Detail
8. Polish UI
9. Test acceptance checklist

## Testing Approach

- Manual testing against specs/deck-list/acceptance-criteria.md.
- No automated tests required for this classroom MVP.
