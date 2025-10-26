'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'

export interface DateRangePickerProps {
    value: DateRange | undefined
    onChange: (range: DateRange | undefined) => void
    id: string
    label?: string
    placeholder?: string
    className?: string
}

export default function DateRangePickerField({
    id,
    label,
    value,
    onChange,
    placeholder = 'Select a date range',
    className,
}: DateRangePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const ref = React.useRef<HTMLDivElement>(null)

    // Close popup when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div
            className={cn(
                'relative grid w-full items-center gap-1.5',
                className
            )}
            ref={ref}
        >
            {label && <Label htmlFor={id}>{label}</Label>}

            <Button
                id={id}
                variant="outline"
                className={cn(
                    'w-full justify-start text-left font-normal',
                    !value && 'text-muted-foreground'
                )}
                onClick={() => setIsOpen((prev) => !prev)}
                type="button"
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value?.from ? (
                    value.to ? (
                        <>
                            {format(value.from, 'LLL dd, y')} -{' '}
                            {format(value.to, 'LLL dd, y')}
                        </>
                    ) : (
                        format(value.from, 'LLL dd, y')
                    )
                ) : (
                    <span>{placeholder}</span>
                )}
            </Button>

            {isOpen && (
                <div
                    className="
            absolute top-full left-0 mt-2 z-[9999]
            rounded-md border bg-popover shadow-md
            p-2 animate-in fade-in zoom-in
          "
                >
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={value?.from}
                        selected={value}
                        onSelect={(range) => {
                            onChange(range)
                            if (range?.from && range?.to) setIsOpen(false)
                        }}
                        numberOfMonths={2}
                    />
                </div>
            )}
        </div>
    )
}

DateRangePickerField.displayName = 'DateRangePickerField'
