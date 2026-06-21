/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense, useMemo, type ComponentType } from 'react';
import { AlertTriangle, Download, Edit, Eye, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetPagesQuery } from '@/redux/features/db-builder/pageBuilderSlice';

import { PageContent } from '../utils';
import { Allfields } from '../all-fields/all-fields-index';

interface NormalizedPage {
  _id: string;
  pageName: string;
  path: string;
  content: PageContent[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface DbRecord {
  id: string;
  values: Record<string, string>;
  createdAt: string;
}

type ModalMode = 'add' | 'view' | 'edit' | null;
type FieldRenderer = ComponentType<{ data?: unknown }>;

const ITEMS_PER_PAGE_OPTIONS = [2, 10, 50, 100, 300, 1000];

const getFieldLabel = (field: PageContent) => field.heading || field.name || field.key;

const makeEmptyValues = (fields: PageContent[]) =>
  fields.reduce<Record<string, string>>((acc, field) => {
    acc[field.id] = '';
    return acc;
  }, {});

const escapeCsvValue = (value: string) => `"${value.replace(/"/g, '""')}"`;

function PreviewPageContent() {
  const searchParams = useSearchParams();
  const pathTitle = searchParams.get('pathTitle') || '/';

  const { data: pagesData, isLoading, error, refetch } = useGetPagesQuery({ page: 1, limit: 1000 });

  const normalizedPages = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawPages = pagesData?.data?.pages || (pagesData as any)?.pages || [];
    if (!rawPages.length) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const flattenPages = (list: any[]): NormalizedPage[] => {
      let results: NormalizedPage[] = [];
      list.forEach(item => {
        const norm: NormalizedPage = {
          ...item,
          _id: item._id,
          pageName: item.pageName || item.pageTitle || 'Untitled',
          path: item.path || item.pagePath || '#',
          content: item.content || [],
        };
        results.push(norm);

        if (item.subPage && Array.isArray(item.subPage)) {
          results = [...results, ...flattenPages(item.subPage)];
        }
      });
      return results;
    };

    return flattenPages(rawPages);
  }, [pagesData]);

  const currentPage = useMemo(() => {
    return normalizedPages.find(p => p.path === pathTitle);
  }, [normalizedPages, pathTitle]);

  const [fields, setFields] = useState<PageContent[]>([]);
  const [records, setRecords] = useState<DbRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [activeRecord, setActiveRecord] = useState<DbRecord | null>(null);
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currentPage?.content) {
      const content = Array.isArray(currentPage.content) ? currentPage.content : [];
      setFields(content);
      setDraftValues(makeEmptyValues(content));
    }
  }, [currentPage]);

  useEffect(() => {
    setCurrentPageNumber(1);
  }, [searchValue, itemsPerPage]);

  const visibleRecords = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (query.length < 3) return records;

    return records.filter(record => {
      const searchable = [record.id, record.createdAt, ...Object.values(record.values)].join(' ').toLowerCase();
      return searchable.includes(query);
    });
  }, [records, searchValue]);

  const totalPages = Math.max(1, Math.ceil(visibleRecords.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPageNumber, totalPages);
  const paginatedRecords = visibleRecords.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage);
  const isAllCurrentPageSelected = paginatedRecords.length > 0 && paginatedRecords.every(record => selectedIds.includes(record.id));

  const openAddDialog = () => {
    setActiveRecord(null);
    setDraftValues(makeEmptyValues(fields));
    setModalMode('add');
  };

  const openViewDialog = (record: DbRecord) => {
    setActiveRecord(record);
    setDraftValues(record.values);
    setModalMode('view');
  };

  const openEditDialog = (record: DbRecord) => {
    setActiveRecord(record);
    setDraftValues(record.values);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setActiveRecord(null);
    setDraftValues(makeEmptyValues(fields));
  };

  const saveRecord = () => {
    if (modalMode === 'add') {
      const newRecord: DbRecord = {
        id: `record-${Date.now()}`,
        values: draftValues,
        createdAt: new Date().toISOString(),
      };
      setRecords(prev => [newRecord, ...prev]);
      closeModal();
      return;
    }

    if (modalMode === 'edit' && activeRecord) {
      setRecords(prev => prev.map(record => (record.id === activeRecord.id ? { ...record, values: draftValues } : record)));
      closeModal();
    }
  };

  const deleteRecord = (recordId: string) => {
    setRecords(prev => prev.filter(record => record.id !== recordId));
    setSelectedIds(prev => prev.filter(id => id !== recordId));
  };

  const toggleSelected = (recordId: string) => {
    setSelectedIds(prev => (prev.includes(recordId) ? prev.filter(id => id !== recordId) : [...prev, recordId]));
  };

  const toggleSelectPage = () => {
    const pageIds = paginatedRecords.map(record => record.id);
    setSelectedIds(prev => {
      if (pageIds.every(id => prev.includes(id))) return prev.filter(id => !pageIds.includes(id));
      return Array.from(new Set([...prev, ...pageIds]));
    });
  };

  const bulkEdit = () => {
    setRecords(prev =>
      prev.map(record =>
        selectedIds.includes(record.id)
          ? {
              ...record,
              values: Object.fromEntries(Object.entries(record.values).map(([key, value]) => [key, value ? `${value} (edited)` : 'Bulk edited'])),
            }
          : record,
      ),
    );
  };

  const bulkDelete = () => {
    setRecords(prev => prev.filter(record => !selectedIds.includes(record.id)));
    setSelectedIds([]);
  };

  const exportRecords = (recordsToExport: DbRecord[]) => {
    const headers = ['ID', ...fields.map(getFieldLabel), 'Created At'];
    const rows = recordsToExport.map(record => [record.id, ...fields.map(field => record.values[field.id] || ''), record.createdAt]);
    const csv = [headers, ...rows].map(row => row.map(value => escapeCsvValue(String(value))).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentPage?.pageName || 'db-builder'}-export.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const bulkExport = () => {
    exportRecords(records.filter(record => selectedIds.includes(record.id)));
  };

  const renderFieldPreview = (field: PageContent) => {
    const config = Allfields[field.key as keyof typeof Allfields];
    const AddField = config?.add as FieldRenderer | undefined;
    if (!AddField) return null;

    return (
      <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-slate-300">
        <AddField data={field.data} />
      </div>
    );
  };

  const renderRecordForm = () => (
    <div className="space-y-4">
      {fields.map(field => (
        <div key={field.id} className="space-y-2">
          <label htmlFor={`field-${field.id}`} className="text-sm font-medium text-slate-300">
            {getFieldLabel(field)}
          </label>
          {modalMode === 'add' && renderFieldPreview(field)}
          {modalMode === 'view' ? (
            <div className="min-h-10 rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-slate-200">{draftValues[field.id] || '-'}</div>
          ) : (
            <Input
              id={`field-${field.id}`}
              value={draftValues[field.id] || ''}
              onChange={e => setDraftValues(prev => ({ ...prev, [field.id]: e.target.value }))}
              placeholder={typeof field.data === 'object' && field.data && 'fieldPlaceHolder' in field.data ? String(field.data.fieldPlaceHolder) : 'Enter value'}
              className="bg-slate-950 border-white/10 text-white placeholder:text-slate-600"
            />
          )}
        </div>
      ))}
      {fields.length === 0 && <div className="rounded-lg border border-white/10 bg-black/20 p-6 text-center text-slate-400">No fields configured for this DB page.</div>}
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 text-white">
        <div className="flex items-center gap-2 text-red-400 mb-4">
          <AlertTriangle className="h-6 w-6" />
          <h2 className="text-xl font-bold">Failed to Load</h2>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-slate-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!currentPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-slate-400 mb-6">Path: {pathTitle}</p>
        <Button onClick={() => (window.location.href = '/dashboard/db-builder')} variant="outline">
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-slate-950 pt-[90px] pb-12 px-4 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{currentPage.pageName}</h1>
            <p className="mt-1 font-mono text-sm text-slate-400">{currentPage.path}</p>
          </div>
          <Button onClick={openAddDialog} className="gap-2 bg-blue-600 text-white hover:bg-blue-500">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="Search after 3 characters..."
              className="bg-slate-950 border-white/10 pl-9 text-white placeholder:text-slate-600"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={bulkEdit} disabled={selectedIds.length === 0} variant="outlineGlassy" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Bulk Edit
            </Button>
            <Button onClick={bulkDelete} disabled={selectedIds.length === 0} variant="outlineFire" size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Bulk Delete
            </Button>
            <Button onClick={bulkExport} disabled={selectedIds.length === 0} variant="outlineGlassy" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Bulk Export
            </Button>
          </div>
        </div>

        <div className="hidden overflow-hidden rounded-xl border border-white/10 bg-slate-900/70 md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-400">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input type="checkbox" checked={isAllCurrentPageSelected} onChange={toggleSelectPage} aria-label="Select visible records" />
                  </th>
                  {fields.map(field => (
                    <th key={field.id} className="px-4 py-3">
                      {getFieldLabel(field)}
                    </th>
                  ))}
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map(record => (
                  <tr key={record.id} className="border-b border-white/5 text-slate-200 last:border-0">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selectedIds.includes(record.id)} onChange={() => toggleSelected(record.id)} aria-label="Select record" />
                    </td>
                    {fields.map(field => (
                      <td key={field.id} className="px-4 py-3">
                        {record.values[field.id] || '-'}
                      </td>
                    ))}
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{new Date(record.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button onClick={() => openViewDialog(record)} variant="outlineGlassy" size="sm" className="min-w-1" title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => openEditDialog(record)} variant="outlineGlassy" size="sm" className="min-w-1" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => deleteRecord(record.id)} variant="outlineFire" size="sm" className="min-w-1" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedRecords.length === 0 && (
                  <tr>
                    <td colSpan={fields.length + 3} className="px-4 py-12 text-center text-slate-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3 md:hidden">
          {paginatedRecords.map(record => (
            <div key={record.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input type="checkbox" checked={selectedIds.includes(record.id)} onChange={() => toggleSelected(record.id)} />
                  Select
                </label>
                <span className="font-mono text-xs text-slate-500">{new Date(record.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="space-y-2">
                {fields.map(field => (
                  <div key={field.id} className="rounded-lg bg-black/20 p-3">
                    <div className="text-xs uppercase text-slate-500">{getFieldLabel(field)}</div>
                    <div className="mt-1 text-slate-100">{record.values[field.id] || '-'}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button onClick={() => openViewDialog(record)} variant="outlineGlassy" size="sm" className="min-w-1">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button onClick={() => openEditDialog(record)} variant="outlineGlassy" size="sm" className="min-w-1">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button onClick={() => deleteRecord(record.id)} variant="outlineFire" size="sm" className="min-w-1">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {paginatedRecords.length === 0 && <div className="rounded-xl border border-white/10 bg-white/5 p-10 text-center text-slate-500">No records found.</div>}
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-400">
            Showing {paginatedRecords.length === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1}-
            {Math.min(safeCurrentPage * itemsPerPage, visibleRecords.length)} of {visibleRecords.length}
          </div>
          <div className="flex items-center gap-2">
            <Select value={String(itemsPerPage)} onValueChange={value => setItemsPerPage(Number(value))}>
              <SelectTrigger className="w-[120px] bg-slate-950 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white">
                {ITEMS_PER_PAGE_OPTIONS.map(option => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outlineGlassy" size="sm" disabled={safeCurrentPage === 1} onClick={() => setCurrentPageNumber(page => Math.max(1, page - 1))}>
              Previous
            </Button>
            <span className="min-w-16 text-center text-sm text-slate-300">
              {safeCurrentPage} / {totalPages}
            </span>
            <Button
              variant="outlineGlassy"
              size="sm"
              disabled={safeCurrentPage === totalPages}
              onClick={() => setCurrentPageNumber(page => Math.min(totalPages, page + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={!!modalMode} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="max-h-[85vh] overflow-y-auto bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <div className="flex items-center justify-between gap-3">
              <DialogTitle>{modalMode === 'add' ? 'Add Record' : modalMode === 'edit' ? 'Edit Record' : 'View Record'}</DialogTitle>
              <Button variant="ghost" size="icon" onClick={closeModal} className="text-slate-400 hover:bg-white/10 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          {renderRecordForm()}
          {modalMode !== 'view' && (
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={closeModal} className="text-slate-400 hover:bg-white/5 hover:text-white">
                Cancel
              </Button>
              <Button onClick={saveRecord} disabled={fields.length === 0} className="bg-blue-600 text-white hover:bg-blue-500">
                Save
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>}>
      <PreviewPageContent />
    </Suspense>
  );
}
