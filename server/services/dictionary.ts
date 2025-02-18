
import words from "an-array-of-english-words/index.json" assert { type: "json" };
import OpenAI from "openai";

export class Dictionary {
  private static instance: Dictionary;
  private wordList: Set<string>;
  private openai: OpenAI;

  private constructor() {
    this.wordList = new Set(words);
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  public static getInstance(): Dictionary {
    if (!Dictionary.instance) {
      Dictionary.instance = new Dictionary();
    }
    return Dictionary.instance;
  }

  private async askGpt4ValidWord(wordList: string[]): Promise<boolean[]> {
    const prompt = `Below is a list of words in English. For each word, please determine its frequency of use in modern English. Output 0 if the word is archaic, obsolete, or extremely rare in contemporary usage. Output 1 if the word is commonly used in general writing, speech, or specialized domains. Consider linguistic corpora, modern dictionaries, and real-world usage to make this determination. Do not provide explanations—only return 0 or 1. Return your answer as a comma separated list. Do not include anything besides '1', '0', ',' in your answer.\n\n${wordList.join(", ")}`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0,
    });

    const result = response.choices[0].message.content;
    if (!result) return wordList.map(() => false);
    
    return result.split(",").map(val => val.trim() === "1");
  }

  private async validateWordsWithGPT(words: string[]): Promise<string[]> {
    // Process in chunks of 50 words to avoid token limits
    const chunkSize = 50;
    const validWords: string[] = [];

    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize);
      const validations = await this.askGpt4ValidWord(chunk);
      
      chunk.forEach((word, index) => {
        if (validations[index]) {
          validWords.push(word);
        }
      });
    }

    return validWords;
  }

  public async isValidWord(word: string): Promise<boolean> {
    const lowercaseWord = word.toLowerCase();
    return this.wordList.has(lowercaseWord);
  }
}

export const dictionary = Dictionary.getInstance();
