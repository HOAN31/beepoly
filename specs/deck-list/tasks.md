# Tasks

## Task 1: Create Deck List layout

- Add app header section
- Add filter bar section
- Add deck list section

Acceptance check:
- App shows clear layout for Deck List screen.

## Task 2: Create sample data

- Define sample decks
- Define sample cards linked to decks
- Use status values: new, learning, mastered

Acceptance check:
- At least 2 sample decks exist with cards.

## Task 3: Build AppHeader

- Show "My Vocabulary" title
- Show "+ Create new deck" button

Acceptance check:
- Title and button are visible.

## Task 4: Build FilterBar

- Add filter options: All, Due for review, Mastered
- Set default filter to All

Acceptance check:
- Filter bar shows 3 options, All is selected by default.

## Task 5: Build DeckCard

- Show deck title
- Show deck description
- Show card count (derived from cards)
- Show mastery % (derived from cards)
- Show "Open Deck" button

Acceptance check:
- Each deck card shows all required info.

## Task 6: Build DeckList with filtering

- Render list of DeckCard
- Apply filter based on selected filter option
- Handle empty state when no decks match filter

Acceptance check:
- Clicking a filter updates the visible deck list.

## Task 7: Add navigation to Deck Detail

- Wire "Open Deck" button to navigate to Deck Detail screen

Acceptance check:
- Clicking Open Deck navigates to Deck Detail.

## Task 8: Add localStorage persistence

- Load decks and cards from localStorage
- Save data after changes

Acceptance check:
- Data remains after page reload.

## Task 9: Final acceptance test

- Check all acceptance criteria
- Fix small UI issues

Acceptance check:
- All checklist items pass.
