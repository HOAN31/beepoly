# Use Cases

## UC01: Xem danh sách deck

### Actor

Người học

### Goal

Người học muốn xem tất cả các vocabulary deck đã tạo.

### Main Flow

1. Người học mở ứng dụng.
2. Hệ thống hiển thị màn hình Deck List.
3. Hệ thống hiển thị tiêu đề "My Vocabulary".
4. Hệ thống hiển thị nút "+ Create new deck".
5. Hệ thống hiển thị bộ lọc: All, Due for review, Mastered.
6. Hệ thống truy vấn `bo_the_tu_vung` lấy các deck của người dùng hiện tại.
7. Hệ thống hiển thị danh sách deck card.
8. Mỗi deck card hiển thị: title (`tieu_de`), card count, mastery %, nút Open Deck.

### Alternative Flow

Nếu chưa có deck nào, hệ thống hiển thị empty state gợi ý tạo deck đầu tiên.

### Related Acceptance Criteria

Xem mục "Deck List" trong acceptance-criteria.md.

---

## UC02: Lọc deck

### Actor

Người học

### Goal

Người học muốn lọc danh sách deck theo trạng thái.

### Main Flow

1. Người học xem danh sách deck.
2. Người học chọn filter: All / Due for review / Mastered.
3. Hệ thống cập nhật danh sách deck hiển thị theo filter đã chọn.

### Filter Logic

- **All**: hiển thị toàn bộ deck của người dùng.
- **Due for review**: chỉ hiển thị deck có ít nhất 1 card đến hạn ôn tập (card chưa có `lich_su_on_the`, hoặc `lan_on_tiep_theo <= now()`).
- **Mastered**: chỉ hiển thị deck có 100% card đã mastered (tất cả card đều có `lich_su_on_the.khoang_cach_ngay > 21`).

### Alternative Flow

Nếu filter không có deck nào khớp, hiển thị empty state tương ứng.

### Related Acceptance Criteria

Xem mục "Deck List" trong acceptance-criteria.md.

---

## UC03: Mở deck (điều hướng sang Deck Detail)

### Actor

Người học

### Goal

Người học muốn mở một deck để xem chi tiết.

### Main Flow

1. Người học bấm "Open Deck" trên một deck card.
2. Hệ thống chuyển sang màn hình Deck Detail (xem specs/deck-detail/).

### Related Acceptance Criteria

Xem mục "Navigation" trong acceptance-criteria.md.

---

## UC04: Tạo deck mới (UI placeholder)

### Actor

Người học

### Goal

Người học muốn tạo một vocabulary deck mới.

### Main Flow

1. Người học bấm nút "+ Create new deck".
2. Hệ thống hiển thị form Create Deck.

### Note

Workshop: chưa cần implement logic form.

### Related Acceptance Criteria

Xem mục "Create Deck" trong acceptance-criteria.md.
