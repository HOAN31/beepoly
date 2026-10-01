# Specification — Beepoly Vocabulary App

## SCREEN 01 — FLASHCARD DECK LIST

### 1. Mục tiêu

Người dùng có thể:

- Xem toàn bộ vocabulary deck
- Xem số lượng card trong mỗi deck
- Xem mức độ hoàn thành (mastery)
- Lọc deck theo trạng thái
- Mở một deck để xem chi tiết

### 2. Thành phần giao diện

#### Header

Hiển thị:

- Title: `My Vocabulary`
- Button: `+ Create new deck`

#### Filter

Có 3 filter:

| Filter | Mặc định |
|---|---|
| All | ✅ |
| Due for review | |
| Mastered | |

Mặc định: **All**

#### Deck Card

Mỗi deck hiển thị:

- Deck title
- Description
- Card count
- Mastery percentage
- Button: `Open Deck`

**Ví dụ:**

```text
TOEIC Part 5
Common vocabulary for TOEIC Part 5
48 cards
72% mastered
[ Open Deck ]
```

### 3. User Interaction

#### Click "Create New Deck"

Mở form:

```text
Create Deck
```

> Workshop: chưa cần implement.

#### Click Deck Card

Chuyển màn hình:

```text
Deck List
    ↓
Deck Detail
```

#### Click Filter

Danh sách thay đổi theo filter đã chọn:

- `All`
- `Due for review`
- `Mastered`

---

## SCREEN 02 — DECK DETAIL

### 1. Mục tiêu

Người dùng có thể:

- Xem thông tin deck
- Xem thống kê
- Xem danh sách vocabulary
- Thêm card
- Bắt đầu review
- Chỉnh sửa / xóa deck

### 2. Deck Header

Hiển thị:

- Deck title: `TOEIC Part 5`
- Description: `Common vocabulary for TOEIC Part 5`

**Buttons:**

- `Edit`
- `Delete`

### 3. Deck Statistics

Hiển thị các chỉ số sau:

| Total | Mastered | Learning | New | Accuracy |
|---|---|---|---|---|
| 48 | 25 | 15 | 8 | 82% |

### 4. Vocabulary List

Mỗi vocabulary card hiển thị:

- Word
- Meaning
- Status

**Ví dụ:**

```text
accommodate
thích nghi, cung cấp đủ chỗ
Status: Learning
```

**Các trạng thái (Status):**

| Status | Mô tả |
|---|---|
| `New` | Chưa học |
| `Learning` | Đang học |
| `Mastered` | Đã thuộc |

### 5. Add Card

Button:

```text
+ Add card
```

> Workshop: chỉ cần tạo UI button.

### 6. Start Review

Button:

```text
Start Review
```

Chuyển màn hình khi click:

```text
Deck Detail
    ↓
Review Session
```

> Workshop: chưa xây Review Session.
