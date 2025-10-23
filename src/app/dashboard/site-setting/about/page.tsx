'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';
import ImageUploadFieldSingle from '@/components/dashboard-ui/ImageUploadFieldSingle';
import { logger } from 'better-auth';

interface ChildData {
  _id: string;
  name: string;
  path: string;
  icon?: string;
  image?: string;
  svg?: string;
  description?: string;
}

interface AboutItem {
  _id: string;
  name: string;
  path: string;
  icon?: string;
  image?: string;
  svg?: string;
  description?: string;
  childData?: ChildData[];
}

export default function AboutAdminPage() {
  const [aboutList, setAboutList] = useState<AboutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setAboutList([]);
      }
    } catch (e: unknown) {
      let message = 'An unexpected error occurred.';

      if (e instanceof Error) {
        message = e.message;
        logger.error(e.stack || e.message);
      } else if (typeof e === 'string') {
        message = e;
        logger.error(e);
      } else {
        try {
          logger.error(JSON.stringify(e));
        } catch {
          logger.error('Unknown error type encountered.');
        }
      }

      setError(message);
      toast.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (item: AboutItem) => {
    setLoading(true);
    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Updated successfully!');
        fetchData(); // refresh after update
      } else {
        toast.error(data.message || 'Failed to update data.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to update data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 p-8 text-white relative overflow-hidden">
      {/* Background Floating Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-sky-700/10 to-blue-900/20 blur-3xl opacity-60 -z-10" />

      <h1 className="text-3xl md:text-4xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-300 to-sky-200 drop-shadow-lg">
        About Page Management
      </h1>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <p className="text-red-400 text-lg font-medium mb-2">⚠️ {error}</p>
          <Button onClick={fetchData} className="mt-3 bg-sky-600 hover:bg-sky-700 text-white">
            Retry
          </Button>
        </div>
      )}

      {/* Empty Data */}
      {!loading && !error && aboutList.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-600/30 to-blue-700/30 border border-sky-400/40 flex items-center justify-center mb-4 backdrop-blur-lg shadow-lg shadow-sky-700/20">
            <span className="text-5xl">🗂️</span>
          </div>
          <h2 className="text-xl font-semibold text-sky-200 mb-2">No About Data Found</h2>
          <p className="text-sky-300/80 mb-4">Start adding your About Page sections to see them here.</p>
          <Button onClick={fetchData} className="bg-sky-600 hover:bg-sky-700 text-white">
            Refresh
          </Button>
        </div>
      )}

      {/* Data Grid */}
      {!loading && !error && aboutList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {aboutList.map(item => (
            <div
              key={item._id}
              className="bg-gradient-to-br from-blue-900/30 via-sky-900/20 to-blue-950/30 backdrop-blur-lg p-6 rounded-2xl border border-sky-400/30 shadow-lg shadow-sky-900/30 hover:shadow-sky-800/40 transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="flex flex-col gap-3">
                <Input
                  value={item.name}
                  onChange={e => setAboutList(prev => prev.map(x => (x._id === item._id ? { ...x, name: e.target.value } : x)))}
                  placeholder="Name"
                  className="bg-slate-900/40 text-sky-100 border-sky-400/30 placeholder:text-sky-300/50 focus:border-sky-400"
                />

                <Input
                  value={item.path}
                  onChange={e => setAboutList(prev => prev.map(x => (x._id === item._id ? { ...x, path: e.target.value } : x)))}
                  placeholder="Path"
                  className="bg-slate-900/40 text-sky-100 border-sky-400/30 placeholder:text-sky-300/50 focus:border-sky-400"
                />

                <Textarea
                  value={item.description}
                  onChange={e => setAboutList(prev => prev.map(x => (x._id === item._id ? { ...x, description: e.target.value } : x)))}
                  placeholder="Description"
                  rows={4}
                  className="bg-slate-900/40 text-sky-100 border-sky-400/30 placeholder:text-sky-300/50 focus:border-sky-400"
                />

                <ImageUploadFieldSingle
                  label="About Image"
                  value={item.image || null}
                  onChange={url => setAboutList(prev => prev.map(x => (x._id === item._id ? { ...x, image: url || '' } : x)))}
                />

                <Button disabled={loading} onClick={() => handleSave(item)} className="bg-sky-600 hover:bg-sky-700 mt-3">
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
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
                        className="bg-slate-900/40 text-sky-100 border-sky-400/30 placeholder:text-sky-300/50 focus:border-sky-400"
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
                        className="mt-2 bg-slate-900/40 text-sky-100 border-sky-400/30 placeholder:text-sky-300/50 focus:border-sky-400"
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
        </div>
      )}
    </main>
  );
}
