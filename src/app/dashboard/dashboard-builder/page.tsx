'use client';

import { useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, ExternalLink, LayoutDashboard, X, AlertTriangle, RefreshCw, LayoutTemplate, Activity, MousePointer2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  useGetDashboardsQuery,
  useAddDashboardMutation,
  useUpdateDashboardMutation,
  useDeleteDashboardMutation,
} from '@/redux/features/dashboard-builder/dashboardBuilderSlice';
import { toast } from 'sonner';

interface IDashboard {
  _id: string;
  dashboardName: string;
  dashboardPath: string;
  isActive: boolean;
  [key: string]: unknown;
}

const DashboardBuilderPage = () => {
  const pathname = usePathname();

  const dashboardCategory = useMemo(() => {
    return pathname?.split('/').pop() || '';
  }, [pathname]);

  const formattedCategoryTitle = useMemo(() => {
    return dashboardCategory.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }, [dashboardCategory]);

  const {
    data: dashboardsData,
    isLoading,
    error,
    refetch,
  } = useGetDashboardsQuery({
    page: 1,
    limit: 1000,
    q: dashboardCategory,
  });

  const [addDashboard, { isLoading: isAdding }] = useAddDashboardMutation();
  const [updateDashboard] = useUpdateDashboardMutation();
  const [deleteDashboard] = useDeleteDashboardMutation();

  const dashboards = useMemo(() => {
    const rawDashboards = dashboardsData?.dashboards || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filtered = rawDashboards.filter((item: any) => (item.dashboardName || '').toLowerCase().includes(dashboardCategory.toLowerCase()));

    return (
      filtered
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => ({
          ...item,
          _id: item._id,
          isActive: item.isActive ?? true,
          dashboardName: item.dashboardName,
          dashboardPath: item.dashboardPath || '/',
        }))
        .sort((a: IDashboard, b: IDashboard) => a.dashboardPath.localeCompare(b.dashboardPath))
    );
  }, [dashboardsData, dashboardCategory]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedDashboardToEdit, setSelectedDashboardToEdit] = useState<IDashboard | null>(null);
  const [dashboardToDelete, setDashboardToDelete] = useState<IDashboard | null>(null);

  const [pathInput, setPathInput] = useState<string>('');
  const [nameInput, setNameInput] = useState<string>('');

  const handleOpenAddDialog = () => {
    setPathInput('');
    setNameInput(formattedCategoryTitle);
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (dashboard: IDashboard) => {
    setSelectedDashboardToEdit(dashboard);
    setPathInput(dashboard.dashboardPath);
    setNameInput(dashboard.dashboardName);
    setIsEditDialogOpen(true);
  };

  const handleSaveDashboard = async () => {
    if (!pathInput || !nameInput) {
      toast.error('Name and Path are required');
      return;
    }

    const exists = dashboards.some((d: IDashboard) => d.dashboardPath === pathInput && d.dashboardName === nameInput);
    if (exists) {
      toast.error(`Path ${pathInput} already exists in this dashboard group!`);
      return;
    }

    try {
      await addDashboard({
        dashboardName: nameInput,
        dashboardPath: pathInput,
        isActive: true,
        content: [],
      }).unwrap();

      toast.success(`Dashboard ${nameInput} created`);
      setIsAddDialogOpen(false);
      setPathInput('');
      setNameInput('');
      refetch();
    } catch (err) {
      toast.error('Failed to create dashboard');
      console.error(err);
    }
  };

  const handleUpdateDashboard = async () => {
    if (!selectedDashboardToEdit || !pathInput || !nameInput) return;

    try {
      await updateDashboard({
        id: selectedDashboardToEdit._id,
        dashboardName: nameInput,
        dashboardPath: pathInput,
      }).unwrap();

      toast.success('Dashboard updated successfully');
      setIsEditDialogOpen(false);
      setSelectedDashboardToEdit(null);
      refetch();
    } catch (err) {
      toast.error('Failed to update dashboard');
      console.error(err);
    }
  };

  const initiateDelete = (dashboard: IDashboard) => {
    setDashboardToDelete(dashboard);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!dashboardToDelete?._id) return;

    try {
      await deleteDashboard({ id: dashboardToDelete._id }).unwrap();
      toast.success('Dashboard deleted successfully');
      setIsDeleteDialogOpen(false);
      setDashboardToDelete(null);
      refetch();
    } catch (err) {
      toast.error('Failed to delete dashboard');
      console.error(err);
    }
  };

  const handleToggleActive = async (dashboard: IDashboard) => {
    if (!dashboard._id) return;
    try {
      const updatedStatus = !dashboard.isActive;
      await updateDashboard({ id: dashboard._id, isActive: updatedStatus }).unwrap();
      refetch();
      toast.success(`Dashboard ${updatedStatus ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error('Failed to update status');
      console.error(err);
    }
  };

  const handleEdit = (id: string, name: string, path: string) => {
    window.open(`/dashboard/dashboard-builder/edit?dashboardName=${name}&dashboardPath=${path.replaceAll('/', '-')}`, '_blank');
  };

  const handlePreview = (id: string) => {
    window.open(`/dashboard/preview?id=${id}`, '_blank');
  };

  const handleLiveLink = (path: string) => {
    window.open(`${path}`, '_blank');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 pt-[90px] pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-500">
            <LayoutDashboard className="h-12 w-12 text-indigo-400 animate-bounce" />
            <div className="text-white text-xl font-semibold">Loading dashboards...</div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 pt-[90px] pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[50vh] gap-6">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Connection Error</h2>
            <p className="text-slate-400">Failed to load dashboards.</p>
          </div>
          <Button onClick={() => refetch()} variant="outline" className="gap-2 bg-white/5 text-white border-white/10 hover:bg-white/10">
            <RefreshCw className="h-4 w-4" /> Retry
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 pt-[90px] pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 animate-in slide-in-from-top-4 duration-500">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <LayoutDashboard className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">{formattedCategoryTitle || 'Dashboard Builder'}</h1>
                <p className="text-slate-400 text-sm flex items-center gap-2">
                  <span className="bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded text-xs font-mono">{dashboardCategory || 'General'}</span>
                  <span>• Manage your dashboard views</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="icon"
              className="bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-transform active:scale-95"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleOpenAddDialog}
              className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 gap-2 transition-transform active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Create View
            </Button>
          </div>
        </div>

        {dashboards.length === 0 ? (
          <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center justify-center min-h-[40vh] border-2 border-dashed border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm p-12">
            <div className="w-20 h-20 rounded-full bg-slate-900/50 flex items-center justify-center mb-6 ring-4 ring-indigo-500/20">
              <LayoutTemplate className="h-10 w-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Dashboards Yet</h2>
            <p className="text-slate-400 mb-8 text-center max-w-sm">Start building your analytics interface by adding a new view.</p>
            <Button onClick={handleOpenAddDialog} variant="secondary" size="lg" className="gap-2">
              <Plus className="h-4 w-4" /> Create First View
            </Button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-slate-300">
                <Activity className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-semibold">Active Views</h2>
                <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full text-white font-mono">{dashboards.length}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dashboards.map((dashboard: IDashboard) => (
                <div
                  key={dashboard._id}
                  className={`
                    relative group overflow-hidden rounded-xl border backdrop-blur-md transition-all duration-300 flex flex-col
                    ${
                      dashboard.isActive
                        ? 'bg-slate-900/60 border-white/10 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10'
                        : 'bg-slate-900/30 border-white/5 opacity-70 grayscale-[0.5] hover:opacity-100 hover:grayscale-0'
                    }
                  `}
                >
                  <div
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transition-opacity duration-300 ${dashboard.isActive ? 'opacity-100' : 'opacity-30'}`}
                  />

                  <div className="p-5 flex-1 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div
                          className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center font-bold text-lg shadow-inner ${dashboard.isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}
                        >
                          <LayoutTemplate className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-100 truncate text-lg leading-tight" title={dashboard.dashboardName}>
                            {dashboard.dashboardName}
                          </h3>
                          <p className="text-xs text-slate-500 font-mono mt-0.5 truncate" title={dashboard.dashboardPath}>
                            {dashboard.dashboardPath}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={dashboard.isActive}
                        onCheckedChange={() => handleToggleActive(dashboard)}
                        className="data-[state=checked]:bg-emerald-500 shrink-0"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 border-t border-white/5 flex items-center justify-between gap-2">
                    <div className="flex gap-1">
                      <Button size="sm" className="min-w-1" variant="outlineGlassy" onClick={() => handleOpenEditDialog(dashboard)} title="Edit Settings">
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        className="min-w-1"
                        variant="outlineGlassy"
                        onClick={() => handleEdit(dashboard._id, dashboard.dashboardName, dashboard.dashboardPath)}
                        title="Build Layout"
                      >
                        <MousePointer2 className="h-4 w-4" />
                      </Button>

                      <Button size="sm" className="min-w-1" variant="outlineGlassy" onClick={() => handlePreview(dashboard._id)} title="Preview">
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button size="sm" className="min-w-1" variant="outlineGlassy" onClick={() => handleLiveLink(dashboard.dashboardPath)} title="Visit Live">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button size="sm" className="min-w-1" variant="outlineGlassy" onClick={() => initiateDelete(dashboard)} title="Delete View">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-400" />
                Add New View
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAddDialogOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Dashboard Name</Label>
                <input
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  placeholder="e.g. Sales Overview"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Route Path</Label>
                <input
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-sm"
                  value={pathInput}
                  onChange={e => setPathInput(e.target.value)}
                  placeholder="/dashboard/sales"
                />
              </div>
            </div>

            <div className="p-5 bg-white/5 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="text-slate-400 hover:text-white">
                Cancel
              </Button>
              <Button
                onClick={handleSaveDashboard}
                disabled={!nameInput || !pathInput || isAdding}
                className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[100px]"
              >
                {isAdding ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Create View'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {isEditDialogOpen && selectedDashboardToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Edit className="h-4 w-4 text-blue-400" />
                Edit Settings
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditDialogOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Dashboard Name</Label>
                <input
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Route Path</Label>
                <input
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                  value={pathInput}
                  onChange={e => setPathInput(e.target.value)}
                />
              </div>
            </div>

            <div className="p-5 bg-white/5 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="text-slate-400 hover:text-white">
                Cancel
              </Button>
              <Button onClick={handleUpdateDashboard} className="bg-blue-600 hover:bg-blue-500 text-white min-w-[100px]">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {isDeleteDialogOpen && dashboardToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-red-500/20 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-red-500/5">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Delete View?</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6">
              <p className="text-slate-300">
                Are you sure you want to delete <span className="font-bold text-white">{dashboardToDelete.dashboardName}</span>?
              </p>
              <div className="mt-3 bg-red-950/30 border border-red-500/10 rounded-lg p-3 text-sm text-red-300/80">
                This will permanently remove the dashboard configuration and layout.
              </div>
            </div>

            <div className="p-5 bg-white/5 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="text-slate-400 hover:text-white">
                Cancel
              </Button>
              <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-500 text-white border-none shadow-lg shadow-red-500/20">
                Delete View
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default DashboardBuilderPage;
