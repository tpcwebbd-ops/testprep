
Look at the page.tsx 
```


'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Search,
  X,
  FileJson,
  Check,
  RefreshCw,
  AlertTriangle,
  Layout,
  FileText,
  ChevronLeft,
  ChevronRight,
  Columns,
  Eye,
  Calendar,
  Database,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Imports from your setup
import { AllFormsKeys } from '@/components/all-form/all-form-index/all-form';
import { useGetPagesQuery } from '@/redux/features/page-builder/pageBuilderSlice';
import {
  useGetFormSubmissionsQuery,
  useAddFormSubmissionMutation,
  useDeleteFormSubmissionMutation,
} from '@/redux/features/form-submission/formSubmissionSlice';

// --- Interfaces ---

interface ISubmissionData {
  formKey?: string;
  pageId?: string;
  [key: string]: unknown;
}

interface ISubmission {
  _id: string;
  data: ISubmissionData;
  createdAt: string;
}

// --- Component ---

const FormSubmissionPage = () => {
  // 1. Local State for Pagination & Filtering
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // 2. Redux Hooks
  const { data: pagesData, isLoading: isPagesLoading } = useGetPagesQuery({ page: 1, limit: 100 });

  const {
    data: submissionsResponse,
    isLoading: isSubmissionsLoading,
    refetch: refetchSubmissions,
    isFetching,
  } = useGetFormSubmissionsQuery({
    page,
    limit,
    q: searchTerm,
  });

  const [addSubmission, { isLoading: isAdding }] = useAddFormSubmissionMutation();
  const [deleteSubmission, { isLoading: isDeleting }] = useDeleteFormSubmissionMutation();

  // 3. Derived Data
  const { submissions, totalItems, totalPages } = useMemo(() => {
    const rawSubmissions: ISubmission[] = submissionsResponse?.data?.submissions || [];
    const rawTotal = submissionsResponse?.data?.total || 0;

    return {
      submissions: rawSubmissions,
      totalItems: rawTotal,
      totalPages: Math.ceil(rawTotal / limit),
    };
  }, [submissionsResponse, limit]);

  // 4. Local State for UI
  const [isDialogOpen, setIsDialogOpen] = useState(false); // For "Add" only
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [viewingSubmission, setViewingSubmission] = useState<ISubmission | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State (Add Only)
  const [selectedFormKey, setSelectedFormKey] = useState<string>('');
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [jsonBody, setJsonBody] = useState<string>('{\n  "message": "Enter your data here"\n}');

  // Table State
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  const formLists = AllFormsKeys;
  const pagesList = pagesData?.data?.pages || [];

  // --- Helpers ---

  // Determine unique keys for dynamic columns
  const availableDataKeys = useMemo(() => {
    const keys = new Set<string>();
    submissions.forEach(sub => {
      if (sub && sub.data) {
        Object.keys(sub.data).forEach(key => {
          if (key !== 'formKey' && key !== 'pageId') {
            keys.add(key);
          }
        });
      }
    });
    return Array.from(keys);
  }, [submissions]);

  // Initialize default visible columns
  useEffect(() => {
    if (availableDataKeys.length > 0 && visibleColumns.length === 0) {
      setVisibleColumns(availableDataKeys.slice(0, 2));
    }
  }, [availableDataKeys, visibleColumns.length]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = submissions.map(s => s._id);
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const resetForm = () => {
    setSelectedFormKey('');
    setSelectedPageId('');
    setJsonBody('{\n  \n}');
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // --- View Logic ---
  const handleViewClick = (sub: ISubmission) => {
    setViewingSubmission(sub);
    setIsViewOpen(true);
  };

  // --- Delete Logic ---
  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteSubmission({ id: deletingId }).unwrap();
      toast.success('Submission deleted successfully');
      setIsDeleteOpen(false);
      setDeletingId(null);
      refetchSubmissions();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete submission');
    }
  };

  // --- Submit Logic (Add Only) ---
  const handleSubmit = async () => {
    try {
      let parsedJson = {};
      try {
        parsedJson = JSON.parse(jsonBody);
      } catch {
        toast.error('Invalid JSON format in data field');
        return;
      }

      const payloadData = {
        ...parsedJson,
        formKey: selectedFormKey,
        pageId: selectedPageId,
      };

      await addSubmission({ data: payloadData }).unwrap();
      toast.success('Submission created successfully');

      setIsDialogOpen(false);
      refetchSubmissions();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save submission');
    }
  };

  const getPageName = (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const page = pagesList.find((p: any) => p._id === id);
    return page ? page.pageName : 'Unknown';
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
  };

  // Utility to format keys (e.g., "firstName" -> "First Name")
  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .trim();
  };

  // --- Loading View ---
  if (isPagesLoading) {
    return (
      <main className="min-h-screen bg-slate-950 pt-[90px] pb-20 px-4 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <p>Loading System Data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 pt-[90px] pb-20 px-4 md:px-8 text-slate-200">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Form Submissions</h1>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-white/10">
                  Total: {totalItems}
                </Badge>
                {selectedRows.size > 0 && (
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Selected: {selectedRows.size}
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-slate-400 text-sm">Manage and track data entries associated with your forms.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <Input
                placeholder="Search ID..."
                className="pl-9 w-64 bg-white/5 border-white/10 focus:border-blue-500/50 text-slate-200"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-300">
                  <Columns className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-900 border-white/10 text-slate-200 max-h-80 overflow-y-auto">
                <DropdownMenuLabel>Toggle Data Keys</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                {availableDataKeys.length === 0 && <div className="p-2 text-xs text-slate-500">No dynamic keys found</div>}
                {availableDataKeys.map(key => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={visibleColumns.includes(key)}
                    onCheckedChange={() => toggleColumn(key)}
                    className="focus:bg-blue-600/20 focus:text-white"
                  >
                    {key}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={() => refetchSubmissions()} variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-300">
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
            <Button disabled onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] border-none">
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </div>
        </div>

        {/* --- Table Section --- */}
        <div className="border border-white/10 rounded-xl bg-slate-900/40 overflow-hidden backdrop-blur-sm">
          {isSubmissionsLoading ? (
            <div className="h-64 flex items-center justify-center text-slate-400">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mb-2" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <FileJson className="h-12 w-12 mb-4 opacity-50" />
              <p>No submissions found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-slate-300 uppercase font-medium text-xs">
                  <tr>
                    <th className="p-4 w-10">
                      <Checkbox
                        checked={selectedRows.size === submissions.length && submissions.length > 0}
                        onCheckedChange={handleSelectAll}
                        className="border-white/20 data-[state=checked]:bg-blue-600"
                      />
                    </th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Form Key</th>
                    <th className="p-4">Page</th>
                    {visibleColumns.map(key => (
                      <th key={key} className="p-4 text-emerald-400/90 font-mono">
                        {key}
                      </th>
                    ))}
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {submissions.map(sub => {
                    const subData = sub.data || {};
                    return (
                      <tr key={sub._id} className={`hover:bg-white/[0.02] transition-colors ${selectedRows.has(sub._id) ? 'bg-blue-500/5' : ''}`}>
                        <td className="p-4">
                          <Checkbox
                            checked={selectedRows.has(sub._id)}
                            onCheckedChange={c => handleSelectRow(sub._id, !!c)}
                            className="border-white/20 data-[state=checked]:bg-blue-600"
                          />
                        </td>
                        <td className="p-4 text-slate-400 whitespace-nowrap">
                          {new Date(sub.createdAt).toLocaleDateString()}{' '}
                          <span className="text-[10px] opacity-50">{new Date(sub.createdAt).toLocaleTimeString()}</span>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] tracking-wider font-normal">
                            {subData.formKey ? String(subData.formKey) : 'N/A'}
                          </Badge>
                        </td>
                        <td className="p-4 text-slate-300 max-w-[150px] truncate" title={subData.pageId ? getPageName(subData.pageId as string) : ''}>
                          {subData.pageId ? (
                            <span className="flex items-center gap-1.5">
                              <Layout className="h-3 w-3 text-purple-400" />
                              {getPageName(subData.pageId as string)}
                            </span>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>

                        {visibleColumns.map(key => (
                          <td key={key} className="p-4 font-mono text-xs text-slate-300 max-w-[200px] truncate">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {typeof (subData as any)[key] === 'object' ? JSON.stringify((subData as any)[key]) : String((subData as any)[key] ?? '-')}
                          </td>
                        ))}

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* View Button */}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewClick(sub)}
                              className="h-8 w-8 p-0 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteClick(sub._id)}
                              className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* --- Footer: Pagination --- */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <Select
              value={String(limit)}
              onValueChange={val => {
                setLimit(Number(val));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px] bg-slate-900 border-white/10 text-white">
                <SelectValue placeholder={limit} />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white">
                {[10, 20, 50, 100].map(size => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <span>
              Page {page} of {totalPages || 1}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="border-white/10 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 min-w-1 text-white"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-white/10 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 min-w-1 text-white"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isFetching}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- ADD DIALOG --- */}
      <AnimatePresence>
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-400" /> New Submission
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)} className="hover:bg-white/10 text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Select Form Key */}
                  <div className="space-y-2">
                    <Label className="text-slate-300 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-400" /> Form Key
                    </Label>
                    <Select value={selectedFormKey} onValueChange={setSelectedFormKey}>
                      <SelectTrigger className="bg-slate-950 border-white/10 text-white focus:ring-blue-500/50">
                        <SelectValue placeholder="Select a Form Key" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white max-h-60">
                        {formLists.map(key => (
                          <SelectItem key={key} value={key} className="focus:bg-blue-600/20 focus:text-white">
                            {key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Select Page */}
                  <div className="space-y-2">
                    <Label className="text-slate-300 flex items-center gap-2">
                      <Layout className="h-4 w-4 text-purple-400" /> Associated Page
                    </Label>
                    <Select value={selectedPageId} onValueChange={setSelectedPageId}>
                      <SelectTrigger className="bg-slate-950 border-white/10 text-white focus:ring-purple-500/50">
                        <SelectValue placeholder="Select a Page" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white max-h-60">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {pagesList.map((page: any) => (
                          <SelectItem key={page._id} value={page._id} className="focus:bg-purple-600/20 focus:text-white">
                            <span className="font-semibold">{page.pageName || page.pageTitle}</span>
                            <span className="ml-2 text-xs text-slate-400 font-mono">({page.path || page.pagePath})</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <FileJson className="h-4 w-4 text-emerald-400" /> Data Object (JSON)
                  </Label>
                  <Textarea
                    value={jsonBody}
                    onChange={e => setJsonBody(e.target.value)}
                    className="font-mono text-sm min-h-[200px] bg-slate-950/50 border-white/10 text-emerald-400 focus:border-emerald-500/50 resize-y"
                    placeholder="{ 'field': 'value' }"
                  />
                </div>
              </ScrollArea>

              <div className="p-6 pt-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-slate-400 hover:text-white hover:bg-white/5">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isAdding} className="bg-blue-600 hover:bg-blue-500 text-white min-w-[120px]">
                  {isAdding ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                  Save
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- VIEW DIALOG (KEY/VALUE TABLE) --- */}
      <AnimatePresence>
        {isViewOpen && viewingSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] mt-[60px]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Database className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Submission Details</h2>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span className="font-mono text-slate-500">ID: {viewingSubmission._id}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(viewingSubmission.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsViewOpen(false)}
                  className="hover:bg-white/10 text-slate-400 hover:text-white rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Modal Body - Table */}
              <ScrollArea className="flex-1 p-0">
                <div className="w-full">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 sticky top-0 z-10 backdrop-blur-md">
                      <tr>
                        <th className="py-3 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/10 w-1/3">Field Name</th>
                        <th className="py-3 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/10 w-2/3">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {Object.entries(viewingSubmission.data || {}).map(([key, value]) => (
                        <tr key={key} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-6 align-top">
                            <span className="font-medium text-emerald-400/90 text-sm block mb-1">{formatKey(key)}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{key}</span>
                          </td>
                          <td className="py-4 px-6 align-top text-slate-300 text-sm break-words leading-relaxed">
                            {typeof value === 'object' && value !== null ? (
                              <pre className="bg-black/30 p-3 rounded-lg border border-white/5 text-xs text-blue-300 overflow-x-auto font-mono">
                                {JSON.stringify(value, null, 2)}
                              </pre>
                            ) : (
                              String(value ?? 'N/A')
                            )}
                          </td>
                        </tr>
                      ))}
                      {Object.keys(viewingSubmission.data || {}).length === 0 && (
                        <tr>
                          <td colSpan={2} className="p-8 text-center text-slate-500 italic">
                            No data fields available in this submission.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/10 bg-slate-950/50 flex justify-end">
                <Button onClick={() => setIsViewOpen(false)} className="bg-white/10 hover:bg-white/20 text-white border-none">
                  Close Details
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DELETE CONFIRMATION --- */}
      <AnimatePresence>
        {isDeleteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center gap-4 text-red-400 mb-4">
                <div className="p-3 bg-red-500/10 rounded-full">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white">Delete Entry?</h3>
              </div>

              <p className="text-slate-400 mb-6">Are you sure you want to delete this submission? This action cannot be undone.</p>

              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} className="text-slate-400 hover:text-white">
                  Cancel
                </Button>
                <Button onClick={confirmDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-500 text-white border-none">
                  {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default FormSubmissionPage;

```

and here is formSubmissionSlice.ts 
```
import { apiSlice } from '@/redux/api/apiSlice';

export const formSubmissionApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getFormSubmissions: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/form-submission/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeFormSubmission', id: 'LIST' }],
    }),
    getFormSubmissionById: builder.query({
      query: id => `/api/form-submission/v1?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'tagTypeFormSubmission', id }],
    }),
    addFormSubmission: builder.mutation({
      query: newSubmission => ({
        url: '/api/form-submission/v1',
        method: 'POST',
        body: newSubmission,
      }),
      invalidatesTags: [{ type: 'tagTypeFormSubmission', id: 'LIST' }],
    }),
    updateFormSubmission: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/form-submission/v1`,
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeFormSubmission', id },
        { type: 'tagTypeFormSubmission', id: 'LIST' },
      ],
    }),
    deleteFormSubmission: builder.mutation({
      query: ({ id }) => ({
        url: `/api/form-submission/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeFormSubmission', id },
        { type: 'tagTypeFormSubmission', id: 'LIST' },
      ],
    }),
    // Kept for consistency if you plan to implement bulk logic later in controller
    bulkDeleteFormSubmissions: builder.mutation({
      query: bulkData => ({
        url: `/api/form-submission/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeFormSubmission', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetFormSubmissionsQuery,
  useGetFormSubmissionByIdQuery,
  useAddFormSubmissionMutation,
  useUpdateFormSubmissionMutation,
  useDeleteFormSubmissionMutation,
  useBulkDeleteFormSubmissionsMutation,
} = formSubmissionApi;
```

and here is route.ts 
```
import { getFormSubmissions, createFormSubmission, updateFormSubmission, deleteFormSubmission, getFormSubmissionById } from './controller';

import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getFormSubmissionById(req) : await getFormSubmissions(req);

  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const result = await createFormSubmission(req);

  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const result = await updateFormSubmission(req);

  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const result = await deleteFormSubmission(req);

  return formatResponse(result.data, result.message, result.status);
}

```

controller.ts
```
import { withDB } from '@/app/api/utils/db';
import FormSubmission from './model';
import { formatResponse, IResponse } from '@/app/api/utils/utils';
import { FilterQuery } from 'mongoose';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

function isMongoError(error: unknown): error is MongoError {
  return error !== null && typeof error === 'object' && 'code' in error && typeof (error as MongoError).code === 'number';
}

export async function createFormSubmission(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const submissionData = await req.json();
      const newSubmission = await FormSubmission.create(submissionData);

      return formatResponse(newSubmission, 'Form submission created successfully', 201);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function getFormSubmissionById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'ID is required', 400);

    const submission = await FormSubmission.findById(id);
    if (!submission) return formatResponse(null, 'Not found', 404);

    return formatResponse(submission, 'Fetched successfully', 200);
  });
}

export async function getFormSubmissions(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10'); // Default to 10 for submissions
    const skip = (page - 1) * limit;

    const searchQuery = url.searchParams.get('q');
    let filter: FilterQuery<unknown> = {};

    if (searchQuery) {
      // Since 'data' is Mixed, searching is specific.
      // We generally search if the ID matches or try to find text if indexes existed.
      // For now, valid ObjectId search or fallback to empty.
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(searchQuery);
      if (isValidObjectId) {
        filter = { _id: searchQuery };
      }
    }

    const submissions = await FormSubmission.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

    const total = await FormSubmission.countDocuments(filter);

    return formatResponse({ submissions, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function updateFormSubmission(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      if (!id) return formatResponse(null, 'ID is required', 400);

      const updated = await FormSubmission.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: false,
      });

      if (!updated) return formatResponse(null, 'Not found', 404);

      return formatResponse(updated, 'Updated successfully', 200);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function deleteFormSubmission(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    if (!id) return formatResponse(null, 'ID required', 400);

    const deleted = await FormSubmission.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Not found', 404);

    return formatResponse({ deletedCount: 1 }, 'Deleted successfully', 200);
  });
}
```

and here is model.ts 
```
import mongoose, { Schema } from 'mongoose';

const formSubmissionSchema = new Schema(
  {
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Add index for sorting by timestamp
formSubmissionSchema.index({ createdAt: -1 });

export default mongoose.models.FormSubmission || mongoose.model('FormSubmission', formSubmissionSchema);
```


Now Your task is implement those features. 
1. here is url example "/dashboard/page-builder/form-data?pathTitle=/food-a"
2. get pathTitle by useParams. 
3. if Not found then render a div with No pathTitle. 
4. if found pathTitle then query with pathTitle. and only view those which have match pathTitle. 

here is example of submissionsResponse =

```{
    "data": {
        "submissions": [
            {
                "_id": "69392e090e9270829bf9eb14",
                "data": {
                    "firstName": "Toufiquer ",
                    "lastName": "2201",
                    "email": "2201@gmail.com",
                    "phoneNumber": "220122012201",
                    "dateOfBirth": "2025-12-18",
                    "gender": "Male",
                    "passportNumber": "22012201",
                    "currentPath": "/food-a",
                    "formUid": "form-personal-uid-1",
                    "formTitle": "Student Personal Information",
                    "submitButtonText": "Save & Next"
                },
                "createdAt": "2025-12-10T08:23:37.058Z",
                "updatedAt": "2025-12-10T08:23:37.058Z",
                "__v": 0
            }
        ],
        "total": 1,
        "page": 1,
        "limit": 10
    },
    "message": "Fetched successfully",
    "status": 200
}```

