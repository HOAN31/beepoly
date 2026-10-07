import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface PronunciationResult {
  score: number;
  wordResults: {
    word: string;
    correct: boolean;
    phonetic?: string;
    suggestion?: string;
  }[];
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export class AIService {
  /**
   * Phân tích và chấm điểm phát âm so với câu mẫu
   */
  static evaluatePronunciation(sampleText: string, spokenText: string): PronunciationResult {
    const sampleWords = sampleText.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    const spokenWords = spokenText.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);

    let matchCount = 0;
    const wordResults = sampleWords.map((word) => {
      const isMatched = spokenWords.includes(word);
      if (isMatched) matchCount++;

      return {
        word,
        correct: isMatched,
        phonetic: `/${word}/`,
        suggestion: isMatched ? undefined : `Stress syllable correctly: /${word}/`
      };
    });

    const score = sampleWords.length > 0 ? Math.round((matchCount / sampleWords.length) * 100) : 0;

    return {
      score,
      wordResults
    };
  }

  /**
   * Lưu kết quả luyện phát âm vào Supabase (bảng `lan_luyen_phat_am` & `loi_phat_am`)
   */
  static async savePronunciationAttempt(
    userId: number,
    sampleText: string,
    score: number
  ): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      const { data, error } = await supabase
        .from('lan_luyen_phat_am')
        .insert([
          {
            nguoi_dung_id: userId,
            van_ban_mau: sampleText,
            giong: 'tieng_anh_my',
            diem_tuong_dong: score
          }
        ])
        .select('id')
        .single();

      if (error) {
        console.error('Lỗi khi lưu lần luyện phát âm:', error);
        return false;
      }

      return Boolean(data?.id);
    } catch (err) {
      console.error('Exception khi lưu lần luyện phát âm:', err);
      return false;
    }
  }

  /**
   * Sinh phản hồi AI cho Debate AI hoặc IELTS Examiner
   */
  static generateAIResponse(mode: 'debate' | 'ielts', userMessage: string): string {
    const text = userMessage.toLowerCase();

    if (mode === 'debate') {
      if (text.includes('environment') || text.includes('climate')) {
        return "That's an interesting perspective! However, opponents argue that economic development must take priority in developing nations before strict environmental regulations can be enforced. How would you counter that argument using words like 'sustainable' or 'mitigate'?";
      }
      if (text.includes('technology') || text.includes('ai')) {
        return "While technology boosts productivity, critics point out it significantly increases unemployment and digital addiction. What evidence can you provide to demonstrate that automation brings more 'substantial' benefits than harm?";
      }
      return "I appreciate your point, but to strengthen your argument in a formal debate, you should employ more advanced vocabulary such as 'prerequisite' or 'coherent'. Can you elaborate on your main thesis?";
    } else {
      // IELTS Speaking Examiner mode
      if (text.length < 20) {
        return "Thank you. Could you expand a bit more on your answer? In IELTS Speaking Part 2, examiners look for fluency, range of vocabulary, and detailed explanations.";
      }
      return "Excellent answer with strong vocabulary! Now let's move to Part 3. Do you think modern technology has changed the way people communicate in your hometown compared to ten years ago?";
    }
  }
}
