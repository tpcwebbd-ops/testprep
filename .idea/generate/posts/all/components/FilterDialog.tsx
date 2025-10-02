'use client'

import React, { useState, useMemo } from 'react'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'

// Define the structure of the data passed back to the parent
export type FilterPayload =
    | { type: 'month'; value: { start: string; end: string } }
    | { type: 'range'; value: { start: string; end: string } }

interface FilterDialogProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onApplyFilter: (filter: FilterPayload) => void
    onClearFilter: () => void
}

const FilterDialog: React.FC<FilterDialogProps> = ({
    isOpen,
    onOpenChange,
    onApplyFilter,
    onClearFilter,
}) => {
    const [activeTab, setActiveTab] = useState('month')
    const [selectedMonth, setSelectedMonth] = useState<string>('')
    const [dateRange, setDateRange] = useState<DateRange | undefined>()

    // Generate a list of the last 12 months for the dropdown
    const monthOptions = useMemo(() => {
        const options = []
        const now = new Date()
        for (let i = 0; i < 12; i++) {
            const date = subMonths(now, i)
            options.push({
                label: format(date, 'MMMM yyyy'),
                value: format(date, 'yyyy-MM'),
            })
        }
        return options
    }, [])

    const handleApply = () => {
        if (activeTab === 'month' && selectedMonth) {
            const monthDate = new Date(selectedMonth)
            const startDate = startOfMonth(monthDate)
            const endDate = endOfMonth(monthDate)
            onApplyFilter({
                type: 'month',
                value: {
                    start: format(startDate, 'yyyy-MM-dd'),
                    end: format(endDate, 'yyyy-MM-dd'),
                },
            })
        } else if (activeTab === 'range' && dateRange?.from && dateRange?.to) {
            onApplyFilter({
                type: 'range',
                value: {
                    start: format(dateRange.from, 'yyyy-MM-dd'),
                    end: format(dateRange.to, 'yyyy-MM-dd'),
                },
            })
        }
        onOpenChange(false) // Close dialog on apply
    }

    const handleClear = () => {
        onClearFilter()
        setSelectedMonth('')
        setDateRange(undefined)
        onOpenChange(false)
    }

    const isApplyDisabled =
        (activeTab === 'month' && !selectedMonth) ||
        (activeTab === 'range' && (!dateRange?.from || !dateRange?.to))

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Filter Posts</DialogTitle>
                    <DialogDescription>
                        Select a filter option to apply to the table data.
                    </DialogDescription>
                </DialogHeader>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="month">By Month</TabsTrigger>
                        <TabsTrigger value="range">By Date Range</TabsTrigger>
                    </TabsList>
                    <TabsContent value="month" className="py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="month-select">Select Month</Label>
                            <Select
                                value={selectedMonth}
                                onValueChange={setSelectedMonth}
                            >
                                <SelectTrigger id="month-select">
                                    <SelectValue placeholder="Choose a month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {monthOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </TabsContent>
                    <TabsContent value="range" className="py-4">
                        <div className="grid gap-2">
                            <Label>Select Date Range</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={'outline'}
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !dateRange &&
                                                'text-muted-foreground'
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateRange?.from ? (
                                            dateRange.to ? (
                                                <>
                                                    {format(
                                                        dateRange.from,
                                                        'LLL dd, y'
                                                    )}{' '}
                                                    -{' '}
                                                    {format(
                                                        dateRange.to,
                                                        'LLL dd, y'
                                                    )}
                                                </>
                                            ) : (
                                                format(
                                                    dateRange.from,
                                                    'LLL dd, y'
                                                )
                                            )
                                        ) : (
                                            <span>Pick a date range</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={dateRange?.from}
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button variant="ghost" onClick={handleClear}>
                        Clear Filter
                    </Button>
                    <Button onClick={handleApply} disabled={isApplyDisabled}>
                        Apply Filter
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default FilterDialog
