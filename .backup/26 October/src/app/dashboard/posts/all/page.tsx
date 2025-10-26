'use client';

import React, { useState, useMemo } from 'react';
import { PlusIcon, XIcon, Settings2, RefreshCcw, Filter } from 'lucide-react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { IoReloadCircleOutline } from 'react-icons/io5';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import AddFile from './components/Add';
import EditFile from './components/Edit';
import ViewFile from './components/View';
import SearchBox from './components/SearchBox';
import DeleteFile from './components/Delete';
import BulkEditFile from './components/BulkEdit';
import TooManyRequests from './components/TooManyRequest';
import BulkDeleteFile from './components/BulkDelete';
import ViewPostsTable from './components/TableView';
import BulkUpdatePosts from './components/BulkUpdate';
import BulkDynamicUpdatePosts from './components/BulkDynamicUpdate';
import FilterDialog, { FilterPayload } from './components/FilterDialog';
import Summary from './components/Summary';

import { usePostsStore } from './store/store';
import { useGetPostsQuery } from '@/redux/features/posts/postsSlice';
import { handleSuccess } from './components/utils';

const MainNextPage: React.FC = () => {
  const [hashSearchText, setHashSearchText] = useState('');
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);

  const {
    toggleAddModal,
    queryPramsLimit,
    queryPramsPage,
    queryPramsQ,
    setQueryPramsPage,
    setQueryPramsQ,
  } = usePostsStore();

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
            : status,
        error,
      }),
    }
  );

  const activeFilter = useMemo(() => {
    if (queryPramsQ && queryPramsQ.startsWith('createdAt:range:')) {
      try {
        const datePart = queryPramsQ.split(':')[2];
        const [startDate, endDate] = datePart.split('_');
        return {
          isApplied: true,
          displayText: `Filtering from ${startDate} to ${endDate}`,
        };
      } catch {
        return { isApplied: false, displayText: '' };
      }
    }
    return { isApplied: false, displayText: '' };
  }, [queryPramsQ]);

  const handleSearch = (query: string) => {
    if (query !== hashSearchText) {
      setHashSearchText(query);
      setQueryPramsPage(1);
      setQueryPramsQ(query);
    }
  };

  const handleFilter = () => setFilterModalOpen(true);

  const handleApplyFilter = (filter: FilterPayload) => {
    const { start, end } = filter.value;
    const filterQuery = `createdAt:range:${start}_${end}`;

    setQueryPramsQ(filterQuery);
    setQueryPramsPage(1);
    refetch();
    handleSuccess('Filter Applied!');
  };

  const handleClearFilter = () => {
    setQueryPramsQ('');
    setQueryPramsPage(1);
    refetch();
    handleSuccess('Filter Cleared!');
  };

  const modals = [
    AddFile,
    ViewFile,
    BulkDeleteFile,
    BulkEditFile,
    EditFile,
    DeleteFile,
    BulkUpdatePosts,
    BulkDynamicUpdatePosts,
  ];

  let renderUI = (
    <div className="container mx-auto md:p-4">
      {/* Header + Toolbar */}
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-6">
        <h1 className="h2 w-full text-white">
          Post Management{' '}
          {isSuccess && (
            <sup className="text-xs text-gray-300">
              (total:{getResponseData?.data?.total || '00'})
            </sup>
          )}
        </h1>

        {/* Mobile Sheet Toolbar */}
        <div className="w-full flex md:hidden justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outlineWater" size="icon" className="flex items-center justify-center  min-w-1" aria-label="Open actions">
                <Settings2 className="w-5 h-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="bottom"
              className="p-6 space-y-5 bg-white/10 backdrop-blur-xl border-t border-white/20 shadow-lg rounded-t-2xl"
            >
              <SheetHeader>
                <SheetTitle className="text-white text-lg font-medium text-center">Post Actions</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-3">
                <Summary />

                <Button size="sm" variant="outlineWater" onClick={handleFilter} disabled={isLoading} className="w-full">
                  <Filter className="w-4 h-4 mr-2" /> Filter
                </Button>

                <Button
                  size="sm"
                  variant="outlineWater"
                  onClick={() => {
                    refetch();
                    handleSuccess('Reloaded!');
                  }}
                  disabled={isLoading}
                  className="w-full"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" /> Reload
                </Button>

                <Button size="sm" variant="outlineGarden" onClick={() => toggleAddModal(true)} className="w-full">
                  <PlusIcon className="w-4 h-4 mr-2" /> Add Post
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Toolbar */}
        <div className="hidden md:flex flex-row gap-2 items-center justify-end w-full">
          <Summary />
          <Button size="sm" variant="outlineWater" onClick={handleFilter} disabled={isLoading}>
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button
            size="sm"
            variant="outlineWater"
            onClick={() => {
              refetch();
              handleSuccess('Reloaded!');
            }}
            disabled={isLoading}
          >
            <IoReloadCircleOutline className="w-4 h-4 mr-2" /> Reload
          </Button>
          <Button size="sm" variant="outlineGarden" onClick={() => toggleAddModal(true)}>
            <PlusIcon className="w-4 h-4 mr-2" /> Add Post
          </Button>
        </div>
      </div>

      {/* Search + Filter UI */}
      <SearchBox onSearch={handleSearch} placeholder="Search here ..." autoFocus={false} />

      {activeFilter.isApplied && (
        <div className="flex items-center justify-start my-4">
          <Badge variant="secondary" className="flex items-center gap-2 pl-3 pr-1 py-1 text-sm font-normal bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-md">
            <span>{activeFilter.displayText}</span>
            <Button
              aria-label="Clear filter"
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full text-white hover:bg-white/20"
              onClick={handleClearFilter}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </Badge>
        </div>
      )}

      {/* Table View (Glassmorphism card) */}
      <div className="bg-white/5 backdrop-blur-md md:p-4 rounded-2xl shadow-md border border-white/10">
        <ViewPostsTable />
      </div>

      {/* Modals */}
      {modals.map((ModalComponent, index) => (
        <ModalComponent key={index} />
      ))}

      {/* Filter Dialog */}
      <FilterDialog isOpen={isFilterModalOpen} onOpenChange={setFilterModalOpen} onApplyFilter={handleApplyFilter} onClearFilter={handleClearFilter} />
    </div>
  );

  if (statusCode === 429) renderUI = <TooManyRequests />;

  return renderUI;
};

export default MainNextPage;
