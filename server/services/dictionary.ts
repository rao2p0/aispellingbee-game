
import wordfreq from 'wordfreq';
import words from 'an-array-of-english-words/index.json' assert { type: 'json' };

export class Dictionary {
  private static instance: Dictionary;
  private wordList: Set<string>;
  private wordFreq: any;
  
  private constructor() {
    this.wordList = new Set(words);
    this.wordFreq = new wordfreq({
      language: 'english',
      minimumFrequency: 1e-5  // Filter out more rare words
    });
  }

  public static getInstance(): Dictionary {
    if (!Dictionary.instance) {
      Dictionary.instance = new Dictionary();
    }
    return Dictionary.instance;
  }

  public async isValidWord(word: string): Promise<boolean> {
    const lowercaseWord = word.toLowerCase();
    if (!this.wordList.has(lowercaseWord)) {
      return false;
    }
    
    const freq = await this.wordFreq.getFrequency(lowercaseWord);
    return freq > 1e-5; // Only accept words above our increased frequency threshold
  }
}

export const dictionary = Dictionary.getInstance();
