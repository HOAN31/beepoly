import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Deck } from '../types/deck';

export class DeckService {
  /**
   * Truy vấn danh sách bộ thẻ từ vựng từ bảng `bo_the_tu_vung` trong PostgreSQL Supabase
   */
  static async fetchDecks(): Promise<Deck[] | null> {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    try {
      const client = supabase;
      const { data: dbDecks, error } = await client
        .from('bo_the_tu_vung')
        .select('*')
        .order('ngay_tao', { ascending: false });

      if (error) {
        console.error('Lỗi khi tải bộ thẻ từ Supabase:', error);
        return null;
      }

      if (!dbDecks || dbDecks.length === 0) return [];

      // Mapping từ schema SQL sang kiểu dữ liệu Deck UI
      const decks: Deck[] = await Promise.all(
        dbDecks.map(async (row) => {
          const { data: cards } = await client
            .from('the_tu_vung')
            .select('*')
            .eq('bo_the_id', row.id);

          const cardCount = cards ? cards.length : 0;
          const dateStr = new Date(row.ngay_tao).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          return {
            id: row.id,
            title: row.tieu_de || 'Untitled Deck',
            created: `Created ${dateStr}`,
            cards: cardCount,
            mastered: 0,
            theme: 'theme-blue',
            icon: 'book',
            complete: false,
            stats: {
              total: cardCount,
              mastered: 0,
              learning: cardCount,
              new: 0,
              accuracy: '0%'
            }
          };
        })
      );

      return decks;
    } catch (err) {
      console.error('Supabase fetch exception:', err);
      return null;
    }
  }

  /**
   * Tạo bộ thẻ mới trong bảng `bo_the_tu_vung`
   */
  static async createDeck(title: string, userId: number = 1): Promise<number | null> {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('bo_the_tu_vung')
        .insert([
          {
            tieu_de: title,
            nguoi_dung_id: userId,
            is_auto_generated: false
          }
        ])
        .select('id')
        .single();

      if (error) {
        console.error('Lỗi khi tạo bộ thẻ mới trên Supabase:', error);
        return null;
      }

      return data?.id || null;
    } catch (err) {
      console.error('Supabase insert deck exception:', err);
      return null;
    }
  }

  /**
   * Xóa bộ thẻ trong bảng `bo_the_tu_vung`
   */
  static async deleteDeck(deckId: number): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('bo_the_tu_vung')
        .delete()
        .eq('id', deckId);

      if (error) {
        console.error('Lỗi khi xóa bộ thẻ trên Supabase:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Supabase delete deck exception:', err);
      return false;
    }
  }

  /**
   * Thêm thẻ từ vựng mới vào bảng `the_tu_vung`
   */
  static async createFlashcard(deckId: number, question: string, answer: string): Promise<number | null> {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('the_tu_vung')
        .insert([
          {
            bo_the_id: deckId,
            tu: question,
            nghia: answer
          }
        ])
        .select('id')
        .single();

      if (error) {
        console.error('Lỗi khi thêm từ vựng vào Supabase:', error);
        return null;
      }

      return data?.id || null;
    } catch (err) {
      console.error('Supabase insert flashcard exception:', err);
      return null;
    }
  }
}
