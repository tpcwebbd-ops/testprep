
'use client'

import { useState } from 'react'
import { Loader2, TrendingUp } from 'lucide-react'

// Assuming your RTK API file is correctly set up
import { useGetPostsSummaryQuery } from '../redux/rtk-api'

// Import Shadcn UI Components
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'

// Define a type for the API response for better type safety
interface SummaryData {
    overall: {
        totalRecords: number
        recordsLast24Hours: number
        recordsLastMonth: number // This field should be provided by your summary API
        // Add other time-based stats here as your API provides them
    }
    // These fields are optional and only exist if numeric fields are in the schema
    monthlyTable?: Array<Record<string, string | number>>
    tableSummary?: {
        totalMonths: number
        [key: string]: number
    }
    pagination?: {
        currentPage: number
        limit: number
        totalMonths: number
        totalPages: number
    }
}

/**
 * A component that displays a summary of posts data in a dialog.
 * It features a trigger button, data fetching with RTK Query,
 * and a paginated table view of monthly statistics.
 */
const PostsSummary = () => {
    const [page, setPage] = useState(1)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const limit = 10

    const { data, isLoading, isError, isFetching } = useGetPostsSummaryQuery(
        { page, limit },
        // Skip fetching when the dialog is closed to save resources
        { skip: !isDialogOpen }
    )

    const summaryData: SummaryData | undefined = data?.data

    const handlePageChange = (newPage: number) => {
        if (
            newPage > 0 &&
            newPage <= (summaryData?.pagination?.totalPages || 1)
        ) {
            setPage(newPage)
        }
    }

    // These are only calculated if the data for them exists
    const tableHeaders = summaryData?.monthlyTable?.[0]
        ? Object.keys(summaryData.monthlyTable[0])
        : []

    const summaryKeys = summaryData?.tableSummary
        ? Object.keys(summaryData.tableSummary).filter(
              (key) => key !== 'totalMonths'
          )
        : []

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Summary
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Posts Summary</DialogTitle>
                    <DialogDescription>
                        An overview of all posts data, aggregated by month.
                    </DialogDescription>
                </DialogHeader>

                {isLoading && (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}

                {isError && (
                    <div className="text-center text-red-500 p-12">
                        Failed to load summary data. Please try again later.
                    </div>
                )}

                {!isLoading && !isError && summaryData && (
                    <div className="grid gap-4">
                        {/* Time-based Statistics (Always Shown) */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Creation Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Records:</span>
                                    <strong>{summaryData.overall.totalRecords ?? 'N/A'}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Last 24 Hours:</span>
                                    <strong>{summaryData.overall.recordsLast24Hours ?? 'N/A'}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Last Month:</span>
                                    <strong>{summaryData.overall.recordsLastMonth ?? 'N/A'}</strong>
                                </div>
                            </CardContent>
                        </Card>

                        
                    </div>
                )}

                
            </DialogContent>
        </Dialog>
    )
}

export default PostsSummary;
