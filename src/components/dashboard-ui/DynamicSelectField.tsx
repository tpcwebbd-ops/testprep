// DynamicSelectField.tsx
'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { X, ChevronDown, Search, Check, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface DynamicSelectFieldProps {
  id?: string;
  label?: string;
  value: string[] | undefined | null;
  onChange: (newValues: string[]) => void;
  apiUrl?: string;
  placeholder?: string;
  readOnly?: boolean;
  dataMapper?: (item: IResponseData) => string;
}

interface IResponseData {
  id: number;
  name: string;
}

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000;

export default function DynamicSelectField({
  id,
  label = 'Select One',
  value,
  onChange,
  apiUrl = 'https://jsonplaceholder.typicode.com/users',
  placeholder = 'Search and select...',
  readOnly = false,
  dataMapper = (item: IResponseData) => item.name,
}: DynamicSelectFieldProps) {
  const [availableData, setAvailableData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const safeValue = value ?? [];

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const json = await response.json();

        const mapped = json.map(dataMapper);
        setAvailableData(Array.from(new Set(mapped)));
        setIsLoading(false);
        return;
      } catch (err) {
        if (attempt === MAX_RETRIES) {
          setError('Failed to load options. Try again.');
          setIsLoading(false);
        } else {
          await new Promise(res => setTimeout(res, RETRY_DELAY));
        }
      }
    }
  }, [apiUrl, dataMapper]);

  useEffect(() => {
    fetchData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredOptions = useMemo(
    () => availableData.filter(item => !safeValue.includes(item)).filter(item => item.toLowerCase().includes(searchTerm.toLowerCase())),
    [availableData, safeValue, searchTerm],
  );

  const handleSelect = (item: string) => {
    if (readOnly) return;
    onChange([...safeValue, item]);
    setSearchTerm('');
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleRemove = (item: string) => {
    if (readOnly) return;
    onChange(safeValue.filter(i => i !== item));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(filteredOptions[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={cn('relative space-y-1.5 w-full max-w-2xl', isOpen && 'mb-64')} ref={wrapperRef}>
      {label && (
        <Label htmlFor={id} className="text-white">
          {label}
        </Label>
      )}

      {/* --- Select Trigger Box --- */}
      <div
        id={id}
        className={cn(
          'relative flex items-center min-h-[44px] w-full rounded-lg border border-white/20 px-3 py-2 text-sm backdrop-blur-lg bg-white/10 text-white transition-all',
          readOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          isOpen && 'ring-2 ring-white/40 shadow-lg',
        )}
        onClick={() => !readOnly && setIsOpen(!isOpen)}
      >
        <span className="flex-1 text-white/80">{safeValue.length > 0 ? `${safeValue.length} selected` : placeholder}</span>

        {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
        {error && <AlertCircle className="h-4 w-4 text-rose-400" />}
        {!isLoading && !error && <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />}
      </div>

      {/* --- Dropdown --- */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 z-50 bg-white/10 backdrop-blur-xl shadow-xl rounded-lg border border-white/20 text-white animate-in fade-in-0 zoom-in-95">
          {/* Search field */}
          <div className="p-2 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
              <input
                autoFocus
                type="text"
                className="w-full rounded bg-transparent pl-9 pr-3 py-1 text-sm text-white placeholder-white/40 focus:outline-none"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-y-auto p-1">
            {error ? (
              <div className="text-center text-sm text-rose-300 py-3 space-y-2">
                <AlertCircle className="w-5 h-5 mx-auto" />
                <span>{error}</span>
                <Button variant="outlineWater" size="sm" onClick={fetchData}>
                  Retry
                </Button>
              </div>
            ) : filteredOptions.length > 0 ? (
              <ul className="space-y-1">
                {filteredOptions.map((item, idx) => (
                  <li
                    key={item}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      'flex justify-between items-center px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-white/20',
                      activeIndex === idx && 'bg-white/30',
                    )}
                  >
                    {item}
                    {safeValue.includes(item) && <Check className="w-4 h-4" />}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-sm text-white/50 py-3">{isLoading ? 'Loading...' : 'No results'}</p>
            )}
          </div>
        </div>
      )}

      {/* --- Selected Tags --- */}
      {safeValue.length > 0 && !isOpen && (
        <div className="flex flex-wrap gap-2 pt-2">
          {safeValue.map((item, i) => (
            <div
              key={`${item}-${i}`}
              className="flex items-center gap-1.5 bg-white/20 backdrop-blur-lg px-2.5 py-1 rounded-full text-xs font-medium text-white"
            >
              {item}
              {!readOnly && (
                <button type="button" onClick={() => handleRemove(item)} className="hover:bg-white/30 rounded-full p-1">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
