'use client'

import { format } from 'date-fns'
import React, { useState, useMemo } from 'react'
import { 
    MoreHorizontalIcon, 
    EyeIcon, 
    PencilIcon, 
    TrashIcon, 
    DownloadIcon 
} from 'lucide-react'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import LoadingComponent from '@/components/common/Loading'
import ErrorMessageComponent from '@/components/common/Error'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { IFollow_Ups } from '../store/data/data'
import { pageLimitArr } from '../store/store-constant'
import { useFollow_UpsStore } from '../store/store'
import { useGetFollow_UpsQuery } from '../redux/rtk-api'
import Pagination from './Pagination'
import ExportDialog from './ExportDialog' // Import the new dialog component

// Dynamically generated types for type safety
type DisplayableFollow_UpsKeys = 
    | 'lead_id'
    | 'followed_by_id'
    | 'follow_up_date'
    | 'follow_up_time'
    | 'createdAt'
type ColumnVisibilityState = Record<DisplayableFollow_UpsKeys, boolean>


const ViewTableNextComponents: React.FC = () => {
    const [sortConfig, setSortConfig] = useState<{
        key: DisplayableFollow_UpsKeys
        direction: 'asc' | 'desc'
    } | null>(null)
    
    // State to control the export dialog visibility
    const [isExportDialogOpen, setExportDialogOpen] = useState(false);
    
    const {
        setSelectedFollow_Ups,
        toggleBulkEditModal,
        toggleBulkUpdateModal,
        toggleViewModal,
        queryPramsLimit,
        queryPramsPage,
        queryPramsQ,
        toggleEditModal,
        toggleDeleteModal,
        bulkData,
        setBulkData,
        setQueryPramsLimit,
        setQueryPramsPage,
        toggleBulkDeleteModal,
    } = useFollow_UpsStore()

    const {
        data: getResponseData,
        isLoading,
        isError,
        error,
    } = useGetFollow_UpsQuery({
        q: queryPramsQ,
        limit: queryPramsLimit,
        page: queryPramsPage,
    })

    const allData = useMemo(
        () => getResponseData?.data?.follow_Ups || [],
        [getResponseData]
    )

    const tableHeaders: { key: DisplayableFollow_UpsKeys; label: string }[] = [
        { key: 'lead_id', label: 'Lead_id' },
        { key: 'followed_by_id', label: 'Followed_by_id' },
        { key: 'follow_up_date', label: 'Follow_up_date' },
        { key: 'follow_up_time', label: 'Follow_up_time' },
        { key: 'createdAt', label: 'Created At' }
    ];

    const [columnVisibility, setColumnVisibility] =
        useState<ColumnVisibilityState>(() => {
            const initialState = {} as ColumnVisibilityState
            let counter = 0
            for (const header of tableHeaders) {
                if (counter > 3) {
                    initialState[header.key] = false
                } else {
                    initialState[header.key] = true
                }
                counter++
            }
            return initialState
        })
            
    const visibleHeaders = useMemo(
        () => tableHeaders.filter(header => columnVisibility[header.key]),
        [columnVisibility, tableHeaders]
    );

    const formatDate = (date?: Date | string) => {
        if (!date) return 'N/A'
        try {
            return format(new Date(date), 'MMM dd, yyyy')
        } catch {
            return 'Invalid Date'
        }
    }

    const handleSort = (key: DisplayableFollow_UpsKeys) => {
        setSortConfig((prev) =>
            prev?.key === key
                ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
                : { key, direction: 'asc' }
        )
    }

    const sortedData = useMemo(() => {
        if (!sortConfig) return allData
        return [...allData].sort((a, b) => {
            const aValue = a[sortConfig.key]
            const bValue = b[sortConfig.key]
            if (aValue === undefined || aValue === null) return 1
            if (bValue === undefined || bValue === null) return -1
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })
    }, [allData, sortConfig])

    const handleSelectAll = (isChecked: boolean) =>
        setBulkData(isChecked ? allData : [])

    const handleSelectRow = (isChecked: boolean, item: IFollow_Ups) =>
        setBulkData(
            isChecked
                ? [...bulkData, item]
                : bulkData.filter((i) => i._id !== item._id)
        )

    const renderActions = (item: IFollow_Ups) => (
        <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => { setSelectedFollow_Ups(item); toggleViewModal(true); }}>
                <EyeIcon className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setSelectedFollow_Ups(item); toggleEditModal(true); }}>
                <PencilIcon className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => { setSelectedFollow_Ups(item); toggleDeleteModal(true); }}>
                <TrashIcon className="w-4 h-4" />
            </Button>
        </div>
    )

    const renderTableRows = () =>
        sortedData.map((item: IFollow_Ups) => (
            <TableRow key={item._id}>
                <TableCell>
                    <Checkbox
                        onCheckedChange={(checked) => handleSelectRow(!!checked, item)}
                        checked={bulkData.some((i) => i._id === item._id)}
                    />
                </TableCell>
                {visibleHeaders.map(header => (
                     <TableCell key={header.key}>
                        {header.key === 'createdAt' 
                            ? formatDate(item.createdAt) 
                            : String(item[header.key] ?? '')}
                     </TableCell>
                ))}
                <TableCell className="text-right max-w-[10px]">
                    {renderActions(item)}
                </TableCell>
            </TableRow>
        ))

    if (isLoading) return <LoadingComponent />
    if (isError) return <ErrorMessageComponent message={error?.toString() || 'An error occurred'} />
    
    return (
        <div className="w-full flex flex-col">
            <div className="w-full my-4">
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pb-2 border-b">
                    <div className="flex items-center gap-2 justify-start w-full">
                        <Label>Selected: </Label>
                        <span className="text-sm text-slate-500">({bulkData.length})</span>
                    </div>
                    {/* Updated Toolbar Layout */}
                    <div className="flex items-center justify-end w-full gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <MoreHorizontalIcon className="w-4 h-4 mr-2" />
                                    Columns
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {tableHeaders.map((header) => (
                                    <DropdownMenuCheckboxItem
                                        key={header.key}
                                        className="capitalize"
                                        checked={columnVisibility[header.key]}
                                        onCheckedChange={(value) =>
                                            setColumnVisibility(prev => ({
                                                ...prev,
                                                [header.key]: !!value
                                            }))
                                        }
                                    >
                                        {header.label}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Updated Export Button to open the dialog */}
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setExportDialogOpen(true)}
                            disabled={bulkData.length === 0}
                        >
                            <DownloadIcon className="w-4 h-4 mr-1" /> Export
                        </Button>
                        <div className="w-2 h-auto" />

                        <Button size="sm" variant="outline" onClick={() => toggleBulkUpdateModal(true)} disabled={bulkData.length === 0}>
                            <PencilIcon className="w-4 h-4 mr-1" /> B.Update
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toggleBulkEditModal(true)} disabled={bulkData.length === 0}>
                            <PencilIcon className="w-4 h-4 mr-1" /> B.Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => toggleBulkDeleteModal(true)} disabled={bulkData.length === 0}>
                            <TrashIcon className="w-4 h-4 mr-1" /> B.Delete
                        </Button>
                    </div>
                </div>
            </div>

            {allData.length === 0 ? (
                 <div className="py-12 text-center text-2xl text-slate-500">Ops! Nothing was found.</div>
            ) : (
                <Table className="border">
                    <TableHeader className="bg-accent">
                        <TableRow>
                            <TableHead>
                                <Checkbox
                                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                    checked={bulkData.length === allData.length && allData.length > 0}
                                />
                            </TableHead>
                            {visibleHeaders.map(({ key, label }) => (
                                <TableHead key={key} className="cursor-pointer" onClick={() => handleSort(key)}>
                                    {label}{' '}
                                    {sortConfig?.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </TableHead>
                            ))}
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>{renderTableRows()}</TableBody>
                </Table>
            )}

            <Pagination
                currentPage={queryPramsPage}
                itemsPerPage={queryPramsLimit}
                onPageChange={(page) => setQueryPramsPage(page)}
                totalItems={getResponseData?.data?.total || 0}
            />

             <div className="max-w-xs flex items-center self-center justify-between pl-2 gap-4 border rounded-lg w-full mx-auto mt-8">
                <Label htmlFor="set-limit" className="text-right text-slate-500 font-normal pl-3">
                    Follow_Ups per page
                </Label>
                <Select
                    onValueChange={(value) => { setQueryPramsLimit(Number(value)); setQueryPramsPage(1); }}
                    defaultValue={queryPramsLimit.toString()}
                >
                    <SelectTrigger className="border-0">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        {pageLimitArr.map((i) => (
                            <SelectItem key={i} value={i.toString()} className="cursor-pointer">
                                {i}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Render the ExportDialog and pass it the required props */}
            <ExportDialog
                isOpen={isExportDialogOpen}
                onOpenChange={setExportDialogOpen}
                headers={tableHeaders}
                data={bulkData}
                fileName={`Exported_Follow_Ups_${new Date().toISOString()}.xlsx`}
            />
        </div>
    )
}
    export default ViewTableNextComponents
