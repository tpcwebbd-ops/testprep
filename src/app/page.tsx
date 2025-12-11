/*
|-----------------------------------------
| Home Page (Root Route)
| Path: /src/app/page.tsx
| @description: Renders the homepage content (path: "/")
|-----------------------------------------
*/

import { notFound } from 'next/navigation';
import { cache } from 'react';
import { Type, Layers } from 'lucide-react';

// Import your existing component maps
import { AllSections, AllSectionsKeys } from '@/components/all-section/all-section-index/all-sections';
import { AllForms, AllFormsKeys } from '@/components/all-form/all-form-index/all-form';

import { PageContent } from '@/app/dashboard/page-builder/utils';
import { getAllPages } from './api/page-builder/v1/controller'; // Check relative path if this file is in src/app

// --- Types ---
interface PageApiResponse {
  data: {
    pages: NormalizedPage[];
    total: number;
    page: number;
    limit: number;
  };
  message: string;
  status: number;
}

interface NormalizedPage {
  _id: string;
  pageName: string;
  path: string;
  isActive?: boolean;
  content: PageContent[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENT_MAP: Record<string, { collection: any; keys: string[]; label: string; icon: any }> = {
  form: { collection: AllForms, keys: AllFormsKeys, label: 'Forms', icon: Type },
  section: { collection: AllSections, keys: AllSectionsKeys, label: 'Sections', icon: Layers },
};

// --- Data Fetching Logic (Cached) ---
// Reusing the logic to ensure we get the unified CMS data
const getCachedAllPages = cache(async (): Promise<NormalizedPage[]> => {
  try {
    // Note: Ensure the import path to 'getAllPages' is correct relative to src/app/page.tsx
    const pagesData = (await getAllPages()) as unknown as PageApiResponse;

    if (pagesData && Array.isArray(pagesData.data.pages)) {
      return getNormalizedPages(pagesData.data.pages.filter(i => i.isActive));
    }
    return [];
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
});

// --- Helper: Flatten Pages ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNormalizedPages(rawPages: any[]): NormalizedPage[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flattenPages = (list: any[]): NormalizedPage[] => {
    let results: NormalizedPage[] = [];
    list.forEach(item => {
      const norm: NormalizedPage = {
        ...item,
        _id: item._id,
        pageName: item.pageName || item.pageTitle || 'Untitled',
        // Ensure path starts with / for consistent matching
        path: (item.path || item.pagePath || '#').startsWith('/') ? item.path || item.pagePath : '/' + (item.path || item.pagePath),
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
}

// --- Component: SSR Item Renderer ---
const SSRItemRenderer = ({ item }: { item: PageContent }) => {
  // Check if type exists in our current map
  if (!item.type || !COMPONENT_MAP[item.type]) return null;

  const mapEntry = COMPONENT_MAP[item.type];
  const config = mapEntry ? mapEntry.collection[item.key] : null;

  if (!mapEntry || !config) return null;

  let ComponentToRender;
  if (item.type === 'form') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ComponentToRender = (config as any).FormField;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ComponentToRender = (config as any).query;
  }

  if (!ComponentToRender) return null;

  return (
    <div className="w-full">
      {item.type !== 'form' ? (
        <ComponentToRender data={JSON.stringify(item.data)} />
      ) : (
        <div className="pointer-events-auto">
          <ComponentToRender data={item.data} />
        </div>
      )}
    </div>
  );
};

// --- Metadata Generator (SEO) ---
export async function generateMetadata() {
  const pages = await getCachedAllPages();
  const homePage = pages.find(p => p.path === '/');

  if (!homePage) {
    return { title: 'Home' };
  }

  return {
    title: homePage.pageName,
    description: homePage.description || 'Welcome to our website',
  };
}

// --- Main Home Page Component ---
export default async function HomePage() {
  // 1. Fetch Data
  const pages = await getCachedAllPages();

  // 2. Find the Home page specifically (Path === "/")
  const homePage = pages.find(p => p.path === '/');

  // 3. Handle 404
  if (!homePage) {
    notFound();
  }

  // 4. Extract Content
  const items: PageContent[] = Array.isArray(homePage.content) ? homePage.content : [];

  return (
    <main className="min-h-screen w-full bg-slate-950 pt-[80px]">
      {items.length === 0 ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-500 space-y-4">
          <p className="text-lg font-medium">Home Page Found</p>
          <p className="text-sm">But it has no content configured yet.</p>
        </div>
      ) : (
        <div className="w-full flex flex-col">
          {items.map((item, index) => (
            <SSRItemRenderer key={item.id || index} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}
