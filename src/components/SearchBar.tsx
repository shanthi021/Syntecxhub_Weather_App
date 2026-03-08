import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
  onSearch: (city: string) => void;
  loading: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-md mx-auto"
    >
      <div className="glass-card flex items-center rounded-2xl px-4 py-3 gap-3">
        <Search className="w-5 h-5 text-muted-foreground shrink-0" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search city..."
          className="bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground font-display"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-primary text-primary-foreground px-4 py-1.5 rounded-xl text-sm font-semibold disabled:opacity-40 transition-opacity shrink-0"
        >
          {loading ? "..." : "Go"}
        </button>
      </div>
    </motion.form>
  );
}
