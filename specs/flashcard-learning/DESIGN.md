# DESIGN.md - Beepoly MVP

## Product

Beepoly is an English learning platform that combines structured courses, vocabulary flashcards with spaced repetition, AI-powered practice, and mock exams (TOEIC/IELTS) into one unified experience.

## Goal

Help English learners at all levels (A1–C2) improve vocabulary, grammar, and exam skills through interactive, AI-enhanced practice.

## MVP Scope

The MVP focuses on the **Flashcard & Vocabulary Learning** feature — the most self-contained and immediately valuable module. Users can create vocabulary decks, study them with spaced repetition, and track their learning progress.

## Visual Style

- Clean, modern education dashboard
- Primary color: vibrant blue (#2563EB), accent: warm orange (#F59E0B)
- Light background with card-based layout
- Rounded corners and soft shadows
- Mobile-first responsive design
- Clear typography with good readability
- Progress indicators and visual feedback for learning streaks

## Screens

### 1. Home Dashboard

Shows:
- Welcome message with user name
- Daily learning streak
- Flashcard decks overview (cards to review today, total decks)
- Quick-start button for review session
- Skill radar chart (Listening, Speaking, Reading, Writing)

### 2. Flashcard Deck List

Shows:
- List of all vocabulary decks
- Deck name, card count, mastery percentage
- "Create new deck" button
- "Import from PDF" button (premium)
- Filter: All / Due for review / Mastered

### 3. Deck Detail

Shows:
- Deck title and description
- List of vocabulary cards in the deck
- Add new card form (word, meaning, example)
- Start review session button
- Edit / Delete deck options
- Deck statistics (total, mastered, learning, new, accuracy %)

### 4. Review Session

Shows:
- Flashcard with word on front
- Tap to reveal meaning and example sentence
- Self-rating buttons: "Again" / "Hard" / "Good" / "Easy"
- Progress bar showing cards remaining
- Session summary when complete (cards reviewed, accuracy, time)

### 5. Vocabulary Card Detail

Shows:
- Word (English)
- Meaning (Vietnamese)
- Example sentence
- Number of times reviewed / accuracy rate

## Main Components

- AppHeader
- DashboardCards
- DeckList
- DeckCard
- DeckDetail
- DeckStatistics
- FlashcardViewer
- ReviewControls
- ReviewSummary
- AddCardForm
- CreateDeckForm
- EditDeckForm
- SkillRadarChart
- ProgressIndicator

## Main User Interactions

- User creates a new vocabulary deck
- User adds vocabulary cards to a deck
- User starts a review session and rates card difficulty
- Dashboard updates with streak and progress
- Spaced repetition scheduler determines next review date
