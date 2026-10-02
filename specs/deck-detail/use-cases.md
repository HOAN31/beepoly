# Use Cases

## UC01: Xem chi tiết deck

### Actor

Người học

### Goal

Người học muốn xem thông tin chi tiết của một deck.

### Main Flow

1. Người học mở Deck Detail (từ Deck List) tại route `/decks/:deckId`.
2. Hệ thống hiển thị breadcrumb `Decks / {title}` và nút Back.
3. Hệ thống hiển thị deck header: title (`tieu_de`) và ngày tạo (`ngay_tao`) — không có description/category/difficulty.
4. Nếu `tieu_de IS NULL`, hiển thị `Untitled deck` ở cả header và breadcrumb.
5. Hệ thống hiển thị thống kê: Total, Mastered, Learning, New, Accuracy, cùng Est. learning time (`Total × 20s`).
6. Hệ thống hiển thị danh sách flashcard trong deck: cột Question (`tu`), Answer preview (`nghia`), Status (derived), Action (View card).
7. Người học có thể tìm kiếm (Search) và phân trang (pagination) danh sách flashcard.
8. Người học bấm View card (hoặc click vào dòng) để xem chi tiết card: word, meaning, example, audio, status.

### Alternative Flow

- Nếu deck chưa có card nào: hiển thị `EmptyState` với tiêu đề `No flashcards yet` và action `+ Add card`.
- Nếu tìm kiếm không có kết quả: hiển thị `EmptyState` với tiêu đề `No flashcards match` và action `Clear search`.

### Related Acceptance Criteria

Xem mục "Deck Detail" trong acceptance-criteria.md.

---

## UC02: Quay về danh sách deck

### Actor

Người học

### Goal

Người học muốn quay về màn hình danh sách deck.

### Main Flow

1. Người học đang ở màn hình Deck Detail.
2. Người học bấm nút Back, hoặc click breadcrumb `Decks`.
3. Hệ thống chuyển về màn hình Deck List (route `/decks`, xem specs/deck-list/).

### Related Acceptance Criteria

Xem mục "Navigation" trong acceptance-criteria.md.

---

## UC03: Thêm card (UI placeholder)

### Actor

Người học

### Goal

Người học muốn thêm một vocabulary card mới vào deck.

### Main Flow

1. Người học mở Deck Detail.
2. Người học bấm nút "+ Add card".
3. Hệ thống hiển thị form shell bị disable, hoặc toast `Coming soon`.

### Note

Workshop: chỉ cần tạo UI button — **không** implement form logic, không persist. Form thật sẽ chỉ bắt buộc `the_tu_vung.tu`; `nghia`, `vi_du`, `duong_dan_am_thanh` đều nullable.

### Related Acceptance Criteria

Xem mục "Add Card" trong acceptance-criteria.md.

---

## UC04: Bắt đầu review (UI placeholder)

### Actor

Người học

### Goal

Người học muốn bắt đầu phiên review cho deck.

### Main Flow

1. Người học mở Deck Detail.
2. Người học bấm nút "Start Review" (primary, blue).
3. Hệ thống chuyển sang Review Session placeholder (`/decks/:deckId/review`).

### Placeholder page — đúng những gì hiển thị

- Title: `Review Session`
- Description: `This feature will be implemented later.`
- Nút `Back to deck` → quay về Deck Detail

### Placeholder page — không được chứa

Flashcard flipping, timer, score, progress tracking, hoặc bất kỳ review algorithm nào.

### Related Acceptance Criteria

Xem mục "Start Review" trong acceptance-criteria.md.

---

## UC05: Chỉnh sửa deck

### Actor

Người học

### Goal

Người học muốn chỉnh sửa tiêu đề của deck.

### Main Flow

1. Người học mở Deck Detail.
2. Người học bấm Edit.
3. Hệ thống hiển thị dialog với một text input duy nhất, prefilled với `tieu_de` hiện tại.
4. Người học chỉnh sửa tiêu đề hợp lệ và lưu.
5. Hệ thống cập nhật `bo_the_tu_vung.tieu_de`; dialog đóng; toast `Deck updated`.

### Alternative Flow

- Submit tiêu đề rỗng: hiển thị validation inline `Deck title is required`; không đóng dialog. (Cho phép xóa về `NULL` — render `Untitled deck` — nhưng cần confirm rõ ràng.)
- Cancel / Esc / backdrop: đóng dialog không lưu.

### Note

Chỉ `tieu_de` được sửa trên màn hình này. `ngay_tao`, `is_auto_generated`, `source_pdf_url` không user-editable. Prototype lưu vào local state; shape dialog phải khớp full MVP.

### Related Acceptance Criteria

Xem mục "Deck Management" trong acceptance-criteria.md.

---

## UC06: Xóa deck

### Actor

Người học

### Goal

Người học muốn xóa một deck.

### Main Flow

1. Người học mở Deck Detail.
2. Người học bấm Delete.
3. Hệ thống hiển thị dialog xác nhận:
   - Title: `Delete this deck?`
   - Body: `This will permanently remove "{title}" and all {N} flashcards in it. This action cannot be undone.`
   - Actions: `Cancel` / `Delete` (destructive)
4. Người học xác nhận.
5. Hệ thống xóa deck và các card liên quan; chuyển về Deck List.

### Note

Dùng display name đã resolve (`tieu_de ?? "Untitled deck"`) trong dialog copy. Full MVP: xóa rows trong `bo_the_tu_vung` và `the_tu_vung`.

### Related Acceptance Criteria

Xem mục "Deck Management" trong acceptance-criteria.md.
