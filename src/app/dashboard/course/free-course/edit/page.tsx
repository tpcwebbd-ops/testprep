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
  Eye,
  ArrowUp,
  ArrowDown,
  Type,
  Layers,
  ChevronDown,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { AllSections, AllSectionsKeys, allSectionCagegory } from '@/components/all-section/all-section-index/all-sections';
import { AllForms, AllFormsKeys } from '@/components/all-form/all-form-index/all-form';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

import { useGetCoursesQuery, useUpdateCourseMutation } from '@/redux/features/course/courseSlice';

// --- Types & Interfaces ---

type ItemType = 'section' | 'form';

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

interface SectionConfig {
  category: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

const TypedAllSections = AllSections as unknown as Record<string, SectionConfig>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENT_MAP: Record<string, { collection: any; keys: string[]; label: string; icon: any; color: string }> = {
  form: {
    collection: AllForms,
    keys: AllFormsKeys,
    label: 'Quiz / Form',
    icon: Type,
    color: 'text-blue-400 from-cyan-500 to-blue-500',
  },
  section: {
    collection: AllSections,
    keys: AllSectionsKeys,
    label: 'Learning Block',
    icon: Layers,
    color: 'text-indigo-400 from-indigo-500 to-purple-500',
  },
};

const getTypeStyles = (type: ItemType) => {
  switch (type) {
    case 'form':
      return {
        border: 'border-blue-500/30 hover:border-blue-400/60',
        bg: 'bg-slate-900/60',
        badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
        icon: 'text-blue-400',
        glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]',
      };
    default:
      return {
        border: 'border-indigo-500/30 hover:border-indigo-400/60',
        bg: 'bg-slate-900/40',
        badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
        icon: 'text-indigo-400',
        glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)]',
      };
  }
};

// --- Sortable Item Component ---

interface SortableItemProps {
  item: CourseContent;
  onEdit: (item: CourseContent) => void;
  onPreview: (item: CourseContent) => void;
  onDelete: (item: CourseContent) => void;
  onInlineUpdate: (item: CourseContent, newData: unknown) => void;
  onOpenMoveDialog: (item: CourseContent) => void;
}

const SortableItem = ({ item, onEdit, onPreview, onDelete, onInlineUpdate, onOpenMoveDialog }: SortableItemProps) => {
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
          <span>Unknown Component: {item.type || 'Undefined'}</span>
        </div>
        <Button onClick={() => onDelete(item)} size="sm" variant="destructive" className="h-8 w-8 p-0">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  let ComponentToRender;
  if (item.type === 'form') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ComponentToRender = (config as any).FormField;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ComponentToRender = (config as any).query;
  }

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
              {item.type !== 'form' ? (
                <Button
                  onClick={() => onEdit(item)}
                  size="sm"
                  className="min-w-1 h-8 w-8 p-0 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-none"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => onPreview(item)}
                  size="sm"
                  className="min-w-1 h-8 w-8 p-0 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-none"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}

              <Button
                onClick={() => onDelete(item)}
                size="sm"
                className="min-w-1 h-8 w-8 p-0 bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border-none"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-6 pt-16 text-slate-300 min-h-[100px]">
            <div className="z-10 pointer-events-none select-none opacity-90 group-hover:opacity-100 transition-opacity">
              {ComponentToRender &&
                (item.type !== 'form' ? (
                  <ComponentToRender data={JSON.stringify(item.data)} />
                ) : (
                  <div className="pointer-events-auto">
                    <ComponentToRender data={item.data} onSubmit={(newData: unknown) => onInlineUpdate(item, newData)} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Editor Component ---

function EditCourseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. Get Params from URL
  const courseDayParam = searchParams.get('courseDay');
  const courseNameParam = searchParams.get('courseName');

  const normalizedDay = useMemo(() => courseDayParam?.replace(/-/g, ' ') || '', [courseDayParam]);
  const normalizedName = useMemo(() => courseNameParam || '', [courseNameParam]);

  // 2. Fetch Data
  const {
    data: coursesData,
    isLoading,
    error,
    refetch,
  } = useGetCoursesQuery({
    page: 1,
    limit: 1000,
    q: normalizedName,
  });

  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  // 3. Find the specific course
  const currentCourse = useMemo(() => {
    if (!coursesData?.courses) return undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return coursesData.courses.find((c: any) => c.courseName === normalizedName && c.courseDay === normalizedDay) as ICourse | undefined;
  }, [coursesData, normalizedName, normalizedDay]);

  const [items, setItems] = useState<CourseContent[]>([]);

  // UI States
  const [editingItem, setEditingItem] = useState<CourseContent | null>(null);
  const [previewingItem, setPreviewingItem] = useState<CourseContent | null>(null);
  const [deletingItem, setDeletingItem] = useState<CourseContent | null>(null);
  const [movingItem, setMovingItem] = useState<CourseContent | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // "Add Task" Popup State
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [activeAddType, setActiveAddType] = useState<ItemType | null>(null);

  // Task Bar Visibility
  const [isDockExpanded, setIsDockExpanded] = useState(true);

  // Pagination & Filters
  const [selectedSectionCategory, setSelectedSectionCategory] = useState<string>('All');
  const [sectionPreviewKey, setSectionPreviewKey] = useState<string | null>(null);
  const [paginationPage, setPaginationPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Sync Items
  useEffect(() => {
    if (currentCourse?.content) {
      setItems(Array.isArray(currentCourse.content) ? currentCourse.content : []);
    }
  }, [currentCourse]);

  // Reset pagination
  useEffect(() => {
    setPaginationPage(1);
  }, [activeAddType, selectedSectionCategory]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // --- Handlers ---

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

  const handleAddItem = (type: ItemType, key: string) => {
    const mapEntry = COMPONENT_MAP[type];
    const config = mapEntry.collection[key];

    const newItem: CourseContent = {
      id: `${type}-${key}-${Date.now()}`,
      key: key,
      name: config.name || `${mapEntry.label} ${key}`,
      type: type,
      heading: `${mapEntry.label} - ${key.replace(/-/g, ' ')}`,
      data: config.data,
    };

    setItems([...items, newItem]);
    toast.success('Task added to list');

    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);

    setSectionPreviewKey(null);
    if (type !== 'section') setActiveAddType(null);
    setIsAddTaskOpen(false);
  };

  const onSubmitEdit = (updatedData: unknown) => {
    if (editingItem) setItems(items.map(item => (item.id === editingItem.id ? { ...item, data: updatedData } : item)));
    setEditingItem(null);
  };

  const handleInlineUpdate = (targetItem: CourseContent, updatedData: unknown) => {
    setItems(prevItems => prevItems.map(item => (item.id === targetItem.id ? { ...item, data: updatedData } : item)));
  };

  const handleConfirmDelete = () => {
    if (deletingItem) {
      setItems(items.filter(item => item.id !== deletingItem.id));
      setDeletingItem(null);
    }
  };

  const handleSubmitAll = async () => {
    // Check if course exists
    if (!currentCourse?._id) {
      toast.error('Course context lost. Please reload.');
      return;
    }

    try {
      await updateCourse({
        // Assert _id exists because of the check above
        id: currentCourse!._id,
        content: items,
      }).unwrap();
      toast.success('Changes saved successfully!');
    } catch (err) {
      toast.error('Failed to save changes');
      console.error(err);
    }
  };

  const handleAddTaskClick = () => {
    setIsAddTaskOpen(true);
  };

  // --- Helpers for Modal Data ---

  const sectionCategories = useMemo(() => ['All', ...allSectionCagegory], []);

  const filteredSectionKeys = useMemo(() => {
    if (activeAddType !== 'section') return [];
    if (selectedSectionCategory === 'All') return AllSectionsKeys;
    return AllSectionsKeys.filter(key => {
      const section = TypedAllSections[key];
      return section?.category === selectedSectionCategory;
    });
  }, [activeAddType, selectedSectionCategory]);

  // --- Render Loading / Not Found ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full animate-pulse" />
          <RefreshCw className="h-10 w-10 text-indigo-400 animate-spin relative z-10" />
        </div>
        <p className="text-slate-400 animate-pulse">Loading course data...</p>
      </div>
    );
  }

  // 6.2 If not found then render there is not data found.
  if (error || (!isLoading && !currentCourse)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/10 flex flex-col items-center text-center max-w-md backdrop-blur-sm">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Data Found</h2>
          <p className="text-slate-400 mb-6">
            We couldn&apos;t find <strong>{normalizedDay}</strong> in <strong>{normalizedName}</strong>. Please check the URL or return to the dashboard.
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

  // 6.1 If found data in database then render it.
  return (
    <main className="min-h-screen bg-slate-950 overflow-x-hidden selection:bg-indigo-500/30 font-sans pb-32">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                {/* Use Optional Chaining Here to fix TS Error */}
                <span className="text-indigo-400">{currentCourse?.courseDay}</span>
                <span className="text-slate-600">/</span>
                <span>{currentCourse?.courseName}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-500 font-mono hidden md:block">{items.length} Tasks</div>
          </div>
        </div>
      </div>

      {/* 6.5 implement drug and drop features. */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {items.length === 0 ? (
          <div className="animate-in zoom-in-95 duration-700 fade-in flex flex-col items-center justify-center min-h-[40vh] border-2 border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm p-8 mt-10">
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
              <BookOpen className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">No Tasks Yet</h2>
            <p className="text-slate-400 text-center max-w-md mb-8">This day has no content. Click &quot;Add Task&quot; below to start building.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-5">
                {items.map(item => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    onEdit={setEditingItem}
                    onPreview={setPreviewingItem}
                    onDelete={setDeletingItem}
                    onInlineUpdate={handleInlineUpdate}
                    onOpenMoveDialog={setMovingItem}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div className="backdrop-blur-xl shadow-2xl rounded-xl border border-indigo-500/30 bg-slate-900/90 p-4 flex items-center gap-4 transform scale-105 cursor-grabbing">
                  <GripVertical className="h-6 w-6 text-indigo-400" />
                  <span className="text-white font-medium text-lg">Moving Task...</span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* 6.3 Task Bar (Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
        {/* Hide/View Toggle */}
        <button
          onClick={() => setIsDockExpanded(!isDockExpanded)}
          className={`
            pointer-events-auto mb-2 flex items-center justify-center w-10 h-6 rounded-full 
            bg-slate-900 border border-white/10 shadow-lg text-slate-400 hover:text-white transition-all
            ${!isDockExpanded ? 'animate-bounce' : ''}
          `}
        >
          {isDockExpanded ? <ChevronDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
        </button>

        {/* The Bar */}
        <div
          className={`
            w-full bg-slate-950/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] 
            transition-all duration-300 ease-in-out origin-bottom
            ${isDockExpanded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
          `}
        >
          <div className="pointer-events-auto container mx-auto px-4 h-20 flex items-center justify-between">
            {/* 6.4 Left Side: Add Task Button */}
            <div className="flex items-center gap-4">
              <Button
                onClick={handleAddTaskClick}
                className="h-12 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 px-6 rounded-xl font-semibold gap-2 transition-transform active:scale-95"
              >
                <Plus className="h-5 w-5" />
                Add Task
              </Button>
            </div>

            {/* Center Info (Optional) */}
            <div className="hidden md:flex flex-col items-center opacity-50">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Editor Mode</span>
            </div>

            {/* 6.5 Right Side: Save Changes */}
            <div className="flex items-center gap-4">
              <Button
                onClick={handleSubmitAll}
                disabled={isUpdating}
                className="h-12 bg-white/10 hover:bg-white/20 text-white border border-white/5 px-6 rounded-xl font-medium gap-2 transition-all"
              >
                {isUpdating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- ADD TASK SELECTION POPUP --- */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="bg-slate-950 border-white/10 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <button
              onClick={() => {
                setActiveAddType('section');
                setIsAddTaskOpen(false);
              }}
              className="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-900 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all gap-3 group"
            >
              <div className="p-3 rounded-full bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                <Layers className="h-6 w-6" />
              </div>
              <span className="font-semibold text-sm">Learning Block</span>
            </button>

            <button
              onClick={() => {
                setActiveAddType('form');
                setIsAddTaskOpen(false);
              }}
              className="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-900 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all gap-3 group"
            >
              <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                <Type className="h-6 w-6" />
              </div>
              <span className="font-semibold text-sm">Quiz / Form</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- DETAILED COMPONENT SELECTION MODAL --- */}
      <Dialog open={!!activeAddType} onOpenChange={() => setActiveAddType(null)}>
        <DialogContent className="p-0 overflow-hidden bg-slate-950/95 backdrop-blur-3xl border-white/10 shadow-2xl text-white gap-0 flex flex-col max-w-[90vw] min-w-[90vw] h-[85vh] mt-10">
          {activeAddType &&
            (() => {
              const meta = COMPONENT_MAP[activeAddType];
              const isSectionMode = activeAddType === 'section';

              // Pagination Logic
              const dataSource = isSectionMode ? filteredSectionKeys : meta.keys;
              const totalItems = dataSource.length;
              const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
              const paginatedItems = dataSource.slice((paginationPage - 1) * ITEMS_PER_PAGE, paginationPage * ITEMS_PER_PAGE);

              return (
                <>
                  <div className="shrink-0 flex flex-col bg-white/5 border-b border-white/10">
                    <div className="flex items-center justify-between p-6 pb-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${meta.color} shadow-lg`}>
                          <meta.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">Select {meta.label}</DialogTitle>
                          <p className="text-slate-400 text-sm mt-1">Choose a component to add to your task list.</p>
                        </div>
                      </div>
                    </div>

                    {isSectionMode && (
                      <div className="px-6 pb-0 flex overflow-x-auto no-scrollbar gap-2">
                        {sectionCategories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setSelectedSectionCategory(cat)}
                            className={`
                              relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap
                              ${selectedSectionCategory === cat ? 'text-white' : 'text-slate-500 hover:text-slate-300'}
                            `}
                          >
                            {cat}
                            {selectedSectionCategory === cat && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <ScrollArea className="flex-1 min-h-0 w-full bg-black/20">
                    <div className="p-6">
                      {isSectionMode ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                          {paginatedItems.map(key => {
                            const config = TypedAllSections[key];
                            const PreviewComp = config.query;

                            return (
                              <div
                                key={key}
                                className="group relative bg-slate-900 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col h-[280px]"
                              >
                                <div className="relative flex-1 bg-black/40 overflow-hidden">
                                  <div className="absolute inset-0 flex items-center justify-center p-4">
                                    <div className="w-[200%] h-[200%] origin-center scale-[0.4] pointer-events-none select-none flex items-start justify-center pt-10">
                                      {PreviewComp ? <PreviewComp data={JSON.stringify(config.data)} /> : <div className="text-slate-600">No Preview</div>}
                                    </div>
                                  </div>
                                  <div className="absolute top-3 left-3">
                                    <span className="bg-black/60 backdrop-blur text-[10px] text-white/80 px-2 py-1 rounded border border-white/5">
                                      {config.category}
                                    </span>
                                  </div>
                                </div>

                                <div className="p-3 bg-white/5 border-t border-white/5 flex items-center justify-between gap-2 relative z-10">
                                  <h4 className="text-xs font-bold text-slate-200 truncate flex-1">{key}</h4>
                                  <div className="flex gap-1">
                                    <Button
                                      onClick={() => setSectionPreviewKey(key)}
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 text-slate-400 hover:text-white"
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button onClick={() => handleAddItem('section', key)} size="sm" className="h-7 text-xs bg-indigo-600 hover:bg-indigo-500">
                                      <Plus className="mr-1 h-3 w-3" /> Add
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                          {paginatedItems.map(key => {
                            const config = meta.collection[key];
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const DisplayComponent = activeAddType === 'form' ? (config as any).preview : (config as any).query;

                            return (
                              <div
                                key={key}
                                onClick={() => handleAddItem(activeAddType, key)}
                                className="group cursor-pointer rounded-2xl border border-white/10 bg-black/20 overflow-hidden hover:border-white/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                              >
                                <div className="h-[160px] bg-slate-900/50 relative overflow-hidden p-4 flex items-center justify-center border-b border-white/5">
                                  <div className="scale-[0.6] w-full h-full origin-center flex items-center justify-center pointer-events-none">
                                    {DisplayComponent ? <DisplayComponent /> : <span className="text-slate-500">Preview</span>}
                                  </div>
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <div className="bg-white text-black px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                                      <Plus className="h-4 w-4" /> Add
                                    </div>
                                  </div>
                                </div>
                                <div className="p-4 bg-white/5 flex justify-between items-center">
                                  <span className="font-semibold text-slate-200 text-sm">{key}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
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
            <DialogTitle className="text-center">Move Item</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Button onClick={handleMoveUp} className="h-12 text-lg bg-slate-800 hover:bg-slate-700 justify-start px-6">
              <ArrowUp className="mr-3 h-5 w-5 text-indigo-400" /> Move Up
            </Button>
            <Button onClick={handleMoveDown} className="h-12 text-lg bg-slate-800 hover:bg-slate-700 justify-start px-6">
              <ArrowDown className="mr-3 h-5 w-5 text-indigo-400" /> Move Down
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
            <DialogTitle className="text-xl font-bold mb-2">Remove Content?</DialogTitle>
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
              <Edit className="h-5 w-5 text-indigo-400" /> Edit Content
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
                  <Mutation data={editingItem.data} onSubmit={onSubmitEdit} />
                ) : (
                  <div className="p-20 text-center text-slate-500">No settings available.</div>
                );
              })()}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewingItem} onOpenChange={() => setPreviewingItem(null)}>
        <DialogContent className="max-w-4xl h-[85vh] mt-10 p-0 bg-slate-900/95 backdrop-blur-xl border-white/10 text-white flex flex-col">
          <DialogHeader className="p-6 border-b border-white/10 bg-white/5 shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-cyan-400" /> Preview
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 w-full bg-black/20">
            <div className="p-8 flex justify-center">
              <div className="w-full max-w-3xl">
                {previewingItem &&
                  (() => {
                    const meta = COMPONENT_MAP[previewingItem.type];
                    const config = meta.collection[previewingItem.key];
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const Preview = (config as any).preview;
                    return Preview ? <Preview data={JSON.stringify(previewingItem.data)} /> : null;
                  })()}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Section Preview Modal */}
      <Dialog open={!!sectionPreviewKey} onOpenChange={() => setSectionPreviewKey(null)}>
        <DialogContent className="max-w-[90vw] p-0 bg-slate-950 border-white/10 flex flex-col min-w-[90vw] h-[80vh] mt-10 text-white">
          {sectionPreviewKey &&
            (() => {
              const config = TypedAllSections[sectionPreviewKey];
              const QueryComp = config.query;
              return (
                <>
                  <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <h3 className="text-white font-bold">{sectionPreviewKey}</h3>
                    <Button
                      onClick={() => {
                        handleAddItem('section', sectionPreviewKey);
                        setSectionPreviewKey(null);
                        setActiveAddType(null);
                      }}
                      className="bg-indigo-600"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Section
                    </Button>
                  </div>
                  <ScrollArea className="h-full w-full bg-black">
                    <div className="min-h-full flex flex-col">
                      {QueryComp ? <QueryComp data={JSON.stringify(config.data)} /> : <div className="p-20 text-center">No Preview</div>}
                    </div>
                  </ScrollArea>
                </>
              );
            })()}
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
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          </div>
        </div>
      }
    >
      <EditCourseContent />
    </Suspense>
  );
}
