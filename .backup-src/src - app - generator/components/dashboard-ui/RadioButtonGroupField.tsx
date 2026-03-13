// RadioButtonGroupField.tsx

import * as React from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

// Define the shape of each individual radio option for type safety
export interface RadioOption {
    value: string
    label: string
}

// Define a clear and robust props interface for the entire component
export interface RadioButtonGroupFieldProps {
    // The currently selected value, controlled by the parent form
    value: string | undefined
    // The callback to notify the parent when the value changes
    onChange: (value: string) => void
    // An array of options to be rendered dynamically
    options?: RadioOption[]
    // A main label for the entire group, important for accessibility
    label?: string
    // Optional className for custom styling
    className?: string
}

export function RadioButtonGroupField({
    value,
    onChange,
    options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
    ],
    label,
    className,
}: RadioButtonGroupFieldProps) {
    // The component is now fully controlled and stateless.
    let updateOptions: RadioOption[] = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
    ]
    if (options?.length > 0) {
        updateOptions = options
    }
    return (
        // Using a <fieldset> is semantically correct for grouping radio buttons
        <fieldset className={cn('grid w-full items-center gap-2.5', className)}>
            {/* The <legend> acts as the accessible label for the entire group */}
            {label && (
                <legend className="text-sm font-medium leading-none">
                    {label}
                </legend>
            )}
            <RadioGroup
                value={value}
                onValueChange={onChange}
                className="flex flex-col gap-2"
            >
                {updateOptions.map((option) => (
                    <div
                        key={option.value}
                        className="flex items-center space-x-2"
                    >
                        <RadioGroupItem
                            value={option.value}
                            id={`radio-option-${option.value}`}
                        />
                        <Label htmlFor={`radio-option-${option.value}`}>
                            {option.label}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </fieldset>
    )
}

RadioButtonGroupField.displayName = 'RadioButtonGroupField'
