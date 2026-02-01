// MultiCheckboxGroupField.tsx

'use client'

import * as React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// Define the shape of a single checkbox option for clarity and type safety
export interface CheckboxOption {
    value: string
    label: string
}

// Define a clear and robust props interface for the entire component
export interface MultiCheckboxGroupFieldProps {
    // The array of currently selected values, controlled by the parent
    value: string[] | undefined
    // The callback to notify the parent of the new array of selected values
    onChange: (newValue: string[]) => void
    // An array of all possible options to render
    options?: CheckboxOption[]
    // A main label for the entire group, crucial for accessibility
    label?: string
    // Optional className for custom styling
    className?: string
}

export default function MultiCheckboxGroupField({
    value,
    onChange,
    options = [],
    label,
    className,
}: MultiCheckboxGroupFieldProps) {
    // Handler for when a single checkbox's state changes
    const handleCheckboxChange = (itemValue: string, isChecked: boolean) => {
        const currentValue = value ?? [] // Gracefully handle if the initial value is undefined

        if (isChecked) {
            // If checked, add the value to the array (ensuring no duplicates)
            onChange([...new Set([...currentValue, itemValue])])
        } else {
            // If unchecked, remove the value from the array
            onChange(currentValue.filter((v) => v !== itemValue))
        }
    }

    let updateCheckboxOptions: CheckboxOption[] = [
        { label: 'Book 1', value: 'book1' },
        { label: 'Book 2', value: 'book2' },
        { label: 'Book 3', value: 'book3' },
    ]
    if (options?.length > 0) {
        updateCheckboxOptions = options
    }

    return (
        // Use a <fieldset> for semantic grouping and better accessibility
        <fieldset className={cn('grid w-full gap-2.5', className)}>
            {/* Use a <legend> for the group's main label */}
            {label && (
                <legend className="text-sm font-medium leading-none mb-1">
                    {label}
                </legend>
            )}

            <div className="flex flex-col gap-2">
                {/* Dynamically render checkboxes from the options prop */}
                {updateCheckboxOptions.map((option) => (
                    <div
                        key={option.value}
                        className="flex items-center space-x-2"
                    >
                        <Checkbox
                            id={`checkbox-${option.value}`} // Generate a unique and stable ID
                            // Determine if this checkbox is checked by seeing if its value is in the prop array
                            checked={value?.includes(option.value) ?? false}
                            // The `onCheckedChange` from the shadcn component provides a boolean
                            onCheckedChange={(isChecked) => {
                                handleCheckboxChange(
                                    option.value,
                                    isChecked as boolean
                                )
                            }}
                        />
                        {/* The Label is now correctly associated with its specific checkbox */}
                        <Label htmlFor={`checkbox-${option.value}`}>
                            {option.label}
                        </Label>
                    </div>
                ))}
            </div>
        </fieldset>
    )
}

MultiCheckboxGroupField.displayName = 'MultiCheckboxGroupField'
