# Acceptance Criteria

## Deck Detail

- [ ] Deck detail shows deck title (`tieu_de`).
- [ ] Deck detail shows Edit and Delete buttons.
- [ ] Statistics show Total, Mastered, Learning, New, Accuracy.
- [ ] Statistics values match the deck's card data.
- [ ] mastered + learning + new = total.
- [ ] Vocabulary list shows word (`tu`), meaning (`nghia`), and derived status for each card.
- [ ] Status is derived from `lich_su_on_the` (new = no row, learning = khoang_cach_ngay <= 21, mastered = khoang_cach_ngay > 21).
- [ ] Status badge shows New / Learning / Mastered correctly.
- [ ] "Add card" button is visible.
- [ ] "Start Review" button is visible.

## Navigation

- [ ] Back button returns to Deck List.

## Add Card

- [ ] "+ Add card" button is visible and clickable (form logic is out of scope for MVP).

## Start Review

- [ ] "Start Review" button is visible and clickable (Review Session is out of scope for MVP).

## Deck Management

- [ ] User can edit deck title (`bo_the_tu_vung.tieu_de`).
- [ ] User can delete a deck with a confirmation dialog.
- [ ] Deleting a deck removes it from `bo_the_tu_vung` and its cards from `the_tu_vung`.

## Persistence

- [ ] Deck, card, and review log data is read from PostgreSQL (`bo_the_tu_vung`, `the_tu_vung`, `lich_su_on_the`).
- [ ] Data remains after page reload (persisted in database, not localStorage).

## UI

- [ ] UI follows the basic layout from DESIGN.md.
- [ ] UI is readable on desktop.
- [ ] UI remains usable on mobile width.
