# Tasks

## Task 1: Create Deck Detail layout

- Add Deck Header section
- Add Statistics section
- Add Vocabulary List section
- Add action buttons section

Acceptance check:
- App shows clear layout for Deck Detail screen.

## Task 2: Build DeckHeader

- Show deck title and description
- Show Edit and Delete buttons
- Show Back button

Acceptance check:
- Header shows deck info and all buttons.

## Task 3: Build DeckStatistics

- Show Total, Mastered, Learning, New, Accuracy
- Calculate values from card data

Acceptance check:
- Statistics match the deck's card data.
- mastered + learning + new = total.

## Task 4: Build VocabularyCard + StatusBadge

- Show word and meaning
- Show status badge (New / Learning / Mastered)

Acceptance check:
- Each card shows correct word, meaning, and status.

## Task 5: Build VocabularyList

- Render list of VocabularyCard
- Handle empty state when no cards exist

Acceptance check:
- All cards in the deck appear in the list.

## Task 6: Add UI action buttons

- Add "+ Add card" button
- Add "Start Review" button
- Keep buttons as UI placeholders (no logic required yet)

Acceptance check:
- Buttons are visible and clickable.

## Task 7: Add Edit/Delete deck actions

- Wire Edit button to open edit form (or placeholder)
- Wire Delete button to show confirmation and delete deck
- Navigate back to Deck List after delete

Acceptance check:
- Edit button is clickable.
- Delete shows confirmation and removes deck on confirm.

## Task 8: Add localStorage persistence

- Load deck and cards from localStorage
- Save changes after edit/delete

Acceptance check:
- Data remains after page reload.

## Task 9: Final acceptance test

- Check all acceptance criteria
- Fix small UI issues

Acceptance check:
- All checklist items pass.
