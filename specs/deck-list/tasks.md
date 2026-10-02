# Tasks

## Task 1: Create Deck List layout

- Add a page shell for the Deck List route (`/decks`)
- Structure the shell in this section order:
  1. Header section (title, subtitle, create-deck action)
  2. Toolbar section (search + status filter tabs)
  3. Deck grid section (count label + card grid)
  4. Pagination area (below the grid)
- Wire each section slot so later tasks can drop components in without rearranging layout

Acceptance check:
- App shows a clear layout for the Deck List screen.
- Sections render in the correct order: header → toolbar → count label + grid → pagination.

## Task 2: Add mock data shaped exactly like beepoly.sql

- Create mock rows for `bo_the_tu_vung`, `the_tu_vung`, and `lich_su_on_the` that mirror the schema columns exactly — no invented columns
- Define TypeScript types that mirror the schema: `Deck`, `Flashcard`, `ReviewLog`, and the derived `DeckWithStats` shape
- Seed exactly 8 decks (per spec §14.4):
  - `deck-eng-vocab` — English Vocabulary
  - `deck-java-oop` — Java OOP
  - `deck-db-sql` — Database SQL
  - `deck-biz-email` — Business Emails
  - `deck-travel-en` — Travel English
  - `deck-ielts-speaking` — IELTS Speaking
  - `deck-french-basics` — French Basics
  - `deck-machine-learning` — Machine Learning
- Seed matching flashcards and `lich_su_on_the` review logs such that the derived `cardCount` / `mastery` / `hasDueCards` values match the spec table (e.g. English Vocabulary = 120 cards / 75% / due=true; Business Emails = 48 cards / 100% / due=false)
- All rows: `nguoi_dung_id = "user-1"`, `source_pdf_url = null`, `is_auto_generated = false`
- Implement the shared derivation helpers (`deriveStatus`, `deriveDeckStats`, `applyDeckFilters`) per spec §14.2–§14.3 — these will be reused by filtering/pagination later

Acceptance check:
- Mock rows contain only the columns defined in `beepoly.sql` — no backend, database, API, or auth code is introduced.
- Derived stats (cardCount / mastery / hasDueCards) match the spec's §14.4 table for all 8 decks.
- Mastered tab resolves to exactly 2 decks (Business Emails, Travel English).
- All tab has 8 decks → 2 pages at page size 6.

## Task 3: Build AppHeader

- Show title `My Vocabulary`
- Show subtitle `Your decks, organized and ready to review`
- Show `+ Create new deck` button
- Header is full-width, white background, no card chrome — the deck grid carries the visual weight

Acceptance check:
- Title, subtitle, and button are visible.
- Header renders full-width on a white background with no card-style chrome.

## Task 4: Build SearchBar

- Placeholder: `Search decks…`
- Matching: case-insensitive substring match on `bo_the_tu_vung.tieu_de` **only** — there is no description column to match against
- Client-side filtering, debounced ~200ms
- Trailing clear icon shown when the input is non-empty
- Visually-hidden `<label>` associated with the input for accessibility

Acceptance check:
- Typing filters the visible decks by title.
- Clearing the search restores the full list.
- Search combines with the status filter (AND), not OR.
- Changing search resets pagination to page 1.

## Task 5: Build FilterBar (status tabs)

- Options: `All` / `Due for review` / `Mastered` — three options render inline as a segmented control / tab bar
- Default selection on mount: **`All`**
- Selected tab: primary blue fill; unselected: ghost/outline
- Use `role="tablist"` / `role="tab"` with `aria-selected` for accessibility
- NO category filter dropdown — the category field does not exist in `beepoly.sql` and is out of scope
- Filter state lives in the page (or a small store), not inside `FilterBar`

Acceptance check:
- Filter bar shows 3 options; `All` is selected by default on mount.
- Selecting a filter updates the visible deck list and resets pagination to page 1.
- Mastered shows only decks at 100% mastery — a 75%-mastery deck does not appear under Mastered.

## Task 6: Build DeckCard

- Cover icon: deterministic from deck `id` via `COVER_ICONS` / `coverTone` (presentation-only — no icon/category column in the schema); rounded tinted tile, `rounded-lg` `size-10`
- Deck name: `bo_the_tu_vung.tieu_de`
- Created date: `bo_the_tu_vung.ngay_tao`, rendered e.g. `Created Mar 14, 2026` — the only timestamp column available on this screen
- Card count: `{n} cards` (derived from `the_tu_vung` count)
- Mastery: progress bar + percentage written as text (never colour alone)
- `Open Deck` button: primary blue CTA, right-aligned in the card footer
- Card body **and** `Open Deck` button both navigate to Deck Detail — the whole card is a single focusable link, not two separate navigation targets
- Hover: elevation increase (`shadow-md` → `shadow-lg`), border tints to blue-200, CTA darkens; transition ≤150ms
- Focus: visible ring `ring-2 ring-blue-500 ring-offset-2`; keyboard `Enter` opens the deck
- MUST NOT show: description, category, difficulty badge, or last-studied time — none of these have a column in `beepoly.sql`

Acceptance check:
- Card shows exactly the allowed fields (cover icon, name, created date, card count, mastery bar + %, Open Deck button) and nothing else.
- Mastery bar width matches the deck's mastery percentage.
- A 0-card deck renders `0%` rather than hiding the mastery element.
- Clicking the card body or the Open Deck button both navigate to `/decks/:deckId`.

## Task 7: Build DeckList with grid + pagination + derived stats

- Responsive deck grid:
  - Desktop (≥1024px): 3 columns, `gap-6`
  - Tablet (768–1023px): 2 columns, `gap-5`
  - Mobile (≤767px): 1 column, `gap-4`
- Cards stretch to equal height within a row (`h-full` on card body) so footers align
- Compute `cardCount` / `mastery` / `hasDueCards` / `isFullyMastered` client-side from mock data using the spec's `deriveStatus` / `deriveDeckStats` rules (Task 2)
- Apply the status filter + search filter (AND) to produce the visible deck set
- Pagination: page size **6**; controls `‹` previous, numbered page buttons, `›` next
- Current page button uses primary blue fill; previous is visibly disabled at page 1, next visibly disabled at last page (disabled, not hidden)
- Status line below/above the controls: `Showing X–Y of Z decks`
- Hide pagination controls entirely when the filtered set fits on a single page — show the full filtered set
- Count label above the grid reflects the filtered set: `8 decks` → `3 decks` as filters/search narrow it
- Any change to search or status filter resets pagination to page 1

Acceptance check:
- Filtering and searching recalculate the visible deck list.
- Changing filter or search resets pagination to page 1.
- Count label updates correctly as the filtered set changes (e.g. `8 decks` → `3 decks`).
- Pagination behaves per spec: page size 6, correct status line, disabled at boundaries, hidden when the filtered set fits one page.

## Task 8: Build EmptyState variants + LoadingSkeleton

- Three empty-state variants, each a reusable component (not an inline conditional):
  1. User has 0 decks: `BookOpen` icon, title `No decks yet`, body `Create your first vocabulary deck to start learning.`, action `+ Create new deck`
  2. Status filter yields 0 results: title `No decks match this filter`, body `Try switching back to All.`, action `Show all decks` (resets filter to `all`)
  3. Search yields 0 results: title `No decks found`, body `Try a different search term.`, action `Clear search`
- Each empty state's action must actually reset the control that produced it
- Loading skeleton on first mount — not a bare spinner, keep the page's shape stable:
  - Header skeleton (title bar + button block)
  - Toolbar skeleton (search + tabs)
  - 6 card skeletons — icon tile, 2 text lines, count line, progress bar, footer row
- Use `animate-pulse` on `bg-slate-100` blocks

Acceptance check:
- Each of the three empty states renders the correct copy and its reset action works.
- Loading state shows the shaped header, toolbar, and card skeletons — not a bare spinner.

## Task 9: Build CreateDeckDialog placeholder

- Open from the `+ Create new deck` button (header and the "no decks yet" empty state)
- Shell only — no logic, no persistence:
  - Title input (the only schema-bound field: `bo_the_tu_vung.tieu_de`)
  - Cancel button and Esc key both close the dialog
  - Submit button disabled, or shows a `Coming soon` message — either is acceptable
- Nothing is written to the database or any store

Acceptance check:
- Dialog opens from `+ Create new deck` and closes via Cancel or Esc.
- Nothing is written anywhere — no persistence, no state mutation beyond open/close.

## Task 10: Add navigation to Deck Detail

- Route: `/decks/:deckId`
- Clicking `Open Deck` **or** the card body navigates to Deck Detail with the correct `deckId`
- Review Session remains a placeholder target only — no review logic built on this screen

Acceptance check:
- Clicking Open Deck or the card body navigates to the Deck Detail route for that deck.

## Task 11: Responsive + accessibility polish + final acceptance test

- Mobile adjustments:
  - Header action (`+ Create new deck`) moves below the title, full-width
  - Toolbar stacks: search first, then status tabs (scrollable if needed)
  - Deck grid becomes 1 column
  - Pagination centers with larger tap targets
- Accessibility:
  - Minimum tap target 44×44px on mobile
  - Body text never below 14px
  - WCAG AA contrast on all text and the mastery bar
  - Visible focus rings on cards, buttons, tabs, and inputs
  - Mastery percentage always written as text, not conveyed by colour alone
  - Filter tabs use `role="tablist"` / `role="tab"` with `aria-selected`
  - Search input has an associated `<label>` (visually hidden is acceptable)
- Run the full prototype acceptance checklist in `specs/deck-list/acceptance-criteria.md` §16.1 and fix any UI issues found

Acceptance check:
- All §16.1 prototype checklist items pass.
- No backend, database, API, or auth code is introduced.
- No network calls are made.
