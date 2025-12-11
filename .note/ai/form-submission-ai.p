Look at those code example 
page.tsx 
```
'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Search, X, FileJson, Check, RefreshCw, AlertTriangle, Layout, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

// Imports from your setup
import { AllFormsKeys } from '@/components/all-form/all-form-index/all-form';
import { useGetPagesQuery } from '@/redux/features/page-builder/pageBuilderSlice';
import {
  useGetFormSubmissionsQuery,
  useAddFormSubmissionMutation,
  useUpdateFormSubmissionMutation,
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
  // 1. Redux Hooks
  const { data: pagesData, isLoading: isPagesLoading } = useGetPagesQuery({ page: 1, limit: 100 });

  const { data: submissionsData, isLoading: isSubmissionsLoading, refetch: refetchSubmissions } = useGetFormSubmissionsQuery({ page: 1, limit: 100 });

  const [addSubmission, { isLoading: isAdding }] = useAddFormSubmissionMutation();
  const [updateSubmission, { isLoading: isUpdating }] = useUpdateFormSubmissionMutation();
  const [deleteSubmission, { isLoading: isDeleting }] = useDeleteFormSubmissionMutation();

  // 2. Local State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [selectedFormKey, setSelectedFormKey] = useState<string>('');
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [jsonBody, setJsonBody] = useState<string>('{\n  "status": "pending",\n  "message": "Enter your data here"\n}');
  const [searchTerm, setSearchTerm] = useState('');

  // 3. Derived Data
  const formLists = AllFormsKeys;
  const pagesList = pagesData?.data?.pages || [];

  // FIX: Moved 'submissions' derivation inside the useMemo below to avoid dependency warning

  // Filter Submissions
  const filteredSubmissions = useMemo(() => {
    // Extract submissions inside the memo to keep the dependency chain stable
    const submissions: ISubmission[] = submissionsData?.data?.submissions || [];

    return submissions.filter(sub => {
      const stringData = JSON.stringify(sub.data).toLowerCase();
      return stringData.includes(searchTerm.toLowerCase());
    });
  }, [submissionsData, searchTerm]);

  // 4. Handlers

  const resetForm = () => {
    setSelectedFormKey('');
    setSelectedPageId('');
    setJsonBody('{\n  \n}');
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (sub: ISubmission) => {
    setEditingId(sub._id);
    // Extract known fields from mixed data
    setSelectedFormKey((sub.data.formKey as string) || '');
    setSelectedPageId((sub.data.pageId as string) || '');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { formKey, pageId, ...rest } = sub.data;
    setJsonBody(JSON.stringify(rest, null, 2));

    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async () => {
    try {
      // Validate JSON
      let parsedJson = {};
      try {
        parsedJson = JSON.parse(jsonBody);
      } catch {
        toast.error('Invalid JSON format in data field');
        return;
      }

      // Construct Payload
      const payloadData = {
        ...parsedJson,
        formKey: selectedFormKey,
        pageId: selectedPageId,
      };

      if (editingId) {
        // UPDATE
        await updateSubmission({
          id: editingId,
          data: payloadData,
        }).unwrap();
        toast.success('Submission updated successfully');
      } else {
        // CREATE
        await addSubmission({
          data: payloadData,
        }).unwrap();
        toast.success('Submission created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save submission');
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteSubmission({ id: deletingId }).unwrap();
      toast.success('Submission deleted successfully');
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete submission');
    }
  };

  // Helper to find page name by ID
  const getPageName = (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const page = pagesList.find((p: any) => p._id === id);
    return page ? `${page.pageName} (${page.path})` : 'Unknown Page';
  };

  // --- Loading View ---
  if (isPagesLoading || isSubmissionsLoading) {
    return (
      <main className="min-h-screen bg-slate-950 pt-[90px] pb-20 px-4 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <p>Loading Form Data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 pt-[90px] pb-20 px-4 md:px-8 text-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Form Submissions</h1>
            <p className="text-slate-400 mt-1 text-sm">Manage and track data entries associated with your forms.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <Input
                placeholder="Search data JSON..."
                className="pl-9 w-64 bg-white/5 border-white/10 focus:border-blue-500/50 text-slate-200"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => refetchSubmissions()} variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-300">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] border-none">
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </div>
        </div>

        {/* List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSubmissions.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 border border-dashed border-white/10 rounded-2xl bg-white/5">
                <FileJson className="h-12 w-12 mb-4 opacity-50" />
                <p>No submissions found.</p>
              </div>
            ) : (
              filteredSubmissions.map(submission => (
                <motion.div
                  key={submission._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] tracking-wider uppercase">
                        {submission.data.formKey ? String(submission.data.formKey).replace('form-', '') : 'No Form Key'}
                      </Badge>
                      <span className="text-[10px] text-slate-500 font-mono">{new Date(submission.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div
                      className="flex items-center gap-2 text-xs text-slate-400 mt-2 truncate"
                      title={submission.data.pageId ? getPageName(submission.data.pageId as string) : 'No Page Linked'}
                    >
                      <Layout className="h-3 w-3 shrink-0" />
                      <span className="truncate">{submission.data.pageId ? getPageName(submission.data.pageId as string) : 'No Page Linked'}</span>
                    </div>
                  </div>

                  {/* Card Body (JSON Preview) */}
                  <div className="p-4 flex-1">
                    <ScrollArea className="h-32 w-full rounded-md bg-black/40 border border-white/5 p-2">
                      <pre className="text-[10px] leading-relaxed font-mono text-emerald-400/80 whitespace-pre-wrap break-all">
                        {JSON.stringify(submission.data, null, 2)}
                      </pre>
                    </ScrollArea>
                  </div>

                  {/* Card Actions */}
                  <div className="p-3 border-t border-white/5 flex justify-end gap-2 bg-slate-950/30">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenEdit(submission)}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteClick(submission._id)}
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- ADD / EDIT DIALOG --- */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                {editingId ? <Edit className="h-5 w-5 text-blue-400" /> : <Plus className="h-5 w-5 text-blue-400" />}
                {editingId ? 'Edit Submission' : 'New Submission'}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)} className="hover:bg-white/10 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* 1. SELECT FORM KEY */}
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

                {/* 2. SELECT PAGE */}
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

              {/* JSON EDITOR */}
              <div className="space-y-2">
                <Label className="text-slate-300 flex items-center gap-2">
                  <FileJson className="h-4 w-4 text-emerald-400" /> Additional Data (JSON)
                </Label>
                <Textarea
                  value={jsonBody}
                  onChange={e => setJsonBody(e.target.value)}
                  className="font-mono text-sm min-h-[200px] bg-slate-950/50 border-white/10 text-emerald-400 focus:border-emerald-500/50 resize-y"
                  placeholder="{ 'field': 'value' }"
                />
                <p className="text-xs text-slate-500">Enter any valid JSON object. This will be merged with the selected Form Key and Page ID.</p>
              </div>
            </ScrollArea>

            <div className="p-6 pt-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-slate-400 hover:text-white hover:bg-white/5">
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isAdding || isUpdating} className="bg-blue-600 hover:bg-blue-500 text-white min-w-[120px]">
                {isAdding || isUpdating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                {editingId ? 'Update' : 'Save'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION --- */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
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
    </main>
  );
};

export default FormSubmissionPage;

```

formSubmissionSlice.ts
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

route.ts 
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

model.ts
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

Now Your task is add those features to page.tsx 
1. Implement pagination. default load 10 items,
2. There is Select Button with 10,20,50,100 items per page.
3. Make data by table, 
    - Each row have first two keys of data. 
4. There is a button for Hide or View keys of data and it will update the table column.
5. If there is no page and form-uid are selected then render all data. 
6. At the top there is a title, after the title please add all datas langth. and selected datas length. 

