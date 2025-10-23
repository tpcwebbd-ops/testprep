
Act as a senior Web App Developer specializing in Next.js and TypeScript, with a long-term vision for building a strong, scalable educational platform for our company. 

I will provide some code named page.tsx, route.ts, model.ts, controller.ts You have to update handle error for both backend and froent-end. If there is no data found in DB then froent-end load default data and user can update it and save to db. 


page.tsx 
```
'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';
import ImageUploadFieldSingle from '@/components/dashboard-ui/ImageUploadFieldSingle';
import { logger } from 'better-auth';

// ----------------------
// 🧩 Type Definitions
// ----------------------
interface ChildData {
  _id?: string;
  name: string;
  path: string;
  icon?: string;
  image?: string;
  svg?: string;
  description?: string;
}

interface AboutItem {
  _id?: string;
  name: string;
  path: string;
  icon?: string;
  image?: string;
  svg?: string;
  description?: string;
  childData?: ChildData[];
}

// ----------------------
// 🧱 Default Data (used if no DB data found)
// ----------------------
const defaultData: AboutItem[] = [
  {
    _id: Math.random().toString(36).substring(2),
    name: 'Our Mission',
    path: '/about/mission',
    icon: '<Globe2 />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/mission.svg',
    description: 'At TestPrep Centre, our mission is to empower ambitious students across Bangladesh to achieve global academic success...',
  },
  {
    _id: Math.random().toString(36).substring(2),
    name: 'About Our Centre',
    path: '/about/centre',
    icon: '<BookOpen />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/centre.svg',
    description: 'Founded with the vision to bridge the gap between Bangladeshi students and international education...',
  },
];

// ----------------------
// 🧠 Component
// ----------------------
export default function AboutAdminPage() {
  const [aboutList, setAboutList] = useState<AboutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productionEnabled, setProductionEnabled] = useState(false);
  const [timer, setTimer] = useState<number>(0);

  // ----------------------
  // 📦 Fetch Data
  // ----------------------
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/site-setting/about');
      if (!res.ok) throw new Error(`Failed to fetch data (${res.status})`);
      const data = await res.json();

      if (Array.isArray(data.data) && data.data.length > 0) {
        setAboutList(data.data);
      } else {
        toast.info('No data found. Loaded default content.');
        setAboutList(defaultData);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : typeof e === 'string' ? e : 'An unexpected error occurred.';

      setError(message);
      logger.error(e instanceof Error ? e.stack || e.message : JSON.stringify(e));
      toast.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ----------------------
  // 💾 Save All Changes
  // ----------------------
  const handleSaveAll = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/site-setting/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutList),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('All changes saved successfully!');
        fetchData();
      } else {
        toast.error(data.message || 'Failed to save changes.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to save data.');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------
  // 🚀 Publish to Production
  // ----------------------
  const handlePublish = async () => {
    const invalidPaths = aboutList.filter(item => !item.path.startsWith('/about'));
    if (invalidPaths.length > 0) {
      toast.error('All paths must start with "/about".');
      return;
    }

    toast.success('Production mode enabled for 10 minutes.');
    setProductionEnabled(true);
    setTimer(600);

    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          setProductionEnabled(false);
          toast.info('Production mode expired.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ----------------------
  // 🕒 Timer Display
  // ----------------------
  const formatTimer = (t: number) => {
    const min = Math.floor(t / 60);
    const sec = t % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // ----------------------
  // 🧱 UI
  // ----------------------
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 p-8 text-white relative overflow-hidden">
      {/* Background Floating Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-sky-700/10 to-blue-900/20 blur-3xl opacity-60 -z-10" />

      <h1 className="text-3xl md:text-4xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-300 to-sky-200 drop-shadow-lg">
        About Page Management
      </h1>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center mt-20">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={fetchData} className="bg-sky-600 hover:bg-sky-700">
            Retry
          </Button>
        </div>
      )}

      {/* Data Editor */}
      {!loading && !error && aboutList.length > 0 && (
        <div className="flex flex-col gap-8">
          {aboutList.map(item => (
            <div
              key={item._id || item.name}
              className="bg-gradient-to-br from-blue-900/30 via-sky-900/20 to-blue-950/30 backdrop-blur-lg p-6 rounded-2xl border border-sky-400/30 shadow-lg hover:shadow-sky-800/40 transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="flex flex-col gap-3">
                <Input
                  value={item.name}
                  onChange={e => setAboutList(prev => prev.map(x => (x._id === item._id || x.name === item.name ? { ...x, name: e.target.value } : x)))}
                  placeholder="Name"
                  className="bg-slate-900/40 text-sky-100 border-sky-400/30 focus:border-sky-400"
                />

                <Input
                  value={item.path}
                  onChange={e => setAboutList(prev => prev.map(x => (x._id === item._id || x.name === item.name ? { ...x, path: e.target.value } : x)))}
                  placeholder="Path"
                  className="bg-slate-900/40 text-sky-100 border-sky-400/30 focus:border-sky-400"
                />

                <Textarea
                  value={item.description}
                  onChange={e => setAboutList(prev => prev.map(x => (x._id === item._id || x.name === item.name ? { ...x, description: e.target.value } : x)))}
                  placeholder="Description"
                  rows={4}
                  className="bg-slate-900/40 text-sky-100 border-sky-400/30 focus:border-sky-400"
                />

                <ImageUploadFieldSingle
                  label="About Image"
                  value={item.image || null}
                  onChange={url => setAboutList(prev => prev.map(x => (x._id === item._id || x.name === item.name ? { ...x, image: url || '' } : x)))}
                />
              </div>

              {item.childData && (
                <div className="mt-4 border-t border-sky-400/20 pt-4 space-y-3">
                  <h3 className="text-lg font-semibold mb-2 text-sky-200">Sub-sections</h3>
                  {item.childData.map(child => (
                    <div key={child._id} className="p-3 rounded-xl bg-sky-900/30 border border-sky-600/20 backdrop-blur-md">
                      <Input
                        value={child.name}
                        onChange={e => {
                          setAboutList(prev =>
                            prev.map(x =>
                              x._id === item._id
                                ? {
                                    ...x,
                                    childData: x.childData?.map(c => (c._id === child._id ? { ...c, name: e.target.value } : c)),
                                  }
                                : x,
                            ),
                          );
                        }}
                        className="bg-slate-900/40 text-sky-100 border-sky-400/30 focus:border-sky-400"
                      />
                      <Textarea
                        value={child.description}
                        onChange={e => {
                          setAboutList(prev =>
                            prev.map(x =>
                              x._id === item._id
                                ? {
                                    ...x,
                                    childData: x.childData?.map(c => (c._id === child._id ? { ...c, description: e.target.value } : c)),
                                  }
                                : x,
                            ),
                          );
                        }}
                        className="mt-2 bg-slate-900/40 text-sky-100 border-sky-400/30 focus:border-sky-400"
                        rows={2}
                      />
                      <ImageUploadFieldSingle
                        label="Sub-section Image"
                        value={child.image || null}
                        onChange={url =>
                          setAboutList(prev =>
                            prev.map(x =>
                              x._id === item._id
                                ? {
                                    ...x,
                                    childData: x.childData?.map(c => (c._id === child._id ? { ...c, image: url || '' } : c)),
                                  }
                                : x,
                            ),
                          )
                        }
                        className="mt-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Bottom Global Action Buttons */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-10">
            <Button disabled={loading} onClick={handleSaveAll} className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 font-semibold text-lg">
              {loading ? 'Saving...' : 'Save All Changes'}
            </Button>

            <Button
              disabled={productionEnabled}
              onClick={handlePublish}
              className={`${
                productionEnabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              } text-white px-8 py-3 font-semibold text-lg`}
            >
              {productionEnabled ? `Production Active (${formatTimer(timer)})` : 'Publish to Production'}
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}

```

route.ts 
```
import { NextResponse } from 'next/server';
import { getAbout, createAbout, updateAbout, deleteAbout } from './controller';
import { handleRateLimit } from '../../utils/rate-limit';

const formatResponse = (data: unknown, message: string, status: number) => {
  return NextResponse.json({ data, message }, { status });
};

// ✅ GET
export async function GET(req: Request) {
  const limit = handleRateLimit(req);
  if (limit) return limit;
  const result = await getAbout(req);
  return formatResponse(result.data, result.message, result.status);
}

// ✅ POST
export async function POST(req: Request) {
  const limit = handleRateLimit(req);
  if (limit) return limit;
  const result = await createAbout(req);
  return formatResponse(result.data, result.message, result.status);
}

// ✅ PUT
export async function PUT(req: Request) {
  const limit = handleRateLimit(req);
  if (limit) return limit;
  const result = await updateAbout(req);
  return formatResponse(result.data, result.message, result.status);
}

// ✅ DELETE
export async function DELETE(req: Request) {
  const limit = handleRateLimit(req);
  if (limit) return limit;
  const result = await deleteAbout(req);
  return formatResponse(result.data, result.message, result.status);
}

```

model.ts 
```
import mongoose, { Schema, Document, Types } from 'mongoose';

interface IChildData {
  _id?: Types.ObjectId;
  name: string;
  path: string;
  icon?: string;
  image?: string;
  svg?: string;
  description?: string;
}

export interface IAboutItem extends Document {
  name: string;
  path: string;
  icon?: string;
  image?: string;
  svg?: string;
  description?: string;
  childData?: IChildData[];
}

const childSchema = new Schema<IChildData>(
  {
    name: { type: String, required: true },
    path: { type: String, required: true },
    icon: String,
    image: String,
    svg: String,
    description: String,
  },
  { _id: true },
);

const aboutSchema = new Schema<IAboutItem>(
  {
    name: { type: String, required: true },
    path: { type: String, required: true },
    icon: String,
    image: String,
    svg: String,
    description: String,
    childData: [childSchema],
  },
  { timestamps: true },
);

export default mongoose.models.About || mongoose.model<IAboutItem>('About', aboutSchema, 'about');

```

controller.ts 
```
import { withDB } from '@/app/api/utils/db';
import { FilterQuery } from 'mongoose';
import About from './model';

interface IResponse {
  data: unknown;
  message: string;
  status: number;
  ok: boolean;
}

// Helper to format responses
const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
  data,
  message,
  status,
  ok: status >= 200 && status < 300,
});

// ✅ CREATE
export async function createAbout(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const aboutData = await req.json();
      const newAbout = await About.create({ ...aboutData });
      return formatResponse(newAbout, 'About data created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error;
    }
  });
}

// ✅ READ (Single or All)
export async function getAbout(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');

    if (id) {
      const aboutItem = await About.findById(id);
      if (!aboutItem) return formatResponse(null, 'About item not found', 404);
      return formatResponse(aboutItem, 'About item fetched successfully', 200);
    }

    const aboutItems = await About.find().sort({ createdAt: -1 });
    return formatResponse(aboutItems, 'All About items fetched successfully', 200);
  });
}

// ✅ SEARCH + PAGINATION (Optional)
export async function getAboutPaginated(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    const searchQuery = url.searchParams.get('q');

    let filter: FilterQuery<unknown> = {};

    if (searchQuery) {
      const orConditions: FilterQuery<unknown>[] = [];
      const stringFields = ['name', 'path', 'description'];

      stringFields.forEach(field => {
        orConditions.push({ [field]: { $regex: searchQuery, $options: 'i' } });
      });

      if (orConditions.length > 0) filter = { $or: orConditions };
    }

    const aboutItems = await About.find(filter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit);

    const total = await About.countDocuments(filter);

    return formatResponse({ aboutItems, total, page, limit }, 'About items fetched successfully', 200);
  });
}

// ✅ UPDATE
export async function updateAbout(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { _id, ...updateData } = await req.json();
      const updated = await About.findByIdAndUpdate(_id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updated) return formatResponse(null, 'About item not found', 404);
      return formatResponse(updated, 'About data updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error;
    }
  });
}

// ✅ BULK UPDATE (optional)
export async function bulkUpdateAbout(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const updates: { _id: string; updateData: Record<string, unknown> }[] = await req.json();

    const results = await Promise.allSettled(
      updates.map(({ _id, updateData }) => About.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true })),
    );

    const successful = results.filter((r): r is PromiseFulfilledResult<unknown> => r.status === 'fulfilled' && r.value).map(r => r.value);

    const failed = results
      .map((r, i) => (r.status === 'rejected' || !('value' in r && r.value) ? updates[i]._id : null))
      .filter((id): id is string => id !== null);

    return formatResponse({ updated: successful, failed }, 'Bulk update completed', 200);
  });
}

// ✅ DELETE
export async function deleteAbout(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { _id } = await req.json();
    const deleted = await About.findByIdAndDelete(_id);
    if (!deleted) return formatResponse(null, 'About item not found', 404);
    return formatResponse({ deletedCount: 1 }, 'About item deleted successfully', 200);
  });
}

// ✅ BULK DELETE
export async function bulkDeleteAbout(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { ids }: { ids: string[] } = await req.json();
    const deletedIds: string[] = [];
    const invalidIds: string[] = [];

    for (const id of ids) {
      try {
        const doc = await About.findById(id);
        if (doc) {
          const deletedDoc = await About.findByIdAndDelete(id);
          if (deletedDoc) deletedIds.push(id);
        } else {
          invalidIds.push(id);
        }
      } catch {
        invalidIds.push(id);
      }
    }

    return formatResponse({ deleted: deletedIds.length, deletedIds, invalidIds }, 'Bulk delete operation completed', 200);
  });
}

```