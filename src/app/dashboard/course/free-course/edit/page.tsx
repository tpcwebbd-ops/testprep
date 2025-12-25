'use client';

import { useState, useEffect, Suspense, useMemo, ComponentType } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Edit,
  GripVertical,
  Plus,
  Save,
  Trash2,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  BookOpen,
  GraduationCap,
  Video,
  ChevronDown,
  LayoutGrid,
  ChevronRight,
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AllAssignments, AllAssignmentsKeys } from '@/components/course/assignment/all-assignment-index/all-assignment-index';
import { AllVideos, AllVideosKeys } from '@/components/course/video/all-video-index/all-video-index';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useGetCoursesQuery, useUpdateCourseMutation } from '@/redux/features/course/courseSlice';
import { IconType } from 'react-icons/lib';

type ItemType = 'assignment' | 'video';

interface CourseContent {
  id: string;
  key: string;
  name: string;
  type: ItemType;
  heading?: string;
  data: unknown;
  [key: string]: unknown;
}

interface ICourse {
  _id: string;
  courseName: string;
  courseDay: string;
  content: CourseContent[];
  isActive: boolean;
}

interface WidgetConfig {
  query: ComponentType<{ data: string }>;
  mutation: ComponentType<{ data: string; onSave: (data: unknown) => void }>;
  data: unknown;
  name?: string;
}

interface ComponentMapEntry {
  collection: Record<string, WidgetConfig>;
  keys: string[];
  label: string;
  icon: IconType;
  color: string;
}

const COMPONENT_MAP: Record<ItemType, ComponentMapEntry> = {
  assignment: {
    collection: AllAssignments as Record<string, WidgetConfig>,
    keys: AllAssignmentsKeys,
    label: 'Assignments',
    icon: GraduationCap,
    color: 'text-emerald-400 from-emerald-500 to-teal-500',
  },
  video: {
    collection: AllVideos as Record<string, WidgetConfig>,
    keys: AllVideosKeys,
    label: 'Videos',
    icon: Video,
    color: 'text-indigo-400 from-indigo-500 to-purple-500',
  },
};

const getTypeStyles = (type: ItemType) => {
  if (type === 'video') {
    return {
      border: 'border-indigo-500/30 hover:border-indigo-400/60',
      bg: 'bg-slate-900/60',
      badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
      icon: 'text-indigo-400',
      glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)]',
    };
  }
  return {
    border: 'border-emerald-500/30 hover:border-emerald-400/60',
    bg: 'bg-slate-900/40',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    icon: 'text-emerald-400',
    glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]',
  };
};

interface SortableItemProps {
  item: CourseContent;
  onEdit: (item: CourseContent) => void;
  onDelete: (item: CourseContent) => void;
}

const SortableItem = ({ item, onEdit, onDelete }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const mapEntry = COMPONENT_MAP[item.type];
  const config = mapEntry ? mapEntry.collection[item.key] : null;

  if (!mapEntry || !config) {
    return (
      <div ref={setNodeRef} style={style} className="p-4 border border-red-500/30 bg-red-500/10 rounded-xl flex items-center justify-between">
        <div className="text-red-400 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Unknown Component: {item.key}</span>
        </div>
        <Button onClick={() => onDelete(item)} size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/20">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const ComponentToRender = config.query;
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
              <button
                {...attributes}
                {...listeners}
                className={`cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-white/10 transition-colors ${styles.icon}`}
              >
                <GripVertical className="h-5 w-5" />
              </button>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-200 tracking-wide truncate max-w-[250px] flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.type === 'video' ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
                  {item.heading || item.key}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              <Button onClick={() => onEdit(item)} size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10 text-slate-300">
                <Edit className="h-4 w-4" />
              </Button>
              <Button onClick={() => onDelete(item)} size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-red-500/20 text-slate-300">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-6 pt-16 text-slate-300 min-h-[100px]">
            <div className="z-10 pointer-events-none select-none opacity-90 group-hover:opacity-100 transition-opacity">
              <ComponentToRender data={JSON.stringify(item.data)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function EditCourseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseDayParam = searchParams.get('courseDay');
  const courseNameParam = searchParams.get('courseName');
  const normalizedDay = useMemo(() => courseDayParam?.replace(/-/g, ' ') || '', [courseDayParam]);
  const normalizedName = useMemo(() => courseNameParam || '', [courseNameParam]);

  const { data: coursesData, isLoading, error } = useGetCoursesQuery({ page: 1, limit: 1000, q: normalizedName });
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  const currentCourse = useMemo(() => {
    if (!coursesData?.courses) return undefined;
    return (coursesData.courses as ICourse[]).find(c => c.courseName === normalizedName && c.courseDay === normalizedDay);
  }, [coursesData, normalizedName, normalizedDay]);

  const [items, setItems] = useState<CourseContent[]>([]);
  const [editingItem, setEditingItem] = useState<CourseContent | null>(null);
  const [deletingItem, setDeletingItem] = useState<CourseContent | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeAddType, setActiveAddType] = useState<ItemType | null>(null);
  const [isDockExpanded, setIsDockExpanded] = useState(true);
  const [paginationPage, setPaginationPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    if (currentCourse?.content) setItems(Array.isArray(currentCourse.content) ? currentCourse.content : []);
  }, [currentCourse]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems(prev => {
        const oldIndex = prev.findIndex(i => i.id === active.id);
        const newIndex = prev.findIndex(i => i.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const handleAddItem = (type: ItemType, key: string) => {
    const mapEntry = COMPONENT_MAP[type];
    const config = mapEntry.collection[key];
    const newItem: CourseContent = {
      id: `${type}-${key}-${Date.now()}`,
      key: key,
      name: config.name || `${mapEntry.label} ${key}`,
      type: type,
      heading: `${mapEntry.label}: ${key.replace(/-/g, ' ')}`,
      data: config.data,
    };
    setItems(prev => [...prev, newItem]);
    toast.success(`${mapEntry.label} added`);
    setActiveAddType(null);
  };

  const onSubmitEdit = (updatedData: unknown) => {
    if (editingItem) setItems(prev => prev.map(i => (i.id === editingItem.id ? { ...i, data: updatedData } : i)));
    setEditingItem(null);
    toast.success('Changes applied');
  };

  const handleSubmitAll = async () => {
    if (!currentCourse?._id) return;
    try {
      await updateCourse({ id: currentCourse._id, content: items }).unwrap();
      toast.success('Course contents synchronized');
    } catch {
      toast.error('Failed to sync changes');
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/30 blur-3xl rounded-full animate-pulse" />
          <RefreshCw className="h-10 w-10 text-emerald-400 animate-spin relative z-10" />
        </div>
      </div>
    );

  if (error || !currentCourse)
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <AlertTriangle className="h-16 w-16 text-red-500" />
        <h2 className="text-2xl font-bold text-white">Course Context Missing</h2>
        <Button onClick={() => router.back()} variant="outline">
          Return to Dashboard
        </Button>
      </div>
    );

  return (
    <main className="min-h-screen bg-slate-950 selection:bg-emerald-500/30 overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-900/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[120px] animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-soft-light" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-20 pb-8 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Button size="icon" variant="ghost" onClick={() => router.back()} className="rounded-full text-slate-400 hover:text-white hover:bg-white/10">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-white tracking-tight">{currentCourse.courseName}</h1>
          </div>
          <p className="text-emerald-400 font-mono text-sm bg-emerald-500/5 inline-block px-4 py-1.5 rounded-full border border-emerald-500/10">
            {currentCourse.courseDay}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="animate-in zoom-in-95 duration-700 fade-in flex flex-col items-center justify-center min-h-[40vh] border-2 border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm p-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full" />
              <div className="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-2xl">
                <BookOpen className="h-10 w-10 text-emerald-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Empty Curriculum</h2>
            <p className="text-slate-400 text-center max-w-sm">Use the toolkit below to add assignments or video lectures to this day.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-6 pb-60">
                {items.map(item => (
                  <SortableItem key={item.id} item={item} onEdit={setEditingItem} onDelete={setDeletingItem} />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <div className="backdrop-blur-xl shadow-2xl rounded-xl border border-emerald-500/30 bg-slate-900/90 p-4 flex items-center gap-4 transform scale-105 cursor-grabbing">
                  <GripVertical className="h-6 w-6 text-emerald-400" />
                  <span className="text-white font-medium">Reordering content...</span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      <div className="fixed bottom-6 left-0 right-0 z-50 flex flex-col items-center justify-end gap-4 pointer-events-none">
        <button
          onClick={() => setIsDockExpanded(!isDockExpanded)}
          className={`pointer-events-auto flex items-center justify-center w-12 h-8 rounded-full bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300 ${!isDockExpanded ? 'animate-bounce ring-1 ring-emerald-500/50 shadow-emerald-500/20' : ''}`}
        >
          {isDockExpanded ? <ChevronDown className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
        </button>

        <div
          className={`flex items-center gap-4 transition-all duration-500 ease-in-out origin-bottom rounded-2xl bg-slate-950/80 backdrop-blur-2xl border border-white/10 shadow-2xl ring-1 ring-white/5 justify-between w-[95%] md:w-[600px] ${isDockExpanded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95 pointer-events-none absolute bottom-0'}`}
        >
          <div className="pointer-events-auto flex items-center gap-2 p-2.5">
            {(['assignment', 'video'] as ItemType[]).map(type => {
              const meta = COMPONENT_MAP[type];
              const Icon = meta.icon;
              const isActive = activeAddType === type;

              return (
                <button
                  key={type}
                  onClick={() => {
                    setActiveAddType(type);
                    setPaginationPage(1);
                  }}
                  className={`group relative flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-300 ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
                >
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-full mb-1 transition-all duration-300 shadow-lg bg-gradient-to-br ${meta.color} text-white group-hover:scale-110`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 group-hover:text-white">{meta.label}</span>
                  {isActive && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white shadow-[0_0_5px_white]" />}
                </button>
              );
            })}
          </div>

          <div className="pointer-events-auto flex items-center gap-3 pr-4">
            <Button
              onClick={handleSubmitAll}
              disabled={isUpdating}
              className="bg-white/5 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl h-12 px-6 backdrop-blur-sm transition-all"
            >
              {isUpdating ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={!!activeAddType} onOpenChange={() => setActiveAddType(null)}>
        <DialogContent className="p-0 overflow-hidden bg-slate-950/95 backdrop-blur-3xl border-white/10 shadow-2xl text-white flex flex-col max-w-[90vw] h-[85vh] mt-10">
          {activeAddType &&
            (() => {
              const meta = COMPONENT_MAP[activeAddType];
              const totalItems = meta.keys.length;
              const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
              const paginatedItems = meta.keys.slice((paginationPage - 1) * ITEMS_PER_PAGE, paginationPage * ITEMS_PER_PAGE);

              return (
                <>
                  <div className="shrink-0 flex flex-col bg-white/5 border-b border-white/10">
                    <div className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${meta.color} shadow-lg text-white`}>
                          <meta.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <DialogTitle className="text-2xl font-bold text-white">Add {meta.label}</DialogTitle>
                          <p className="text-slate-400 text-sm">Select a pre-built {activeAddType} widget to include in this course day.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 bg-black/20">
                    <div className="p-6 grid grid-cols-1 gap-6">
                      {paginatedItems.map(key => {
                        const config = meta.collection[key];
                        const Preview = config.query;
                        return (
                          <div
                            key={key}
                            className="group relative bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col h-[280px]"
                          >
                            <div className="relative flex-1 bg-black/40 overflow-hidden group-hover:bg-black/20 transition-colors">
                              <div className="absolute inset-0 flex items-center justify-center p-4">
                                <div className="w-[200%] h-[200%] origin-center scale-[0.4] pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity">
                                  <Preview data={JSON.stringify(config.data)} />
                                </div>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                            </div>
                            <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-200 truncate pr-2">{key.replace(/-/g, ' ')}</span>
                              <Button
                                onClick={() => handleAddItem(activeAddType, key)}
                                size="sm"
                                className={`bg-gradient-to-br ${meta.color} text-white h-8 px-4 border-none hover:scale-105 transition-transform`}
                              >
                                <Plus className="h-3.5 w-3.5 mr-1" /> Add
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>

                  {totalPages > 1 && (
                    <div className="shrink-0 p-4 border-t border-white/10 bg-slate-900/50 backdrop-blur-md flex items-center justify-between">
                      <div className="text-xs text-slate-500 font-mono">Total: {totalItems} Items</div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPaginationPage(p => Math.max(1, p - 1))}
                          disabled={paginationPage === 1}
                          className="rounded-full w-10 h-10 p-0 hover:bg-white/10"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium text-slate-300">
                          {paginationPage} / {totalPages}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPaginationPage(p => Math.min(totalPages, p + 1))}
                          disabled={paginationPage === totalPages}
                          className="rounded-full w-10 h-10 p-0 hover:bg-white/10"
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

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-6xl h-[85vh] mt-10 p-0 bg-slate-900/95 backdrop-blur-xl border-white/10 text-white flex flex-col">
          <DialogHeader className="p-4 border-b border-white/10 bg-white/5 shrink-0">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Edit className="h-5 w-5 text-emerald-400" />
              Edit {editingItem?.type} Content
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1">
            <div className="p-6">
              {editingItem &&
                (() => {
                  const MutationComp = COMPONENT_MAP[editingItem.type].collection[editingItem.key].mutation;
                  return <MutationComp data={JSON.stringify(editingItem.data)} onSave={onSubmitEdit} />;
                })()}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <Trash2 className="h-8 w-8 text-red-500" />
            </div>
            <DialogTitle className="text-xl font-bold mb-2">Remove Content?</DialogTitle>
            <p className="text-slate-400 mb-8">
              Are you sure you want to delete <span className="text-white font-semibold">{deletingItem?.heading}</span> from this day?
            </p>
            <div className="flex gap-3 w-full">
              <Button onClick={() => setDeletingItem(null)} variant="outline" className="flex-1 border-white/10 hover:bg-white/5">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setItems(prev => prev.filter(i => i.id !== deletingItem?.id));
                  setDeletingItem(null);
                  toast.success('Removed successfully');
                }}
                variant="destructive"
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function EditCourseDayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
        </div>
      }
    >
      <EditCourseContent />
    </Suspense>
  );
}
