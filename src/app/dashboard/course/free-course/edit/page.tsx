'use client';

import { useState, useEffect, Suspense, useMemo, ComponentType } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Edit, GripVertical, Plus, Save, Trash2, AlertTriangle, RefreshCw, ChevronLeft, BookOpen, GraduationCap, Layers, Video } from 'lucide-react';
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
  icon: ComponentType<{ className?: string }>;
  color: string;
}

const COMPONENT_MAP: Record<ItemType, ComponentMapEntry> = {
  assignment: {
    collection: AllAssignments as Record<string, WidgetConfig>,
    keys: AllAssignmentsKeys,
    label: 'Assignment',
    icon: GraduationCap,
    color: 'text-emerald-400 from-emerald-500 to-green-500',
  },
  video: {
    collection: AllVideos as Record<string, WidgetConfig>,
    keys: AllVideosKeys,
    label: 'Video',
    icon: Video,
    color: 'text-indigo-400 from-indigo-500 to-purple-500',
  },
};

const getTypeStyles = (type: ItemType) => {
  if (type === 'video') {
    return {
      border: 'border-indigo-500/30 hover:border-indigo-400/60',
      bg: 'bg-slate-900/40',
      icon: 'text-indigo-400',
      glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)]',
    };
  }
  return {
    border: 'border-emerald-500/30 hover:border-emerald-400/60',
    bg: 'bg-slate-900/40',
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
          <span>Unknown Component</span>
        </div>
        <Button onClick={() => onDelete(item)} size="sm" variant="destructive" className="h-8 w-8 p-0">
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
              <span className="text-xs font-medium text-slate-200 tracking-wide truncate max-w-[200px] flex items-center gap-2">
                {mapEntry.icon && <mapEntry.icon className="h-3 w-3 opacity-50" />}
                {item.heading || item.key}
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              <Button onClick={() => onEdit(item)} size="sm" className="h-8 w-8 p-0 bg-white/5 hover:bg-white/10 text-slate-300 border-none">
                <Edit className="h-4 w-4" />
              </Button>
              <Button onClick={() => onDelete(item)} size="sm" className="h-8 w-8 p-0 bg-white/5 hover:bg-red-500/20 text-slate-300 border-none">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-6 pt-16 text-slate-300 min-h-[100px]">
            <div className="z-10 pointer-events-none select-none opacity-90 group-hover:opacity-100 transition-opacity relative">
              <div className="absolute inset-0 z-50 bg-transparent" />
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ItemType>('assignment');
  const [isDockExpanded, setIsDockExpanded] = useState(true);

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

  const handleAddItem = (key: string, type: ItemType) => {
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
    setIsAddModalOpen(false);
  };

  const onSubmitEdit = (updatedData: unknown) => {
    if (editingItem) setItems(prev => prev.map(i => (i.id === editingItem.id ? { ...i, data: updatedData } : i)));
    setEditingItem(null);
    toast.success('Content updated locally');
  };

  const handleConfirmDelete = () => {
    if (deletingItem) {
      setItems(prev => prev.filter(i => i.id !== deletingItem.id));
      setDeletingItem(null);
    }
  };

  const handleSubmitAll = async () => {
    if (!currentCourse?._id) return;
    try {
      await updateCourse({ id: currentCourse._id, content: items }).unwrap();
      toast.success('Production saved');
    } catch {
      toast.error('Sync failed');
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <RefreshCw className="h-10 w-10 text-indigo-400 animate-spin" />
      </div>
    );
  if (error || !currentCourse)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );

  return (
    <main className="min-h-screen bg-slate-950 selection:bg-indigo-500/30 pb-32">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-900/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button size="icon" variant="ghost" onClick={() => router.back()} className="text-slate-400 hover:text-white">
            <ChevronLeft />
          </Button>
          <h1 className="text-lg font-bold text-white">
            <span className="text-emerald-400">{currentCourse.courseDay}</span> / {currentCourse.courseName}
          </h1>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] border-2 border-dashed border-white/10 rounded-3xl bg-white/5 p-8 mt-10">
            <BookOpen className="h-12 w-12 text-emerald-400 mb-4" />
            <h2 className="text-2xl font-bold text-white">Empty Classroom</h2>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-5">
                {items.map(item => (
                  <SortableItem key={item.id} item={item} onEdit={setEditingItem} onDelete={setDeletingItem} />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeId && (
                <div className="backdrop-blur-xl shadow-2xl rounded-xl border border-indigo-500/30 bg-slate-900/90 p-4 text-white">Reordering...</div>
              )}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="w-full max-w-4xl flex flex-col items-center">
          {!isDockExpanded && (
            <button
              onClick={() => setIsDockExpanded(true)}
              className="pointer-events-auto bg-slate-900 border border-white/10 text-slate-200 px-5 py-2 rounded-full flex items-center gap-2"
            >
              <Layers className="h-4 w-4 text-emerald-400" /> Tools
            </button>
          )}
          <div
            className={`pointer-events-auto w-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl transition-all duration-500 overflow-hidden ${isDockExpanded ? 'h-24 opacity-100' : 'h-0 opacity-0'}`}
          >
            <div className="flex items-center justify-between p-4 h-full">
              <Button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl gap-2 h-12 px-6">
                <Plus className="h-4 w-4" /> Add Widget
              </Button>
              <div className="flex items-center gap-2">
                <Button onClick={() => setIsDockExpanded(false)} variant="ghost" className="text-slate-400">
                  Close
                </Button>
                <Button
                  onClick={handleSubmitAll}
                  disabled={isUpdating}
                  className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl h-12 px-6"
                >
                  {isUpdating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="p-0 bg-slate-950/95 border-white/10 max-w-[90vw] h-[85vh] flex flex-col">
          <div className="p-6 border-b border-white/10 flex gap-4 bg-white/5">
            {(['assignment', 'video'] as ItemType[]).map(t => (
              <Button
                key={t}
                variant={activeTab === t ? 'secondary' : 'ghost'}
                onClick={() => setActiveTab(t)}
                className={`capitalize rounded-full px-6 ${activeTab === t ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                {t}s
              </Button>
            ))}
          </div>
          <ScrollArea className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {COMPONENT_MAP[activeTab].keys.map(key => {
                const config = COMPONENT_MAP[activeTab].collection[key];
                const Preview = config.query;
                return (
                  <div key={key} className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[300px]">
                    <div className="flex-1 bg-black/40 scale-[0.4] origin-center opacity-70">
                      <Preview data={JSON.stringify(config.data)} />
                    </div>
                    <div className="p-4 bg-white/5 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-200">{key}</span>
                      <Button onClick={() => handleAddItem(key, activeTab)} size="sm" className="bg-indigo-600">
                        Add
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-6xl h-[85vh] p-0 bg-slate-900 border-white/10 flex flex-col overflow-hidden">
          <DialogHeader className="p-4 border-b border-white/10 shrink-0">
            <DialogTitle className="text-white flex items-center gap-2">
              <Edit className="h-5 w-5 text-indigo-400" /> Editor
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1">
            {editingItem &&
              (() => {
                const MutationComp = COMPONENT_MAP[editingItem.type].collection[editingItem.key].mutation;
                return <MutationComp data={JSON.stringify(editingItem.data)} onSave={onSubmitEdit} />;
              })()}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-sm p-6 text-center">
          <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <DialogTitle className="text-xl font-bold mb-6">Confirm Deletion</DialogTitle>
          <div className="flex gap-3">
            <Button onClick={() => setDeletingItem(null)} variant="ghost" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} className="flex-1 bg-red-600">
              Delete
            </Button>
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
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
        </div>
      }
    >
      <EditCourseContent />
    </Suspense>
  );
}
