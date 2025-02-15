import { createHash } from 'crypto';

interface CacheEntry {
  isValid: boolean;
  timestamp: number;
}

export class DictionaryService {
  private cache: Map<string, CacheEntry>;
  private cacheExpiration: number; // milliseconds

  constructor(cacheExpirationHours: number = 24) {
    this.cache = new Map();
    this.cacheExpiration = cacheExpirationHours * 60 * 60 * 1000;
  }

  private getCacheKey(word: string): string {
    return createHash('md5').update(word.toLowerCase()).digest('hex');
  }

  private isCacheValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < this.cacheExpiration;
  }

  async isValidWord(word: string): Promise<boolean> {
    const normalizedWord = word.toLowerCase();
    const cacheKey = this.getCacheKey(normalizedWord);
    
    // Check cache first
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult && this.isCacheValid(cachedResult)) {
      return cachedResult.isValid;
    }

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${normalizedWord}`);
      const isValid = response.status === 200;
      
      // Cache the result
      this.cache.set(cacheKey, {
        isValid,
        timestamp: Date.now()
      });

      return isValid;
    } catch (error) {
      console.error(`Error validating word "${word}":`, error);
      // In case of API failure, return true if word length >= 4
      // This is a fallback to ensure game can continue if API is down
      return word.length >= 4;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

// Export singleton instance
export const dictionaryService = new DictionaryService();
