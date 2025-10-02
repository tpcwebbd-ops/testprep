'use client'

import React, { useState, useMemo } from 'react'
import { PlusIcon, XIcon } from 'lucide-react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IoReloadCircleOutline } from 'react-icons/io5'

import AddFile from './components/Add'
import EditFile from './components/Edit'
import ViewFile from './components/View'
import SearchBox from './components/SearchBox'
import DeleteFile from './components/Delete'
import BulkEditFile from './components/BulkEdit'
import TooManyRequests from './components/TooManyRequest'
import BulkDeleteFile from './components/BulkDelete'
import ViewPostsTable from './components/TableView'
import BulkUpdatePosts from './components/BulkUpdate'
import BulkDynamicUpdatePosts from './components/BulkDynamicUpdate'
import FilterDialog, { FilterPayload } from './components/FilterDialog'
import Summary from './components/Summary'

import { usePostsStore } from './store/store'
import { useGetPostsQuery } from './redux/rtk-api'
import { handleSuccess } from './components/utils'

const MainNextPage: React.FC = () => {
    const [hashSearchText, setHashSearchText] = useState('')
    const [isFilterModalOpen, setFilterModalOpen] = useState(false)

    const {
        toggleAddModal,
        queryPramsLimit,
        queryPramsPage,
        queryPramsQ,
        setQueryPramsPage,
        setQueryPramsQ,
    } = usePostsStore()

    const {
        data: getResponseData,
        isSuccess,
        isLoading,
        refetch,
        status: statusCode,
    } = useGetPostsQuery(
        { q: queryPramsQ, page: queryPramsPage, limit: queryPramsLimit },
        {
            selectFromResult: ({ data, isSuccess, isLoading, status, error }) => ({
                data,
                isSuccess,
                isLoading,
                status:
                    'status' in (error || {})
                        ? (error as FetchBaseQueryError).status
                        : status, // Extract HTTP status code
                error,
            }),
        }
    )
    
    const activeFilter = useMemo(() => {
        if (queryPramsQ && queryPramsQ.startsWith('createdAt:range:')) {
            try {
                const datePart = queryPramsQ.split(':')[2];
                const [startDate, endDate] = datePart.split('_');
                return {
                    isApplied: true,
                    displayText: `Filtering from ${startDate} to ${endDate}`
                };
            } catch (e) {
                return { isApplied: false, displayText: '' };
            }
        }
        return { isApplied: false, displayText: '' };
    }, [queryPramsQ]);

    const handleSearch = (query: string) => {
        if (query !== hashSearchText) {
            setHashSearchText(query)
            setQueryPramsPage(1)
            setQueryPramsQ(query)
        }
    }

    const handleFilter = () => {
        setFilterModalOpen(true)
    }

    const handleApplyFilter = (filter: FilterPayload) => {
        const { start, end } = filter.value
        const filterQuery = `createdAt:range:${start}_${end}`

        console.log('Applying filter:', filterQuery)
        setQueryPramsQ(filterQuery)
        setQueryPramsPage(1)
        refetch()
        handleSuccess('Filter Applied!')
    }

    const handleClearFilter = () => {
        console.log('Clearing filter')
        setQueryPramsQ('')
        setQueryPramsPage(1)
        refetch()
        handleSuccess('Filter Cleared!')
    }

    const modals = [
        AddFile,
        ViewFile,
        BulkDeleteFile,
        BulkEditFile,
        EditFile,
        DeleteFile,
        BulkUpdatePosts,
        BulkDynamicUpdatePosts,
    ]

    let renderUI = (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-6">
                <h1 className="h2 w-full">
                    Post Management{' '}
                    {isSuccess && (
                        <sup className="text-xs">
                            (total:{getResponseData?.data?.total || '00'})
                        </sup>
                    )}
                </h1>
                <div className="w-full flex flex-col md:flex-row gap-2 item-center justify-end">
                 <Summary />
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleFilter}
                        disabled={isLoading}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-filter-right mr-1"
                            viewBox="0 0 16 16"
                        >
                            <path d="M14 10.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5m0-3a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0 0 1h7a.5.5 0 0 0 .5-.5m0-3a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0 0 1h11a.5.5 0 0 0 .5-.5" />
                        </svg>
                        Filter
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            refetch()
                            handleSuccess('Reloaded!')
                        }}
                        disabled={isLoading}
                    >
                        <IoReloadCircleOutline className="w-4 h-4 mr-1" />{' '}
                        Reload
                    </Button>
                    <Button
                        size="sm"
                        variant="outlineGarden"
                        onClick={() => toggleAddModal(true)}
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add Post
                    </Button>
                </div>
            </div>
            <SearchBox
                onSearch={handleSearch}
                placeholder="Search here ..."
                autoFocus={false}
            />

            {activeFilter.isApplied && (
                <div className="flex items-center justify-start my-4">
                    <Badge variant="secondary" className="flex items-center gap-2 pl-3 pr-1 py-1 text-sm font-normal">
                        <span>{activeFilter.displayText}</span>
                        <Button
                            aria-label="Clear filter"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={handleClearFilter}
                        >
                            <XIcon className="h-4 w-4" />
                        </Button>
                    </Badge>
                </div>
            )}

            <ViewPostsTable />
            {modals.map((ModalComponent, index) => (
                <ModalComponent key={index} />
            ))}

            <FilterDialog
                isOpen={isFilterModalOpen}
                onOpenChange={setFilterModalOpen}
                onApplyFilter={handleApplyFilter}
                onClearFilter={handleClearFilter}
            />
        </div>
    )

    if (statusCode === 429) {
        renderUI = <TooManyRequests />
    }

    return renderUI
}

export default MainNextPage
