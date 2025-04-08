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
        // Original Games
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
        },
        
        // Additional Games (CSV data)
        // Game 41
        {
          words: ['GREEN', 'BLUE', 'ORANGE', 'PURPLE'],
          category: "Colors"
        },
        {
          words: ['BUTTERFLY', 'WASP', 'ANT', 'GRASSHOPPER'],
          category: "Insects"
        },
        {
          words: ['BASEBALL', 'CRICKET', 'GOLF', 'SOCCER'],
          category: "Sports"
        },
        {
          words: ['JUPITER', 'NEPTUNE', 'EARTH', 'VENUS'],
          category: "Planets"
        },
        
        // Game 42
        {
          words: ['OVAL', 'CIRCLE', 'TRIANGLE', 'HEXAGON'],
          category: "Shapes"
        },
        {
          words: ['GRAPES', 'PEACH', 'APPLE', 'ORANGE'],
          category: "Fruits"
        },
        {
          words: ['PINK', 'ORANGE', 'PURPLE', 'GREEN'],
          category: "Colors"
        },
        {
          words: ['TURTLE', 'RABBIT', 'FISH', 'DOG'],
          category: "Pets"
        },
        
        // Game 43
        {
          words: ['TRUCK', 'BUS', 'BOAT', 'BIKE'],
          category: "Vehicles"
        },
        {
          words: ['CAR', 'TEDDY', 'LEGO', 'BLOCKS'],
          category: "Toys"
        },
        {
          words: ['RED', 'YELLOW', 'PURPLE', 'GREEN'],
          category: "Colors"
        },
        {
          words: ['PIE', 'COOKIE', 'PUDDING', 'DONUT'],
          category: "Desserts"
        },
        
        // Game 44
        {
          words: ['CAKE', 'DONUT', 'ICECREAM', 'PIE'],
          category: "Desserts"
        },
        {
          words: ['MOSQUITO', 'BUTTERFLY', 'FLY', 'WASP'],
          category: "Insects"
        },
        {
          words: ['BLUE', 'YELLOW', 'GREEN', 'RED'],
          category: "Colors"
        },
        {
          words: ['BASEBALL', 'RUGBY', 'SOCCER', 'BASKETBALL'],
          category: "Sports"
        },
        
        // Game 45
        {
          words: ['BALL', 'LEGO', 'PUZZLE', 'CAR'],
          category: "Toys"
        },
        {
          words: ['RULER', 'NOTEBOOK', 'MARKER', 'PEN'],
          category: "School Supplies"
        },
        {
          words: ['CIRCLE', 'STAR', 'RECTANGLE', 'DIAMOND'],
          category: "Shapes"
        },
        {
          words: ['COOKIE', 'CUPCAKE', 'ICECREAM', 'PIE'],
          category: "Desserts"
        },
        
        // Game 46
        {
          words: ['PEACOCK', 'SPARROW', 'PIGEON', 'PARROT'],
          category: "Birds"
        },
        {
          words: ['CUPCAKE', 'ICECREAM', 'BROWNIE', 'DONUT'],
          category: "Desserts"
        },
        {
          words: ['FRIES', 'BURGER', 'WRAP', 'HOTDOG'],
          category: "Fast Food"
        },
        {
          words: ['FISH', 'PARROT', 'TURTLE', 'DOG'],
          category: "Pets"
        },
        
        // Game 47
        {
          words: ['EAR', 'NOSE', 'LEG', 'HAND'],
          category: "Body Parts"
        },
        {
          words: ['SODA', 'TEA', 'LEMONADE', 'COFFEE'],
          category: "Drinks"
        },
        {
          words: ['SANDWICH', 'TACO', 'NUGGETS', 'HOTDOG'],
          category: "Fast Food"
        },
        {
          words: ['ORANGE', 'BANANA', 'GRAPES', 'LEMON'],
          category: "Fruits"
        },
        
        // Game 48
        {
          words: ['SATURN', 'MERCURY', 'MARS', 'VENUS'],
          category: "Planets"
        },
        {
          words: ['GOLF', 'TENNIS', 'BASEBALL', 'CRICKET'],
          category: "Sports"
        },
        {
          words: ['MILK', 'SMOOTHIE', 'TEA', 'WATER'],
          category: "Drinks"
        },
        {
          words: ['BLUE', 'GREEN', 'PURPLE', 'ORANGE'],
          category: "Colors"
        },
        
        // Game 49
        {
          words: ['DOCTOR', 'NURSE', 'POLICE', 'TEACHER'],
          category: "Jobs"
        },
        {
          words: ['STOOL', 'BED', 'SOFA', 'SHELF'],
          category: "Furniture"
        },
        {
          words: ['PIZZA', 'HOTDOG', 'SANDWICH', 'BURGER'],
          category: "Fast Food"
        },
        {
          words: ['ARM', 'FOOT', 'EYE', 'MOUTH'],
          category: "Body Parts"
        },
        
        // Game 50
        {
          words: ['GUINEA PIG', 'CAT', 'RABBIT', 'FISH'],
          category: "Pets"
        },
        {
          words: ['CRAYON', 'PENCIL', 'NOTEBOOK', 'PEN'],
          category: "School Supplies"
        },
        {
          words: ['CAR', 'VAN', 'BIKE', 'TRUCK'],
          category: "Vehicles"
        },
        {
          words: ['LEMON', 'PEAR', 'APPLE', 'ORANGE'],
          category: "Fruits"
        },

        // Games 51-60
        {
          words: ['GLOVES', 'JACKET', 'SKIRT', 'SHIRT'],
          category: "Clothing"
        },
        {
          words: ['TRIANGLE', 'HEXAGON', 'CIRCLE', 'DIAMOND'],
          category: "Shapes"
        },
        {
          words: ['CAR', 'DOLL', 'LEGO', 'BLOCKS'],
          category: "Toys"
        },
        {
          words: ['TEA', 'SODA', 'SMOOTHIE', 'COFFEE'],
          category: "Drinks"
        },
        {
          words: ['HAND', 'FOOT', 'MOUTH', 'LEG'],
          category: "Body Parts"
        },
        {
          words: ['BEE', 'BUTTERFLY', 'GRASSHOPPER', 'BEETLE'],
          category: "Insects"
        },
        {
          words: ['HOCKEY', 'RUGBY', 'GOLF', 'CRICKET'],
          category: "Sports"
        },
        {
          words: ['EAGLE', 'OWL', 'PIGEON', 'PARROT'],
          category: "Birds"
        },
        {
          words: ['SHARPENER', 'NOTEBOOK', 'ERASER', 'RULER'],
          category: "School Supplies"
        },
        {
          words: ['CAT', 'GUINEA PIG', 'RABBIT', 'TURTLE'],
          category: "Pets"
        },

        // Games 61-70
        {
          words: ['BALL', 'PUZZLE', 'TEDDY', 'BLOCKS'],
          category: "Toys"
        },
        {
          words: ['DIAMOND', 'STAR', 'OVAL', 'HEXAGON'],
          category: "Shapes"
        },
        {
          words: ['GREEN', 'RED', 'YELLOW', 'BLUE'],
          category: "Colors"
        },
        {
          words: ['BURGER', 'WRAP', 'PIZZA', 'SANDWICH'],
          category: "Fast Food"
        },
        {
          words: ['ICECREAM', 'PIE', 'DONUT', 'CUPCAKE'],
          category: "Desserts"
        },
        {
          words: ['JUICE', 'TEA', 'SODA', 'SMOOTHIE'],
          category: "Drinks"
        },
        {
          words: ['STORM', 'FOG', 'SUN', 'HAIL'],
          category: "Weather"
        },
        {
          words: ['BEETLE', 'GRASSHOPPER', 'WASP', 'ANT'],
          category: "Insects"
        },
        {
          words: ['MOUTH', 'ARM', 'NOSE', 'LEG'],
          category: "Body Parts"
        },
        {
          words: ['GOLF', 'TENNIS', 'HOCKEY', 'BASEBALL'],
          category: "Sports"
        },

        // Games 71-80
        {
          words: ['SODA', 'MILK', 'JUICE', 'SMOOTHIE'],
          category: "Drinks"
        },
        {
          words: ['CAT', 'GUINEA PIG', 'HAMSTER', 'DOG'],
          category: "Pets"
        },
        {
          words: ['FIREFIGHTER', 'TEACHER', 'CHEF', 'NURSE'],
          category: "Jobs"
        },
        {
          words: ['JUPITER', 'NEPTUNE', 'MARS', 'SATURN'],
          category: "Planets"
        },
        {
          words: ['HAND', 'MOUTH', 'NOSE', 'EAR'],
          category: "Body Parts"
        },
        {
          words: ['CROW', 'EAGLE', 'PARROT', 'PEACOCK'],
          category: "Birds"
        },
        {
          words: ['LEMONADE', 'COFFEE', 'MILK', 'WATER'],
          category: "Drinks"
        },
        {
          words: ['SQUARE', 'DIAMOND', 'RECTANGLE', 'TRIANGLE'],
          category: "Shapes"
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
        },
        
        // Additional Hard Games (CSV data)
        // Game 16
        {
          words: ['ID', 'ARCHETYPE', 'COGNITION', 'SCHEMA'],
          category: "Psychological Terms"
        },
        {
          words: ['DIAMOND', 'RUBY', 'OPAL', 'TOPAZ'],
          category: "Precious Stones"
        },
        {
          words: ['HUMERUS', 'RADIUS', 'SPINE', 'ULNA'],
          category: "Bones"
        },
        {
          words: ['CIRRUS', 'CUMULUS', 'STRATUS', 'CUMULONIMBUS'],
          category: "Cloud Types"
        },
        
        // Game 17
        {
          words: ['BORS', 'LANCELOT', 'GAWAIN', 'PERCIVAL'],
          category: "Knights of the Round Table"
        },
        {
          words: ['STRATUS', 'CUMULONIMBUS', 'NIMBOSTRATUS', 'CIRRUS'],
          category: "Cloud Types"
        },
        {
          words: ['ODE', 'ELEGY', 'FREE VERSE', 'BALLAD'],
          category: "Types of Poems"
        },
        {
          words: ['COLON', 'DASH', 'COMMA', 'EXCLAMATION'],
          category: "Punctuation Marks"
        },
        
        // Game 18
        {
          words: ['GALAHAD', 'BEDIVERE', 'TRISTAN', 'PERCIVAL'],
          category: "Knights of the Round Table"
        },
        {
          words: ['FIJI', 'ICELAND', 'MADAGASCAR', 'SICILY'],
          category: "Islands"
        },
        {
          words: ['ODE', 'HAIKU', 'BALLAD', 'ELEGY'],
          category: "Types of Poems"
        },
        {
          words: ['COLON', 'HYPHEN', 'SEMICOLON', 'COMMA'],
          category: "Punctuation Marks"
        },
        
        // Game 19
        {
          words: ['QUEEN', 'KING', 'ROOK', 'PAWN'],
          category: "Chess Pieces"
        },
        {
          words: ['JIVE', 'RUMBA', 'BALLET', 'FOXTROT'],
          category: "Dances"
        },
        {
          words: ['CRETE', 'BALI', 'SICILY', 'FIJI'],
          category: "Islands"
        },
        {
          words: ['TAIL', 'RUDDER', 'ENGINE', 'ELEVATOR'],
          category: "Parts of an Airplane"
        },
        
        // Game 20
        {
          words: ['GALILEO', 'TESLA', 'EINSTEIN', 'BOHR'],
          category: "Famous Scientists"
        },
        {
          words: ['HYDRA', 'DRAGON', 'UNICORN', 'GRIFFIN'],
          category: "Mythical Creatures"
        },
        {
          words: ['GARNET', 'RUBY', 'MAROON', 'CARMINE'],
          category: "Shades of Red"
        },
        {
          words: ['WINDOWS', 'DEBIAN', 'UBUNTU', 'IOS'],
          category: "Operating Systems"
        },
        
        // Game 21
        {
          words: ['BEETHOVEN', 'BACH', 'VIVALDI', 'HANDEL'],
          category: "Classical Composers"
        },
        {
          words: ['MACOS', 'DEBIAN', 'WINDOWS', 'ANDROID'],
          category: "Operating Systems"
        },
        {
          words: ['OBJECT-ORIENTED', 'IMPERATIVE', 'FUNCTIONAL', 'PROCEDURAL'],
          category: "Programming Paradigms"
        },
        {
          words: ['SAHARA', 'MOJAVE', 'SONORAN', 'GOBI'],
          category: "Deserts"
        },
        
        // Game 22
        {
          words: ['CRIMSON', 'GARNET', 'CARMINE', 'BURGUNDY'],
          category: "Shades of Red"
        },
        {
          words: ['EXCLAMATION', 'SEMICOLON', 'COLON', 'HYPHEN'],
          category: "Punctuation Marks"
        },
        {
          words: ['PELVIS', 'RADIUS', 'HUMERUS', 'TIBIA'],
          category: "Bones"
        },
        {
          words: ['PHOBOS', 'IO', 'DEIMOS', 'GANYMEDE'],
          category: "Satellites (Moons)"
        },
        
        // Game 23
        {
          words: ['DECLARATIVE', 'OBJECT-ORIENTED', 'EVENT-DRIVEN', 'IMPERATIVE'],
          category: "Programming Paradigms"
        },
        {
          words: ['LANCELOT', 'GALAHAD', 'TRISTAN', 'PERCIVAL'],
          category: "Knights of the Round Table"
        },
        {
          words: ['MEDICINE', 'LITERATURE', 'ECONOMICS', 'CHEMISTRY'],
          category: "Nobel Prize Categories"
        },
        {
          words: ['PROMETHEUS', 'INTERSTELLAR', 'CONTACT', 'SIGNS'],
          category: "Alien Movies"
        },
        
        // Game 24
        {
          words: ['DIAMOND', 'GARNET', 'EMERALD', 'AMETHYST'],
          category: "Precious Stones"
        },
        {
          words: ['PHYSICS', 'ECONOMICS', 'PEACE', 'MEDICINE'],
          category: "Nobel Prize Categories"
        },
        {
          words: ['ZINFANDEL', 'RIESLING', 'SHIRAZ', 'MALBEC'],
          category: "Wine Varieties"
        },
        {
          words: ['TARIFF', 'SUBSIDY', 'INFLATION', 'GDP'],
          category: "Economic Terms"
        },
        
        // Game 25
        {
          words: ['TRAGEDY', 'MYTH', 'ALLEGORY', 'COMEDY'],
          category: "Genres of Literature"
        },
        {
          words: ['CRIMSON', 'CHERRY', 'SCARLET', 'BURGUNDY'],
          category: "Shades of Red"
        },
        {
          words: ['GARNET', 'OPAL', 'SAPPHIRE', 'TOPAZ'],
          category: "Precious Stones"
        },
        {
          words: ['BASIE', 'DAVIS', 'HANCOCK', 'COLTRANE'],
          category: "Jazz Musicians"
        },
        
        // Game 26
        {
          words: ['CALLISTO', 'IO', 'DEIMOS', 'TITAN'],
          category: "Satellites (Moons)"
        },
        {
          words: ['ID', 'SUPEREGO', 'ARCHETYPE', 'NEUROSIS'],
          category: "Psychological Terms"
        },
        {
          words: ['DOCUMENTARY', 'THRILLER', 'COMEDY', 'DRAMA'],
          category: "Movie Genres"
        },
        {
          words: ['TANGO', 'SALSA', 'WALTZ', 'CHA-CHA'],
          category: "Dances"
        },
        
        // Game 27
        {
          words: ['BAROQUE', 'IMPRESSIONISM', 'FUTURISM', 'SURREALISM'],
          category: "Art Movements"
        },
        {
          words: ['DRAMA', 'SATIRE', 'EPIC', 'FABLE'],
          category: "Genres of Literature"
        },
        {
          words: ['SHIRAZ', 'ZINFANDEL', 'CHARDONNAY', 'CABERNET'],
          category: "Wine Varieties"
        },
        {
          words: ['GRIFFIN', 'MINOTAUR', 'PHOENIX', 'KRAKEN'],
          category: "Mythical Creatures"
        },
        
        // Game 28
        {
          words: ['GALILEO', 'EINSTEIN', 'NEWTON', 'HAWKING'],
          category: "Famous Scientists"
        },
        {
          words: ['PEGASUS', 'LYRA', 'ANDROMEDA', 'CYGNUS'],
          category: "Constellations"
        },
        {
          words: ['ALTOCUMULUS', 'STRATUS', 'ALTOSTRATUS', 'CIRRUS'],
          category: "Cloud Types"
        },
        {
          words: ['GRIFFIN', 'DRAGON', 'BASILISK', 'MINOTAUR'],
          category: "Mythical Creatures"
        },
        
        // Game 29
        {
          words: ['RUBY', 'EMERALD', 'AMETHYST', 'DIAMOND'],
          category: "Precious Stones"
        },
        {
          words: ['SURREALISM', 'RENAISSANCE', 'DADAISM', 'CUBISM'],
          category: "Art Movements"
        },
        {
          words: ['EUROPA', 'TRITON', 'DEIMOS', 'CALLISTO'],
          category: "Satellites (Moons)"
        },
        {
          words: ['POSEIDON', 'ATHENA', 'HADES', 'ARTEMIS'],
          category: "Greek Gods"
        },
        
        // Game 30
        {
          words: ['IOS', 'UBUNTU', 'ANDROID', 'MACOS'],
          category: "Operating Systems"
        },
        {
          words: ['TEMPORAL', 'FRONTAL', 'OCCIPITAL', 'PARIETAL'],
          category: "Brain Lobes"
        },
        {
          words: ['HYDRA', 'MINOTAUR', 'GRIFFIN', 'PHOENIX'],
          category: "Mythical Creatures"
        },
        {
          words: ['SPAGHETTI', 'RAVIOLI', 'MACARONI', 'PENNE'],
          category: "Types of Pasta"
        },
        
        // Game 31
        {
          words: ['LOGIC', 'OBJECT-ORIENTED', 'DECLARATIVE', 'EVENT-DRIVEN'],
          category: "Programming Paradigms"
        },
        {
          words: ['DRAMA', 'TRAGEDY', 'SATIRE', 'EPIC'],
          category: "Genres of Literature"
        },
        {
          words: ['ECONOMICS', 'CHEMISTRY', 'LITERATURE', 'MEDICINE'],
          category: "Nobel Prize Categories"
        },
        {
          words: ['BURGUNDY', 'SCARLET', 'CRIMSON', 'CARMINE'],
          category: "Shades of Red"
        },
        
        // Game 32
        {
          words: ['VIVALDI', 'HAYDN', 'TCHAIKOVSKY', 'HANDEL'],
          category: "Classical Composers"
        },
        {
          words: ['SKULL', 'FEMUR', 'TIBIA', 'SPINE'],
          category: "Bones"
        },
        {
          words: ['LOGIC', 'DECLARATIVE', 'IMPERATIVE', 'REACTIVE'],
          category: "Programming Paradigms"
        },
        {
          words: ['DASH', 'COMMA', 'COLON', 'HYPHEN'],
          category: "Punctuation Marks"
        },
        
        // Game 33
        {
          words: ['CONDENSATE', 'IONIZED', 'SUPERFLUID', 'SOLID'],
          category: "Chemical States"
        },
        {
          words: ['ALTOCUMULUS', 'ALTOSTRATUS', 'NIMBOSTRATUS', 'CUMULUS'],
          category: "Cloud Types"
        },
        {
          words: ['NIETZSCHE', 'HUME', 'SOCRATES', 'KANT'],
          category: "Philosophers"
        },
        {
          words: ['GDP', 'SUBSIDY', 'RECESSION', 'INFLATION'],
          category: "Economic Terms"
        },
        
        // Game 34
        {
          words: ['GALAHAD', 'BEDIVERE', 'LANCELOT', 'PERCIVAL'],
          category: "Knights of the Round Table"
        },
        {
          words: ['OCCIPITAL', 'FRONTAL', 'TEMPORAL', 'PARIETAL'],
          category: "Brain Lobes"
        },
        {
          words: ['RECESSION', 'SUBSIDY', 'SURPLUS', 'TAX'],
          category: "Economic Terms"
        },
        {
          words: ['MERLOT', 'CABERNET', 'SHIRAZ', 'CHARDONNAY'],
          category: "Wine Varieties"
        },
        
        // Game 35
        {
          words: ['GARNET', 'CARMINE', 'BURGUNDY', 'RUBY'],
          category: "Shades of Red"
        },
        {
          words: ['CASTLE', 'QUEEN', 'KNIGHT', 'ROOK'],
          category: "Chess Pieces"
        },
        {
          words: ['REACT', 'ANGULAR', 'SPRING', 'FLASK'],
          category: "Programming Frameworks"
        },
        {
          words: ['BALLET', 'WALTZ', 'CHA-CHA', 'JIVE'],
          category: "Dances"
        },
        
        // Game 36
        {
          words: ['OCCIPITAL', 'FRONTAL', 'PARIETAL', 'TEMPORAL'],
          category: "Brain Lobes"
        },
        {
          words: ['STRATUS', 'NIMBOSTRATUS', 'NIMBUS', 'CUMULONIMBUS'],
          category: "Cloud Types"
        },
        {
          words: ['CYGNUS', 'ANDROMEDA', 'DRACO', 'CASSIOPEIA'],
          category: "Constellations"
        },
        {
          words: ['ZINFANDEL', 'RIESLING', 'PINOT', 'MERLOT'],
          category: "Wine Varieties"
        },
        
        // Game 37
        {
          words: ['GOUDA', 'PARMESAN', 'CAMEMBERT', 'CHEDDAR'],
          category: "Types of Cheese"
        },
        {
          words: ['RAILS', 'REACT', 'FLASK', 'SPRING'],
          category: "Programming Frameworks"
        },
        {
          words: ['OPAL', 'TOPAZ', 'EMERALD', 'DIAMOND'],
          category: "Precious Stones"
        },
        {
          words: ['ELEGY', 'BALLAD', 'ODE', 'LIMERICK'],
          category: "Types of Poems"
        },
        
        // Game 38
        {
          words: ['LITERATURE', 'PEACE', 'PHYSICS', 'CHEMISTRY'],
          category: "Nobel Prize Categories"
        },
        {
          words: ['LITECOIN', 'BITCOIN', 'CARDANO', 'POLKADOT'],
          category: "Cryptocurrencies"
        },
        {
          words: ['THANATOPHOBIA', 'ACROPHOBIA', 'TRYPOPHOBIA', 'NYCTOPHOBIA'],
          category: "Phobias"
        },
        {
          words: ['DEFICIT', 'SURPLUS', 'GDP', 'TARIFF'],
          category: "Economic Terms"
        },
        
        // Game 39
        {
          words: ['ALLEGORY', 'COMEDY', 'EPIC', 'MYTH'],
          category: "Genres of Literature"
        },
        {
          words: ['REACT', 'VUE', 'ANGULAR', 'SPRING'],
          category: "Programming Frameworks"
        },
        {
          words: ['ECONOMICS', 'CHEMISTRY', 'MEDICINE', 'LITERATURE'],
          category: "Nobel Prize Categories"
        },
        {
          words: ['MOZZARELLA', 'BRIE', 'PARMESAN', 'FETA'],
          category: "Types of Cheese"
        },
        
        // Game 40
        {
          words: ['GIRL WITH A PEARL EARRING', 'GUERNICA', 'THE PERSISTENCE OF MEMORY', 'AMERICAN GOTHIC'],
          category: "Famous Paintings"
        },
        {
          words: ['MERLOT', 'PINOT', 'ZINFANDEL', 'MALBEC'],
          category: "Wine Varieties"
        },
        {
          words: ['FARFALLE', 'PENNE', 'SPAGHETTI', 'MACARONI'],
          category: "Types of Pasta"
        },
        {
          words: ['JIVE', 'TANGO', 'BALLET', 'WALTZ'],
          category: "Dances"
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