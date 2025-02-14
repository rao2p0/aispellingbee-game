import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WordInputProps {
  onSubmit: (word: string) => void;
  isSubmitting: boolean;
}

export default function WordInput({ onSubmit, isSubmitting }: WordInputProps) {
  const [word, setWord] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.length >= 4) {
      onSubmit(word);
      setWord("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <Input
        value={word}
        onChange={(e) => setWord(e.target.value.toLowerCase())}
        placeholder="Enter a word (4+ letters)"
        className="flex-1"
        minLength={4}
        disabled={isSubmitting}
      />
      <Button type="submit" disabled={word.length < 4 || isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
