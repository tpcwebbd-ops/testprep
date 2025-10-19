'use client';

import React, { useState, useMemo } from 'react';
import { PlusIcon, XIcon, MoreVertical } from 'lucide-react';
import { IoReloadCircleOutline } from 'react-icons/io5';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

import AddFile from './components/Add';
import EditFile from './components/Edit';
import ViewFile from './components/View';
import SearchBox from './components/SearchBox';
import DeleteFile from './components/Delete';
import BulkEditFile from './components/BulkEdit';
import TooManyRequests from './components/TooManyRequest';
import BulkDeleteFile from './components/BulkDelete';
import ViewRolesTable from './components/TableView';
import BulkUpdateRoles from './components/BulkUpdate';
import BulkDynamicUpdateRoles from './components/BulkDynamicUpdate';
import FilterDialog, { FilterPayload } from './components/FilterDialog';
import Summary from './components/Summary';

import { useRolesStore } from './store/store';
import { useGetRolesQuery } from '@/redux/features/roles/rolesSlice';
import { handleSuccess } from './components/utils';

const MainNextPage: React.FC = () => {
  const [hashSearchText, setHashSearchText] = useState('');
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { toggleAddModal, queryPramsLimit, queryPramsPage, queryPramsQ, setQueryPramsPage, setQueryPramsQ } = useRolesStore();

  const {
    data: getResponseData,
    isSuccess,
    isLoading,
    refetch,
    status: statusCode,
  } = useGetRolesQuery(
    { q: queryPramsQ, page: queryPramsPage, limit: queryPramsLimit },
    {
      selectFromResult: ({ data, isSuccess, isLoading, status, error }) => ({
        data,
        isSuccess,
        isLoading,
        status: 'status' in (error || {}) ? (error as FetchBaseQueryError).status : status,
        error,
      }),
    },
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
      } catch (e) {
        return { isApplied: false, displayText: '', e };
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

  const modals = [AddFile, ViewFile, BulkDeleteFile, BulkEditFile, EditFile, DeleteFile, BulkUpdateRoles, BulkDynamicUpdateRoles];

  let renderUI = (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex md:flex-row gap-2 justify-between items-center mb-6">
        <h1 className="h2 w-full">Role Management {isSuccess && <sup className="text-xs">(total:{getResponseData?.data?.total || '00'})</sup>}</h1>

        {/* ====== Desktop Controls ====== */}
        <div className="hidden md:flex w-full md:w-auto flex-col md:flex-row gap-2 items-center justify-end">
          <Summary />
          <Button size="sm" variant="outlineWater" onClick={handleFilter} disabled={isLoading}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-filter-right mr-1" viewBox="0 0 16 16">
              <path d="M14 10.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5m0-3a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0 0 1h7a.5.5 0 0 0 .5-.5m0-3a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0 0 1h11a.5.5 0 0 0 .5-.5" />
            </svg>
            Filter
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
            <IoReloadCircleOutline className="w-4 h-4 mr-1" /> Reload
          </Button>
          <Button size="sm" variant="outlineGarden" onClick={() => toggleAddModal(true)}>
            <PlusIcon className="w-4 h-4" />
            Add User
          </Button>
        </div>

        {/* ====== Mobile Controls ====== */}
        <div className="flex md:hidden justify-end">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outlineWater" className="rounded-full backdrop-blur-md bg-white/10 border-white/20 min-w-[8px]">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className={cn(
                'w-64 sm:w-72 backdrop-blur-xl bg-white/10 border border-white/20 text-white shadow-2xl',
                'rounded-l-2xl p-4 flex flex-col space-y-4',
              )}
            >
              <SheetHeader className="flex justify-between items-center">
                <SheetTitle className="text-lg font-semibold text-white/90"> </SheetTitle>
              </SheetHeader>

              <Summary />

              <Button size="sm" variant="outlineWater" onClick={handleFilter} disabled={isLoading}>
                Filter
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
                Reload
              </Button>

              <Button size="sm" variant="outlineGarden" onClick={() => toggleAddModal(true)}>
                Add User
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <SearchBox onSearch={handleSearch} placeholder="Search here ..." autoFocus={false} />

      <ViewRolesTable />

      {activeFilter.isApplied && (
        <div className="flex items-center justify-start my-4">
          <Badge variant="outlineWater" className="flex items-center gap-2 pl-3 pr-1 py-1 text-sm font-normal">
            <span>{activeFilter.displayText}</span>
            <Button aria-label="Clear filter" variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={handleClearFilter}>
              <XIcon className="h-4 w-4" />
            </Button>
          </Badge>
        </div>
      )}

      {/* Modals */}
      {modals.map((ModalComponent, index) => (
        <ModalComponent key={index} />
      ))}

      <FilterDialog isOpen={isFilterModalOpen} onOpenChange={setFilterModalOpen} onApplyFilter={handleApplyFilter} onClearFilter={handleClearFilter} />
    </div>
  );

  if (statusCode === 429) {
    renderUI = <TooManyRequests />;
  }

  return renderUI;
};

export default MainNextPage;
