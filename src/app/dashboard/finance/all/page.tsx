'use client';

import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BiRightArrowAlt } from 'react-icons/bi';

import { Button } from '@/components/ui/button';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { useFinancesStore } from './store/store';
import TooManyRequests from './components/TooManyRequest';
import SearchBox from './components/SearchBox';
import { useGetfinancesQuery } from './redux/rtk-api';
import ViewFinancesTable from './components/TableView';

// import BulkEditFile from './components/BulkEdit';
// import AddFile from './components/Add';
// import EditFile from './components/Edit';
// import ViewFile from './components/View';
// import DeleteFile from './components/Delete';
// import BulkDeleteFile from './components/BulkDelete';
// import BulkUpdateFinances from './components/BulkUpdate';
// import BulkDynamicUpdateFinances from './components/BulkDynamicUpdate';

const MainNextPage: React.FC = () => {
  const [hashSearchText, setHashSearchText] = useState('');
  const { toggleAddModal, queryPramsLimit, queryPramsPage, queryPramsQ, setQueryPramsPage, setQueryPramsQ } = useFinancesStore();

  const {
    data: getResponseData,
    isSuccess,
    status: statusCode,
  } = useGetfinancesQuery(
    { q: queryPramsQ, page: queryPramsPage, limit: queryPramsLimit },
    {
      selectFromResult: ({ data, isSuccess, status, error }) => ({
        data,
        isSuccess,
        status: 'status' in (error || {}) ? (error as FetchBaseQueryError).status : status, // Extract HTTP status code
        error,
      }),
    },
  );

  const handleSearch = (query: string) => {
    if (query !== hashSearchText) {
      setHashSearchText(query);
      setQueryPramsPage(1);
      setQueryPramsQ(query);
    }
  };

  // const modals = [AddFile, ViewFile, BulkDeleteFile, BulkEditFile, EditFile, DeleteFile, BulkUpdateFinances, BulkDynamicUpdateFinances];
  const router = useRouter();

  let renderUI = (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-6">
        <h1 className="h2 w-full">Finance Management {isSuccess && <sup className="text-xs">(total:{getResponseData?.data?.total || '00'})</sup>}</h1>
        <div className="w-full flex flex-col md:flex-row gap-2 item-center justify-end">
          <Button size="sm" variant="outlineGarden" onClick={() => toggleAddModal(true)}>
            <PlusIcon className="w-4 h-4" />
            Add New Payment
          </Button>
        </div>
      </div>
      <SearchBox onSearch={handleSearch} placeholder="Search here ..." autoFocus={false} />
      <ViewFinancesTable />
      {/* {modals.map((ModalComponent, index) => (
        <ModalComponent key={index} />
      ))} */}
    </div>
  );

  if (statusCode === 429) {
    renderUI = <TooManyRequests />;
  }

  return renderUI;
};

export default MainNextPage;
