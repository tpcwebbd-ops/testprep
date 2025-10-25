interface NamingConvention {
    Users_1_000___: string
    users_2_000___: string
    use_generate_folder: boolean
}

interface InputConfig {
    schema: Record<string, string>
    namingConvention: NamingConvention
}

export const generateSummaryComponentFile = (
    inputJsonString: string
): string => {
    const { schema, namingConvention }: InputConfig =
        JSON.parse(inputJsonString)

    const pluralPascalCase = namingConvention.Users_1_000___
    const pluralLowerCase = namingConvention.users_2_000___

    const isUsedGenerateFolder = namingConvention.use_generate_folder

    let reduxPath = ''
    if (isUsedGenerateFolder) {
        reduxPath = `../redux/rtk-api`
    } else {
        reduxPath = `@/redux/features/${pluralLowerCase}/${pluralLowerCase}Slice`
    }

    const hasNumericFields = Object.values(schema).some(
        (type) => type === 'INTNUMBER' || type === 'FLOATNUMBER'
    )

    const numericSectionsTemplate = `
                        {/* Grand Total Summary Card */}
                        {summaryData.tableSummary && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Grand Total Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="max-h-32 overflow-y-auto space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Total Months:
                                        </span>
                                        <strong>
                                            {summaryData.tableSummary.totalMonths}
                                        </strong>
                                    </div>
                                    {summaryKeys.map((key) => (
                                        <div
                                            key={key}
                                            className="flex justify-between"
                                        >
                                            <span className="text-muted-foreground">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                                            </span>
                                            <strong>
                                                {summaryData.tableSummary[key]}
                                            </strong>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Monthly Data Table */}
                        {summaryData.monthlyTable && (
                            <div className={\`relative \${isFetching ? 'opacity-50' : ''}\`}>
                                {isFetching && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    </div>
                                )}
                                <div className="border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                {tableHeaders.map((header) => (
                                                    <TableHead key={header}>
                                                        {header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {summaryData.monthlyTable.length > 0 ? (
                                                summaryData.monthlyTable.map(
                                                    (row, index) => (
                                                        <TableRow key={index}>
                                                            {tableHeaders.map(
                                                                (header) => (
                                                                    <TableCell key={header}>
                                                                        {row[header]}
                                                                    </TableCell>
                                                                )
                                                            )}
                                                        </TableRow>
                                                    )
                                                )
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={tableHeaders.length}
                                                        className="h-24 text-center"
                                                    >
                                                        No monthly data to display.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
`

    const paginationTemplate = `
                {/* Pagination */}
                <DialogFooter>
                    {summaryData?.pagination && summaryData.pagination.totalPages > 1 && (
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handlePageChange(page - 1)
                                        }}
                                        className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink isActive>
                                        Page {page} of {summaryData.pagination.totalPages}
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handlePageChange(page + 1)
                                        }}
                                        className={page >= summaryData.pagination.totalPages ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </DialogFooter>
`

    const componentTemplate = `
'use client'

import { useState } from 'react'
import { Loader2, TrendingUp } from 'lucide-react'

// Assuming your RTK API file is correctly set up
import { useGet${pluralPascalCase}SummaryQuery } from '${reduxPath}'

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
 * A component that displays a summary of ${pluralLowerCase} data in a dialog.
 * It features a trigger button, data fetching with RTK Query,
 * and a paginated table view of monthly statistics.
 */
const ${pluralPascalCase}Summary = () => {
    const [page, setPage] = useState(1)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const limit = 10

    const { data, isLoading, isError, isFetching } = useGet${pluralPascalCase}SummaryQuery(
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
                <Button  variant="outlineWater" size="sm">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Summary
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>${pluralPascalCase} Summary</DialogTitle>
                    <DialogDescription>
                        An overview of all ${pluralLowerCase} data, aggregated by month.
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

                        ${hasNumericFields ? numericSectionsTemplate : ''}
                    </div>
                )}

                ${hasNumericFields ? paginationTemplate : ''}
            </DialogContent>
        </Dialog>
    )
}

export default ${pluralPascalCase}Summary;
`

    return componentTemplate
}
