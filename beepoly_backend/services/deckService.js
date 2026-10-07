/**
 * Deck Service & Derivation Logic based on specs/ (entity-model.md & requirements.md)
 * 
 * Rules:
 * - Card Status:
 *   - New: No row in lich_su_on_the for (nguoi_dung_id, flashcard_id)
 *   - Learning: Row exists AND khoang_cach_ngay <= 21
 *   - Mastered: Row exists AND khoang_cach_ngay > 21
 * 
 * - Deck Derived Stats:
 *   - cardCount: total cards in deck
 *   - mastered: count of cards with status Mastered
 *   - learning: count of cards with status Learning
 *   - new: count of cards with status New
 *   - mastery: Math.round((mastered / cardCount) * 100) (0 if cardCount === 0)
 *   - accuracy: (cards with so_lan_sai = 0 / cards with review history) * 100
 *   - hasDueCards: >= 1 card New OR (Learning AND lan_on_tiep_theo <= now())
 *   - isFullyMastered: cardCount > 0 AND mastered === cardCount
 *   - estimatedTimeSeconds: cardCount * 20
 */

const { supabase, isConfigured } = require('../config/db');

// In-memory fallback mock storage when Supabase is not configured
let mockDecks = [
  { id: 1, nguoi_dung_id: 1, tieu_de: 'English Vocabulary', source_pdf_url: null, is_auto_generated: false, ngay_tao: '2026-03-14T08:00:00Z' },
  { id: 2, nguoi_dung_id: 1, tieu_de: 'Java OOP', source_pdf_url: null, is_auto_generated: false, ngay_tao: '2026-04-02T10:00:00Z' },
  { id: 3, nguoi_dung_id: 1, tieu_de: 'Database SQL', source_pdf_url: null, is_auto_generated: false, ngay_tao: '2026-04-18T14:30:00Z' },
  { id: 4, nguoi_dung_id: 1, tieu_de: 'Business Emails', source_pdf_url: null, is_auto_generated: false, ngay_tao: '2026-05-06T09:15:00Z' },
  { id: 5, nguoi_dung_id: 1, tieu_de: 'Travel English', source_pdf_url: null, is_auto_generated: false, ngay_tao: '2026-05-21T11:20:00Z' },
  { id: 6, nguoi_dung_id: 1, tieu_de: 'IELTS Speaking', source_pdf_url: null, is_auto_generated: false, ngay_tao: '2026-06-09T16:00:00Z' },
  { id: 7, nguoi_dung_id: 1, tieu_de: 'French Basics', source_pdf_url: null, is_auto_generated: false, ngay_tao: '2026-07-03T13:45:00Z' },
  { id: 8, nguoi_dung_id: 1, tieu_de: 'Machine Learning', source_pdf_url: null, is_auto_generated: false, ngay_tao: '2026-08-15T10:30:00Z' },
];

let mockCards = [
  { id: 1, bo_the_id: 1, tu: 'accommodate', nghia: 'thích nghi, cung cấp đủ chỗ', vi_du: 'The hotel can accommodate up to 500 guests.', duong_dan_am_thanh: null, ngay_tao: '2026-03-14T08:00:00Z' },
  { id: 2, bo_the_id: 1, tu: 'mitigate', nghia: 'giảm nhẹ, làm giảm tác hại', vi_du: 'Efforts were made to mitigate the environmental impact.', duong_dan_am_thanh: null, ngay_tao: '2026-03-14T08:05:00Z' },
  { id: 3, bo_the_id: 1, tu: 'resilient', nghia: 'kiên cường, có khả năng phục hồi', vi_du: 'Local communities are resilient in the face of adversity.', duong_dan_am_thanh: null, ngay_tao: '2026-03-14T08:10:00Z' },
  { id: 4, bo_the_id: 1, tu: 'prerequisite', nghia: 'điều kiện tiên quyết', vi_du: 'A degree is a prerequisite for this position.', duong_dan_am_thanh: null, ngay_tao: '2026-03-14T08:15:00Z' },
  { id: 5, bo_the_id: 1, tu: 'coherent', nghia: 'mạch lạc, chặt chẽ', vi_du: 'He proposed a coherent strategy for growth.', duong_dan_am_thanh: null, ngay_tao: '2026-03-14T08:20:00Z' },
  { id: 6, bo_the_id: 1, tu: 'proficient', nghia: 'thành thạo, có năng lực', vi_du: 'She is proficient in three languages.', duong_dan_am_thanh: null, ngay_tao: '2026-03-14T08:25:00Z' },
  { id: 7, bo_the_id: 1, tu: 'substantial', nghia: 'đáng kể, quan trọng', vi_du: 'The company made a substantial profit.', duong_dan_am_thanh: null, ngay_tao: '2026-03-14T08:30:00Z' },
  { id: 8, bo_the_id: 1, tu: 'consecutive', nghia: 'liên tiếp', vi_du: 'It rained for three consecutive days.', duong_dan_am_thanh: null, ngay_tao: '2026-03-14T08:35:00Z' },
  { id: 9, bo_the_id: 1, tu: 'ambiguous', nghia: 'mơ hồ, không rõ nghĩa', vi_du: 'The instructions were ambiguous.', duong_dan_am_thanh: null, ngay_tao: '2026-03-14T08:40:00Z' },
  { id: 10, bo_the_id: 1, tu: 'comprehensive', nghia: 'toàn diện, bao quát', vi_du: 'The report gives a comprehensive overview.', duong_dan_am_thanh: null, ngay_tao: '2026-03-14T08:45:00Z' },
];

let mockReviewLogs = [
  { nguoi_dung_id: 1, flashcard_id: 1, he_so_do_de: 2.5, khoang_cach_ngay: 10, lan_on_tiep_theo: '2026-10-01T00:00:00Z', so_lan_sai: 1 },
  { nguoi_dung_id: 1, flashcard_id: 3, he_so_do_de: 2.6, khoang_cach_ngay: 30, lan_on_tiep_theo: '2026-11-01T00:00:00Z', so_lan_sai: 0 },
  { nguoi_dung_id: 1, flashcard_id: 4, he_so_do_de: 2.3, khoang_cach_ngay: 5, lan_on_tiep_theo: '2026-10-05T00:00:00Z', so_lan_sai: 0 },
  { nguoi_dung_id: 1, flashcard_id: 5, he_so_do_de: 2.7, khoang_cach_ngay: 25, lan_on_tiep_theo: '2026-11-10T00:00:00Z', so_lan_sai: 0 },
  { nguoi_dung_id: 1, flashcard_id: 7, he_so_do_de: 2.4, khoang_cach_ngay: 14, lan_on_tiep_theo: '2026-10-02T00:00:00Z', so_lan_sai: 2 },
  { nguoi_dung_id: 1, flashcard_id: 8, he_so_do_de: 2.8, khoang_cach_ngay: 40, lan_on_tiep_theo: '2026-12-01T00:00:00Z', so_lan_sai: 0 },
  { nguoi_dung_id: 1, flashcard_id: 10, he_so_do_de: 2.2, khoang_cach_ngay: 7, lan_on_tiep_theo: '2026-10-08T00:00:00Z', so_lan_sai: 0 }
];

/**
 * Derive Card Status
 */
function deriveCardStatus(cardId, reviewLogs) {
  const log = reviewLogs.find(l => Number(l.flashcard_id) === Number(cardId));
  if (!log) return 'New';
  return log.khoang_cach_ngay > 21 ? 'Mastered' : 'Learning';
}

/**
 * Derive Deck Statistics
 */
function deriveDeckStats(deckId, cards, reviewLogs) {
  const deckCards = cards.filter(c => Number(c.bo_the_id) === Number(deckId));
  const total = deckCards.length;
  
  let masteredCount = 0;
  let learningCount = 0;
  let newCount = 0;
  let hasDueCards = false;
  let totalReviewed = 0;
  let zeroWrongCount = 0;

  const now = new Date();

  deckCards.forEach(card => {
    const status = deriveCardStatus(card.id, reviewLogs);
    const log = reviewLogs.find(l => Number(l.flashcard_id) === Number(card.id));

    if (status === 'Mastered') masteredCount++;
    else if (status === 'Learning') learningCount++;
    else newCount++;

    if (log) {
      totalReviewed++;
      if (log.so_lan_sai === 0) zeroWrongCount++;
      if (status === 'Learning' && log.lan_on_tiep_theo && new Date(log.lan_on_tiep_theo) <= now) {
        hasDueCards = true;
      }
    } else {
      // New cards are also due for review according to specs
      hasDueCards = true;
    }
  });

  const mastery = total > 0 ? Math.round((masteredCount / total) * 100) : 0;
  const accuracy = totalReviewed > 0 ? `${Math.round((zeroWrongCount / totalReviewed) * 100)}%` : '0%';
  const isFullyMastered = total > 0 && masteredCount === total;
  const estimatedTimeSeconds = total * 20;

  return {
    total,
    mastered: masteredCount,
    learning: learningCount,
    new: newCount,
    mastery,
    accuracy,
    hasDueCards,
    isFullyMastered,
    estimatedTimeSeconds
  };
}

module.exports = {
  mockDecks,
  mockCards,
  mockReviewLogs,
  deriveCardStatus,
  deriveDeckStats
};
