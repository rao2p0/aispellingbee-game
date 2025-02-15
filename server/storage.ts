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
    return this.words.has(word.toLowerCase());
  }

  filterValidWords(letters: string, centerLetter: string): string[] {
    const normalizedLetters = letters.toLowerCase();
    const normalizedCenter = centerLetter.toLowerCase();

    return Array.from(this.words).filter(word => {
      // Word must be at least 4 letters long and contain the center letter
      if (word.length < 4) return false;
      if (!word.includes(normalizedCenter)) return false;

      // Create letter frequency map for the word
      const letterCount = new Map<string, number>();
      for (const letter of word) {
        letterCount.set(letter, (letterCount.get(letter) || 0) + 1);
      }

      // Check if each letter in the word can be formed using available letters
      for (const [letter, count] of letterCount.entries()) {
        if (letter === normalizedCenter) continue; // Center letter can be used multiple times
        if (!normalizedLetters.includes(letter)) return false;

        // Count occurrences of the letter in available letters
        const availableCount = normalizedLetters.split('').filter(l => l === letter).length;
        if (count > availableCount) return false;
      }

      return true;
    });
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

  constructor() {
    this.puzzles = new Map();
    this.currentPuzzleId = 1;
    this.generateNewPuzzle();
  }

  private generateLetterSet(): { letters: string; centerLetter: string; validWords: string[] } {
    // Try only 20 attempts max
    const attempts = 20;
    let bestAttempt: { letters: string; centerLetter: string; validWords: string[]; count: number } | null = null;

    for (let i = 0; i < attempts; i++) {
      // Add 2-3 vowels
      const letterArray: string[] = [];
      const numVowels = Math.floor(Math.random() * 2) + 2;
      const availableVowels = VOWELS.split('');
      for (let j = 0; j < numVowels; j++) {
        const index = Math.floor(Math.random() * availableVowels.length);
        letterArray.push(availableVowels.splice(index, 1)[0]);
      }

      // Fill rest with consonants
      const availableConsonants = CONSONANTS.split('');
      while (letterArray.length < 6) {
        const index = Math.floor(Math.random() * availableConsonants.length);
        letterArray.push(availableConsonants.splice(index, 1)[0]);
      }

      const letters = letterArray.sort(() => Math.random() - 0.5).join('');

      // Try both vowels and consonants as center letters
      for (const isVowel of [true, false]) {
        const letterPool = isVowel ? VOWELS : CONSONANTS;
        const centerLetter = letterPool[Math.floor(Math.random() * letterPool.length)];

        if (!letters.includes(centerLetter)) {
          const validWords = DICTIONARY.filterValidWords(letters, centerLetter);

          if (!bestAttempt || validWords.length > bestAttempt.count) {
            bestAttempt = { letters, centerLetter, validWords, count: validWords.length };
            // Accept any puzzle with at least 10 valid words
            if (validWords.length >= 10) {
              return bestAttempt;
            }
          }
        }
      }
    }

    // Use the best attempt we found, or fall back to a default set
    if (bestAttempt && bestAttempt.count > 0) {
      return bestAttempt;
    }

    // Fallback to a guaranteed valid set
    return {
      letters: "AEILNS",
      centerLetter: "T",
      validWords: DICTIONARY.filterValidWords("AEILNS", "T")
    };
  }

  async generateNewPuzzle(): Promise<Puzzle> {
    this.puzzles.clear();

    const { letters, centerLetter, validWords } = this.generateLetterSet();
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
    const normalizedPuzzleLetters = puzzle.letters.toLowerCase();
    const normalizedCenterLetter = puzzle.centerLetter.toLowerCase();

    // Check if the word is in the valid words list
    return puzzle.validWords.includes(normalizedWord);
  }
}

export const storage = new MemStorage();