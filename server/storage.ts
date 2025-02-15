import { puzzles, type Puzzle } from "@shared/schema";

// Common English consonants and vowels, weighted by frequency
const CONSONANTS = 'TNRSHDLCMFPGBVKWXQJZ';
const VOWELS = 'EAIOU';

// Dictionary class to handle word management
class GameDictionary {
  private words: Set<string>;

  constructor(wordList: string[]) {
    this.words = new Set(wordList.map(word => word.toLowerCase()));
    console.log(`Dictionary initialized with ${this.words.size} words`);
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
      if (needed > available) {
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
  // 4 letter words
  "able", "ache", "acid", "aged", "aide", "aide", "also", "apex", "arch", "army",
  "aunt", "auto", "away", "axis", "baby", "back", "bail", "bait", "bake", "ball",
  "band", "bang", "bank", "bare", "bark", "barn", "base", "bath", "bead", "beam",
  "bean", "bear", "beat", "beef", "been", "beer", "bell", "belt", "bend", "bent",
  "best", "bias", "bike", "bind", "bird", "bite", "blow", "blue", "boat", "body",
  "bold", "bolt", "bond", "bone", "book", "boom", "born", "boss", "both", "bowl",
  "bulk", "bull", "burn", "bush", "busy", "cafe", "cage", "cake", "call", "calm",
  "came", "camp", "cane", "cape", "card", "care", "cart", "case", "cash", "cast",
  "cave", "cell", "cent", "chai", "chat", "chip", "cite", "city", "clad", "clan",
  "clay", "clip", "club", "clue", "coal", "coat", "code", "coil", "coin", "cold",
  "come", "cook", "cool", "cope", "copy", "cord", "core", "corn", "cost", "crew",
  "crop", "cube", "cure", "cute", "dale", "dame", "damp", "dare", "dark", "dart",
  "dash", "data", "date", "dawn", "days", "dead", "deaf", "deal", "dean", "dear",
  "debt", "deck", "deep", "deer", "deny", "desk", "dial", "dice", "diet", "dine",
  "dirt", "disc", "disk", "dive", "dock", "does", "dome", "done", "doom", "door",
  "dose", "dove", "down", "drag", "draw", "drew", "drop", "drug", "drum", "dual",
  "duck", "duke", "dull", "duly", "dump", "dusk", "dust", "duty", "each", "earn",
  "ease", "east", "easy", "edge", "edit", "else", "envy", "epic", "even", "ever",
  "evil", "exam", "exit", "face", "fact", "fade", "fail", "fair", "fake", "fall",
  "fame", "fare", "farm", "fast", "fate", "fear", "feat", "feed", "feel", "feet",
  "fell", "felt", "file", "fill", "film", "find", "fine", "fire", "firm", "fish",
  "five", "flag", "flat", "fled", "flee", "flew", "flex", "flip", "flow", "foam",
  "fold", "folk", "fond", "font", "food", "fool", "foot", "ford", "fore", "fork",
  "form", "fort", "four", "free", "frog", "from", "fuel", "full", "fund", "fury",
  "fuse", "gain", "game", "gang", "gate", "gave", "gaze", "gear", "gift", "girl",
  "give", "glad", "goal", "goat", "goes", "gold", "golf", "gone", "good", "gown",
  "grab", "gray", "grew", "grey", "grid", "grim", "grow", "gulf", "guru", "hack",
  "hair", "half", "hall", "hand", "hang", "hard", "harm", "hate", "have", "hawk",
  "head", "heal", "heap", "hear", "heat", "heel", "held", "hell", "helm", "help",
  "herb", "here", "hero", "hide", "high", "hill", "hint", "hire", "hold", "hole",
  "holy", "home", "hood", "hook", "hope", "horn", "host", "hour", "huge", "hull",
  "hung", "hunt", "hurt", "icon", "idea", "idle", "inch", "info", "into", "iron",
  "item", "jail", "jazz", "jean", "jeep", "join", "joke", "jump", "jury", "just",
  "keen", "keep", "kept", "kick", "kill", "kind", "king", "kiss", "kite", "knee",
  "knew", "know", "lack", "lady", "laid", "lake", "lamb", "lamp", "land", "lane",
  "last", "late", "lawn", "lazy", "lead", "leaf", "leak", "lean", "leap", "left",
  "lens", "less", "life", "lift", "like", "lime", "line", "link", "lion", "list",
  "live", "load", "loan", "lock", "loft", "logo", "lone", "long", "look", "loop",
  "lord", "lose", "loss", "lost", "loud", "love", "luck", "lump", "lung", "made",
  "mail", "main", "make", "male", "mall", "many", "mark", "mask", "mass", "mate",
  "math", "maze", "meal", "mean", "meat", "meet", "memo", "menu", "mere", "mesh",
  "mess", "mice", "mile", "milk", "mill", "mind", "mine", "mint", "miss", "mist",
  "mode", "moon", "more", "moss", "most", "move", "much", "must", "myth", "nail",
  "name", "navy", "near", "neat", "neck", "need", "nest", "news", "next", "nice",
  "nick", "nine", "node", "none", "noon", "norm", "nose", "note", "oath", "obey",
  "odds", "okay", "once", "only", "onto", "open", "oral", "oval", "oven", "over",
  "pace", "pack", "page", "paid", "pain", "pair", "palm", "park", "part", "pass",
  "past", "path", "peak", "pear", "peer", "pick", "pier", "pile", "pine", "pink",
  "pipe", "plan", "play", "plot", "plug", "plus", "poem", "poet", "pole", "poll",
  "polo", "pond", "pool", "port", "pose", "post", "pour", "pray", "prey",

  // 5+ letter words
  "world", "house", "place", "group", "party", "money", "point", "state", "night",
  "water", "thing", "family", "heart", "question", "business", "president",
  "problem", "country", "example", "school", "number", "system", "social", "world",
  "story", "mother", "father", "friend", "truth", "power", "apple", "basic",
  "bread", "break", "brown", "build", "buyer", "cable", "child", "clean", "clock",
  "coffee", "color", "count", "court", "cover", "cream", "crime", "cross", "crowd",
  "crown", "cycle", "dance", "death", "depth", "doubt", "draft", "drama", "dream",
  "dress", "drink", "drive", "earth", "enemy", "entry", "error", "event", "faith",
  "fault", "field", "fight", "final", "floor", "focus", "force", "frame", "frank",
  "front", "fruit", "glass", "grant", "grass", "green", "group", "guide", "heart",
  "horse", "hotel", "house", "image", "index", "input", "issue", "japan", "jones",
  "judge", "knife", "laura", "layer", "level", "lewis", "light", "limit", "lunch",
  "major", "march", "match", "metal", "model", "money", "month", "motor", "mouth",
  "music", "night", "noise", "north", "novel", "nurse", "offer", "order", "other",
  "owner", "panel", "paper", "party", "peace", "peter", "phase", "phone", "piece",
  "pilot", "pitch", "place", "plane", "plant", "plate", "point", "pound", "power",
  "press", "price", "pride", "prize", "proof", "queen", "radio", "range", "ratio",
  "reply", "right", "river", "round", "route", "rugby", "scale", "scene", "scope",
  "score", "sense", "shape", "share", "sheep", "sheet", "shift", "shirt", "shock",
  "sight", "simon", "skill", "sleep", "smile", "smith", "smoke", "sound", "south",
  "space", "speed", "spite", "sport", "squad", "staff", "stage", "start", "state",
  "steam", "steel", "stock", "stone", "store", "study", "stuff", "style", "sugar",
  "table", "taste", "terry", "theme", "thing", "title", "total", "touch", "tower",
  "track", "trade", "train", "trend", "trial", "trust", "truth", "uncle", "union",
  "unity", "value", "video", "visit", "voice", "waste", "watch", "water", "while",
  "white", "whole", "woman", "world", "youth", "admin", "affect", "animal", "annual",
  "answer", "appeal", "aspect", "assess", "assist", "attach", "attack", "author",
  "basket", "battle", "beyond", "binary", "bishop", "border", "bottle", "branch",
  "breath", "bridge", "bright", "broken", "budget", "bullet", "bundle", "button",
  "camera", "cancer", "carbon", "career", "castle", "casual", "caught", "center",
  "centre", "chance", "change", "charge", "choice", "choose", "chosen", "church",
  "circle", "client", "closed", "closer", "coffee", "column", "combat", "coming",
  "common", "comply", "copper", "corner", "costly", "county", "couple", "course",
  "covers", "create", "credit", "crisis", "custom", "damage", "danger", "dealer",
  "debate", "decade", "decide", "defeat", "defend", "define", "degree", "demand",
  "depend", "deputy", "desert", "design", "desire", "detail", "detect", "device",
  "direct", "doctor", "dollar", "domain", "double", "driven", "driver", "during",
  "easily", "eating", "editor", "effect", "effort", "eighth", "either", "eleven",
  "emerge", "empire", "employ", "enable", "ending", "energy", "engage", "engine",
  "enough", "ensure", "entire", "entity", "equity", "escape", "estate", "ethnic",
  "exceed", "except", "excess", "expand", "expect", "expert", "export", "extend",
  "extent", "fabric", "facing", "factor", "failed", "fairly", "fallen", "family",
  "famous", "father", "fellow", "female", "figure", "filing", "finger", "finish",
  "fiscal", "flight", "flying", "follow", "forced", "forest", "forget", "formal",
  "format", "former", "foster", "fought", "fourth", "french", "friend", "future",
  "garden", "gather", "gender", "german", "global", "golden", "ground", "growth",
  "guilty", "handle", "happen", "hardly", "headed", "health", "height", "hidden",
  "holder", "honest", "impact", "import", "income", "indeed", "injury", "inside",
  "intend", "intent", "invest", "island", "itself", "jersey", "joseph", "junior",
  "killed", "labour", "latest", "latter", "launch", "lawyer", "leader", "league",
  "leaves", "legacy", "length", "lesson", "letter", "lights", "likely", "linked",
  "liquid", "listen", "little", "living", "losing", "lucent", "luxury", "mainly",
  "making", "manage", "manner", "manual", "margin", "marine", "marked", "market",
  "martin", "master", "matter", "mature", "medium", "member", "memory", "mental",
  "merely", "merger", "method", "middle", "miller", "mining", "minute", "mirror",
  "mobile", "modern", "modest", "module", "moment", "morris", "mostly", "mother",
  "motion", "moving", "murder", "museum", "mutual", "myself", "narrow", "nation",
  "native", "nature", "nearby", "nearly", "nights", "nobody", "normal", "notice",
  "notion", "number", "object", "obtain", "office", "offset", "online", "option",
  "orange", "origin", "output", "oxford", "packed", "palace", "parent", "partly",
  "patent", "people", "period", "permit", "person", "phrase", "picked", "planet",
  "player", "please", "plenty", "pocket", "police", "policy", "prefer", "pretty",
  "prince", "prison", "profit", "proper", "proven", "public", "pursue", "raised",
  "random", "rarely", "rather", "rating", "reader", "really", "reason", "recall",
  "recent", "record", "reduce", "reform", "regard", "regime", "region", "relate",
  "relief", "remain", "remote", "remove", "repair", "repeat", "replay", "report",
  "rescue", "resort", "result", "retail", "retain", "return", "reveal", "review",
  "reward", "riding", "rising", "robust", "ruling", "safety", "salary", "sample",
  "saving", "saying", "scheme", "school", "screen", "search", "season", "second",
  "secret", "sector", "secure", "seeing", "select", "seller", "senior", "series",
  "server", "settle", "severe", "sexual", "should", "signal", "signed", "silent",
  "silver", "simple", "simply", "single", "sister", "slight", "smooth", "social",
  "solely", "sought", "source", "soviet", "speech", "spirit", "spoken", "spread",
  "spring", "square", "stable", "status", "steady", "stolen", "strain", "stream",
  "street", "stress", "strict", "strike", "string", "strong", "struck", "studio",
  "submit", "sudden", "suffer", "summer", "summit", "supply", "surely", "survey",
  "switch", "symbol", "system", "taking", "talent", "target", "taught", "tenant",
  "tender", "tennis", "thanks", "theory", "thirty", "though", "threat", "thrown",
  "ticket", "timely", "timing", "tissue", "toward", "travel", "treaty", "trying",
  "twelve", "twenty", "unable", "unique", "united", "unless", "unlike", "update",
  "useful", "valley", "varied", "vendor", "versus", "victim", "vision", "visual",
  "volume", "walker", "wealth", "weekly", "weight", "wholly", "window", "winner",
  "winter", "within", "wonder", "worker", "wright", "writer", "yellow"
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
    console.log("Generating new letter set...");
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
          console.log(`Attempt ${i + 1}: Letters=${letters}, Center=${centerLetter}, Valid words=${validWords.length}`);

          if (!bestAttempt || validWords.length > bestAttempt.count) {
            bestAttempt = { letters, centerLetter, validWords, count: validWords.length };
            // Accept any puzzle with at least 10 valid words
            if (validWords.length >= 10) {
              console.log(`Found good puzzle with ${validWords.length} words`);
              return bestAttempt;
            }
          }
        }
      }
    }

    // Use the best attempt we found, or fall back to a default set
    if (bestAttempt && bestAttempt.count > 0) {
      console.log(`Using best attempt found with ${bestAttempt.count} words`);
      return bestAttempt;
    }

    // Fallback to a guaranteed valid set
    console.log('Using fallback puzzle set');
    return {
      letters: "AEILNS",
      centerLetter: "T",
      validWords: DICTIONARY.filterValidWords("AEILNS", "T")
    };
  }

  async generateNewPuzzle(): Promise<Puzzle> {
    console.log("Generating new puzzle...");
    this.puzzles.clear();

    const { letters, centerLetter, validWords } = this.generateLetterSet();
    console.log(`Generated puzzle: Letters=${letters}, Center=${centerLetter}, Words=${validWords.length}`);

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