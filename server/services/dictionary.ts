import { createHash } from 'crypto';

interface CacheEntry {
  isValid: boolean;
  timestamp: number;
}

export class DictionaryService {
  private cache: Map<string, CacheEntry>;
  private cacheExpiration: number; // milliseconds
  private retryAttempts: number = 3;
  private retryDelay: number = 1000; // 1 second

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
      console.log(`Cache hit for "${word}": ${cachedResult.isValid}`);
      return cachedResult.isValid;
    }

    // Implement retry mechanism
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        console.log(`Attempting to validate word "${word}" (attempt ${attempt}/${this.retryAttempts})`);
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${normalizedWord}`);

        // Log the API response for debugging
        console.log(`API response status for "${word}": ${response.status}`);

        const isValid = response.status === 200;

        // Cache the result
        this.cache.set(cacheKey, {
          isValid,
          timestamp: Date.now()
        });

        console.log(`Word "${word}" validation result: ${isValid}`);
        return isValid;
      } catch (error) {
        console.error(`Error validating word "${word}" (attempt ${attempt}):`, error);

        if (attempt === this.retryAttempts) {
          // On final attempt failure, accept words of length >= 4 as valid
          // This ensures the game can continue if the API is down
          const isValid = word.length >= 4;
          console.log(`API failed, fallback validation for "${word}": ${isValid}`);

          this.cache.set(cacheKey, {
            isValid,
            timestamp: Date.now()
          });

          return isValid;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }

    return false;
  }

  clearCache() {
    this.cache.clear();
  }
}

// Export singleton instance
export const dictionaryService = new DictionaryService();