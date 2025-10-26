'use client'

import * as React from 'react'
import { Clock } from 'lucide-react'
import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'

export interface TimeFieldProps {
    value: string | null | undefined
    onChange: (time: string | undefined) => void
    id: string
    label?: string
    placeholder?: string
    className?: string
}

export default function TimeField({
    id,
    label,
    value,
    onChange,
    placeholder = 'Pick a time',
    className,
}: TimeFieldProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const ref = React.useRef<HTMLDivElement>(null)
    const hourScrollRef = React.useRef<HTMLDivElement>(null)
    const minuteScrollRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const parsedTime = React.useMemo(() => {
        if (!value) return { hour: null, minute: null }
        const [h, m] = value.split(':').map(Number)
        if (!isNaN(h) && h >= 0 && h <= 23 && !isNaN(m) && m >= 0 && m <= 59) {
            return { hour: h, minute: m }
        }
        return { hour: null, minute: null }
    }, [value])

    const displayTime = React.useMemo(() => {
        if (parsedTime.hour === null || parsedTime.minute === null) {
            return placeholder
        }
        const date = new Date()
        date.setHours(parsedTime.hour, parsedTime.minute)
        return format(date, 'hh:mm a')
    }, [parsedTime, placeholder])

    const handleTimeChange = (part: 'hour' | 'minute', val: number) => {
        const now = new Date()
        const currentHour = parsedTime.hour ?? now.getHours()
        const currentMinute = parsedTime.minute ?? now.getMinutes()
        const newHour = part === 'hour' ? val : currentHour
        const newMinute = part === 'minute' ? val : currentMinute
        const newTimeString = `${String(newHour).padStart(2, '0')}:${String(
            newMinute
        ).padStart(2, '0')}`
        onChange(newTimeString)
        if (part === 'minute') setIsOpen(false)
    }

    React.useEffect(() => {
        if (isOpen && parsedTime.hour !== null) {
            hourScrollRef.current
                ?.querySelector(`[data-hour="${parsedTime.hour}"]`)
                ?.scrollIntoView({ block: 'center' })
        }
        if (isOpen && parsedTime.minute !== null) {
            minuteScrollRef.current
                ?.querySelector(`[data-minute="${parsedTime.minute}"]`)
                ?.scrollIntoView({ block: 'center' })
        }
    }, [isOpen, parsedTime])

    const hours = Array.from({ length: 24 }, (_, i) => i)
    const minutes = Array.from({ length: 60 }, (_, i) => i)

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
                <Clock className="mr-2 h-4 w-4" />
                {displayTime}
            </Button>

            {isOpen && (
                <div
                    className="
            absolute top-full left-0 mt-2 z-[9999]
            rounded-md border bg-popover shadow-md
            p-0
          "
                >
                    <div className="flex max-h-52">
                        <ScrollArea
                            className="h-52 w-24 border-r"
                            ref={hourScrollRef}
                        >
                            <div className="p-1">
                                {hours.map((hour) => (
                                    <Button
                                        key={hour}
                                        variant="ghost"
                                        className={cn(
                                            'w-full justify-center text-sm p-2',
                                            parsedTime.hour === hour &&
                                                'bg-accent'
                                        )}
                                        onClick={() =>
                                            handleTimeChange('hour', hour)
                                        }
                                        data-hour={hour}
                                    >
                                        {format(
                                            new Date().setHours(hour),
                                            'hh a'
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>

                        <ScrollArea className="h-52 w-20" ref={minuteScrollRef}>
                            <div className="p-1">
                                {minutes.map((minute) => (
                                    <Button
                                        key={minute}
                                        variant="ghost"
                                        className={cn(
                                            'w-full justify-center text-sm p-2',
                                            parsedTime.minute === minute &&
                                                'bg-accent'
                                        )}
                                        onClick={() =>
                                            handleTimeChange('minute', minute)
                                        }
                                        data-minute={minute}
                                    >
                                        {String(minute).padStart(2, '0')}
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            )}
        </div>
    )
}
