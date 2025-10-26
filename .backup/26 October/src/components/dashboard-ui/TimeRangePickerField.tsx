'use client'

import * as React from 'react'
import { Clock } from 'lucide-react'
import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface TimeRangePickerProps {
    value: { start: string; end: string } | undefined
    onChange: (range: { start: string; end: string } | undefined) => void
    id: string
    label?: string
    className?: string
}

export default function TimeRangePickerField({
    id,
    label = 'Time Range',
    value,
    onChange,
    className,
}: TimeRangePickerProps) {
    const [openPicker, setOpenPicker] = React.useState<'start' | 'end' | null>(
        null
    )
    const wrapperRef = React.useRef<HTMLDivElement>(null)

    // Detect click outside and close popup
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setOpenPicker(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const hours = Array.from({ length: 24 }, (_, i) => i)
    const minutes = Array.from({ length: 60 }, (_, i) => i)

    const formatDisplayTime = (time: string | undefined) => {
        if (!time) return 'Select time'
        const [h, m] = time.split(':').map(Number)
        const date = new Date()
        date.setHours(h, m)
        return format(date, 'hh:mm a')
    }

    const handleTimeChange = (part: 'start' | 'end', timeValue: string) => {
        const newRange = {
            start: value?.start ?? '00:00',
            end: value?.end ?? '00:00',
        }
        newRange[part] = timeValue
        onChange(newRange)
        setOpenPicker(null)
    }

    const renderPicker = (part: 'start' | 'end') => {
        const current = value?.[part]
        const [hour, minute] = current
            ? current.split(':').map(Number)
            : [null, null]

        return (
            <div
                className="
          absolute top-full left-0 mt-2 z-[9999]
          w-[180px] rounded-md border bg-popover shadow-md p-0
        "
            >
                <div className="flex max-h-52">
                    <ScrollArea className="h-52 w-24 border-r">
                        <div className="p-1">
                            {hours.map((h) => (
                                <Button
                                    key={h}
                                    variant="ghost"
                                    className={cn(
                                        'w-full justify-center text-sm p-2',
                                        hour === h && 'bg-accent'
                                    )}
                                    onClick={() => {
                                        const newTime = `${String(h).padStart(2, '0')}:${String(
                                            minute ?? 0
                                        ).padStart(2, '0')}`
                                        handleTimeChange(part, newTime)
                                    }}
                                >
                                    {format(new Date().setHours(h), 'hh a')}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                    <ScrollArea className="h-52 w-20">
                        <div className="p-1">
                            {minutes.map((m) => (
                                <Button
                                    key={m}
                                    variant="ghost"
                                    className={cn(
                                        'w-full justify-center text-sm p-2',
                                        minute === m && 'bg-accent'
                                    )}
                                    onClick={() => {
                                        const newTime = `${String(
                                            hour ?? 0
                                        ).padStart(
                                            2,
                                            '0'
                                        )}:${String(m).padStart(2, '0')}`
                                        handleTimeChange(part, newTime)
                                    }}
                                >
                                    {String(m).padStart(2, '0')}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        )
    }

    return (
        <div
            className={cn(
                'relative grid w-full items-center gap-1.5',
                className
            )}
            ref={wrapperRef}
        >
            <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <Label htmlFor={id}>{label}</Label>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative w-full">
                    <Button
                        variant="outline"
                        className="w-full justify-between font-normal"
                        onClick={() =>
                            setOpenPicker(
                                openPicker === 'start' ? null : 'start'
                            )
                        }
                        type="button"
                    >
                        {formatDisplayTime(value?.start)}
                    </Button>
                    {openPicker === 'start' && renderPicker('start')}
                </div>

                <span className="text-gray-500">-</span>

                <div className="relative w-full">
                    <Button
                        variant="outline"
                        className="w-full justify-between font-normal"
                        onClick={() =>
                            setOpenPicker(openPicker === 'end' ? null : 'end')
                        }
                        type="button"
                    >
                        {formatDisplayTime(value?.end)}
                    </Button>
                    {openPicker === 'end' && renderPicker('end')}
                </div>
            </div>
        </div>
    )
}

TimeRangePickerField.displayName = 'TimeRangePickerField'
