/*
|-----------------------------------------
| setting up JsonTextareaField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: template-generator, October, 2025
|-----------------------------------------
*/

'use client'

import React, { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'

interface JsonTextareaFieldProps {
    id: string
    value: unknown // The value from the parent state (can be unknown object)
    onChange: (jsonValue: unknown) => void // Callback to update the parent state
}

const JsonTextareaField: React.FC<JsonTextareaFieldProps> = ({
    id,
    value,
    onChange,
}) => {
    const [textValue, setTextValue] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        try {
            // Pretty-print the incoming object value
            const formattedJson = JSON.stringify(value, null, 2)
            setTextValue(formattedJson as string)
            setError(null)
        } catch (e) {
            setTextValue('Error formatting JSON' + e)
            setError('The provided initial value is not a valid object.')
        }
    }, [value])

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value
        setTextValue(newText)

        try {
            const parsedJson = JSON.parse(newText)
            setError(null)
            onChange(parsedJson)
        } catch (err) {
            setError('Invalid JSON format.' + err)
        }
    }

    return (
        <div className="w-full">
            <Textarea
                id={id}
                value={textValue}
                onChange={handleTextChange}
                className={`w-full min-h-[150px] font-mono text-sm ${
                    error ? 'border-red-500 focus-visible:ring-red-500' : ''
                }`}
                placeholder="Enter valid JSON here..."
            />
            {error && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    )
}

export default JsonTextareaField
