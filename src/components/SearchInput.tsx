import React, { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";

interface SearchInputProps {
  onSearch: (symbol: string) => void;
  isLoading?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim().toUpperCase());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Ticker (e.g. NVDA, AAPL)..."
          className="w-full bg-white border border-black/5 rounded-2xl py-3 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all shadow-sm"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {isLoading && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2">
          <Loader2 className="animate-spin text-zinc-400" size={16} />
        </div>
      )}
    </form>
  );
};
