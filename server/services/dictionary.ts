
```typescript
import words from "an-array-of-english-words/index.json" assert { type: "json" };
import { WordFreq } from 'wordfreq';

export class Dictionary {
  private static instance: Dictionary;
  private wordList: Set<string>;
  private wordFreq: WordFreq;

  private constructor() {
    this.wordList = new Set(words);
    this.wordFreq = new WordFreq({
      wordsPath: undefined,
      minimumFrequency: 1e-6
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
    const isFrequent = freq > 0.2; // Only accept very common words (>20% frequency)
    
    if (!isFrequent) {
      console.log(`Word ${lowercaseWord} rejected - frequency ${freq};`);
    }
    
    return isFrequent;
  }
}

export const dictionary = Dictionary.getInstance();
```
