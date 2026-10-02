Build a Flashcard Learning System UI prototype based on the provided Screen Specification.

Important:
This is a frontend-only prototype.
Do not build backend, database, API, authentication, or real review logic.

Tech requirements:
- React + TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide icons
- Responsive design (desktop, tablet, mobile)

Product flow:

Deck List
    ↓
Deck Detail
    ↓
Start Review

Scope:

Fully implement:
1. Deck List page
2. Deck Detail page

Only create a placeholder navigation target for:
3. Review Session

Do not implement flashcard review logic.

---

## Screen Requirements

### Deck List

Create a modern educational dashboard page.

Include:

- Header
- Search input
- Category filter dropdown
- Deck card grid
- Pagination

Each Deck Card should display:

- Cover icon
- Deck name
- Description
- Category
- Number of cards
- Difficulty badge
- Learning progress
- Last studied time
- Open Deck button

Interactions:

- Search filters visible decks
- Category filter changes deck list
- Open Deck navigates to Deck Detail

Use realistic mock data.

---

### Deck Detail

Create a detailed deck information page.

Include:

- Breadcrumb navigation
- Deck header section
- Statistics cards
- Flashcard list

Deck header:

- Deck name
- Description
- Category
- Difficulty
- Created date

Statistics:

- Total cards
- Completed
- Mastered
- Need Review
- Estimated learning time

Flashcard list:

Columns:

- Question
- Answer preview
- Status
- Action

Status examples:

- New
- Learning
- Mastered

Actions:

- View card

---

### Review Session Placeholder

Create only a placeholder page.

Display:

- Title: Review Session
- Description: This feature will be implemented later.
- Back button to Deck Detail

Do not create:
- Flashcard flipping
- Timer
- Score
- Progress tracking
- Review algorithm

---

## Design Direction

Style:

- Modern SaaS application
- Clean educational platform
- Similar quality to Linear / Vercel / Notion

Visual:

- White background
- Blue primary color
- Soft shadows
- Rounded cards
- Spacious layout
- Professional typography

Avoid:

- Overly playful design
- Excessive animations
- Complex illustrations

---

## Component Requirements

Create reusable components:

- DeckCard
- SearchBar
- FilterDropdown
- StatisticCard
- FlashcardTable
- StatusBadge
- EmptyState
- LoadingSkeleton

Keep components modular for future development.

---

## Data

Use mock data only.

Example decks:

1.
Name: English Vocabulary
Cards: 120
Difficulty: Beginner
Progress: 75%

2.
Name: Java OOP
Cards: 85
Difficulty: Intermediate
Progress: 30%

3.
Name: Database SQL
Cards: 60
Difficulty: Advanced
Progress: 10%

---

## Final Output

Generate:

- Complete UI prototype
- Responsive pages
- Reusable React components
- Mock data
- Navigation between screens

Do not add features outside this specification.


