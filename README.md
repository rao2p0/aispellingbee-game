
# Spell Bee - Word Puzzle Game

A web-based word puzzle game inspired by the popular spelling bee format. Players create words using a set of letters while ensuring each word contains the required center letter.

## Features

- Daily puzzles with varying difficulty levels
- Easy mode for more accessible gameplay
- Score tracking and statistics
- Word validation against a curated English dictionary
- Responsive design for desktop and mobile
- Dark/Light theme support
- Share functionality for scores and achievements

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Node.js, Express
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Styling**: Tailwind CSS, CSS Modules
- **Charts**: Recharts (for statistics)

## Getting Started

1. Clone the repository in Replit
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

The app will be available at port 5000.

## Project Structure

```
├── client/           # Frontend React application
│   ├── public/       # Static assets
│   └── src/         
│       ├── components/  # Reusable UI components
│       ├── hooks/      # Custom React hooks
│       ├── lib/        # Utility functions
│       └── pages/      # Page components
├── server/           # Backend Express server
│   ├── services/     # Business logic
│   └── routes.ts     # API endpoints
└── shared/           # Shared TypeScript types
```

## Game Rules

1. Create words using the available letters
2. Each word must:
   - Contain at least 4 letters
   - Include the center letter
   - Only use the provided letters
3. Letters can be reused to form words
4. Scoring:
   - 4 letters: 1 point
   - 5+ letters: 1 point per letter

## API Endpoints

- `GET /api/puzzle` - Get current puzzle
- `POST /api/puzzle/new` - Generate new puzzle
- `POST /api/validate` - Validate a word
- `GET /api/puzzle/words` - Get valid words for puzzle

## License

MIT License
