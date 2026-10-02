# Beepoly

Nền tảng học tiếng Anh toàn diện với AI, hỗ trợ người học từ A1 đến C2 thông qua flashcard thông minh, bài tập tương tác và phân tích tiến độ chi tiết.

## Tính năng chính (MVP)

### Flashcard & Từ vựng
- **Spaced Repetition (SM-2)** - Algorithm thông minh giúp ôn tập từ vựng đúng thời điểm
- **Quản lý bộ thẻ** - Tạo, chỉnh sửa và tổ chức từ vựng theo chủ đề
- **Import từ PDF** - Tự động trích xuất từ vựng từ file PDF
- **Theo dõi tiến độ** - Dashboard với streak, thống kê và biểu đồ radar kỹ năng

### Trải nghiệm học tập
- **4 mức đánh giá** - Again / Hard / Good / Easy cho mỗi flashcard
- **Streak tracking** - Theo dõi chuỗi ngày học liên tiếp
- **Dashboard trực quan** - Tổng quan số thẻ cần ôn, tỷ lệ thành thạo

### Tính năng tương lai
- AI Accent Training - Sửa lỗi phát âm chi tiết
- Debate AI - Tranh biện với AI
- Exam Simulator - Giả lập thi IELTS Speaking
- AR Vision - Từ điển thị giác qua camera
- Gamification với hệ thống bang hội và kinh tế ảo

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18+ with TypeScript |
| Bundler | Vite |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| State Management | Zustand |
| Routing | React Router |
| Date Handling | date-fns |

## Yêu cầu hệ thống

- Node.js 18+
- npm hoặc yarn
- Tài khoản Supabase (miễn phí)

## Hướng dẫn cài đặt

### 1. Clone và cài dependencies

```bash
git clone <repository-url>
cd beepoly
npm install
```

### 2. Cấu hình Supabase

Tạo file `.env` tại thư mục gốc:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Database

- Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard)
- Tạo project mới
- Vào SQL Editor và chạy file `beepoly.sql`
- Enable Row Level Security (RLS) cho các bảng

### 4. Chạy development server

```bash
npm run dev
```

Truy cập http://localhost:5173

## Cấu trúc dự án

```
beepoly/
├── src/
│   ├── components/        # UI components tái sử dụng
│   │   ├── AppShell       # Layout chính với navigation
│   │   ├── DashboardCards # Cards hiển thị thống kê
│   │   ├── DeckCard       # Card trong danh sách bộ thẻ
│   │   ├── FlashcardViewer # Component hiển thị flashcard
│   │   ├── ReviewControls # Nút đánh giá Again/Hard/Good/Easy
│   │   └── ReviewSummary  # Tóm tắt phiên học
│   │
│   ├── pages/             # Các trang chính
│   │   ├── DashboardPage  # Trang tổng quan
│   │   ├── DeckListPage   # Danh sách bộ thẻ
│   │   ├── DeckDetailPage # Chi tiết bộ thẻ
│   │   └── ReviewSessionPage # Phiên ôn tập
│   │
│   ├── stores/            # Zustand stores
│   │   ├── deckStore      # Quản lý decks & cards
│   │   ├── reviewStore    # Quản lý phiên review
│   │   └── statsStore     # Quản lý thống kê
│   │
│   ├── services/          # Supabase API calls
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Helper functions
│   │   └── sm2.ts         # SM-2 spaced repetition algorithm
│   └── hooks/             # Custom React hooks
│
├── specs/                 # Tài liệu specs
├── beepoly.sql            # PostgreSQL schema (chạy được trong Supabase SQL Editor)
├── beepoly.dbml           # DBML export cho dbdiagram.io (diagram trực quan)
└── beepoly_functional_analysis.md  # Phân tích chức năng hệ thống
```

## Database Schema

Các bảng chính:

- `nguoi_dung` - Thông tin người dùng
- `bo_the_tu_vung` - Bộ thẻ từ vựng
- `the_tu_vung` - Các thẻ từ vựng
- `lich_su_on_the` - Lịch sử ôn tập (dùng cho SM-2)
- `phien_hoc` - Phiên học
- `thong_ke_nguoi_dung` - Thống kê người dùng
- `diem_ky_nang` - Điểm kỹ năng ( Listening, Speaking, Reading, Writing)

## SM-2 Algorithm

Thuật toán spaced repetition giúp tối ưu thời gian ôn tập:

| Rating | Hành động |
|--------|-----------|
| Again | Reset interval, giảm ease factor |
| Hard | Giảm 20% interval, giảm ease factor nhẹ |
| Good | Tăng interval theo ease factor |
| Easy | Tăng interval 1.3x, tăng ease factor |

Xem chi tiết tại `src/utils/sm2.ts`

## Bản quyền

Dự án này thuộc quyền sở hữu của:

**Chuyên ngành Lập Trình Và Ứng Dụng (AI) - Bộ môn Công nghệ thông tin**
**Cao đẳng FPT Polytechnic Hà Nội**

© 2026 FPT Polytechnic. All rights reserved.


---

*Built with React, Supabase, and ❤️*
*FPT Polytechnic Hà Nội - Chuyên ngành AI*
