# Tasks

## Task 1: Project scaffolding

- Initialize Vite + React + TypeScript project
- Install and configure Tailwind CSS
- Install Supabase client, Zustand, React Router, date-fns
- Set up folder structure (components, pages, stores, services, types, utils, hooks)
- Configure environment variables for Supabase URL and anon key

Acceptance check:
- App runs locally with `npm run dev`.
- Tailwind CSS works (test with a styled div).

## Task 2: Database schema and Supabase setup

- Create Supabase project
- Run SQL migration using tables from beepoly.sql: bo_the_tu_vung, the_tu_vung, lich_su_on_the, phien_hoc, thong_ke_nguoi_dung, diem_ky_nang
- Set up Row Level Security (RLS) policies for user-scoped data

Acceptance check:
- Tables exist in Supabase dashboard.
- RLS policies prevent cross-user data access.

## Task 3: Supabase service layer

- Create `services/deckService.ts` — CRUD for decks (bo_the_tu_vung)
- Create `services/cardService.ts` — CRUD for cards (the_tu_vung)
- Create `services/reviewService.ts` — upsert ReviewLog, create ReviewSession
- Create `services/statsService.ts` — fetch UserStats, DailySkillScore

Acceptance check:
- Each service can create, read, update, and delete records via Supabase client.

## Task 4: Type definitions

- Define TypeScript interfaces matching entity-model.md: Deck, Card, ReviewLog, ReviewSession, UserStats, DailySkillScore
- Define union type: ReviewRating = 'again' | 'hard' | 'good' | 'easy'
- Export all types from `types/index.ts`

Acceptance check:
- All types compile without errors.
- Types match the entity model in entity-model.md (BIGINT IDs, correct field names).

## Task 5: AppShell and navigation

- Create AppShell component with bottom navigation bar
- Navigation items: Home, Decks, Review, Stats
- Set up React Router with routes for each page
- Create placeholder pages for each route

Acceptance check:
- User can navigate between Home, Decks, Review, Stats.
- Bottom nav highlights active route.

## Task 6: Dashboard page

- Fetch user stats from Supabase on mount
- Display daily streak count
- Display cards due today count
- Display total decks and mastery %
- Display skill radar chart (use a simple SVG radar or a chart library)
- Add "Start Review" button

Acceptance check:
- Dashboard shows all stats correctly.
- "Start Review" button navigates to review session.

## Task 7: Deck list page

- Fetch all user decks from Supabase
- Display deck cards with title, card count, mastery %
- Add "Create new deck" button
- Add filter tabs: All / Due for review / Mastered
- Sort decks by most recently active

Acceptance check:
- All user decks appear in the list.
- Filter tabs work correctly.
- "Create new deck" opens the create form.

## Task 8: Create deck form

- Create form with title (required) and description (optional)
- Validate title is not empty and max 200 chars
- Submit creates deck in Supabase
- Navigate to deck detail after creation

Acceptance check:
- New deck appears in deck list.
- Empty title shows error.
- Long title (>200 chars) shows error.

## Task 9: Deck detail page

- Fetch deck info and all cards from Supabase
- Display deck title, description, and stats (total, mastered, learning, new, accuracy %)
- Display list of cards with word, meaning, status
- Add "Add card" button
- Add "Start review" button (only if deck has cards)

Acceptance check:
- Deck detail shows correct info and statistics.
- Card list updates when card is added or deleted.

## Task 10: Deck edit and delete

- Add edit mode: modify deck title and description, save to Supabase
- Add delete button with confirmation dialog
- On confirm: delete deck, all its cards, and all associated ReviewLogs
- Navigate back to deck list after deletion

Acceptance check:
- Editing deck title/description saves correctly.
- Delete confirmation dialog appears.
- Deleting a deck removes it and all associated data.

## Task 11: Add card form

- Create form with word (required), meaning (required), example (optional)
- Validate required fields are not empty
- Check for duplicate word in same deck (query existing cards)
- Submit creates card in Supabase
- Card appears in deck detail immediately

Acceptance check:
- New card appears in the deck.
- Empty word/meaning shows error.
- Duplicate word in same deck shows error (blocked, not just warned).

## Task 12: Delete individual card

- Add delete button on each card in deck detail
- Show confirmation before deleting
- Delete card and its associated ReviewLog from Supabase
- Deck card count decreases

Acceptance check:
- Card is removed from deck detail.
- Associated ReviewLog is also deleted.
- Deck card count updates.

## Task 13: SM-2 algorithm

- Implement `calculateSM2()` in `utils/sm2.ts` per the algorithm in plan.md
- Implement `getNextReviewCards(deckId?)` query: cards where nextReviewAt <= now OR no ReviewLog
- Implement `getCardStatus(cardId)`: 'new' | 'learning' | 'mastered'
- Write unit tests:
  - New card: interval = 1, EF = 2.5
  - Good on interval=1: -> 3
  - Good on interval=3: -> 7
  - Good on interval=7: -> 18 (7 * 2.5)
  - Again: EF decreases by 0.2, interval = 1
  - Hard: EF decreases by 0.15, interval * 0.8
  - Easy: EF increases by 0.15, interval * EF * 1.3
  - EF never drops below 1.3
  - Mastered: interval > 21 days

Acceptance check:
- All SM-2 unit tests pass.
- Edge cases handled (first review, minimum EF, large intervals).

## Task 14: Review session page

- Create ReviewSessionPage with FlashcardViewer
- Fetch due cards and create ReviewSession in Supabase
- Display card with word on front
- Implement flip animation (tap to reveal, < 300ms)
- Show meaning and example on back
- Show progress bar (current / total)
- Auto-end session when queue is empty

Acceptance check:
- Cards display correctly.
- Flip animation works smoothly.
- Progress bar updates.

## Task 15: Review controls and scoring

- Add rating buttons: Again, Hard, Good, Easy
- On rating: call SM-2 algorithm
- Upsert ReviewLog in Supabase with new interval, EF, nextReviewAt
- If "Again": increment wrongCount
- Move to next card
- When queue empty, show ReviewSummary (cards reviewed, accuracy %, time spent)

Acceptance check:
- Rating a card updates its schedule.
- "Again" resets interval and increments wrongCount.
- "Good" increases interval per SM-2.
- Session summary shows correct stats.

## Task 16: Streak tracking

- On app load, check if today has any ReviewSession
- If yes and lastStudyDate was yesterday: increment currentStreak
- If yes and lastStudyDate was today: no change
- If gap > 1 day: reset currentStreak to 0
- Update longestStreak if currentStreak > longestStreak
- Update UserStats in Supabase

Acceptance check:
- Streak increments on consecutive days.
- Streak resets after a gap.
- Dashboard shows correct streak.

## Task 17: PDF import

- Add PDF upload component using file input
- Send PDF to Supabase Edge Function for processing
- Parse extracted vocabulary into card previews
- Show preview table for user to review and edit (word, meaning)
- Confirm import creates deck (isAutoGenerated=true) with cards

Acceptance check:
- PDF upload works for valid PDFs.
- Invalid PDF shows error message.
- PDF with no vocabulary shows warning.
- Extracted cards can be edited before import.

## Task 18: UI polish and responsive design

- Ensure all pages work on mobile (320px+ width)
- Test and fix touch interactions (tap targets >= 44px)
- Add loading states and skeletons for all data fetches
- Add empty states for all lists (no decks, no cards, no review due)
- Test color contrast for accessibility

Acceptance check:
- App is fully usable on mobile.
- No broken layouts on small screens.
- Loading and empty states look good.

## Task 19: Final acceptance test

- Walk through all acceptance criteria in acceptance-criteria.md
- Fix any failing criteria
- Test full flow: create deck -> add cards -> review -> check stats -> delete deck

Acceptance check:
- All checklist items in acceptance-criteria.md pass.
