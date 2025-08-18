'use client';

import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BiRightArrowAlt } from 'react-icons/bi';

import { Button } from '@/components/ui/button';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import AddFile from './components/Add';
import EditFile from './components/Edit';
import ViewFile from './components/View';
import SearchBox from './components/SearchBox';
import DeleteFile from './components/Delete';
import BulkEditFile from './components/BulkEdit';
import { usePostsStore } from './store/store';
import TooManyRequests from './components/TooManyRequest';
import BulkDeleteFile from './components/BulkDelete';
import { useGetPostsQuery } from './redux/rtk-api';
import ViewPostsTable from './components/TableView';
import BulkUpdatePosts from './components/BulkUpdate';
import BulkDynamicUpdatePosts from './components/BulkDynamicUpdate';

const MainNextPage: React.FC = () => {
  const [hashSearchText, setHashSearchText] = useState('');
  const { toggleAddModal, queryPramsLimit, queryPramsPage, queryPramsQ, setQueryPramsPage, setQueryPramsQ } = usePostsStore();

  const {
    data: getResponseData,
    isSuccess,
    status: statusCode,
  } = useGetPostsQuery(
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

  const modals = [AddFile, ViewFile, BulkDeleteFile, BulkEditFile, EditFile, DeleteFile, BulkUpdatePosts, BulkDynamicUpdatePosts];
  const router = useRouter();

  let renderUI = (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-6">
        <h1 className="h2 w-full">Post Management {isSuccess && <sup className="text-xs">(total:{getResponseData?.data?.total || '00'})</sup>}</h1>
        <div className="w-full flex flex-col md:flex-row gap-2 item-center justify-end">
          <Button size="sm" variant="outlineGarden" onClick={() => router.push('/dashboard/post/ssr-view')}>
            <BiRightArrowAlt className="w-4 h-4" />
            SSR View
          </Button>
          <Button size="sm" variant="outlineGarden" onClick={() => router.push('/dashboard/post/client-view')}>
            <BiRightArrowAlt className="w-4 h-4" />
            Client View
          </Button>
          <Button size="sm" variant="outlineGarden" onClick={() => toggleAddModal(true)}>
            <PlusIcon className="w-4 h-4" />
            Add Post
          </Button>
        </div>
      </div>
      <SearchBox onSearch={handleSearch} placeholder="Search here ..." autoFocus={false} />
      <ViewPostsTable />
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
