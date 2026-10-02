# Screen Specification — Deck Detail

| | |
|---|---|
| **Product** | Beepoly — Flashcard Learning System |
| **Screen** | Screen 02 — Deck Detail |
| **Route** | `/decks/:deckId` |
| **Prior screen** | Deck List (`/decks`) |
| **Next screen** | Review Session (`/decks/:deckId/review`) — placeholder only |
| **Build scope** | Frontend-only UI prototype (see §13) |
| **Schema rule** | Every data point on screen maps to a column in `beepoly.sql` or is a faithful derivation from one (see §0.2) |

---

## 0. Source Map

This document is the buildable screen specification for Deck Detail. It is assembled from two sources:

| Source | What it contributes |
|---|---|
| `skill.md` | Screen structure, tech stack, design direction, component conventions, prototype constraints |
| `specs/deck-detail/` | Screen content: header fields, statistics set, list columns, status derivation, actions, use cases, acceptance criteria |

**Governing rule — schema fidelity.** This spec is bound to `beepoly.sql`. Where `skill.md` asks for a field that has **no column** in the schema and cannot be derived from one, the field is **removed from the screen**, not emulated with mock data.

### 0.1 Column inventory (authoritative)

```
bo_the_tu_vung          the_tu_vung             lich_su_on_the
─────────────────       ─────────────────       ─────────────────
id                      id                      nguoi_dung_id  (PK)
nguoi_dung_id           bo_the_id               flashcard_id   (PK)
tieu_de                 tu                      he_so_do_de
source_pdf_url          nghia                   khoang_cach_ngay
is_auto_generated       vi_du                   lan_on_tiep_theo
ngay_tao                duong_dan_am_thanh      so_lan_sai
```

### 0.2 Slot-by-slot resolution

| Slot | `skill.md` | `specs/deck-detail/` | SQL source | This spec uses |
|---|---|---|---|---|
| Deck name | Deck name | title | `bo_the_tu_vung.tieu_de` | **`tieu_de`** |
| Deck description | Description | *(absent)* | *no column* | **Removed** — see §0.3 |
| Category | Category | *(absent)* | *no column* | **Removed** — see §0.3 |
| Difficulty | Difficulty | *(absent)* | *no column* | **Removed** — see §0.3 |
| Created date | Created date | created date | `bo_the_tu_vung.ngay_tao` | **`ngay_tao`** |
| Statistics | Total, Completed, Mastered, Need Review, Est. learning time | Total, Mastered, Learning, New, Accuracy | `the_tu_vung` + `lich_su_on_the` | **Total / Mastered / Learning / New / Accuracy** as primary (see §5.1); Est. learning time kept as a calculated secondary metric |
| List columns | Question, Answer preview, Status, Action | Word (`tu`), Meaning (`nghia`), Status | `the_tu_vung.tu` / `the_tu_vung.nghia` | **Merged** — Question = `tu`, Answer preview = `nghia` (see §6.1) |
| Per-row action | View card | — | — (UI action) | **`View card`** |
| Page actions | — | Edit, Delete, + Add card, Start Review, Back | — (UI actions) | All five (see §8) |
| Status values | New, Learning, Mastered | new, learning, mastered | `lich_su_on_the.khoang_cach_ngay` | Identical. Canonical: `New` / `Learning` / `Mastered` |
| Card detail extras | — | `vi_du`, `duong_dan_am_thanh` | `the_tu_vung.vi_du`, `the_tu_vung.duong_dan_am_thanh` | **Included** on the View card screen — both columns exist |
| Data | Mock data only | PostgreSQL via Supabase | `beepoly.sql` | **Mock rows shaped exactly like the schema** |

### 0.3 Fields removed — no SQL column

| Field | Requested by | Why removed | What would be required |
|---|---|---|---|
| `description` | `skill.md` | `bo_the_tu_vung` has no description column | New column, e.g. `mo_ta TEXT` |
| `category` | `skill.md` | No category column | New column + lookup table |
| `difficulty` | `skill.md` | No difficulty column | New column or enum |

**In place of the removed metadata**, the deck header shows `ngay_tao` as `Created` — the only timestamp column `bo_the_tu_vung` actually has.

---

## 1. Purpose & Goals

Help learners inspect one vocabulary deck in depth — see its statistics, browse its flashcards, and manage the deck.

**Target users**

- Individual English learners
- Students preparing for exams who need to manage vocabulary

**The user can**

1. See the deck's title and creation date
2. Read deck statistics at a glance
3. Browse every flashcard in the deck with its learning status
4. View a single flashcard in detail
5. Edit or delete the deck
6. Navigate back to the Deck List
7. Trigger the Add Card and Start Review flows (placeholder targets)

**Out of scope for this screen** — see §13.

---

## 2. Navigation

```
Deck List  ──Open Deck──▶  Deck Detail  ──Start Review──▶  Review Session (placeholder)
     ▲                        │
     └──────Back / Delete─────┘
```

| Action | Result |
|---|---|
| Open Deck (from Deck List) | Navigate to `/decks/:deckId` |
| Back button or breadcrumb `Decks` | Navigate to `/decks` |
| Start Review | Navigate to `/decks/:deckId/review` — **placeholder page only** |
| Delete deck (confirmed) | Remove deck, then navigate to `/decks` |

**Breadcrumb**

```
Decks  /  TOEIC Part 5
```

- `Decks` is a link to Deck List.
- The current deck title is plain text, truncated on narrow widths.

---

## 3. Layout

Section order, top to bottom:

```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumb                                          [Back] │
├─────────────────────────────────────────────────────────────┤
│ Deck Header                                                 │
│   Title                                          [Edit][Del]│
│   Created Mar 14, 2026                                      │
│   [+ Add card]  [Start Review]                              │
├─────────────────────────────────────────────────────────────┤
│ Statistics                                                  │
│   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ │
│   │ Total  │ │Mastered│ │Learning│ │  New   │ │ Accuracy │ │
│   └────────┘ └────────┘ └────────┘ └────────┘ └──────────┘ │
│   Est. learning time: ~40 min                               │
├─────────────────────────────────────────────────────────────┤
│ Flashcards in this deck          12 cards          [Search] │
│ ┌───┬──────────────────┬──────────────────┬──────────┬────┐ │
│ │ # │ Question         │ Answer preview   │ Status   │    │ │
│ ├───┼──────────────────┼──────────────────┼──────────┼────┤ │
│ │ 1 │ accommodate      │ thích nghi, …    │ Learning │ 👁 │ │
│ │ 2 │ mitigate         │ giảm nhẹ, …      │ New      │ 👁 │ │
│ └───┴──────────────────┴──────────────────┴──────────┴────┘ │
│                                      1–10 of 12   ‹ 1 2 ›  │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Deck Header

### 4.1 Displayed fields

| Field | Label | SQL source | Notes |
|---|---|---|---|
| Deck name | *(primary title, no label)* | `bo_the_tu_vung.tieu_de` | Large, bold. Truncate after ~2 lines. Render `Untitled deck` when `tieu_de IS NULL` — the column is nullable. |
| Created date | `Created` | `bo_the_tu_vung.ngay_tao` | Localized date, e.g. `Created Mar 14, 2026`. |

**Nothing else.** Description, category, and difficulty are removed (§0.3).

> **Nullable note.** `tieu_de VARCHAR(200)` has no `NOT NULL` constraint. Handle `null` explicitly in both the header and the breadcrumb.

### 4.2 Actions

| Button | Style | Placement | Behaviour |
|---|---|---|---|
| `Back` | Ghost / secondary | Left, in breadcrumb row | Navigate to Deck List |
| `Edit` | Secondary | Right group | Open edit dialog prefilled with current title |
| `Delete` | Destructive (outline red) | Right group | Open confirmation dialog |
| `+ Add card` | Secondary, leading icon | Header action row | Placeholder — no form logic |
| `Start Review` | **Primary (blue)** | Header action row, rightmost | Navigate to Review Session placeholder |

`Start Review` is the primary call to action on this screen. It stays visible on scroll (sticky header action bar on mobile).

---

## 5. Statistics

Rendered as a row of `StatisticCard` components.

### 5.1 Primary statistics (authoritative — `specs/deck-detail/`)

| Statistic | Label | Definition | SQL source | Badge tone |
|---|---|---|---|---|
| Total cards | `Total` | Count of `the_tu_vung` where `bo_the_id` = deck.id | `the_tu_vung` | Neutral |
| Mastered | `Mastered` | Cards with status `mastered` | `lich_su_on_the.khoang_cach_ngay > 21` | Success (green) |
| Learning | `Learning` | Cards with status `learning` | `lich_su_on_the.khoang_cach_ngay <= 21` | Warning (amber) |
| New | `New` | Cards with status `new` | no `lich_su_on_the` row | Info (blue) / neutral |
| Accuracy | `Accuracy` | `(cards with so_lan_sai = 0) / (cards with review history) × 100%`; `0%` when no review history | `lich_su_on_the.so_lan_sai` | Primary (blue) |

**Invariant:** `Mastered + Learning + New = Total`. The prototype mock data must satisfy this.

> **Naming note.** `skill.md` calls these `Completed` and `Need Review`. Those map to `Mastered` and `Learning` respectively. Use the `specs/deck-detail/` labels — they are the product's canonical vocabulary and match `specs/deck-detail/acceptance-criteria.md`.

### 5.2 Secondary metric (from `skill.md`)

| Statistic | Label | Definition | Source |
|---|---|---|---|
| Estimated learning time | `Est. learning time` | `Total × 20 seconds`, formatted as `~40 min` / `~1 h 20 min` | **Calculated** from `the_tu_vung` count — not a stored column |

Displayed as a smaller caption beneath the statistics row. Pure arithmetic on a real column count; no invented data.

### 5.3 Empty deck

When `Total = 0`, show `0` across the board and `0%` accuracy — do not hide the statistics row. The empty state in §6.5 carries the call to action.

---

## 6. Flashcard List

### 6.1 Columns

| # | Column | Content | SQL source | Width | Notes |
|---|---|---|---|---|---|
| 1 | `#` | Row index | — | narrow | 1-based, within current page |
| 2 | **Question** | Word — `the_tu_vung.tu` | `tu` | wide | Primary cell text, weight medium |
| 3 | **Answer preview** | Meaning — `the_tu_vung.nghia` | `nghia` | wide | Truncate to 1 line with ellipsis; full text in tooltip on hover and on the View card screen. Render `—` when `nghia IS NULL`. |
| 4 | **Status** | `StatusBadge` | derived from `lich_su_on_the` | fixed | `New` / `Learning` / `Mastered` |
| 5 | **Action** | `View card` button (eye icon + label on desktop, icon-only on mobile) | — | fixed | See §8.6 |

> **Naming note.** `skill.md` uses `Question` / `Answer preview`; `specs/deck-detail/` uses Word / Meaning (`tu` / `nghia`). These are the same two fields — the table header reads **Question** / **Answer preview**, with `tu` as the question value and `nghia` as the answer-preview value.

**Shown on the View card screen, not in the table** (both columns exist in `the_tu_vung`): `vi_du` (example sentence), `duong_dan_am_thanh` (audio URL).

### 6.2 Toolbar

- **Title:** `Flashcards in this deck`
- **Count:** `N cards` (matches Total)
- **Search** (`SearchBar`): filters the visible rows by `tu` or `nghia`, client-side. Placeholder: `Search flashcards…`
- **Pagination:** 10 rows per page on desktop, 5 on mobile. Show `1–10 of 12` plus prev/next.

### 6.3 Row interaction

- Hover: subtle background tint; action button becomes fully opaque.
- Clicking anywhere on the row (not only the button) opens the View card detail — the whole row is the hit target.
- Keyboard: rows are focusable; `Enter` opens View card.

### 6.4 Search state

- Matching rows only; count label updates to `3 of 12 cards`.
- Clearing search restores the full paginated list and resets to page 1.

### 6.5 Empty states

| Condition | Rendering |
|---|---|
| Deck has 0 cards | `EmptyState`: icon, title `No flashcards yet`, body `Add your first card to start building this deck.`, action `+ Add card` |
| Search returns 0 rows | `EmptyState`: title `No flashcards match`, body `Try a different search term.`, action `Clear search` |

---

## 7. Status Model

Card status is **not a stored column**. It is derived from `lich_su_on_the`:

| Status | Condition | SQL source | Badge |
|---|---|---|---|
| `New` | No row in `lich_su_on_the` for `(nguoi_dung_id, flashcard_id)` | absent row | Neutral / blue outline |
| `Learning` | Row exists **and** `khoang_cach_ngay <= 21` | `khoang_cach_ngay` | Amber |
| `Mastered` | Row exists **and** `khoang_cach_ngay > 21` | `khoang_cach_ngay` | Green |

**Prototype rule.** The prototype uses mock review-log data and applies the same derivation rule client-side, so the logic is identical to the future Supabase implementation and the mock numbers can be swapped for real queries without changing the UI.

**Badge convention.** `StatusBadge` is a reusable pill: soft background, darker text, small dot or icon, title-case label. Never rely on color alone — the label is always present.

---

## 8. Interactions

### 8.1 Breadcrumb / Back

Navigate to Deck List. Equivalent to UC02 in `specs/deck-detail/use-cases.md`.

### 8.2 Edit

The **only** editable column on `bo_the_tu_vung` that this screen touches is `tieu_de`.

| Step | Behaviour |
|---|---|
| Click `Edit` | Open dialog with a single text input prefilled with `tieu_de` |
| Submit valid title | Update `bo_the_tu_vung.tieu_de`; close dialog; toast `Deck updated` |
| Submit empty title | Inline validation error `Deck title is required`; do not close. (Allows clearing back to `null`, but requires explicit confirmation — see below.) |
| Cancel / Esc / backdrop | Close without saving |

**Nullable handling.** Because `tieu_de` is nullable, the dialog accepts clearing the field. On submit with an empty value, store `NULL` and render `Untitled deck` in the header and breadcrumb. No other fields exist to edit — `ngay_tao`, `is_auto_generated`, and `source_pdf_url` are not user-editable.

> **Prototype note.** For the frontend-only prototype the save is local state only. The dialog shape and validation must match the full MVP, which writes to `bo_the_tu_vung.tieu_de`.

### 8.3 Delete

| Step | Behaviour |
|---|---|
| Click `Delete` | Open confirmation dialog |
| Dialog copy | Title `Delete this deck?` · Body `This will permanently remove "{title}" and all {N} flashcards in it. This action cannot be undone.` · Actions `Cancel` / `Delete` (destructive) |
| Confirm | Remove deck + its cards; navigate to Deck List |
| Cancel / Esc | Close, no change |

Use the resolved display name (`tieu_de ?? "Untitled deck"`) in the dialog copy.

> **Full MVP note.** Delete removes rows from `bo_the_tu_vung` and the related rows in `the_tu_vung` (see UC06).

### 8.4 `+ Add card`

Placeholder. Clicking may open a disabled/empty form shell or show a `Coming soon` toast — **no form logic, no persistence**. Per `skill.md`: this is a UI button only.

The eventual form's only required column is `the_tu_vung.tu`; `nghia`, `vi_du`, and `duong_dan_am_thanh` are all nullable.

**Constraints to honour once this form is actually built** (enforced in `beepoly.sql`, not yet relevant while this is a placeholder):

| Constraint | Rule the form must respect |
|---|---|
| `check_the_tu_vung_tu_khong_trang` | `tu` must be non-empty after trimming — whitespace-only input is rejected, not just `null`. |
| `uq_the_tu_vung_bo_the_tu` | A word may appear only **once** per deck. The form should reject a duplicate `tu` for the current `bo_the_id` inline, rather than surfacing a raw unique-violation error. |

### 8.5 `Start Review`

Navigate to the Review Session placeholder page.

**Placeholder page must contain exactly:**

- Title: `Review Session`
- Description: `This feature will be implemented later.`
- `Back to deck` button → returns to Deck Detail

**Placeholder page must not contain:** flashcard flipping, timer, score, progress tracking, or any review algorithm.

### 8.6 View card

Open a detail view (dialog or sub-route) for the selected flashcard showing:

| Field | SQL source | Rendering |
|---|---|---|
| Word | `the_tu_vung.tu` | Large, primary |
| Meaning | `the_tu_vung.nghia` | Body text; `—` when null |
| Example | `the_tu_vung.vi_du` | Section below meaning; **hidden when null** |
| Audio | `the_tu_vung.duong_dan_am_thanh` | `<audio>` player; **hidden when null** |
| Status | derived from `lich_su_on_the` | Same `StatusBadge` as the table (§7) |

No edit/delete of individual cards in this prototype.

### 8.7 Use-case traceability

| Use case | Spec source | Covered by |
|---|---|---|
| UC01 Xem chi tiết deck | `specs/deck-detail/use-cases.md` | §4, §5, §6 |
| UC02 Quay về danh sách deck | `specs/deck-detail/use-cases.md` | §2, §8.1 |
| UC03 Thêm card (placeholder) | `specs/deck-detail/use-cases.md` | §8.4 |
| UC04 Bắt đầu review (placeholder) | `specs/deck-detail/use-cases.md` | §8.5 |
| UC05 Chỉnh sửa deck | `specs/deck-detail/use-cases.md` | §8.2 |
| UC06 Xóa deck | `specs/deck-detail/use-cases.md` | §8.3 |

---

## 9. Responsive Behaviour

| Element | Desktop (≥1024px) | Tablet (768–1023px) | Mobile (≤767px) |
|---|---|---|---|
| Breadcrumb + Back | Single row | Single row | Single row, title truncates |
| Deck header | Title + created date left, actions right | Actions wrap below title | Actions stack full-width; `Start Review` full-width primary |
| Statistics | 5 cards in one row | 3 + 2 grid | 2-column grid; Accuracy spans both columns |
| Est. learning time | Caption under the row | Caption under the row | Full-width line under the grid |
| Flashcard table | All 5 columns | Hide `#`; keep Question / Answer / Status / Action | **Table → card list.** Each row becomes a stacked card: word, truncated meaning, status badge, view icon button |
| Pagination | Footer, right-aligned | Footer, right-aligned | Footer, centered, larger tap targets |

Minimum tap target: 44×44px on mobile. Body text never below 14px.

---

## 10. Design Direction

From `skill.md` + `specs/DESIGN.md`:

- Modern SaaS application; quality bar = Linear / Vercel / Notion
- Clean educational platform, professional and calm
- **White background**, **blue primary** (`#2563eb`-class), soft shadows, rounded cards, spacious layout, professional typography
- Rounded corners on cards (`rounded-xl`), 8px spacing rhythm

**Avoid**

- Overly playful design, cartoon illustration, heavy gradients
- Excessive animation (transitions ≤150ms, opacity/transform only)
- Complex illustrations

**Accessibility**

- WCAG AA contrast on all text and badges
- Visible focus rings on every interactive element
- Status never conveyed by color alone (§7)
- Semantic table markup with `<th scope="col">`

---

## 11. Components

### 11.1 Used on this screen

| Component | Purpose | Source |
|---|---|---|
| `DeckHeader` | Title, created date, action buttons | `specs/deck-detail/plan.md` |
| `StatisticCard` | One statistics tile | `skill.md` |
| `FlashcardTable` | The flashcard list table (desktop) / card list (mobile) | `skill.md` |
| `StatusBadge` | New / Learning / Mastered pill | `skill.md`, `specs/deck-detail/plan.md` |
| `SearchBar` | Client-side list filter | `skill.md` |
| `EmptyState` | No cards / no search results | `skill.md` |
| `LoadingSkeleton` | Header, statistics row, and table skeleton while data loads | `skill.md` |
| `ConfirmDialog` | Delete confirmation | `specs/deck-detail/` (UC06) |
| `EditDeckDialog` | Edit deck title — single `tieu_de` field only | `specs/deck-detail/` (UC05) |
| `FlashcardDetailDialog` | View card detail | `skill.md` (`View card`) |

### 11.2 Shared conventions

- All components accept `className` and forward it to the root element.
- No component fetches data directly — pages pass props. Keeps components reusable and testable.
- Empty / loading states are components, not inline conditionals, so every data surface can reuse them.
- Icons come from **Lucide** only.

---

## 12. Data

**Prototype rule:** mock rows shaped exactly like `beepoly.sql`. No backend, no API, no authentication, no real review logic. No invented columns.

### 12.1 Types — mirror the schema exactly

```ts
/** Mirrors bo_the_tu_vung. No extra fields. */
interface Deck {
  id: string;                    // bo_the_tu_vung.id
  userId: string;                // bo_the_tu_vung.nguoi_dung_id
  title: string | null;          // bo_the_tu_vung.tieu_de  — nullable
  sourcePdfUrl: string | null;   // bo_the_tu_vung.source_pdf_url
  isAutoGenerated: boolean;      // bo_the_tu_vung.is_auto_generated
  createdAt: string;             // bo_the_tu_vung.ngay_tao (ISO)
}

/** Mirrors the_tu_vung. No extra fields. */
interface Flashcard {
  id: string;                    // the_tu_vung.id
  deckId: string;                // the_tu_vung.bo_the_id
  word: string;                  // the_tu_vung.tu — NOT NULL, non-blank (see note below)
  meaning: string | null;        // the_tu_vung.nghia
  example: string | null;        // the_tu_vung.vi_du
  audioUrl: string | null;       // the_tu_vung.duong_dan_am_thanh
}

// CONSTRAINTS ENFORCED IN THE DB, NOT VISIBLE IN THIS TYPE (beepoly.sql):
// - check_the_tu_vung_tu_khong_trang: `tu` must be non-empty after trimming.
//   Whitespace-only input is rejected, not just null — a plain `string` type
//   alone does not convey this.
// - uq_the_tu_vung_bo_the_tu: a word may appear only ONCE per deck (unique on
//   `(bo_the_id, tu)`). Relevant when Add Card is implemented — see §8.4.

/** Mirrors lich_su_on_the. Composite PK: (userId, cardId). */
interface ReviewLog {
  userId: string;                // lich_su_on_the.nguoi_dung_id
  cardId: string;                // lich_su_on_the.flashcard_id
  easeFactor: number;            // lich_su_on_the.he_so_do_de — must be 1.30–3.00
  intervalDays: number;          // lich_su_on_the.khoang_cach_ngay — must be >= 0
  nextReviewAt: string | null;   // lich_su_on_the.lan_on_tiep_theo
  wrongCount: number;            // lich_su_on_the.so_lan_sai — must be >= 0
}

type CardStatus = "New" | "Learning" | "Mastered";

/** Derived — not stored, not columns. */
type DeckStatistics = {
  total: number;
  mastered: number;
  learning: number;
  newCount: number;
  accuracy: number;           // 0–100
  estimatedLearningTime: string; // "~40 min"
};
```

### 12.2 Status derivation (shared, prototype + MVP)

```ts
function deriveStatus(log: ReviewLog | undefined): CardStatus {
  if (!log) return "New";
  return log.intervalDays > 21 ? "Mastered" : "Learning";
}
```

### 12.3 Statistics derivation

```ts
function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 60) return `${totalSeconds} sec`;
  const m = Math.round(totalSeconds / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

function deriveStats(cards: Flashcard[], logs: ReviewLog[]): DeckStatistics {
  const logByCard = new Map(logs.map((l) => [l.cardId, l]));
  const status = cards.map((c) => deriveStatus(logByCard.get(c.id)));

  const total = cards.length;
  const mastered = status.filter((s) => s === "Mastered").length;
  const learning = status.filter((s) => s === "Learning").length;
  const fresh = status.filter((s) => s === "New").length;

  const reviewed = logs.length;
  const clean = logs.filter((l) => l.wrongCount === 0).length;
  const accuracy = reviewed === 0 ? 0 : Math.round((clean / reviewed) * 100);

  // Invariant: mastered + learning + fresh === total
  return {
    total,
    mastered,
    learning,
    newCount: fresh,
    accuracy,
    estimatedLearningTime: formatDuration(total * 20),
  };
}
```

### 12.4 Mock deck

Only schema columns. The deck id and title come from `skill.md`; the derived statistics are chosen to satisfy the §5.1 invariant.

```ts
const deck: Deck = {
  id: "deck-eng-vocab",
  userId: "user-1",
  title: "English Vocabulary",
  sourcePdfUrl: null,
  isAutoGenerated: false,
  createdAt: "2026-03-14T09:00:00.000Z",
};

const statistics: DeckStatistics = {
  total: 120,
  mastered: 62,
  learning: 28,
  newCount: 30,       // 62 + 28 + 30 === 120
  accuracy: 82,
  estimatedLearningTime: "40 min",
};
```

**Sample flashcard rows** (schema columns only):

```ts
const cards: Flashcard[] = [
  { id: "c1", deckId: "deck-eng-vocab", word: "accommodate",  meaning: "thích nghi, cung cấp đủ chỗ",         example: "The hotel can accommodate 200 guests.",        audioUrl: null },
  { id: "c2", deckId: "deck-eng-vocab", word: "mitigate",     meaning: "giảm nhẹ, làm giảm tác hại",            example: "Measures to mitigate the risk.",               audioUrl: "/audio/mitigate.mp3" },
  { id: "c3", deckId: "deck-eng-vocab", word: "resilient",    meaning: "kiên cường, có khả năng phục hồi",      example: null,                                           audioUrl: null },
  { id: "c4", deckId: "deck-eng-vocab", word: "prerequisite", meaning: "điều kiện tiên quyết",                  example: "Algebra is a prerequisite for calculus.",     audioUrl: null },
  { id: "c5", deckId: "deck-eng-vocab", word: "coherent",     meaning: "mạch lạc, chặt chẽ",                    example: "She made a coherent argument.",               audioUrl: null },
];
```

**Sample review logs** — chosen to produce all three statuses:

| Card | `intervalDays` | Derived status |
|---|---|---|
| `c1` | 7 | `Learning` |
| `c2` | *(no row)* | `New` |
| `c3` | 45 | `Mastered` |
| `c4` | 14 | `Learning` |
| `c5` | 30 | `Mastered` |

```ts
const logs: ReviewLog[] = [
  { userId: "user-1", cardId: "c1", easeFactor: 2.50, intervalDays: 7,  nextReviewAt: "2026-10-03T09:00:00.000Z", wrongCount: 0 },
  { userId: "user-1", cardId: "c3", easeFactor: 2.80, intervalDays: 45, nextReviewAt: "2026-11-12T09:00:00.000Z", wrongCount: 0 },
  { userId: "user-1", cardId: "c4", easeFactor: 2.30, intervalDays: 14, nextReviewAt: "2026-09-30T09:00:00.000Z", wrongCount: 2 },
  { userId: "user-1", cardId: "c5", easeFactor: 2.60, intervalDays: 30, nextReviewAt: "2026-10-31T09:00:00.000Z", wrongCount: 0 },
];
```

---

## 13. Out of Scope

**Explicitly excluded from this prototype** (`skill.md` + `specs/deck-detail/requirements.md`):

- Backend, database, API, authentication
- Real spaced-repetition review logic (SM-2 updates, scheduling)
- Review Session implementation beyond the placeholder page
- Full add-card form logic (UI button only)
- PDF import
- Individual flashcard create / edit / delete
- Charts or analytics beyond the five statistics cards
- Persistence — prototype state resets on reload

**Schema gaps — not buildable until `beepoly.sql` changes:**

- Deck description, category, and difficulty (§0.3)

**Full-MVP-only concerns** (documented so the prototype shape matches; not built now):

- Supabase reads/writes against `bo_the_tu_vung`, `the_tu_vung`, `lich_su_on_the`
- Real persistence across reloads (no localStorage)
- RLS / per-user data isolation

---

## 14. Acceptance Criteria

### 14.1 Prototype build

- [ ] Breadcrumb `Decks / {title}` renders and `Decks` navigates to Deck List.
- [ ] `Back` returns to Deck List.
- [ ] Deck header shows title (`tieu_de`) and created date (`ngay_tao`) — **and nothing else**.
- [ ] Deck header does **not** render description, category, or difficulty.
- [ ] `tieu_de IS NULL` renders `Untitled deck` in both the header and breadcrumb.
- [ ] Header actions render: `Edit`, `Delete`, `+ Add card`, `Start Review`.
- [ ] `Start Review` is the primary (blue) button.
- [ ] Statistics row shows Total, Mastered, Learning, New, Accuracy.
- [ ] `Mastered + Learning + New = Total` for the mock data.
- [ ] Accuracy is `0%` when there is no review history.
- [ ] Estimated learning time is displayed and equals `Total × 20s` formatted.
- [ ] Flashcard table shows Question, Answer preview, Status, Action columns.
- [ ] Question renders `the_tu_vung.tu`; Answer preview renders `the_tu_vung.nghia`.
- [ ] `nghia IS NULL` renders `—` in the answer-preview column.
- [ ] Answer preview truncates with ellipsis; full text is reachable via View card.
- [ ] Status badge renders `New` / `Learning` / `Mastered` with text labels (not color alone).
- [ ] Status is derived via the §7 rule, not stored on the mock card object.
- [ ] `View card` opens the flashcard detail view with word, meaning, example, audio, and status.
- [ ] Example and audio sections are hidden when their columns are null.
- [ ] Search filters the visible flashcards by `tu` or `nghia` and updates the count label.
- [ ] Clearing search restores the full list.
- [ ] Pagination works and resets to page 1 when search changes.
- [ ] Empty deck shows `EmptyState` with a `+ Add card` action.
- [ ] Zero search results shows `EmptyState` with a `Clear search` action.
- [ ] `Edit` dialog opens prefilled with `tieu_de`, validates non-empty title, and updates the header.
- [ ] `Delete` shows a confirmation dialog naming the deck and card count.
- [ ] Confirming delete navigates back to Deck List.
- [ ] `+ Add card` does not implement form logic.
- [ ] Review Session placeholder shows only title, description, and a back button — no flip/timer/score/progress/algorithm.
- [ ] Layout is usable at desktop, tablet, and mobile widths; table becomes a card list on mobile.
- [ ] No backend, database, API, or auth code is introduced.
- [ ] Mock rows contain only the columns defined in `beepoly.sql`.
- [ ] No network calls.

### 14.2 Full MVP (from `specs/deck-detail/acceptance-criteria.md`)

- [ ] Deck detail reads title from `bo_the_tu_vung.tieu_de`.
- [ ] Statistics match live `the_tu_vung` + `lich_su_on_the` data.
- [ ] Status is derived from `lich_su_on_the` (`khoang_cach_ngay` thresholds).
- [ ] Vocabulary list reads `tu`, `nghia`, and derived status.
- [ ] Edit writes to `bo_the_tu_vung.tieu_de`.
- [ ] Delete removes the deck from `bo_the_tu_vung` and its cards from `the_tu_vung`.
- [ ] Data persists in PostgreSQL — survives reload, not localStorage.
- [ ] UI remains readable on desktop and usable on mobile width.

---

## 15. Reference

| Document | Path |
|---|---|
| Build instruction / prototype constraints | `skill.md` |
| Product design overview | `specs/DESIGN.md` |
| Screen 01 overview | `screen.md` |
| Deck Detail requirements | `specs/deck-detail/requirements.md` |
| Entity model & status derivation | `specs/deck-detail/entity-model.md` |
| Use cases UC01–UC06 | `specs/deck-detail/use-cases.md` |
| Acceptance criteria | `specs/deck-detail/acceptance-criteria.md` |
| Implementation plan | `specs/deck-detail/plan.md` |
| Task breakdown | `specs/deck-detail/tasks.md` |
| Deck List screen specification | `deck-list-screen-specification.md` |
| Database schema | `beepoly.sql` |
