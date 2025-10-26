'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as ChevronDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'

export interface DateFieldProps {
    id?: string
    value: Date | undefined
    onChange: (date: Date | undefined) => void
}

export function DateField({
    value,
    onChange,
    id = Math.random().toString(),
}: DateFieldProps) {
    const [open, setOpen] = React.useState(false)
    const ref = React.useRef<HTMLDivElement>(null)

    // Close calendar if clicked outside
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div id={id} className="flex flex-col gap-3 relative" ref={ref}>
            <Label htmlFor={id} className="px-1">
                Date
            </Label>

            <Button
                variant="outline"
                id={id}
                className="w-48 justify-between font-normal"
                onClick={() => setOpen((prev) => !prev)}
                type="button"
            >
                {value ? format(value, 'PPP') : 'Select date'}
                <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
            </Button>

            {open && (
                <div
                    className="
            absolute top-full left-0 mt-2 z-[9999]
            rounded-md border bg-popover shadow-md p-2
          "
                >
                    <Calendar
                        mode="single"
                        selected={value}
                        captionLayout="dropdown"
                        onSelect={(selectedDate) => {
                            onChange(selectedDate ?? undefined)
                            setOpen(false)
                        }}
                    />
                </div>
            )}
        </div>
    )
}

DateField.displayName = 'DateField'
