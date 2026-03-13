// CheckboxField.tsx

'use client'

import * as React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// Define a clear props interface for type safety and component API clarity
export interface CheckboxFieldProps {
    id?: string
    // The checked state, controlled by the parent form
    checked: boolean
    // The callback to notify the parent when the state changes
    onCheckedChange: (checked: boolean) => void
    // The label content, can be a string or other React nodes
    label?: React.ReactNode
    // Optional className for custom styling of the wrapper
    className?: string
}

export function CheckboxField({
    id = Math.random().toString(),
    checked,
    onCheckedChange,
    label,
    className,
}: CheckboxFieldProps) {
    if (label) {
        return (
            <div className={cn('flex items-center space-x-2', className)}>
                <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={onCheckedChange}
                />
                <Label
                    htmlFor={id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {label}
                </Label>
            </div>
        )
    } else {
        return (
            <div
                className={cn(
                    'flex justify-end items-center space-x-2',
                    className
                )}
            >
                <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={onCheckedChange}
                />
            </div>
        )
    }
}

CheckboxField.displayName = 'CheckboxField'
