/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

'use client';

import React, { useState, useEffect, useRef, JSX } from 'react';
import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import AddFilename8 from './components/Add';
import EditFilename8 from './components/Edit';
import ViewFilename8 from './components/View';
import SearchBox from './components/SearchBox';
import DeleteFilename8 from './components/Delete';
import BulkEditFilename8 from './components/BulkEdit';
import { useUsersAccessStore } from './store/Store';
import TooManyRequests from './components/TooManyRequest';
import BulkDeleteFilename8 from './components/BulkDelete';
import { useGetUsers_instructor_accessQuery } from './redux/rtk-Api';
import ViewUsersAccessTable from './components/ViewTable';
import BulkUpdateUserAccesses from './components/BulkUpdate';

const MainNextPage: React.FC = () => {
  const [hashSearchText, setHashSearchText] = useState<string>('');
  const { toggleAddModal, queryPramsLimit, queryPramsPage, queryPramsQ, setQueryPramsPage, setQueryPramsQ } = useUsersAccessStore();

  const [retryCount, setRetryCount] = useState<number>(0);
  const lastRetryTimestamp = useRef<number | null>(null);

  const {
    data: getResponseData,
    isSuccess,
    isFetching,
    refetch,
    status: statusCode,
  } = useGetUsers_instructor_accessQuery(
    { q: queryPramsQ, page: queryPramsPage, limit: queryPramsLimit },
    {
      selectFromResult: ({ data, isSuccess, status, error, isFetching }) => ({
        data: data, // Cast the data to our defined type
        isSuccess,
        isFetching,
        status: typeof error === 'object' && error && 'status' in error ? (error as FetchBaseQueryError).status : status,
      }),
    },
  );

  useEffect(() => {
    const oneHour = 60 * 60 * 1000;

    // Condition to check for refetching
    if (isSuccess && !isFetching && getResponseData?.data?.total === 0 && retryCount < 2) {
      const now = Date.now();

      // Check if it's the first retry attempt or if the last retry was more than an hour ago
      if (!lastRetryTimestamp.current || now - lastRetryTimestamp.current > oneHour) {
        // If the last attempt was over an hour ago, reset the count
        if (lastRetryTimestamp.current && now - lastRetryTimestamp.current > oneHour) {
          setRetryCount(1); // Start a new retry cycle
        } else {
          setRetryCount(prev => prev + 1);
        }

        lastRetryTimestamp.current = now;
        refetch();
      }
    }
  }, [isSuccess, isFetching, getResponseData, retryCount, refetch]);

  const handleSearch = (query: string) => {
    if (query !== hashSearchText) {
      setHashSearchText(query);
      setQueryPramsPage(1);
      setQueryPramsQ(query);
      setRetryCount(0); // Reset retries on new search
      lastRetryTimestamp.current = null;
    }
  };

  const modals = [AddFilename8, ViewFilename8, BulkDeleteFilename8, BulkEditFilename8, EditFilename8, DeleteFilename8, BulkUpdateUserAccesses];

  let renderUI: JSX.Element = (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-6">
        <h1 className="h2 w-full">Instructor Management {isSuccess && <sup className="text-xs">(total:{getResponseData?.data?.total || '00'})</sup>}</h1>
        <div className="w-full flex flex-col md:flex-row gap-2 item-center justify-end">
          <Button size="sm" variant="outlineGarden" onClick={() => toggleAddModal(true)}>
            <PlusIcon className="w-4 h-4" />
            Give Access
          </Button>
        </div>
      </div>
      <SearchBox onSearch={handleSearch} placeholder="Search here ..." autoFocus={false} />
      <ViewUsersAccessTable />
      {modals.map((ModalComponent, index) => (
        <ModalComponent key={index} />
      ))}
    </div>
  );

  if (statusCode === 429) {
    renderUI = <TooManyRequests />;
  }

  return renderUI;
};

export default MainNextPage;
