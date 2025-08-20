/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

'use client';

import { format } from 'date-fns';
import React, { useState, useMemo } from 'react';
import { IoReloadCircleOutline } from 'react-icons/io5';
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingComponent from '@/components/common/Loading';
import ErrorMessageComponent from '@/components/common/Error';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { SpokenCourse } from '../api/v1/model';
import { pageLimitArr } from '../store/StoreConstants';
import { useCoursesStore } from '../store/Store';
import { useGetSpokenLecturesQuery } from '../redux/rtk-Api';

import Pagination from './Pagination';
import { handleSuccess } from './utils';

const ViewCoursesTable: React.FC = () => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof SpokenCourse;
    direction: 'asc' | 'desc';
  } | null>(null);

  const {
    setSelectedCourses,
    toggleBulkEditModal,
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
  } = useCoursesStore();

  const {
    data: getResponseData,
    isLoading,
    refetch,
    isError,
    error,
  } = useGetSpokenLecturesQuery(
    { q: queryPramsQ, limit: queryPramsLimit, page: queryPramsPage },
    {
      selectFromResult: ({ data, isError, error, isLoading }) => ({
        data,
        isLoading,
        isError,
        error,
      }),
    },
  );

  const allCoursesData = useMemo(() => getResponseData?.data?.courses || [], [getResponseData]);

  const formatDate = (date?: Date) => (date ? format(new Date(date), 'MMM dd, yyyy') : 'N/A');

  const handleSort = (key: keyof SpokenCourse) => {
    setSortConfig(prev => (prev?.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }));
  };

  const sortedCoursesData = useMemo(() => {
    if (!sortConfig) return allCoursesData;
    return [...allCoursesData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [allCoursesData, sortConfig]);

  const handleSelectAll = (isChecked: boolean) => setBulkData(isChecked ? allCoursesData : []);

  const handleSelectRow = (isChecked: boolean, course: SpokenCourse) =>
    setBulkData(isChecked ? [...bulkData, course] : bulkData.filter(item => item._id !== course._id));

  const handleReload = () => {
    refetch();
    handleSuccess('Reload Successful');
  };

  const renderActions = (course: SpokenCourse) => (
    <div className="flex gap-2 justify-end">
      <Button
        variant="outlineDefault"
        size="sm"
        onClick={() => {
          setSelectedCourses(course);
          toggleViewModal(true);
        }}
      >
        <EyeIcon className="w-4 h-4" /> View
      </Button>
      <Button
        variant="outlineDefault"
        size="sm"
        onClick={() => {
          setSelectedCourses(course);
          toggleEditModal(true);
        }}
      >
        <PencilIcon className="w-4 h-4" /> Edit
      </Button>
      <Button
        variant="outlineFire"
        size="sm"
        onClick={() => {
          setSelectedCourses(course);
          toggleDeleteModal(true);
        }}
      >
        <TrashIcon className="w-4 h-4" /> Delete
      </Button>
    </div>
  );

  const renderTableRows = () =>
    sortedCoursesData.map((course: SpokenCourse) => (
      <TableRow key={course._id}>
        <TableCell>
          <Checkbox onCheckedChange={checked => handleSelectRow(!!checked, course)} checked={bulkData.some(item => item._id === course._id)} />
        </TableCell>
        <TableCell className="font-medium">{course.lectureNo}</TableCell>
        <TableCell className="font-medium">{course.lectureTitle}</TableCell>
        <TableCell className="font-medium">{course.status}</TableCell>
        <TableCell>
          {course.pdf && (
            <a href={course.pdf} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              View PDF
            </a>
          )}
        </TableCell>
        <TableCell>
          {course.videoLink && (
            <a href={course.videoLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              Watch Video
            </a>
          )}
        </TableCell>
        <TableCell>{formatDate(course.createdAt)}</TableCell>
        <TableCell>{renderActions(course)}</TableCell>
      </TableRow>
    ));

  const tableHeaders: { key: keyof SpokenCourse; label: string }[] = [
    { key: 'lectureNo', label: 'Lecture No' },
    { key: 'lectureTitle', label: 'Lecture Title' },
    { key: 'status', label: 'Status' },
    { key: 'pdf', label: 'PDF' },
    { key: 'videoLink', label: 'Video Link' },
    { key: 'createdAt', label: 'Created At' },
  ];

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorMessageComponent message={error || 'An error occurred'} />;
  if (allCoursesData.length === 0) return <div className="py-12 text-center text-2xl text-slate-500">Ops! No courses found.</div>;

  return (
    <div className="w-full flex flex-col">
      <div className="w-full my-4">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pb-2 border-b">
          <div className="px-2 gap-2 flex items-center justify-start w-full">
            Total Selected <span className="text-xs text-slate-500">({bulkData.length})</span>
          </div>
          <div className="px-2 gap-2 flex items-center justify-end w-full">
            {/* <Button variant="outlineDefault" size="sm" onClick={() => toggleBulkDynamicUpdateModal(true)} disabled={bulkData.length === 0}>
              <PencilIcon className="w-4 h-4 mr-1" /> B. Dynamic Update
            </Button>
            <Button variant="outlineDefault" size="sm" onClick={() => toggleBulkUpdateModal(true)} disabled={bulkData.length === 0}>
              <PencilIcon className="w-4 h-4 mr-1" /> B. Update
            </Button> */}
            <Button variant="outlineDefault" size="sm" onClick={() => toggleBulkEditModal(true)} disabled={bulkData.length === 0}>
              <PencilIcon className="w-4 h-4 mr-1" /> Edit
            </Button>
            <Button variant="outlineFire" size="sm" onClick={() => toggleBulkDeleteModal(true)} disabled={bulkData.length === 0}>
              <TrashIcon className="w-4 h-4 mr-1" /> Delete
            </Button>
            <Button variant="outline" size="sm" className="border-green-300 text-green-500 hover:bg-green-100" onClick={handleReload} disabled={isLoading}>
              <IoReloadCircleOutline className="w-4 h-4 mr-1" /> Reload
            </Button>
          </div>
        </div>
      </div>
      <Table className="border">
        <TableHeader className="bg-slate-100">
          <TableRow>
            <TableHead>
              <Checkbox
                onCheckedChange={checked => handleSelectAll(!!checked)}
                checked={bulkData.length === allCoursesData.length && allCoursesData.length > 0}
              />
            </TableHead>
            {tableHeaders.map(({ key, label }) => (
              <TableHead key={key} className="cursor-pointer" onClick={() => handleSort(key)}>
                {label} {sortConfig?.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
            ))}
            <TableHead className="text-right pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderTableRows()}</TableBody>
      </Table>
      <Pagination currentPage={queryPramsPage} itemsPerPage={queryPramsLimit} onPageChange={setQueryPramsPage} totalItems={getResponseData?.data?.total || 0} />
      <div className="max-w-xs flex items-center justify-between pl-2 gap-4 border rounded-lg w-full mx-auto mt-8">
        <Label htmlFor="set-limit" className="text-right text-slate-500 font-normal pl-3">
          Courses per page
        </Label>
        <Select
          onValueChange={value => {
            setQueryPramsLimit(Number(value));
            setQueryPramsPage(1);
          }}
          defaultValue={String(queryPramsLimit)}
        >
          <SelectTrigger className="border-0">
            <SelectValue placeholder="Select limit" />
          </SelectTrigger>
          <SelectContent>
            {pageLimitArr.map(i => (
              <SelectItem key={i} value={String(i)} className="cursor-pointer">
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ViewCoursesTable;
