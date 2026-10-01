# Requirements: Deck Detail Screen MVP

## Product Goal

Help learners inspect one vocabulary deck in depth — see its statistics, vocabulary cards, and manage the deck.

## Target Users

- Individual English learners
- Students preparing for exams who need to manage vocabulary

## Core Features

1. View deck title and description
2. View deck statistics (Total, Mastered, Learning, New, Accuracy)
3. View vocabulary list inside the deck (word, meaning, status)
4. Edit and Delete deck
5. UI button to add a card (placeholder for now)
6. UI button to start review (placeholder for now)

## Out of Scope

- Full add-card form logic (UI button only for MVP)
- Review session (Start Review button navigates to placeholder)
- PDF import
- Backend API / database (uses localStorage only)
- User login / authentication

## Non-functional Requirements

- App must run locally in browser
- UI must be simple and intuitive
- Data should not disappear after page reload (localStorage)
- Code must be readable for beginner students
- UI should work on desktop and mobile width
