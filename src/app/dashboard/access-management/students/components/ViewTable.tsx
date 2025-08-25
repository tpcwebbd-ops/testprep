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

import { IUsers_access } from '../api/v1/model';
import { pageLimitArr } from '../store/StoreConstants';
import { useUsersAccessStore } from '../store/Store';
import { useGetUsers_student_accessQuery } from '../redux/rtk-Api';

import Pagination from './Pagination';
import { handleSuccess } from './utils';

const ViewTableNextComponents: React.FC = () => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof IUsers_access;
    direction: 'asc' | 'desc';
  } | null>(null);
  const {
    setSelectedUsersAccess,
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
  } = useUsersAccessStore();

  const {
    data: getResponseData,
    isLoading,
    refetch,
    isError,
    error,
  } = useGetUsers_student_accessQuery(
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

  // Helper function to get styling for role badges
  const getRoleBadgeStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'moderator':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'mentor':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'instructor':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'student':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  console.log('getResponseData', getResponseData?.data?.users_access);
  const getAllUsersAccessData = useMemo(() => getResponseData?.data?.users_access || [], [getResponseData]);

  const formatDate = (date?: Date) => (date ? format(date, 'MMM dd, yyyy') : 'N/A');
  const formatDateWithSeconds = (date?: Date) => (date ? format(date, 'MMM dd, yyyy, h:mm:ss a') : 'N/A');

  const handleSort = (key: keyof IUsers_access) => {
    setSortConfig(prev => (prev?.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }));
  };

  const sortedUsersAccessData = useMemo(() => {
    if (!sortConfig) return getAllUsersAccessData;
    return [...getAllUsersAccessData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [getAllUsersAccessData, sortConfig]);
  const handleSelectAll = (isChecked: boolean) => setBulkData(isChecked ? getAllUsersAccessData : []);
  const handleSelectRow = (isChecked: boolean, UsersAccess: IUsers_access) =>
    setBulkData(isChecked ? [...bulkData, UsersAccess] : bulkData.filter(item => item.email !== UsersAccess.email));
  const handlePopUp = () => {
    handleSuccess('Reload Successful');
  };
  const renderActions = (UsersAccess: IUsers_access) => (
    <div className="flex gap-2">
      <Button
        variant="outlineDefault"
        size="sm"
        onClick={() => {
          setSelectedUsersAccess(UsersAccess);
          toggleViewModal(true);
        }}
      >
        <EyeIcon className="w-4 h-4 mr-1" /> View
      </Button>
      <Button
        variant="outlineDefault"
        size="sm"
        onClick={() => {
          setSelectedUsersAccess(UsersAccess);
          toggleEditModal(true);
        }}
      >
        <PencilIcon className="w-4 h-4 mr-1" /> Edit
      </Button>
      <Button
        variant="outlineFire"
        size="sm"
        onClick={() => {
          setSelectedUsersAccess(UsersAccess);
          toggleDeleteModal(true);
        }}
      >
        <TrashIcon className="w-4 h-4 mr-1" /> Delete
      </Button>
    </div>
  );
  const renderTableRows = () =>
    sortedUsersAccessData.map((UsersAccess: IUsers_access, index: number) => (
      <TableRow key={(UsersAccess.name as string) || index}>
        <TableCell>
          <Checkbox onCheckedChange={checked => handleSelectRow(!!checked, UsersAccess)} checked={bulkData.some(item => item.email === UsersAccess.email)} />
        </TableCell>
        <TableCell>{(UsersAccess.name as string) || ''}</TableCell>
        <TableCell>{(UsersAccess.email as string) || ''}</TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeStyle(UsersAccess.role || '')}`}>{UsersAccess.role}</span>
          </div>
        </TableCell>

        <TableCell>{(UsersAccess.assignBy as string) || ''}</TableCell>

        <TableCell>{formatDate(UsersAccess.createdAt)}</TableCell>
        <TableCell>{formatDateWithSeconds(UsersAccess.updatedAt)}</TableCell>
        <TableCell className="justify-end flex">{renderActions(UsersAccess)}</TableCell>
      </TableRow>
    ));

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorMessageComponent message={error || 'An error occurred'} />;
  if (getAllUsersAccessData.length === 0) return <div className="py-12 text-2xl text-slate-500">Ops! Nothing was found.</div>;

  return (
    <div className="w-full flex flex-col">
      <div className="w-full my-4">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pb-2 border-b-1 border-slat-400">
          <div className="px-2 gap-2 flex items-center justify-start w-full">
            Total Selected <span className="text-xs text-slate-500">({bulkData.length})</span>
          </div>
          <div className="px-2 gap-2 flex items-center justify-end w-full">
            <Button size="sm" variant="outlineDefault" onClick={() => toggleBulkUpdateModal(true)} disabled={bulkData.length === 0}>
              <PencilIcon className="w-4 h-4 mr-1" /> Bulk Update
            </Button>
            <Button variant="outlineDefault" size="sm" onClick={() => toggleBulkEditModal(true)} disabled={bulkData.length === 0}>
              <PencilIcon className="w-4 h-4 mr-1" /> Edit
            </Button>
            <Button variant="outlineFire" size="sm" onClick={() => toggleBulkDeleteModal(true)} disabled={bulkData.length === 0}>
              <TrashIcon className="w-4 h-4 mr-1" /> Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-1 bg-green-100 hover:bg-green-200 border-green-300 hover:border-green-400 text-green-400 hover:text-green-500 cursor-pointer "
              onClick={() => {
                refetch();
                handlePopUp();
              }}
              disabled={isLoading}
            >
              <IoReloadCircleOutline className="w-4 h-4 mr-1" /> Reload
            </Button>
          </div>
        </div>
      </div>
      <Table className="border-1 border-slate-500">
        <TableHeader className="bg-slate-600 text-slate-50 rounded overflow-hidden border-1 border-slate-600">
          <TableRow>
            <TableHead>
              <Checkbox onCheckedChange={checked => handleSelectAll(!!checked)} checked={bulkData.length === getAllUsersAccessData.length} />
            </TableHead>
            {['Name', 'Email', 'Role', 'Assign By', 'First Assign', 'Last Update'].map(key => (
              <TableHead key={key} className={`font-bold text-slate-50 cursor-pointer`} onClick={() => handleSort(key as keyof IUsers_access)}>
                {key.charAt(0).toUpperCase() + key.slice(1)} {sortConfig?.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
            ))}
            <TableHead className="table-cell font-bold text-slate-50 text-end pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderTableRows()}</TableBody>
      </Table>
      <Pagination
        currentPage={queryPramsPage}
        itemsPerPage={queryPramsLimit}
        onPageChange={e => setQueryPramsPage(e)}
        totalItems={getResponseData?.data?.total}
      />
      <div className="max-w-[380px] flex items-center justify-between pl-2 gap-4 border-1 border-slate-200 rounded-xl w-full mx-auto mt-8">
        <Label htmlFor="set-limit" className="text-right text-slate-500 font-thin pl-3">
          UsersAccess per page
        </Label>
        <Select
          onValueChange={value => {
            setQueryPramsLimit(Number(value));
            setQueryPramsPage(1);
          }}
          defaultValue={queryPramsLimit.toString()}
        >
          <SelectTrigger className="col-span-4">
            <SelectValue placeholder="Select a limit" />
          </SelectTrigger>
          <SelectContent>
            {pageLimitArr.map(i => (
              <SelectItem
                key={i}
                value={i.toString()}
                className="border-1 focus:bg-slate-200 hover:bg-slate-300 dark:focus:bg-slate-500 dark:hover:bg-slate-600 cursor-pointer"
              >
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ViewTableNextComponents;
