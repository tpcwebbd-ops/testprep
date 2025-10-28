'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

// A generic interface for the expected API response items
interface IResponseData {
  id: number | string;
  name: string;
  [key: string]: unknown; // Allow other properties
}

interface MultiSelectProps {
  label?: string;
  placeholder?: string;
  defaultSelected?: string[];
  apiUrl?: string;
  onSelectionChange?: (selectedItems: string[]) => void;
  readOnly?: boolean;
}

const MultiSelect = ({
  label = 'Select Data',
  placeholder = 'Select an option',
  defaultSelected = [],
  apiUrl = 'https://jsonplaceholder.typicode.com/users',
  onSelectionChange,
  readOnly = false,
}: MultiSelectProps) => {
  const [availableData, setAvailableData] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>(defaultSelected);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const json = await response.json();
        // Extract names from the API response, handling potential nested data
        const names = (json.data || json).map((item: IResponseData) => item.name);
        setAvailableData(names);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  // Update internal state if the defaultSelected prop changes
  useEffect(() => {
    if (JSON.stringify(defaultSelected) !== JSON.stringify(selectedItems)) {
      setSelectedItems(defaultSelected);
    }
  }, [defaultSelected, selectedItems]);

  // Notify parent component when the selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedItems);
    }
  }, [selectedItems, onSelectionChange]);

  // Handle selection of a new item
  const handleSelect = (value: string) => {
    if (!readOnly && !selectedItems.includes(value)) {
      setSelectedItems(prev => [...prev, value]);
    }
  };

  // Handle removal of a selected item
  const handleRemove = (itemToRemove: string) => {
    if (!readOnly) {
      setSelectedItems(prev => prev.filter(item => item !== itemToRemove));
    }
  };

  // Filter out already selected items from the dropdown
  const availableOptions = availableData.filter(item => !selectedItems.includes(item));

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="multiselect" className="text-right">
          {label}
        </Label>
        <div className="col-span-3">
          <Select onValueChange={handleSelect} disabled={readOnly || isLoading || availableOptions.length === 0}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {isLoading ? (
                  <SelectLabel className="p-2 text-center text-gray-500">Loading...</SelectLabel>
                ) : error ? (
                  <SelectLabel className="p-2 text-center text-red-500">{error}</SelectLabel>
                ) : availableOptions.length === 0 ? (
                  <SelectLabel className="p-2 text-center text-gray-500">No options left</SelectLabel>
                ) : (
                  availableOptions.map((item, index) => (
                    <SelectItem key={`${item}-${index}`} className="cursor-pointer" value={item}>
                      {item}
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Display selected items as badges */}
      {selectedItems.length > 0 && (
        <div className="grid grid-cols-4 items-start gap-4">
          <div className="col-start-2 col-span-3 flex flex-wrap gap-2">
            {selectedItems.map((item, index) => (
              <Badge key={`selected-${item}-${index}`} variant="secondary" className="flex items-center gap-1">
                {item}
                {!readOnly && (
                  <button type="button" className="p-0.5 rounded-full hover:bg-gray-300" onClick={() => handleRemove(item)} aria-label={`Remove ${item}`}>
                    <X className="h-3 w-3" />
                  </button>
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
