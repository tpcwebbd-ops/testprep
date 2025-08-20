/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

'use client';

import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import AddCourse from './components/Add';
import EditCourse from './components/Edit';
import ViewCourse from './components/View';
import SearchBox from './components/SearchBox';
import DeleteCourse from './components/Delete';
import BulkEditCourse from './components/BulkEdit';
import { useCoursesStore } from './store/Store';
import TooManyRequests from './components/TooManyRequest';
import BulkDeleteCourse from './components/BulkDelete';
import { useGetIELTSLecturesQuery } from './redux/rtk-Api';
import ViewCoursesTable from './components/ViewTable';
import BulkUpdateCourses from './components/BulkUpdate';
import BulkDynamicUpdateCourses from './components/BulkDynamicUpdate';

const CoursePage: React.FC = () => {
  const [hashSearchText, setHashSearchText] = useState('');
  const { toggleAddModal, queryPramsLimit, queryPramsPage, queryPramsQ, setQueryPramsPage, setQueryPramsQ } = useCoursesStore();

  const {
    data: getResponseData,
    isSuccess,
    status: statusCode,
  } = useGetIELTSLecturesQuery(
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

  const modals = [AddCourse, ViewCourse, BulkDeleteCourse, BulkEditCourse, EditCourse, DeleteCourse, BulkUpdateCourses, BulkDynamicUpdateCourses];

  let renderUI = (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-6">
        <h1 className="h2 w-full">IELTS Lecture {isSuccess && <sup className="text-xs">(total:{getResponseData?.data?.total || '00'})</sup>}</h1>
        <div className="w-full flex flex-col md:flex-row gap-2 item-center justify-end">
          <Button size="sm" variant="outlineGarden" onClick={() => toggleAddModal(true)}>
            <PlusIcon className="w-4 h-4" />
            Add Lecture
          </Button>
        </div>
      </div>
      <SearchBox onSearch={handleSearch} placeholder="Search here ..." autoFocus={false} />
      <ViewCoursesTable />
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

export default CoursePage;
