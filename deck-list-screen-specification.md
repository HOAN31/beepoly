# Screen Specification — Deck List

| | |
|---|---|
| **Product** | Beepoly — Flashcard Learning System |
| **Screen** | Screen 01 — Deck List |
| **Route** | `/decks` (app entry screen) |
| **Next screen** | Deck Detail (`/decks/:deckId`) |
| **Build scope** | Frontend-only UI prototype (see §15) |
| **Schema rule** | Every data point on screen maps to a column in `beepoly.sql` or is a faithful derivation from one (see §0.2) |

---

## 0. Source Map

This document is the buildable screen specification for Deck List. It is assembled from two sources:

| Source | What it contributes |
|---|---|
| `skill.md` | Screen structure, tech stack, design direction, component conventions, prototype constraints |
| `specs/deck-list/` | Screen content: page title, create-deck action, status filter set and logic, deck card fields, derived values, use cases, acceptance criteria |

**Governing rule — schema fidelity.** This spec is bound to `beepoly.sql`. Where `skill.md` asks for a field that has **no column** in the schema and cannot be derived from one, the field is **removed from the screen**, not emulated with mock data. `specs/deck-list/acceptance-criteria.md` states the same rule explicitly for description.

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

| Slot | `skill.md` | `specs/deck-list/` | SQL source | This spec uses |
|---|---|---|---|---|
| Page title | Header (generic) | `My Vocabulary` | — (UI copy) | **`My Vocabulary`** |
| Create-deck action | *(absent)* | `+ Create new deck` | — (UI action) | **Included** — placeholder only |
| Primary filter | Category filter dropdown | Tabs `All` / `Due for review` / `Mastered` | derived from `lich_su_on_the` | **Status tabs only.** Category dropdown removed — see §0.3. |
| Search | Search input | *(absent)* | `bo_the_tu_vung.tieu_de` | **Included** — matches title only |
| Pagination | Pagination | *(absent)* | — (UI control) | **Included** |
| Deck card: name | Deck name | title | `bo_the_tu_vung.tieu_de` | **`tieu_de`** |
| Deck card: description | Description | **excluded** — "does NOT show a description (field does not exist)" | *no column* | **Removed** — see §0.3 |
| Deck card: category | Category | *(absent)* | *no column* | **Removed** — see §0.3 |
| Deck card: difficulty | Difficulty badge | *(absent)* | *no column* | **Removed** — see §0.3 |
| Deck card: card count | Number of cards | card count | `the_tu_vung.bo_the_id` count | **Included** — derived |
| Deck card: progress | Learning progress | mastery % | `lich_su_on_the.khoang_cach_ngay` | **Included** — derived |
| Deck card: last studied | Last studied time | *(absent)* | *no column* | **Removed** — see §0.3 |
| Deck card: cover | Cover icon | *(absent)* | *not a data field* | **Included** — presentation-only, see §6.2 |
| Deck card: CTA | Open Deck | Open Deck | — (UI action) | **Included** |
| Data | Mock data only | PostgreSQL via Supabase | `beepoly.sql` | **Mock rows shaped exactly like the schema** |

### 0.3 Fields removed — no SQL column

These were requested by `skill.md` but have **no column** in `beepoly.sql` and cannot be derived from any existing column. They are **not shown** on this screen.

| Field | Requested by | Why removed | What would be required |
|---|---|---|---|
| `description` | `skill.md`; forbidden by `specs/deck-list/` AC | `bo_the_tu_vung` has no description column | New column, e.g. `mo_ta TEXT` |
| `category` | `skill.md` | No category column | New column + lookup table |
| `difficulty` | `skill.md` | No difficulty column | New column or enum |
| `last studied time` | `skill.md` | No last-studied column. `lich_su_on_the` has `lan_on_tiep_theo` (**next** review), which is not a last-studied timestamp and must not be presented as one. | New column, e.g. `ngay_on_gan_nhat TIMESTAMPTZ` |
| Category filter dropdown | `skill.md` | Depends on the removed `category` field | Unlocks automatically once a category column exists |

**In place of the removed metadata**, the deck card shows `ngay_tao` as `Created` — the only timestamp column `bo_the_tu_vung` actually has.

---

## 1. Purpose & Goals

Help learners see all their vocabulary decks at a glance and filter them by status.

**Target users**

- Individual English learners
- Students preparing for exams who need to organize vocabulary

**The user can**

1. See every deck they own as a card
2. Read each deck's title, created date, card count, and mastery at a glance
3. Search decks by name
4. Filter decks by learning status (`All` / `Due for review` / `Mastered`)
5. Page through large deck collections
6. Open a deck to see its detail
7. Trigger the create-deck flow (placeholder target)

**Out of scope for this screen** — see §15.

---

## 2. Navigation

```
Deck List  ──Open Deck──▶  Deck Detail  ──Start Review──▶  Review Session (placeholder)
     ▲
     └── Create new deck (placeholder form, no persistence)
```

| Action | Result |
|---|---|
| App entry | Navigate to `/decks` |
| `Open Deck` (on a card) | Navigate to `/decks/:deckId` |
| `+ Create new deck` | Open placeholder create-deck form — **no logic, no persistence** |

**Entry point.** Deck List is the app's landing screen after auth in the full MVP. In the prototype it is the app root route.

---

## 3. Layout

Section order, top to bottom:

```
┌─────────────────────────────────────────────────────────────┐
│ My Vocabulary                        [+ Create new deck]    │
│ Your decks, organized and ready to review                   │
├─────────────────────────────────────────────────────────────┤
│ [Search decks…]          [All | Due for review | Mastered]  │
├─────────────────────────────────────────────────────────────┤
│ 8 decks                                        Showing 1–6  │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│ │ ▣      [EN] │ │ ▣      [PR] │ │ ▣      [PR] │            │
│ │ English Voca│ │ Java OOP    │ │ Database SQL│            │
│ │ Created Mar…│ │ Created Apr…│ │ Created Apr…│            │
│ │ 120 cards   │ │ 85 cards    │ │ 60 cards    │            │
│ │ ▓▓▓▓▓▓▓░░ 75% mastered                         │            │
│ │                    [ Open Deck ]                │            │
│ └─────────────┘ └─────────────┘ └─────────────┘            │
│                                                             │
│                                      ‹ 1  2  ›   6 per page │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Page Header

### 4.1 Displayed elements

| Element | Content | Source |
|---|---|---|
| Title | `My Vocabulary` | `specs/deck-list/` (canonical), `specs/DESIGN.md`, `screen.md` |
| Subtitle | `Your decks, organized and ready to review` | UI copy — no DB source |
| Primary action | `+ Create new deck` | `specs/deck-list/` UC04 |

The header is full-width, white background, no card chrome — the deck grid carries the visual weight.

### 4.2 `+ Create new deck`

| Step | Behaviour |
|---|---|
| Click | Open create-deck placeholder |
| Placeholder form | Shell only: title input, cancel, submit disabled or shows `Coming soon` |
| Cancel / Esc | Close |

**No logic required.** Per `skill.md` and UC04: this is a UI button only. The form's only bound field is `bo_the_tu_vung.tieu_de` — nothing else exists to collect. Nothing is written to the database in the prototype.

---

## 5. Filter & Search

Controls sit in one toolbar row below the header. On mobile they stack: search first, then status tabs.

### 5.1 Status filter tabs

| Value | Label | Condition |
|---|---|---|
| `all` | `All` | All decks for the current user. **Default.** |
| `due` | `Due for review` | Deck has ≥ 1 card where the card has **no** `lich_su_on_the` row, **or** `lich_su_on_the.lan_on_tiep_theo <= now()`. |
| `mastered` | `Mastered` | Deck has 0 cards with status `new` or `learning` — i.e. every card is mastered (`khoang_cach_ngay > 21`). |

- Rendered as a segmented control / tab bar — three options show inline.
- Default selection on mount: **`All`**.
- Changing selection recalculates the visible list immediately; resets to page 1.
- Selected tab uses the primary blue fill; unselected are ghost/outline.

> Source: `specs/deck-list/entity-model.md` Filter Values + UC02. All three predicates derive from `lich_su_on_the`.

### 5.2 Search

| Property | Value |
|---|---|
| Component | `SearchBar` |
| Placeholder | `Search decks…` |
| Matching | Case-insensitive substring match on `bo_the_tu_vung.tieu_de` **only** — there is no description column to match against |
| Behaviour | Client-side, debounced ~200ms. Combines with the status filter (AND). Resets to page 1. |
| Clear | Trailing clear icon when non-empty |

### 5.3 Filter combination

```
visibleDecks = decks
  .filter(matchesStatus)   // all | due | mastered
  .filter(matchesSearch)   // title only
```

Count label above the grid updates to reflect the filtered set: `8 decks` → `3 decks`.

---

## 6. Deck Card

One card per deck. The whole card is a link to Deck Detail; the `Open Deck` button is the explicit CTA inside it.

### 6.1 Anatomy

| # | Element | Content | SQL source | Notes |
|---|---|---|---|---|
| 1 | **Cover icon** | Lucide icon | *none — presentation only* | Rounded tinted tile, top-left. See §6.2. |
| 2 | **Deck name** | `bo_the_tu_vung.tieu_de` | `tieu_de` | 1–2 lines, truncate after. Weight semibold. |
| 3 | **Created** | `bo_the_tu_vung.ngay_tao` | `ngay_tao` | `Created Mar 14, 2026`. The only timestamp column available. |
| 4 | **Card count** | `{cardCount} cards` | `the_tu_vung.bo_the_id` count | Derived — §9.2 |
| 5 | **Mastery** | progress bar + `{mastery}%` | `lich_su_on_the.khoang_cach_ngay` | Derived — §9.2 |
| 6 | **`Open Deck` button** | primary CTA | — (UI action) | Blue, right-aligned in the card footer |

**Fields deliberately absent** — see §0.3: description, category, difficulty badge, last-studied time.

### 6.2 Cover icon

`bo_the_tu_vung` has no icon or category column. The cover icon is therefore **presentation only** — chosen deterministically from the deck `id` so the same deck always renders the same icon, with no invented data behind it.

```ts
const COVER_ICONS = [BookOpen, Library, GraduationCap, Languages, Code2, Brain, Compass, Bookmark] as const;

function coverTone(seed: string): { icon: LucideIcon; tone: string } {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const tones = [
    "bg-blue-50 text-blue-600",
    "bg-emerald-50 text-emerald-600",
    "bg-violet-50 text-violet-600",
    "bg-amber-50 text-amber-600",
  ];
  return { icon: COVER_ICONS[h % COVER_ICONS.length], tone: tones[h % tones.length] };
}
```

Icon tile: `rounded-lg`, `size-10`. This is a deterministic UI decision, **not** a stored field — nothing in `beepoly.sql` is being misrepresented.

### 6.3 Card interaction

| Event | Behaviour |
|---|---|
| Click card body **or** `Open Deck` | Navigate to `/decks/:deckId` |
| Hover | Slight elevation increase (`shadow-md` → `shadow-lg`), border tints to blue-200, CTA darkens. Transition ≤150ms. |
| Focus | Visible ring: `ring-2 ring-blue-500 ring-offset-2` |
| Keyboard | Card is a single focusable link; `Enter` opens the deck |

The `Open Deck` button is not a separate navigation target — it is the visible affordance inside the same card link.

---

## 7. Deck Grid & Pagination

### 7.1 Grid

| Breakpoint | Columns | Gap |
|---|---|---|
| Desktop (≥1024px) | 3 | `gap-6` |
| Tablet (768–1023px) | 2 | `gap-5` |
| Mobile (≤767px) | 1 | `gap-4` |

Cards stretch to equal height within a row (`h-full` on card body) so footers align.

### 7.2 Pagination

| Property | Value |
|---|---|
| Page size | **6** decks per page |
| Location | Below the grid, right-aligned on desktop, centered on mobile |
| Controls | `‹` previous, numbered page buttons, `›` next |
| Current page | Primary blue fill |
| Disabled | Previous at page 1, next at last page — visibly disabled, not hidden |
| Status line | `Showing 1–6 of 8 decks` |
| Reset | Any change to search or status filter returns to page 1 |

**Behaviour on filter change.** If the filtered set is smaller than one page, hide the pagination controls entirely and show the full filtered set.

---

## 8. Empty & Loading States

### 8.1 Empty states

| Condition | Rendering |
|---|---|
| User has 0 decks | `EmptyState`: `BookOpen` icon, title `No decks yet`, body `Create your first vocabulary deck to start learning.`, action `+ Create new deck` |
| Status filter yields 0 | `EmptyState`: title `No decks match this filter`, body `Try switching back to All.`, action `Show all decks` (resets filter to `all`) |
| Search yields 0 | `EmptyState`: title `No decks found`, body `Try a different search term.`, action `Clear search` |

Every empty state is a component, not an inline conditional, so each control can trigger its own reset action.

### 8.2 Loading state

`LoadingSkeleton` on first mount:

- Header skeleton (title bar + button block)
- Toolbar skeleton (search + tabs)
- 6 card skeletons — icon tile, 2 text lines, count line, progress bar, footer row

Use `animate-pulse` on `bg-slate-100` blocks. Do not show a spinner in place of the grid — keep the page's shape stable.

---

## 9. Derived Values & Filter Logic

All derived values are computed client-side from mock review-log data using the **same rule** the full MVP will use against `lich_su_on_the`. Swapping mocks for Supabase queries later does not change the UI.

### 9.1 Card status (shared with Deck Detail)

Card status is **not a stored column**. It is derived from `lich_su_on_the`:

| Status | Condition |
|---|---|
| `New` | No row in `lich_su_on_the` for `(nguoi_dung_id, flashcard_id)` |
| `Learning` | Row exists **and** `khoang_cach_ngay <= 21` |
| `Mastered` | Row exists **and** `khoang_cach_ngay > 21` |

### 9.2 Per-deck derived values

| Value | Definition | SQL source |
|---|---|---|
| `cardCount` | Count of `the_tu_vung` where `bo_the_id` = deck.id | `the_tu_vung` |
| `mastery` | `(mastered cards / total cards) × 100`, rounded. `0` when `cardCount === 0`. | `lich_su_on_the.khoang_cach_ngay` |
| `hasDueCards` | ≥ 1 card with status `New`, **or** status `Learning` and `lan_on_tiep_theo <= now()` | `lich_su_on_the` |
| `isFullyMastered` | `cardCount > 0` and **every** card has status `Mastered` | `lich_su_on_the.khoang_cach_ngay` |

### 9.3 Filter predicates

```
all       → true
due       → deck.hasDueCards
mastered  → deck.isFullyMastered
```

> **Note.** `mastered` requires 100% mastery, not "majority mastered". A deck at 75% does **not** appear under `Mastered`.

---

## 10. Interactions

### 10.1 Use-case traceability

| Use case | Spec source | Covered by |
|---|---|---|
| UC01 Xem danh sách deck | `specs/deck-list/use-cases.md` | §4, §6, §7 |
| UC02 Lọc deck | `specs/deck-list/use-cases.md` | §5, §9.3 |
| UC03 Mở deck (điều hướng sang Deck Detail) | `specs/deck-list/use-cases.md` | §2, §6.3 |
| UC04 Tạo deck mới (UI placeholder) | `specs/deck-list/use-cases.md` | §4.2 |

### 10.2 Interaction summary

| Trigger | Result |
|---|---|
| Type in search | Debounced client-side filter on `tieu_de`; count updates; page resets to 1 |
| Select status tab | List recalculates by filter predicate; page resets to 1; count updates |
| Click `Open Deck` / card body | Navigate to `/decks/:deckId` |
| Click `+ Create new deck` | Open placeholder form; no persistence |
| Change page | Show the next/previous page of the **currently filtered** set |
| Click empty-state reset action | Clear the control that produced the empty state |

---

## 11. Responsive Behaviour

| Element | Desktop (≥1024px) | Tablet (768–1023px) | Mobile (≤767px) |
|---|---|---|---|
| Page header | Title + subtitle left, `+ Create new deck` right | Same | Action moves below title, full-width |
| Toolbar | Search left; status tabs right, single row | Wraps to two rows | Stacks: search → tabs (scrollable if needed) |
| Deck grid | 3 columns | 2 columns | 1 column |
| Deck card internals | Cover + name on one row | Same | Cover above name |
| Mastery bar | Full width of card body | Full width | Full width |
| Pagination | Right-aligned | Right-aligned | Centered, larger tap targets |

Minimum tap target: 44×44px on mobile. Body text never below 14px.

---

## 12. Design Direction

From `skill.md` + `specs/DESIGN.md`:

- Modern SaaS application; quality bar = Linear / Vercel / Notion
- Clean educational platform, professional and calm
- **White background**, **blue primary** (`#2563eb`-class), soft shadows, rounded cards, spacious layout, professional typography
- Cards: `rounded-xl`, `border border-slate-200`, `shadow-sm` resting → `shadow-md` hover
- 8px spacing rhythm; generous padding inside cards (`p-5`/`p-6`)

**Avoid**

- Overly playful design, cartoon illustration, heavy gradients
- Excessive animation (transitions ≤150ms, opacity/transform only)
- Complex illustrations

**Accessibility**

- WCAG AA contrast on all text and the mastery bar
- Visible focus rings on cards, buttons, tabs, and inputs
- Mastery percentage is always written as text, not conveyed by bar colour alone
- Filter tabs use `role="tablist"` / `role="tab"` with `aria-selected`
- Search input has an associated `<label>` (visually hidden is acceptable)

---

## 13. Components

### 13.1 Used on this screen

| Component | Purpose | Source |
|---|---|---|
| `AppHeader` | `My Vocabulary` title, subtitle, `+ Create new deck` button | `specs/deck-list/plan.md` |
| `SearchBar` | Client-side deck search on `tieu_de` | `skill.md` |
| `FilterBar` | Status tabs `All` / `Due for review` / `Mastered` | `specs/deck-list/plan.md` |
| `DeckList` | Grid container + pagination | `specs/deck-list/plan.md` |
| `DeckCard` | One deck tile (§6) | `skill.md`, `specs/deck-list/plan.md` |
| `EmptyState` | All three empty-state variants | `skill.md` |
| `LoadingSkeleton` | Header, toolbar, and card skeletons | `skill.md` |
| `Pagination` | Page controls + status line | `skill.md` |
| `CreateDeckDialog` | Placeholder create-deck form shell | `specs/deck-list/` (UC04) |

**Not used on this screen:**

| Component | Why |
|---|---|
| `FilterDropdown` | Depends on the removed `category` field (§0.3) |
| `StatisticCard`, `FlashcardTable`, `StatusBadge` | Belong to Deck Detail |

### 13.2 Shared conventions

- All components accept `className` and forward it to the root element.
- No component fetches data directly — the page passes props in. Keeps components reusable and testable.
- Empty and loading states are components, not inline conditionals.
- Icons come from **Lucide** only.
- Filter state lives in the page (or a small `deckListStore`), not inside `FilterBar` / `SearchBar`.

---

## 14. Data

**Prototype rule:** mock rows shaped exactly like `beepoly.sql`. No backend, no API, no authentication, no real review logic. No invented columns.

### 14.1 Types — mirror the schema exactly

```ts
/** Mirrors bo_the_tu_vung. No extra fields. */
interface Deck {
  id: string;                    // bo_the_tu_vung.id
  userId: string;                // bo_the_tu_vung.nguoi_dung_id
  title: string | null;          // bo_the_tu_vung.tieu_de
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
//   `(bo_the_id, tu)`). Does not affect Deck List itself (which never writes
//   cards); noted here for consistency with the shared type definition.

/** Mirrors lich_su_on_the. Composite PK: (userId, cardId). */
interface ReviewLog {
  userId: string;                // lich_su_on_the.nguoi_dung_id
  cardId: string;                // lich_su_on_the.flashcard_id
  easeFactor: number;            // lich_su_on_the.he_so_do_de — must be 1.30–3.00
  intervalDays: number;          // lich_su_on_the.khoang_cach_ngay — must be >= 0
  nextReviewAt: string | null;   // lich_su_on_the.lan_on_tiep_theo
  wrongCount: number;            // lich_su_on_the.so_lan_sai — must be >= 0
}

/**
 * Deck + values derived from the_tu_vung / lich_su_on_the.
 * Derived — not stored, not columns.
 */
type DeckWithStats = Deck & {
  cardCount: number;
  mastery: number;          // 0–100
  hasDueCards: boolean;
  isFullyMastered: boolean;
};
```

### 14.2 Derivation (prototype + MVP shared)

```ts
function deriveStatus(log: ReviewLog | undefined): CardStatus {
  if (!log) return "New";
  return log.intervalDays > 21 ? "Mastered" : "Learning";
}

function deriveDeckStats(
  deck: Deck,
  cards: Flashcard[],
  logs: ReviewLog[],
  now = new Date(),
): DeckWithStats {
  const logByCard = new Map(logs.map((l) => [l.cardId, l]));
  const status = cards.map((c) => deriveStatus(logByCard.get(c.id)));

  const cardCount = cards.length;
  const mastered = status.filter((s) => s === "Mastered").length;
  const mastery = cardCount === 0 ? 0 : Math.round((mastered / cardCount) * 100);

  const hasDueCards = cards.some((c, i) => {
    if (status[i] === "New") return true;
    if (status[i] !== "Learning") return false;
    const log = logByCard.get(c.id);
    return !!log?.nextReviewAt && new Date(log.nextReviewAt) <= now;
  });

  return {
    ...deck,
    cardCount,
    mastery,
    hasDueCards,
    isFullyMastered: cardCount > 0 && mastered === cardCount,
  };
}
```

### 14.3 Filter application

```ts
function applyDeckFilters(
  decks: DeckWithStats[],
  status: StatusFilter,
  query: string,
): DeckWithStats[] {
  const q = query.trim().toLowerCase();

  return decks.filter((d) => {
    if (status === "due" && !d.hasDueCards) return false;
    if (status === "mastered" && !d.isFullyMastered) return false;
    if (q && !(d.title ?? "").toLowerCase().includes(q)) return false;
    return true;
  });
}
```

### 14.4 Mock decks

Rows below carry **only** schema columns. The first three titles come from `skill.md`. The remaining five are added so that the `Mastered` tab and pagination are both demonstrable — `skill.md` gives three decks, none of them fully mastered, which would leave `Mastered` empty and pagination untested.

| # | `id` | `tieu_de` | `ngay_tao` | Derived `cardCount` | Derived `mastery` | Derived `hasDueCards` |
|---|---|---|---|---|---|---|
| 1 | `deck-eng-vocab` | English Vocabulary | 2026-03-14 | 120 | 75% | true |
| 2 | `deck-java-oop` | Java OOP | 2026-04-02 | 85 | 30% | true |
| 3 | `deck-db-sql` | Database SQL | 2026-04-18 | 60 | 10% | true |
| 4 | `deck-biz-email` | Business Emails | 2026-05-06 | 48 | 100% | false |
| 5 | `deck-travel-en` | Travel English | 2026-05-21 | 36 | 100% | false |
| 6 | `deck-ielts-speaking` | IELTS Speaking | 2026-06-09 | 200 | 45% | true |
| 7 | `deck-french-basics` | French Basics | 2026-07-03 | 80 | 60% | true |
| 8 | `deck-machine-learning` | Machine Learning | 2026-08-15 | 95 | 85% | true |

All rows share `nguoi_dung_id = "user-1"`, `source_pdf_url = null`, `is_auto_generated = false`.

**Expected filter results** (page size 6):

| Filter | Result |
|---|---|
| `All` | 8 decks → 2 pages |
| `Due for review` | 6 decks → 1 page |
| `Mastered` | 2 decks (Business Emails, Travel English) → 1 page |

**Example card shape:**

```ts
const englishVocabulary: DeckWithStats = {
  id: "deck-eng-vocab",
  userId: "user-1",
  title: "English Vocabulary",
  sourcePdfUrl: null,
  isAutoGenerated: false,
  createdAt: "2026-03-14T09:00:00.000Z",
  cardCount: 120,
  mastery: 75,
  hasDueCards: true,
  isFullyMastered: false,
};
```

---

## 15. Out of Scope

**Explicitly excluded from this prototype** (`skill.md` + `specs/deck-list/requirements.md`):

- Backend, database, API, authentication
- Create-deck form logic — UI button only
- Real spaced-repetition logic (SM-2 updates, scheduling)
- Review Session beyond the placeholder page
- PDF import
- Deck edit / delete from this screen (those live on Deck Detail)
- Persistence — prototype state resets on reload

**Schema gaps — not buildable until `beepoly.sql` changes:**

- Deck description, category, difficulty badge, last-studied time (§0.3)
- Category filter dropdown
- Any create-deck form field beyond `tieu_de`

**Full-MVP-only concerns** (documented so the prototype shape matches; not built now):

- Supabase reads against `bo_the_tu_vung`, `the_tu_vung`, `lich_su_on_the`
- Real persistence across reloads (no localStorage)
- RLS / per-user data isolation
- Create-deck writing to `bo_the_tu_vung`

---

## 16. Acceptance Criteria

### 16.1 Prototype build

- [ ] Page title reads `My Vocabulary`.
- [ ] Subtitle renders beneath the title.
- [ ] `+ Create new deck` button is visible, clickable, and opens a placeholder form only.
- [ ] Search input filters visible decks by `tieu_de`.
- [ ] Clearing search restores the full list.
- [ ] Status filter tabs render `All` / `Due for review` / `Mastered`.
- [ ] Default status filter on mount is `All`.
- [ ] Selecting a filter updates the visible deck list.
- [ ] `Mastered` shows only decks at 100% mastery — a 75% deck must not appear.
- [ ] `Due for review` shows decks with at least one new or due-learning card.
- [ ] Filter and search changes reset pagination to page 1.
- [ ] Deck card shows cover icon, deck name (`tieu_de`), created date (`ngay_tao`), card count, mastery bar with percentage, and `Open Deck` button — **and nothing else**.
- [ ] Deck card does **not** render description, category, difficulty badge, or last-studied time.
- [ ] Mastery bar width matches the deck's mastery percentage.
- [ ] `cardCount === 0` renders `0%` rather than hiding the mastery element.
- [ ] Mastery percentage is present as text, not colour alone.
- [ ] Clicking `Open Deck` **or** the card body navigates to Deck Detail.
- [ ] Grid is 3 columns on desktop, 2 on tablet, 1 on mobile.
- [ ] Pagination shows `Showing X–Y of Z decks`; controls disable at the boundaries.
- [ ] Single-page result sets hide pagination controls.
- [ ] Zero decks shows `EmptyState` with `+ Create new deck`.
- [ ] Empty filter/search results show `EmptyState` with a reset action.
- [ ] Loading state renders header, toolbar, and 6 card skeletons — not a bare spinner.
- [ ] No backend, database, API, or auth code is introduced.
- [ ] Mock rows contain only the columns defined in `beepoly.sql`.
- [ ] No network calls.

### 16.2 Full MVP (from `specs/deck-list/acceptance-criteria.md`)

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

## 17. Reference

| Document | Path |
|---|---|
| Build instruction / prototype constraints | `skill.md` |
| Product design overview | `specs/DESIGN.md` |
| Screen 01 overview | `screen.md` |
| Deck List requirements | `specs/deck-list/requirements.md` |
| Entity model, derived values, filter values | `specs/deck-list/entity-model.md` |
| Use cases UC01–UC04 | `specs/deck-list/use-cases.md` |
| Acceptance criteria | `specs/deck-list/acceptance-criteria.md` |
| Implementation plan | `specs/deck-list/plan.md` |
| Task breakdown | `specs/deck-list/tasks.md` |
| Deck Detail screen specification | `deck-detail-screen-specification.md` |
| Database schema | `beepoly.sql` |
