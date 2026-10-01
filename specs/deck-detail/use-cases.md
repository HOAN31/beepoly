# Use Cases

## UC01: Xem chi tiết deck

### Actor

Người học

### Goal

Người học muốn xem thông tin chi tiết của một deck.

### Main Flow

1. Người học mở Deck Detail (từ Deck List).
2. Hệ thống truy vấn `bo_the_tu_vung` lấy title (`tieu_de`) của deck.
3. Hệ thống truy vấn `the_tu_vung` lấy danh sách card của deck.
4. Hệ thống truy vấn `lich_su_on_the` tính toán status cho từng card.
5. Hệ thống hiển thị thống kê: Total, Mastered, Learning, New, Accuracy.
6. Hệ thống hiển thị danh sách vocabulary trong deck.
7. Mỗi vocabulary card hiển thị: word (`tu`), meaning (`nghia`), status (derived).

### Alternative Flow

Nếu deck chưa có card nào, hiển thị empty state gợi ý thêm card.

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
2. Người học bấm nút Back.
3. Hệ thống chuyển về màn hình Deck List (xem specs/deck-list/).

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
3. Hệ thống hiển thị form thêm card.

### Note

Workshop: chỉ cần tạo UI button.

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
2. Người học bấm nút "Start Review".
3. Hệ thống chuyển sang Review Session.

### Note

Workshop: chưa xây Review Session.

### Related Acceptance Criteria

Xem mục "Start Review" trong acceptance-criteria.md.

---

## UC05: Chỉnh sửa deck

### Actor

Người học

### Goal

Người học muốn chỉnh sửa thông tin deck.

### Main Flow

1. Người học mở Deck Detail.
2. Người học bấm Edit.
3. Hệ thống hiển thị form với `tieu_de` hiện tại.
4. Người học chỉnh sửa và lưu.
5. Hệ thống cập nhật `bo_the_tu_vung.tieu_de`.

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
3. Hệ thống hiển thị xác nhận.
4. Người học xác nhận.
5. Hệ thống xóa deck khỏi `bo_the_tu_vung`, và xóa các card liên quan trong `the_tu_vung`.
6. Hệ thống chuyển về Deck List.

### Related Acceptance Criteria

Xem mục "Deck Management" trong acceptance-criteria.md.
