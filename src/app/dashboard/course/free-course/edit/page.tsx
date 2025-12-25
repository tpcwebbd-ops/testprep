'use client';

import { useState, useEffect, Suspense, useMemo, ComponentType } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  Layers,
  Sparkles,
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
    color: 'text-purple-400 from-purple-500 to-indigo-500',
  },
};

const getTypeStyles = (type: ItemType) => {
  if (type === 'video') {
    return {
      border: 'border-purple-500/20 hover:border-purple-400/40',
      bg: 'bg-white/5',
      badge: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
      icon: 'text-purple-400',
      glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.2)]',
    };
  }
  return {
    border: 'border-emerald-500/20 hover:border-emerald-400/40',
    bg: 'bg-white/5',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    icon: 'text-emerald-400',
    glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)]',
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

  if (!mapEntry || !config) return null;

  const ComponentToRender = config.query;
  const styles = getTypeStyles(item.type);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative group ${isDragging ? 'z-50' : 'z-0'}`}
    >
      <div
        className={`relative backdrop-blur-2xl transition-all duration-500 overflow-hidden rounded-[2rem] border ${styles.border} ${styles.bg} ${styles.glow} ${isDragging ? 'scale-105 shadow-2xl' : ''}`}
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <button
                {...attributes}
                {...listeners}
                className={`cursor-grab active:cursor-grabbing p-2 rounded-xl hover:bg-white/10 transition-colors ${styles.icon}`}
              >
                <GripVertical className="h-5 w-5" />
              </button>
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-widest uppercase text-white/40">{item.type} module</span>
                <span className="text-sm font-semibold text-white truncate max-w-[200px] md:max-w-md">{item.heading || item.key}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => onEdit(item)} variant="outlineGlassy" size="sm" className="min-w-1">
                <Edit className="h-4 w-4" />
              </Button>
              <Button onClick={() => onDelete(item)} variant="outlineGlassy" size="sm" className="min-w-1">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-8">
            <div className="pointer-events-none select-none">
              <ComponentToRender data={JSON.stringify(item.data)} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
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
  const ITEMS_PER_PAGE = 6;

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
    toast.success(`${mapEntry.label} added to timeline`);
    setActiveAddType(null);
  };

  const onSubmitEdit = (updatedData: unknown) => {
    if (editingItem) setItems(prev => prev.map(i => (i.id === editingItem.id ? { ...i, data: updatedData } : i)));
    setEditingItem(null);
    toast.success('Module updated');
  };

  const handleSubmitAll = async () => {
    if (!currentCourse?._id) return;
    try {
      await updateCourse({ id: currentCourse._id, content: items }).unwrap();
      toast.success('Curriculum synchronized');
    } catch {
      toast.error('Sync failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6">
          <div className="relative">
            <RefreshCw className="h-16 w-16 text-white/20 animate-spin" />
          </div>
          <p className="text-white/40 font-bold tracking-widest uppercase text-xs">Loading Editor Context...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !currentCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] text-center max-w-md shadow-2xl">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Context Error</h2>
          <p className="text-white/50 mb-6">Unable to locate the specific course day metadata.</p>
          <Button onClick={() => router.back()} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 w-full rounded-2xl h-12">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-40 px-4 md:px-10 lg:px-16 pt-8 overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <header className="flex  flex-row md:items-end justify-between gap-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{currentCourse.courseName}</h1>
          <p className="text-emerald-400 font-mono text-sm bg-emerald-400/10 inline-block px-3 py-1 rounded-lg border border-emerald-400/20">
            {currentCourse.courseDay}
          </p>
        </header>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[45vh] bg-white/5 backdrop-blur-md border border-white/10 rounded-[3rem] p-12 text-center"
          >
            <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
              <Layers className="h-10 w-10 text-white/20" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Timeline is Empty</h2>
            <p className="text-white/40 mb-8 max-w-sm">Use the builder dock below to populate this day with assignments and videos.</p>
          </motion.div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-8">
                {items.map(item => (
                  <SortableItem key={item.id} item={item} onEdit={setEditingItem} onDelete={setDeletingItem} />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <div className="backdrop-blur-3xl shadow-2xl rounded-[2rem] border border-white/20 bg-white/10 p-6 flex items-center gap-4 cursor-grabbing">
                  <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Relocating Module</p>
                    <p className="text-white/40 text-xs uppercase tracking-tighter">Release to drop</p>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      <div className="fixed bottom-8 left-0 right-0 z-[60] flex flex-col items-center gap-4 px-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDockExpanded(!isDockExpanded)}
          className="flex items-center justify-center w-12 h-8 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl text-white/50 hover:text-white transition-all"
        >
          {isDockExpanded ? <ChevronDown size={18} /> : <LayoutGrid size={18} />}
        </motion.button>

        <AnimatePresence>
          {isDockExpanded && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="flex items-center justify-between gap-4 p-3 w-full max-w-2xl bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] shadow-2xl shadow-black/40 ring-1 ring-white/10"
            >
              <div className="flex items-center gap-2 p-1 flex-1">
                {(['assignment', 'video'] as ItemType[]).map(type => {
                  const meta = COMPONENT_MAP[type];
                  const Icon = meta.icon;
                  const isActive = activeAddType === type;
                  return (
                    <Button
                      key={type}
                      onClick={() => {
                        setActiveAddType(type);
                        setPaginationPage(1);
                      }}
                      variant="outlineGlassy"
                      className="flex items-center justify-start gap-2 "
                    >
                      {/* <Icon className="h-5 w-5" /> */}
                      <div className={`p-1 rounded-xl bg-gradient-to-br ${meta.color} text-white shadow-lg group-hover:scale-110 transition-transform `}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-bold text-white/80 group-hover:text-white hidden sm:block">{meta.label}</span>
                    </Button>
                  );
                })}
              </div>

              <div className="h-10 w-[1px] bg-white/10 mx-1" />

              <div className="p-1">
                <Button onClick={handleSubmitAll} disabled={isUpdating} variant="outlineGlassy" className="min-w-1">
                  {isUpdating ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  <span className="hidden md:inline">Save Changes</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={!!activeAddType} onOpenChange={() => setActiveAddType(null)}>
        <DialogContent className="p-0 overflow-hidden bg-white/10 backdrop-blur-[50px] border-white/20 shadow-[0_0_100px_rgba(0,0,0,0.5)] text-white flex flex-col max-w-[95vw] md:max-w-5xl h-[85vh] rounded-[3rem] border">
          {activeAddType &&
            (() => {
              const meta = COMPONENT_MAP[activeAddType];
              const totalItems = meta.keys.length;
              const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
              const paginatedItems = meta.keys.slice((paginationPage - 1) * ITEMS_PER_PAGE, paginationPage * ITEMS_PER_PAGE);

              return (
                <>
                  <div className="shrink-0 p-8 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-[1.5rem] bg-gradient-to-br ${meta.color} shadow-xl text-white`}>
                        <meta.icon size={28} />
                      </div>
                      <div>
                        <DialogTitle className="text-3xl font-black text-white">Component Library</DialogTitle>
                        <p className="text-white/40 font-medium">Inject {meta.label.toLowerCase()} widgets into your curriculum.</p>
                      </div>
                    </div>
                  </div>

                  <ScrollArea className="flex-1">
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paginatedItems.map(key => {
                        const config = meta.collection[key];
                        const Preview = config.query;
                        return (
                          <div
                            key={key}
                            className="group relative bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:border-white/30 transition-all flex flex-col h-[320px]"
                          >
                            <div className="relative flex-1 bg-black/20 overflow-hidden flex items-center justify-center p-4">
                              <div className="w-[200%] h-[200%] origin-center scale-[0.4] pointer-events-none opacity-40 group-hover:opacity-100 transition-all duration-700">
                                <Preview data={JSON.stringify(config.data)} />
                              </div>
                            </div>
                            <div className="p-5 bg-white/5 border-t border-white/10 flex items-center justify-between">
                              <span className="text-xs font-bold text-white/60 tracking-wider truncate uppercase pr-4">{key.replace(/-/g, ' ')}</span>
                              <Button
                                onClick={() => handleAddItem(activeAddType, key)}
                                size="sm"
                                className={`bg-white text-black hover:bg-white/80 rounded-xl h-10 px-5 font-bold transition-all active:scale-90`}
                              >
                                <Plus className="h-4 w-4 mr-2" /> Add
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>

                  {totalPages > 1 && (
                    <div className="shrink-0 p-6 border-t border-white/10 bg-white/5 flex items-center justify-between px-10">
                      <span className="text-xs font-bold text-white/20 uppercase tracking-[0.2em]">{totalItems} Total Nodes</span>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          onClick={() => setPaginationPage(p => Math.max(1, p - 1))}
                          disabled={paginationPage === 1}
                          className="rounded-xl w-12 h-12 hover:bg-white/10 text-white disabled:opacity-20"
                        >
                          <ChevronLeft size={24} />
                        </Button>
                        <span className="text-lg font-black text-white">
                          {paginationPage} <span className="text-white/20">/</span> {totalPages}
                        </span>
                        <Button
                          variant="ghost"
                          onClick={() => setPaginationPage(p => Math.min(totalPages, p + 1))}
                          disabled={paginationPage === totalPages}
                          className="rounded-xl w-12 h-12 hover:bg-white/10 text-white disabled:opacity-20"
                        >
                          <ChevronRight size={24} />
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
        <DialogContent className="max-w-[95vw] md:max-w-6xl h-[90vh] p-0 bg-white/10 backdrop-blur-3xl border-white/20 text-white flex flex-col rounded-[3rem] overflow-hidden border">
          <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between px-10 shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-400/20 rounded-2xl">
                <Edit className="h-6 w-6 text-emerald-400" />
              </div>
              <DialogTitle className="text-2xl font-black">Refine Module</DialogTitle>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-10">
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
        <DialogContent className="bg-white/10 backdrop-blur-3xl border-white/20 text-white max-w-md p-10 rounded-[2.5rem] border shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-[1.5rem] bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
              <Trash2 className="h-10 w-10 text-red-500" />
            </div>
            <DialogTitle className="text-2xl font-black mb-3">Expunge Content?</DialogTitle>
            <p className="text-white/40 font-medium mb-10">
              You are about to remove <span className="text-white underline underline-offset-4">{deletingItem?.heading}</span> from the course timeline.
            </p>
            <div className="flex gap-4 w-full">
              <Button onClick={() => setDeletingItem(null)} variant="ghost" className="flex-1 rounded-2xl h-14 font-bold hover:bg-white/10 text-white/50">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setItems(prev => prev.filter(i => i.id !== deletingItem?.id));
                  setDeletingItem(null);
                  toast.success('Module removed');
                }}
                className="flex-1 bg-red-500 text-white hover:bg-red-600 rounded-2xl h-14 font-bold shadow-xl shadow-red-500/20"
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
        <div className="min-h-screen flex items-center justify-center">
          <RefreshCw className="h-12 w-12 text-white/20 animate-spin" />
        </div>
      }
    >
      <EditCourseContent />
    </Suspense>
  );
}
