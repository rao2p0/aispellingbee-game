import words from "an-array-of-english-words/index.json" assert { type: "json" };

export class Dictionary {
  private static instance: Dictionary;
  private wordList: Set<string>;

  private constructor() {
    this.wordList = new Set(words);
  }

  public static getInstance(): Dictionary {
    if (!Dictionary.instance) {
      Dictionary.instance = new Dictionary();
    }
    return Dictionary.instance;
  }

  public async isValidWord(word: string): Promise<boolean> {
    const lowercaseWord = word.toLowerCase();
    return this.wordList.has(lowercaseWord);
  }
}

export const dictionary = Dictionary.getInstance();