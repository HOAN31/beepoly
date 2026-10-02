# Requirements: Deck List Screen

## Product Goal

Help learners see all their vocabulary decks at a glance and filter them by status.

## Target Users

- Individual English learners
- Students preparing for exams who need to organize vocabulary

## Build Scope

Frontend-only UI prototype. The prototype uses mock rows shaped exactly like `beepoly.sql`. No backend, database, API, authentication, or real review logic. Data does not come from PostgreSQL/Supabase in the prototype.

## Core Features

1. View all vocabulary decks as cards
2. Search decks by title (case-insensitive substring match on `tieu_de` only)
3. Filter decks by status (All / Due for review / Mastered), default All
4. See deck title (`tieu_de`), created date (`ngay_tao`), card count (derived), mastery bar + percentage (derived) for each deck
5. Paginate through decks (6 per page, "Showing X–Y of Z decks")
6. UI button to create a new deck (placeholder CreateDeckDialog with title input only, no persistence)
7. Empty states (3 variants: no decks, no matching filter, no search results)
8. Loading skeleton (header, toolbar, 6 cards — not a spinner)

## Deck Card Fields

Each deck card shows ONLY:

- Cover icon (presentation-only, deterministic from deck id)
- Deck name (`tieu_de`)
- Created date (`ngay_tao`)
- Card count (derived)
- Mastery bar + percentage text (derived)
- Open Deck button

Description, category, difficulty badge, and last-studied time are REMOVED — no SQL column exists for them.

## Status Filter

- All / Due for review / Mastered
- Default: All
- Category filter dropdown is REMOVED (depends on removed category field)

## Filter Logic (client-side from mock data)

- **due**: deck has ≥1 card with no `lich_su_on_the` row, OR Learning card with `lan_on_tiep_theo <= now()`
- **mastered**: cardCount > 0 and every card has `khoang_cach_ngay > 21` (100% mastery, not majority)
- **mastery** = (mastered/total)×100, 0 when cardCount === 0

## Page Header

- Title: `My Vocabulary`
- Subtitle: `Your decks, organized and ready to review`
- Primary action: `+ Create new deck` (opens placeholder CreateDeckDialog — title input only, no persistence)

## Out of Scope

- Backend/API/auth
- Create-deck form logic
- Real SM-2/scheduling
- Review Session beyond placeholder
- PDF import
- Deck edit/delete from this screen
- Persistence (state resets on reload)

## Non-functional Requirements

- UI must be simple and intuitive
- Code must be readable for beginner students
- UI should work on desktop and mobile width
- Mock rows must contain only the columns defined in `beepoly.sql`
- No network calls

## Database Notes

- Deck title is stored in `bo_the_tu_vung.tieu_de`
- Created date is stored in `bo_the_tu_vung.ngay_tao`
- `bo_the_tu_vung` does NOT have description, category, difficulty, or last-studied fields
- Card count is derived from `the_tu_vung` where `bo_the_id` = deck.id
- Mastery is derived from `lich_su_on_the.khoang_cach_ngay`
- "Due for review" = deck has at least one card where the card has no `lich_su_on_the` row, OR `lich_su_on_the.lan_on_tiep_theo <= now()`
- "Mastered" = cardCount > 0 and every card has `khoang_cach_ngay > 21`

## Schema Gaps (Not Buildable Until beepoly.sql Changes)

- Description
- Category
- Difficulty badge
- Last-studied time
- Category filter
- Any create-deck form field beyond `tieu_de`

## Full-MVP-Only (Documented, Not Built Now)

- Supabase reads against `bo_the_tu_vung`, `the_tu_vung`, `lich_su_on_the`
- Real persistence across reloads
- RLS / per-user data isolation
- Create-deck writing to `bo_the_tu_vung`
