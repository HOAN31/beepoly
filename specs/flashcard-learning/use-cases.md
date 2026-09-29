# Use Cases

## UC01: View Dashboard

### Actor

Learner

### Goal

Learner wants to see their daily learning progress and what needs to be reviewed.

### Main Flow

1. Learner opens the app.
2. System loads dashboard.
3. System displays daily streak count.
4. System displays number of cards due for review today.
5. System displays total decks and mastery percentage.
6. System displays skill radar chart.

### Alternative Flow

If learner has no decks yet, dashboard shows "Create your first deck" prompt.

### Related Acceptance Criteria

See "Dashboard" in acceptance-criteria.md.

---

## UC02: Create a Vocabulary Deck

### Actor

Learner

### Goal

Learner wants to organize vocabulary into a themed deck (e.g., "TOEIC Part 5", "Travel Vocabulary").

### Main Flow

1. Learner taps "Create new deck".
2. System shows create deck form.
3. Learner enters deck title and optional description.
4. Learner taps "Save".
5. System creates the deck and navigates to deck detail.

### Error Flow

- If title is empty, system shows error: "Deck title is required".
- If title exceeds 200 characters, system shows error.

### Related Acceptance Criteria

See "Create Deck" in acceptance-criteria.md.

---

## UC03: Add Vocabulary Card to Deck

### Actor

Learner

### Goal

Learner wants to add a new vocabulary word to a specific deck.

### Main Flow

1. Learner opens a deck.
2. Learner taps "Add card".
3. System shows add card form.
4. Learner enters English word, Vietnamese meaning, and optional example sentence.
5. Learner taps "Save".
6. System adds the card to the deck.
7. Deck card count updates.

### Error Flow

- If word field is empty, system shows error.
- If meaning field is empty, system shows error.
- If word already exists in the same deck, system shows warning.

### Related Acceptance Criteria

See "Add Card" in acceptance-criteria.md.

---

## UC04: Start Review Session

### Actor

Learner

### Goal

Learner wants to review due vocabulary cards using spaced repetition.

### Main Flow

1. Learner taps "Start Review" on dashboard or deck.
2. System loads cards due for review (sorted by priority).
3. System shows first flashcard (word side).
4. Learner taps card to flip (reveals meaning + example).
5. Learner rates difficulty: Again / Hard / Good / Easy.
6. System schedules next review based on SM-2 algorithm.
7. System shows next card.
8. Repeat until all due cards are reviewed.
9. System shows session summary (cards reviewed, accuracy, time spent).

### Alternative Flow

If no cards are due, system shows "All caught up!" message.

### Related Acceptance Criteria

See "Review Session" in acceptance-criteria.md.

---

## UC05: View Deck Statistics

### Actor

Learner

### Goal

Learner wants to see how well they know the words in a deck.

### Main Flow

1. Learner opens a deck.
2. System displays deck statistics:
   - Total cards
   - Cards mastered (interval > 21 days)
   - Cards learning (interval < 21 days)
   - Cards new (never reviewed)
   - Accuracy rate

### Related Acceptance Criteria

See "Deck Statistics" in acceptance-criteria.md.

---

## UC06: Import Vocabulary from PDF

### Actor

Learner (Premium)

### Goal

Learner wants to auto-generate flashcards from a PDF vocabulary list.

### Main Flow

1. Learner taps "Import from PDF".
2. System shows file picker.
3. Learner selects a PDF file.
4. System uploads and processes the PDF.
5. AI extracts vocabulary words and meanings.
6. System shows preview of extracted cards.
7. Learner confirms import.
8. System creates a new deck with imported cards.

### Error Flow

- If PDF is unreadable, system shows error.
- If no vocabulary found in PDF, system shows warning.

### Related Acceptance Criteria

See "PDF Import" in acceptance-criteria.md.

---

## UC07: Edit or Delete Deck

### Actor

Learner

### Goal

Learner wants to manage their decks by editing or deleting them.

### Main Flow

1. Learner opens a deck.
2. Learner taps edit or delete.
3. For edit: system shows form with current data, learner modifies and saves.
4. For delete: system shows confirmation dialog.
5. Learner confirms deletion.
6. System removes the deck and all its cards.

### Error Flow

- If deck has active review sessions, system warns before deletion.

### Related Acceptance Criteria

See "Deck Management" in acceptance-criteria.md.
