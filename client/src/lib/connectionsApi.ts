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
        },
        
        // Game 21
        {
          words: ['VANILLA', 'CHOCOLATE', 'STRAWBERRY', 'MINT'],
          category: "Ice Cream Flavors"
        },
        {
          words: ['SCARF', 'GLOVES', 'BOOTS', 'SWEATER'],
          category: "Winter Clothing"
        },
        {
          words: ['FORK', 'PAN', 'OVEN', 'BLENDER'],
          category: "In the Kitchen"
        },
        {
          words: ['EMAIL', 'PHONE', 'LETTER', 'TEXT'],
          category: "Modes of Communication"
        },
        
        // Game 22
        {
          words: ['JAVASCRIPT', 'SWIFT', 'KOTLIN', 'C#'],
          category: "Programming Languages"
        },
        {
          words: ['INSTAGRAM', 'TWITTER', 'FACEBOOK', 'TIKTOK'],
          category: "Social Media Platforms"
        },
        {
          words: ['NETFLIX', 'HULU', 'PRIME', 'DISNEY+'],
          category: "Streaming Services"
        },
        {
          words: ['SAMSUNG', 'APPLE', 'GOOGLE', 'ONEPLUS'],
          category: "Smartphone Brands"
        },
        
        // Game 23
        {
          words: ['ZEBRA', 'ELEPHANT', 'GIRAFFE', 'PANDA'],
          category: "Zoo Animals"
        },
        {
          words: ['PLANE', 'KITE', 'HELICOPTER', 'BALLOON'],
          category: "Things That Fly"
        },
        {
          words: ['WOLF', 'LEOPARD', 'HAWK', 'CROCODILE'],
          category: "Carnivores"
        },
        {
          words: ['FROG', 'TOAD', 'SALAMANDER', 'NEWT'],
          category: "Amphibians"
        },
        
        // Game 24
        {
          words: ['FRANCE', 'ITALY', 'GERMANY', 'SPAIN'],
          category: "Countries in Europe"
        },
        {
          words: ['TEXAS', 'FLORIDA', 'OHIO', 'NEVADA'],
          category: "US States"
        },
        {
          words: ['TOKYO', 'LONDON', 'OTTAWA', 'CANBERRA'],
          category: "Capital Cities"
        },
        {
          words: ['HAWAII', 'MALDIVES', 'SEYCHELLES', 'BALI'],
          category: "Islands"
        },
        
        // Game 25
        {
          words: ['JAZZ', 'ROCK', 'POP', 'COUNTRY'],
          category: "Musical Genres"
        },
        {
          words: ['SPOTIFY', 'TIDAL', 'PANDORA', 'DEEZER'],
          category: "Music Streaming Services"
        },
        {
          words: ['NOTE', 'STAFF', 'CLEF', 'REST'],
          category: "Music Notation"
        },
        {
          words: ['ALLEGRO', 'FORTE', 'TEMPO', 'CRESCENDO'],
          category: "Musical Terms"
        },
        
        // Game 26
        {
          words: ['HAWK', 'FALCON', 'EAGLE', 'OWL'],
          category: "Birds of Prey"
        },
        {
          words: ['SNAKE', 'LIZARD', 'TORTOISE', 'ALLIGATOR'],
          category: "Reptiles"
        },
        {
          words: ['ABYSS', 'TWILIGHT', 'SUNLIGHT', 'MIDNIGHT'],
          category: "Ocean Zones"
        },
        {
          words: ['IGNEOUS', 'SEDIMENTARY', 'METAMORPHIC', 'BASALT'],
          category: "Types of Rocks"
        },
        
        // Game 27
        {
          words: ['DENTIST', 'SURGEON', 'PEDIATRICIAN', 'DERMATOLOGIST'],
          category: "Types of Doctors"
        },
        {
          words: ['SCALPEL', 'THERMOMETER', 'STETHOSCOPE', 'SYRINGE'],
          category: "Medical Tools"
        },
        {
          words: ['ASTHMA', 'DIABETES', 'MIGRAINE', 'FLU'],
          category: "Medical Conditions"
        },
        {
          words: ['ICU', 'ER', 'WARD', 'OR'],
          category: "Hospital Rooms"
        },
        
        // Game 28
        {
          words: ['CEREAL', 'WAFFLES', 'OATMEAL', 'TOAST'],
          category: "Breakfast Foods"
        },
        {
          words: ['BROCCOLI', 'CARROT', 'SPINACH', 'CAULIFLOWER'],
          category: "Vegetables"
        },
        {
          words: ['ALMOND', 'PEANUT', 'CASHEW', 'WALNUT'],
          category: "Nuts"
        },
        {
          words: ['RICE', 'WHEAT', 'BARLEY', 'OATS'],
          category: "Grains"
        },
        
        // Game 29
        {
          words: ['COPACABANA', 'WAIKIKI', 'BONDI', 'CANCUN'],
          category: "Beaches"
        },
        {
          words: ['FUJI', 'KILIMANJARO', 'DENALI', 'ELBRUS'],
          category: "Mountains"
        },
        {
          words: ['NILE', 'AMAZON', 'DANUBE', 'YANGTZE'],
          category: "Rivers"
        },
        {
          words: ['TAHOE', 'SUPERIOR', 'VICTORIA', 'BAIKAL'],
          category: "Lakes"
        },
        
        // Game 30
        {
          words: ['BREAD', 'MUFFIN', 'CROISSANT', 'BAGEL'],
          category: "Baked Goods"
        },
        {
          words: ['FRYING', 'BOILING', 'ROASTING', 'GRILLING'],
          category: "Cooking Methods"
        },
        {
          words: ['MICROWAVE', 'TOASTER', 'FRIDGE', 'STOVE'],
          category: "Kitchen Appliances"
        },
        {
          words: ['KETCHUP', 'MUSTARD', 'MAYO', 'RELISH'],
          category: "Condiments"
        },
        
        // Game 31
        {
          words: ['CHRISTMAS', 'HALLOWEEN', 'EASTER', 'THANKSGIVING'],
          category: "Holidays"
        },
        {
          words: ['GARLAND', 'LIGHTS', 'WREATH', 'ORNAMENT'],
          category: "Holiday Decorations"
        },
        {
          words: ['TOY', 'BOOK', 'PERFUME', 'JEWELRY'],
          category: "Gifts"
        },
        {
          words: ['BALLOON', 'STREAMER', 'CONFETTI', 'CAKE'],
          category: "Party Supplies"
        },
        
        // Game 32
        {
          words: ['MATH', 'HISTORY', 'SCIENCE', 'ART'],
          category: "School Subjects"
        },
        {
          words: ['PENCIL', 'RULER', 'ERASER', 'NOTEBOOK'],
          category: "School Supplies"
        },
        {
          words: ['JANITOR', 'TEACHER', 'COUNSELOR', 'PRINCIPAL'],
          category: "Classroom Jobs"
        },
        {
          words: ['PUBLIC', 'PRIVATE', 'BOARDING', 'CHARTER'],
          category: "Types of Schools"
        },
        
        // Game 33
        {
          words: ['RUBY', 'SAPPHIRE', 'TOPAZ', 'AMETHYST'],
          category: "Jewels"
        },
        {
          words: ['COPPER', 'SILVER', 'GOLD', 'IRON'],
          category: "Metals"
        },
        {
          words: ['EARTHQUAKE', 'TORNADO', 'TSUNAMI', 'AVALANCHE'],
          category: "Natural Disasters"
        },
        {
          words: ['FOG', 'HAIL', 'THUNDER', 'LIGHTNING'],
          category: "Weather Types"
        },
        
        // Game 34
        {
          words: ['PILOT', 'LAWYER', 'NURSE', 'ENGINEER'],
          category: "Occupations"
        },
        {
          words: ['WRENCH', 'LAPTOP', 'CAMERA', 'CALCULATOR'],
          category: "Tools Used by Workers"
        },
        {
          words: ['HOSPITAL', 'OFFICE', 'STUDIO', 'COURTROOM'],
          category: "Workplaces"
        },
        {
          words: ['SCRUBS', 'SUIT', 'ROBE', 'HELMET'],
          category: "Uniforms"
        },
        
        // Game 35
        {
          words: ['SUN', 'MOON', 'CLOUD', 'STAR'],
          category: "In the Sky"
        },
        {
          words: ['COMET', 'ASTEROID', 'METEOR', 'GALAXY'],
          category: "Space Objects"
        },
        {
          words: ['APOLLO', 'ARTEMIS', 'VOYAGER', 'CURIOSITY'],
          category: "NASA Missions"
        },
        {
          words: ['HUBBLE', 'WEBB', 'KEPLER', 'SPITZER'],
          category: "Telescopes"
        },
        
        // Game 36
        {
          words: ['RISK', 'SETTLERS', 'LIFE', 'UNO'],
          category: "Board Games"
        },
        {
          words: ['POKER', 'BRIDGE', 'SOLITAIRE', 'BLACKJACK'],
          category: "Card Games"
        },
        {
          words: ['XBOX', 'SWITCH', 'PLAYSTATION', 'ATARI'],
          category: "Video Game Consoles"
        },
        {
          words: ['PAC-MAN', 'TETRIS', 'GALAGA', 'FROGGER'],
          category: "Arcade Games"
        },
        
        // Game 37
        {
          words: ['JOY', 'FEAR', 'SURPRISE', 'DISGUST'],
          category: "Emotions"
        },
        {
          words: ['SMILE', 'FROWN', 'WINK', 'GLARE'],
          category: "Facial Expressions"
        },
        {
          words: ['NOD', 'SHRUG', 'CROSSED ARMS', 'SLOUCH'],
          category: "Body Language"
        },
        {
          words: ['EYE CONTACT', 'TONE', 'PROXIMITY', 'POSTURE'],
          category: "Social Cues"
        },
        
        // Game 38
        {
          words: ['FRANC', 'PESO', 'KRONA', 'RUPEE'],
          category: "Currencies"
        },
        {
          words: ['PENNY', 'NICKEL', 'DIME', 'QUARTER'],
          category: "Coins"
        },
        {
          words: ['BANK', 'CREDIT UNION', 'LENDER', 'BROKER'],
          category: "Financial Institutions"
        },
        {
          words: ['INVOICE', 'RECEIPT', 'BILL', 'STATEMENT'],
          category: "Financial Documents"
        },
        
        // Game 39
        {
          words: ['DSLR', 'POLAROID', 'GOPRO', 'MIRRORLESS'],
          category: "Cameras"
        },
        {
          words: ['APERTURE', 'EXPOSURE', 'ISO', 'FOCUS'],
          category: "Photography Terms"
        },
        {
          words: ['LIGHTROOM', 'PHOTOSHOP', 'SNAPSEED', 'VSCO'],
          category: "Editing Software"
        },
        {
          words: ['PORTRAIT', 'LANDSCAPE', 'MACRO', 'STREET'],
          category: "Photo Genres"
        },
        
        // Game 40
        {
          words: ['FANTASY', 'MYSTERY', 'ROMANCE', 'ADVENTURE'],
          category: "Story Genres"
        },
        {
          words: ['SETTING', 'PLOT', 'CHARACTER', 'CONFLICT'],
          category: "Story Elements"
        },
        {
          words: ['ROWLING', 'CHRISTIE', 'KING', 'DAHL'],
          category: "Authors"
        },
        {
          words: ['NOVEL', 'NOVELLA', 'SHORT STORY', 'GRAPHIC NOVEL'],
          category: "Story Formats"
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