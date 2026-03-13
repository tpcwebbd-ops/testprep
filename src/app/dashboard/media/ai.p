Look at the full Media source code.
here is example of api/v1/route.ts
```
import { NextResponse } from 'next/server';
import { getMedia, createMedia, updateMedia, deleteMedia, getMediaById } from './controller';
import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { isUserHasAccessByRole, IWantAccess } from '../../utils/is-user-has-access-by-role';

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const wantToAccess: IWantAccess = {
    db_name: 'media',
    access: 'read',
  };
  const isAccess = await isUserHasAccessByRole(wantToAccess);
  if (isAccess) return isAccess;

  const id = new URL(req.url).searchParams.get('id');
  const result = id ? await getMediaById(req) : await getMedia(req);

  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const wantToAccess: IWantAccess = {
    db_name: 'media',
    access: 'create',
  };
  const isAccess = await isUserHasAccessByRole(wantToAccess);
  if (isAccess) return isAccess;

  const result = await createMedia(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const wantToAccess: IWantAccess = {
    db_name: 'media',
    access: 'update',
  };
  const isAccess = await isUserHasAccessByRole(wantToAccess);
  if (isAccess) return isAccess;

  const result = await updateMedia(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const wantToAccess: IWantAccess = {
    db_name: 'media',
    access: 'delete',
  };
  const isAccess = await isUserHasAccessByRole(wantToAccess);
  if (isAccess) return isAccess;

  const result = await deleteMedia(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

```

here is example of api/v1/controller.ts
```
import { withDB } from '@/app/api/utils/db';
import Media from './model';
import { formatResponse, IResponse } from '@/app/api/utils/utils';
import { FilterQuery } from 'mongoose';
import { UTApi } from 'uploadthing/server';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

function isMongoError(error: unknown): error is MongoError {
  return error !== null && typeof error === 'object' && 'code' in error && typeof (error as MongoError).code === 'number';
}

export async function createMedia(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const mediaData = await req.json();
      const newMidia = await Media.create(mediaData);
      return formatResponse(newMidia, 'Media created successfully', 201);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function getMediaById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'ID is required', 400);
    const media = await Media.findById(id);
    if (!media) return formatResponse(null, 'Not found', 404);
    return formatResponse(media, 'Fetched successfully', 200);
  });
}

export async function getMedia(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const searchQuery = url.searchParams.get('q');
    const contentType = url.searchParams.get('contentType');
    const status = url.searchParams.get('status') || 'active';

    const filter: FilterQuery<unknown> = { status };

    if (contentType && contentType !== 'all') {
      filter.contentType = contentType;
    }

    if (searchQuery) {
      filter.$and = [
        { status },
        ...(contentType && contentType !== 'all' ? [{ contentType }] : []),
        {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { url: { $regex: searchQuery, $options: 'i' } },
            { display_url: { $regex: searchQuery, $options: 'i' } },
          ],
        },
      ];
    }

    const data = await Media.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await Media.countDocuments(filter);

    return formatResponse({ data, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function updateMedia(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      if (!id) return formatResponse(null, 'ID is required', 400);
      const updated = await Media.findByIdAndUpdate(id, updateData, {
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

export async function deleteMedia(req: Request): Promise<IResponse> {
  const getFileKeyFromUrl = (url: string) => {
    if (!url) return null;
    try {
      const urlParts = url.split('/');
      const key = urlParts[urlParts.length - 1];
      return key || null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  };
  return withDB(async () => {
    const { id } = await req.json();
    if (!id) return formatResponse(null, 'ID required', 400);
    const media = await Media.findById(id);
    const utapi = new UTApi();
    const fileKey = getFileKeyFromUrl(media.url);
    try {
      if (fileKey) {
        await utapi.deleteFiles(fileKey);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return formatResponse({ deletedCount: 0 }, 'Failed to delete', 500);
    }
    const deleted = await Media.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Deleted successfully', 200);
  });
}

/*



*/

```

here is example of api/v1/model.ts 
```
import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    delete_url: {
      type: String,
      trim: true,
    },
    display_url: {
      type: String,
      trim: true,
    },
    uploaderPlace: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    author_email: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'trash'],
      default: 'active',
    },
    contentType: {
      type: String,
      enum: ['video', 'image', 'pdf', 'docx', 'audio'],
      default: 'image',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.models.Media || mongoose.model('Media', mediaSchema);

```

here is example of dashboard/media/page.tsx
```
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  Video,
  ImageIcon,
  FileText,
  FileCode,
  Trash2,
  Plus,
  HardDrive,
  Ghost,
  Headphones,
  Volume2,
  Eye,
  Search,
  X,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Play,
  Calendar,
  Cloud,
  ExternalLink,
  AlertTriangle,
  ArchiveRestore,
  ListFilter,
  VideoIcon,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';

import { Tabs, TabsList, TabsTrigger } from './components/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useGetMediasQuery, useAddMediaMutation, useUpdateMediaMutation, useDeleteMediaMutation } from '@/redux/features/media/mediaSlice';

import imageCompression from 'browser-image-compression';
import { UploadButton } from '@/lib/uploadthing';
import { CustomLink } from '@/components/common/LinkButton';
import Link from 'next/link';

type MediaType = 'all' | 'video' | 'image' | 'pdf' | 'docx' | 'audio';
type MediaStatus = 'active' | 'trash';

interface MediaItem {
  _id: string;
  url: string;
  name?: string;
  contentType: MediaType;
  status: MediaStatus;
  uploaderPlace: string;
  createdAt: string;
}

export default function MediaDashboard() {
  const [activeTab, setActiveTab] = useState<MediaType>('all');
  const [activeStatus, setActiveStatus] = useState<MediaStatus>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetMediasQuery({
    page: currentPage,
    limit: pageSize,
    q: debouncedSearch,
    contentType: activeTab,
    status: activeStatus,
  });

  const [addMedia] = useAddMediaMutation();
  const [updateMedia] = useUpdateMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();

  const items = useMemo(() => response?.data || [], [response]);
  const totalItems = response?.total || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleUpdateStatus = async (id: string, newStatus: MediaStatus) => {
    setProcessingId(id);
    try {
      await updateMedia({ id, status: newStatus }).unwrap();
      toast.success(`Successfully ${newStatus === 'trash' ? 'Deleted' : 'Restored'}`);
    } catch {
      toast.error(`Failed to ${newStatus === 'trash' ? 'Deleted' : 'Restored'}`);
    } finally {
      setProcessingId(null);
    }
  };

  const initiateDelete = (item: MediaItem) => {
    setMediaToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!mediaToDelete) return;
    const id = mediaToDelete._id;
    setProcessingId(id);
    setIsDeleteDialogOpen(false);
    try {
      await deleteMedia({ id }).unwrap();
      toast.success('Deleted successfully');
    } catch {
      toast.error('Failed to Delete');
    } finally {
      setProcessingId(null);
      setMediaToDelete(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const toastId = toast.loading('uploading...');
    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const formData = new FormData();
      formData.append('image', compressedFile);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        await addMedia({ url: data.data.url, name: file.name, contentType: 'image', status: 'active', uploaderPlace: 'imageBB' }).unwrap();
        toast.update(toastId, { render: 'Successfully Uploaded', type: 'success', isLoading: false, autoClose: 2000 });
        setIsAddDialogOpen(false);
      }
    } catch {
      toast.update(toastId, { render: 'Failed to upload', type: 'error', isLoading: false, autoClose: 2000 });
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen p-2 bg-transparent text-white font-sans selection:bg-blue-500/30">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6">
        <header className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-sm p-4 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:bg-white/15">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter">
              Media
            </h1>
            <p className="text-xs text-gray-200/50 flex items-center gap-2 font-mono">
              <Cloud size={14} className="text-blue-400 animate-pulse" />
              Total: {totalItems} assets
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <CustomLink href="/dashboard/media/example/uploadthings" variant="outlineGlassy" size="sm">
              <LayoutGrid size={16} className="mr-2" />
              Example
            </CustomLink>
            <Button size="sm" variant="outlineWater" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={16} className={`mr-2 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Syncing...' : 'Refresh'}
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} variant="outlineGlassy" size="sm">
              <Plus size={18} className="" />
              Add
            </Button>
          </div>
        </header>

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-sm p-3 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4">
          <Tabs
            value={activeTab}
            onValueChange={v => {
              setActiveTab(v as MediaType);
              setCurrentPage(1);
            }}
            className="w-full lg:w-auto"
          >
            <TabsList className="bg-transparent h-12 p-1 rounded-lg gap-1">
              {[
                { id: 'all', label: 'All', icon: LayoutGrid },
                { id: 'image', label: 'Images', icon: ImageIcon },
                { id: 'video', label: 'Videos', icon: Video },
                { id: 'audio', label: 'Audio', icon: Headphones },
                { id: 'pdf', label: 'PDF', icon: FileText },
                { id: 'docx', label: 'Docs', icon: FileCode },
              ].map(tab => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="h-8 px-3 rounded-md flex items-center gap-1.5 text-white opacity-40 transition-all duration-300 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/30 backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] hover:opacity-100 has-[svg]:px-2.5 data-[state=active]:opacity-100"
                >
                  <tab.icon size={14} className="mr-2 hidden md:block" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-72 group border border-white/50 rounded-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-50 group-focus-within:text-white transition-colors" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-white/5 border-white/10 pl-10 h-8 rounded-lg focus:ring-white/20 text-sm placeholder:text-gray-50 text-white transition-all"
                placeholder="Search file signatures..."
              />
            </div>
            <div className="flex p-1 rounded-lg gap-2 w-full sm:w-auto">
              {['active', 'trash'].map(s => (
                <Button
                  key={s}
                  variant="outlineGlassy"
                  size="sm"
                  onClick={() => setActiveStatus(s as MediaStatus)}
                  className={`transition-all duration-300 border-white/20 ${activeStatus === s ? 'bg-white/20 opacity-100 shadow-lg' : 'opacity-40 hover:opacity-100'}`}
                >
                  {s === 'active' ? <HardDrive size={14} className="mr-2" /> : <Trash2 size={14} className="mr-2" />}
                  {s === 'active' ? 'Active' : 'Trash'}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <section className="min-h-[60vh] relative">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-6 py-40"
              >
                <div className="relative h-20 w-20">
                  <div className="absolute inset-0 border-4 border-white/10 border-t-white rounded-full animate-spin" />
                </div>
                <p className="text-xs font-mono text-gray-400 animate-pulse tracking-[0.5em] uppercase">Loading_Array_Data</p>
              </motion.div>
            ) : items.length > 0 ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
              >
                {items.map((item: MediaItem, idx: number) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative backdrop-blur-xl bg-white/10 rounded-sm overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl hover:bg-white/20 transition-all duration-500 flex flex-col h-full"
                  >
                    <div className="relative aspect-video bg-black/40 overflow-hidden">
                      {item.contentType === 'image' && (
                        <Image
                          src={item.url}
                          alt={item.name || 'asset'}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80"
                          unoptimized
                        />
                      )}
                      {item.contentType === 'video' && (
                        <div className="w-full h-full relative">
                          <video src={item.url} className="w-full h-full object-cover opacity-60" preload="metadata" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-2xl">
                              <Play size={20} className="text-white fill-white ml-1" />
                            </div>
                          </div>
                        </div>
                      )}
                      {item.contentType === 'audio' && (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-white/5">
                          <Volume2 size={48} className="text-white/20 animate-pulse" />
                        </div>
                      )}
                      {(item.contentType === 'pdf' || item.contentType === 'docx') && (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-white/5">
                          <FileText size={48} className="text-white/20" />
                        </div>
                      )}

                      {processingId === item._id && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-2">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                          <span className="text-[8px] font-mono text-white uppercase tracking-tighter">Syncing...</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-4 z-20">
                        <div className="flex gap-1 w-full">
                          <Button
                            size="sm"
                            variant="outlineGlassy"
                            className="min-w-1"
                            onClick={() => {
                              setPreviewMedia(item);
                              setIsPreviewDialogOpen(true);
                            }}
                          >
                            <Eye size={14} className="mr-1" />
                            Preview
                          </Button>
                          {activeStatus === 'active' ? (
                            <Button
                              size="sm"
                              disabled={!!processingId}
                              title="Preview"
                              variant="outlineFire"
                              className="min-w-1"
                              onClick={() => handleUpdateStatus(item._id, 'trash')}
                            >
                              <Trash2 size={16} />
                            </Button>
                          ) : (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                className="min-w-1"
                                variant="outlineGarden"
                                title="Restore"
                                disabled={!!processingId}
                                onClick={() => handleUpdateStatus(item._id, 'active')}
                              >
                                <ArchiveRestore size={16} />
                              </Button>
                              <Button
                                size="sm"
                                title="Delete"
                                variant="outlineFire"
                                className="min-w-1"
                                disabled={!!processingId}
                                onClick={() => initiateDelete(item)}
                              >
                                <X size={16} />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex-1 space-y-3 border-t border-white/5 bg-white/[0.02]">
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 rounded-sm bg-white/5 border border-white/10 flex-shrink-0">
                          <Cloud size={18} className="text-white/50" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm text-white/90 truncate group-hover:text-white transition-colors tracking-tight">
                            {item.name || 'Name Unavailable'}
                          </p>
                          <p className="text-[10px] text-gray-200/60 flex items-center gap-1 font-mono uppercase">
                            <Calendar size={12} className="opacity-50" />
                            {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center py-32 px-4"
              >
                <div className="max-w-md w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-sm p-16 shadow-2xl flex flex-col items-center text-center gap-8 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full" />
                    <div className="relative p-8 bg-white/5 rounded-full border border-white/20">
                      <Ghost className="w-20 h-20 text-white/20" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">No data found</h3>
                    <p className="text-xs text-gray-200/40 font-mono leading-relaxed">System scan complete: No records match the current filter parameters.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-16 border-t border-white/5">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-sm p-1.5 backdrop-blur-md">
              <div className="pl-3 pr-1 text-[10px] font-mono uppercase text-white/40 flex items-center gap-2">
                <ListFilter size={14} />
                View:
              </div>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="bg-transparent text-xs font-black text-white focus:outline-none cursor-pointer hover:text-blue-50 transition-colors py-1.5 px-2"
              >
                {[10, 20, 50, 100, 200].map(size => (
                  <option key={size} value={size} className="bg-slate-900 text-white">
                    {size} items
                  </option>
                ))}
              </select>
            </div>

            <nav className="flex items-center gap-4">
              <Button
                variant="outlineGlassy"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(prev => Math.max(1, prev - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="h-10 px-4 rounded-sm bg-white/5 text-white border border-white/50"
              >
                <ChevronLeft size={18} />
                Prev
              </Button>

              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-sm p-1 backdrop-blur-md">
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const pageNum = i + 1;
                  const isCurrent = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`min-w-[40px] h-8 rounded-sm text-[10px] font-black transition-all duration-500 ${
                        isCurrent ? 'bg-white/20 text-white shadow-lg border border-white/40' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {pageNum.toString().padStart(2, '0')}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outlineGlassy"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(prev => Math.min(totalPages, prev + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="h-10 px-4 rounded-sm bg-white/5 text-white border border-white/50"
              >
                Next
                <ChevronRight size={18} />
              </Button>
            </nav>
          </div>
        )}
      </motion.div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="backdrop-blur-xl mt-8 bg-white/10 border border-white/20 shadow-2xl max-w-xl p-0 overflow-hidden text-white">
          <DialogHeader className="p-4 pb-0 pl-6">
            <DialogTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter">
              Upload a new asset
            </DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-6 -mt-8">
            <div className="grid grid-cols-2 gap-4">
              <label className="p-2 border-2 border-dashed border-white/50 rounded-sm hover:border-white/80 hover:bg-white/5 cursor-pointer transition-all duration-500">
                <div className="flex flex-col items-center justify-center gap-1">
                  <ImageIcon className="w-12 h-12 text-white/80" />
                  <div className="text-center flex flex-col">
                    <p className="text-sm text-white">Image</p>
                    <small className="text-[8px] text-slate-50/50">Image BB</small>
                  </div>
                </div>
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
              <label className="p-2 border-2 border-dashed border-white/50 rounded-sm hover:border-white/80 hover:bg-white/5 cursor-pointer transition-all duration-500">
                <div className="flex flex-col items-center justify-center gap-1">
                  <VideoIcon className="w-12 h-12 text-white/80" />
                  <div className="text-center flex flex-col">
                    <p className="text-sm text-white">Video</p>
                    <small className="text-[8px] text-slate-50/50">YT Video</small>
                  </div>
                </div>
                {/* <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" /> */}
              </label>
              <div className="p-4 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-all group relative overflow-hidden">
                <UploadButton
                  endpoint={'imageUploader'}
                  onClientUploadComplete={res => {
                    if (res?.[0]) {
                      addMedia({ url: res[0].url, name: res[0].name, contentType: 'image' as MediaType, status: 'active' }).unwrap();
                      setIsAddDialogOpen(false);
                      toast.success(`Successfully Uploaded`);
                    }
                  }}
                  appearance={{
                    button:
                      'w-full bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase tracking-widest h-12 border border-white/20 rounded-sm transition-all text-white',
                    allowedContent: 'hidden',
                  }}
                />
                <div className="mt-3 text-center flex flex-col">
                  <span className="text-[9px] font-mono text-gray-200/40 group-hover:text-white transition-colors">Image</span>
                  <small className="text-[8px] text-slate-50/50">Upload Things</small>
                </div>
              </div>
              {['video', 'audio', 'pdf', 'docx'].map(type => (
                <div key={type} className="p-4 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-all group relative overflow-hidden">
                  <UploadButton
                    endpoint={type === 'docx' ? 'documentUploader' : type === 'pdf' ? 'pdfUploader' : type === 'video' ? 'videoUploader' : 'audioUploader'}
                    onClientUploadComplete={res => {
                      if (res?.[0]) {
                        addMedia({ url: res[0].url, name: res[0].name, contentType: type as MediaType, status: 'active' }).unwrap();
                        setIsAddDialogOpen(false);
                        toast.success(`Successfully Uploaded`);
                      }
                    }}
                    appearance={{
                      button:
                        'w-full bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase tracking-widest h-12 border border-white/20 rounded-sm transition-all text-white',
                      allowedContent: 'hidden',
                    }}
                  />
                  <div className="mt-3 text-center">
                    <span className="text-[9px] font-mono text-gray-200/40 group-hover:text-white transition-colors">{type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="backdrop-blur-xl mt-8 bg-white/10 border border-white/20 shadow-2xl max-w-md p-0 overflow-hidden text-white">
          <div className="p-10 flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 rounded-sm bg-rose-200 border border-white/20 flex items-center justify-center text-rose-500 animate-pulse">
              <AlertTriangle size={40} />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-rose-500 via-rose-300 to-rose-600 bg-clip-text text-transparent">
                Confirmation Delete?
              </DialogTitle>
              <span className="block text-sm">This procedure is irreversible.</span>
              <DialogDescription className="text-gray-200/50 text-xs font-mono uppercase leading-relaxed tracking-wider">
                <span className="text-white font-bold">
                  &quot;{mediaToDelete?.name?.length && mediaToDelete?.name?.length > 50 ? mediaToDelete?.name?.slice(50) : mediaToDelete?.name}&quot;
                </span>
                ?
              </DialogDescription>
            </div>
          </div>
          <DialogFooter className="p-2 bg-white/5 border-t border-white/10 flex flex-row gap-3 items-center justify-end">
            <Button onClick={() => setIsDeleteDialogOpen(false)} size="sm" variant="outlineGlassy">
              Abort
            </Button>
            <Button onClick={handleConfirmDelete} size="sm" variant="outlineFire">
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[1000px] mt-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl p-0 overflow-hidden text-white h-[80vh]">
          <DialogTitle className="sr-only">Object Stream Viewer</DialogTitle>
          <div className="relative bg-white/5 flex items-center justify-center">
            <ScrollArea className="w-full h-[60vh]">
              <div className="flex items-center justify-center min-h-[400px] w-full p-6 relative">
                {previewMedia?.contentType === 'image' && (
                  <Image src={previewMedia.url} alt={previewMedia.name || 'Images'} fill className="object-contain p-4" unoptimized />
                )}
                {previewMedia?.contentType === 'video' && (
                  <video src={previewMedia.url} controls autoPlay className="w-full h-full max-h-[75vh] rounded-sm shadow-2xl border border-white/10" />
                )}
                {previewMedia?.contentType === 'audio' && (
                  <div className="flex flex-col items-center gap-10 w-full py-24">
                    <Volume2 size={80} className="text-white/20 animate-bounce" />
                    <audio src={previewMedia.url} controls autoPlay className="w-full max-w-lg h-12 invert opacity-80" />
                  </div>
                )}
                {(previewMedia?.contentType === 'pdf' || previewMedia?.contentType === 'docx') && (
                  <iframe src={previewMedia.url} className="w-full h-[75vh] rounded-sm border border-white/10 bg-white/5 backdrop-blur-sm" />
                )}
              </div>
            </ScrollArea>
          </div>
          <div className="p-8 py-0 bg-white/5 backdrop-blur-2xl border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter uppercase">
                {previewMedia?.name || 'ASSET_SIGNATURE_UNKNOWN'}
              </h3>
              <p className="text-[10px] text-gray-200/40 font-mono truncate max-w-[400px]">URI: {previewMedia?.url}</p>
            </div>
            <div className="flex gap-4">
              <Button asChild variant="glassyInfo">
                <Link
                  href={previewMedia?.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                >
                  <ExternalLink size={14} /> Open
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

```

here is example of dashboard/media/components/tabs.tsx
```
'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn('flex flex-col gap-2', className)} {...props} />;
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      // Changed to transparent/cleaner background to let the triggers shine
      className={cn('inline-flex h-10 items-center justify-center rounded-lg p-1 gap-2', className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Base Layout & Glassy Styles
        'h-8 px-3 rounded-md flex items-center justify-center gap-1.5 text-sm font-medium text-white transition-all duration-300 cursor-pointer whitespace-nowrap',
        'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/30 backdrop-blur-xl shadow-lg shadow-blue-500/20',
        'opacity-40', // Dimmed when inactive

        // Hover States
        'hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] hover:opacity-100',

        // Active State (Replaced standard shadcn active logic with yours)
        'data-[state=active]:opacity-100 data-[state=active]:shadow-purple-500/40 data-[state=active]:border-white/60',

        // Icon/SVG handling
        "has-[svg]:px-2.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",

        // Accessibility
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 disabled:pointer-events-none disabled:opacity-20',

        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn('flex-1 outline-none mt-2', className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };

```
here is example of dashboard/media/example/imagebb/components/ImageUploadManager.tsx
```'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Plus, X, UploadCloud, Loader2, ImageIcon, Ghost, Search, CheckCircle2, Zap, ChevronLeft, ChevronRight, ImagesIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';

interface MediaItem {
  _id: string;
  name: string;
  url: string;
  status: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface InternalImageDialogProps {
  onImageToggle: (item: { url: string; name: string }) => void;
  selectedImages: { url: string; name: string }[];
}

const InternalImageVault = ({ onImageToggle, selectedImages }: InternalImageDialogProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading: isFetching,
    isFetching: isRefetching,
  } = useGetMediasQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    q: debouncedSearch,
    contentType: 'image',
    status: 'active',
  }) as {
    data: MediaResponse | undefined;
    isLoading: boolean;
    isFetching: boolean;
  };

  const [addMedia, { isLoading: isAdding }] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableImages = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLocal(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const formData = new FormData();
      formData.append('image', compressedFile);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        await addMedia({
          url: data.data.url,
          name: file.name,
          contentType: 'image',
          uploaderPlace: 'imageBB',
          status: 'active',
        }).unwrap();
        toast.success('Image successfully uploaded');
        onImageToggle({ url: data.data.url, name: file.name });
      }
    } catch {
      toast.error('Image upload failed');
    } finally {
      setIsUploadingLocal(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-[150px] rounded-sm overflow-hidden bg-white/2 shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/5 bg-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 -mt-1">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH ASSET VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle> </DialogTitle>
            <DialogDescription> </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/60">Loading...</span>
            </div>
          ) : availableImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableImages.map((item, idx) => {
                  const isSelected = selectedImages.some(img => img.url === item.url);
                  return (
                    <motion.div
                      key={item.url}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        delay: idx * 0.03,
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                      }}
                      className="flex flex-col gap-3 group"
                    >
                      <div
                        onClick={() => onImageToggle({ url: item.url, name: item.name })}
                        className={`relative aspect-square rounded-sm overflow-hidden cursor-pointer transition-all duration-500 
                          ${isSelected ? 'scale-[0.98] shadow-[0_0_40px_rgba(99,102,241,0.3)]' : 'hover:scale-[1.02] shadow-2xl'}
                        `}
                      >
                        <Image
                          src={item.url}
                          fill
                          alt={item.name || 'Gallery Image'}
                          className={`object-cover transition-transform duration-1000 ease-out border border-white/40 rounded-sm 
                            ${isSelected ? 'scale-110' : 'group-hover:scale-110'}
                            `}
                          unoptimized
                        />

                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[3px] flex items-center justify-center overflow-hidden border border-white/60 rounded-sm"
                            >
                              <motion.div
                                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                                transition={{ type: 'spring', damping: 12 }}
                                className="bg-white text-indigo-600 rounded-sm p-4 shadow-2xl"
                              >
                                <CheckCircle2 className="w-8 h-8" />
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="absolute inset-0 pointer-events-none border-[1px] border-white/10 rounded-sm" />
                      </div>

                      <div className="-mt-1 flex items-center justify-start gap-2 px-1">
                        <ImageIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-white/40'}`} />
                        <h3
                          className={`text-sm font-medium transition-colors duration-300 truncate w-full
                            ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}
                          `}
                        >
                          {item.name || 'Untitled Asset'}
                        </h3>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 opacity-30 space-y-6">
              <Ghost className="w-24 h-24 animate-bounce" />
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase ">Ops! Nothing was found!</h3>
                <p className="text-[10px] font-bold uppercase mt-3">Please Upload a New Image</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/5 bg-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-5 h-8 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[11px] text-white">{currentPage}</span>
            <span className="text-[10px] text-white/20">/</span>
            <span className="text-[11px] text-white/60">{totalPages}</span>
          </div>

          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>

          <div className="hidden sm:block ml-4">
            <p className="text-sm text-white/60 ">Total : {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploadingLocal || isAdding} variant="outlineGlassy" size="sm">
            {isUploadingLocal || isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {isAdding || isUploadingLocal ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function ImageUploadManager({
  value,
  onChange,
  label = 'Images',
}: {
  value: { url: string; name: string }[];
  onChange: (val: { url: string; name: string }[]) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleImage = (item: { url: string; name: string }) => {
    const exists = value.some(v => v.url === item.url);
    if (exists) {
      onChange(value.filter(v => v.url !== item.url));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <div className="space-y-4 w-full h-full">
      <div className="flex items-center justify-between px-1 flex-col md:flex-row">
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-start gap-2">
            <ImagesIcon className="w-3.5 h-3.5" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
          </div>
          <p className="text-[8px] font-bold tracking-widest text-white/60">{value.length} Assets Linked</p>
        </div>

        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <AnimatePresence>
            {value.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Button variant="outlineFire" size="sm" onClick={() => onChange([])}>
                  <X className="w-3.5 h-3.5" /> Remove all
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outlineGlassy" size="sm" className="min-w-1">
                <Plus className="w-3.5 h-3.5" /> SELECT
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-transparent p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white mt-4 border-white/50 border rounded-sm">
              <InternalImageVault selectedImages={value} onImageToggle={toggleImage} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <ScrollArea className="w-full h-[300px]">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 p-8 rounded-sm bg-white/2 border border-white/50 backdrop-blur-3xl min-h-[20vh] transition-all">
          <AnimatePresence mode="popLayout">
            {value.length > 0 ? (
              value.map((item, idx) => (
                <motion.div
                  key={item.url}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="flex flex-col gap-3 group"
                >
                  <div className="relative aspect-square rounded-sm bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-2xl overflow-hidden group-hover:border-indigo-500/30 transition-all duration-500">
                    <Image src={item.url} fill alt={item.name} className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                    <div className="absolute inset-0 bg-black/60 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        type="button"
                        onClick={() => onChange(value.filter(u => u.url !== item.url))}
                        className="p-3 cursor-pointer rounded-sm bg-rose-500/20 border border-rose-500/50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-300 transform scale-90 group-hover:scale-100 min-w-1"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <Zap className="absolute -top-1 -right-1 w-4 h-4 text-indigo-500/40 animate-pulse pointer-events-none z-10" />
                  </div>
                  <div className="flex items-center gap-2 px-1 opacity-70 group-hover:opacity-100 transition-opacity overflow-hidden">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="text-[11px] font-medium text-white/80 truncate">{item.name || 'Untitled'}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-10 gap-6">
                <div className="flex gap-4">
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -10, 0],
                        boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)'],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.5,
                      }}
                      className="w-16 h-16 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center"
                    >
                      <ImageIcon className="w-8 h-8 text-white/10" />
                    </motion.div>
                  ))}
                </div>
                <div className="text-center space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">No Images Selected</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Click here to Select one</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}


```
here is example of dashboard/media/example/imagebb/components/ImageUploadManagerSingle.tsx
```
'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, UploadCloud, Loader2, ImageIcon, Ghost, RefreshCcw, Search, CheckCircle2, Zap, ChevronLeft, ChevronRight, Wallpaper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';

interface MediaItem {
  _id: string;
  name: string;
  url: string;
  status: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface InternalImageDialogProps {
  onImageSelect: ({ name, url }: { name: string; url: string }) => void;
  selectedImage: string;
}

const InternalImageVault = ({ onImageSelect, selectedImage }: InternalImageDialogProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading: isFetching,
    isFetching: isRefetching,
  } = useGetMediasQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    q: debouncedSearch,
    contentType: 'image',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia, { isLoading: isAdding }] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableImages = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLocal(true);
    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const formData = new FormData();
      formData.append('image', compressedFile);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        await addMedia({
          url: data.data.url,
          name: file.name,
          contentType: 'image',
          uploaderPlace: 'imageBB',
          status: 'active',
        }).unwrap();
        toast.success('Image successfully uploaded');
        onImageSelect({ name: file.name, url: data.data.url });
      }
    } catch {
      toast.error('Image upload failed');
    } finally {
      setIsUploadingLocal(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-[150px] rounded-sm overflow-hidden bg-white/2 shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/5 bg-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 -mt-1">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH ASSET VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle> </DialogTitle>
            <DialogDescription> </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/60">Loading...</span>
            </div>
          ) : availableImages.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableImages.map((item, idx) => {
                  const isSelected = selectedImage === item.url;
                  return (
                    <motion.div
                      key={item.url}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        delay: idx * 0.03,
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                      }}
                      className="flex flex-col gap-3 group "
                    >
                      <div
                        onClick={() => onImageSelect({ name: item.name, url: item.url })}
                        className={`relative aspect-square rounded-sm overflow-hidden cursor-pointer transition-all duration-500 
          ${isSelected ? ' scale-[0.98] shadow-[0_0_40px_rgba(99,102,241,0.3)]' : 'hover:scale-[1.02] shadow-2xl'}
        `}
                      >
                        <Image
                          src={item.url}
                          fill
                          alt={item.name || 'Gallery Image'}
                          className={`object-cover transition-transform duration-1000 ease-out  border border-white/40 rounded-sm 
                            ${isSelected ? 'scale-110' : 'group-hover:scale-110 '}
                            `}
                          unoptimized
                        />

                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[3px] flex items-center justify-center overflow-hidden  border border-white/60 rounded-sm"
                            >
                              <motion.div
                                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                                transition={{ type: 'spring', damping: 12 }}
                                className="bg-white text-indigo-600 rounded-sm p-4 shadow-2xl "
                              >
                                <CheckCircle2 className="w-8 h-8" />
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="absolute inset-0 pointer-events-none border-[1px] border-white/10 rounded-sm" />
                      </div>

                      <div className="-mt-2 flex items-center justify-start gap-2">
                        <ImageIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-white/40'}`} />
                        <h3
                          className={`text-sm font-medium transition-colors duration-300 truncate w-full
          ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}
        `}
                        >
                          {item.name || 'Untitled Name'}
                        </h3>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-30 space-y-6">
              <Ghost className="w-24 h-24 animate-bounce" />
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase ">Ops! Nothing was found!</h3>
                <p className="text-[10px] font-bold uppercase mt-3">Please Upload a New Image</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/5 bg-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-5 h-8 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[11px] text-white">{currentPage}</span>
            <span className="text-[10px] text-white/20">/</span>
            <span className="text-[11px] text-white/60">{totalPages}</span>
          </div>

          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>

          <div className="hidden sm:block ml-4">
            <p className="text-sm text-white/60 ">Total : {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploadingLocal || isAdding} variant="outlineGlassy" size="sm">
            {isUploadingLocal || isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {isAdding || isUploadingLocal ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function ImageUploadManagerSingle({
  value,
  onChange,
  label = 'Image',
}: {
  value: { name: string; url: string };
  onChange: (val: { name: string; url: string }) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 w-full h-full ">
      <div className="flex items-center justify-between px-1">
        <div className="w-full flex items-start justify-start gap-2">
          <Wallpaper className="w-3.5 h-3.5" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
        </div>
        <AnimatePresence>
          {value.name && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Button
                variant="outlineGlassy"
                size="sm"
                onClick={e => {
                  e.stopPropagation();
                  onChange({ name: '', url: '' });
                }}
              >
                <X className="w-3.5 h-3.5" /> Remove
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full h-[315px] aspect-[16/9] md:aspect-[21/9] rounded-sm backdrop-blur-3xl transition-all duration-700 cursor-pointer overflow-hidden flex flex-col items-center justify-center border border-white/50 hover:border-indigo-500/30 bg-white/2">
            {value.name ? (
              <div className="">
                <Image
                  src={value.url}
                  fill
                  alt="Current Selection"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  unoptimized
                />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-sm bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white"
                  >
                    <RefreshCcw className="w-5 h-5 animate-[spin_4s_linear_infinite]" />
                    REPLACE ASSET
                  </motion.div>
                </div>
                <div className="absolute bottom-1 left-1 flex items-center justify-start gap-2">
                  <ImageIcon className={`w-3.5 h-3.5 text-white/80 bg-gray-800/50`} />
                  <h3 className={`text-sm font-medium truncate w-full`}>{value.name || 'Untitled Name'}</h3>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1 * 0.5,
                  }}
                  className="w-16 h-16 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center"
                >
                  <ImageIcon className="w-8 h-8 text-white/10" />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">No Image Selected</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Click here to Select one</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white mt-4 border-white/50 border rounded-sm">
          <InternalImageVault
            selectedImage={value.url}
            onImageSelect={val => {
              onChange({ name: val.name, url: val.url });
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

```
here is example of dashboard/media/example/imagebb/page.tsx
```
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Database, LayoutGrid, Upload, VideoIcon } from 'lucide-react';

import { CustomLink } from '@/components/common/LinkButton';
import { Button } from '@/components/ui/button';

import ImageUploadManagerSingle from './components/ImageUploadManagerSingle';
import ImageUploadManager from './components/ImageUploadManager';

type TabType = 'image';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ElementType;
}

const tabs: TabConfig[] = [{ id: 'image', label: 'Image', icon: ImageIcon }];

export default function AssetManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('image');

  const [singleImage, setSingleImage] = useState<{ url: string; name: string }>({ url: '', name: '' });
  const [multipleImages, setMultipleImages] = useState<{ url: string; name: string }[]>([]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto relative z-10 px-4 py-8 md:py-12">
        <header className="backdrop-blur-xl bg-white/10 border border-white/40 rounded-xl p-4 shadow-2xl flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 transition-all ">
          <nav className="w-full lg:w-auto overflow-x-auto">
            <div className="flex items-center gap-2 p-1 bg-transparent h-12 rounded-lg">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant="outlineGlassy"
                    size="sm"
                    className={`
                      ${isActive ? 'opacity-100  scale-[1.02] ' : 'opacity-40 hover:opacity-100 hover:border-white/50'}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-bold text-xs uppercase tracking-tight">{tab.label}</span>
                  </Button>
                );
              })}
            </div>
          </nav>
          <div className=" flex items-end justify-end gap-2">
            <CustomLink href="/dashboard/media/example/uploadthings" variant="outlineGlassy">
              <Upload size={16} className="" />
              Uploadthings
            </CustomLink>
            <CustomLink href="/dashboard/media/example/yt-videos" variant="outlineGlassy">
              <VideoIcon size={16} className="" />
              YT Video
            </CustomLink>
            <CustomLink href="/dashboard/media" variant="outlineGlassy">
              <LayoutGrid size={16} className="mr-2" />
              MEDIA
            </CustomLink>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <section className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <Database className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter">
                    Single Asset
                  </h3>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/60 p-8 rounded-xl shadow-2xl transition-all duration-500 hover:bg-white/15 min-h-[340px]">
                {activeTab === 'image' && (
                  <ImageUploadManagerSingle
                    value={singleImage}
                    onChange={val => {
                      setSingleImage({ url: val.url, name: val.name });
                    }}
                  />
                )}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <LayoutGrid className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter">
                    Multiple Asset
                  </h3>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/60 p-8 rounded-xl shadow-2xl transition-all duration-500 hover:bg-white/15 min-h-[340px]">
                {activeTab === 'image' && (
                  <ImageUploadManager
                    value={multipleImages}
                    onChange={val => {
                      setMultipleImages([...val]);
                    }}
                  />
                )}
              </div>
            </section>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

```
here is example of dashboard/media/example/uploadthings/components/AudioUploadManager.tsx
```
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { X, Loader2, Ghost, Search, CheckCircle2, Zap, ChevronLeft, ChevronRight, Plus, Files, Eye, Volume1Icon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UploadButton } from '@/lib/uploadthing';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';
import Link from 'next/link';
import { FaFileAudio } from 'react-icons/fa';

interface MediaItem {
  _id: string;
  name: string;
  url: string;
  status: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface InternalAudioVaultProps {
  onAudioToggle: (item: { url: string; name: string }) => void;
  selectedAudios: { url: string; name: string }[];
}

const InternalAudioVault = ({ onAudioToggle, selectedAudios }: InternalAudioVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading: isFetching,
    isFetching: isRefetching,
  } = useGetMediasQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    q: debouncedSearch,
    contentType: 'audio',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availableAudios = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

  const handleUploadComplete = async (res: { url: string; name: string }[]) => {
    if (res && res[0]) {
      try {
        await addMedia({
          url: res[0].url,
          name: res[0].name || 'Audio_Document',
          contentType: 'audio',
          status: 'active',
        }).unwrap();
        toast.success('Successfully Uploaded');
        onAudioToggle({ url: res[0].url, name: res[0].name || 'Audio_Document' });
      } catch {
        toast.error('Failed to Uploaded');
      } finally {
        setIsUploadingLocal(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-3xl rounded-sm overflow-hidden shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/10 bg-white/5 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH DOCUMENT VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle> </DialogTitle>
            <DialogDescription> </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-6 h-6 text-indigo-500/40" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Scanning Archive...</span>
            </div>
          ) : availableAudios.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableAudios.map((item, idx) => {
                  const isSelected = selectedAudios.some(v => v.url === item.url);
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
                      onClick={() => onAudioToggle({ url: item.url, name: item.name })}
                      className={`relative aspect-[3/4] rounded-sm border cursor-pointer transition-all duration-500 group
                        ${isSelected ? 'border-indigo-500 scale-95 shadow-[0_0_40px_rgba(99,102,241,0.3)]' : 'border-white/5 hover:border-white/20 hover:scale-105 shadow-xl'}
                      `}
                    >
                      <div className="absolute inset-0 bg-white/5 flex flex-col items-center justify-center p-4">
                        <FaFileAudio className="w-24 h-24 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />
                        <div className="mt-4 text-center w-full">
                          <h3
                            className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 truncate w-full ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}
                                                `}
                          >
                            {item.name || 'Untitled Audio'}
                          </h3>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center backdrop-blur-[2px]">
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="bg-indigo-500 text-white rounded-sm p-2 shadow-2xl"
                          >
                            <CheckCircle2 className="w-6 h-6" />
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 opacity-20 space-y-6">
              <Ghost className="w-20 h-20 animate-bounce" />
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase tracking-[0.4em] text-white">Archive Empty</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-white/60">Zero Audio signatures detected</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 border-white/20 hover:bg-white/10"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-5 h-9 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[11px] font-black text-white">{currentPage}</span>
            <span className="text-[10px] font-black text-white/20">/</span>
            <span className="text-[11px] font-black text-white/60">{totalPages}</span>
          </div>

          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 border-white/20 hover:bg-white/10"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>

          <div className="hidden sm:block ml-4">
            <p className="text-sm text-white/60">Total : {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <UploadButton
            endpoint="audioUploader"
            appearance={{
              button: `bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-white/30 text-white backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 h-8 rounded-md gap-1 max-w-[100px] text-sm`,
              allowedContent: 'hidden',
            }}
            content={{
              button({ ready }) {
                if (isUploadingLocal) return <Loader2 className="w-4 h-4 animate-spin" />;
                return (
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>{ready ? 'Upload' : 'Connecting...'}</span>
                  </div>
                );
              },
            }}
            onUploadBegin={() => setIsUploadingLocal(true)}
            onClientUploadComplete={handleUploadComplete}
            onUploadError={err => {
              setIsUploadingLocal(false);
              toast.error(err.message);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function AudioUploadManager({
  value,
  onChange,
  label = 'Audio Documents',
}: {
  value: { url: string; name: string }[];
  onChange: (val: { url: string; name: string }[]) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAudio = (item: { url: string; name: string }) => {
    const exists = value.some(v => v.url === item.url);
    if (exists) {
      onChange(value.filter(v => v.url !== item.url));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <div className="space-y-6 w-full group/container">
      <div className="flex items-center justify-between px-2 flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-start gap-2">
            <Files className="w-3.5 h-3.5" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
          </div>
          <p className="text-[8px] font-bold tracking-widest text-white/60">{value.length} Selected</p>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {value.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Button variant="outlineFire" size="sm" onClick={() => onChange([])}>
                  <X className="w-3.5 h-3.5" /> Remove all
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outlineGlassy" size="sm">
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                Select
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl bg-transparent p-0 shadow-none text-white overflow-hidden border border-white/50 rounded-sm mt-8">
              <InternalAudioVault selectedAudios={value} onAudioToggle={toggleAudio} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="min-h-[250px] rounded-sm p-8 border border-white/10 backdrop-blur-3xl transition-all duration-500 hover:border-white/20">
        <ScrollArea className="w-full h-full">
          {value.length > 0 ? (
            <div className="grid grid-cols-1 gap-1 pb-4">
              <AnimatePresence mode="popLayout">
                {value.map((item, index) => (
                  <motion.div
                    key={item.url}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative transition-all duration-500 flex flex-col items-center justify-center shadow-2xl border border-white/30 rounded-sm pl-2"
                  >
                    <div className="w-full flex gap-1 items-center justify-start">
                      <div className="text-white text-sm">{index + 1}. </div>
                      <Volume1Icon className="w-6 h-6 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />

                      <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase truncate w-full px-2">{item.name || 'AUDIO_DOC'}</span>
                      <div className="flex items-center justify-center gap-1 hover:underline">
                        <Eye className="w-4 h-4" />
                        <Link href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-50">
                          Preview
                        </Link>
                      </div>
                      <Button
                        onClick={() => onChange(value.filter(v => v.url !== item.url))}
                        variant="ghost"
                        size="sm"
                        className="min-w-1 h-7 w-7 text-rose-500/80"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10 gap-6">
              <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -10, 0],
                      boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)'],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.5,
                    }}
                    className="w-16 h-20 rounded-sm bg-white/20 border border-white/10 flex items-center justify-center"
                  >
                    <FaFileAudio className="w-24 h-24 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />
                  </motion.div>
                ))}
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-white/90">No Audio Selected</p>
                <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Awaiting Document Selection</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

```
here is example of dashboard/media/example/uploadthings/components/AudioUploadManagerSingle.tsx
```
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { X, Loader2, Ghost, RefreshCcw, Search, CheckCircle2, Zap, FileText, Files, ChevronLeft, ChevronRight, FilePlus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaFileAudio } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UploadButton } from '@/lib/uploadthing';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';

interface MediaItem {
  _id: string;
  name: string;
  url: string;
  status: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface InternalAudioVaultProps {
  onAudioSelect: (val: { name: string; url: string }) => void;
  selectedUrl: string;
}

const InternalAudioVault = ({ onAudioSelect, selectedUrl }: InternalAudioVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading: isFetching,
    isFetching: isRefetching,
  } = useGetMediasQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    q: debouncedSearch,
    contentType: 'audio',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availableAudios = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

  const handleUploadComplete = async (res: { url: string; name: string }[]) => {
    if (res && res[0]) {
      try {
        await addMedia({
          url: res[0].url,
          name: res[0].name || 'AUDIO_Source',
          contentType: 'audio',
          status: 'active',
        }).unwrap();
        toast.success('Successfully Uploaded');
        onAudioSelect({ name: res[0].name, url: res[0].url });
      } catch {
        toast.error('Failed to Uploaded');
      } finally {
        setIsUploadingLocal(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-3xl rounded-sm overflow-hidden shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/50 bg-white/2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH AUDIO VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle> </DialogTitle>
            <DialogDescription> </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/60">Initializing Archive...</span>
            </div>
          ) : availableAudios.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableAudios.map((item, idx) => {
                  const isSelected = selectedUrl === item.url;
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
                      onClick={() => onAudioSelect({ name: item.name, url: item.url })}
                      className="group flex flex-col gap-3"
                    >
                      <div
                        className={`relative aspect-[3/4] rounded-sm overflow-hidden border cursor-pointer transition-all duration-500 
                        ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-black' : 'border-white/10 hover:border-white/30'}
                      `}
                      >
                        <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                          <FaFileAudio className="w-12 h-12 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />
                        </div>

                        {isSelected && (
                          <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center backdrop-blur-[2px]">
                            <motion.div
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="bg-indigo-500 text-white rounded-sm p-3 shadow-2xl"
                            >
                              <CheckCircle2 className="w-6 h-6" />
                            </motion.div>
                          </div>
                        )}
                      </div>
                      <div className="-mt-1 flex items-center justify-start gap-2">
                        <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-white/40'}`} />
                        <h3
                          className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 truncate w-full
                            ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}
                          `}
                        >
                          {item.name || 'Untitled Audio'}
                        </h3>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-30 space-y-6">
              <Ghost className="w-24 h-24 animate-bounce" />
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase text-white">No Assets Found</h3>
                <p className="text-[10px] font-bold uppercase mt-3 text-white/60 tracking-widest">Awaiting new audio uploads</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 border-white/20 hover:bg-white/10"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-5 h-9 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[11px] font-black text-white">{currentPage}</span>
            <span className="text-[10px] font-black text-white/20">/</span>
            <span className="text-[11px] font-black text-white/60">{totalPages}</span>
          </div>

          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 border-white/20 hover:bg-white/10"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>

          <div className="hidden sm:block ml-4">
            <p className="text-sm text-white/60">Total : {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <UploadButton
            endpoint="audioUploader"
            appearance={{
              button: `bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-white/30 text-white backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 h-8 rounded-md gap-1 max-w-[100px] text-sm`,
              allowedContent: 'hidden',
            }}
            content={{
              button({ ready }) {
                if (isUploadingLocal) return <Loader2 className="w-4 h-4 animate-spin" />;
                return (
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>{ready ? 'Upload' : 'Connecting...'}</span>
                  </div>
                );
              },
            }}
            onUploadBegin={() => setIsUploadingLocal(true)}
            onClientUploadComplete={handleUploadComplete}
            onUploadError={err => {
              setIsUploadingLocal(false);
              toast.error(err.message);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function AudioUploadManagerSingle({
  value,
  onChange,
  label = 'AUDIO',
}: {
  value: { name: string; url: string };
  onChange: (val: { name: string; url: string }) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 w-full group/container">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Files className="w-3.5 h-3.5 text-indigo-50" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
        </div>
        <AnimatePresence>
          {value?.url && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Button variant="outlineFire" size="sm" onClick={() => onChange({ name: '', url: '' })}>
                <X className="w-3.5 h-3.5" /> Remove
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-video rounded-sm backdrop-blur-3xl transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center justify-center border border-white/10 hover:border-indigo-500/40 bg-white/[0.02]">
            {value?.url ? (
              <div className="w-full h-full relative flex flex-col items-center justify-center bg-white/[0.03]">
                <FaFileAudio className="w-24 h-24 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-sm bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white"
                  >
                    <RefreshCcw className="w-4 h-4 animate-[spin_4s_linear_infinite]" />
                    CHANGE ASSET
                  </motion.div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-sm">
                  <FileText className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] font-bold text-white tracking-wider truncate flex-1">{value.name || 'ACTIVE_AUDIO'}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1 * 0.5,
                  }}
                  className="w-16 h-16 rounded-sm bg-white/20 border border-white/10 flex items-center justify-center"
                >
                  <FilePlus className="w-8 h-8 text-white/50" />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">No audio Selected</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Click here to Select one</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent border border-white/50 p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white mt-8">
          <InternalAudioVault
            selectedUrl={value?.url}
            onAudioSelect={val => {
              onChange(val);
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

```
here is example of dashboard/media/example/uploadthings/components/DocxUploadManager.tsx
```
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { X, Loader2, Ghost, Search, CheckCircle2, Zap, ChevronLeft, ChevronRight, Plus, Files, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UploadButton } from '@/lib/uploadthing';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';
import Link from 'next/link';
import { FaFileWord } from 'react-icons/fa';

interface MediaItem {
  _id: string;
  name: string;
  url: string;
  status: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface InternalDocxVaultProps {
  onDocxToggle: (item: { url: string; name: string }) => void;
  selectedDocxs: { url: string; name: string }[];
}

const InternalDocxVault = ({ onDocxToggle, selectedDocxs }: InternalDocxVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading: isFetching,
    isFetching: isRefetching,
  } = useGetMediasQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    q: debouncedSearch,
    contentType: 'docx',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availableDocxs = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

  const handleUploadComplete = async (res: { url: string; name: string }[]) => {
    if (res && res[0]) {
      try {
        await addMedia({
          url: res[0].url,
          name: res[0].name || 'DOCX_Document',
          contentType: 'docx',
          status: 'active',
        }).unwrap();
        toast.success('Successfully Uploaded');
        onDocxToggle({ url: res[0].url, name: res[0].name || 'DOCX_Document' });
      } catch {
        toast.error('Failed to Uploaded');
      } finally {
        setIsUploadingLocal(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-3xl rounded-sm overflow-hidden shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/10 bg-white/5 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH DOCUMENT VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle> </DialogTitle>
            <DialogDescription> </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-6 h-6 text-indigo-500/40" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Scanning Archive...</span>
            </div>
          ) : availableDocxs.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableDocxs.map((item, idx) => {
                  const isSelected = selectedDocxs.some(v => v.url === item.url);
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
                      onClick={() => onDocxToggle({ url: item.url, name: item.name })}
                      className={`relative aspect-[3/4] rounded-sm border cursor-pointer transition-all duration-500 group
                        ${isSelected ? 'border-indigo-500 scale-95 shadow-[0_0_40px_rgba(99,102,241,0.3)]' : 'border-white/5 hover:border-white/20 hover:scale-105 shadow-xl'}
                      `}
                    >
                      <div className="absolute inset-0 bg-white/5 flex flex-col items-center justify-center p-4">
                        <FaFileWord className="w-24 h-24 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />
                        <div className="mt-4 text-center w-full">
                          <h3
                            className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 truncate w-full ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}
                                                `}
                          >
                            {item.name || 'Untitled DOCX'}
                          </h3>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center backdrop-blur-[2px]">
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="bg-indigo-500 text-white rounded-sm p-2 shadow-2xl"
                          >
                            <CheckCircle2 className="w-6 h-6" />
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 opacity-20 space-y-6">
              <Ghost className="w-20 h-20 animate-bounce" />
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase tracking-[0.4em] text-white">Archive Empty</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-white/60">Zero DOCX signatures detected</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 border-white/20 hover:bg-white/10"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-5 h-9 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[11px] font-black text-white">{currentPage}</span>
            <span className="text-[10px] font-black text-white/20">/</span>
            <span className="text-[11px] font-black text-white/60">{totalPages}</span>
          </div>

          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 border-white/20 hover:bg-white/10"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>

          <div className="hidden sm:block ml-4">
            <p className="text-sm text-white/60">Total : {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <UploadButton
            endpoint="docxUploader"
            appearance={{
              button: `bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-white/30 text-white backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 h-8 rounded-md gap-1 max-w-[100px] text-sm`,
              allowedContent: 'hidden',
            }}
            content={{
              button({ ready }) {
                if (isUploadingLocal) return <Loader2 className="w-4 h-4 animate-spin" />;
                return (
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>{ready ? 'Upload' : 'Connecting...'}</span>
                  </div>
                );
              },
            }}
            onUploadBegin={() => setIsUploadingLocal(true)}
            onClientUploadComplete={handleUploadComplete}
            onUploadError={err => {
              setIsUploadingLocal(false);
              toast.error(err.message);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function DocxUploadManager({
  value,
  onChange,
  label = 'DOCX Documents',
}: {
  value: { url: string; name: string }[];
  onChange: (val: { url: string; name: string }[]) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDocx = (item: { url: string; name: string }) => {
    const exists = value.some(v => v.url === item.url);
    if (exists) {
      onChange(value.filter(v => v.url !== item.url));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <div className="space-y-6 w-full group/container">
      <div className="flex items-center justify-between px-2 flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-start gap-2">
            <Files className="w-3.5 h-3.5" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
          </div>
          <p className="text-[8px] font-bold tracking-widest text-white/60">{value.length} Selected</p>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {value.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Button variant="outlineFire" size="sm" onClick={() => onChange([])}>
                  <X className="w-3.5 h-3.5" /> Remove all
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outlineGlassy" size="sm">
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                Select
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl bg-transparent p-0 shadow-none text-white overflow-hidden border border-white/50 rounded-sm mt-8">
              <InternalDocxVault selectedDocxs={value} onDocxToggle={toggleDocx} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="min-h-[250px] rounded-sm p-8 border border-white/10 backdrop-blur-3xl transition-all duration-500 hover:border-white/20">
        <ScrollArea className="w-full h-full">
          {value.length > 0 ? (
            <div className="grid grid-cols-1 gap-1 pb-4">
              <AnimatePresence mode="popLayout">
                {value.map((item, index) => (
                  <motion.div
                    key={item.url}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative transition-all duration-500 flex flex-col items-center justify-center shadow-2xl border border-white/30 rounded-sm pl-2"
                  >
                    <div className="w-full flex gap-1 items-center justify-start">
                      <div className="text-white text-sm">{index + 1}. </div>
                      <FaFileWord className="w-6 h-6 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />

                      <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase truncate w-full px-2">{item.name || 'DOCX_DOC'}</span>
                      <div className="flex items-center justify-center gap-1 hover:underline">
                        <Eye className="w-4 h-4" />
                        <Link href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-50">
                          Preview
                        </Link>
                      </div>
                      <Button
                        onClick={() => onChange(value.filter(v => v.url !== item.url))}
                        variant="ghost"
                        size="sm"
                        className="min-w-1 h-7 w-7 text-rose-500/80"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10 gap-6">
              <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -10, 0],
                      boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)'],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.5,
                    }}
                    className="w-16 h-20 rounded-sm bg-white/20 border border-white/10 flex items-center justify-center"
                  >
                    <FaFileWord className="w-24 h-24 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />
                  </motion.div>
                ))}
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-white/90">No DOCX Selected</p>
                <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Awaiting Document Selection</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

```
here is example of dashboard/media/example/uploadthings/components/DocxUploadManagerSingle.tsx
```
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { X, Loader2, Ghost, RefreshCcw, Search, CheckCircle2, Zap, FileText, Files, ChevronLeft, ChevronRight, FilePlus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaFileWord } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UploadButton } from '@/lib/uploadthing';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';

interface MediaItem {
  _id: string;
  name: string;
  url: string;
  status: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface InternalDocxVaultProps {
  onDocxSelect: (val: { name: string; url: string }) => void;
  selectedUrl: string;
}

const InternalDocxVault = ({ onDocxSelect, selectedUrl }: InternalDocxVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading: isFetching,
    isFetching: isRefetching,
  } = useGetMediasQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    q: debouncedSearch,
    contentType: 'docx',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availableDocxs = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

  const handleUploadComplete = async (res: { url: string; name: string }[]) => {
    if (res && res[0]) {
      try {
        await addMedia({
          url: res[0].url,
          name: res[0].name || 'DOCX_Source',
          contentType: 'docx',
          status: 'active',
        }).unwrap();
        toast.success('Successfully Uploaded');
        onDocxSelect({ name: res[0].name, url: res[0].url });
      } catch {
        toast.error('Failed to Uploaded');
      } finally {
        setIsUploadingLocal(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-3xl rounded-sm overflow-hidden shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/50 bg-white/2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH DOCX VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle> </DialogTitle>
            <DialogDescription> </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/60">Initializing Archive...</span>
            </div>
          ) : availableDocxs.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableDocxs.map((item, idx) => {
                  const isSelected = selectedUrl === item.url;
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
                      onClick={() => onDocxSelect({ name: item.name, url: item.url })}
                      className="group flex flex-col gap-3"
                    >
                      <div
                        className={`relative aspect-[3/4] rounded-sm overflow-hidden border cursor-pointer transition-all duration-500 
                        ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-black' : 'border-white/10 hover:border-white/30'}
                      `}
                      >
                        <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                          <FaFileWord className="w-12 h-12 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />
                        </div>

                        {isSelected && (
                          <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center backdrop-blur-[2px]">
                            <motion.div
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="bg-indigo-500 text-white rounded-sm p-3 shadow-2xl"
                            >
                              <CheckCircle2 className="w-6 h-6" />
                            </motion.div>
                          </div>
                        )}
                      </div>
                      <div className="-mt-1 flex items-center justify-start gap-2">
                        <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-white/40'}`} />
                        <h3
                          className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 truncate w-full
                            ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}
                          `}
                        >
                          {item.name || 'Untitled Document'}
                        </h3>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-30 space-y-6">
              <Ghost className="w-24 h-24 animate-bounce" />
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase text-white">No Assets Found</h3>
                <p className="text-[10px] font-bold uppercase mt-3 text-white/60 tracking-widest">Awaiting new docx uploads</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 border-white/20 hover:bg-white/10"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-5 h-9 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[11px] font-black text-white">{currentPage}</span>
            <span className="text-[10px] font-black text-white/20">/</span>
            <span className="text-[11px] font-black text-white/60">{totalPages}</span>
          </div>

          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 border-white/20 hover:bg-white/10"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>

          <div className="hidden sm:block ml-4">
            <p className="text-sm text-white/60">Total : {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <UploadButton
            endpoint="docxUploader"
            appearance={{
              button: `bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-white/30 text-white backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 h-8 rounded-md gap-1 max-w-[100px] text-sm`,
              allowedContent: 'hidden',
            }}
            content={{
              button({ ready }) {
                if (isUploadingLocal) return <Loader2 className="w-4 h-4 animate-spin" />;
                return (
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>{ready ? 'Upload' : 'Connecting...'}</span>
                  </div>
                );
              },
            }}
            onUploadBegin={() => setIsUploadingLocal(true)}
            onClientUploadComplete={handleUploadComplete}
            onUploadError={err => {
              setIsUploadingLocal(false);
              toast.error(err.message);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function DocxUploadManagerSingle({
  value,
  onChange,
  label = 'DOCX',
}: {
  value: { name: string; url: string };
  onChange: (val: { name: string; url: string }) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 w-full group/container">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Files className="w-3.5 h-3.5 text-indigo-50" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
        </div>
        <AnimatePresence>
          {value?.url && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Button variant="outlineFire" size="sm" onClick={() => onChange({ name: '', url: '' })}>
                <X className="w-3.5 h-3.5" /> Remove
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-video rounded-sm backdrop-blur-3xl transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center justify-center border border-white/10 hover:border-indigo-500/40 bg-white/[0.02]">
            {value?.url ? (
              <div className="w-full h-full relative flex flex-col items-center justify-center bg-white/[0.03]">
                <FaFileWord className="w-24 h-24 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-sm bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white"
                  >
                    <RefreshCcw className="w-4 h-4 animate-[spin_4s_linear_infinite]" />
                    CHANGE ASSET
                  </motion.div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-sm">
                  <FileText className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] font-bold text-white tracking-wider truncate flex-1">{value.name || 'ACTIVE_DOC'}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1 * 0.5,
                  }}
                  className="w-16 h-16 rounded-sm bg-white/20 border border-white/10 flex items-center justify-center"
                >
                  <FilePlus className="w-8 h-8 text-white/50" />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">No docx Selected</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Click here to Select one</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent border border-white/50 p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white mt-8">
          <InternalDocxVault
            selectedUrl={value?.url}
            onDocxSelect={val => {
              onChange(val);
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

```
here is example of dashboard/media/example/uploadthings/components/ImageUploadManager.tsx
```
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Loader2, Search, CheckCircle2, Zap, ImageIcon, ImagesIcon, ChevronLeft, ChevronRight, ImagePlus, Ghost } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UploadButton } from '@/lib/uploadthing';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';

interface MediaItem {
  _id: string;
  name: string;
  url: string;
  status: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface InternalImageVaultProps {
  onImageToggle: (item: { url: string; name: string }) => void;
  selectedImages: { url: string; name: string }[];
}

const InternalImageVault = ({ onImageToggle, selectedImages }: InternalImageVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading: isFetching,
    isFetching: isRefetching,
  } = useGetMediasQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    q: debouncedSearch,
    contentType: 'image',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availableImages = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

  const handleUploadComplete = async (res: { url: string; name: string }[]) => {
    if (res && res[0]) {
      try {
        await addMedia({
          url: res[0].url,
          name: res[0].name || 'Image_Asset',
          contentType: 'image',
          status: 'active',
        }).unwrap();
        toast.success('Successfully Uploaded');
        onImageToggle({ url: res[0].url, name: res[0].name || 'Image_Asset' });
      } catch {
        toast.error('Failed to Uploaded');
      } finally {
        setIsUploadingLocal(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-[150px] rounded-sm overflow-hidden bg-white/2 shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/5 bg-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 -mt-1">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH ASSET VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle> </DialogTitle>
            <DialogDescription> </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/60">Loading...</span>
            </div>
          ) : availableImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableImages.map((item, idx) => {
                  const isSelected = selectedImages.some(img => img.url === item.url);
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
                      className="flex flex-col gap-3 group"
                    >
                      <div
                        onClick={() => onImageToggle({ url: item.url, name: item.name })}
                        className={`relative aspect-square rounded-sm overflow-hidden cursor-pointer transition-all duration-500 
                          ${isSelected ? 'scale-[0.98] shadow-[0_0_40px_rgba(99,102,241,0.3)]' : 'hover:scale-[1.02] shadow-2xl'}
                        `}
                      >
                        <Image
                          src={item.url}
                          fill
                          alt={item.name || 'Gallery Image'}
                          className={`object-cover transition-transform duration-1000 ease-out border border-white/40 rounded-sm 
                            ${isSelected ? 'scale-110' : 'group-hover:scale-110'}
                            `}
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[3px] flex items-center justify-center overflow-hidden border border-white/60 rounded-sm"
                            >
                              <motion.div
                                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                                transition={{ type: 'spring', damping: 12 }}
                                className="bg-white text-indigo-600 rounded-sm p-4 shadow-2xl"
                              >
                                <CheckCircle2 className="w-8 h-8" />
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div className="absolute inset-0 pointer-events-none border-[1px] border-white/10 rounded-sm" />
                      </div>
                      <div className="-mt-1 flex items-center justify-start gap-2 px-1">
                        <ImageIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-white/40'}`} />
                        <h3
                          className={`text-sm font-medium transition-colors duration-300 truncate w-full ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}`}
                        >
                          {item.name || 'Untitled Asset'}
                        </h3>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 opacity-30 space-y-6">
              <Ghost className="w-24 h-24 animate-bounce" />
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase">Ops! Nothing was found!</h3>
                <p className="text-[10px] font-bold uppercase mt-3">Please Upload a New Image</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/5 bg-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-5 h-8 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[11px] text-white">{currentPage}</span>
            <span className="text-[10px] text-white/20">/</span>
            <span className="text-[11px] text-white/60">{totalPages}</span>
          </div>

          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>

          <div className="hidden sm:block ml-4">
            <p className="text-sm text-white/60">Total : {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <UploadButton
            endpoint="imageUploader"
            appearance={{
              button: `bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-white/30 text-white backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 h-8 rounded-md gap-1 max-w-[100px] text-sm`,
              allowedContent: 'hidden',
            }}
            content={{
              button({ ready }) {
                if (isUploadingLocal) return <Loader2 className="w-4 h-4 animate-spin" />;
                return (
                  <div className="flex items-center gap-2">
                    <ImagePlus className="w-4 h-4" />
                    <span>{ready ? 'Upload' : 'Connecting...'}</span>
                  </div>
                );
              },
            }}
            onUploadBegin={() => setIsUploadingLocal(true)}
            onClientUploadComplete={handleUploadComplete}
            onUploadError={err => {
              setIsUploadingLocal(false);
              toast.error(err.message);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function ImageUploadManager({
  value,
  onChange,
  label = 'Images',
}: {
  value: { url: string; name: string }[];
  onChange: (val: { url: string; name: string }[]) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleImage = (item: { url: string; name: string }) => {
    const exists = value.some(v => v.url === item.url);
    if (exists) {
      onChange(value.filter(v => v.url !== item.url));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <div className="space-y-4 w-full h-full">
      <div className="flex items-center justify-between px-1 flex-col md:flex-row">
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-start gap-2">
            <ImagesIcon className="w-3.5 h-3.5" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
          </div>
          <p className="text-[8px] font-bold tracking-widest text-white/60">{value.length} Assets Linked</p>
        </div>

        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <AnimatePresence>
            {value.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Button variant="outlineFire" size="sm" onClick={() => onChange([])}>
                  <X className="w-3.5 h-3.5" /> Remove all
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outlineGlassy" size="sm" className="min-w-1">
                <Plus className="w-3.5 h-3.5" /> Select
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-transparent p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white border-white/50 border rounded-sm mt-8">
              <InternalImageVault selectedImages={value} onImageToggle={toggleImage} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ScrollArea className="w-full h-[300px]">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 p-8 rounded-sm bg-white/2 border border-white/50 backdrop-blur-3xl min-h-[20vh] transition-all">
          <AnimatePresence mode="popLayout">
            {value.length > 0 ? (
              value.map((item, idx) => (
                <motion.div
                  key={item.url}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="flex flex-col gap-3 group"
                >
                  <div className="relative aspect-square rounded-sm bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-2xl overflow-hidden group-hover:border-indigo-500/30 transition-all duration-500">
                    <Image src={item.url} fill alt={item.name} className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                    <div className="absolute inset-0 bg-black/60 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        type="button"
                        onClick={() => onChange(value.filter(u => u.url !== item.url))}
                        className="p-3 cursor-pointer rounded-sm bg-rose-500/20 border border-rose-500/50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-300 transform scale-90 group-hover:scale-100 min-w-1"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <Zap className="absolute -top-1 -right-1 w-4 h-4 text-indigo-500/40 animate-pulse pointer-events-none z-10" />
                  </div>
                  <div className="flex items-center gap-2 px-1 opacity-70 group-hover:opacity-100 transition-opacity overflow-hidden">
                    <ImageIcon className="w-3.5 h-3.5 text-white shrink-0" />
                    <span className="text-[11px] font-medium text-white truncate">{item.name || 'Untitled'}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-10 gap-6">
                <div className="flex gap-4">
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -10, 0],
                        boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)'],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.5,
                      }}
                      className="w-16 h-16 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center"
                    >
                      <ImageIcon className="w-8 h-8 text-white/10" />
                    </motion.div>
                  ))}
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90">No Assets Selected</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Click Select to populate grid</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}

```
here is example of dashboard/media/example/uploadthings/components/ImageUploadManagerSingle.tsx
```
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Loader2, RefreshCcw, Search, CheckCircle2, Zap, ImageIcon, Wallpaper, ChevronLeft, ChevronRight, ImagePlus, Ghost } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UploadButton } from '@/lib/uploadthing';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';

interface MediaItem {
  _id: string;
  name: string;
  url: string;
  status: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface InternalImageVaultProps {
  onImageSelect: ({ name, url }: { name: string; url: string }) => void;
  selectedImage: string;
}

const InternalImageVault = ({ onImageSelect, selectedImage }: InternalImageVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading: isFetching,
    isFetching: isRefetching,
  } = useGetMediasQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    q: debouncedSearch,
    contentType: 'image',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availableImages = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

  const handleUploadComplete = async (res: { url: string; name: string }[]) => {
    if (res && res[0]) {
      try {
        await addMedia({
          url: res[0].url,
          name: res[0].name || 'Image_Asset',
          contentType: 'image',
          status: 'active',
        }).unwrap();
        toast.success('Successfully Uploaded');
        onImageSelect({ name: res[0].name, url: res[0].url });
      } catch {
        toast.error('Failed to Uploaded');
      } finally {
        setIsUploadingLocal(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-[150px] rounded-sm overflow-hidden bg-white/2 shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/5 bg-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 -mt-1">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH ASSET VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle> </DialogTitle>
            <DialogDescription> </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/60">Loading...</span>
            </div>
          ) : availableImages.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableImages.map((item, idx) => {
                  const isSelected = selectedImage === item.url;
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        delay: idx * 0.03,
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                      }}
                      className="flex flex-col gap-3 group"
                    >
                      <div
                        onClick={() => onImageSelect({ name: item.name, url: item.url })}
                        className={`relative aspect-square rounded-sm overflow-hidden cursor-pointer transition-all duration-500 
                          ${isSelected ? 'scale-[0.98] shadow-[0_0_40px_rgba(99,102,241,0.3)]' : 'hover:scale-[1.02] shadow-2xl'}
                        `}
                      >
                        <Image
                          src={item.url}
                          fill
                          alt={item.name || 'Gallery Image'}
                          className={`object-cover transition-transform duration-1000 ease-out border border-white/40 rounded-sm 
                            ${isSelected ? 'scale-110' : 'group-hover:scale-110'}
                            `}
                          unoptimized
                        />

                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[3px] flex items-center justify-center overflow-hidden border border-white/60 rounded-sm"
                            >
                              <motion.div
                                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                                transition={{ type: 'spring', damping: 12 }}
                                className="bg-white text-indigo-600 rounded-sm p-4 shadow-2xl"
                              >
                                <CheckCircle2 className="w-8 h-8" />
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="absolute inset-0 pointer-events-none border-[1px] border-white/10 rounded-sm" />
                      </div>

                      <div className="-mt-2 flex items-center justify-start gap-2">
                        <ImageIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-white/40'}`} />
                        <h3
                          className={`text-sm font-medium transition-colors duration-300 truncate w-full
                            ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}
                          `}
                        >
                          {item.name || 'Untitled Name'}
                        </h3>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-30 space-y-6">
              <Ghost className="w-24 h-24 animate-bounce" />
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase">Ops! Nothing was found!</h3>
                <p className="text-[10px] font-bold uppercase mt-3">Please Upload a New Image</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/5 bg-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-5 h-8 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[11px] text-white">{currentPage}</span>
            <span className="text-[10px] text-white/20">/</span>
            <span className="text-[11px] text-white/60">{totalPages}</span>
          </div>

          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>

          <div className="hidden sm:block ml-4">
            <p className="text-sm text-white/60">Total : {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <UploadButton
            endpoint="imageUploader"
            appearance={{
              button: `bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-white/30 text-white backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 h-8 rounded-md gap-1 max-w-[100px] text-sm`,
              allowedContent: 'hidden',
            }}
            content={{
              button({ ready }) {
                if (isUploadingLocal) return <Loader2 className="w-4 h-4 animate-spin" />;
                return (
                  <div className="flex items-center gap-2">
                    <ImagePlus className="w-4 h-4" />
                    <span>{ready ? 'Upload' : 'Uonnecting...'}</span>
                  </div>
                );
              },
            }}
            onUploadBegin={() => setIsUploadingLocal(true)}
            onClientUploadComplete={handleUploadComplete}
            onUploadError={err => {
              setIsUploadingLocal(false);
              toast.error(err.message);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function ImageUploadManagerSingle({
  value,
  onChange,
  label = 'IMAGE ASSET',
}: {
  value: { name: string; url: string };
  onChange: (val: { name: string; url: string }) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 w-full h-full">
      <div className="flex items-center justify-between px-1">
        <div className="w-full flex items-start justify-start gap-2">
          <Wallpaper className="w-3.5 h-3.5" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
        </div>
        <AnimatePresence>
          {value.url && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Button
                variant="outlineGlassy"
                size="sm"
                onClick={e => {
                  e.stopPropagation();
                  onChange({ name: '', url: '' });
                }}
              >
                <X className="w-3.5 h-3.5" /> Remove
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full h-[315px] aspect-[16/9] md:aspect-[21/9] rounded-sm backdrop-blur-3xl transition-all duration-700 cursor-pointer overflow-hidden flex flex-col items-center justify-center border border-white/50 hover:border-indigo-500/30 bg-white/2">
            {value.url ? (
              <div className="w-full h-full relative">
                <Image
                  src={value.url}
                  fill
                  alt="Current Selection"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  unoptimized
                />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-sm bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white"
                  >
                    <RefreshCcw className="w-5 h-5 animate-[spin_4s_linear_infinite]" />
                    REPLACE ASSET
                  </motion.div>
                </div>
                <div className="absolute bottom-2 left-2 flex items-center justify-start gap-2 px-2 py-1 bg-black/40 backdrop-blur-md rounded-sm">
                  <ImageIcon className={`w-3.5 h-3.5 text-white/80`} />
                  <h3 className={`text-[10px] font-medium truncate max-w-[200px] text-white`}>{value.name || 'Untitled Asset'}</h3>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-16 h-16 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center"
                >
                  <ImageIcon className="w-8 h-8 text-white/10" />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">No Image Selected</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Click here to Select one</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white border-white/50 border rounded-sm mt-8">
          <InternalImageVault
            selectedImage={value.url}
            onImageSelect={val => {
              onChange({ name: val.name, url: val.url });
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

```
here is example of dashboard/media/example/uploadthings/components/PdfUploadManager.tsx
```
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { X, Loader2, Ghost, Search, CheckCircle2, Zap, ChevronLeft, ChevronRight, Plus, Files, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UploadButton } from '@/lib/uploadthing';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';
import Link from 'next/link';
import { FaFilePdf } from 'react-icons/fa';

interface MediaItem {
  _id: string;
  name: string;
  url: string;
  status: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface InternalPdfVaultProps {
  onPdfToggle: (item: { url: string; name: string }) => void;
  selectedPdfs: { url: string; name: string }[];
}

const InternalPdfVault = ({ onPdfToggle, selectedPdfs }: InternalPdfVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading: isFetching,
    isFetching: isRefetching,
  } = useGetMediasQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    q: debouncedSearch,
    contentType: 'pdf',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availablePdfs = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

  const handleUploadComplete = async (res: { url: string; name: string }[]) => {
    if (res && res[0]) {
      try {
        await addMedia({
          url: res[0].url,
          name: res[0].name || 'PDF_Document',
          contentType: 'pdf',
          status: 'active',
        }).unwrap();
        toast.success('Successfully Uploaded');
        onPdfToggle({ url: res[0].url, name: res[0].name || 'PDF_Document' });
      } catch {
        toast.error('Failed to Uploaded');
      } finally {
        setIsUploadingLocal(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-3xl rounded-sm overflow-hidden shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/10 bg-white/5 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH DOCUMENT VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle> </DialogTitle>
            <DialogDescription> </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-6 h-6 text-indigo-500/40" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Scanning Archive...</span>
            </div>
          ) : availablePdfs.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availablePdfs.map((item, idx) => {
                  const isSelected = selectedPdfs.some(v => v.url === item.url);
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
                      onClick={() => onPdfToggle({ url: item.url, name: item.name })}
                      className={`relative aspect-[3/4] rounded-sm border cursor-pointer transition-all duration-500 group
                        ${isSelected ? 'border-indigo-500 scale-95 shadow-[0_0_40px_rgba(99,102,241,0.3)]' : 'border-white/5 hover:border-white/20 hover:scale-105 shadow-xl'}
                      `}
                    >
                      <div className="absolute inset-0 bg-white/5 flex flex-col items-center justify-center p-4">
                        <FaFilePdf className="w-24 h-24 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />
                        <div className="mt-4 text-center w-full">
                          <h3
                            className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 truncate w-full ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}
                                                `}
                          >
                            {item.name || 'Untitled PDF'}
                          </h3>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center backdrop-blur-[2px]">
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="bg-indigo-500 text-white rounded-sm p-2 shadow-2xl"
                          >
                            <CheckCircle2 className="w-6 h-6" />
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 opacity-20 space-y-6">
              <Ghost className="w-20 h-20 animate-bounce" />
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase tracking-[0.4em] text-white">Archive Empty</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-white/60">Zero PDF signatures detected</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 border-white/20 hover:bg-white/10"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-5 h-9 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[11px] font-black text-white">{currentPage}</span>
            <span className="text-[10px] font-black text-white/20">/</span>
            <span className="text-[11px] font-black text-white/60">{totalPages}</span>
          </div>

          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 border-white/20 hover:bg-white/10"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>

          <div className="hidden sm:block ml-4">
            <p className="text-sm text-white/60">Total : {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <UploadButton
            endpoint="pdfUploader"
            appearance={{
              button: `bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-white/30 text-white backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 h-8 rounded-md gap-1 max-w-[100px] text-sm`,
              allowedContent: 'hidden',
            }}
            content={{
              button({ ready }) {
                if (isUploadingLocal) return <Loader2 className="w-4 h-4 animate-spin" />;
                return (
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>{ready ? 'Upload' : 'Connecting...'}</span>
                  </div>
                );
              },
            }}
            onUploadBegin={() => setIsUploadingLocal(true)}
            onClientUploadComplete={handleUploadComplete}
            onUploadError={err => {
              setIsUploadingLocal(false);
              toast.error(err.message);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function PdfUploadManager({
  value,
  onChange,
  label = 'PDF Documents',
}: {
  value: { url: string; name: string }[];
  onChange: (val: { url: string; name: string }[]) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePdf = (item: { url: string; name: string }) => {
    const exists = value.some(v => v.url === item.url);
    if (exists) {
      onChange(value.filter(v => v.url !== item.url));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <div className="space-y-6 w-full group/container">
      <div className="flex items-center justify-between px-2 flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-start gap-2">
            <Files className="w-3.5 h-3.5" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
          </div>
          <p className="text-[8px] font-bold tracking-widest text-white/60">{value.length} Selected</p>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {value.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Button variant="outlineFire" size="sm" onClick={() => onChange([])}>
                  <X className="w-3.5 h-3.5" /> Remove all
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outlineGlassy" size="sm">
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                Select
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl bg-transparent p-0 shadow-none text-white overflow-hidden border border-white/50 rounded-sm mt-8">
              <InternalPdfVault selectedPdfs={value} onPdfToggle={togglePdf} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="min-h-[250px] rounded-sm p-8 border border-white/10 backdrop-blur-3xl transition-all duration-500 hover:border-white/20">
        <ScrollArea className="w-full h-full">
          {value.length > 0 ? (
            <div className="grid grid-cols-1 gap-1 pb-4">
              <AnimatePresence mode="popLayout">
                {value.map((item, index) => (
                  <motion.div
                    key={item.url}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative transition-all duration-500 flex flex-col items-center justify-center shadow-2xl border border-white/30 rounded-sm pl-2"
                  >
                    <div className="w-full flex gap-1 items-center justify-start">
                      <div className="text-white text-sm">{index + 1}. </div>
                      <FaFilePdf className="w-6 h-6 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />

                      <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase truncate w-full px-2">{item.name || 'PDF_DOC'}</span>
                      <div className="flex items-center justify-center gap-1 hover:underline">
                        <Eye className="w-4 h-4" />
                        <Link href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-50">
                          Preview
                        </Link>
                      </div>
                      <Button
                        onClick={() => onChange(value.filter(v => v.url !== item.url))}
                        variant="ghost"
                        size="sm"
                        className="min-w-1 h-7 w-7 text-rose-500/80"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10 gap-6">
              <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -10, 0],
                      boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)'],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.5,
                    }}
                    className="w-16 h-20 rounded-sm bg-white/20 border border-white/10 flex items-center justify-center"
                  >
                    <FaFilePdf className="w-24 h-24 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />
                  </motion.div>
                ))}
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-white/90">No PDF Selected</p>
                <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Awaiting Document Selection</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

```
here is example of dashboard/media/example/uploadthings/components/PdfUploadManagerSingle.tsx
```
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { X, Loader2, Ghost, RefreshCcw, Search, CheckCircle2, Zap, FileText, Files, ChevronLeft, ChevronRight, FilePlus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UploadButton } from '@/lib/uploadthing';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';
import { FaFilePdf } from 'react-icons/fa';

interface MediaItem {
  _id: string;
  name: string;
  url: string;
  status: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface InternalPdfVaultProps {
  onPdfSelect: (val: { name: string; url: string }) => void;
  selectedUrl: string;
}

const InternalPdfVault = ({ onPdfSelect, selectedUrl }: InternalPdfVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading: isFetching,
    isFetching: isRefetching,
  } = useGetMediasQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    q: debouncedSearch,
    contentType: 'pdf',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availablePdfs = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

  const handleUploadComplete = async (res: { url: string; name: string }[]) => {
    if (res && res[0]) {
      try {
        await addMedia({
          url: res[0].url,
          name: res[0].name || 'PDF_Source',
          contentType: 'pdf',
          status: 'active',
        }).unwrap();
        toast.success('Successfully Uploaded');
        onPdfSelect({ name: res[0].name, url: res[0].url });
      } catch {
        toast.error('Failed to Uploaded');
      } finally {
        setIsUploadingLocal(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-3xl rounded-sm overflow-hidden shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/50 bg-white/2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH PDF VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle> </DialogTitle>
            <DialogDescription> </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/60">Initializing Archive...</span>
            </div>
          ) : availablePdfs.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availablePdfs.map((item, idx) => {
                  const isSelected = selectedUrl === item.url;
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
                      onClick={() => onPdfSelect({ name: item.name, url: item.url })}
                      className="group flex flex-col gap-3"
                    >
                      <div
                        className={`relative aspect-[3/4] rounded-sm overflow-hidden border cursor-pointer transition-all duration-500 
                        ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-black' : 'border-white/10 hover:border-white/30'}
                      `}
                      >
                        <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                          <FaFilePdf className="w-12 h-12 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />
                        </div>

                        {isSelected && (
                          <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center backdrop-blur-[2px]">
                            <motion.div
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="bg-indigo-500 text-white rounded-sm p-3 shadow-2xl"
                            >
                              <CheckCircle2 className="w-6 h-6" />
                            </motion.div>
                          </div>
                        )}
                      </div>
                      <div className="-mt-1 flex items-center justify-start gap-2">
                        <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-white/40'}`} />
                        <h3
                          className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 truncate w-full
                            ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}
                          `}
                        >
                          {item.name || 'Untitled Document'}
                        </h3>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-30 space-y-6">
              <Ghost className="w-24 h-24 animate-bounce" />
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase text-white">No Assets Found</h3>
                <p className="text-[10px] font-bold uppercase mt-3 text-white/60 tracking-widest">Awaiting new pdf uploads</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 border-white/20 hover:bg-white/10"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-5 h-9 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[11px] font-black text-white">{currentPage}</span>
            <span className="text-[10px] font-black text-white/20">/</span>
            <span className="text-[11px] font-black text-white/60">{totalPages}</span>
          </div>

          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 border-white/20 hover:bg-white/10"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>

          <div className="hidden sm:block ml-4">
            <p className="text-sm text-white/60">Total : {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <UploadButton
            endpoint="pdfUploader"
            appearance={{
              button: `bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-white/30 text-white backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 h-8 rounded-md gap-1 max-w-[100px] text-sm`,
              allowedContent: 'hidden',
            }}
            content={{
              button({ ready }) {
                if (isUploadingLocal) return <Loader2 className="w-4 h-4 animate-spin" />;
                return (
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>{ready ? 'Upload' : 'Connecting...'}</span>
                  </div>
                );
              },
            }}
            onUploadBegin={() => setIsUploadingLocal(true)}
            onClientUploadComplete={handleUploadComplete}
            onUploadError={err => {
              setIsUploadingLocal(false);
              toast.error(err.message);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function PdfUploadManagerSingle({
  value,
  onChange,
  label = 'PDF',
}: {
  value: { name: string; url: string };
  onChange: (val: { name: string; url: string }) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 w-full group/container">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Files className="w-3.5 h-3.5 text-indigo-50" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
        </div>
        <AnimatePresence>
          {value?.url && (
            <>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Button variant="outlineFire" size="sm" onClick={() => onChange({ name: '', url: '' })}>
                  <X className="w-3.5 h-3.5" /> Remove
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-video rounded-sm backdrop-blur-3xl transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center justify-center border border-white/10 hover:border-indigo-500/40 bg-white/[0.02]">
            {value?.url ? (
              <div className="w-full h-full relative flex flex-col items-center justify-center bg-white/[0.03]">
                <FaFilePdf className="w-24 h-24 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-sm bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white"
                  >
                    <RefreshCcw className="w-4 h-4 animate-[spin_4s_linear_infinite]" />
                    CHANGE ASSET
                  </motion.div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-sm">
                  <FileText className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] font-bold text-white tracking-wider truncate flex-1">{value.name || 'ACTIVE_DOC'}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1 * 0.5,
                  }}
                  className="w-16 h-16 rounded-sm bg-white/20 border border-white/10 flex items-center justify-center"
                >
                  <FilePlus className="w-8 h-8 text-white/50" />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">No pdf Selected</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Click here to Select one</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent border border-white/50 p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white mt-8">
          <InternalPdfVault
            selectedUrl={value?.url}
            onPdfSelect={val => {
              onChange(val);
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

```
here is example of dashboard/media/example/uploadthings/components/VideoUploadManager.tsx
```
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { X, Loader2, Ghost, Search, CheckCircle2, Zap, Film, ChevronLeft, ChevronRight, Plus, MonitorPlay, VideoIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UploadButton } from '@/lib/uploadthing';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';

interface MediaItem {
  _id: string;
  name: string;
  url: string;
  status: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface InternalVideoVaultProps {
  onVideoToggle: (item: { url: string; name: string }) => void;
  selectedVideos: { url: string; name: string }[];
}

const InternalVideoVault = ({ onVideoToggle, selectedVideos }: InternalVideoVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading: isFetching,
    isFetching: isRefetching,
  } = useGetMediasQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    q: debouncedSearch,
    contentType: 'video',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availableVideos = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

  const handleUploadComplete = async (res: { url: string; name: string }[]) => {
    if (res && res[0]) {
      try {
        await addMedia({
          url: res[0].url,
          name: res[0].name || 'Video_Source',
          contentType: 'video',
          status: 'active',
        }).unwrap();
        toast.success('Successfully Uploaded');
        onVideoToggle({ url: res[0].url, name: res[0].name || 'Video_Source' });
      } catch {
        toast.error('Failed to Uploaded');
      } finally {
        setIsUploadingLocal(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-3xl rounded-sm overflow-hidden shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/10 bg-white/5 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH PRODUCTION VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle> </DialogTitle>
            <DialogDescription> </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-6 h-6 text-indigo-500/40" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Scanning Grid...</span>
            </div>
          ) : availableVideos.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableVideos.map((item, idx) => {
                  const isSelected = selectedVideos.some(v => v.url === item.url);
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
                      onClick={() => onVideoToggle({ url: item.url, name: item.name })}
                      className={`relative aspect-video rounded-sm border cursor-pointer transition-all duration-500 group
                        ${isSelected ? 'border-indigo-500 scale-95 shadow-[0_0_40px_rgba(99,102,241,0.3)]' : 'border-white/5 hover:border-white/20 hover:scale-105 shadow-xl'}
                      `}
                    >
                      <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                        <Film className="w-8 h-8 text-white/5 group-hover:text-white/10 transition-colors" />
                        <video
                          src={item.url}
                          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                          muted
                          onMouseOver={e => e.currentTarget.play()}
                          onMouseOut={e => {
                            e.currentTarget.pause();
                            e.currentTarget.currentTime = 0;
                          }}
                        />
                        <div className="mt-[105px] -ml-[60px] flex items-center justify-start gap-2">
                          <VideoIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-white/40'}`} />
                          <h3
                            className={`text-sm transition-colors duration-300 truncate w-full ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}
                                                `}
                          >
                            {item.name || 'Untitled Name'}
                          </h3>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center backdrop-blur-[2px]">
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="bg-indigo-500 text-white rounded-sm p-2 shadow-2xl"
                          >
                            <CheckCircle2 className="w-6 h-6" />
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 opacity-20 space-y-6">
              <Ghost className="w-20 h-20 animate-bounce" />
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase tracking-[0.4em] text-white">Grid Empty</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-white/60">Zero cinematic signatures detected</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 border-white/20 hover:bg-white/10"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-5 h-9 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[11px] font-black text-white">{currentPage}</span>
            <span className="text-[10px] font-black text-white/20">/</span>
            <span className="text-[11px] font-black text-white/60">{totalPages}</span>
          </div>

          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 border-white/20 hover:bg-white/10"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>

          <div className="hidden sm:block ml-4">
            <p className="text-sm text-white/60">Total : {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <UploadButton
            endpoint="videoUploader"
            appearance={{
              button: `bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-white/30 text-white backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 h-8 rounded-md gap-1 max-w-[100px] text-sm`,
              allowedContent: 'hidden',
            }}
            content={{
              button({ ready }) {
                if (isUploadingLocal) return <Loader2 className="w-4 h-4 animate-spin" />;
                return (
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>{ready ? 'Upload' : 'Uonnecting...'}</span>
                  </div>
                );
              },
            }}
            onUploadBegin={() => setIsUploadingLocal(true)}
            onClientUploadComplete={handleUploadComplete}
            onUploadError={err => {
              setIsUploadingLocal(false);
              toast.error(err.message);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function VideoUploadManager({
  value,
  onChange,
  label = 'Videos',
}: {
  value: { url: string; name: string }[];
  onChange: (val: { url: string; name: string }[]) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleVideo = (item: { url: string; name: string }) => {
    const exists = value.some(v => v.url === item.url);
    if (exists) {
      onChange(value.filter(v => v.url !== item.url));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <div className="space-y-6 w-full group/container">
      <div className="flex items-center justify-between px-2 flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-start gap-2">
            <MonitorPlay className="w-3.5 h-3.5" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
          </div>
          <p className="text-[8px] font-bold tracking-widest text-white/60">{value.length} Selected</p>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {value.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Button variant="outlineFire" size="sm" onClick={() => onChange([])}>
                  <X className="w-3.5 h-3.5" /> Remove all
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outlineGlassy" size="sm">
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                Select
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl bg-transparent p-0 shadow-none text-white overflow-hidden border border-white/50 rounded-sm mt-8">
              <InternalVideoVault selectedVideos={value} onVideoToggle={toggleVideo} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="min-h-[250px] rounded-sm p-8 border border-white/10 backdrop-blur-3xl transition-all duration-500 hover:border-white/20">
        <ScrollArea className="w-full h-full">
          {value.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-4">
              <AnimatePresence mode="popLayout">
                {value.map((item, index) => (
                  <motion.div
                    key={item.url}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative aspect-video transition-all duration-500"
                  >
                    <video
                      src={item.url}
                      className="w-full h-full object-cover duration-700"
                      muted
                      onMouseOver={e => e.currentTarget.play()}
                      onMouseOut={e => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                    <div className="absolute -top-5 -right-5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5">
                      <Button onClick={() => onChange(value.filter(v => v.url !== item.url))} variant="outlineFire" size="sm" className="min-w-1">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 py-1 bg-transparent">
                      <VideoIcon className="w-3 h-3 text-indigo-50" />
                      <span className="text-[10px] font-bold text-white tracking-wider truncate max-w-[150px]">{item.name || 'VIDEO_STREAM'}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10 gap-6">
              <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -10, 0],
                      boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)'],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.5,
                    }}
                    className="w-16 h-16 rounded-sm bg-white/20 border border-white/10 flex items-center justify-center"
                  >
                    <MonitorPlay className="w-8 h-8 text-white/50" />
                  </motion.div>
                ))}
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm text-white/90">No Videos Selected</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

```
here is example of dashboard/media/example/uploadthings/components/VideoUploadManagerSingle.tsx
```
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  X,
  Loader2,
  Ghost,
  RefreshCcw,
  Search,
  CheckCircle2,
  Zap,
  MonitorPlay,
  Film,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  VideoIcon,
  Plus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UploadButton } from '@/lib/uploadthing';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';

interface MediaItem {
  _id: string;
  name: string;
  url: string;
  status: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface InternalVideoVaultProps {
  onVideoSelect: (val: { name: string; url: string }) => void;
  selectedUrl: string;
}

const InternalVideoVault = ({ onVideoSelect, selectedUrl }: InternalVideoVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading: isFetching,
    isFetching: isRefetching,
  } = useGetMediasQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    q: debouncedSearch,
    contentType: 'video',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availableVideos = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

  const handleUploadComplete = async (res: { url: string; name: string }[]) => {
    if (res && res[0]) {
      try {
        await addMedia({
          url: res[0].url,
          name: res[0].name || 'Video_Source',
          contentType: 'video',
          status: 'active',
        }).unwrap();
        toast.success('Successfully Uploaded');
        onVideoSelect({ name: res[0].name, url: res[0].url });
      } catch {
        toast.error('Failed to Uploaded');
      } finally {
        setIsUploadingLocal(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-3xl rounded-sm overflow-hidden shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/50 bg-white/2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH VIDEO VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle> </DialogTitle>
            <DialogDescription> </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/60">Initializing Stream...</span>
            </div>
          ) : availableVideos.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableVideos.map((item, idx) => {
                  const isSelected = selectedUrl === item.url;
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
                      onClick={() => onVideoSelect({ name: item.name, url: item.url })}
                      className="group flex flex-col gap-3"
                    >
                      <div
                        className={`relative aspect-video rounded-sm overflow-hidden border cursor-pointer transition-all duration-500 
                        ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-black' : 'border-white/10 hover:border-white/30'}
                      `}
                      >
                        <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                          <Film className="w-8 h-8 text-white/5 group-hover:text-white/20 transition-colors" />
                          <video
                            src={item.url}
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                            muted
                            onMouseOver={e => e.currentTarget.play()}
                            onMouseOut={e => {
                              e.currentTarget.pause();
                              e.currentTarget.currentTime = 0;
                            }}
                          />
                        </div>

                        {isSelected && (
                          <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center backdrop-blur-[2px]">
                            <motion.div
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="bg-indigo-500 text-white rounded-sm p-3 shadow-2xl"
                            >
                              <CheckCircle2 className="w-6 h-6" />
                            </motion.div>
                          </div>
                        )}
                      </div>
                      <div className="-mt-2 flex items-center justify-start gap-2">
                        <VideoIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-white/40'}`} />
                        <h3
                          className={`text-sm font-medium transition-colors duration-300 truncate w-full
                            ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}
                          `}
                        >
                          {item.name || 'Untitled Name'}
                        </h3>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-30 space-y-6">
              <Ghost className="w-24 h-24 animate-bounce" />
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase text-white">No Assets Found</h3>
                <p className="text-[10px] font-bold uppercase mt-3 text-white/60 tracking-widest">Awaiting new production uploads</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 border-white/20 hover:bg-white/10"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-5 h-9 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[11px] font-black text-white">{currentPage}</span>
            <span className="text-[10px] font-black text-white/20">/</span>
            <span className="text-[11px] font-black text-white/60">{totalPages}</span>
          </div>

          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 border-white/20 hover:bg-white/10"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>

          <div className="hidden sm:block ml-4">
            <p className="text-sm text-white/60">Total : {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <UploadButton
            endpoint="videoUploader"
            appearance={{
              button: `bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-white/30 text-white backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 h-8 rounded-md gap-1 max-w-[100px] text-sm`,
              allowedContent: 'hidden',
            }}
            content={{
              button({ ready }) {
                if (isUploadingLocal) return <Loader2 className="w-4 h-4 animate-spin" />;
                return (
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>{ready ? 'Upload' : 'Uonnecting...'}</span>
                  </div>
                );
              },
            }}
            onUploadBegin={() => setIsUploadingLocal(true)}
            onClientUploadComplete={handleUploadComplete}
            onUploadError={err => {
              setIsUploadingLocal(false);
              toast.error(err.message);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function VideoUploadManagerSingle({
  value,
  onChange,
  label = 'VIDEO',
}: {
  value: { name: string; url: string };
  onChange: (val: { name: string; url: string }) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 w-full group/container">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Clapperboard className="w-3.5 h-3.5 text-indigo-50" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
        </div>
        <AnimatePresence>
          {value?.url && (
            <>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Button variant="outlineFire" size="sm" onClick={() => onChange({ name: '', url: '' })}>
                  <X className="w-3.5 h-3.5" /> Remove
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-video rounded-sm backdrop-blur-3xl transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center justify-center border border-white/10 hover:border-indigo-500/40 bg-white/[0.02]">
            {value?.url ? (
              <div className="w-full h-full relative">
                <video
                  src={value.url}
                  className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
                  muted
                  loop
                  onMouseOver={e => e.currentTarget.play()}
                  onMouseOut={e => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-sm bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white"
                  >
                    <RefreshCcw className="w-4 h-4 animate-[spin_4s_linear_infinite]" />
                    CHANGE SOURCE
                  </motion.div>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-sm">
                  <VideoIcon className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] font-bold text-white tracking-wider truncate max-w-[240px]">{value.name || 'ACTIVE_STREAM'}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1 * 0.5,
                  }}
                  className="w-16 h-16 rounded-sm bg-white/20 border border-white/10 flex items-center justify-center"
                >
                  <MonitorPlay className="w-8 h-8 text-white/50" />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">No Video Selected</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Click here to Select one</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent border border-white/50 p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white mt-8">
          <InternalVideoVault
            selectedUrl={value?.url}
            onVideoSelect={val => {
              onChange(val);
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

```
here is example of dashboard/media/example/uploadthings/page.tsx
```
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, ImageIcon, FileText, FileCode, Music, Database, LayoutGrid, VideoIcon } from 'lucide-react';

import { CustomLink } from '@/components/common/LinkButton';

import ImageUploadManagerSingle from '../uploadthings/components/ImageUploadMangerSingle';
import ImageUploadManager from '../uploadthings/components/ImageUploadManger';
import VideoUploadMangerSingle from '../uploadthings/components/VideoUploadMangerSingle';
import VideoUploadManger from '../uploadthings/components/VideoUploadManger';
import PdfUploadManagerSingle from '../uploadthings/components/PdfUploadManagerSingle';
import PdfUploadManager from '../uploadthings/components/PdfUploadManager';
import DocxUploadManagerSingle from '../uploadthings/components/DocxUploadManagerSingle';
import DocxUploadManager from '../uploadthings/components/DocxUploadManager';
import AudioUploadManagerSingle from '../uploadthings/components/AudioUploadManagerSingle';
import AudioUploadManager from '../uploadthings/components/AudioUploadManager';
import { Button } from '@/components/ui/button';

type TabType = 'image' | 'video' | 'pdf' | 'docx' | 'audio';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ElementType;
}

const tabs: TabConfig[] = [
  { id: 'image', label: 'Image', icon: ImageIcon },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'pdf', label: 'PDF', icon: FileText },
  { id: 'docx', label: 'DOCX', icon: FileCode },
  { id: 'audio', label: 'Audio', icon: Music },
];

export default function AssetManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('image');

  const [singleImage, setSingleImage] = useState<{ url: string; name: string }>({ url: '', name: '' });
  const [multipleImages, setMultipleImages] = useState<{ url: string; name: string }[]>([]);

  const [singleVideo, setSingleVideo] = useState<{ url: string; name: string }>({ url: '', name: '' });
  const [multipleVideos, setMultipleVideos] = useState<{ url: string; name: string }[]>([]);

  const [singlePdf, setSinglePdf] = useState<{ url: string; name: string }>({ url: '', name: '' });
  const [multiplePdfs, setMultiplePdfs] = useState<{ url: string; name: string }[]>([]);

  const [singleDocx, setSingleDocx] = useState<{ url: string; name: string }>({ url: '', name: '' });
  const [multipleDocxs, setMultipleDocxs] = useState<{ url: string; name: string }[]>([]);

  const [singleAudio, setSingleAudio] = useState<{ url: string; name: string }>({ url: '', name: '' });
  const [multipleAudios, setMultipleAudios] = useState<{ url: string; name: string }[]>([]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[400px] md:w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] md:w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto relative z-10 px-4 py-8 md:py-12">
        <header className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 shadow-2xl flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 transition-all hover:bg-white/15">
          <nav className="w-full lg:w-auto">
            <div className="flex items-center gap-2 p-1 bg-transparent h-12 rounded-lg flex-wrap">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-4 rounded-md flex items-center gap-2 transition-all duration-300 border backdrop-blur-xl whitespace-nowrap
                      ${
                        isActive
                          ? 'opacity-100 bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-white/50 shadow-xl shadow-purple-500/30 scale-[1.02] text-white'
                          : 'opacity-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-white/30 text-white hover:opacity-100 hover:border-white/50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-bold text-xs uppercase tracking-tight">{tab.label}</span>
                  </Button>
                );
              })}
            </div>
          </nav>
          <div className="mt-8 md:mt-0 flex items-end justify-end gap-2">
            <CustomLink href="/dashboard/media/example/imagebb" variant="outlineGlassy">
              <ImageIcon size={16} className="" />
              Image BB
            </CustomLink>
            <CustomLink href="/dashboard/media/example/yt-videos" variant="outlineGlassy">
              <VideoIcon size={16} className="" />
              YT Video
            </CustomLink>
            <CustomLink href="/dashboard/media" variant="outlineGlassy">
              <LayoutGrid size={16} className="" />
              MEDIA
            </CustomLink>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <section className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <Database className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter">
                    Single Asset
                  </h3>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/60 p-8 rounded-xl shadow-2xl transition-all duration-500 hover:bg-white/15 min-h-[380px]">
                {activeTab === 'image' && (
                  <ImageUploadManagerSingle
                    value={singleImage}
                    onChange={val => {
                      setSingleImage(val);
                    }}
                  />
                )}
                {activeTab === 'video' && (
                  <VideoUploadMangerSingle
                    value={singleVideo}
                    onChange={val => {
                      setSingleVideo(val);
                    }}
                  />
                )}
                {activeTab === 'pdf' && (
                  <PdfUploadManagerSingle
                    value={singlePdf}
                    onChange={val => {
                      setSinglePdf(val);
                    }}
                  />
                )}
                {activeTab === 'docx' && (
                  <DocxUploadManagerSingle
                    value={singleDocx}
                    onChange={val => {
                      setSingleDocx(val);
                    }}
                  />
                )}
                {activeTab === 'audio' && (
                  <AudioUploadManagerSingle
                    value={singleAudio}
                    onChange={val => {
                      setSingleAudio(val);
                    }}
                  />
                )}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <LayoutGrid className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter">
                    Multiple Asset
                  </h3>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/60 p-8 rounded-xl shadow-2xl transition-all duration-500 hover:bg-white/15 min-h-[380px]">
                {activeTab === 'image' && (
                  <ImageUploadManager
                    value={multipleImages}
                    onChange={val => {
                      setMultipleImages([...val]);
                    }}
                  />
                )}
                {activeTab === 'video' && (
                  <VideoUploadManger
                    value={multipleVideos}
                    onChange={val => {
                      setMultipleVideos(val);
                    }}
                  />
                )}
                {activeTab === 'pdf' && (
                  <PdfUploadManager
                    value={multiplePdfs}
                    onChange={val => {
                      setMultiplePdfs(val);
                    }}
                  />
                )}
                {activeTab === 'docx' && (
                  <DocxUploadManager
                    value={multipleDocxs}
                    onChange={val => {
                      setMultipleDocxs(val);
                    }}
                  />
                )}
                {activeTab === 'audio' && (
                  <AudioUploadManager
                    value={multipleAudios}
                    onChange={val => {
                      setMultipleAudios(val);
                    }}
                  />
                )}
              </div>
            </section>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

```
here is example of dashboard/media/example/yt-videos/components/YTVideoUploadManager.tsx
```
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { X, Loader2, Search, CheckCircle2, Youtube, Plus, MonitorPlay, VideoIcon, ChevronLeft, ChevronRight, Film, Code, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';

interface MediaItem {
  _id: string;
  name: string;
  url: string;
  status: string;
  contentType: string;
  uploaderPlace?: string;
  createdAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface YouTubeVaultProps {
  onVideoToggle: (item: { url: string; name: string }) => void;
  selectedVideos: { url: string; name: string }[];
}

const InternalYouTubeVault = ({ onVideoToggle, selectedVideos }: YouTubeVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [iframeCode, setIframeCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading: isFetching,
    isFetching: isRefetching,
  } = useGetMediasQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    q: debouncedSearch,
    contentType: 'video',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia] = useAddMediaMutation();

  const availableVideos = useMemo(() => response?.data || [], [response]);
  const totalPages = useMemo(() => Math.ceil((response?.total || 0) / ITEMS_PER_PAGE) || 1, [response]);

  const handleProcessImport = async () => {
    if (!iframeCode.trim()) {
      toast.warn('Please paste iframe from YouTube');
      return;
    }

    setIsProcessing(true);
    try {
      const match = iframeCode.match(/src="([^"]+)"/);
      const url = match ? match[1] : iframeCode.trim();

      if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        toast.error('Invalid YouTube source detected');
        return;
      }

      const newMedia = {
        name: `YT_ASSET_${Date.now()}`,
        url: url,
        status: 'active',
        contentType: 'video',
        uploaderPlace: 'youtube',
      };

      const result = await addMedia(newMedia).unwrap();
      toast.success('YouTube Asset Pipeline Integrated');
      onVideoToggle({ url: result.url, name: result.name });
      setIframeCode('');
    } catch (error) {
      toast.error('Failed to link YouTube asset');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[85vh] backdrop-blur-3xl rounded-sm overflow-hidden bg-black/40 border border-white/10 shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/5 bg-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH YOUTUBE ARCHIVE..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle />
            <DialogDescription />
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-6 h-6 text-indigo-500/40" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Syncing Vault...</span>
            </div>
          ) : availableVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableVideos.map((item, idx) => {
                  const isSelected = selectedVideos.some(v => v.url === item.url);
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => onVideoToggle({ url: item.url, name: item.name })}
                      className={`group relative aspect-video rounded-sm border cursor-pointer transition-all duration-500 ${
                        isSelected ? 'border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="absolute inset-0 bg-neutral-900/80 flex items-center justify-center overflow-hidden">
                        <iframe src={item.url} className="w-full h-full pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <Youtube className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-white/40'}`} />
                          <span className="text-[9px] font-bold text-white/60 truncate max-w-[120px] uppercase tracking-tighter">{item.name}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-[2px] flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-indigo-500" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 opacity-20">
              <Film className="w-16 h-16 mb-4 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest">No Assets Indexed</p>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="p-6 border-t border-white/10 bg-black/40 space-y-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Import YouTube Node</label>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <textarea
              value={iframeCode}
              onChange={e => setIframeCode(e.target.value)}
              placeholder="Paste <iframe> code here..."
              className="flex-1 bg-white/5 border border-white/10 rounded-sm p-3 text-[11px] font-mono text-indigo-300 focus:outline-none focus:border-indigo-500/50 min-h-[60px] transition-all resize-none"
            />
            <Button
              onClick={handleProcessImport}
              disabled={isProcessing}
              variant="outlineGlassy"
              className="h-auto py-4 px-8 bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-400"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              <span className="text-[10px] font-black uppercase tracking-widest">Process & Import</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Button
              variant="outlineGlassy"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isFetching}
              className="px-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-sm text-[10px] font-bold text-white/60">
              {currentPage} / {totalPages}
            </div>
            <Button
              variant="outlineGlassy"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isFetching}
              className="px-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest text-white/30">YT-API Signal: Stable</p>
        </div>
      </div>
    </div>
  );
};

export default function YouTubeVideoUploadManager({
  value,
  onChange,
  label = 'YouTube Assets',
}: {
  value: { url: string; name: string }[];
  onChange: (val: { url: string; name: string }[]) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleVideo = (item: { url: string; name: string }) => {
    const exists = value.some(v => v.url === item.url);
    if (exists) {
      onChange(value.filter(v => v.url !== item.url));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-white/90">
            <Youtube className="w-4 h-4 text-red-500" />
            <label className="text-[11px] font-black uppercase tracking-[0.2em]">{label}</label>
          </div>
          <span className="text-[9px] font-bold text-white/40 tracking-widest uppercase">{value.length} Linked Nodes</span>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {value.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Button variant="outlineFire" size="sm" onClick={() => onChange([])} className="h-8 text-[10px]">
                  <X className="w-3 h-3 mr-1" /> Clear Pipeline
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outlineGlassy" size="sm" className="h-8 text-[10px]">
                <Plus className="w-3.5 h-3.5 mr-1" /> Open Vault
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl bg-transparent p-0 shadow-none border-white/40 border rounded-sm overflow-hidden">
              <InternalYouTubeVault selectedVideos={value} onVideoToggle={toggleVideo} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="min-h-[280px] rounded-sm p-6 border border-white/5 bg-white/2 backdrop-blur-xl relative overflow-hidden">
        <ScrollArea className="h-full w-full">
          {value.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {value.map((item, idx) => (
                  <motion.div
                    key={item.url}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative aspect-video rounded-sm overflow-hidden border border-white/10"
                  >
                    <iframe src={item.url} className="w-full h-full pointer-events-none" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/90 px-4 text-center truncate w-full">{item.name}</p>
                      <Button
                        variant="outlineFire"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => onChange(value.filter(v => v.url !== item.url))}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-6 opacity-30">
              <div className="flex gap-4">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                    className="w-12 h-12 rounded-sm border border-white/20 flex items-center justify-center bg-white/5"
                  >
                    <MonitorPlay className="w-6 h-6" />
                  </motion.div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-xs font-black uppercase tracking-[0.3em]">No Content Selected</p>
                <p className="text-[9px] font-bold uppercase mt-1 tracking-widest">Interface Ready for Ingestion</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

```
here is example of dashboard/media/example/yt-videos/components/YTVideoUploadManagerSingle.tsx
```
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  X,
  Loader2,
  RefreshCcw,
  Search,
  CheckCircle2,
  Zap,
  MonitorPlay,
  Film,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  VideoIcon,
  Youtube,
  Code,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';

interface MediaItem {
  _id: string;
  name: string;
  url: string;
  status: string;
  contentType: string;
  uploaderPlace?: string;
  createdAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface InternalYouTubeVaultProps {
  onVideoSelect: (val: { name: string; url: string }) => void;
  selectedUrl: string;
}

const InternalYouTubeVault = ({ onVideoSelect, selectedUrl }: InternalYouTubeVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [iframeCode, setIframeCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading: isFetching,
    isFetching: isRefetching,
  } = useGetMediasQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    q: debouncedSearch,
    contentType: 'video',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia] = useAddMediaMutation();

  const availableVideos = useMemo(() => response?.data || [], [response]);
  const totalPages = useMemo(() => Math.ceil((response?.total || 0) / ITEMS_PER_PAGE) || 1, [response]);

  const handleProcessImport = async () => {
    if (!iframeCode.trim()) {
      toast.warn('Please paste iframe from YouTube');
      return;
    }

    setIsProcessing(true);
    try {
      const match = iframeCode.match(/src="([^"]+)"/);
      const url = match ? match[1] : iframeCode.trim();

      const payload = {
        name: `YT_STREAM_${Date.now()}`,
        url: url,
        status: 'active',
        contentType: 'video',
        uploaderPlace: 'youtube',
      };

      const result = await addMedia(payload).unwrap();
      toast.success('YouTube Asset Integrated');
      onVideoSelect({ name: result.name, url: result.url });
      setIframeCode('');
    } catch (error) {
      toast.error('Failed to process YouTube asset');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[85vh] backdrop-blur-3xl rounded-sm overflow-hidden bg-black/60 border border-white/20 shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/10 bg-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH YOUTUBE VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle />
            <DialogDescription />
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400">Syncing Grid...</span>
            </div>
          ) : availableVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableVideos.map((item, idx) => {
                  const isSelected = selectedUrl === item.url;
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => onVideoSelect({ name: item.name, url: item.url })}
                      className="group flex flex-col gap-3"
                    >
                      <div
                        className={`relative aspect-video rounded-sm overflow-hidden border cursor-pointer transition-all duration-500 
                        ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'border-white/10 hover:border-white/30'}
                      `}
                      >
                        <div className="absolute inset-0 bg-black flex items-center justify-center">
                          <iframe
                            src={item.url}
                            className="absolute inset-0 w-full h-full pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                        </div>
                        {isSelected && (
                          <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-[2px] flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-indigo-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 px-1">
                        <Youtube className={`w-3 h-3 ${isSelected ? 'text-indigo-400' : 'text-white/30'}`} />
                        <span className={`text-[10px] font-bold truncate uppercase tracking-tighter ${isSelected ? 'text-indigo-400' : 'text-white/50'}`}>
                          {item.name}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <Film className="w-16 h-16 animate-pulse mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">Vault Empty</p>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="p-6 border-t border-white/10 bg-white/5 space-y-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Import YouTube Embed</label>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <textarea
              value={iframeCode}
              onChange={e => setIframeCode(e.target.value)}
              placeholder='<iframe src="https://www.youtube.com/embed/..." ...></iframe>'
              className="flex-1 bg-black/40 border border-white/10 rounded-sm p-3 text-[11px] font-mono text-indigo-300 focus:outline-none focus:border-indigo-500/50 min-h-[70px] transition-all resize-none"
            />
            <Button
              onClick={handleProcessImport}
              disabled={isProcessing}
              variant="outlineGlassy"
              className="h-auto px-8 bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-400"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Youtube className="w-4 h-4 mr-2" />}
              <span className="text-[10px] font-black uppercase tracking-widest">Process & Link</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Button
              variant="outlineGlassy"
              size="sm"
              className="px-2"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isFetching}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-sm text-[10px] font-black text-white/60">
              {currentPage} / {totalPages}
            </div>
            <Button
              variant="outlineGlassy"
              size="sm"
              className="px-2"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isFetching}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest text-white/20">System Status: Operational</p>
        </div>
      </div>
    </div>
  );
};

export default function YouTubeVideoUploadManagerSingle({
  value,
  onChange,
  label = 'YOUTUBE SOURCE',
}: {
  value: { name: string; url: string };
  onChange: (val: { name: string; url: string }) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 w-full group/container">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Youtube className="w-4 h-4 text-red-500" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
        </div>
        <AnimatePresence>
          {value?.url && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Button variant="outlineFire" size="sm" onClick={() => onChange({ name: '', url: '' })} className="h-7 text-[9px] font-bold">
                <X className="w-3 h-3 mr-1" /> DISCONNECT
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-video rounded-sm backdrop-blur-3xl transition-all duration-700 cursor-pointer overflow-hidden flex flex-col items-center justify-center border border-white/10 hover:border-indigo-500/40 bg-white/[0.02]">
            {value?.url ? (
              <div className="w-full h-full relative">
                <iframe src={value.url} className="w-full h-full pointer-events-none" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-sm bg-indigo-500/10 border border-indigo-500/30 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400"
                  >
                    <RefreshCcw className="w-4 h-4 animate-spin-slow" />
                    RELINK SOURCE
                  </motion.div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-sm">
                  <div className="flex items-center gap-2 truncate">
                    <VideoIcon className="w-3 h-3 text-indigo-400" />
                    <span className="text-[9px] font-black text-white tracking-widest truncate uppercase">{value.name || 'ACTIVE_YOUTUBE_STREAM'}</span>
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.1)', '0 0 0px rgba(99,102,241,0)'],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-16 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center"
                >
                  <MonitorPlay className="w-8 h-8 text-white/20" />
                </motion.div>
                <div className="text-center space-y-2 px-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80 group-hover:text-indigo-400 transition-colors">
                    No Asset Deployed
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Select from YouTube Vault</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent border border-white/40 p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white">
          <InternalYouTubeVault
            selectedUrl={value?.url}
            onVideoSelect={val => {
              onChange(val);
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

```
here is example of dashboard/media/example/yt-videos/page.tsx
```
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Database, LayoutGrid, Upload, VideoIcon } from 'lucide-react';

import { CustomLink } from '@/components/common/LinkButton';
import { Button } from '@/components/ui/button';
import YouTubeVideoUploadManager from './components/YTVideoUploadManager';
import YouTubeVideoUploadManagerSingle from './components/YTVideoUploadManagerSingle';
// import YouTubeVideoUploadManager from './components/YouTubeVideoUploadManager';
// import YouTubeVideoUploadManagerSingle from './components/YouTubeVideoUploadManagerSingle';
  
interface VideoAsset {
  url: string;
  name: string;
}

export default function VideoManagementPage() {
  const [singleVideo, setSingleVideo] = useState<VideoAsset>({ url: '', name: '' });
  const [multipleVideos, setMultipleVideos] = useState<VideoAsset[]>([]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto relative z-10 px-4 py-8 md:py-12">
        <header className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 shadow-2xl flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 transition-all hover:bg-white/15">
          <nav className="w-full lg:w-auto">
            <Button variant="outlineGlassy" size="sm" className="opacity-100 scale-[1.02] border-white/40">
              <VideoIcon className="w-4 h-4" />
              <span className="font-bold text-xs uppercase tracking-tight text-white">YT Video Pipeline</span>
            </Button>
          </nav>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <CustomLink href="/dashboard/media/example/uploadthings" variant="outlineGlassy">
              <Upload size={16} /> Uploadthings
            </CustomLink>
            <CustomLink href="/dashboard/media/example/imagebb" variant="outlineGlassy">
              <Database size={16} /> Image BB
            </CustomLink>
            <CustomLink href="/dashboard/media" variant="outlineGlassy">
              <LayoutGrid size={16} /> Media
            </CustomLink>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <Video className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter">
                Single Asset Deployment
              </h3>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/40 p-8 rounded-xl shadow-2xl min-h-[460px] flex flex-col">
              <YouTubeVideoUploadManagerSingle label="Primary Stream" value={singleVideo} onChange={val => setSingleVideo(val)} />
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <LayoutGrid className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter">
                Batch Collection
              </h3>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/40 p-8 rounded-xl shadow-2xl min-h-[460px] flex flex-col">
              <YouTubeVideoUploadManager label="Production Queue" value={multipleVideos} onChange={val => setMultipleVideos(val)} />
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

```

Here is my Idea that I want to implement in my project: I will add Youtube Video [embedded] in my Media. and I want to save url in my Database. after that I want to play it in my website. 
Here is my Problem: In Video if other video url is apply then it throw error. 
Now Your task is Update all components as need to implement my idea. and give them one by one to me. 
And remember do not use other style or color-combination. Use old color-combination and style. 