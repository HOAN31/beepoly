# Requirements: Deck List Screen MVP

## Product Goal

Help learners see all their vocabulary decks at a glance and filter them by status.

## Target Users

- Individual English learners
- Students preparing for exams who need to organize vocabulary

## Core Features

1. View all vocabulary decks in a list (from `bo_the_tu_vung`)
2. Filter decks by status (All / Due for review / Mastered)
3. See deck title, card count, and mastery % for each deck
4. UI button to create a new deck (placeholder for now)

## Out of Scope

- Full create-deck form logic (UI button only for MVP)
- Review session
- PDF import
- User login / authentication (assumes authenticated user)

## Non-functional Requirements

- App must work against the PostgreSQL schema in beepoly.sql
- UI must be simple and intuitive
- Data must persist in the database (no localStorage)
- Code must be readable for beginner students
- UI should work on desktop and mobile width

## Database Notes

- Deck title is stored in `bo_the_tu_vung.tieu_de`
- `bo_the_tu_vung` does NOT have a description field
- Card count and mastery % are derived from `the_tu_vung` + `lich_su_on_the`
- "Due for review" = deck has at least one card where `lich_su_on_the.lan_on_tiep_theo <= now()` OR card has no `lich_su_on_the` row
