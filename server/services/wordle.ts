import words from "an-array-of-english-words";

// Filter to get only 5-letter words
const FIVE_LETTER_WORDS = words.filter(word => 
  word.length === 5 && 
  /^[a-z]+$/.test(word) && 
  !word.endsWith('s')  // To reduce plurals
).map(word => word.toUpperCase());

class WordleService {
  private getDailyWordIndex(): number {
    // Based on days since Jan 1, 2023
    const start = new Date(2023, 0, 1).getTime();
    const today = new Date().setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    return daysDiff % FIVE_LETTER_WORDS.length;
  }

  getDailyWord(): string {
    return FIVE_LETTER_WORDS[this.getDailyWordIndex()];
  }

  isValidWord(word: string): boolean {
    return FIVE_LETTER_WORDS.includes(word.toUpperCase());
  }

  // For testing purposes
  getRandomWord(): string {
    const randomIndex = Math.floor(Math.random() * FIVE_LETTER_WORDS.length);
    return FIVE_LETTER_WORDS[randomIndex];
  }
}

export const wordleService = new WordleService();