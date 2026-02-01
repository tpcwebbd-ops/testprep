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
