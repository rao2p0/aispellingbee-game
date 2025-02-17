
import words from "an-array-of-english-words/index.json" assert { type: "json" };
import wordfreq from 'wordfreq';

export class Dictionary {
  private static instance: Dictionary;
  private wordList: Set<string>;
  private wordFreq: any;

  private constructor() {
    this.wordList = new Set(words);
    // Initialize wordfreq
    wordfreq({
      wordsPath: undefined,
      minimumFrequency: 1e-6
    }).then(wf => {
      this.wordFreq = wf;
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

    if (!this.wordFreq) return true; // Allow all words if wordfreq isn't loaded yet
    
    const freq = await this.wordFreq.getFreq([lowercaseWord]);
    const isFrequent = freq[lowercaseWord] > 0.00001; // Accept reasonably common words

    if (!isFrequent) {
      console.log(`Word ${lowercaseWord} rejected - frequency ${freq}`);
    }

    return isFrequent;
  }
}

export const dictionary = Dictionary.getInstance();
