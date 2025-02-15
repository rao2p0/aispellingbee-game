import { puzzles, type Puzzle } from "@shared/schema";

// Common English consonants and vowels, weighted by frequency
const CONSONANTS = 'TNRSHDLCMFPGBVKWXQJZ';
const VOWELS = 'EAIOU';

// A curated dictionary of common English words
const DICTIONARY = new Set([
  // Common 4-letter words
  "able", "acid", "aged", "also", "area", "army", "away", "baby", "back", "ball", "band", "bank", "base", "bath",
  "bean", "bear", "beat", "beer", "bell", "belt", "bend", "bird", "blow", "blue", "boat", "body", "bomb", "bond",
  "bone", "book", "born", "both", "bowl", "bulk", "burn", "bush", "busy", "cake", "call", "calm", "came", "camp",
  "card", "care", "cart", "case", "cash", "cast", "cell", "chat", "chip", "city", "club", "coal", "coat", "code",
  "cold", "come", "cook", "cool", "cope", "copy", "core", "cost", "crew", "crop", "dark", "data", "date", "dawn",
  "days", "dead", "deal", "dear", "debt", "deep", "deny", "desk", "dial", "diet", "disc", "disk", "does", "done",
  "door", "dose", "down", "draw", "drew", "drop", "drug", "drum", "dual", "duke", "dust", "duty", "each", "earn",
  "ease", "east", "easy", "edge", "else", "even", "ever", "evil", "exit", "face", "fact", "fade", "fail", "fair",
  "fall", "fame", "farm", "fast", "fate", "fear", "feed", "feel", "feet", "fell", "felt", "file", "fill", "film",
  "find", "fine", "fire", "firm", "fish", "five", "flat", "flow", "fold", "folk", "food", "fool", "foot", "ford",
  "form", "fort", "four", "free", "from", "fuel", "full", "fund", "gain", "game", "gate", "gave", "gear", "gift",
  "girl", "give", "glad", "goal", "goes", "gold", "golf", "gone", "good", "gray", "grew", "grey", "grow", "gulf",
  "hair", "half", "hall", "hand", "hang", "hard", "harm", "hate", "have", "head", "hear", "heat", "held", "hell",
  "help", "here", "hero", "high", "hill", "hire", "hold", "hole", "holy", "home", "hope", "horn", "horse", "host",
  "hour", "huge", "hung", "hunt", "hurt", "idea", "inch", "into", "iron", "item", "jack", "join", "jump", "jury",
  "just", "keen", "keep", "kept", "kick", "kill", "kind", "king", "knee", "knew", "know", "lack", "lady", "laid",
  "lake", "land", "lane", "last", "late", "lead", "leaf", "lean", "left", "less", "life", "lift", "like", "line",
  "link", "list", "live", "load", "loan", "lock", "logo", "long", "look", "lord", "lose", "loss", "lost", "love",
  "luck", "made", "mail", "main", "make", "male", "many", "mark", "mask", "mass", "mate", "mayo", "meal", "mean",
  "meat", "meet", "menu", "mere", "mile", "milk", "mill", "mind", "mine", "miss", "mode", "mood", "moon", "more",
  "most", "move", "much", "must", "name", "navy", "near", "neck", "need", "news", "next", "nice", "nine", "none",
  "nose", "note", "okay", "once", "only", "onto", "open", "oral", "over", "pace", "pack", "page", "paid", "pain",
  "pair", "palm", "park", "part", "pass", "past", "path", "peak", "pick", "pink", "pipe", "plan", "play", "plot",
  "plus", "port", "post", "pull", "pure", "push", "race", "rail", "rain", "rank", "rare", "rate", "read", "real",
  "rear", "rest", "rice", "rich", "ride", "ring", "rise", "risk", "road", "rock", "role", "roll", "roof", "room",
  "root", "rose", "rule", "rush", "safe", "said", "sake", "sale", "salt", "same", "sand", "save", "seat", "seed",
  "seek", "seem", "seen", "self", "sell", "send", "sent", "sept", "ship", "shop", "shot", "show", "shut", "sick",
  "side", "sign", "site", "size", "skin", "slip", "slow", "snow", "soft", "soil", "sold", "sole", "some", "song",
  "soon", "sort", "soul", "spot", "star", "stay", "step", "stop", "such", "sure", "take", "tale", "talk", "tall",
  "tank", "tape", "task", "team", "tech", "tell", "tend", "term", "test", "text", "than", "that", "them", "then",
  "they", "thin", "this", "thus", "time", "tiny", "told", "tone", "tony", "took", "tool", "tour", "town", "tree",
  "trip", "true", "tune", "turn", "twin", "type", "unit", "upon", "used", "user", "vary", "vast", "very", "vice",
  "view", "vote", "wait", "wake", "walk", "wall", "want", "ward", "warm", "wash", "wave", "ways", "weak", "wear",
  "week", "well", "went", "were", "west", "what", "when", "whom", "wide", "wife", "wild", "will", "wind", "wine",
  "wing", "wire", "wise", "wish", "with", "wood", "word", "wore", "work", "yard", "yeah", "year", "your", "zero",
  "zone",
  // Common 5+ letter words
  "world", "house", "place", "group", "party", "money", "point", "state", "night", "water", "thing", "family",
  "heart", "question", "business", "president", "problem", "country", "example", "school", "number", "system",
  "social", "world", "story", "mother", "father", "friend", "truth", "power"
]);

export interface IStorage {
  getDailyPuzzle(): Promise<Puzzle>;
  generateNewPuzzle(): Promise<Puzzle>;
  validateWord(word: string, puzzleId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private puzzles: Map<number, Puzzle>;
  private currentPuzzleId: number;

  constructor() {
    this.puzzles = new Map();
    this.currentPuzzleId = 1;
    this.generateNewPuzzle();
  }

  private generateLetterSet(): string {
    const letters: string[] = [];

    // Add 2-3 vowels
    const numVowels = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < numVowels; i++) {
      const vowel = VOWELS[Math.floor(Math.random() * VOWELS.length)];
      if (!letters.includes(vowel)) {
        letters.push(vowel);
      }
    }

    // Fill the rest with consonants
    while (letters.length < 6) {
      const consonant = CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
      if (!letters.includes(consonant)) {
        letters.push(consonant);
      }
    }

    // Shuffle the array
    return letters.sort(() => Math.random() - 0.5).join('');
  }

  private findBestCenterLetter(letters: string): string {
    let bestLetter = letters[0];
    let maxWords = 0;

    // Try each letter as the center letter
    const allLetters = letters.split('');
    for (const letter of allLetters) {
      const wordCount = Array.from(DICTIONARY).filter(word =>
        word.toLowerCase().includes(letter.toLowerCase()) &&
        this.canMakeWordFromLetters(word, letters + letter)
      ).length;

      if (wordCount > maxWords) {
        maxWords = wordCount;
        bestLetter = letter;
      }
    }

    // If no good center letter found among existing letters, generate a new one
    if (maxWords < 5) {
      const newLetter = CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
      return newLetter;
    }

    return bestLetter;
  }

  private canMakeWordFromLetters(word: string, letters: string): boolean {
    const letterCounts = new Map<string, number>();
    letters.toLowerCase().split('').forEach(letter => {
      letterCounts.set(letter, (letterCounts.get(letter) || 0) + 1);
    });

    const wordLetters = word.toLowerCase().split('');
    for (const letter of wordLetters) {
      const count = letterCounts.get(letter) || 0;
      if (count === 0) return false;
      letterCounts.set(letter, count - 1);
    }

    return true;
  }

  private isWordPossible(word: string, letters: string, centerLetter: string): boolean {
    const normalizedWord = word.toLowerCase();

    // Word must be in dictionary
    if (!DICTIONARY.has(normalizedWord)) return false;

    // Word must be at least 4 letters long
    if (normalizedWord.length < 4) return false;

    // Word must contain the center letter
    if (!normalizedWord.includes(centerLetter.toLowerCase())) return false;

    return this.canMakeWordFromLetters(normalizedWord, letters + centerLetter);
  }

  async getDailyPuzzle(): Promise<Puzzle> {
    const puzzle = this.puzzles.get(this.currentPuzzleId - 1);
    if (!puzzle) {
      return this.generateNewPuzzle();
    }
    return puzzle;
  }

  async generateNewPuzzle(): Promise<Puzzle> {
    // Clear all previous puzzles
    this.puzzles.clear();

    let letters: string;
    let centerLetter: string;
    let validWords: string[];
    let attempts = 0;
    const maxAttempts = 10;

    // Keep generating until we get a good set of letters
    do {
      letters = this.generateLetterSet();
      centerLetter = this.findBestCenterLetter(letters);

      // Ensure center letter is not in the main letters
      if (letters.includes(centerLetter)) {
        letters = letters.replace(centerLetter, '');
      }

      validWords = Array.from(DICTIONARY).filter(word =>
        this.isWordPossible(word, letters, centerLetter)
      );

      attempts++;
      // If we've tried too many times, force a new set of letters
      if (attempts >= maxAttempts) {
        letters = this.generateLetterSet();
        centerLetter = VOWELS[Math.floor(Math.random() * VOWELS.length)];
        validWords = Array.from(DICTIONARY).filter(word =>
          this.isWordPossible(word, letters, centerLetter)
        );
        break;
      }
    } while (validWords.length < 10); // Ensure at least 10 valid words are possible

    // Calculate total possible points
    const points = validWords.reduce(
      (total, word) => total + Math.max(1, word.length - 3),
      0
    );

    const puzzle: Puzzle = {
      id: this.currentPuzzleId++,
      letters,
      centerLetter,
      validWords,
      points,
    };

    // Store the new puzzle with its ID
    this.puzzles.set(puzzle.id, puzzle);
    return puzzle;
  }

  async validateWord(word: string, puzzleId: number): Promise<boolean> {
    const puzzle = this.puzzles.get(puzzleId);
    if (!puzzle) return false;

    const normalizedWord = word.toLowerCase();
    return puzzle.validWords.includes(normalizedWord);
  }
}

export const storage = new MemStorage();