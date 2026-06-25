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
import { AlertTriangle, Columns3, Download, Edit, Eye, Filter, Plus, RefreshCcw, RefreshCw, Search, Trash2, TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
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
type BulkModalMode = 'edit' | 'delete' | 'export' | null;
type ActionDialog = 'summary' | 'filter' | null;
type FieldRenderer = ComponentType<{
  data?: unknown;
  value?: string;
  onChange?: (value: string) => void;
}>;

const ITEMS_PER_PAGE_OPTIONS = [2, 10, 50, 100, 300, 1000];
const summaryColors = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb923c'];

const getFieldLabel = (field: PageContent) => field.heading || field.name || field.key;
const formatDateInput = (date: Date) => date.toISOString().slice(0, 10);

const makeEmptyValues = (fields: PageContent[]) =>
  fields.reduce<Record<string, string>>((acc, field) => {
    acc[field.id] = '';
    return acc;
  }, {});

const escapeCsvValue = (value: string) => `"${value.replace(/"/g, '""')}"`;
const escapeXmlValue = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

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
  const [visibleFieldIds, setVisibleFieldIds] = useState<string[]>([]);
  const [records, setRecords] = useState<DbRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [bulkModalMode, setBulkModalMode] = useState<BulkModalMode>(null);
  const [actionDialog, setActionDialog] = useState<ActionDialog>(null);
  const [filterMode, setFilterMode] = useState<'month' | 'range'>('month');
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [rangeStart, setRangeStart] = useState(() => formatDateInput(new Date()));
  const [rangeEnd, setRangeEnd] = useState(() => formatDateInput(new Date()));
  const [activeDateFilter, setActiveDateFilter] = useState<{ label: string; start: string; end: string } | null>(null);
  const [bulkEditFieldId, setBulkEditFieldId] = useState('');
  const [bulkEditValue, setBulkEditValue] = useState('');
  const [activeRecord, setActiveRecord] = useState<DbRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<DbRecord | null>(null);
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currentPage?.content) {
      const content = Array.isArray(currentPage.content) ? currentPage.content : [];
      setFields(content);
      setVisibleFieldIds(content.slice(0, 3).map(field => field.id));
      setDraftValues(makeEmptyValues(content));
    }
  }, [currentPage]);

  useEffect(() => {
    setCurrentPageNumber(1);
  }, [searchValue, itemsPerPage, activeDateFilter]);

  const visibleRecords = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    const dateFilteredRecords = activeDateFilter
      ? records.filter(record => {
          const createdTime = new Date(record.createdAt).getTime();
          const startTime = new Date(`${activeDateFilter.start}T00:00:00`).getTime();
          const endTime = new Date(`${activeDateFilter.end}T23:59:59`).getTime();
          return createdTime >= startTime && createdTime <= endTime;
        })
      : records;

    if (query.length < 3) return dateFilteredRecords;

    return dateFilteredRecords.filter(record => {
      const searchable = [record.id, record.createdAt, ...Object.values(record.values)].join(' ').toLowerCase();
      return searchable.includes(query);
    });
  }, [activeDateFilter, records, searchValue]);

  const totalPages = Math.max(1, Math.ceil(visibleRecords.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPageNumber, totalPages);
  const paginatedRecords = visibleRecords.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage);
  const isAllCurrentPageSelected = paginatedRecords.length > 0 && paginatedRecords.every(record => selectedIds.includes(record.id));
  const visibleFields = useMemo(() => fields.filter(field => visibleFieldIds.includes(field.id)), [fields, visibleFieldIds]);
  const displayColumnCount = Math.max(visibleFields.length, 1);
  const summaryData = useMemo(() => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const monthlyMap = records.reduce<Record<string, number>>((acc, record) => {
      const date = new Date(record.createdAt);
      const key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return {
      totalRecords: records.length,
      filteredRecords: visibleRecords.length,
      recordsLast24Hours: records.filter(record => new Date(record.createdAt).getTime() >= oneDayAgo).length,
      recordsLastMonth: records.filter(record => new Date(record.createdAt).getTime() >= oneMonthAgo.getTime()).length,
      monthlyRows: Object.entries(monthlyMap).map(([month, count]) => ({ month, count })),
    };
  }, [records, visibleRecords.length]);

  const toggleVisibleField = (fieldId: string) => {
    setVisibleFieldIds(prev => (prev.includes(fieldId) ? prev.filter(id => id !== fieldId) : [...prev, fieldId]));
  };

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

  const openBulkEditDialog = () => {
    setBulkEditFieldId(fields[0]?.id || '');
    setBulkEditValue('');
    setBulkModalMode('edit');
  };

  const closeBulkModal = () => {
    setBulkModalMode(null);
    setBulkEditFieldId('');
    setBulkEditValue('');
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

  const confirmDeleteRecord = () => {
    if (!recordToDelete) return;
    deleteRecord(recordToDelete.id);
    setRecordToDelete(null);
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

  const confirmBulkEdit = () => {
    if (!bulkEditFieldId) return;

    setRecords(prev =>
      prev.map(record =>
        selectedIds.includes(record.id)
          ? {
              ...record,
              values: {
                ...record.values,
                [bulkEditFieldId]: bulkEditValue,
              },
            }
          : record,
      ),
    );
    closeBulkModal();
  };

  const confirmBulkDelete = () => {
    setRecords(prev => prev.filter(record => !selectedIds.includes(record.id)));
    setSelectedIds([]);
    closeBulkModal();
  };

  const downloadBlob = (content: string, type: string, extension: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentPage?.pageName || 'db-builder'}-export.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const buildExportRows = (recordsToExport: DbRecord[]) => {
    const headers = ['ID', ...fields.map(getFieldLabel), 'Created At'];
    const rows = recordsToExport.map(record => [record.id, ...fields.map(field => record.values[field.id] || ''), record.createdAt]);
    return { headers, rows };
  };

  const exportRecordsAsCsv = (recordsToExport: DbRecord[]) => {
    const { headers, rows } = buildExportRows(recordsToExport);
    const csv = [headers, ...rows].map(row => row.map(value => escapeCsvValue(String(value))).join(',')).join('\n');
    downloadBlob(csv, 'text/csv;charset=utf-8;', 'csv');
  };

  const exportRecordsAsXlsx = (recordsToExport: DbRecord[]) => {
    const { headers, rows } = buildExportRows(recordsToExport);
    const xmlRows = [headers, ...rows]
      .map(row => `<Row>${row.map(value => `<Cell><Data ss:Type="String">${escapeXmlValue(String(value))}</Data></Cell>`).join('')}</Row>`)
      .join('');
    const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Export">
    <Table>${xmlRows}</Table>
  </Worksheet>
</Workbook>`;
    downloadBlob(xml, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;', 'xlsx');
  };

  const confirmBulkExport = (format: 'csv' | 'xlsx') => {
    const recordsToExport = records.filter(record => selectedIds.includes(record.id));
    if (format === 'csv') {
      exportRecordsAsCsv(recordsToExport);
    } else {
      exportRecordsAsXlsx(recordsToExport);
    }
    closeBulkModal();
  };

  const applyDateFilter = () => {
    if (filterMode === 'month') {
      const [year, month] = selectedMonth.split('-').map(Number);
      if (!year || !month) return;
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      setActiveDateFilter({
        label: `${formatDateInput(start)} to ${formatDateInput(end)}`,
        start: formatDateInput(start),
        end: formatDateInput(end),
      });
      setActionDialog(null);
      return;
    }

    if (!rangeStart || !rangeEnd) return;
    const start = rangeStart <= rangeEnd ? rangeStart : rangeEnd;
    const end = rangeStart <= rangeEnd ? rangeEnd : rangeStart;
    setActiveDateFilter({ label: `${start} to ${end}`, start, end });
    setActionDialog(null);
  };

  const clearDateFilter = () => {
    setActiveDateFilter(null);
    setActionDialog(null);
  };

  const renderFieldInput = (field: PageContent) => {
    const config = Allfields[field.key as keyof typeof Allfields];
    const modeComponent = modalMode === 'view' ? config?.view : modalMode === 'edit' ? config?.update : config?.add;
    const FieldComponent = modeComponent as FieldRenderer | undefined;
    if (!FieldComponent) return null;

    return (
      <div className="col-span-3">
        <FieldComponent data={field.data} value={draftValues[field.id] || ''} onChange={value => setDraftValues(prev => ({ ...prev, [field.id]: value }))} />
      </div>
    );
  };

  const renderRecordForm = () => (
    <div className="grid gap-4 py-4 px-6 text-white">
      {fields.map(field => (
        <div key={field.id} className={`grid grid-cols-1 md:grid-cols-4 gap-4 pr-1 ${modalMode === 'view' ? 'items-center border-b border-white/10 py-2' : 'items-center'}`}>
          <Label htmlFor={`field-${field.id}`} className={`${modalMode === 'view' ? 'text-sm text-white/80' : 'text-right'}`}>
            {getFieldLabel(field)}
          </Label>
          {renderFieldInput(field)}
        </div>
      ))}
      {fields.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-300">No fields configured for this DB page.</div>
      )}
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-transparent text-white">
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
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-slate-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!currentPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent text-white">
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-slate-400 mb-6">Path: {pathTitle}</p>
        <Button onClick={() => (window.location.href = '/dashboard/db-builder')} variant="outline">
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-transparent pt-[90px] pb-12 px-4 md:px-12 text-slate-200 font-sans overflow-x-hidden">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
              {currentPage.pageName}
            </h1>
            <p className="mt-2 font-mono text-sm text-white/50">{currentPage.path}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outlineGlassy" onClick={() => setActionDialog('summary')}>
              <TrendingUp className="mr-2 h-4 w-4" /> Summary
            </Button>
            <Button size="sm" variant="outlineWater" onClick={() => setActionDialog('filter')}>
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button size="sm" variant="outlineWater" onClick={() => refetch()}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Reload
            </Button>
            <Button onClick={openAddDialog} variant="outlineGlassy" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="Search after 3 characters..."
              className="bg-white/5 border-white/10 pl-9 text-white placeholder:text-white/40 rounded-2xl"
            />
          </div>

          {activeDateFilter && (
            <div className="rounded-sm border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/80">
              Filtering from {activeDateFilter.label}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setIsColumnDialogOpen(true)} disabled={fields.length === 0} variant="outlineGlassy" size="sm" className="gap-2">
              <Columns3 className="h-4 w-4" />
              Clumn
            </Button>
            <Button onClick={openBulkEditDialog} disabled={selectedIds.length === 0 || fields.length === 0} variant="outlineGlassy" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Bulk Edit
            </Button>
            <Button onClick={() => setBulkModalMode('delete')} disabled={selectedIds.length === 0} variant="outlineFire" size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Bulk Delete
            </Button>
            <Button onClick={() => setBulkModalMode('export')} disabled={selectedIds.length === 0} variant="outlineGlassy" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Bulk Export
            </Button>
          </div>
        </div>

        <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-white/50">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input type="checkbox" checked={isAllCurrentPageSelected} onChange={toggleSelectPage} aria-label="Select visible records" />
                  </th>
                  {visibleFields.map(field => (
                    <th key={field.id} className="px-4 py-3">
                      {getFieldLabel(field)}
                    </th>
                  ))}
                  {visibleFields.length === 0 && <th className="px-4 py-3">Columns</th>}
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map(record => (
                  <tr key={record.id} className="border-b border-white/5 text-slate-200 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selectedIds.includes(record.id)} onChange={() => toggleSelected(record.id)} aria-label="Select record" />
                    </td>
                    {visibleFields.map(field => (
                      <td key={field.id} className="px-4 py-3">
                        {record.values[field.id] || '-'}
                      </td>
                    ))}
                    {visibleFields.length === 0 && <td className="px-4 py-3 text-slate-500">No columns selected.</td>}
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{new Date(record.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button onClick={() => openViewDialog(record)} variant="outlineGlassy" size="sm" className="min-w-1" title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => openEditDialog(record)} variant="outlineGlassy" size="sm" className="min-w-1" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => setRecordToDelete(record)} variant="outlineFire" size="sm" className="min-w-1" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedRecords.length === 0 && (
                  <tr>
                    <td colSpan={displayColumnCount + 3} className="px-4 py-12 text-center text-slate-500">
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
            <div key={record.id} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input type="checkbox" checked={selectedIds.includes(record.id)} onChange={() => toggleSelected(record.id)} />
                  Select
                </label>
                <span className="font-mono text-xs text-slate-500">{new Date(record.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="space-y-2">
                {visibleFields.map(field => (
                  <div key={field.id} className="rounded-2xl border border-white/5 bg-white/5 p-3">
                    <div className="text-xs uppercase text-slate-500">{getFieldLabel(field)}</div>
                    <div className="mt-1 text-slate-100">{record.values[field.id] || '-'}</div>
                  </div>
                ))}
                {visibleFields.length === 0 && (
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-3 text-sm text-slate-500">No columns selected.</div>
                )}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button onClick={() => openViewDialog(record)} variant="outlineGlassy" size="sm" className="min-w-1">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button onClick={() => openEditDialog(record)} variant="outlineGlassy" size="sm" className="min-w-1">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button onClick={() => setRecordToDelete(record)} variant="outlineFire" size="sm" className="min-w-1">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {paginatedRecords.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-10 text-center text-slate-500">No records found.</div>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-400">
            Showing {paginatedRecords.length === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1}-
            {Math.min(safeCurrentPage * itemsPerPage, visibleRecords.length)} of {visibleRecords.length}
          </div>
          <div className="flex items-center gap-2">
            <Select value={String(itemsPerPage)} onValueChange={value => setItemsPerPage(Number(value))}>
              <SelectTrigger className="w-[120px] bg-white/10 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/10 backdrop-blur-2xl border-white/10 text-white">
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

      <Dialog open={actionDialog === 'filter'} onOpenChange={open => !open && setActionDialog(null)}>
        <DialogContent className="bg-white/10 rounded-sm bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 text-white">
          <DialogHeader>
            <DialogTitle className="text-white bg-clip-text bg-linear-to-r from-white to-blue-200">Filter {currentPage.pageName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-2 rounded-sm border border-white/10 bg-white/5 p-1">
              <Button size="sm" variant={filterMode === 'month' ? 'outlineGarden' : 'ghost'} onClick={() => setFilterMode('month')}>
                By Month
              </Button>
              <Button size="sm" variant={filterMode === 'range' ? 'outlineGarden' : 'ghost'} onClick={() => setFilterMode('range')}>
                By Date Range
              </Button>
            </div>

            {filterMode === 'month' ? (
              <div className="space-y-2">
                <Label className="text-white">Select Month</Label>
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={event => setSelectedMonth(event.target.value)}
                  className="bg-white/10 border-white/10 text-white"
                />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white">Start Date</Label>
                  <Input
                    type="date"
                    value={rangeStart}
                    onChange={event => setRangeStart(event.target.value)}
                    className="bg-white/10 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">End Date</Label>
                  <Input
                    type="date"
                    value={rangeEnd}
                    onChange={event => setRangeEnd(event.target.value)}
                    className="bg-white/10 border-white/10 text-white"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-2">
              <Button size="sm" variant="outlineFire" onClick={clearDateFilter}>
                Clear Filter
              </Button>
              <Button size="sm" variant="outlineGarden" onClick={applyDateFilter} disabled={filterMode === 'month' ? !selectedMonth : !rangeStart || !rangeEnd}>
                Apply Filter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={actionDialog === 'summary'} onOpenChange={open => !open && setActionDialog(null)}>
        <DialogContent className="max-w-4xl bg-white/10 rounded-sm bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 text-white">
          <DialogHeader>
            <DialogTitle className="text-white bg-clip-text bg-linear-to-r from-white to-blue-200">{currentPage.pageName} Summary</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Total Records', value: summaryData.totalRecords },
                { label: 'Filtered Records', value: summaryData.filteredRecords },
                { label: 'Last 24 Hours', value: summaryData.recordsLast24Hours },
                { label: 'Last Month', value: summaryData.recordsLastMonth },
              ].map((item, index) => (
                <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/70">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold" style={{ color: summaryColors[index % summaryColors.length] }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <div className="border-b border-white/10 px-4 py-3 text-sm font-medium text-white/80">Monthly Records</div>
              <div className="max-h-[45vh] overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-xs uppercase text-white/50">
                    <tr>
                      <th className="px-4 py-3">Month</th>
                      <th className="px-4 py-3">Records</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryData.monthlyRows.length > 0 ? (
                      summaryData.monthlyRows.map((row, index) => (
                        <tr key={row.month} className="border-t border-white/10">
                          <td className="px-4 py-3">{row.month}</td>
                          <td className="px-4 py-3 font-semibold" style={{ color: summaryColors[index % summaryColors.length] }}>
                            {row.count}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-4 py-10 text-center text-white/60">
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isColumnDialogOpen} onOpenChange={setIsColumnDialogOpen}>
        <DialogContent className="bg-white/10 rounded-sm bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 text-white">
          <DialogHeader>
            <DialogTitle>Clumn</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-slate-300">
              Columns ({visibleFieldIds.length}/{fields.length})
            </div>
            <div className="max-h-[50vh] space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-2">
              {fields.map(field => (
                <label
                  key={field.id}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
                >
                  <span className="min-w-0 truncate">{getFieldLabel(field)}</span>
                  <input
                    type="checkbox"
                    checked={visibleFieldIds.includes(field.id)}
                    onChange={() => toggleVisibleField(field.id)}
                    aria-label={`Toggle ${getFieldLabel(field)} column`}
                  />
                </label>
              ))}
              {fields.length === 0 && <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center text-sm text-slate-500">No columns found.</div>}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!modalMode} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="sm:max-w-[825px] rounded-xl border mt-[35px] border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300 p-0 text-white">
          <ScrollArea className="h-[75vh] max-h-[calc(100vh-2rem)] rounded-xl">
            <DialogHeader className="p-6 pb-3">
              <DialogTitle className="text-xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-white to-blue-200 drop-shadow-md">
                {modalMode === 'add' ? 'Add Record' : modalMode === 'edit' ? 'Edit Record' : 'View Record'}
              </DialogTitle>
            </DialogHeader>
            {renderRecordForm()}
          </ScrollArea>
          {modalMode !== 'view' && (
            <div className="flex justify-end gap-3 p-6 pt-4">
              <Button variant="outlineWater" onClick={closeModal} size="sm">
                Cancel
              </Button>
              <Button onClick={saveRecord} disabled={fields.length === 0} variant="outlineGarden" size="sm">
                Save
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={bulkModalMode === 'edit'} onOpenChange={open => !open && closeBulkModal()}>
        <DialogContent className="bg-white/10 rounded-sm bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 text-white">
          <DialogHeader>
            <DialogTitle>Bulk Edit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Update {selectedIds.length} selected item(s).</p>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Field</label>
              <Select value={bulkEditFieldId} onValueChange={setBulkEditFieldId}>
                <SelectTrigger className="bg-white/10 border-white/10 text-white">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent className="bg-white/10 backdrop-blur-2xl border-white/10 text-white">
                  {fields.map(field => (
                    <SelectItem key={field.id} value={field.id}>
                      {getFieldLabel(field)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="bulk-edit-value" className="text-sm font-medium text-slate-300">
                Value
              </label>
              <Input
                id="bulk-edit-value"
                value={bulkEditValue}
                onChange={e => setBulkEditValue(e.target.value)}
                placeholder="Enter new value"
                className="bg-white/10 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={closeBulkModal} className="text-slate-400 hover:bg-white/5 hover:text-white">
                Cancel
              </Button>
              <Button onClick={confirmBulkEdit} disabled={!bulkEditFieldId} className="bg-blue-600 text-white hover:bg-blue-500">
                Update Selected
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkModalMode === 'delete'} onOpenChange={open => !open && closeBulkModal()}>
        <DialogContent className="bg-white/10 rounded-sm bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 text-white">
          <DialogHeader>
            <DialogTitle>Bulk Delete</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <p className="text-slate-300">
              Are you sure you want to delete <span className="font-semibold text-white">{selectedIds.length}</span> selected item(s)?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={closeBulkModal} className="text-slate-400 hover:bg-white/5 hover:text-white">
                Cancel
              </Button>
              <Button onClick={confirmBulkDelete} className="bg-red-600 text-white hover:bg-red-500">
                Confirm Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkModalMode === 'export'} onOpenChange={open => !open && closeBulkModal()}>
        <DialogContent className="bg-white/10 rounded-sm bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 text-white">
          <DialogHeader>
            <DialogTitle>Bulk Export</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <p className="text-sm text-slate-400">Choose an export format for {selectedIds.length} selected item(s).</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button onClick={() => confirmBulkExport('csv')} variant="outlineGlassy" className="h-16 gap-2">
                <Download className="h-4 w-4" />
                CSV
              </Button>
              <Button onClick={() => confirmBulkExport('xlsx')} variant="outlineGlassy" className="h-16 gap-2">
                <Download className="h-4 w-4" />
                xlsx
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!recordToDelete} onOpenChange={open => !open && setRecordToDelete(null)}>
        <DialogContent className="bg-white/10 rounded-sm bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 text-white">
          <DialogHeader>
            <DialogTitle>Delete Item?</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <p className="text-slate-300">Are you sure you want to delete this item? This action cannot be undone.</p>
            {recordToDelete && (
              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3">
                {fields.slice(0, 2).map((field, idx) => (
                  <div key={field.id} className={`flex items-center justify-between py-1 border-t border-white/10 ${idx === 0 ? 'border-t-0' : ''}`}>
                    <div className="text-xs uppercase text-slate-500">{getFieldLabel(field)}</div>
                    <div className="mt-1 text-sm text-slate-200">{recordToDelete.values[field.id] || '-'}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setRecordToDelete(null)} className="text-slate-400 hover:bg-white/5 hover:text-white">
                Cancel
              </Button>
              <Button onClick={confirmDeleteRecord} className="bg-red-600 text-white hover:bg-red-500">
                Confirm Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-transparent text-white">Loading...</div>}>
      <PreviewPageContent />
    </Suspense>
  );
}
