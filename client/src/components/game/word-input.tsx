import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WordInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (word: string) => void;
  isSubmitting: boolean;
}

export default function WordInput({ value, onChange, onSubmit, isSubmitting }: WordInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.length >= 4) {
      onSubmit(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value.toLowerCase())}
        placeholder="Click letters or type (4+ letters)"
        className="flex-1 text-foreground placeholder:text-muted-foreground"
        minLength={4}
        disabled={isSubmitting}
      />
      <Button type="submit" disabled={value.length < 4 || isSubmitting}>
        Submit
      </Button>
    </form>
  );
}