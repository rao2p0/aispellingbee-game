import { apiRequest } from './queryClient';

export interface WordGroup {
  words: string[];
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameData {
  groups: WordGroup[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface NewGameResponse {
  words: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  gameId: number;
}

export interface ValidationResponse {
  valid: boolean;
  category?: string;
  groupIndex?: number;
}

export const connectionsApi = {
  // Get a new game with 16 shuffled words
  getNewGame: async (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<{
    words: string[];
    gameData: GameData;  // We'll need to store this client-side for validation
  }> => {
    // Since we don't have a real API endpoint yet, we'll generate different sets of word groups
    // Database of word groups by difficulty
    const wordGroupsDatabase = {
      easy: [
        // Game 1
        {
          words: ['RED', 'BLUE', 'GREEN', 'YELLOW'],
          category: "Colors"
        },
        {
          words: ['APPLE', 'BANANA', 'ORANGE', 'MANGO'],
          category: "Fruits"
        },
        {
          words: ['DOG', 'CAT', 'LION', 'TIGER'],
          category: "Animals"
        },
        {
          words: ['CAR', 'BUS', 'BIKE', 'TRAIN'],
          category: "Vehicles"
        },
        
        // Game 2
        {
          words: ['JANUARY', 'MARCH', 'JULY', 'OCTOBER'],
          category: "Months"
        },
        {
          words: ['ARM', 'LEG', 'EYE', 'NOSE'],
          category: "Body Parts"
        },
        {
          words: ['WATER', 'JUICE', 'TEA', 'COFFEE'],
          category: "Drinks"
        },
        {
          words: ['TEACHER', 'DOCTOR', 'CHEF', 'FARMER'],
          category: "Jobs"
        },
        
        // Game 3
        {
          words: ['CIRCLE', 'SQUARE', 'TRIANGLE', 'RECTANGLE'],
          category: "Shapes"
        },
        {
          words: ['DOLL', 'PUZZLE', 'LEGO', 'YO-YO'],
          category: "Toys"
        },
        {
          words: ['HAMSTER', 'FISH', 'PARROT', 'RABBIT'],
          category: "Pets"
        },
        {
          words: ['ANT', 'BEE', 'FLY', 'MOSQUITO'],
          category: "Insects"
        },
        
        // Game 4
        {
          words: ['PIANO', 'GUITAR', 'VIOLIN', 'DRUM'],
          category: "Musical Instruments"
        },
        {
          words: ['CHAIR', 'TABLE', 'SOFA', 'BED'],
          category: "Furniture"
        },
        {
          words: ['SOCCER', 'TENNIS', 'CRICKET', 'BASEBALL'],
          category: "Sports"
        },
        {
          words: ['EARTH', 'MARS', 'JUPITER', 'SATURN'],
          category: "Planets"
        },
        
        // Game 5
        {
          words: ['RAIN', 'SNOW', 'SUN', 'WIND'],
          category: "Weather"
        },
        {
          words: ['CAKE', 'PIE', 'COOKIE', 'ICECREAM'],
          category: "Desserts"
        },
        {
          words: ['SHIRT', 'PANTS', 'HAT', 'JACKET'],
          category: "Clothing"
        },
        {
          words: ['EAGLE', 'CROW', 'OWL', 'SPARROW'],
          category: "Birds"
        }
      ],
      medium: [
        // Game 6
        {
          words: ['HAMMER', 'SCREWDRIVER', 'WRENCH', 'DRILL'],
          category: "Tools"
        },
        {
          words: ['ASIA', 'AFRICA', 'EUROPE', 'AUSTRALIA'],
          category: "Continents"
        },
        {
          words: ['ENGLISH', 'HINDI', 'SPANISH', 'FRENCH'],
          category: "Languages"
        },
        {
          words: ['ROSE', 'LILY', 'DAISY', 'TULIP'],
          category: "Flowers"
        },
        
        // Game 7
        {
          words: ['OXYGEN', 'HYDROGEN', 'CARBON', 'NITROGEN'],
          category: "Elements"
        },
        {
          words: ['DOLLAR', 'YEN', 'EURO', 'RUPEE'],
          category: "Currencies"
        },
        {
          words: ['OAK', 'MAPLE', 'PINE', 'BIRCH'],
          category: "Trees"
        },
        {
          words: ['HAPPY', 'SAD', 'ANGRY', 'SCARED'],
          category: "Emotions"
        },
        
        // Game 8
        {
          words: ['CHESS', 'MONOPOLY', 'SCRABBLE', 'CLUE'],
          category: "Board Games"
        },
        {
          words: ['CHROME', 'SAFARI', 'FIREFOX', 'EDGE'],
          category: "Web Browsers"
        },
        {
          words: ['WHALE', 'OCTOPUS', 'SHARK', 'DOLPHIN'],
          category: "Ocean Animals"
        },
        {
          words: ['COTTON', 'SILK', 'WOOL', 'DENIM'],
          category: "Fabrics"
        },
        
        // Game 9
        {
          words: ['EVEREST', 'ALPS', 'ANDES', 'ROCKIES'],
          category: "Mountains"
        },
        {
          words: ['PYTHON', 'JAVA', 'RUBY', 'GO'],
          category: "Programming Languages"
        },
        {
          words: ['PEPPER', 'CINNAMON', 'CLOVE', 'TURMERIC'],
          category: "Spices"
        },
        {
          words: ['DEVELOPER', 'ANALYST', 'DESIGNER', 'TESTER'],
          category: "Jobs in Tech"
        },
        
        // Game 10
        {
          words: ['SNEAKERS', 'BOOTS', 'SLIPPERS', 'SANDALS'],
          category: "Footwear"
        },
        {
          words: ['SECOND', 'MINUTE', 'HOUR', 'DAY'],
          category: "Time Units"
        },
        {
          words: ['MCDONALDS', 'KFC', 'SUBWAY', 'WENDYS'],
          category: "Fast Food Chains"
        },
        {
          words: ['NECKLACE', 'RING', 'BRACELET', 'EARRING'],
          category: "Jewelry"
        }
      ],
      hard: [
        // Game 11
        {
          words: ['ZEUS', 'HADES', 'ARES', 'APOLLO'],
          category: "Greek Gods"
        },
        {
          words: ['CRIMSON', 'SCARLET', 'MAROON', 'RUBY'],
          category: "Shades of Red"
        },
        {
          words: ['FUNCTIONAL', 'OBJECT-ORIENTED', 'PROCEDURAL', 'DECLARATIVE'],
          category: "Programming Paradigms"
        },
        {
          words: ['HAIKU', 'SONNET', 'ODE', 'LIMERICK'],
          category: "Types of Poems"
        },
        
        // Game 12
        {
          words: ['UNICORN', 'DRAGON', 'PHOENIX', 'GRIFFIN'],
          category: "Mythical Creatures"
        },
        {
          words: ['TOLKIEN', 'AUSTEN', 'ORWELL', 'HEMINGWAY'],
          category: "Famous Authors"
        },
        {
          words: ['SOLID', 'LIQUID', 'GAS', 'PLASMA'],
          category: "Chemical States"
        },
        {
          words: ['BISHOP', 'KNIGHT', 'ROOK', 'PAWN'],
          category: "Chess Pieces"
        },
        
        // Game 13
        {
          words: ['SAHARA', 'GOBI', 'MOJAVE', 'ATACAMA'],
          category: "Deserts"
        },
        {
          words: ['TANGO', 'SALSA', 'WALTZ', 'BALLET'],
          category: "Dances"
        },
        {
          words: ['CUBISM', 'SURREALISM', 'IMPRESSIONISM', 'BAROQUE'],
          category: "Art Movements"
        },
        {
          words: ['CUMULUS', 'STRATUS', 'CIRRUS', 'NIMBUS'],
          category: "Cloud Types"
        },
        
        // Game 14
        {
          words: ['TITAN', 'EUROPA', 'IO', 'GANYMEDE'],
          category: "Satellites (Moons)"
        },
        {
          words: ['INFLATION', 'RECESSION', 'GDP', 'TAX'],
          category: "Economic Terms"
        },
        {
          words: ['CLAUSTROPHOBIA', 'ARACHNOPHOBIA', 'ACROPHOBIA', 'NYCTOPHOBIA'],
          category: "Phobias"
        },
        {
          words: ['HORROR', 'ROMANCE', 'SCI-FI', 'THRILLER'],
          category: "Movie Genres"
        },
        
        // Game 15
        {
          words: ['LANCELOT', 'GAWAIN', 'PERCIVAL', 'GALAHAD'],
          category: "Knights of the Round Table"
        },
        {
          words: ['FLAT EARTH', 'MOON LANDING', 'AREA 51', 'BIGFOOT'],
          category: "Conspiracy Theories"
        },
        {
          words: ['BITCOIN', 'ETHEREUM', 'DOGECOIN', 'LITECOIN'],
          category: "Cryptocurrencies"
        },
        {
          words: ['EINSTEIN', 'NEWTON', 'CURIE', 'HAWKING'],
          category: "Famous Scientists"
        }
      ]
    };
    
    // Select 4 random groups from the database for the requested difficulty
    const availableGroups = wordGroupsDatabase[difficulty];
    const selectedGroups: WordGroup[] = [];
    
    // Create a copy of indices that we can remove from as we select groups
    const availableIndices = Array.from({length: availableGroups.length}, (_, i) => i);
    
    // Select 4 random groups without replacement
    for (let i = 0; i < 4; i++) {
      if (availableIndices.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * availableIndices.length);
      const groupIndex = availableIndices[randomIndex];
      
      // Remove the selected index
      availableIndices.splice(randomIndex, 1);
      
      // Add the selected group to our game
      selectedGroups.push({
        ...availableGroups[groupIndex],
        difficulty
      });
    }
    
    // Flatten all words and shuffle them
    const allWords = selectedGroups.flatMap(group => group.words);
    for (let i = allWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
    }
    
    return {
      words: allWords,
      gameData: {
        groups: selectedGroups,
        difficulty
      }
    };
  },

  // Validate a selection of 4 words
  validateSelection: async (words: string[], gameData: GameData): Promise<ValidationResponse> => {
    try {
      // Since we don't have a server endpoint yet, we'll use the client-side validation
      return connectionsApi.validateSelectionClientSide(words, gameData);
    } catch (error) {
      console.error('Error validating selection:', error);
      return { valid: false };
    }
  },

  // Client-side validation to reduce server calls
  // In a production app, this would be supplemented with server validation
  validateSelectionClientSide: (words: string[], gameData: GameData): ValidationResponse => {
    if (words.length !== 4) {
      return { valid: false };
    }

    // Sort words to make comparison easier
    const sortedWords = [...words].sort();

    for (let i = 0; i < gameData.groups.length; i++) {
      const group = gameData.groups[i];
      const groupWords = [...group.words].sort();

      // Check if the sorted words match exactly
      if (JSON.stringify(sortedWords) === JSON.stringify(groupWords)) {
        return { 
          valid: true, 
          category: group.category,
          groupIndex: i
        };
      }
    }

    return { valid: false };
  }
};