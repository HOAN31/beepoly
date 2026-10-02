# Acceptance Criteria

## Prototype Build

Frontend-only prototype — see `deck-detail-screen-specification.md` §14.1.

### Navigation

- [ ] Breadcrumb `Decks / {title}` renders and `Decks` navigates to Deck List.
- [ ] `Back` returns to Deck List.
- [ ] `tieu_de IS NULL` renders `Untitled deck` in both the header and breadcrumb.

### Deck Header

- [ ] Deck header shows title (`tieu_de`) and created date (`ngay_tao`) — **and nothing else**.
- [ ] Deck header does **not** render description, category, or difficulty.
- [ ] Header actions render: `Edit`, `Delete`, `+ Add card`, `Start Review`.
- [ ] `Start Review` is the primary (blue) button.

### Statistics

- [ ] Statistics row shows Total, Mastered, Learning, New, Accuracy.
- [ ] `Mastered + Learning + New = Total` for the mock data.
- [ ] Accuracy is `0%` when there is no review history.
- [ ] Estimated learning time is displayed and equals `Total × 20s` formatted.
- [ ] Empty deck shows 0 across the board and `0%` accuracy — statistics row is not hidden.

### Flashcard List

- [ ] Flashcard table shows Question, Answer preview, Status, Action columns.
- [ ] Question renders `the_tu_vung.tu`; Answer preview renders `the_tu_vung.nghia`.
- [ ] `nghia IS NULL` renders `—` in the answer-preview column.
- [ ] Answer preview truncates with ellipsis; full text is reachable via View card.
- [ ] Status badge renders `New` / `Learning` / `Mastered` with text labels (not color alone).
- [ ] Status is derived via the §7 rule, not stored on the mock card object.
- [ ] Search filters the visible flashcards by `tu` or `nghia` and updates the count label.
- [ ] Clearing search restores the full list.
- [ ] Pagination works and resets to page 1 when search changes.
- [ ] Empty deck shows `EmptyState` with a `+ Add card` action.
- [ ] Zero search results shows `EmptyState` with a `Clear search` action.

### View Card

- [ ] `View card` opens the flashcard detail view with word, meaning, example, audio, and status.
- [ ] Example and audio sections are hidden when their columns are null.

### Deck Management

- [ ] `Edit` dialog opens prefilled with `tieu_de`, validates non-empty title, and updates the header.
- [ ] `Delete` shows a confirmation dialog naming the deck and card count.
- [ ] Confirming delete navigates back to Deck List.

### Placeholders

- [ ] `+ Add card` does not implement form logic.
- [ ] Review Session placeholder shows only title, description, and a back button — no flip/timer/score/progress/algorithm.

### Responsive & Constraints

- [ ] Layout is usable at desktop, tablet, and mobile widths; table becomes a card list on mobile.
- [ ] No backend, database, API, or auth code is introduced.
- [ ] Mock rows contain only the columns defined in `beepoly.sql`.
- [ ] No network calls.

---

## Full MVP

From the full product build (PostgreSQL via Supabase) — see §14.2 of `deck-detail-screen-specification.md`.

- [ ] Deck detail reads title from `bo_the_tu_vung.tieu_de`.
- [ ] Statistics match live `the_tu_vung` + `lich_su_on_the` data.
- [ ] Status is derived from `lich_su_on_the` (`khoang_cach_ngay` thresholds).
- [ ] Vocabulary list reads `tu`, `nghia`, and derived status.
- [ ] Edit writes to `bo_the_tu_vung.tieu_de`.
- [ ] Delete removes the deck from `bo_the_tu_vung` and its cards from `the_tu_vung`.
- [ ] Data persists in PostgreSQL — survives reload, not localStorage.
- [ ] UI remains readable on desktop and usable on mobile width.
