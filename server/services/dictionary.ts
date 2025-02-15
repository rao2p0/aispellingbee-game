import { createHash } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

interface CacheEntry {
  isValid: boolean;
  timestamp: number;
}

export class DictionaryService {
  private cache: Map<string, CacheEntry>;
  private cacheExpiration: number; // milliseconds
  private retryAttempts: number = 3;
  private retryDelay: number = 1000; // 1 second
  private rateLimitDelay: number = 2000; // 2 seconds between requests
  private lastRequestTime: number = 0;

  constructor(cacheExpirationHours: number = 24) {
    this.cache = new Map();
    this.cacheExpiration = cacheExpirationHours * 60 * 60 * 1000;
    this.loadCache();
  }

  private getCacheKey(word: string): string {
    return createHash('md5').update(word.toLowerCase()).digest('hex');
  }

  private isCacheValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < this.cacheExpiration;
  }

  private async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();
  }

  private async loadCache() {
    try {
      const cacheFile = path.join(process.cwd(), 'dictionary_cache.json');
      const data = await fs.readFile(cacheFile, 'utf8');
      const cacheData = JSON.parse(data);
      this.cache = new Map(Object.entries(cacheData));
      console.log(`Loaded ${this.cache.size} entries from cache`);
    } catch (error) {
      console.log('No existing cache found, starting fresh');
    }
  }

  private async saveCache() {
    try {
      const cacheFile = path.join(process.cwd(), 'dictionary_cache.json');
      const cacheData = Object.fromEntries(this.cache);
      await fs.writeFile(cacheFile, JSON.stringify(cacheData, null, 2));
    } catch (error) {
      console.error('Failed to save cache:', error);
    }
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

    // Basic validation before API call
    if (!/^[a-zA-Z]+$/.test(normalizedWord) || normalizedWord.length < 4) {
      console.log(`Quick reject for "${word}": invalid format`);
      return false;
    }

    // Common English words - quick accept
    const commonWords = new Set(['tail', 'tale', 'sail', 'sale', 'seat', 'east', 'late', 'take']);
    if (commonWords.has(normalizedWord)) {
      console.log(`Quick accept for common word "${word}"`);
      this.cache.set(cacheKey, { isValid: true, timestamp: Date.now() });
      return true;
    }

    // Implement retry mechanism with rate limiting
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        await this.waitForRateLimit();
        console.log(`Attempting to validate word "${word}" (attempt ${attempt}/${this.retryAttempts})`);
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${normalizedWord}`);

        console.log(`API response status for "${word}": ${response.status}`);

        if (response.status === 429) {
          // Rate limited - increase delay and retry
          this.rateLimitDelay *= 2;
          if (attempt < this.retryAttempts) {
            await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
            continue;
          }
        }

        const isValid = response.status === 200;
        this.cache.set(cacheKey, { isValid, timestamp: Date.now() });
        await this.saveCache();

        console.log(`Word "${word}" validation result: ${isValid}`);
        return isValid;

      } catch (error) {
        console.error(`Error validating word "${word}" (attempt ${attempt}):`, error);

        if (attempt === this.retryAttempts) {
          // Final attempt failed - use length-based fallback
          const isValid = word.length >= 4;
          console.log(`API failed, fallback validation for "${word}": ${isValid}`);
          this.cache.set(cacheKey, { isValid, timestamp: Date.now() });
          await this.saveCache();
          return isValid;
        }

        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
      }
    }

    return false;
  }

  clearCache() {
    this.cache.clear();
    this.saveCache();
  }
}

// Export singleton instance
export const dictionaryService = new DictionaryService();