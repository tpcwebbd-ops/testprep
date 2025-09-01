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

import { pageLimitArr } from '../store/store-constant';
import { useFinancesStore } from '../store/store';
import { useGetfinancesQuery } from '../redux/rtk-api';
import Pagination from './Pagination';
import { handleSuccess } from './utils';
import { IFinances } from '../store/data-type';

const ViewTableNextComponents: React.FC = () => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof IFinances;
    direction: 'asc' | 'desc';
  } | null>(null);

  const {
    setSelectedFinances,
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
  } = useFinancesStore();

  const {
    data: getResponseData,
    isLoading,
    refetch,
    isError,
    error,
  } = useGetfinancesQuery({
    q: queryPramsQ,
    limit: queryPramsLimit,
    page: queryPramsPage,
  });

  const allData = useMemo(() => getResponseData?.data?.finances || [], [getResponseData]);

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  const handleSort = (key: keyof IFinances) => {
    setSortConfig(prev => (prev?.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }));
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return allData;
    return [...allData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [allData, sortConfig]);

  const handleSelectAll = (isChecked: boolean) => setBulkData(isChecked ? allData : []);

  const handleSelectRow = (isChecked: boolean, item: IFinances) =>
    setBulkData(isChecked ? [...bulkData, item] : bulkData.filter((i: IFinances) => i._id !== item._id));

  const tableHeaders: { key: keyof IFinances; label: string }[] = [
    { key: 'studentName', label: 'Student Name' },
    { key: 'studentEinfo', label: 'Student Email' },
    { key: 'studentNumber', label: 'Student Number' },
    { key: 'courseName', label: 'Course Name' },
    { key: 'coureCode', label: 'Coure Code' },
    { key: 'batchNo', label: 'Batch No' },
    { key: 'paymentStatus', label: 'Payment Status' },
    { key: 'createdAt', label: 'Created At' },
  ];

  const renderActions = (item: IFinances) => (
    <div className="flex gap-2 justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setSelectedFinances(item);
          toggleViewModal(true);
        }}
      >
        <EyeIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setSelectedFinances(item);
          toggleEditModal(true);
        }}
      >
        <PencilIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          setSelectedFinances(item);
          toggleDeleteModal(true);
        }}
      >
        <TrashIcon className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderTableRows = () =>
    sortedData.map((item: IFinances) => (
      <TableRow key={item._id}>
        <TableCell>
          <Checkbox onCheckedChange={checked => handleSelectRow(!!checked, item)} checked={bulkData.some((i: IFinances) => i._id === item._id)} />
        </TableCell>
        <TableCell>{(item as IFinances)['studentName']}</TableCell>
        <TableCell>{(item as IFinances)['studentEinfo']}</TableCell>
        <TableCell>{(item as IFinances)['studentNumber']}</TableCell>
        <TableCell>{(item as IFinances)['courseName']}</TableCell>
        <TableCell>{(item as IFinances)['coureCode']}</TableCell>
        <TableCell>{(item as IFinances)['batchNo']}</TableCell>
        <TableCell>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              (item as IFinances)['paymentStatus'] ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {item['paymentStatus'] ? 'Yes' : 'No'}
          </span>
        </TableCell>
        <TableCell>{formatDate(item['createdAt'])}</TableCell>
        <TableCell>{renderActions(item)}</TableCell>
      </TableRow>
    ));

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorMessageComponent message={error?.toString() || 'An error occurred'} />;
  return (
    <div className="w-full flex flex-col">
      <div className="w-full my-4">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pb-2 border-b">
          <div className="flex items-center gap-2 justify-start w-full">
            <Label>Selected: </Label>
            <span className="text-sm text-slate-500">({bulkData.length})</span>
          </div>
          <div className="flex items-center justify-end w-full gap-2">
            <Button size="sm" variant="destructive" onClick={() => toggleBulkDeleteModal(true)} disabled={bulkData.length === 0}>
              <TrashIcon className="w-4 h-4 mr-1" /> B.Delete
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                refetch();
                handleSuccess('Reloaded!');
              }}
              disabled={isLoading}
            >
              <IoReloadCircleOutline className="w-4 h-4 mr-1" /> Reload
            </Button>
          </div>
        </div>
      </div>

      {allData.length === 0 ? (
        <div className="py-12 text-center text-2xl text-slate-500">Ops! Nothing was found.</div>
      ) : (
        <Table className="border">
          <TableHeader className="bg-slate-100">
            <TableRow>
              <TableHead>
                <Checkbox onCheckedChange={checked => handleSelectAll(!!checked)} checked={bulkData.length === allData.length && allData.length > 0} />
              </TableHead>
              {tableHeaders.map(({ key, label }) => (
                <TableHead key={key} className="cursor-pointer" onClick={() => handleSort(key as keyof IFinances)}>
                  {label} {sortConfig?.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderTableRows()}</TableBody>
        </Table>
      )}

      <Pagination
        currentPage={queryPramsPage}
        itemsPerPage={queryPramsLimit}
        onPageChange={page => setQueryPramsPage(page)}
        totalItems={getResponseData?.data?.total || 1}
      />

      <div className="max-w-xs flex items-center self-center justify-between pl-2 gap-4 border rounded-lg w-full mx-auto mt-8">
        <Label htmlFor="set-limit" className="text-right text-slate-500 font-normal pl-3">
          Payment per page
        </Label>
        <Select
          onValueChange={value => {
            setQueryPramsLimit(Number(value));
            setQueryPramsPage(1);
          }}
          defaultValue={queryPramsLimit.toString()}
        >
          <SelectTrigger className="border-0">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {pageLimitArr.map(i => (
              <SelectItem key={i} value={i.toString()} className="cursor-pointer">
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
