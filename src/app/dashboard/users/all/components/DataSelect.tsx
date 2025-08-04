/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

'use client';

import React, { useState, useEffect } from 'react';

import MultiSelect from './MultiSelect';

interface DataSelectProps {
  newItemTags: string[];
  setNewItemTags: (payload: string[]) => void;
  label?: string;
  placeholder?: string;
}

export default function DataSelect({ newItemTags, setNewItemTags, label = 'Select Tags', placeholder = 'Choose tags for your item' }: DataSelectProps) {
  const [currentSelection, setCurrentSelection] = useState<string[]>(newItemTags);
  useEffect(() => {
    if (JSON.stringify(newItemTags) !== JSON.stringify(currentSelection)) {
      setCurrentSelection(newItemTags);
    }
  }, [newItemTags, currentSelection]);

  const handleSelectionChange = (newSelectionFromMultiSelect: string[]) => {
    if (JSON.stringify(newSelectionFromMultiSelect) !== JSON.stringify(currentSelection)) {
      setCurrentSelection(newSelectionFromMultiSelect);
      setNewItemTags(newSelectionFromMultiSelect);
    } else {
      if (newSelectionFromMultiSelect !== currentSelection) {
        setCurrentSelection(newSelectionFromMultiSelect);
      }
    }
  };
  if (!placeholder) {
    placeholder = 'select';
  }
  return (
    <div className="container mx-auto">
      <form id="add-form" className="space-y-4">
        <MultiSelect label={label} placeholder={placeholder || 'select'} defaultSelected={currentSelection} onSelectionChange={handleSelectionChange} />
      </form>
    </div>
  );
}
