# Acceptance Criteria

## 1. Prototype build (§16.1 of deck-list-screen-specification.md)

### Page header

- [ ] Page title reads `My Vocabulary`.
- [ ] Subtitle renders beneath the title.
- [ ] `+ Create new deck` button is visible, clickable, and opens a placeholder form only.

### Search

- [ ] Search input filters visible decks by `tieu_de`.
- [ ] Clearing search restores the full list.

### Status filter

- [ ] Status filter tabs render `All` / `Due for review` / `Mastered`.
- [ ] Default status filter on mount is `All`.
- [ ] Selecting a filter updates the visible deck list.
- [ ] `Mastered` shows only decks at 100% mastery — a 75% deck must not appear.
- [ ] `Due for review` shows decks with at least one new or due-learning card.
- [ ] Filter and search changes reset pagination to page 1.

### Deck card

- [ ] Deck card shows cover icon, deck name (`tieu_de`), created date (`ngay_tao`), card count, mastery bar with percentage, and `Open Deck` button — **and nothing else**.
- [ ] Deck card does **not** render description, category, difficulty badge, or last-studied time.
- [ ] Mastery bar width matches the deck's mastery percentage.
- [ ] `cardCount === 0` renders `0%` rather than hiding the mastery element.
- [ ] Mastery percentage is present as text, not colour alone.
- [ ] Clicking `Open Deck` **or** the card body navigates to Deck Detail.

### Grid & pagination

- [ ] Grid is 3 columns on desktop, 2 on tablet, 1 on mobile.
- [ ] Pagination shows `Showing X–Y of Z decks`; controls disable at the boundaries.
- [ ] Single-page result sets hide pagination controls.

### Empty & loading states

- [ ] Zero decks shows `EmptyState` with `+ Create new deck`.
- [ ] Empty filter/search results show `EmptyState` with a reset action.
- [ ] Loading state renders header, toolbar, and 6 card skeletons — not a bare spinner.

### Constraints

- [ ] No backend, database, API, or auth code is introduced.
- [ ] Mock rows contain only the columns defined in `beepoly.sql`.
- [ ] No network calls.

---

## 2. Full MVP (§16.2, from the historical specs/deck-list/acceptance-criteria.md)

- [ ] Data is read from PostgreSQL (`bo_the_tu_vung`, `the_tu_vung`, `lich_su_on_the`).
- [ ] Each deck card shows title (`tieu_de`), card count, and mastery %.
- [ ] Each deck card has an `Open Deck` button.
- [ ] Filter bar shows `All`, `Due for review`, `Mastered`; default is `All`.
- [ ] Clicking a filter updates the deck list.
- [ ] `+ Create new deck` is visible and clickable (form logic out of scope for MVP).
- [ ] Data remains after page reload — persisted in the database, not localStorage.
- [ ] **Deck card does not show a description** — the field does not exist in `bo_the_tu_vung`.
- [ ] UI is readable on desktop and remains usable on mobile width.

---

## 3. Navigation

- [ ] Clicking "Open Deck" navigates to Deck Detail screen.
