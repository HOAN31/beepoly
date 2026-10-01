# DESIGN.md

## Product

Beepoly is an English vocabulary learning app that helps users study English words using flashcard decks.

## Goal

Help English learners organize and remember vocabulary by creating decks, studying cards, and tracking progress.

## Visual Style

- Clean education dashboard
- Blue and white theme
- Rounded cards
- Clear progress indicators
- Simple buttons
- Easy for beginner learners to understand

## Screens

### 1. Deck List

Shows:
- App title "My Vocabulary"
- "Create new deck" button
- Filter tabs: All / Due for review / Mastered
- List of deck cards with title, description, card count, mastery %

### 2. Deck Detail

Shows:
- Deck title and description
- Edit and Delete buttons
- Statistics: Total, Mastered, Learning, New, Accuracy
- "Add card" button
- "Start Review" button
- Vocabulary list with word, meaning, status

### 3. Review Session (Future)

Shows:
- Flashcard with word on front
- Tap to reveal meaning
- Rating buttons
- Session summary

## Main Components

- AppHeader
- FilterBar
- DeckList
- DeckCard
- DeckDetail
- DeckStatistics
- VocabularyList
- VocabularyCard
- StatusBadge

## Main User Interactions

- User views all vocabulary decks
- User filters decks by status
- User opens a deck to see details
- User edits or deletes a deck
- User starts a review session (future)

## Specs

Detailed specs are split into two feature folders:

- `specs/deck-list/` — Screen 01: Flashcard Deck List
- `specs/deck-detail/` — Screen 02: Deck Detail
