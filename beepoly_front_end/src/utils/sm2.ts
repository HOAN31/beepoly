/**
 * Thuật toán Ôn tập Ngắt quãng SuperMemo 2 (SM-2 Algorithm)
 * -------------------------------------------------------------------------
 * Hỗ trợ 4 mức đánh giá (q - rating):
 * - Again (0): Quên hoàn toàn hoặc sai. Reset interval = 1 ngày, giảm easeFactor.
 * - Hard  (3): Trả lời đúng nhưng khó suy nghĩ. Interval tăng nhẹ, giảm easeFactor 0.15.
 * - Good  (4): Trả lời đúng bình thường. Interval tăng theo easeFactor chuẩn.
 * - Easy  (5): Trả lời đúng rất nhanh. Interval tăng x1.3, tăng easeFactor 0.15.
 */

export type SM2Rating = 'again' | 'hard' | 'good' | 'easy';

export interface SM2Input {
  repetitions: number; // Số lần ôn tập thành công liên tiếp
  easeFactor: number;  // Hệ số độ dễ (Mặc định: 2.5, Tối thiểu: 1.30)
  interval: number;    // Khoảng cách ngày đến lần ôn tới
}

export interface SM2Output {
  repetitions: number;
  easeFactor: number;
  interval: number;
  nextReviewDate: Date;
}

export function calculateSM2(input: SM2Input, rating: SM2Rating): SM2Output {
  let { repetitions, easeFactor, interval } = input;

  // Chuyển rating dạng chuỗi sang điểm số q (0..5)
  let q = 4; // Default Good
  if (rating === 'again') q = 0;
  if (rating === 'hard') q = 3;
  if (rating === 'good') q = 4;
  if (rating === 'easy') q = 5;

  // 1. Cập nhật hệ số độ dễ (Ease Factor - EF)
  // Công thức: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  let newEaseFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (newEaseFactor < 1.30) {
    newEaseFactor = 1.30;
  }
  // Giới hạn max ease factor 3.00
  if (newEaseFactor > 3.00) {
    newEaseFactor = 3.00;
  }

  // 2. Cập nhật số lần lặp (Repetitions) & Khoảng cách ngày (Interval)
  let newRepetitions = repetitions;
  let newInterval = interval;

  if (q < 3) {
    // Rating = Again (Trả lời sai)
    newRepetitions = 0;
    newInterval = 1; // Ôn lại vào ngày tiếp theo
  } else {
    // Trả lời đúng (Hard, Good, Easy)
    newRepetitions += 1;

    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEaseFactor);
    }

    // Thưởng x1.3 interval cho Easy
    if (rating === 'easy') {
      newInterval = Math.round(newInterval * 1.3);
    }
  }

  // 3. Tính ngày giờ ôn tập tiếp theo
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    repetitions: newRepetitions,
    easeFactor: Number(newEaseFactor.toFixed(2)),
    interval: newInterval,
    nextReviewDate
  };
}
