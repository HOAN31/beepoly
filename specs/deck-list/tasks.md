# Tasks

## Task 1: Create Deck List layout

- Add app header section
- Add filter bar section
- Add deck list section

Acceptance check:
- App shows clear layout for Deck List screen.

## Task 2: Set up Supabase and seed sample data

- Connect Supabase client to the beepoly Postgres database
- Seed sample rows into `bo_the_tu_vung`, `the_tu_vung`, `lich_su_on_the`
- Use `lich_su_on_the.khoang_cach_ngay` values that produce new / learning / mastered statuses

Acceptance check:
- At least 2 sample decks exist in the database with cards and review logs.

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

- Show deck title (`tieu_de`)
- Show card count (derived from `the_tu_vung`)
- Show mastery % (derived from `lich_su_on_the`)
- Show "Open Deck" button

Acceptance check:
- Each deck card shows all required info.

## Task 6: Build DeckList with data fetching + filtering

- Query `bo_the_tu_vung` for current user's decks
- Compute cardCount, mastery %, and due/mastered status per deck
- Apply filter based on selected filter option
- Handle empty state when no decks match filter

Acceptance check:
- Clicking a filter updates the visible deck list.

## Task 7: Add navigation to Deck Detail

- Wire "Open Deck" button to navigate to Deck Detail screen

Acceptance check:
- Clicking Open Deck navigates to Deck Detail.

## Task 8: Final acceptance test

- Check all acceptance criteria
- Fix small UI issues

Acceptance check:
- All checklist items pass.
