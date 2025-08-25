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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IResponseData {
  id: number;
  name: string;
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
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const json = await response.json();
        // Extract names from the API response
        const names = json.map((item: IResponseData) => item.name);
        setAvailableData(names);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

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
          <Select onValueChange={handleSelect} disabled={readOnly || isLoading || getAvailableOptions().length === 0} defaultValue={'Please select an option'}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder || 'Please select an option'} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {isLoading ? (
                  <SelectLabel className="p-2 text-center text-gray-500">Loading options...</SelectLabel>
                ) : error ? (
                  <SelectLabel className="p-2 text-center text-red-500">{error}</SelectLabel>
                ) : getAvailableOptions().length === 0 ? (
                  <SelectLabel className="p-2 text-center text-gray-500">No options available</SelectLabel>
                ) : (
                  getAvailableOptions().map((item, index) => (
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
