/* |-----------------------------------------
| JSON Editor Textarea Field
| Enhancements: Format button + safer syncing
| Author: Toufiquer Rahman <toufiquer.0@gmail.com>
|----------------------------------------- */

'use client';

import React, { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, X, Code } from 'lucide-react';

interface JsonTextareaFieldProps {
  id: string;
  value?: string;
  onChange: (jsonValue: unknown) => void;
}

const JsonTextareaField: React.FC<JsonTextareaFieldProps> = ({ id, value, onChange }) => {
  const [textValue, setTextValue] = useState<string>(value || '{}');
  const [error, setError] = useState<string | null>(null);
  const lastValidRef = useRef<string>(''); // keep last valid JSON

  const validateJson = (jsonText: string) => {
    try {
      const parsed = JSON.parse(jsonText);
      setError(null);
      lastValidRef.current = jsonText;
      onChange(parsed);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setTextValue(newText);
    validateJson(newText);
  };

  const handleFormat = () => {
    try {
      const parsedJson = JSON.parse(textValue); // Ensure consistent typing
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      setTextValue(formattedJson);
      lastValidRef.current = formattedJson;
      setError(null);
    } catch {
      setError('Unable to format JSON.');
    }
  };

  const handleReset = () => {
    setTextValue(lastValidRef.current);
    setError(null);
    validateJson(lastValidRef.current);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          {error ? (
            <Badge className="bg-rose-500/50 text-white flex items-center gap-1">
              <X size={14} /> Invalid JSON
            </Badge>
          ) : (
            <Badge className="bg-green-500/50 text-white flex items-center gap-1">
              <Check size={14} /> Valid JSON
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button size="xs" variant="outlineWater" onClick={handleFormat}>
            <Code size={14} className="mr-1" />
            Format
          </Button>

          {error && (
            <Button size="xs" variant="ghost" onClick={handleReset}>
              Undo
            </Button>
          )}
        </div>
      </div>

      <Textarea
        id={id}
        spellCheck={false}
        value={textValue}
        onChange={handleTextChange}
        className={cn(
          'w-full min-h-[200px] resize-y font-mono text-sm focus-visible:ring-2',
          error ? 'border-red-500 focus-visible:ring-red-500' : 'border-green-500 focus-visible:ring-green-500',
        )}
        placeholder="Enter valid JSON here..."
      />

      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default JsonTextareaField;
