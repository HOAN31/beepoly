# Requirements: Deck Detail Screen Prototype

## Product Goal

Help learners inspect one vocabulary deck in depth — see its statistics, browse its flashcards, and manage the deck.

## Target Users

- Individual English learners
- Students preparing for exams who need to manage vocabulary

## Build Scope

Frontend-only UI prototype (see `deck-detail-screen-specification.md` §13). Do not build backend, database, API, authentication, or real review logic.

## Core Features

1. Breadcrumb `Decks / {title}` and Back navigation to Deck List
2. Deck header: title (`bo_the_tu_vung.tieu_de`) and created date (`bo_the_tu_vung.ngay_tao`) — nothing else
3. Deck statistics: Total, Mastered, Learning, New, Accuracy — derived from mock `the_tu_vung` + `lich_su_on_the`
4. Estimated learning time — calculated as `Total × 20 seconds`
5. Flashcard list: Question (`tu`), Answer preview (`nghia`), Status (derived), View card action
6. Client-side search (by `tu` or `nghia`) and pagination on the flashcard list
7. View card detail: word, meaning, example, audio, status
8. Edit deck title (`tieu_de` only) via dialog
9. Delete deck via confirmation dialog
10. `+ Add card` and `Start Review` as UI placeholders only

## Removed Fields — No SQL Column

Requested by `skill.md` but have no column in `beepoly.sql` and cannot be derived. They are **not shown** on this screen:

| Field | Why removed | What would be required |
|---|---|---|
| Description | `bo_the_tu_vung` has no description column | New column, e.g. `mo_ta TEXT` |
| Category | No category column | New column + lookup table |
| Difficulty | No difficulty column | New column or enum |

In place of the removed metadata, the deck header shows `ngay_tao` as `Created` — the only timestamp column `bo_the_tu_vung` actually has.

## Out of Scope

- Backend, database, API, authentication
- Real spaced-repetition review logic (SM-2 updates, scheduling)
- Review Session implementation beyond the placeholder page
- Full add-card form logic (UI button only)
- PDF import
- Individual flashcard create / edit / delete
- Charts or analytics beyond the five statistics cards
- Persistence — prototype state resets on reload

## Non-functional Requirements

- UI must be simple and intuitive
- Modern SaaS quality bar (Linear / Vercel / Notion); white background, blue primary (`#2563eb`-class), soft shadows, rounded cards, spacious layout
- Responsive at desktop, tablet, and mobile widths; table becomes a card list on mobile
- WCAG AA contrast on all text and badges; status never conveyed by color alone
- Semantic table markup with `<th scope="col">`
- Minimum tap target 44×44px on mobile; body text never below 14px
- Mock rows contain only the columns defined in `beepoly.sql`
- No network calls

## Data Notes

- Prototype uses mock rows shaped exactly like the PostgreSQL schema in `beepoly.sql`
- Deck title is stored in `bo_the_tu_vung.tieu_de` (nullable → render `Untitled deck`)
- Card fields: `tu` (word), `nghia` (meaning), `vi_du` (example), `duong_dan_am_thanh` (audio)
- Card status is NOT a stored column — derived from `lich_su_on_the`:
  - `New`: no row in `lich_su_on_the`
  - `Learning`: row exists AND `khoang_cach_ngay <= 21`
  - `Mastered`: row exists AND `khoang_cach_ngay > 21`
- Invariant: Mastered + Learning + New = Total
- Accuracy = (cards with `so_lan_sai = 0` / cards with review history) × 100%; `0%` if no review history
- Est. learning time = `Total × 20 seconds` (calculated, not a stored column)
