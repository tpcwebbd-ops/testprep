Look at those code carefully.
1. Api  
   - /src/api/page-builder/v1/controller.ts
   ```
import { withDB } from '@/app/api/utils/db';
import PageBuilder from './model';
import { formatResponse, IResponse } from '@/app/api/utils/utils';
import { FilterQuery } from 'mongoose';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

function isMongoError(error: unknown): error is MongoError {
  return error !== null && typeof error === 'object' && 'code' in error && typeof (error as MongoError).code === 'number';
}

export async function createPage(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const pageData = await req.json();
      const newPage = await PageBuilder.create(pageData);

      return formatResponse(newPage, 'Page created successfully', 201);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function getPageById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'ID is required', 400);

    const page = await PageBuilder.findById(id);
    if (!page) return formatResponse(null, 'Not found', 404);

    return formatResponse(page, 'Fetched successfully', 200);
  });
}

export async function getPages(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '1000');
    const skip = (page - 1) * limit;

    const searchQuery = url.searchParams.get('q');
    let filter: FilterQuery<unknown> = {};

    if (searchQuery) {
      filter = {
        $or: [
          { pageName: { $regex: searchQuery, $options: 'i' } },
          { path: { $regex: searchQuery, $options: 'i' } },
          { 'content.key': { $regex: searchQuery, $options: 'i' } },
          { 'content.heading': { $regex: searchQuery, $options: 'i' } },
          { 'content.type': { $regex: searchQuery, $options: 'i' } },
        ],
      };
    }

    const pages = await PageBuilder.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);

    const total = await PageBuilder.countDocuments(filter);

    return formatResponse({ pages, total, page, limit }, 'Fetched successfully', 200);
  });
}
// get All pages for SSG in /src/app/[...pageTitle]/page.tsx
export async function getAllPages(): Promise<IResponse> {
  return withDB(async () => {
    const page = parseInt('1');
    const limit = parseInt('1000');
    const skip = (page - 1) * limit;
    const filter: FilterQuery<unknown> = {};
    const pages = await PageBuilder.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);

    const total = await PageBuilder.countDocuments(filter);

    return formatResponse({ pages, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function updatePage(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      if (!id) return formatResponse(null, 'ID is required', 400);

      const updated = await PageBuilder.findByIdAndUpdate(id, updateData, {
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

export async function deletePage(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    if (!id) return formatResponse(null, 'ID required', 400);

    const deleted = await PageBuilder.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Not found', 404);

    return formatResponse({ deletedCount: 1 }, 'Deleted successfully', 200);
  });
}

   ```

   - /src/api/page-builder/v1/model.ts
   ```
import mongoose, { Schema } from 'mongoose';

// Schema for individual content items (sections, forms, tags, etc.)
const pageContentSchema = new Schema(
  {
    id: { type: String, required: true },
    key: { type: String, required: true },
    type: { 
      type: String, 
      required: true,
      enum: ['section', 'form', 'button', 'title', 'description', 'paragraph', 'sliders', 'tagSliders', 'logoSliders', 'gellery']
    },
    heading: { type: String, required: true },
    path: { type: String, required: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false, timestamps: false }
);

// Main page builder schema
const pageBuilderSchema = new Schema(
  {
    pageName: { type: String, required: true },
    path: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    content: { type: [pageContentSchema], default: [] },
  },
  { _id: true, timestamps: true }
);

// Add indexes for better query performance
pageBuilderSchema.index({ path: 1 });
pageBuilderSchema.index({ isActive: 1 });
pageBuilderSchema.index({ 'content.type': 1 });

export default mongoose.models.PageBuilder || mongoose.model('PageBuilder', pageBuilderSchema);

   ```
   
   - /src/api/page-builder/v1/route.ts
   ```
import { revalidatePath } from 'next/cache';
import { getPages, createPage, updatePage, deletePage, getPageById } from './controller';

import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getPageById(req) : await getPages(req);

  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const result = await createPage(req);

  if (result.status === 200 || result.status === 201) {
    revalidatePath('/page-builder');
  }

  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const result = await updatePage(req);

  if (result.status === 200) {
    revalidatePath('/page-builder');
  }

  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const result = await deletePage(req);

  if (result.status === 200) {
    revalidatePath('/page-builder');
  }

  return formatResponse(result.data, result.message, result.status);
}

   ```
   

2. Redux/Slice
    - src/redux/features/page-builder/pageBuilderSlice.ts 
   ```
import { apiSlice } from '@/redux/api/apiSlice';

export const pageBuilderApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPages: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/page-builder/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypePageBuilder', id: 'LIST' }],
    }),
    getPageById: builder.query({
      query: id => `/api/page-builder/v1?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'tagTypePageBuilder', id }],
    }),
    addPage: builder.mutation({
      query: newPage => ({
        url: '/api/page-builder/v1',
        method: 'POST',
        body: newPage,
      }),
      invalidatesTags: [{ type: 'tagTypePageBuilder', id: 'LIST' }],
    }),
    updatePage: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/page-builder/v1`,
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypePageBuilder', id },
        { type: 'tagTypePageBuilder', id: 'LIST' },
      ],
    }),
    deletePage: builder.mutation({
      query: ({ id }) => ({
        url: `/api/page-builder/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypePageBuilder', id },
        { type: 'tagTypePageBuilder', id: 'LIST' },
      ],
    }),
    bulkUpdatePages: builder.mutation({
      query: bulkData => ({
        url: `/api/page-builder/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypePageBuilder', id: 'LIST' }],
    }),
    bulkDeletePages: builder.mutation({
      query: bulkData => ({
        url: `/api/page-builder/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypePageBuilder', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetPagesQuery,
  useGetPageByIdQuery,
  useAddPageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
  useBulkUpdatePagesMutation,
  useBulkDeletePagesMutation,
} = pageBuilderApi;

   ```
   

3. Page-builder 
    - /src/dashboard/page-builder/utils.ts
   ```
export type ItemType = 'section' | 'form' | 'button' | 'title' | 'description' | 'paragraph' | 'sliders' | 'tagSliders' | 'logoSliders' | 'gellery';

export interface PageContent {
  id: string;
  key: string;
  name: string;
  type: ItemType;
  heading: string;
  path: string;
  data: unknown;
}

export const defaultPageContent: PageContent = {
  id: '1',
  key: 'heading',
  name: 'Name',
  type: 'title',
  heading: 'Heading',
  path: '/heading',
  data: '',
};

export interface IPage {
  _id?: string;
  id?: string;
  pageName: string;
  path: string;
  isActive: boolean;
  content: PageContent[];
  createdAt?: string;
  updatedAt?: string;
}

export const INITIAL_DATA: IPage[] = [
  { id: '1', pageName: 'Home Page', path: '/', isActive: true, content: [] },
  { id: '2', pageName: 'About Us', path: '/about/us', isActive: true, content: [] },
  { id: '3', pageName: 'Our Services', path: '/about/services', isActive: false, content: [] },
  { id: '4', pageName: 'Contact Support', path: '/contact/support', isActive: true, content: [] },
  { id: '5', pageName: 'Office Locations', path: '/contact/locations', isActive: true, content: [] },
  { id: '6', pageName: 'Blog List', path: '/blog', isActive: true, content: [] },
];

   ```
   
    - /src/dashboard/page-builder/page.tsx
   ```
'use client';

import { useEffect, useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Eye, ExternalLink, FolderOpen, Layout, X, AlertTriangle, RefreshCw, Database } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Assuming IPage is in your utils, but I will define a local interface to ensure TS works with the fix
import { useGetPagesQuery, useAddPageMutation, useUpdatePageMutation, useDeletePageMutation } from '@/redux/features/page-builder/pageBuilderSlice';
import { toast } from 'sonner';

// Normalized Interface to handle inconsistent API data
interface IPage {
  _id: string;
  pageName: string; // Normalized name
  path: string; // Normalized path
  isActive: boolean;
  // Original data preservation if needed
  [key: string]: unknown;
}

const Page = () => {
  // Redux hooks
  // Added 'refetch' to manually reload data if needed
  const { data: pagesData, isLoading, error, refetch } = useGetPagesQuery({ page: 1, limit: 100 });

  const [addPage, { isLoading: isAdding }] = useAddPageMutation();
  const [updatePage] = useUpdatePageMutation();
  const [deletePage] = useDeletePageMutation();

  // Local state
  const [pages, setPages] = useState<IPage[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<IPage | null>(null);
  const [formData, setFormData] = useState({ pageName: '', path: '' });

  // Sync Redux data to local state with Normalization and Flattening
  useEffect(() => {
    // FIX: Access .data.pages instead of just .pages
    const rawPages = pagesData?.data?.pages || [];

    if (rawPages.length > 0) {
      const normalizedList: IPage[] = [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const extractPages = (list: any[]) => {
        list.forEach(item => {
          // 1. Normalize the data (Handle pageTitle vs pageName, path vs pagePath)
          const normalizedPage: IPage = {
            ...item,
            _id: item._id,
            isActive: item.isActive ?? true,
            pageName: item.pageName || item.pageTitle || 'Untitled Page',
            path: item.path || item.pagePath || '#',
          };

          normalizedList.push(normalizedPage);

          // 2. Check for sub-pages and recurse
          if (item.subPage && Array.isArray(item.subPage) && item.subPage.length > 0) {
            extractPages(item.subPage);
          }
        });
      };

      extractPages(rawPages);
      setPages(normalizedList);
    }
  }, [pagesData]);

  // Group pages by path segments using useMemo for performance
  const groupedPages = useMemo(() => {
    return pages.reduce((groups: Record<string, IPage[]>, page) => {
      if (!page.path) return groups;

      const parts = page.path.split('/').filter(Boolean);
      // If path is "/" it goes to Root, otherwise grab the first segment
      const groupKey = parts.length > 0 ? `/${parts[0]}` : 'Root Pages';

      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(page);
      return groups;
    }, {});
  }, [pages]);

  // Handlers
  const handleSavePage = async () => {
    if (!formData.pageName || !formData.path) {
      toast.error('Please fill in all fields');
      return;
    }

    const formattedPath = formData.path.startsWith('/') ? formData.path : `/${formData.path}`;

    try {
      await addPage({
        pageName: formData.pageName,
        path: formattedPath,
        isActive: true,
        content: [],
      }).unwrap();

      toast.success('Page created successfully');
      setFormData({ pageName: '', path: '' });
      setIsAddDialogOpen(false);
      // Optional: refetch is automatic with tags, but good for safety
    } catch (err) {
      toast.error('Failed to create page');
      console.error('Error creating page:', err);
    }
  };

  const handleEdit = (path: string) => {
    window.open(`/dashboard/page-builder/edit-page?pathTitle=${path}`, '_blank');
  };

  const initiateDelete = (page: IPage) => {
    setPageToDelete(page);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pageToDelete?._id) return;

    try {
      await deletePage({ id: pageToDelete._id }).unwrap();
      toast.success('Page deleted successfully');
      setIsDeleteDialogOpen(false);
      setPageToDelete(null);
    } catch (err) {
      toast.error('Failed to delete page');
      console.error('Error deleting page:', err);
    }
  };

  const handlePreview = (path: string) => {
    window.open(`/dashboard/page-builder/preview-page?pathTitle=${path}`, '_blank');
  };

  const handleLiveLink = (path: string) => {
    window.open(path, '_blank');
  };
  const handleFormDataPage = (path: string) => {
    window.open(`/dashboard/page-builder/form-data?pathTitle=${path}`, '_blank');
  };

  const handleToggleActive = async (page: IPage) => {
    if (!page._id) return;

    try {
      // Optimistic update locally
      const updatedStatus = !page.isActive;
      setPages(prev => prev.map(p => (p._id === page._id ? { ...p, isActive: updatedStatus } : p)));

      await updatePage({
        id: page._id,
        isActive: updatedStatus,
      }).unwrap();

      toast.success(`Page ${updatedStatus ? 'activated' : 'deactivated'}`);
    } catch (err) {
      // Revert on failure
      setPages(prev => prev.map(p => (p._id === page._id ? { ...p, isActive: !page.isActive } : p)));
      toast.error('Failed to update page status');
      console.error('Error updating page:', err);
    }
  };

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 pt-[90px] pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-2xl">
                <Layout className="h-10 w-10 text-white animate-spin duration-3000" />
              </div>
            </div>
            <div className="text-white text-xl font-semibold">Loading pages...</div>
            <div className="text-slate-400 text-sm">Please wait while we fetch your structure</div>
          </div>
        </div>
      </main>
    );
  }

  // --- ERROR STATE ---
  if (error) {
    const errorMessage =
      'status' in error ? `Error ${error.status}: ${JSON.stringify(error.data)}` : 'message' in error ? error.message : 'An unexpected error occurred';

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 pt-[90px] pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500 max-w-md">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/30 blur-3xl rounded-full" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-2xl">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Failed to Load Pages</h2>
              <p className="text-slate-400 text-sm">We encountered an error while fetching your pages.</p>
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-left w-full overflow-hidden">
                <p className="text-red-400 text-xs font-mono break-all">{errorMessage}</p>
              </div>
            </div>
            <Button onClick={() => refetch()} variant="outlineGlassy" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry Connection
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 pt-[90px] pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Page Management</h1>
            <p className="text-slate-400 mt-1 text-sm">Manage your application routes, structure, and visibility.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => refetch()} variant="outlineGlassy" size="icon" title="Refresh Data">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} variant="outlineGlassy" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Page
            </Button>
          </div>
        </div>

        {/* No Data Found State */}
        {pages.length === 0 ? (
          <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center justify-center min-h-[50vh] border-2 border-dashed border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm p-12">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-purple-500/30 blur-3xl rounded-full animate-pulse" />
              <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                <FolderOpen className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 text-center">No Pages Yet</h2>
            <p className="text-slate-400 text-center max-w-md mb-8 text-lg">Get started by creating your first page.</p>
            <Button onClick={() => setIsAddDialogOpen(true)} variant="outlineGlassy" size="lg">
              <Plus className="h-5 w-5" />
              Create Your First Page
            </Button>
          </div>
        ) : (
          /* Grouped Pages Display */
          <div className="space-y-10">
            {Object.entries(groupedPages).map(([groupName, groupPages]) => (
              <div key={groupName} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-4 text-slate-300">
                  <FolderOpen className="h-5 w-5 text-blue-400" />
                  <h2 className="text-lg font-semibold capitalize tracking-wide">{groupName === 'Root Pages' ? 'Main Pages' : groupName.replace('/', '')}</h2>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-400">{groupPages.length}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupPages.map(page => (
                    <div
                      key={page._id}
                      className={`
                        relative group overflow-hidden rounded-xl border backdrop-blur-md transition-all duration-300
                        ${
                          page.isActive
                            ? 'bg-slate-900/60 border-white/10 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10'
                            : 'bg-slate-900/30 border-white/5 opacity-70 grayscale-[0.5] hover:opacity-100 hover:grayscale-0'
                        }
                      `}
                    >
                      <div className="p-5 space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 max-w-[70%]">
                              <div className={`p-1.5 rounded-md shrink-0 ${page.isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700/20 text-slate-500'}`}>
                                <Layout className="h-4 w-4" />
                              </div>
                              <h3 className="font-bold text-slate-100 truncate" title={page.pageName}>
                                {page.pageName}
                              </h3>
                            </div>
                            <Switch
                              checked={page.isActive}
                              onCheckedChange={() => handleToggleActive(page)}
                              className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-white/50"
                            />
                          </div>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        <div className="w-full flex flex-col gap-2 items-start justify-between">
                          <p
                            className="text-xs font-mono text-slate-400 bg-black/20 inline-block px-2 py-1 rounded border border-white/5 max-w-[120px] truncate"
                            title={page.path}
                          >
                            {page.path}
                          </p>

                          <div className="flex items-center justify-between gap-1">
                            <div className="flex gap-1">
                              <Button size="sm" variant="outlineGlassy" className="min-w-1" onClick={() => handleEdit(page.path)} title="Edit Page">
                                <Edit className="h-4 w-4" />
                              </Button>

                              <Button size="sm" variant="outlineGlassy" className="min-w-1" onClick={() => handlePreview(page.path)} title="Preview Page">
                                <Eye className="h-4 w-4" />
                              </Button>

                              <Button size="sm" variant="outlineGlassy" className="min-w-1" onClick={() => handleLiveLink(page.path)} title="Visit Live Page">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outlineGlassy"
                                className="min-w-1"
                                onClick={() => handleFormDataPage(page.path)}
                                title="Visit Live Page"
                              >
                                <Database className="h-4 w-4" />
                              </Button>

                              <Button
                                size="sm"
                                variant="outlineFire"
                                className="min-w-1 text-red-400 hover:text-red-200"
                                onClick={() => initiateDelete(page)}
                                title="Delete Page"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Page Modal */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-semibold text-white">Create New Page</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsAddDialogOpen(false)} className="hover:bg-white/10 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">
                  Page Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. About Us"
                  className="bg-slate-950 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500"
                  value={formData.pageName}
                  onChange={e => setFormData({ ...formData, pageName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="path" className="text-slate-300">
                  Page Path
                </Label>
                <Input
                  id="path"
                  placeholder="e.g. /about/us"
                  className="bg-slate-950 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500 font-mono text-sm"
                  value={formData.path}
                  onChange={e => setFormData({ ...formData, path: e.target.value })}
                />
              </div>
            </div>
            <div className="p-6 pt-2 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="text-slate-400 hover:text-white hover:bg-white/5">
                Cancel
              </Button>
              <Button onClick={handleSavePage} disabled={!formData.pageName || !formData.path || isAdding} className="bg-blue-600 hover:bg-blue-500 text-white">
                {isAdding ? 'Creating...' : 'Create Page'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {isDeleteDialogOpen && pageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-red-500/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-red-500/5">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Delete Page?</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDeleteDialogOpen(false)} className="hover:bg-white/10 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6">
              <p className="text-slate-300">
                Are you sure you want to delete <span className="font-bold text-white">{pageToDelete.pageName}</span>?
              </p>
              <p className="text-sm text-slate-500 mt-2">
                This action cannot be undone. The path <span className="font-mono text-slate-400">{pageToDelete.path}</span> will no longer be accessible.
              </p>
            </div>

            <div className="p-6 pt-2 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="text-slate-400 hover:text-white hover:bg-white/5">
                Cancel
              </Button>
              <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-500 text-white border-none">
                Delete Page
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Page;

   ```
   
    - /src/dashboard/page-builder/edit-page/page.tsx
   ```
'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Edit,
  GripVertical,
  Plus,
  Save,
  Trash2,
  AlertTriangle,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Type,
  Layers,
  ChevronDown,
  LayoutGrid,
  FolderOpen,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { AllSections, AllSectionsKeys, allSectionCagegory } from '@/components/all-section/all-section-index/all-sections';
import { AllForms, AllFormsKeys } from '@/components/all-form/all-form-index/all-form';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ItemType, PageContent } from '../utils';
import { useGetPagesQuery, useUpdatePageMutation } from '@/redux/features/page-builder/pageBuilderSlice';
import { toast } from 'react-toastify';

interface SectionConfig {
  category: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

const TypedAllSections = AllSections as unknown as Record<string, SectionConfig>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENT_MAP: Record<string, { collection: any; keys: string[]; label: string; icon: any; color: string }> = {
  form: { collection: AllForms, keys: AllFormsKeys, label: 'Forms', icon: Type, color: 'text-blue-400 from-cyan-500 to-blue-500' },
  section: { collection: AllSections, keys: AllSectionsKeys, label: 'Sections', icon: Layers, color: 'text-purple-400 from-purple-500 to-pink-500' },
};

const getTypeStyles = (type: ItemType) => {
  switch (type) {
    case 'form':
      return {
        border: 'border-blue-500/30 hover:border-blue-400/60',
        bg: 'bg-slate-900/60',
        badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
        icon: 'text-blue-400',
        glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]',
      };
    default:
      return {
        border: 'border-purple-500/30 hover:border-purple-400/60',
        bg: 'bg-slate-900/40',
        badge: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
        icon: 'text-purple-400',
        glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)]',
      };
  }
};

interface SortableItemProps {
  item: PageContent;
  onEdit: (item: PageContent) => void;
  onPreview: (item: PageContent) => void;
  onDelete: (item: PageContent) => void;
  onInlineUpdate: (item: PageContent, newData: unknown) => void;
  onOpenMoveDialog: (item: PageContent) => void;
}

const SortableItem = ({ item, onEdit, onPreview, onDelete, onInlineUpdate, onOpenMoveDialog }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const mapEntry = COMPONENT_MAP[item.type];
  const config = mapEntry ? mapEntry.collection[item.key] : null;

  if (!mapEntry || !config) {
    return (
      <div ref={setNodeRef} style={style} className="p-4 border border-red-500/30 bg-red-500/10 rounded-xl flex items-center justify-between">
        <div className="text-red-400 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Unknown Component Type: {item.type || 'Undefined'}</span>
        </div>
        <Button onClick={() => onDelete(item)} size="sm" variant="outlineFire" className="h-8 w-8 p-0">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  let ComponentToRender;
  if (item.type === 'form') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ComponentToRender = (config as any).FormField;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ComponentToRender = (config as any).query;
  }

  const styles = getTypeStyles(item.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group animate-in fade-in-50 slide-in-from-bottom-6 duration-700 ${isDragging ? 'opacity-40 scale-95 z-50' : 'z-0'}`}
    >
      <div
        className={`relative backdrop-blur-3xl shadow-xl transition-all duration-300 overflow-hidden rounded-xl border ${styles.border} ${styles.bg} ${styles.glow}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-4 z-20 border-b border-white/5 bg-black/20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <button onClick={() => onOpenMoveDialog(item)} className="md:hidden p-2 rounded-full hover:bg-white/10 text-yellow-400 transition-all">
                <ArrowUpDown className="h-4 w-4" />
              </button>
              <button
                {...attributes}
                {...listeners}
                className={`cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-white/10 transition-colors ${styles.icon}`}
              >
                <div className="w-full flex items-center justify-center">
                  <GripVertical className="h-5 w-5" />
                </div>
              </button>
              <div className="flex flex-col small text-slate-400">
                <span className="text-xs font-medium text-slate-200 tracking-wide truncate max-w-[150px]">{item.heading || item.key}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              {item.type !== 'form' ? (
                <Button onClick={() => onEdit(item)} size="sm" className="min-w-1" variant="outlineGlassy">
                  <Edit className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={() => onPreview(item)} size="sm" className="min-w-1" variant="outlineGlassy">
                  <Eye className="h-4 w-4" />
                </Button>
              )}

              <Button onClick={() => onDelete(item)} size="sm" className="min-w-1" variant="outlineGlassy">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-6 pt-16 text-slate-300 min-h-[100px]">
            <div className="z-10 pointer-events-none select-none opacity-90 group-hover:opacity-100 transition-opacity">
              {ComponentToRender &&
                (item.type !== 'form' ? (
                  <ComponentToRender data={JSON.stringify(item.data)} />
                ) : (
                  <div className="pointer-events-auto">
                    <ComponentToRender data={item.data} onSubmit={(newData: unknown) => onInlineUpdate(item, newData)} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NormalizedPage {
  _id: string;
  pageName: string;
  path: string;
  content: PageContent[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

function EditPageContent() {
  const searchParams = useSearchParams();
  const pathTitle = searchParams.get('pathTitle') || '/';

  const { data: pagesData, isLoading, error, refetch } = useGetPagesQuery({ page: 1, limit: 1000 });
  const [updatePage] = useUpdatePageMutation();

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

  const [items, setItems] = useState<PageContent[]>([]);
  const [editingItem, setEditingItem] = useState<PageContent | null>(null);
  const [previewingItem, setPreviewingItem] = useState<PageContent | null>(null);
  const [deletingItem, setDeletingItem] = useState<PageContent | null>(null);
  const [movingItem, setMovingItem] = useState<PageContent | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeAddType, setActiveAddType] = useState<ItemType | null>(null);
  const [, setIsScrolled] = useState(false);
  const [isDockExpanded, setIsDockExpanded] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedSectionCategory, setSelectedSectionCategory] = useState<string>('All');
  const [sectionPreviewKey, setSectionPreviewKey] = useState<string | null>(null);
  const [paginationPage, setPaginationPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (currentPage?.content) {
      setItems(Array.isArray(currentPage.content) ? currentPage.content : []);
    }
  }, [currentPage]);

  useEffect(() => {
    setPaginationPage(1);
  }, [activeAddType, selectedSectionCategory]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems(prevItems => {
        const oldIndex = prevItems.findIndex(item => item.id === active.id);
        const newIndex = prevItems.findIndex(item => item.id === over.id);
        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const handleMoveUp = () => {
    if (!movingItem) return;
    const index = items.findIndex(item => item.id === movingItem.id);
    if (index > 0) setItems(prevItems => arrayMove(prevItems, index, index - 1));
  };

  const handleMoveDown = () => {
    if (!movingItem) return;
    const index = items.findIndex(item => item.id === movingItem.id);
    if (index < items.length - 1) setItems(prevItems => arrayMove(prevItems, index, index + 1));
  };

  const handleAddItem = (type: ItemType, key: string) => {
    const mapEntry = COMPONENT_MAP[type];
    const config = mapEntry.collection[key];
    const newItem: PageContent = {
      id: `${type}-${key}-${Date.now()}`,
      key: key,
      name: config.name || `${mapEntry.label} ${key}`,
      type: type,
      heading: `${mapEntry.label} ${key}`,
      path: `/${key}`,
      data: config.data,
    };
    setItems([...items, newItem]);

    toast.success(`${key} added to page`);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);

    setSectionPreviewKey(null);
    if (type !== 'section') setActiveAddType(null);
  };

  const handleEdit = (item: PageContent) => setEditingItem(item);
  const handlePreview = (item: PageContent) => setPreviewingItem(item);
  const handleDeleteClick = (item: PageContent) => setDeletingItem(item);
  const handleOpenMoveDialog = (item: PageContent) => setMovingItem(item);
  const handlePreviewPage = (path: string) => {
    window.open(`/dashboard/page-builder/preview-page?pathTitle=${path}`, '_blank');
  };
  const handlePreviewLivePage = (path: string) => {
    window.open(`${path}`, '_blank');
  };
  const handleConfirmDelete = () => {
    if (deletingItem) {
      setItems(items.filter(item => item.id !== deletingItem.id));
      setDeletingItem(null);
    }
  };

  const onSubmitEdit = (updatedData: unknown) => {
    if (editingItem) setItems(items.map(item => (item.id === editingItem.id ? { ...item, data: updatedData } : item)));
    setEditingItem(null);
  };

  const handleInlineUpdate = (targetItem: PageContent, updatedData: unknown) => {
    setItems(prevItems => prevItems.map(item => (item.id === targetItem.id ? { ...item, data: updatedData } : item)));
  };

  const handleSubmitAll = async () => {
    if (!currentPage?._id) {
      toast.error('Page context lost. Please refresh.');
      return;
    }

    setIsSaving(true);
    try {
      await updatePage({
        id: currentPage._id,
        content: items,
      }).unwrap();

      toast.success('Page saved successfully!');
    } catch (err) {
      toast.error('Failed to save page');
      console.error('Error saving page:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const topMenuButtons: ItemType[] = ['form', 'section'];

  const sectionCategories = useMemo(() => ['All', ...allSectionCagegory], []);

  const filteredSectionKeys = useMemo(() => {
    if (activeAddType !== 'section') return [];
    if (selectedSectionCategory === 'All') return AllSectionsKeys;

    return AllSectionsKeys.filter(key => {
      const section = TypedAllSections[key];
      return section?.category === selectedSectionCategory;
    });
  }, [activeAddType, selectedSectionCategory]);

  if (error) {
    const errorMessage =
      'status' in error ? `Error ${error.status}: ${JSON.stringify(error.data)}` : 'message' in error ? error.message : 'An unexpected error occurred';

    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500 max-w-lg">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/30 blur-3xl rounded-full" />
            <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-2xl">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-white">Failed to Load Page Data</h2>
            <p className="text-slate-400 text-lg">We encountered an error while fetching the page data.</p>
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-left w-full overflow-hidden">
              <p className="text-red-400 text-xs font-mono break-all">{errorMessage}</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <Button onClick={() => (window.location.href = '/page-builder')} variant="outlineGlassy" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              View All Pages
            </Button>
            <Button onClick={() => refetch()} variant="outlineGlassy" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full animate-pulse" />
            <Layers className="h-10 w-10 text-white animate-pulse relative z-10" />
          </div>
          <div className="text-white text-lg">Loading Page Editor...</div>
        </div>
      </main>
    );
  }

  if (!currentPage) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500 max-w-lg">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/30 blur-3xl rounded-full" />
            <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-2xl">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-white">Page Not Found</h2>
            <p className="text-slate-400 text-lg">The page you&apos;re looking for doesn&apos;t exist or hasn&apos;t been created yet.</p>
            <p className="text-red-400 text-sm font-mono bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 inline-block">Path: {pathTitle}</p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <Button onClick={() => (window.location.href = '/page-builder')} variant="outlineGlassy" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              View All Pages
            </Button>
            <Button onClick={() => refetch()} variant="outlineGlassy" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 overflow-x-hidden selection:bg-purple-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/20 blur-[120px] animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-soft-light"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-8 max-w-5xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">{currentPage.pageName}</h1>
          <p className="text-slate-400 font-mono text-sm bg-white/5 inline-block px-3 py-1 rounded-full border border-white/5">{currentPage.path}</p>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pb-60 max-w-5xl">
        {items.length === 0 ? (
          <div className="animate-in zoom-in-95 duration-700 fade-in flex flex-col items-center justify-center min-h-[50vh] border-2 border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm p-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full" />
              <div className="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-2xl">
                <Layers className="h-10 w-10 text-blue-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 text-center">Start Creating</h2>
            <p className="text-slate-400 text-center max-w-md mb-8 text-lg">Your canvas is empty. Use the dock below to add powerful components.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-8">
                {items.map(item => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                    onPreview={handlePreview}
                    onDelete={handleDeleteClick}
                    onInlineUpdate={handleInlineUpdate}
                    onOpenMoveDialog={handleOpenMoveDialog}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div className="backdrop-blur-xl shadow-2xl rounded-xl border border-blue-500/30 bg-slate-900/90 p-4 flex items-center gap-4 transform scale-105 cursor-grabbing">
                  <GripVertical className="h-6 w-6 text-blue-400" />
                  <span className="text-white font-medium text-lg">Moving Item...</span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      <div className="fixed bottom-6 left-0 right-0 z-50 flex flex-col items-center justify-end gap-4 pointer-events-none">
        <button
          onClick={() => setIsDockExpanded(!isDockExpanded)}
          className={`
            pointer-events-auto flex items-center justify-center w-12 h-8 rounded-full 
            bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-lg 
            text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300
            ${!isDockExpanded ? 'animate-bounce ring-1 ring-blue-500/50 shadow-blue-500/20' : ''}
          `}
        >
          {isDockExpanded ? <ChevronDown className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
        </button>

        <div
          className={`
            flex items-center gap-4 transition-all duration-500 ease-in-out origin-bottom rounded-2xl bg-slate-950/80 backdrop-blur-2xl border border-white/10 shadow-2xl ring-1 ring-white/5 justify-between w-[95%] md:w-2xl lg:w-4xl 
            ${isDockExpanded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95 pointer-events-none absolute bottom-0'}
          `}
        >
          <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 p-2.5">
            {topMenuButtons.map(type => {
              const meta = COMPONENT_MAP[type];
              const Icon = meta.icon;
              const isActive = activeAddType === type;

              return (
                <button
                  key={type}
                  onClick={() => {
                    setActiveAddType(type);
                    setSelectedSectionCategory('All');
                  }}
                  className={`
                      group relative flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-14 rounded-xl transition-all duration-300
                      ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
                    `}
                >
                  <span
                    className={`
                       flex items-center justify-center w-8 h-8 rounded-full mb-1 transition-all duration-300 shadow-lg
                       bg-gradient-to-br ${meta.color} text-white
                       group-hover:scale-110 group-hover:shadow-lg
                    `}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 group-hover:text-white transition-colors">{meta.label}</span>
                  {isActive && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white shadow-[0_0_5px_white]" />}
                </button>
              );
            })}
          </div>
          {/* ADDED pointer-events-auto and pr-4 HERE */}
          <div className="w-full flex items-center justify-end gap-2 pointer-events-auto pr-4">
            <Button size="sm" variant="outlineGlassy" className="min-w-1" onClick={() => handlePreviewPage(currentPage.path)} title="Preview Page">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outlineGlassy" className="min-w-1" onClick={() => handlePreviewLivePage(currentPage.path)} title="Preview Page">
              <ExternalLink className="h-4 w-4" />
            </Button>
            <div
              className={`
              pointer-events-auto transition-all duration-500 
              ${items.length > 0 ? 'max-h-20 opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-4'}
              `}
            >
              <Button onClick={handleSubmitAll} variant="outlineGlassy" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!activeAddType} onOpenChange={() => setActiveAddType(null)}>
        {/* ... (rest of the dialog content remains unchanged) */}
        <DialogContent
          className={`
            p-0 overflow-hidden bg-slate-950/95 backdrop-blur-3xl border-white/10 shadow-2xl text-white gap-0 flex flex-col max-w-[90vw] min-w-[90vw] h-[85vh] mt-10
        `}
        >
          {activeAddType &&
            (() => {
              const meta = COMPONENT_MAP[activeAddType];
              const isSectionMode = activeAddType === 'section';

              // Pagination Logic
              const dataSource = isSectionMode ? filteredSectionKeys : meta.keys;
              const totalItems = dataSource.length;
              const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
              const paginatedItems = dataSource.slice((paginationPage - 1) * ITEMS_PER_PAGE, paginationPage * ITEMS_PER_PAGE);

              return (
                <>
                  <div className="shrink-0 flex flex-col bg-white/5 border-b border-white/10">
                    <div className="flex items-center justify-between p-6 pb-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${meta.color} shadow-lg`}>
                          <meta.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                            Add {meta.label}
                            {isSectionMode && <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 font-mono">{totalItems} Total</span>}
                          </DialogTitle>
                          <p className="text-slate-400 text-sm mt-1">
                            {isSectionMode ? 'Browse and filter professional sections to build your page.' : 'Choose a component to add.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {isSectionMode && (
                      <div className="px-6 pb-0 flex overflow-x-auto no-scrollbar gap-2">
                        {sectionCategories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setSelectedSectionCategory(cat)}
                            className={`
                                relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap
                                ${selectedSectionCategory === cat ? 'text-white' : 'text-slate-500 hover:text-slate-300'}
                              `}
                          >
                            {cat}
                            {selectedSectionCategory === cat && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <ScrollArea className="flex-1 min-h-0 w-full bg-black/20">
                    <div className="p-6">
                      {isSectionMode ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20">
                          {paginatedItems.map(key => {
                            const config = TypedAllSections[key];
                            const PreviewComp = config.query;

                            return (
                              <div
                                key={key}
                                className="group relative bg-slate-900 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col h-[320px]"
                              >
                                <div className="relative flex-1 bg-black/40 overflow-hidden">
                                  <div className="absolute inset-0 flex items-center justify-center p-4">
                                    <div className="w-[200%] h-[200%] origin-center scale-[0.5] pointer-events-none select-none flex items-start justify-center pt-10">
                                      {PreviewComp ? <PreviewComp data={JSON.stringify(config.data)} /> : <div className="text-slate-600">No Preview</div>}
                                    </div>
                                  </div>
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                                  <div className="absolute top-3 left-3">
                                    <span className="bg-black/60 backdrop-blur text-[10px] text-white/80 px-2 py-1 rounded border border-white/5">
                                      {config.category}
                                    </span>
                                  </div>
                                </div>

                                <div className="p-4 bg-white/5 border-t border-white/5 flex flex-col gap-3 relative z-10">
                                  <div className="flex justify-between items-center">
                                    <h4 className="text-sm font-semibold text-slate-200 truncate pr-2">{key}</h4>
                                  </div>
                                  <div className="flex gap-2 justify-end">
                                    <Button onClick={() => setSectionPreviewKey(key)} size="sm" variant="outlineGlassy">
                                      <Eye className="mr-2 h-3.5 w-3.5" /> Preview
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        handleAddItem('section', key);
                                        setActiveAddType(null);
                                      }}
                                      size="sm"
                                      variant="outlineGlassy"
                                    >
                                      <Plus className="mr-2 h-3.5 w-3.5" /> Add
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {paginatedItems.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500">
                              <Search className="h-10 w-10 mb-4 opacity-50" />
                              <p>No sections found in this category.</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                          {paginatedItems.map(key => {
                            const config = meta.collection[key];
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const DisplayComponent = activeAddType === 'form' ? (config as any).preview : (config as any).query;

                            return (
                              <div
                                key={key}
                                onClick={() => handleAddItem(activeAddType, key)}
                                className="group cursor-pointer rounded-2xl border border-white/10 bg-black/20 overflow-hidden hover:border-white/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                              >
                                <div className="h-[180px] bg-slate-900/50 relative overflow-hidden p-4 flex items-center justify-center border-b border-white/5">
                                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                                  <div className="scale-[0.6] w-full h-full origin-center flex items-center justify-center pointer-events-none">
                                    {DisplayComponent ? <DisplayComponent /> : <span className="text-slate-500">Preview</span>}
                                  </div>
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <div className="bg-white text-black px-4 py-2 rounded-full font-semibold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                      <Plus className="h-4 w-4" /> Add This
                                    </div>
                                  </div>
                                </div>
                                <div className="p-4 bg-white/5 flex justify-between items-center">
                                  <span className="font-semibold text-slate-200 text-sm">{key}</span>
                                  <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-slate-400 uppercase tracking-wider">{meta.label}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {totalPages > 1 && (
                    <div className="shrink-0 p-4 border-t border-white/10 bg-slate-900/50 backdrop-blur-md flex items-center justify-between z-20">
                      <div className="text-xs text-slate-500 font-mono hidden sm:block">
                        Showing {(paginationPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(paginationPage * ITEMS_PER_PAGE, totalItems)} of {totalItems}
                      </div>
                      <div className="flex items-center gap-2 mx-auto sm:mx-0">
                        <Button
                          variant="outlineGlassy"
                          size="sm"
                          onClick={() => setPaginationPage(p => Math.max(1, p - 1))}
                          disabled={paginationPage === 1}
                          className="w-10 h-10 p-0 rounded-full"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium text-slate-300 min-w-[3rem] text-center">
                          {paginationPage} / {totalPages}
                        </span>
                        <Button
                          variant="outlineGlassy"
                          size="sm"
                          onClick={() => setPaginationPage(p => Math.min(totalPages, p + 1))}
                          disabled={paginationPage === totalPages}
                          className="w-10 h-10 p-0 rounded-full"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
        </DialogContent>
      </Dialog>
      {/* ... (rest of the dialogs remain unchanged) ... */}
      <Dialog open={!!sectionPreviewKey} onOpenChange={() => setSectionPreviewKey(null)}>
        <DialogContent className="max-w-[90vw] p-0 bg-slate-950 border-white/10 flex flex-col min-w-[90vw] h-[80vh] mt-10 text-white">
          {sectionPreviewKey &&
            (() => {
              const config = TypedAllSections[sectionPreviewKey];
              const QueryComp = config.query;

              return (
                <>
                  <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-bold text-lg">{sectionPreviewKey}</h3>
                      <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">{config.category}</span>
                    </div>
                    <div className="flex items-center gap-3 mr-8">
                      <Button onClick={() => handleAddItem('section', sectionPreviewKey)} variant="outlineGlassy">
                        <Plus className="mr-2 h-4 w-4" /> Add Section
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="h-[70vh] w-full bg-black -mt-4">
                    <div className="min-h-full flex flex-col">
                      {QueryComp ? (
                        <QueryComp data={JSON.stringify(config.data)} />
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-500">Preview not available</div>
                      )}
                    </div>
                  </ScrollArea>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>

      <Dialog open={!!movingItem} onOpenChange={() => setMovingItem(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-center">Reorder {movingItem?.key}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Button onClick={handleMoveUp} className="h-12 text-lg bg-slate-800 hover:bg-slate-700">
              <ArrowUp className="mr-2 h-5 w-5" /> Move Up
            </Button>
            <Button onClick={handleMoveDown} className="h-12 text-lg bg-slate-800 hover:bg-slate-700">
              <ArrowDown className="mr-2 h-5 w-5" /> Move Down
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <span className="text-xl font-bold mb-2">Delete Component?</span>
            </DialogTitle>
            <p className="text-slate-400 mb-6">
              Are you sure you want to remove <span className="text-white font-semibold">{deletingItem?.heading || 'this item'}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3 w-full">
              <Button onClick={() => setDeletingItem(null)} variant="outline" className="flex-1 border-white/10 hover:bg-white/5">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} variant="destructive" className="flex-1 bg-red-600 hover:bg-red-700">
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-4xl md:max-w-6xl h-[85vh] mt-10 p-0 bg-slate-900/95 backdrop-blur-xl border-white/10 text-white flex flex-col">
          <DialogHeader className="p-4 border-b border-white/10 bg-white/5 shrink-0">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Edit className="h-5 w-5 text-blue-400" />
              Edit Component
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 min-h-0 w-full -mt-4">
            <div className="">
              {editingItem &&
                (() => {
                  const meta = COMPONENT_MAP[editingItem.type];
                  const config = meta.collection[editingItem.key];
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const Mutation = (config as any).mutation;
                  return Mutation ? (
                    <Mutation data={editingItem.data} onSubmit={onSubmitEdit} />
                  ) : (
                    <div className="p-4 text-center text-slate-500">No settings available</div>
                  );
                })()}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewingItem} onOpenChange={() => setPreviewingItem(null)}>
        <DialogContent className="max-w-4xl h-[85vh] mt-10 p-0 bg-slate-900/95 backdrop-blur-xl border-white/10 text-white flex flex-col">
          <DialogHeader className="p-6 border-b border-white/10 bg-white/5 shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-cyan-400" /> Live Preview
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 h-[calc(80vh-80px)] w-full">
            <div className="p-6">
              <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                {previewingItem &&
                  (() => {
                    const meta = COMPONENT_MAP[previewingItem.type];
                    const config = meta.collection[previewingItem.key];
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const Preview = (config as any).preview;
                    return Preview ? <Preview data={JSON.stringify(previewingItem.data)} /> : null;
                  })()}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <EditPageContent />
    </Suspense>
  );
}

   ```
   
    - /src/dashboard/page-builder/form-data/page.tsx
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
  ArrowLeft,
  AlertCircle,
  Link2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useSearchParams, useRouter } from 'next/navigation';

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

import { AllFormsKeys } from '@/components/all-form/all-form-index/all-form';
import { useGetPagesQuery } from '@/redux/features/page-builder/pageBuilderSlice';
import {
  useGetFormSubmissionsQuery,
  useAddFormSubmissionMutation,
  useDeleteFormSubmissionMutation,
} from '@/redux/features/form-submission/formSubmissionSlice';

interface ISubmissionData {
  formKey?: string;
  pageId?: string;
  currentPath?: string;
  [key: string]: unknown;
}

interface ISubmission {
  _id: string;
  data: ISubmissionData;
  createdAt: string;
}

const FormSubmissionPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathTitle = searchParams.get('pathTitle');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: pagesData, isLoading: isPagesLoading } = useGetPagesQuery({ page: 1, limit: 100 });

  const {
    data: submissionsResponse,
    isLoading: isSubmissionsLoading,
    refetch: refetchSubmissions,
    isFetching,
  } = useGetFormSubmissionsQuery(
    {
      page,
      limit,
      q: searchTerm,
      pathTitle: pathTitle ?? undefined,
    },
    {
      skip: !pathTitle,
    },
  );

  const [addSubmission, { isLoading: isAdding }] = useAddFormSubmissionMutation();
  const [deleteSubmission, { isLoading: isDeleting }] = useDeleteFormSubmissionMutation();

  const { submissions, totalPages } = useMemo(() => {
    const rawSubmissions: ISubmission[] = submissionsResponse?.data?.submissions || [];
    const rawTotal = submissionsResponse?.data?.total || 0;

    return {
      submissions: rawSubmissions,
      totalItems: rawTotal,
      totalPages: Math.ceil(rawTotal / limit),
    };
  }, [submissionsResponse, limit]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [viewingSubmission, setViewingSubmission] = useState<ISubmission | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [selectedFormKey, setSelectedFormKey] = useState<string>('');
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [jsonBody, setJsonBody] = useState<string>('{\n  "message": "Enter your data here"\n}');

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  const formLists = AllFormsKeys;
  const pagesList = pagesData?.data?.pages || [];

  const availableDataKeys = useMemo(() => {
    const keys = new Set<string>();
    submissions.forEach(sub => {
      if (sub && sub.data) {
        Object.keys(sub.data).forEach(key => {
          if (key !== 'formKey' && key !== 'pageId' && key !== 'currentPath') {
            keys.add(key);
          }
        });
      }
    });
    return Array.from(keys);
  }, [submissions]);

  useEffect(() => {
    if (availableDataKeys.length > 0 && visibleColumns.length === 0) {
      setVisibleColumns(availableDataKeys.slice(0, 3));
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

  const handleViewClick = (sub: ISubmission) => {
    setViewingSubmission(sub);
    setIsViewOpen(true);
  };

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
        currentPath: pathTitle,
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

  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  if (!pathTitle) {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-slate-900 border border-white/10 rounded-2xl p-8 flex flex-col items-center gap-6 shadow-2xl"
        >
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border border-white/5">
            <AlertCircle className="h-10 w-10 text-amber-500 opacity-80" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-200">Path Parameter Missing</h1>
            <p className="text-slate-400">
              No <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-400 font-mono text-sm">pathTitle</code> was found in the URL. We cannot load
              submissions without a target path context.
            </p>
          </div>

          <Button onClick={() => router.back()} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300">
            <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
          </Button>
        </motion.div>
      </main>
    );
  }

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="h-8 w-8 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Form Submissions</h1>
              <div className="h-6 w-px bg-white/20 mx-1 hidden sm:block" />
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 text-sm font-mono flex items-center gap-2">
                <Link2 className="h-3 w-3" />
                {pathTitle}
              </Badge>
            </div>
            <p className="text-slate-400 text-sm pl-8">
              Viewing entries specifically for the path <span className="text-slate-300">{pathTitle}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <Input
                placeholder="Search by ID..."
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
            <Button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] border-none">
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </div>
        </div>

        <div className="border border-white/10 rounded-xl bg-slate-900/40 overflow-hidden backdrop-blur-sm relative">
          {isSubmissionsLoading ? (
            <div className="h-64 flex items-center justify-center text-slate-400">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mb-2" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <FileJson className="h-12 w-12 mb-4 opacity-50" />
              <p>No submissions found for this path.</p>
              <Button variant="link" onClick={handleOpenAdd} className="text-blue-400 mt-2">
                Create the first one
              </Button>
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
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-6 flex items-center gap-3">
                  <Link2 className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm text-emerald-200">
                    This submission will be linked to path: <span className="font-mono font-bold">{pathTitle}</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

              <div className="p-4 border-t border-white/10 bg-slate-950/50 flex justify-end">
                <Button onClick={() => setIsViewOpen(false)} className="bg-white/10 hover:bg-white/20 text-white border-none">
                  Close Details
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
   
    - /src/dashboard/page-builder/preview-page/page.tsx
   ```
/*
|-----------------------------------------
| Preview Page Data (Pure Render)
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: App-Generator, November, 2025
|-----------------------------------------
*/

'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle, Type, Layers, RefreshCw } from 'lucide-react';

import { AllSections, AllSectionsKeys } from '@/components/all-section/all-section-index/all-sections';
import { AllForms, AllFormsKeys } from '@/components/all-form/all-form-index/all-form';

import { Button } from '@/components/ui/button';
import { PageContent } from '../utils';
import { useGetPagesQuery } from '@/redux/features/page-builder/pageBuilderSlice';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENT_MAP: Record<string, { collection: any; keys: string[]; label: string; icon: any; color: string }> = {
  // Core Categories
  form: { collection: AllForms, keys: AllFormsKeys, label: 'Forms', icon: Type, color: 'text-blue-400' },
  section: { collection: AllSections, keys: AllSectionsKeys, label: 'Sections', icon: Layers, color: 'text-purple-400' },
};

interface ReadOnlyItemProps {
  item: PageContent;
}

// --- Sub-Component: Read Only Item (Pure Render) ---
const ReadOnlyItem = ({ item }: ReadOnlyItemProps) => {
  // Safe check for component mapping
  const mapEntry = COMPONENT_MAP[item.type];
  const config = mapEntry ? mapEntry.collection[item.key] : null;

  // Fallback if data is corrupted or type is no longer supported
  if (!mapEntry || !config) {
    return null;
  }

  let ComponentToRender;
  if (item.type === 'form') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ComponentToRender = (config as any).FormField;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ComponentToRender = (config as any).query;
  }

  return (
    <div className="w-full">
      {ComponentToRender &&
        (item.type !== 'form' ? (
          <ComponentToRender data={JSON.stringify(item.data)} />
        ) : (
          <div className="pointer-events-auto">
            <ComponentToRender data={item.data} />
          </div>
        ))}
    </div>
  );
};

// Normalized Interface
interface NormalizedPage {
  _id: string;
  pageName: string;
  path: string;
  content: PageContent[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Main component
function PreviewPageContent() {
  const searchParams = useSearchParams();
  const pathTitle = searchParams.get('pathTitle') || '/';

  // Redux hooks
  const { data: pagesData, isLoading, error, refetch } = useGetPagesQuery({ page: 1, limit: 1000 });

  // 1. NORMALIZE DATA
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

  // 2. FIND CURRENT PAGE
  const currentPage = useMemo(() => {
    return normalizedPages.find(p => p.path === pathTitle);
  }, [normalizedPages, pathTitle]);

  const [items, setItems] = useState<PageContent[]>([]);

  // Load content
  useEffect(() => {
    if (currentPage?.content) {
      setItems(Array.isArray(currentPage.content) ? currentPage.content : []);
    }
  }, [currentPage]);

  // --- ERROR STATE ---
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

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-slate-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  // --- 404 STATE ---
  if (!currentPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-slate-400 mb-6">Path: {pathTitle}</p>
        <Button onClick={() => (window.location.href = '/page-builder')} variant="outline">
          Back to List
        </Button>
      </div>
    );
  }

  return (
    // Assuming components need a dark background, otherwise remove 'bg-slate-950'
    <main className="min-h-screen w-full bg-slate-950 pt-[80px]">
      {items.length === 0 ? (
        <div className="min-h-[50vh] flex items-center justify-center text-slate-500">Empty Page</div>
      ) : (
        <div className="w-full flex flex-col">
          {items.map(item => (
            <ReadOnlyItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}

// Wrapper
export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>}>
      <PreviewPageContent />
    </Suspense>
  );
}

   ```
   

4. Componnets
    - /src/components/all-sectoins/all-section-index/all-sections.tsx
   ```
// all-section-index.tsx
import { defaultDataSection1 } from '../section-1/data';
import { defaultDataSection2 } from '../section-2/data';
import { defaultDataSection3 } from '../section-3/data';
import { defaultDataSection4 } from '../section-4/data';
import { defaultDataSection5 } from '../section-5/data';
import { defaultDataSection6 } from '../section-6/data';
import { defaultDataSection7 } from '../section-7/data';
import { defaultDataSection8 } from '../section-8/data';
import { defaultDataSection9 } from '../section-9/data';
import { defaultDataSection10 } from '../section-10/data';
import { defaultDataSection11 } from '../section-11/data';
import { defaultDataSection12 } from '../section-12/data';
import { defaultDataSection13 } from '../section-13/data';
import { defaultDataSection14 } from '../section-14/data';
import { defaultDataSection15 } from '../section-15/data';
import { defaultDataSection16 } from '../section-16/data';
import { defaultDataSection17 } from '../section-17/data';
import { defaultDataSection18 } from '../section-18/data';
import { defaultDataSection19 } from '../section-19/data';
import { defaultDataSection20 } from '../section-20/data';
import { defaultDataSection21 } from '../section-21/data';
import { defaultDataSection22 } from '../section-22/data';
import { defaultDataSection23 } from '../section-23/data';
import { defaultDataSection24 } from '../section-24/data';
import { defaultDataSection25 } from '../section-25/data';
import { defaultDataSection26 } from '../section-26/data';
import { defaultDataSection27 } from '../section-27/data';
import { defaultDataSection28 } from '../section-28/data';
import { defaultDataSection29 } from '../section-29/data';
import { defaultDataSection30 } from '../section-30/data';
import { defaultDataSection31 } from '../section-31/data';
import { defaultDataSection32 } from '../section-32/data';
import { defaultDataSection33 } from '../section-33/data';
import { defaultDataSection34 } from '../section-34/data';
import { defaultDataSection35 } from '../section-35/data';
import { defaultDataSection36 } from '../section-36/data';
import { defaultDataSection37 } from '../section-37/data';
import { defaultDataSection38 } from '../section-38/data';
import { defaultDataSection39 } from '../section-39/data';
import { defaultDataSection40 } from '../section-40/data';
import { defaultDataSection41 } from '../section-41/data';
import { defaultDataSection42 } from '../section-42/data';
import { defaultDataSection43 } from '../section-43/data';

import MutationSection1 from '../section-1/Mutation';
import MutationSection2 from '../section-2/Mutation';
import MutationSection3 from '../section-3/Mutation';
import MutationSection4 from '../section-4/Mutation';
import MutationSection5 from '../section-5/Mutation';
import MutationSection6 from '../section-6/Mutation';
import MutationSection7 from '../section-7/Mutation';
import MutationSection8 from '../section-8/Mutation';
import MutationSection9 from '../section-9/Mutation';
import MutationSection10 from '../section-10/Mutation';
import MutationSection11 from '../section-11/Mutation';
import MutationSection12 from '../section-12/Mutation';
import MutationSection13 from '../section-13/Mutation';
import MutationSection14 from '../section-14/Mutation';
import MutationSection15 from '../section-15/Mutation';
import MutationSection16 from '../section-16/Mutation';
import MutationSection17 from '../section-17/Mutation';
import MutationSection18 from '../section-18/Mutation';
import MutationSection19 from '../section-19/Mutation';
import MutationSection20 from '../section-20/Mutation';
import MutationSection21 from '../section-21/Mutation';
import MutationSection22 from '../section-22/Mutation';
import MutationSection23 from '../section-23/Mutation';
import MutationSection24 from '../section-24/Mutation';
import MutationSection25 from '../section-25/Mutation';
import MutationSection26 from '../section-26/Mutation';
import MutationSection27 from '../section-27/Mutation';
import MutationSection28 from '../section-28/Mutation';
import MutationSection29 from '../section-29/Mutation';
import MutationSection30 from '../section-30/Mutation';
import MutationSection31 from '../section-31/Mutation';
import MutationSection32 from '../section-32/Mutation';
import MutationSection33 from '../section-33/Mutation';
import MutationSection34 from '../section-34/Mutation';
import MutationSection35 from '../section-35/Mutation';
import MutationSection36 from '../section-36/Mutation';
import MutationSection37 from '../section-37/Mutation';
import MutationSection38 from '../section-38/Mutation';
import MutationSection39 from '../section-39/Mutation';
import MutationSection40 from '../section-40/Mutation';
import MutationSection41 from '../section-41/Mutation';
import MutationSection42 from '../section-42/Mutation';
import MutationSection43 from '../section-43/Mutation';

import QuerySection1 from '../section-1/Query';
import QuerySection2 from '../section-2/Query';
import QuerySection3 from '../section-3/Query';
import QuerySection4 from '../section-4/Query';
import QuerySection5 from '../section-5/Query';
import QuerySection6 from '../section-6/Query';
import QuerySection7 from '../section-7/Query';
import QuerySection8 from '../section-8/Query';
import QuerySection9 from '../section-9/Query';
import QuerySection10 from '../section-10/Query';
import QuerySection11 from '../section-11/Query';
import QuerySection12 from '../section-12/Query';
import QuerySection13 from '../section-13/Query';
import QuerySection14 from '../section-14/Query';
import QuerySection15 from '../section-15/Query';
import QuerySection16 from '../section-16/Query';
import QuerySection17 from '../section-17/Query';
import QuerySection18 from '../section-18/Query';
import QuerySection19 from '../section-19/Query';
import QuerySection20 from '../section-20/Query';
import QuerySection21 from '../section-21/Query';
import QuerySection22 from '../section-22/Query';
import QuerySection23 from '../section-23/Query';
import QuerySection24 from '../section-24/Query';
import QuerySection25 from '../section-25/Query';
import QuerySection26 from '../section-26/Query';
import QuerySection27 from '../section-27/Query';
import QuerySection28 from '../section-28/Query';
import QuerySection29 from '../section-29/Query';
import QuerySection30 from '../section-30/Query';
import QuerySection31 from '../section-31/Query';
import QuerySection32 from '../section-32/Query';
import QuerySection33 from '../section-33/Query';
import QuerySection34 from '../section-34/Query';
import QuerySection35 from '../section-35/Query';
import QuerySection36 from '../section-36/Query';
import QuerySection37 from '../section-37/Query';
import QuerySection38 from '../section-38/Query';
import QuerySection39 from '../section-39/Query';
import QuerySection40 from '../section-40/Query';
import QuerySection41 from '../section-41/Query';
import QuerySection42 from '../section-42/Query';
import QuerySection43 from '../section-43/Query';

export const allSectionCagegory = ['section', 'accordion', 'scroll', 'blog', 'map', 'tag', 'gallery', 'carousel', 'icons'];

export const AllSections = {
  'section-uid-1': { name: 'Hero Section', category: allSectionCagegory[0], mutation: MutationSection1, query: QuerySection1, data: defaultDataSection1 },
  'section-uid-2': { name: 'Hero Section', category: allSectionCagegory[0], mutation: MutationSection2, query: QuerySection2, data: defaultDataSection2 },
  'section-uid-3': { name: 'Hero Section', category: allSectionCagegory[0], mutation: MutationSection3, query: QuerySection3, data: defaultDataSection3 },
  'section-uid-4': { name: 'Hero Section', category: allSectionCagegory[0], mutation: MutationSection4, query: QuerySection4, data: defaultDataSection4 },
  'section-uid-5': { name: 'Hero Section', category: allSectionCagegory[0], mutation: MutationSection5, query: QuerySection5, data: defaultDataSection5 },
  'section-uid-6': { name: 'Hero Section', category: allSectionCagegory[0], mutation: MutationSection6, query: QuerySection6, data: defaultDataSection6 },
  'section-uid-7': { name: 'Name', category: allSectionCagegory[0], mutation: MutationSection7, query: QuerySection7, data: defaultDataSection7 },
  'section-uid-8': { name: 'Name', category: allSectionCagegory[1], mutation: MutationSection8, query: QuerySection8, data: defaultDataSection8 },
  'section-uid-9': { name: 'Name', category: allSectionCagegory[0], mutation: MutationSection9, query: QuerySection9, data: defaultDataSection9 },
  'section-uid-10': { name: 'Name', category: allSectionCagegory[0], mutation: MutationSection10, query: QuerySection10, data: defaultDataSection10 },
  'section-uid-11': { name: 'Name', category: allSectionCagegory[2], mutation: MutationSection11, query: QuerySection11, data: defaultDataSection11 },
  'section-uid-12': { name: 'Name', category: allSectionCagegory[2], mutation: MutationSection12, query: QuerySection12, data: defaultDataSection12 },
  'section-uid-13': { name: 'Name', category: allSectionCagegory[0], mutation: MutationSection13, query: QuerySection13, data: defaultDataSection13 },
  'section-uid-14': { name: 'Name', category: allSectionCagegory[3], mutation: MutationSection14, query: QuerySection14, data: defaultDataSection14 },
  'section-uid-15': { name: 'Name', category: allSectionCagegory[3], mutation: MutationSection15, query: QuerySection15, data: defaultDataSection15 },
  'section-uid-16': { name: 'Name', category: allSectionCagegory[3], mutation: MutationSection16, query: QuerySection16, data: defaultDataSection16 },
  'section-uid-17': { name: 'Name', category: allSectionCagegory[3], mutation: MutationSection17, query: QuerySection17, data: defaultDataSection17 },
  'section-uid-18': { name: 'Name', category: allSectionCagegory[4], mutation: MutationSection18, query: QuerySection18, data: defaultDataSection18 },
  'section-uid-19': { name: 'Name', category: allSectionCagegory[5], mutation: MutationSection19, query: QuerySection19, data: defaultDataSection19 },
  'section-uid-20': { name: 'Name', category: allSectionCagegory[5], mutation: MutationSection20, query: QuerySection20, data: defaultDataSection20 },
  'section-uid-21': { name: 'Name', category: allSectionCagegory[5], mutation: MutationSection21, query: QuerySection21, data: defaultDataSection21 },
  'section-uid-22': { name: 'Name', category: allSectionCagegory[5], mutation: MutationSection22, query: QuerySection22, data: defaultDataSection22 },
  'section-uid-23': { name: 'Name', category: allSectionCagegory[5], mutation: MutationSection23, query: QuerySection23, data: defaultDataSection23 },
  'section-uid-24': { name: 'Name', category: allSectionCagegory[6], mutation: MutationSection24, query: QuerySection24, data: defaultDataSection24 },
  'section-uid-25': { name: 'Name', category: allSectionCagegory[7], mutation: MutationSection25, query: QuerySection25, data: defaultDataSection25 },
  'section-uid-26': { name: 'Name', category: allSectionCagegory[7], mutation: MutationSection26, query: QuerySection26, data: defaultDataSection26 },
  'section-uid-27': { name: 'Name', category: allSectionCagegory[7], mutation: MutationSection27, query: QuerySection27, data: defaultDataSection27 },
  'section-uid-28': { name: 'Name', category: allSectionCagegory[6], mutation: MutationSection28, query: QuerySection28, data: defaultDataSection28 },
  'section-uid-29': { name: 'Name', category: allSectionCagegory[5], mutation: MutationSection29, query: QuerySection29, data: defaultDataSection29 },
  'section-uid-30': { name: 'Name', category: allSectionCagegory[8], mutation: MutationSection30, query: QuerySection30, data: defaultDataSection30 },
  'section-uid-31': { name: 'Name', category: allSectionCagegory[0], mutation: MutationSection31, query: QuerySection31, data: defaultDataSection31 },
  'section-uid-32': { name: 'Name', category: allSectionCagegory[0], mutation: MutationSection32, query: QuerySection32, data: defaultDataSection32 },
  'section-uid-33': { name: 'Name', category: allSectionCagegory[0], mutation: MutationSection33, query: QuerySection33, data: defaultDataSection33 },
  'section-uid-34': { name: 'Name', category: allSectionCagegory[0], mutation: MutationSection34, query: QuerySection34, data: defaultDataSection34 },
  'section-uid-35': { name: 'Name', category: allSectionCagegory[0], mutation: MutationSection35, query: QuerySection35, data: defaultDataSection35 },
  'section-uid-36': { name: 'Name', category: allSectionCagegory[0], mutation: MutationSection36, query: QuerySection36, data: defaultDataSection36 },
  'section-uid-37': { name: 'Name', category: allSectionCagegory[0], mutation: MutationSection37, query: QuerySection37, data: defaultDataSection37 },
  'section-uid-38': { name: 'Name', category: allSectionCagegory[0], mutation: MutationSection38, query: QuerySection38, data: defaultDataSection38 },
  'section-uid-39': { name: 'Name', category: allSectionCagegory[0], mutation: MutationSection39, query: QuerySection39, data: defaultDataSection39 },
  'section-uid-40': { name: 'Name', category: allSectionCagegory[0], mutation: MutationSection40, query: QuerySection40, data: defaultDataSection40 },
  'section-uid-41': { name: 'Name', category: allSectionCagegory[0], mutation: MutationSection41, query: QuerySection41, data: defaultDataSection41 },
  'section-uid-42': { name: 'Name', category: allSectionCagegory[0], mutation: MutationSection42, query: QuerySection42, data: defaultDataSection42 },
  'section-uid-43': { name: 'Name', category: allSectionCagegory[0], mutation: MutationSection43, query: QuerySection43, data: defaultDataSection43 },
};

export const AllSectionsKeys = Object.keys(AllSections);

   ```
   
    - /src/components/all-sectoins/section-1/data.ts
   ```
export interface Section1Props {
  data?: ISection1Data | string;
}
export interface ISection1Data {
  sectionUid: string;
  title: string;
  image: string;
  heading: string;
  description: string;
  featuredLabel: string;
  buttonPrimary: string;
  buttonSecondary: string;
  studentCount: string;
  enrollmentText: string;
  usersImages: string[];
}

export const defaultDataSection1: ISection1Data = {
  sectionUid: 'section-uid-1',
  title: 'Most common Component',
  image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  heading: 'Lecture 45',
  description:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio reprehenderit aliquid harum quae deserunt repudiandae assumenda, atque eos a ad placeat vel vitae.',
  featuredLabel: 'Featured Content',
  buttonPrimary: 'Learn More',
  buttonSecondary: 'View Details',
  studentCount: '2.5k+ Students',
  enrollmentText: 'Already enrolled',
  usersImages: ['https://i.ibb.co.com/TDKr13yj/avater.png', 'https://i.ibb.co.com/TDKr13yj/avater.png', 'https://i.ibb.co.com/TDKr13yj/avater.png'],
};

   ```
   
    - /src/components/all-sectoins/section-1/Mutation.tsx
   ```
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'; // Added for displaying avatar thumbnails
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LayoutTemplate, Save, X } from 'lucide-react'; // Added X for delete icon

import type { ISection1Data } from './data';
import { defaultDataSection1 } from './data';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';

export interface SectionFormProps {
  data?: ISection1Data;
  onSubmit: (values: ISection1Data) => void;
}

const MuationSection1 = ({ data, onSubmit }: SectionFormProps) => {
  // Initialize with default data including the array
  const [formData, setFormData] = useState<ISection1Data>({ ...defaultDataSection1 });

  useEffect(() => {
    if (data) {
      setFormData({ ...data });
    }
  }, [data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof ISection1Data, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSubmit(formData);
  };

  // Logic to remove an image from the usersImages array
  const handleRemoveUserImage = (indexToRemove: number) => {
    const newImages = formData.usersImages.filter((_, index) => index !== indexToRemove);
    updateField('usersImages', newImages);
  };

  // Logic to add an image to the usersImages array
  // We pass this to the ImageUploadManagerSingle
  const handleAddUserImage = (url: string) => {
    if (!url) return;
    const newImages = [...formData.usersImages, url];
    updateField('usersImages', newImages);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <LayoutTemplate className="text-indigo-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Edit Section 1</h2>
            <p className="text-zinc-400 text-sm">Update the content and design of this section.</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Main Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-zinc-400">Title</Label>
              <Input
                value={formData.title}
                onChange={e => updateField('title', e.target.value)}
                placeholder="Enter section title"
                className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Heading</Label>
              <Input
                value={formData.heading}
                onChange={e => updateField('heading', e.target.value)}
                placeholder="Lecture number, topic etc."
                className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Description</Label>
              <Textarea
                value={formData.description}
                onChange={e => updateField('description', e.target.value)}
                placeholder="Write section description..."
                className="min-h-[120px] bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Main Image</Label>
              <div className="bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50">
                <div className="mb-3">
                  <Input
                    value={formData.image}
                    onChange={e => updateField('image', e.target.value)}
                    placeholder="https://..."
                    className="bg-zinc-900 border-zinc-800 mb-2"
                  />
                </div>
                <ImageUploadManagerSingle value={formData.image} onChange={url => updateField('image', url)} />
              </div>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-400">Featured Label</Label>
                <Input
                  value={formData.featuredLabel}
                  onChange={e => updateField('featuredLabel', e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-400">Student Count</Label>
                <Input
                  value={formData.studentCount}
                  onChange={e => updateField('studentCount', e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Enrollment Text</Label>
              <Input
                value={formData.enrollmentText}
                onChange={e => updateField('enrollmentText', e.target.value)}
                className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>

            {/* User Avatars Management Section */}
            <div className="space-y-3">
              <Label className="text-zinc-400">User Avatars</Label>
              <div className="bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50 space-y-4">
                {/* List of existing images */}
                {formData.usersImages?.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {formData.usersImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative group w-14 h-14">
                        <div className="relative w-full h-full rounded-full overflow-hidden border border-zinc-700 shadow-sm">
                          <Image src={imgUrl} alt={`User ${idx}`} fill className="object-cover" />
                        </div>
                        <button
                          onClick={() => handleRemoveUserImage(idx)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-zinc-800 pt-3">
                  <p className="text-xs text-zinc-500 mb-2">Add new avatar</p>
                  {/* 
                    We pass an empty string as value so it always stays in "Add Mode".
                    When onChange is called, we append to our list.
                  */}
                  <ImageUploadManagerSingle
                    label="" // Hide label to save space
                    value=""
                    onChange={handleAddUserImage}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/30 border border-zinc-800/50 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Buttons</h3>
              <div className="space-y-2">
                <Label className="text-zinc-500 text-xs">Primary Button</Label>
                <Input value={formData.buttonPrimary} onChange={e => updateField('buttonPrimary', e.target.value)} className="bg-zinc-900 border-zinc-800" />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-500 text-xs">Secondary Button</Label>
                <Input
                  value={formData.buttonSecondary}
                  onChange={e => updateField('buttonSecondary', e.target.value)}
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur flex justify-end">
          <Button onClick={handleSave} variant="outlineGlassy" size="sm">
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MuationSection1;

   ```
   
    - /src/components/all-sectoins/section-1/Query.tsx
   ```
import Image from 'next/image';
import { defaultDataSection1, ISection1Data, Section1Props } from './data';

const QuerySection1 = ({ data }: Section1Props) => {
  let sectionData = defaultDataSection1;
  if (data && typeof data === 'string') {
    sectionData = JSON.parse(data) as ISection1Data;
  }

  return (
    <div className="relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl">
      <div className="grid lg:grid-cols-2 gap-6 p-6">
        <div className="relative h-64 lg:h-full rounded-xl overflow-hidden shadow-lg">
          {sectionData?.image && <Image src={sectionData.image} alt={sectionData.title || 'Event Venue'} fill className="object-cover" priority />}
          <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
            <span className="text-white text-xs font-semibold">{sectionData.heading}</span>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">{sectionData.featuredLabel}</h3>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
              {sectionData.title}
            </h1>
            <div className="h-0.5 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
          </div>

          <p className="text-gray-300 text-sm leading-relaxed">{sectionData.description}</p>

          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              {sectionData.buttonPrimary}
            </button>
            <button className="px-6 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
              {sectionData.buttonSecondary}
            </button>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-white/10">
            <div className="flex -space-x-2">
              {sectionData.usersImages && sectionData.usersImages.length > 0 ? (
                sectionData.usersImages.map((imgUrl, i) => (
                  <div key={i} className="relative w-8 h-8 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-800">
                    <Image src={imgUrl} alt={`Student ${i + 1}`} fill className="object-cover" />
                  </div>
                ))
              ) : (
                // Fallback if no images exist
                <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center">
                  <span className="text-xs text-gray-500">?</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{sectionData.studentCount}</p>
              <p className="text-gray-400 text-xs">{sectionData.enrollmentText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuerySection1;

   ```
   
    - /src/components/all-sectoins/section-2/data.ts
   ```
export interface Section2Props {
  data?: ISection2Data | string;
}
export interface ISection2Data {
  sectionUid: string;
  id: string;
  title: string;
  image: string;
  heading: string;
  description: string;
  featuredLabel: string;
  buttonPrimary: string;
  buttonSecondary: string;
  studentCount: string;
  enrollmentText: string;
  secondaryImage: string;
  subtitle: string;
  additionalDescription: string;
  ctaText: string;
  highlights: string[];
}

export const defaultDataSection2: ISection2Data = {
  sectionUid: 'section-uid-2',
  id: 'edu_section_001',
  title: 'Master Modern Web Development',
  image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  heading: 'Advanced Course',
  description: 'Dive deep into cutting-edge web technologies with hands-on projects. Learn React, Next.js, TypeScript, and modern deployment strategies.',
  featuredLabel: 'Premium Course',
  buttonPrimary: 'Enroll Now',
  buttonSecondary: 'View Curriculum',
  studentCount: '5.2k+ Students',
  enrollmentText: 'Active learners',
  secondaryImage: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  subtitle: 'From Beginner to Professional',
  additionalDescription: 'This comprehensive program covers everything from fundamental concepts to advanced architectural patterns.',
  ctaText: 'Limited seats available - Join today!',
  highlights: ['Live coding sessions', 'Industry mentorship', 'Certificate of completion'],
};

   ```
   
    - /src/components/all-sectoins/section-2/Mutation.tsx
   ```
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, X, LayoutTemplate, Save, Image as ImageIcon } from 'lucide-react';

import type { ISection2Data } from './data';
import { defaultDataSection2 } from './data';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';

export interface SectionFormProps {
  data?: ISection2Data;
  onSubmit: (values: ISection2Data) => void;
}

const MutationSection2 = ({ data, onSubmit }: SectionFormProps) => {
  const [formData, setFormData] = useState<ISection2Data>({ ...defaultDataSection2 });
  const [highlightInput, setHighlightInput] = useState('');

  useEffect(() => {
    if (data) {
      setFormData({ ...data });
    }
  }, [data]);

  const updateField = (field: keyof ISection2Data, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      updateField('highlights', [...formData.highlights, highlightInput.trim()]);
      setHighlightInput('');
    }
  };

  const removeHighlight = (index: number) => {
    updateField(
      'highlights',
      formData.highlights.filter((_, i) => i !== index),
    );
  };

  const handleSave = () => {
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <LayoutTemplate className="text-purple-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Edit Section 2</h2>
            <p className="text-zinc-400 text-sm">Update the content and design of this section.</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Main Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <LayoutTemplate size={16} /> Text Content
              </h3>
              <div className="space-y-4 bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Title</Label>
                  <Input
                    value={formData.title}
                    onChange={e => updateField('title', e.target.value)}
                    className="bg-zinc-900 border-zinc-800 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Heading</Label>
                  <Input
                    value={formData.heading}
                    onChange={e => updateField('heading', e.target.value)}
                    className="bg-zinc-900 border-zinc-800 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Subtitle</Label>
                  <Input
                    value={formData.subtitle}
                    onChange={e => updateField('subtitle', e.target.value)}
                    className="bg-zinc-900 border-zinc-800 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <LayoutTemplate size={16} /> Descriptions
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Main Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={e => updateField('description', e.target.value)}
                    className="min-h-[100px] bg-zinc-950/50 border-zinc-800 focus:border-purple-500 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Additional Description</Label>
                  <Textarea
                    value={formData.additionalDescription}
                    onChange={e => updateField('additionalDescription', e.target.value)}
                    className="min-h-[100px] bg-zinc-950/50 border-zinc-800 focus:border-purple-500 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Media & Extras */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon size={16} /> Media
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50">
                  <Label className="text-zinc-400 text-xs">Primary Image</Label>
                  <ImageUploadManagerSingle value={formData.image} onChange={url => updateField('image', url)} />
                </div>
                <div className="space-y-2 bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50">
                  <Label className="text-zinc-400 text-xs">Secondary Image</Label>
                  <ImageUploadManagerSingle value={formData.secondaryImage} onChange={url => updateField('secondaryImage', url)} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} /> Highlights
              </h3>
              <div className="bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50 space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={highlightInput}
                    onChange={e => setHighlightInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                    placeholder="Add highlight..."
                    className="bg-zinc-900 border-zinc-800 focus:border-purple-500"
                  />
                  <Button onClick={addHighlight} className="bg-purple-600 hover:bg-purple-500 text-white">
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-sm text-purple-200"
                    >
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      {highlight}
                      <button onClick={() => removeHighlight(idx)} className="ml-1 hover:text-red-400 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {formData.highlights.length === 0 && <p className="text-xs text-zinc-500 italic">No highlights added yet.</p>}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Featured Label</Label>
                  <Input
                    value={formData.featuredLabel}
                    onChange={e => updateField('featuredLabel', e.target.value)}
                    className="bg-zinc-950/50 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Student Count</Label>
                  <Input value={formData.studentCount} onChange={e => updateField('studentCount', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
                </div>
              </div>
            </div>

            <div className="bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-500 text-xs">Primary Button</Label>
                  <Input value={formData.buttonPrimary} onChange={e => updateField('buttonPrimary', e.target.value)} className="bg-zinc-900 border-zinc-800" />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-500 text-xs">Secondary Button</Label>
                  <Input
                    value={formData.buttonSecondary}
                    onChange={e => updateField('buttonSecondary', e.target.value)}
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-500 text-xs">Enrollment Text</Label>
                  <Input
                    value={formData.enrollmentText}
                    onChange={e => updateField('enrollmentText', e.target.value)}
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-500 text-xs">CTA Text</Label>
                  <Input value={formData.ctaText} onChange={e => updateField('ctaText', e.target.value)} className="bg-zinc-900 border-zinc-800" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur flex justify-end">
          <Button onClick={handleSave} variant="outlineGlassy" size="sm">
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MutationSection2;

   ```
   
    - /src/components/all-sectoins/section-2/Query.tsx
   ```
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { defaultDataSection2, ISection2Data, Section2Props } from './data';

const QuerySection2 = ({ data }: Section2Props) => {
  let sectionData = defaultDataSection2;
  if (data && typeof data === 'string') {
    sectionData = JSON.parse(data) as ISection2Data;
  }
  return (
    <div className="relative overflow-hidden  bg-gradient-to-br from-slate-900/90 via-purple-900/90 to-slate-900/90 backdrop-blur-xl border border-white/20 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5" />

      <div className="relative grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
        <div className="space-y-6">
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <span className="text-purple-300 text-sm font-semibold">{sectionData.featuredLabel}</span>
          </div>

          <div className="space-y-3">
            <div className="inline-block px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
              <span className="text-white text-xs font-bold uppercase tracking-wider">{sectionData.heading}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
              {sectionData.title}
            </h1>
            <p className="text-xl text-purple-300 font-medium">{sectionData.subtitle}</p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">{sectionData.description}</p>
            <p className="text-gray-400 text-sm leading-relaxed">{sectionData.additionalDescription}</p>
          </div>

          <div className="space-y-3">
            {sectionData.highlights &&
              sectionData.highlights.length > 0 &&
              sectionData.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <span className="text-gray-300">{highlight}</span>
                </div>
              ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <div className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/30">
              {sectionData.buttonPrimary}
            </div>
            <div className="px-8 py-3 rounded-xl bg-white/5 border border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300">
              {sectionData.buttonSecondary}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-white/10">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-slate-900 flex items-center justify-center text-white text-sm font-semibold"
                >
                  {i}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white font-bold">{sectionData.studentCount}</p>
              <p className="text-gray-400 text-sm">{sectionData.enrollmentText}</p>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-purple-300 text-sm font-medium">{sectionData.ctaText}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
            <Image src={sectionData.image || '/section-2.png'} alt={sectionData.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
          </div>
          <div className="relative h-60 rounded-2xl overflow-hidden shadow-xl">
            <Image src={sectionData.secondaryImage || '/section-2.png'} alt={sectionData.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
          </div>
        </div>
      </div>

      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default QuerySection2;

   ```
   

Main Problem: in future there are more then 1000 components in all-sections. and If I create more then 1000 project it will huge code base. 

My Idea: I will create 2 Project named 1. Parent-project[where 1000 components is writen] and another is 2. child project[it can fetch components from parent project and render it.]

Now Your task is find a better idea to implement the code and render it. Also Please give me some idea if there is a better options. And also give me instruction how to implement it in my project. 