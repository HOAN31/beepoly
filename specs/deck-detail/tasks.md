# Tasks

## Task 1: Create Deck Detail layout

- Add Deck Header section
- Add Statistics section
- Add Vocabulary List section
- Add action buttons section

Acceptance check:
- App shows clear layout for Deck Detail screen.

## Task 2: Set up Supabase and seed sample data

- Connect Supabase client to the beepoly Postgres database
- Seed sample rows into `bo_the_tu_vung`, `the_tu_vung`, `lich_su_on_the`
- Use `lich_su_on_the.khoang_cach_ngay` values that produce new / learning / mastered statuses

Acceptance check:
- Sample deck, cards, and review logs exist in the database.

## Task 3: Build DeckHeader

- Show deck title (`tieu_de`)
- Show Edit and Delete buttons
- Show Back button

Acceptance check:
- Header shows deck info and all buttons.

## Task 4: Build DeckStatistics

- Show Total, Mastered, Learning, New, Accuracy
- Calculate values from `the_tu_vung` + `lich_su_on_the`

Acceptance check:
- Statistics match the deck's card data.
- mastered + learning + new = total.

## Task 5: Build VocabularyCard + StatusBadge

- Show word (`tu`) and meaning (`nghia`)
- Show status badge derived from `lich_su_on_the` (New / Learning / Mastered)

Acceptance check:
- Each card shows correct word, meaning, and derived status.

## Task 6: Build VocabularyList

- Render list of VocabularyCard
- Derive status for each card from `lich_su_on_the`
- Handle empty state when no cards exist

Acceptance check:
- All cards in the deck appear in the list with correct status.

## Task 7: Add UI action buttons

- Add "+ Add card" button
- Add "Start Review" button
- Keep buttons as UI placeholders (no logic required yet)

Acceptance check:
- Buttons are visible and clickable.

## Task 8: Add Edit/Delete deck actions

- Wire Edit button to update `bo_the_tu_vung.tieu_de`
- Wire Delete button to show confirmation, then delete from `bo_the_tu_vung` + `the_tu_vung`
- Navigate back to Deck List after delete

Acceptance check:
- Edit saves new title to the database.
- Delete shows confirmation and removes deck + cards from the database.

## Task 9: Final acceptance test

- Check all acceptance criteria
- Fix small UI issues

Acceptance check:
- All checklist items pass.
