const express = require('express');
const router = express.Router();
const { supabase, isConfigured } = require('../config/db');

// In-memory fallback mock data if Database API key is not configured
let mockDecks = [
  {
    id: 1,
    title: 'English Vocabulary',
    created: 'Created Mar 14, 2026',
    cards: 120,
    mastered: 75,
    theme: 'theme-blue',
    icon: 'book',
    complete: false,
    stats: { total: 120, mastered: 62, learning: 28, new: 30, accuracy: '82%' }
  },
  {
    id: 2,
    title: 'Java OOP',
    created: 'Created Apr 2, 2026',
    cards: 85,
    mastered: 30,
    theme: 'theme-green',
    icon: 'chart',
    complete: false,
    stats: { total: 85, mastered: 25, learning: 40, new: 20, accuracy: '65%' }
  },
  {
    id: 3,
    title: 'Database SQL',
    created: 'Created Apr 18, 2026',
    cards: 60,
    mastered: 10,
    theme: 'theme-yellow',
    icon: 'graduation',
    complete: false,
    stats: { total: 60, mastered: 6, learning: 24, new: 30, accuracy: '50%' }
  },
  {
    id: 4,
    title: 'Business Emails',
    created: 'Created May 6, 2026',
    cards: 48,
    mastered: 100,
    theme: 'theme-purple',
    icon: 'language',
    complete: true,
    stats: { total: 48, mastered: 48, learning: 0, new: 0, accuracy: '98%' }
  },
  {
    id: 5,
    title: 'Travel English',
    created: 'Created May 21, 2026',
    cards: 36,
    mastered: 100,
    theme: 'theme-emerald',
    icon: 'code',
    complete: true,
    stats: { total: 36, mastered: 36, learning: 0, new: 0, accuracy: '95%' }
  },
  {
    id: 6,
    title: 'IELTS Speaking',
    created: 'Created Jun 9, 2026',
    cards: 200,
    mastered: 45,
    theme: 'theme-orange',
    icon: 'sound',
    complete: false,
    stats: { total: 200, mastered: 90, learning: 60, new: 50, accuracy: '78%' }
  },
  {
    id: 7,
    title: 'French Basics',
    created: 'Created Jul 3, 2026',
    cards: 80,
    mastered: 60,
    theme: 'theme-blue',
    icon: 'book',
    complete: false,
    stats: { total: 80, mastered: 48, learning: 20, new: 12, accuracy: '80%' }
  },
  {
    id: 8,
    title: 'Machine Learning',
    created: 'Created Aug 15, 2026',
    cards: 95,
    mastered: 85,
    theme: 'theme-green',
    icon: 'chart',
    complete: false,
    stats: { total: 95, mastered: 80, learning: 10, new: 5, accuracy: '92%' }
  }
];

let mockFlashcards = [
  { id: 1, deckId: 1, question: 'accommodate', answer: 'thích nghi, cung cấp đủ chỗ', status: 'Learning' },
  { id: 2, deckId: 1, question: 'mitigate', answer: 'giảm nhẹ, làm giảm tác hại', status: 'New' },
  { id: 3, deckId: 1, question: 'resilient', answer: 'kiên cường, có khả năng phục hồi', status: 'Mastered' },
  { id: 4, deckId: 1, question: 'prerequisite', answer: 'điều kiện tiên quyết', status: 'Learning' },
  { id: 5, deckId: 1, question: 'coherent', answer: 'mạch lạc, chặt chẽ', status: 'Mastered' },
  { id: 6, deckId: 1, question: 'proficient', answer: 'thành thạo, có năng lực', status: 'New' },
  { id: 7, deckId: 1, question: 'substantial', answer: 'đáng kể, quan trọng', status: 'Learning' },
  { id: 8, deckId: 1, question: 'consecutive', answer: 'liên tiếp', status: 'Mastered' },
  { id: 9, deckId: 1, question: 'ambiguous', answer: 'mơ hồ, không rõ nghĩa', status: 'New' },
  { id: 10, deckId: 1, question: 'comprehensive', answer: 'toàn diện, bao quát', status: 'Learning' }
];

/**
 * GET /api/decks
 * Lấy toàn bộ bộ thẻ từ vựng (từ bảng bo_the_tu_vung hoặc mock data)
 */
router.get('/decks', async (req, res) => {
  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bo_the_tu_vung')
        .select('*')
        .order('ngay_tao', { ascending: false });

      if (error) throw error;
      return res.json({ success: true, source: 'database', data });
    } catch (err) {
      console.error('Error fetching decks from database:', err);
    }
  }

  res.json({ success: true, source: 'mock', data: mockDecks });
});

/**
 * POST /api/decks
 * Tạo mới một bộ thẻ từ vựng
 */
router.post('/decks', async (req, res) => {
  const { title, theme } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bo_the_tu_vung')
        .insert([{ tieu_de: title, nguoi_dung_id: 1 }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ success: true, source: 'database', data });
    } catch (err) {
      console.error('Error creating deck in database:', err);
    }
  }

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const newDeck = {
    id: Date.now(),
    title,
    created: `Created ${dateStr}`,
    cards: 0,
    mastered: 0,
    theme: theme || 'theme-blue',
    icon: 'book',
    complete: false,
    stats: { total: 0, mastered: 0, learning: 0, new: 0, accuracy: '0%' }
  };

  mockDecks.unshift(newDeck);
  res.status(201).json({ success: true, source: 'mock', data: newDeck });
});

/**
 * DELETE /api/decks/:id
 * Xóa một bộ thẻ từ vựng
 */
router.delete('/decks/:id', async (req, res) => {
  const deckId = Number(req.params.id);

  if (isConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('bo_the_tu_vung')
        .delete()
        .eq('id', deckId);

      if (error) throw error;
      return res.json({ success: true, message: 'Deck deleted from database' });
    } catch (err) {
      console.error('Error deleting deck from database:', err);
    }
  }

  mockDecks = mockDecks.filter(d => d.id !== deckId);
  mockFlashcards = mockFlashcards.filter(f => f.deckId !== deckId);
  res.json({ success: true, message: 'Deck deleted from mock store' });
});

/**
 * GET /api/decks/:deckId/cards
 * Lấy danh sách thẻ từ vựng thuộc về bộ thẻ (bảng the_tu_vung)
 */
router.get('/decks/:deckId/cards', async (req, res) => {
  const deckId = Number(req.params.deckId);

  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('the_tu_vung')
        .select('*')
        .eq('bo_the_id', deckId);

      if (error) throw error;
      return res.json({ success: true, source: 'database', data });
    } catch (err) {
      console.error('Error fetching cards from database:', err);
    }
  }

  const cards = mockFlashcards.filter(f => f.deckId === deckId);
  res.json({ success: true, source: 'mock', data: cards });
});

/**
 * POST /api/decks/:deckId/cards
 * Thêm một thẻ từ vựng mới vào bộ thẻ
 */
router.post('/decks/:deckId/cards', async (req, res) => {
  const deckId = Number(req.params.deckId);
  const { question, answer, status } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ success: false, message: 'Question and answer are required' });
  }

  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('the_tu_vung')
        .insert([{ bo_the_id: deckId, tu: question, nghia: answer }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ success: true, source: 'database', data });
    } catch (err) {
      console.error('Error creating card in database:', err);
    }
  }

  const newCard = {
    id: Date.now(),
    deckId,
    question,
    answer,
    status: status || 'New'
  };

  mockFlashcards.unshift(newCard);
  res.status(201).json({ success: true, source: 'mock', data: newCard });
});

module.exports = router;
