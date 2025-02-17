
import twl from 'pytwl';

export class Dictionary {
  private static instance: Dictionary;
  private twlDict: any;

  private constructor() {
    this.twlDict = twl.Trie(true);
  }

  public static getInstance(): Dictionary {
    if (!Dictionary.instance) {
      Dictionary.instance = new Dictionary();
    }
    return Dictionary.instance;
  }

  public isValidWord(word: string): boolean {
    return this.twlDict.exists(word.toLowerCase());
  }
}

export const dictionary = Dictionary.getInstance();
