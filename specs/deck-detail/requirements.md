# Requirements: Deck Detail Screen MVP

## Product Goal

Help learners inspect one vocabulary deck in depth — see its statistics, vocabulary cards, and manage the deck.

## Target Users

- Individual English learners
- Students preparing for exams who need to manage vocabulary

## Core Features

1. View deck title (from `bo_the_tu_vung.tieu_de`)
2. View deck statistics (Total, Mastered, Learning, New, Accuracy) — derived from `the_tu_vung` + `lich_su_on_the`
3. View vocabulary list inside the deck (word `tu`, meaning `nghia`, derived status)
4. Edit and Delete deck (write to `bo_the_tu_vung`)
5. UI button to add a card (placeholder for now)
6. UI button to start review (placeholder for now)

## Out of Scope

- Full add-card form logic (UI button only for MVP)
- Review session (Start Review button navigates to placeholder)
- PDF import
- User login / authentication (assumes authenticated user)

## Non-functional Requirements

- App must work against the PostgreSQL schema in beepoly.sql
- UI must be simple and intuitive
- Data must persist in the database (no localStorage)
- Code must be readable for beginner students
- UI should work on desktop and mobile width

## Database Notes

- Deck title is stored in `bo_the_tu_vung.tieu_de` (no description field)
- Card fields: `tu` (word), `nghia` (meaning), `vi_du` (example), `duong_dan_am_thanh` (audio)
- Card status is NOT a stored column — derived from `lich_su_on_the`:
  - `new`: no row in `lich_su_on_the`
  - `learning`: row exists AND `khoang_cach_ngay <= 21`
  - `mastered`: row exists AND `khoang_cach_ngay > 21`
