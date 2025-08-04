/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MultiSelectProps {
  label?: string;
  placeholder?: string;
  defaultSelected?: string[];
  onSelectionChange?: (selectedItems: string[]) => void;
  readOnly?: boolean;
}

const MultiSelect = ({
  label = 'Select Data',
  placeholder = 'Select an option',
  defaultSelected = [],
  onSelectionChange,
  readOnly = false,
}: MultiSelectProps) => {
  const availableData = ['admin', 'product manager', 'order manager'];
  const [selectedItems, setSelectedItems] = useState<string[]>(defaultSelected);

  // Update selected items from props when they change
  useEffect(() => {
    setSelectedItems(defaultSelected);
  }, [defaultSelected]);

  // Notify parent component when selections change
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedItems);
    }
  }, [selectedItems, onSelectionChange]);

  // Handle selection of an item
  const handleSelect = (value: string) => {
    if (!readOnly) {
      setSelectedItems(prev => {
        // Skip if already selected
        if (prev.includes(value)) return prev;
        return [...prev, value];
      });
    }
  };

  // Remove an item from selection
  const handleRemove = (itemToRemove: string) => {
    if (!readOnly) {
      setSelectedItems(prev => prev.filter(item => item !== itemToRemove));
    }
  };

  // Get available options (exclude already selected items)
  const getAvailableOptions = () => {
    return availableData.filter(item => !selectedItems.includes(item));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 justify-between">
        <div className="w-full">
          <Label htmlFor="multiselect" className="text-right">
            {label}
          </Label>
        </div>
        <div className="w-full">
          <Select onValueChange={handleSelect} disabled={readOnly || getAvailableOptions().length === 0}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-slate-50 max-h-60">
              <SelectGroup>
                {getAvailableOptions().length === 0 ? (
                  <SelectItem value="user" disabled className="p-2 text-center text-gray-500">
                    No options available
                  </SelectItem>
                ) : (
                  getAvailableOptions().map((item, index) => (
                    <SelectItem key={`${item}-${index}`} className="cursor-pointer hover:bg-slate-200" value={item}>
                      {item}
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Display selected items */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap items-start gap-4 -ml-2">
          <div className="col-span-3 flex flex-wrap gap-2">
            {selectedItems.map((item, index) => (
              <Badge key={`selected-${item}-${index}`} variant="secondary">
                {item}
                {!readOnly && (
                  <Button type="button" variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1 cursor-pointer" onClick={() => handleRemove(item)}>
                    <X className="h-3 w-3 cursor-pointer" />
                    <span className="sr-only">Remove {item}</span>
                  </Button>
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
