import { Button } from "@/components/ui/button";
import { DeleteIcon } from "lucide-react";

type KeyStatus = "correct" | "present" | "absent" | "unused";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyboardStatus: Record<string, KeyStatus>;
}

export default function Keyboard({ onKeyPress, keyboardStatus }: KeyboardProps) {
  // Keyboard rows
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"]
  ];

  const getKeyColor = (key: string) => {
    const status = keyboardStatus[key] || "unused";
    switch(status) {
      case "correct":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "present":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "absent":
        return "bg-gray-500 hover:bg-gray-600 text-white";
      default:
        return "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600";
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-2 gap-1">
          {row.map((key) => (
            <Button
              key={key}
              onClick={() => onKeyPress(key)}
              className={`${getKeyColor(key)} ${
                key === "ENTER" || key === "DELETE" ? "px-2 text-xs" : "px-3"
              } h-12 font-bold`}
              style={{ minWidth: key === "ENTER" ? "65px" : key === "DELETE" ? "65px" : "40px" }}
            >
              {key === "DELETE" ? <DeleteIcon size={18} /> : key}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
}