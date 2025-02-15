import { puzzles, type Puzzle } from "@shared/schema";

// Common English consonants and vowels, weighted by frequency
const CONSONANTS = 'TNRSHDLCMFPGBVKWXQJZ';
const VOWELS = 'EAIOU';

// Dictionary class to handle word management
class GameDictionary {
  private words: Set<string>;

  constructor(wordList: string[]) {
    this.words = new Set(wordList.map(word => word.toLowerCase()));
  }

  isValidWord(word: string): boolean {
    const normalizedWord = word.toLowerCase();
    const isValid = this.words.has(normalizedWord);
    console.log(`Dictionary check for "${word}": ${isValid}`);
    return isValid;
  }

  filterValidWords(letters: string, centerLetter: string): string[] {
    console.log(`Filtering valid words for letters: ${letters}, center: ${centerLetter}`);
    return Array.from(this.words).filter(word =>
      this.isWordPossible(word, letters, centerLetter)
    );
  }

  private isWordPossible(word: string, letters: string, centerLetter: string): boolean {
    const normalizedWord = word.toLowerCase();
    const normalizedCenter = centerLetter.toLowerCase();
    const normalizedLetters = letters.toLowerCase();

    console.log(`\nChecking word "${word}":`);
    console.log(`- Available letters: ${normalizedLetters} (center: ${normalizedCenter})`);

    // Word must be at least 4 letters long
    if (normalizedWord.length < 4) {
      console.log(`- Rejected: too short (${normalizedWord.length} letters)`);
      return false;
    }

    // Word must contain the center letter
    if (!normalizedWord.includes(normalizedCenter)) {
      console.log(`- Rejected: missing center letter ${normalizedCenter}`);
      return false;
    }

    // Create letter frequency map for available letters
    const availableLetters = new Map<string, number>();

    // Add regular letters
    normalizedLetters.split('').forEach(letter => {
      availableLetters.set(letter, (availableLetters.get(letter) || 0) + 1);
    });

    // Center letter can be used multiple times, so give it a high count
    availableLetters.set(normalizedCenter, 999);

    console.log('- Available letter frequencies:', Object.fromEntries(availableLetters));

    // Count required letters in the word
    const wordFreq = new Map<string, number>();
    for (const char of normalizedWord) {
      wordFreq.set(char, (wordFreq.get(char) || 0) + 1);
    }

    // Check if we have enough of each letter
    let isValid = true;
    wordFreq.forEach((needed, char) => {
      const available = availableLetters.get(char) || 0;
      if (char !== normalizedCenter && needed > available) {
        console.log(`- Rejected: needs ${needed} of "${char}" but only have ${available}`);
        isValid = false;
      }
    });

    if (isValid) {
      console.log('- Word is valid!');
    }
    return isValid;
  }
}

// Initialize dictionary with common English words
const DICTIONARY = new GameDictionary([
  "able", "acid", "aged", "also", "area", "army", "away", "baby", "back", "ball",
  "band", "bank", "base", "bath", "nude", "bean", "bear", "beat", "beer", "bell",
  "belt", "bend", "bird", "blow", "blue", "boat", "body", "bomb", "bond", "bone",
  "book", "born", "both", "bowl", "bulk", "burn", "bush", "busy", "cake", "call",
  "calm", "came", "camp", "card", "care", "cart", "case", "cash", "cast", "cell",
  "chat", "chip", "city", "club", "coal", "coat", "code", "cold", "come", "cook",
  "cool", "cope", "copy", "core", "cost", "crew", "crop", "dark", "data", "date",
  "dawn", "days", "dead", "deal", "dear", "debt", "deep", "deny", "desk", "dial",
  "diet", "disc", "disk", "does", "done", "door", "dose", "down", "draw", "drew",
  "drop", "drug", "drum", "dual", "duke", "dust", "duty", "each", "earn", "ease",
  "east", "easy", "edge", "else", "even", "ever", "evil", "exit", "face", "fact",
  "fade", "fail", "fair", "fall", "fame", "farm", "fast", "fate", "fear", "feed",
  "feel", "feet", "fell", "felt", "file", "fill", "film", "find", "fine", "fire",
  "firm", "fish", "five", "flat", "flow", "fold", "folk", "food", "fool", "foot",
  "ford", "form", "fort", "four", "free", "from", "fuel", "full", "fund", "gain",
  "game", "gate", "gave", "gear", "gift", "girl", "give", "glad", "goal", "goes",
  "gold", "golf", "gone", "good", "gray", "grew", "grey", "grow", "gulf", "hair",
  "half", "hall", "hand", "hang", "hard", "harm", "hate", "have", "head", "hear",
  "heat", "held", "hell", "help", "here", "hero", "high", "hill", "hire", "hold",
  "hole", "holy", "home", "hope", "horn", "horse", "host", "hour", "huge", "hung",
  "hunt", "hurt", "idea", "inch", "into", "iron", "item", "jack", "join", "jump",
  "jury", "just", "keen", "keep", "kept", "kick", "kill", "kind", "king", "knee",
  "knew", "know", "lack", "lady", "laid", "lake", "land", "lane", "last", "late",
  "lead", "leaf", "lean", "left", "less", "life", "lift", "like", "line", "link",
  "list", "live", "load", "loan", "lock", "logo", "long", "look", "lord", "lose",
  "loss", "lost", "love", "luck", "made", "mail", "main", "make", "male", "many",
  "mark", "mask", "mass", "mate", "mayo", "meal", "mean", "meat", "meet", "menu",
  "mere", "mile", "milk", "mill", "mind", "mine", "miss", "mode", "mood", "moon",
  "more", "most", "move", "much", "must", "name", "navy", "near", "neck", "need",
  "news", "next", "nice", "nine", "none", "nose", "note", "okay", "once", "only",
  "onto", "open", "oral", "over", "pace", "pack", "page", "paid", "pain", "pair",
  "palm", "park", "part", "pass", "past", "path", "peak", "pick", "pink", "pipe",
  "plan", "play", "plot", "plus", "port", "post", "pull", "pure", "push", "race",
  "rail", "rain", "rank", "rare", "rate", "read", "real", "rear", "rest", "rice",
  "rich", "ride", "ring", "rise", "risk", "road", "rock", "role", "roll", "roof",
  "room", "root", "rose", "rule", "rush", "safe", "sage", "said", "sake", "sale", "salt",
  "same", "sand", "save", "seat", "seed", "seek", "seem", "seen", "self", "sell",
  "send", "sent", "sept", "ship", "shop", "shot", "show", "shut", "sick", "side",
  "sign", "site", "size", "skin", "slip", "slow", "snow", "soft", "soil", "sold",
  "sole", "some", "song", "soon", "sort", "soul", "spot", "star", "stay", "step",
  "stop", "such", "sure", "take", "tale", "talk", "tall", "tank", "tape", "task",
  "team", "tech", "tell", "tend", "term", "test", "text", "than", "that", "them",
  "then", "they", "thin", "this", "thus", "time", "tiny", "told", "tone", "tony",
  "took", "tool", "tour", "town", "tree", "trip", "true", "tune", "turn", "twin",
  "type", "unit", "upon", "used", "user", "vary", "vast", "very", "vice", "view",
  "vote", "wait", "wake", "walk", "wall", "want", "ward", "warm", "wash", "wave",
  "ways", "weak", "wear", "week", "well", "went", "were", "west", "what", "when",
  "whom", "wide", "wife", "wild", "will", "wind", "wine", "wing", "wire", "wise",
  "wish", "with", "wood", "word", "wore", "work", "yard", "yeah", "year", "your",
  "zero", "zone",
  // Common 5+ letter words
  "world", "house", "place", "group", "party", "money", "point", "state", "night",
  "water", "thing", "family", "heart", "question", "business", "president",
  "problem", "country", "example", "school", "number", "system", "social", "world",
  "story", "mother", "father", "friend", "truth", "power"
]);

export interface IStorage {
  getDailyPuzzle(): Promise<Puzzle>;
  generateNewPuzzle(): Promise<Puzzle>;
  validateWord(word: string, puzzleId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private puzzles: Map<number, Puzzle>;
  private currentPuzzleId: number;
  private lastLetters: string | null = null;
  private lastCenterLetter: string | null = null;

  constructor() {
    this.puzzles = new Map();
    this.currentPuzzleId = 1;
    this.generateNewPuzzle();
  }

  private generateLetterSet(): { letters: string; centerLetter: string; validWords: string[] } {
    let letters: string;
    let centerLetter: string;
    let attempts = 0;
    const maxAttempts = 50; // Reduced from 100 to prevent long loops
    let validWords: string[] = [];
    let bestAttempt: { letters: string; centerLetter: string; validWords: string[]; count: number } | null = null;

    console.log("Starting letter set generation...");

    while (attempts < maxAttempts) {
      const letterArray: string[] = [];

      // Ensure we have 2-3 vowels
      const numVowels = Math.floor(Math.random() * 2) + 2;
      const availableVowels = VOWELS.split('');
      for (let i = 0; i < numVowels; i++) {
        const index = Math.floor(Math.random() * availableVowels.length);
        const vowel = availableVowels.splice(index, 1)[0];
        letterArray.push(vowel);
      }

      // Fill the rest with consonants
      const availableConsonants = CONSONANTS.split('');
      while (letterArray.length < 6) {
        const index = Math.floor(Math.random() * availableConsonants.length);
        const consonant = availableConsonants.splice(index, 1)[0];
        letterArray.push(consonant);
      }

      letters = letterArray.sort(() => Math.random() - 0.5).join('');

      // Try center letters from both vowels and consonants
      for (const tryVowel of [true, false]) {
        const letterPool = tryVowel ? VOWELS : CONSONANTS;
        for (let i = 0; i < letterPool.length; i++) {
          centerLetter = letterPool[i];
          if (!letters.includes(centerLetter)) {
            validWords = DICTIONARY.filterValidWords(letters, centerLetter);
            console.log(`Attempt ${attempts + 1}: Letters=${letters}, Center=${centerLetter}, Words=${validWords.length}`);

            // Keep track of the best attempt
            if (!bestAttempt || validWords.length > bestAttempt.count) {
              bestAttempt = { letters, centerLetter, validWords, count: validWords.length };
            }

            if (validWords.length >= 15) {
              console.log(`Found valid set with ${validWords.length} words!`);
              return { letters, centerLetter, validWords };
            }
          }
        }
      }

      attempts++;
    }

    // If we couldn't find an ideal set, use the best attempt we found
    if (bestAttempt && bestAttempt.count > 0) {
      console.log(`Using best attempt with ${bestAttempt.count} words after ${attempts} attempts`);
      return {
        letters: bestAttempt.letters,
        centerLetter: bestAttempt.centerLetter,
        validWords: bestAttempt.validWords
      };
    }

    // This should rarely happen, but if it does, retry with fresh random letters
    console.log("Failed to generate valid letter set, retrying...");
    return this.generateLetterSet();
  }

  async generateNewPuzzle(): Promise<Puzzle> {
    console.log("Generating new puzzle...");
    this.puzzles.clear();

    const { letters, centerLetter, validWords } = this.generateLetterSet();
    console.log(`Generated puzzle: Letters=${letters}, Center=${centerLetter}, Words=${validWords.length}`);

    // Calculate total points
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

    this.puzzles.set(puzzle.id, puzzle);
    this.lastLetters = letters;
    this.lastCenterLetter = centerLetter;

    return puzzle;
  }

  async getDailyPuzzle(): Promise<Puzzle> {
    const puzzle = this.puzzles.get(this.currentPuzzleId - 1);
    if (!puzzle) {
      return this.generateNewPuzzle();
    }
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