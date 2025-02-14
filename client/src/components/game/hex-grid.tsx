import { motion } from "framer-motion";

interface HexGridProps {
  letters: string;
  centerLetter: string;
  onLetterClick: (letter: string) => void;
}

export default function HexGrid({ letters, centerLetter, onLetterClick }: HexGridProps) {
  const size = 50;
  const width = size * 2;
  const height = Math.sqrt(3) * size;
  const centerX = width * 2;
  const centerY = height * 2;

  const hexPoints = [
    [centerX, centerY - height],
    [centerX + width * 0.866, centerY - height * 0.5],
    [centerX + width * 0.866, centerY + height * 0.5],
    [centerX, centerY + height],
    [centerX - width * 0.866, centerY + height * 0.5],
    [centerX - width * 0.866, centerY - height * 0.5],
  ];

  const HexButton = ({ x, y, letter, isCenter = false }: { x: number; y: number; letter: string; isCenter?: boolean }) => (
    <motion.g
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{ cursor: 'pointer' }}
      onClick={() => onLetterClick(letter)}
    >
      <circle
        cx={x}
        cy={y}
        r={size}
        className={`${isCenter ? 'fill-secondary stroke-primary' : 'fill-primary stroke-secondary'} transition-colors duration-200 hover:brightness-110`}
        strokeWidth="2"
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className={`text-2xl font-bold select-none ${isCenter ? 'fill-primary' : 'fill-secondary'}`}
      >
        {letter}
      </text>
    </motion.g>
  );

  return (
    <div className="flex justify-center items-center">
      <svg width={width * 4} height={height * 4} viewBox={`0 0 ${width * 4} ${height * 4}`}>
        {hexPoints.map((point, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <HexButton x={point[0]} y={point[1]} letter={letters[i]} />
          </motion.g>
        ))}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <HexButton x={centerX} y={centerY} letter={centerLetter} isCenter={true} />
        </motion.g>
      </svg>
    </div>
  );
}