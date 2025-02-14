import { motion } from "framer-motion";

interface HexGridProps {
  letters: string;
  centerLetter: string;
}

export default function HexGrid({ letters, centerLetter }: HexGridProps) {
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
            <circle
              cx={point[0]}
              cy={point[1]}
              r={size}
              className="fill-primary stroke-secondary"
              strokeWidth="2"
            />
            <text
              x={point[0]}
              y={point[1]}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-2xl font-bold fill-secondary select-none"
            >
              {letters[i]}
            </text>
          </motion.g>
        ))}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <circle
            cx={centerX}
            cy={centerY}
            r={size}
            className="fill-secondary stroke-primary"
            strokeWidth="2"
          />
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-2xl font-bold fill-primary select-none"
          >
            {centerLetter}
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
