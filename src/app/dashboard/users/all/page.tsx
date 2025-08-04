/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

'use client';

import React, { useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import EditFilename8 from './components/Edit';
import ViewFilename8 from './components/View';
import SearchBox from './components/SearchBox';
import DeleteFilename8 from './components/Delete';
import { useGAuthUsersStore } from './store/Store';
import TooManyRequests from './components/TooManyRequest';
import BulkDeleteFilename8 from './components/BulkDelete';
import { useGetGAuthUsersQuery } from './redux/rtk-Api';
import ViewGAuthUsersTable from './components/ViewTable';

const MainNextPage: React.FC = () => {
  const [hashSearchText, setHashSearchText] = useState('');
  const { queryPramsLimit, queryPramsPage, queryPramsQ, setQueryPramsPage, setQueryPramsQ } = useGAuthUsersStore();

  const {
    data: getResponseData,
    isSuccess,
    status: statusCode,
  } = useGetGAuthUsersQuery(
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

  const modals = [ViewFilename8, BulkDeleteFilename8, EditFilename8, DeleteFilename8];

  let renderUI = (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold w-full">
          GAuthUser Management {isSuccess && <sup className="text-xs">(total:{getResponseData?.data?.total || '00'})</sup>}
        </h1>
        <div className="w-full flex gap-2 item-center justify-end"></div>
      </div>
      <SearchBox onSearch={handleSearch} placeholder="Search here ..." autoFocus={false} />
      <ViewGAuthUsersTable />
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
