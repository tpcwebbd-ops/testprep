'use client';

import { Search, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  debounceTime?: number;
}

export default function SearchBox({ onSearch, placeholder = 'Search...', autoFocus = false, debounceTime = 1000 }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Focus input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Debounce search to avoid too many requests
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Always trigger onSearch, even with empty query
    // This allows the parent component to clear results when input is empty
    setIsTyping(true);
    debounceTimerRef.current = setTimeout(() => {
      onSearch(query);
      setIsTyping(false);
    }, debounceTime);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, debounceTime, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      onSearch(query);
      setIsTyping(false);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    onSearch('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full py-2 pl-10 pr-10 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>

        {query.length > 0 && (
          <button onClick={handleClearSearch} className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" aria-label="Clear search">
            <X size={18} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}

        {isTyping && query.length > 0 && (
          <div className="absolute inset-y-0 right-8 flex items-center">
            <div className="w-4 h-4 border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
