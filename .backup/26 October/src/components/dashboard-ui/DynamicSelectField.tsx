// DynamicSelectField.tsx

'use client'

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import {
    X,
    ChevronDown,
    Search,
    Check,
    Loader2,
    AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface DynamicSelectFieldProps {
    id?: string
    label?: string
    value: string[] | undefined | null
    onChange: (newValues: string[]) => void
    apiUrl?: string
    placeholder?: string
    readOnly?: boolean
    dataMapper?: (item: IResponseData) => string
}

interface IResponseData {
    id: number
    name: string
}

const MAX_RETRIES = 5
const RETRY_DELAY = 1000

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
    const [availableData, setAvailableData] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [activeIndex, setActiveIndex] = useState(-1)
    const wrapperRef = useRef<HTMLDivElement>(null)

    const fetchData = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                const response = await fetch(apiUrl)
                if (!response.ok) {
                    throw new Error(
                        `API Error: ${response.status} ${response.statusText}`
                    )
                }
                const json = await response.json()
                const names = json.map(dataMapper)
                setAvailableData(names)
                setIsLoading(false)
                return
            } catch (err) {
                console.error(`Attempt ${attempt} failed:`, err)
                if (attempt === MAX_RETRIES) {
                    const errorMessage =
                        err instanceof Error
                            ? err.message
                            : 'An unknown error occurred'
                    setError(`Failed to fetch data. ${errorMessage}`)
                    setIsLoading(false)
                } else {
                    await new Promise((res) => setTimeout(res, RETRY_DELAY))
                }
            }
        }
    }, [apiUrl, dataMapper])

    useEffect(() => {
        fetchData()
    }, [])

    const getFilteredOptions = useMemo(() => {
        const safeValue = value ?? []
        return availableData
            .filter((item) => !safeValue.includes(item))
            .filter((item) =>
                item.toLowerCase().includes(searchTerm.toLowerCase())
            )
    }, [availableData, value, searchTerm])

    const handleSelect = (itemToSelect: string) => {
        if (!readOnly) {
            const safeValue = value ?? []
            if (!safeValue.includes(itemToSelect)) {
                onChange([...safeValue, itemToSelect])
            }
            setSearchTerm('')
            setIsOpen(false)
            setActiveIndex(-1)
        }
    }

    const handleRemove = (itemToRemove: string) => {
        if (!readOnly) {
            const safeValue = value ?? []
            onChange(safeValue.filter((item) => item !== itemToRemove))
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) return
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setActiveIndex((prev) =>
                    Math.min(prev + 1, getFilteredOptions.length - 1)
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setActiveIndex((prev) => Math.max(prev - 1, 0))
                break
            case 'Enter':
                e.preventDefault()
                if (activeIndex >= 0 && getFilteredOptions[activeIndex]) {
                    handleSelect(getFilteredOptions[activeIndex])
                }
                break
            case 'Escape':
                setIsOpen(false)
                setActiveIndex(-1)
                break
        }
    }

    const safeValue = value ?? []

    return (
        <div className="space-y-1.5 w-full max-w-2xl" ref={wrapperRef}>
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <div
                    id={id}
                    className={cn(
                        'relative flex items-center min-h-[2.75rem] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background',
                        readOnly
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-pointer',
                        isOpen && 'ring-2 ring-ring ring-offset-2'
                    )}
                    onClick={() =>
                        !readOnly && !isLoading && setIsOpen(!isOpen)
                    }
                    aria-expanded={isOpen}
                >
                    <div className="flex-1">
                        {safeValue.length === 0 ? (
                            <span className="text-muted-foreground">
                                {placeholder}
                            </span>
                        ) : (
                            <span className="text-foreground">
                                {safeValue.length} item
                                {safeValue.length !== 1 ? 's' : ''} selected
                            </span>
                        )}
                    </div>
                    {isLoading && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                    {error && (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                    {!isLoading && !error && (
                        <ChevronDown
                            className={cn(
                                'h-4 w-4 text-muted-foreground transition-transform',
                                isOpen && 'rotate-180'
                            )}
                        />
                    )}
                </div>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
                        <div className="p-2 border-b">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search options..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    onKeyDown={handleKeyDown}
                                    className="w-full rounded-sm border-input bg-transparent py-1.5 pl-9 pr-4 text-sm focus:outline-none"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto p-1">
                            {error ? (
                                <div className="p-4 flex flex-col items-center gap-2 text-center text-sm text-destructive">
                                    <AlertCircle className="w-6 h-6" />
                                    <span>{error}</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={fetchData}
                                    >
                                        Retry
                                    </Button>
                                </div>
                            ) : getFilteredOptions.length === 0 ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    {isLoading
                                        ? 'Loading...'
                                        : searchTerm
                                          ? 'No matches found'
                                          : 'No options available'}
                                </div>
                            ) : (
                                <ul>
                                    {getFilteredOptions.map((item, index) => (
                                        <li
                                            id={item + index}
                                            key={item}
                                            onClick={() => handleSelect(item)}
                                            onMouseEnter={() =>
                                                setActiveIndex(index)
                                            }
                                            className={cn(
                                                'flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent',
                                                activeIndex === index &&
                                                    'bg-accent'
                                            )}
                                        >
                                            {item}
                                            {safeValue.includes(item) && (
                                                <Check className="h-4 w-4" />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {safeValue.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {safeValue.map((item, index) => (
                        <div
                            key={item + index}
                            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground"
                        >
                            <span>{item}</span>
                            {!readOnly && (
                                <button
                                    type="button"
                                    onClick={() => handleRemove(item)}
                                    className="rounded-full hover:bg-muted/50 p-0.5"
                                >
                                    <X className="h-3 w-3" />
                                    <span className="sr-only">
                                        Remove {item}
                                    </span>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
