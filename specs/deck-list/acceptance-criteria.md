# Acceptance Criteria

## Deck List

- [ ] App shows "My Vocabulary" title.
- [ ] App shows "+ Create new deck" button.
- [ ] Filter bar shows All, Due for review, Mastered.
- [ ] Default filter is All.
- [ ] Each deck card shows title (`tieu_de`), card count, mastery %.
- [ ] Each deck card has "Open Deck" button.
- [ ] Deck card does NOT show a description (field does not exist in `bo_the_tu_vung`).
- [ ] Clicking filter updates the deck list.

## Navigation

- [ ] Clicking "Open Deck" navigates to Deck Detail screen.

## Create Deck

- [ ] "+ Create new deck" button is visible and clickable (form logic is out of scope for MVP).

## Persistence

- [ ] Deck and card data is read from PostgreSQL (`bo_the_tu_vung`, `the_tu_vung`, `lich_su_on_the`).
- [ ] Data remains after page reload (persisted in database, not localStorage).

## UI

- [ ] UI follows the basic layout from DESIGN.md.
- [ ] UI is readable on desktop.
- [ ] UI remains usable on mobile width.
