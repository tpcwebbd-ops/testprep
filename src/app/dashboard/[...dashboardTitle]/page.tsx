'use client';

import React, { use, useEffect, useState, useMemo } from 'react';
import { Loader2, AlertTriangle, Layers, LayoutTemplate, RefreshCw } from 'lucide-react';
// import { motion } from 'framer-motion';

// import { AllSections, AllSectionsKeys } from '@/components/all-section/all-section-index/all-sections';
// import { AllForms, AllFormsKeys } from '@/components/all-form/all-form-index/all-form';
import { useGetDashboardsQuery } from '@/redux/features/dashboard-builder/dashboardBuilderSlice';
import { Button } from '@/components/ui/button';

interface DashboardContent {
  id?: string;
  type: string;
  key: string;
  data: Record<string, unknown>;
}

interface IDashboard {
  _id: string;
  dashboardName: string;
  dashboardPath: string;
  isActive: boolean;
  content: DashboardContent[];
}

// const COMPONENT_MAP: Record<string, { collection: any; keys: string[]; label: string; icon: any }> = {
//   form: { collection: AllForms, keys: AllFormsKeys, label: 'Forms', icon: Type },
//   section: { collection: AllSections, keys: AllSectionsKeys, label: 'Sections', icon: Layers },
// };

// const ClientItemRenderer = ({ item }: { item: DashboardContent }) => {
//   const mapEntry = COMPONENT_MAP[item.type];

//   if (!mapEntry) return null;

//   const config = mapEntry.collection[item.key];

//   if (!config) return null;

//   let ComponentToRender;

//   if (item.type === 'form') {
//     ComponentToRender = config.FormField;
//   } else {
//     ComponentToRender = config.query;
//   }

//   if (!ComponentToRender) return null;

//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="w-full">
//       {item.type !== 'form' ? (
//         <ComponentToRender data={JSON.stringify(item.data)} />
//       ) : (
//         <div className="pointer-events-auto">
//           <ComponentToRender data={item.data} />
//         </div>
//       )}
//     </motion.div>
//   );
// };

const DashboardViewer = ({ pathString }: { pathString: string }) => {
  const {
    data: dashboardsData,
    isLoading,
    error,
    refetch,
  } = useGetDashboardsQuery({
    page: 1,
    limit: 1000,
    q: '',
  });
  const currentPath = `/dashboard${pathString}`;
  console.log('currentPath', currentPath);
  const activeDashboard = useMemo(() => {
    if (!dashboardsData?.dashboards) return null;
    return dashboardsData.dashboards.find((d: IDashboard) => d.dashboardPath.toLowerCase() === currentPath.toLowerCase() && d.isActive !== false);
  }, [dashboardsData, currentPath]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
          <Loader2 className="h-12 w-12 text-indigo-400 animate-spin relative z-10" />
        </div>
        <p className="text-slate-400 animate-pulse font-medium">Loading View...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Unable to Load Dashboard</h2>
          <p className="text-slate-400 max-w-md">We encountered a connection error while fetching the dashboard configuration.</p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-indigo-500/50 transition-all"
        >
          <RefreshCw className="h-4 w-4" /> Retry Connection
        </Button>
      </div>
    );
  }

  if (!activeDashboard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div className="h-24 w-24 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent" />
          <LayoutTemplate className="h-10 w-10 text-slate-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white tracking-tight">404</h2>
          <p className="text-slate-400 text-lg">Dashboard Not Found</p>
          <p className="text-slate-500 text-sm font-mono bg-black/20 px-3 py-1 rounded-full border border-white/5 mt-2 inline-block">{pathString}</p>
        </div>
        <Button onClick={() => window.history.back()} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
          Go Back
        </Button>
      </div>
    );
  }

  const content: { name: string }[] = activeDashboard.content || [];

  return (
    <div className="w-full max-w-[1920px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {content.length === 0 ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-500 space-y-6 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30 m-8">
          <div className="p-4 bg-slate-900 rounded-full shadow-inner">
            <Layers className="h-8 w-8 text-indigo-400/50" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-medium text-slate-300">Empty Dashboard</h3>
            <p className="text-sm mt-1">This view exists but has no content configured.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full gap-6">
          <div className="w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50" />

          <div className="flex flex-col gap-8 pb-20">
            {content.map((item, index: number) => (
              <div key={item.name + index}>{item.name}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function DynamicDashboardPage({ params }: { params: Promise<{ dashboardTitle: string[] }> }) {
  const resolvedParams = use(params);
  const [pathString, setPathString] = useState<string>('');

  useEffect(() => {
    if (resolvedParams?.dashboardTitle) {
      const constructedPath = '/' + resolvedParams.dashboardTitle.join('/');
      setPathString(constructedPath);
    }
  }, [resolvedParams]);

  if (!pathString) return null;

  return (
    <main className="min-h-screen bg-slate-950 pt-[80px] w-full overflow-x-hidden">
      <DashboardViewer pathString={pathString} />
    </main>
  );
}
