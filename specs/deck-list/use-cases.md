# Use Cases

## UC01: Xem danh sách deck

### Actor

Người học

### Goal

Người học muốn xem tất cả các vocabulary deck đã tạo của mình.

### Main Flow

1. Người học mở ứng dụng.
2. Hệ thống chuyển hướng tới route `/decks` — trong prototype đây là root route của app.
3. Hệ thống hiển thị màn hình Deck List với tiêu đề `My Vocabulary` và subtitle `Your decks, organized and ready to review`.
4. Hệ thống hiển thị nút `+ Create new deck`.
5. Hệ thống hiển thị toolbar gồm: ô tìm kiếm (placeholder `Search decks…`, chỉ match trên trường `tieu_de`) và status tabs `All` / `Due for review` / `Mastered` (mặc định `All`).
6. Trên lần mount đầu tiên, hệ thống hiển thị loading skeleton gồm: header skeleton, toolbar skeleton, và 6 card skeleton — không dùng spinner để giữ nguyên hình dạng layout.
7. Hệ thống nạp mock data các deck (dạng row giống hệt schema `beepoly.sql`: `bo_the_tu_vung`, `the_tu_vung`, `lich_su_on_the`), và tính client-side các giá trị derived: `cardCount` (count từ `the_tu_vung` theo `bo_the_id`), `mastery` = (số card mastered / tổng số card) × 100 (0 khi `cardCount === 0`), `hasDueCards`, `isFullyMastered`.
8. Hệ thống hiển thị grid deck card (3 cột desktop, 2 cột tablet, 1 cột mobile).
9. Mỗi deck card hiển thị:
   - Cover icon — presentation-only, chọn deterministic từ `id` của deck (không phải field trong database, không lưu trữ gì).
   - Deck name — `bo_the_tu_vung.tieu_de`.
   - `Created` — `bo_the_tu_vung.ngay_tao`.
   - `{n} cards` — derived từ count của `the_tu_vung`.
   - Mastery progress bar kèm text `{mastery}%` (mastery luôn được viết bằng text, không chỉ bằng màu của bar).
   - Nút `Open Deck`.
10. Hệ thống hiển thị pagination: 6 deck / page, status line `Showing X–Y of Z decks`. Nút previous disable ở page 1, nút next disable ở page cuối — disable chứ không ẩn. Khi kết quả filtered chỉ vừa 1 page, toàn bộ pagination bị ẩn.
11. Hệ thống cập nhật count label trên grid (`8 decks` → `3 decks`) phản ánh đúng set deck đang hiển thị.

### Alternative Flow

- Nếu người dùng có 0 deck, hệ thống hiển thị empty state: icon `BookOpen`, tiêu đề `No decks yet`, body `Create your first vocabulary deck to start learning.`, action `+ Create new deck`.
- Nếu search / filter trả về 0 kết quả, xem UC02.
- Nếu thao tác filter/search đổi trang hiện tại, hệ thống reset pagination về page 1 (xem UC02).

### Related Acceptance Criteria

Xem mục "Deck List" trong acceptance-criteria.md.

---

## UC02: Lọc deck

### Actor

Người học

### Goal

Người học muốn lọc danh sách deck theo trạng thái học và/hoặc tìm deck theo tên.

### Main Flow

1. Người học xem danh sách deck (UC01).
2. Người học chọn status filter: `All` / `Due for review` / `Mastered` (mặc định `All`).
3. Hệ thống áp filter **client-side** lên mock data (không query backend), hiển thị lại danh sách deck ngay lập tức.
4. Người học gõ vào ô tìm kiếm `Search decks…` (debounce ~200ms, chỉ match substring trên `tieu_de`, case-insensitive).
5. Hệ thống kết hợp search với status filter theo phép **AND** (`visibleDecks = decks.filter(matchesStatus).filter(matchesSearch)`).
6. Mỗi lần đổi search hoặc status filter, hệ thống reset pagination về page 1.
7. Hệ thống cập nhật count label và pagination tương ứng set kết quả hiện tại.

### Filter Logic

- **All**: hiển thị toàn bộ deck của người dùng.
- **Due for review**: chỉ hiển thị deck có ít nhất 1 card ở trạng thái `New` (chưa có row `lich_su_on_the`), hoặc trạng thái `Learning` (`khoang_cach_ngay <= 21`) và `lan_on_tiep_theo <= now()`.
- **Mastered**: chỉ hiển thị deck có 100% card đã mastered — tức mọi card đều ở trạng thái `Mastered` (`khoang_cach_ngay > 21`), không có card nào `new` hay `learning`. **Mastered nghĩa là 100%, không phải "đa số"** — deck ở 75% KHÔNG xuất hiện trong tab Mastered.

### Alternative Flow

- **Filter yield 0 kết quả**: hệ thống hiển thị empty state `EmptyState` với tiêu đề `No decks match this filter`, body `Try switching back to All.`, action `Show all decks` (reset filter về `all`).
- **Search yield 0 kết quả**: hệ thống hiển thị `EmptyState` với tiêu đề `No decks found`, body `Try a different search term.`, action `Clear search` (xóa text search).

### Related Acceptance Criteria

Xem mục "Deck List" trong acceptance-criteria.md.

---

## UC03: Mở deck (điều hướng sang Deck Detail)

### Actor

Người học

### Goal

Người học muốn mở một deck để xem chi tiết.

### Main Flow

1. Người học hover vào một deck card: elevation tăng nhẹ (`shadow-md` → `shadow-lg`), border tints xanh `blue-200`, CTA darken. Transition ≤150ms.
2. Người học bấm `Open Deck` **hoặc** bấm vào body của deck card.
3. Hệ thống chuyển sang màn hình Deck Detail tại route `/decks/:deckId` (xem specs/deck-detail/ và `deck-detail-screen-specification.md`).

### Accessibility

- Deck card là một single focusable link duy nhất — `Open Deck` button là affordance hiển thị bên trong cùng card link đó, không phải target điều hướng riêng.
- Nhấn `Enter` trên card đang được focus cũng mở deck.
- Focus ring luôn visible (`ring-2 ring-blue-500 ring-offset-2`).

### Related Acceptance Criteria

Xem mục "Navigation" trong acceptance-criteria.md.

---

## UC04: Tạo deck mới (UI placeholder)

### Actor

Người học

### Goal

Người học muốn tạo một vocabulary deck mới.

### Main Flow

1. Người học bấm nút `+ Create new deck`.
2. Hệ thống mở `CreateDeckDialog` — form placeholder dạng shell: tiêu đề dialog + một input duy nhất cho `bo_the_tu_vung.tieu_de` (đây là field duy nhất schema hiện có).
3. Người học bấm Cancel hoặc nhấn `Esc` — dialog đóng lại.

### Note

Workshop: **chưa có logic gì được implement**. Nút submit bị disable hoặc chỉ hiện thông báo `Coming soon`. Không có validation, không có persistence — **không có gì được ghi vào database nào trong prototype này**. Không có logic tạo deck, không có backend, không có API.

### Related Acceptance Criteria

Xem mục "Create Deck" trong acceptance-criteria.md.
