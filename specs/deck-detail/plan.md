# Implementation Plan

## Tech Stack

- React
- Vite
- CSS
- Supabase (PostgreSQL)
- React Router

## Components

1. App
2. DeckDetail (page)
3. DeckHeader (title, Edit/Delete buttons, Back button)
4. DeckStatistics
5. VocabularyList
6. VocabularyCard
7. StatusBadge

## State Design

The main states are:

currentDeck: Deck | null
cards: Card[] (cards belonging to currentDeck)
reviewLogs: ReviewLog[] (review history for current user's cards in this deck)

Each deck has:
- id
- title (tieu_de)
- userId (nguoi_dung_id)
- createdAt (ngay_tao)

Each card has:
- id
- deckId (bo_the_id)
- word (tu)
- meaning (nghia)
- example (vi_du)
- audioUrl (duong_dan_am_thanh)
- status (derived from lich_su_on_the, not stored)

## Data Flow

1. App queries `bo_the_tu_vung` for the current deck by id.
2. App queries `the_tu_vung` for cards where `bo_the_id` = deck.id.
3. App queries `lich_su_on_the` for `(nguoi_dung_id, flashcard_id)` pairs matching the current user and these cards.
4. Client-side: derive each card's status from `lich_su_on_the` (see entity-model.md).
5. DeckStatistics calculates stats from derived statuses.
6. VocabularyList renders cards with word, meaning, status.
7. User edits/deletes deck → UPDATE/DELETE on `bo_the_tu_vung`.
8. User clicks Back → navigate to Deck List.

## Implementation Order

1. Create base layout for Deck Detail screen
2. Set up Supabase client and seed sample data (decks + cards + review logs)
3. Build DeckHeader with title, Edit/Delete/Back buttons
4. Build DeckStatistics
5. Build VocabularyCard + StatusBadge
6. Build VocabularyList with status derivation logic
7. Add empty state for no cards
8. Add UI action buttons (Add Card, Start Review)
9. Add Edit/Delete deck actions (write to `bo_the_tu_vung`)
10. Polish UI
11. Test acceptance checklist

## Testing Approach

- Manual testing against specs/deck-detail/acceptance-criteria.md.
- No automated tests required for this classroom MVP.
