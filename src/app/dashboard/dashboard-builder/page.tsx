'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  LayoutDashboard,
  X,
  AlertTriangle,
  RefreshCw,
  LayoutTemplate,
  Activity,
  MousePointer2,
  Search,
  Filter,
} from 'lucide-react';
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
  // Local state for client-side search/filter if needed
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch ALL dashboards (q='' ensures backend returns everything)
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

  const [addDashboard, { isLoading: isAdding }] = useAddDashboardMutation();
  const [updateDashboard] = useUpdateDashboardMutation();
  const [deleteDashboard] = useDeleteDashboardMutation();

  // Process and sort data
  const dashboards = useMemo(() => {
    const rawDashboards = dashboardsData?.dashboards || [];

    // 1. Map to Interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let processed = rawDashboards.map((item: any) => ({
      ...item,
      _id: item._id,
      isActive: item.isActive ?? true,
      dashboardName: item.dashboardName,
      dashboardPath: item.dashboardPath || '/',
    }));

    // 2. Client-side Search (Optional, for instant feedback)
    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      processed = processed.filter((d: IDashboard) => d.dashboardName.toLowerCase().includes(lowerTerm) || d.dashboardPath.toLowerCase().includes(lowerTerm));
    }

    // 3. Sort by Name
    return processed.sort((a: IDashboard, b: IDashboard) => a.dashboardName.localeCompare(b.dashboardName));
  }, [dashboardsData, searchTerm]);

  // Modal States
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Selection States
  const [selectedDashboardToEdit, setSelectedDashboardToEdit] = useState<IDashboard | null>(null);
  const [dashboardToDelete, setDashboardToDelete] = useState<IDashboard | null>(null);

  // Form Inputs
  const [pathInput, setPathInput] = useState<string>('');
  const [nameInput, setNameInput] = useState<string>('');

  // --- Handlers ---

  const handleOpenAddDialog = () => {
    setPathInput('');
    setNameInput('');
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

    // Check duplicates locally
    const exists = dashboards.some((d: IDashboard) => d.dashboardPath === pathInput);
    if (exists) {
      toast.error(`Path ${pathInput} already exists!`);
      return;
    }

    try {
      await addDashboard({
        dashboardName: nameInput,
        dashboardPath: pathInput,
        isActive: true,
        content: [],
      }).unwrap();

      toast.success(`Dashboard "${nameInput}" created`);
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
      // Optimistic update handled by refetch for now
      await updateDashboard({ id: dashboard._id, isActive: updatedStatus }).unwrap();
      refetch();
      toast.success(`Dashboard ${updatedStatus ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error('Failed to update status');
      console.error(err);
    }
  };

  const handleEdit = (id: string, name: string, path: string) => {
    // Navigate to the builder/editor for this dashboard
    const encodedPath = path.replaceAll('/', '-');
    window.open(`/dashboard/dashboard-builder/edit?dashboardName=${encodeURIComponent(name)}&dashboardPath=${encodedPath}`, '_blank');
  };

  const handlePreview = (id: string) => {
    window.open(`/dashboard/preview?id=${id}`, '_blank');
  };

  const handleLiveLink = (path: string) => {
    window.open(`${path}`, '_blank');
  };

  // --- Rendering ---

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
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6 animate-in slide-in-from-top-4 duration-500">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <LayoutDashboard className="h-8 w-8 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Builder</h1>
                <p className="text-slate-400 text-sm">Create and manage your application&apos;s dashboard layouts.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search views..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all w-48 md:w-64"
              />
            </div>
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="icon"
              className="bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-transform active:scale-95"
              title="Refresh Data"
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

        {/* Content Area */}
        {dashboards.length === 0 ? (
          <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center justify-center min-h-[40vh] border-2 border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm p-12">
            <div className="w-24 h-24 rounded-full bg-slate-900/50 flex items-center justify-center mb-6 ring-4 ring-indigo-500/20 relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
              <LayoutTemplate className="h-12 w-12 text-indigo-400 relative z-10" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Dashboards Found</h2>
            <p className="text-slate-400 mb-8 text-center max-w-sm">
              {searchTerm ? 'No results match your search.' : 'Start building your analytics interface by adding a new view.'}
            </p>
            <Button onClick={handleOpenAddDialog} variant="secondary" size="lg" className="gap-2">
              <Plus className="h-4 w-4" /> {searchTerm ? 'Create New View' : 'Create First View'}
            </Button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Bar */}
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="flex items-center gap-2 text-slate-300">
                <Activity className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-semibold">All Views</h2>
                <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full text-white font-mono">{dashboards.length}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Filter className="h-3 w-3" />
                <span>Sorted by Name</span>
              </div>
            </div>

            {/* Grid */}
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
                  {/* Decorative Top Bar */}
                  <div
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-opacity duration-300 ${dashboard.isActive ? 'opacity-100' : 'opacity-30'}`}
                  />

                  <div className="p-5 flex-1 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div
                          className={`h-12 w-12 shrink-0 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner transition-colors ${dashboard.isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}
                        >
                          <LayoutTemplate className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <h3
                            className="font-bold text-slate-100 truncate text-lg leading-tight group-hover:text-indigo-200 transition-colors"
                            title={dashboard.dashboardName}
                          >
                            {dashboard.dashboardName}
                          </h3>
                          <p className="text-xs text-slate-500 font-mono mt-1 truncate flex items-center gap-1" title={dashboard.dashboardPath}>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
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

                  {/* Action Footer */}
                  <div className="p-3 bg-white/5 border-t border-white/5 flex items-center justify-between gap-2">
                    <div className="flex gap-1">
                      <Button className="min-w-1" size="sm" variant="outlineGlassy" onClick={() => handleOpenEditDialog(dashboard)} title="Edit Settings">
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

                      <Button className="min-w-1" size="sm" variant="outlineGlassy" onClick={() => handlePreview(dashboard._id)} title="Preview">
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button className="min-w-1" size="sm" variant="outlineGlassy" onClick={() => handleLiveLink(dashboard.dashboardPath)} title="Visit Live">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button size="sm" variant="outlineGlassy" onClick={() => initiateDelete(dashboard)} title="Delete View" className="min-w-1">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- ADD DIALOG --- */}
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
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  placeholder="e.g. Analytics Overview"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Route Path</Label>
                <input
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-sm placeholder:text-slate-600"
                  value={pathInput}
                  onChange={e => setPathInput(e.target.value)}
                  placeholder="/dashboard/analytics"
                />
                <p className="text-xs text-slate-500">The URL path where this dashboard will be accessible.</p>
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

      {/* --- EDIT DIALOG --- */}
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

      {/* --- DELETE DIALOG --- */}
      {isDeleteDialogOpen && dashboardToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-red-500/20 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-red-500/5">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Delete View?</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDeleteDialogOpen(false)}>
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
