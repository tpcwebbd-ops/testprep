'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Edit,
  GripVertical,
  Plus,
  Save,
  Trash2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Box,
  Layers,
  PieChart,
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { AllWidgets, AllWidgetsKeys } from '@/components/dashboard-builder/widgets/all-widgets-index/all-widgets-index';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

import { useGetDashboardsQuery, useUpdateDashboardMutation } from '@/redux/features/dashboard-builder/dashboardBuilderSlice';

type ItemType = 'widget';

interface DashboardContent {
  id: string;
  key: string;
  name: string;
  type: ItemType;
  heading?: string;
  data: unknown;
  [key: string]: unknown;
}

interface IDashboard {
  _id: string;
  dashboardName: string;
  dashboardPath: string;
  content: DashboardContent[];
  isActive: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENT_MAP: Record<string, { collection: any; keys: string[]; label: string; icon: any; color: string }> = {
  widget: {
    collection: AllWidgets,
    keys: AllWidgetsKeys,
    label: 'Widget',
    icon: PieChart,
    color: 'text-violet-400 from-violet-500 to-purple-500',
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getTypeStyles = (type: ItemType) => {
  return {
    border: 'border-violet-500/30 hover:border-violet-400/60',
    bg: 'bg-slate-900/40',
    badge: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
    icon: 'text-violet-400',
    glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)]',
  };
};

interface SortableItemProps {
  item: DashboardContent;
  onEdit: (item: DashboardContent) => void;
  onDelete: (item: DashboardContent) => void;
  onOpenMoveDialog: (item: DashboardContent) => void;
}

const SortableItem = ({ item, onEdit, onDelete, onOpenMoveDialog }: SortableItemProps) => {
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
          <span>Unknown Widget: {item.type || 'Undefined'}</span>
        </div>
        <Button onClick={() => onDelete(item)} size="sm" variant="destructive" className="h-8 w-8 p-0">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // eslint -disable-next-line @typescript-eslint/no-explicit-any
  // const ComponentToRender = (config as any).query;

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
                <ArrowUp className="h-4 w-4" />
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
                <span className="text-xs font-medium text-slate-200 tracking-wide truncate max-w-[200px] flex items-center gap-2">
                  {mapEntry.icon && <mapEntry.icon className="h-3 w-3 opacity-50" />}
                  {item.heading || item.key}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                onClick={() => onEdit(item)}
                size="sm"
                className="min-w-1 h-8 w-8 p-0 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-none"
              >
                <Edit className="h-4 w-4" />
              </Button>

              <Button
                onClick={() => onDelete(item)}
                size="sm"
                className="min-w-1 h-8 w-8 p-0 bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border-none"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-6 pt-16 text-slate-300 min-h-[150px]">
            <div className="z-10 pointer-events-none select-none opacity-90 group-hover:opacity-100 transition-opacity relative">
              <div className="absolute inset-0 z-50 bg-transparent" />
              {/* {ComponentToRender && <ComponentToRender data={JSON.stringify(item.data)} />} */}
              <p>{item.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function EditDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const dashboardPathParam = searchParams.get('dashboardPath');
  const dashboardNameParam = searchParams.get('dashboardName');

  const normalizedPath = useMemo(() => dashboardPathParam?.replace(/-/g, '/') || '', [dashboardPathParam]);
  const normalizedName = useMemo(() => dashboardNameParam || '', [dashboardNameParam]);

  const {
    data: dashboardsData,
    isLoading,
    error,
    refetch,
  } = useGetDashboardsQuery({
    page: 1,
    limit: 1000,
    q: normalizedName,
  });

  const [updateDashboard, { isLoading: isUpdating }] = useUpdateDashboardMutation();

  const currentDashboard = useMemo(() => {
    if (!dashboardsData?.dashboards) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dashboardsData.dashboards.find((c: any) => c.dashboardName === normalizedName && c.dashboardPath === normalizedPath) as IDashboard | undefined;
  }, [dashboardsData, normalizedName, normalizedPath]);

  const [items, setItems] = useState<DashboardContent[]>([]);

  const [editingItem, setEditingItem] = useState<DashboardContent | null>(null);
  const [deletingItem, setDeletingItem] = useState<DashboardContent | null>(null);
  const [movingItem, setMovingItem] = useState<DashboardContent | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDockExpanded, setIsDockExpanded] = useState(true);

  const [paginationPage, setPaginationPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    if (currentDashboard?.content) {
      setItems(Array.isArray(currentDashboard.content) ? currentDashboard.content : []);
    }
  }, [currentDashboard]);

  useEffect(() => {
    setPaginationPage(1);
  }, [isAddModalOpen]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

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

  const handleAddItem = (key: string) => {
    const type: ItemType = 'widget';
    const mapEntry = COMPONENT_MAP[type];
    const config = mapEntry.collection[key];

    const newItem: DashboardContent = {
      id: `${type}-${key}-${Date.now()}`,
      key: key,
      name: config.name || `${mapEntry.label} ${key}`,
      type: type,
      heading: `${mapEntry.label}: ${key.replace(/-/g, ' ')}`,
      data: config.data,
    };

    setItems([...items, newItem]);
    toast.success('Widget added');

    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
    setIsAddModalOpen(false);
  };

  const onSubmitEdit = (updatedData: unknown) => {
    if (editingItem) setItems(items.map(item => (item.id === editingItem.id ? { ...item, data: updatedData } : item)));
    setEditingItem(null);
    toast.success('Widget updated locally');
  };

  const handleConfirmDelete = () => {
    if (deletingItem) {
      setItems(items.filter(item => item.id !== deletingItem.id));
      setDeletingItem(null);
    }
  };

  const handleSubmitAll = async () => {
    if (!currentDashboard?._id) {
      toast.error('Dashboard context lost. Please reload.');
      return;
    }

    try {
      await updateDashboard({
        id: currentDashboard._id,
        content: items,
      }).unwrap();
      toast.success('All changes saved successfully!');
    } catch (err) {
      toast.error('Failed to save changes');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-violet-500/30 blur-3xl rounded-full animate-pulse" />
          <RefreshCw className="h-10 w-10 text-violet-400 animate-spin relative z-10" />
        </div>
        <p className="text-slate-400 animate-pulse">Loading dashboard layout...</p>
      </div>
    );
  }

  if (error || (!isLoading && !currentDashboard)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/10 flex flex-col items-center text-center max-w-md backdrop-blur-sm">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Data Found</h2>
          <p className="text-slate-400 mb-6">
            We couldn&apos;t find <strong>{normalizedPath}</strong>. Please check the URL or return to the dashboard.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => router.back()} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
            <Button onClick={() => refetch()} variant="secondary">
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 overflow-x-hidden selection:bg-violet-500/30 font-sans pb-32">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-900/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light" />
      </div>

      <div className="relative z-10 border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-violet-400">{currentDashboard?.dashboardName}</span>
                <span className="text-slate-600">/</span>
                <span className="font-mono text-sm text-slate-400">{currentDashboard?.dashboardPath}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-500 font-mono hidden md:block">{items.length} Widgets</div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {items.length === 0 ? (
          <div className="animate-in zoom-in-95 duration-700 fade-in flex flex-col items-center justify-center min-h-[40vh] border-2 border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm p-8 mt-10">
            <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mb-4 text-violet-400">
              <LayoutDashboard className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Empty Canvas</h2>
            <p className="text-slate-400 text-center max-w-md mb-8">This dashboard has no widgets. Click &quot;Add Widget&quot; below to start building.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-5">
                {items.map(item => (
                  <SortableItem key={item.id} item={item} onEdit={setEditingItem} onDelete={setDeletingItem} onOpenMoveDialog={setMovingItem} />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div className="backdrop-blur-xl shadow-2xl rounded-xl border border-violet-500/30 bg-slate-900/90 p-4 flex items-center gap-4 transform scale-105 cursor-grabbing">
                  <GripVertical className="h-6 w-6 text-violet-400" />
                  <span className="text-white font-medium text-lg">Moving Widget...</span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <div className="w-full max-w-4xl flex flex-col items-center relative">
          <button
            onClick={() => setIsDockExpanded(!isDockExpanded)}
            className={`
              pointer-events-auto relative z-20 flex items-center justify-center gap-2 px-5 py-2 rounded-full 
              font-medium text-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
              ${
                isDockExpanded
                  ? 'mb-[-20px] bg-slate-800 text-slate-400 opacity-0 translate-y-4'
                  : 'bg-slate-900 border border-white/10 text-slate-200 shadow-xl hover:scale-105 hover:bg-slate-800 hover:text-white translate-y-0'
              }
            `}
          >
            <Layers className="h-4 w-4 text-violet-400" />
            <span>Open Tools</span>
            <ArrowUp className="h-3 w-3" />
          </button>

          <div
            className={`
              pointer-events-auto w-full relative z-10 overflow-hidden
              bg-slate-900/80 backdrop-blur-2xl border border-white/10 
              shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)]
              rounded-2xl
              transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
              ${isDockExpanded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none h-0'}
            `}
          >
            <div
              onClick={() => setIsDockExpanded(false)}
              className="absolute top-0 left-0 right-0 h-4 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group"
            >
              <div className="w-12 h-1 rounded-full bg-slate-700 group-hover:bg-slate-500 transition-colors" />
            </div>

            <div className="flex items-center justify-between p-4 pt-6 h-24">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="h-12 bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20 px-6 rounded-xl font-semibold gap-2 transition-transform active:scale-95 group"
                >
                  <div className="p-1 rounded-full bg-white/20 group-hover:rotate-90 transition-transform duration-300">
                    <Plus className="h-4 w-4" />
                  </div>
                  Add Widget
                </Button>

                <div className="h-8 w-px bg-white/10 hidden sm:block" />

                <div className="hidden sm:flex flex-col">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Status</span>
                  <span className="text-xs text-violet-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                    Editing
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setIsDockExpanded(false)}
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>

                <Button
                  onClick={handleSubmitAll}
                  disabled={isUpdating}
                  className={`
                    h-12 px-6 rounded-xl font-medium gap-2 transition-all border
                    ${
                      isUpdating
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/30'
                    }
                  `}
                >
                  {isUpdating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span className="hidden sm:inline">{isUpdating ? 'Saving...' : 'Save Changes'}</span>
                </Button>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="p-0 overflow-hidden bg-slate-950/95 backdrop-blur-3xl border-white/10 shadow-2xl text-white gap-0 flex flex-col max-w-[90vw] min-w-[90vw] h-[85vh] mt-10">
          {(() => {
            const meta = COMPONENT_MAP.widget;
            const dataSource = meta.keys;
            const totalItems = dataSource.length;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
            const paginatedItems = dataSource.slice((paginationPage - 1) * ITEMS_PER_PAGE, paginationPage * ITEMS_PER_PAGE);

            return (
              <>
                <div className="shrink-0 flex flex-col bg-white/5 border-b border-white/10">
                  <div className="flex items-center justify-between p-6 pb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${meta.color} shadow-lg`}>
                        <meta.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">Select {meta.label}</DialogTitle>
                        <p className="text-slate-400 text-sm mt-1">Choose a component to add to your dashboard.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1 min-h-0 w-full bg-black/20">
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                      {paginatedItems.map(key => {
                        const config = meta.collection[key];
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const PreviewComp = (config as any).query;

                        return (
                          <div
                            key={key}
                            className="group relative bg-slate-900 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col h-[300px]"
                          >
                            <div className="relative flex-1 bg-black/40 overflow-hidden">
                              <div className="absolute inset-0 flex items-center justify-center p-4">
                                <div className="w-[200%] h-[200%] origin-center scale-[0.4] pointer-events-none select-none flex items-start justify-center pt-10">
                                  {PreviewComp ? <PreviewComp data={JSON.stringify(config.data)} /> : <div className="text-slate-600">No Preview</div>}
                                </div>
                              </div>
                            </div>

                            <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between gap-2 relative z-10">
                              <h4 className="text-sm font-bold text-slate-200 truncate flex-1">{key}</h4>
                              <Button onClick={() => handleAddItem(key)} size="sm" className="h-8 bg-violet-600 hover:bg-violet-500 text-white">
                                <Plus className="mr-1 h-3 w-3" /> Add
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </ScrollArea>

                {totalPages > 1 && (
                  <div className="shrink-0 p-4 border-t border-white/10 bg-slate-900/50 backdrop-blur-md flex items-center justify-center gap-4 z-20">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPaginationPage(p => Math.max(1, p - 1))}
                      disabled={paginationPage === 1}
                      className="rounded-full text-slate-400 hover:text-white"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <span className="text-sm font-mono text-slate-300">
                      {paginationPage} / {totalPages}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPaginationPage(p => Math.min(totalPages, p + 1))}
                      disabled={paginationPage === totalPages}
                      className="rounded-full text-slate-400 hover:text-white"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      <Dialog open={!!movingItem} onOpenChange={() => setMovingItem(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white w-full max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Move Widget</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Button onClick={handleMoveUp} className="h-12 text-lg bg-slate-800 hover:bg-slate-700 justify-start px-6">
              <ArrowUp className="mr-3 h-5 w-5 text-violet-400" /> Move Up
            </Button>
            <Button onClick={handleMoveDown} className="h-12 text-lg bg-slate-800 hover:bg-slate-700 justify-start px-6">
              <ArrowDown className="mr-3 h-5 w-5 text-violet-400" /> Move Down
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-sm">
          <div className="flex flex-col items-center text-center p-2">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <DialogTitle className="text-xl font-bold mb-2">Remove Widget?</DialogTitle>
            <p className="text-slate-400 mb-6 text-sm">
              Are you sure you want to remove <span className="text-white font-medium">{deletingItem?.heading}</span>?
            </p>
            <div className="flex gap-3 w-full">
              <Button onClick={() => setDeletingItem(null)} variant="ghost" className="flex-1 hover:bg-white/10 text-slate-400">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-6xl h-[85vh] mt-10 p-0 bg-slate-900/95 backdrop-blur-xl border-white/10 text-white flex flex-col">
          <DialogHeader className="p-4 border-b border-white/10 bg-white/5 shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-violet-400" /> Edit Widget
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 w-full bg-black/20">
            {editingItem &&
              (() => {
                const meta = COMPONENT_MAP[editingItem.type];
                const config = meta.collection[editingItem.key];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const Mutation = (config as any).mutation;
                return Mutation ? (
                  <Mutation data={JSON.stringify(editingItem.data)} onSave={onSubmitEdit} />
                ) : (
                  <div className="p-20 text-center text-slate-500">
                    <Box className="h-10 w-10 mx-auto mb-4 opacity-50" />
                    No settings available for this widget.
                  </div>
                );
              })()}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function EditDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin" />
          </div>
        </div>
      }
    >
      <EditDashboardContent />
    </Suspense>
  );
}
