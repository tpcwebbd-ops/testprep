/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  Eye,
  Edit,
  Plus,
  Save,
  Database,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  LayoutGrid,
  FolderOpen,
  ArrowUpDown,
  ChevronDown,
  GripVertical,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense, useMemo } from 'react';

import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetPagesQuery, useUpdatePageMutation } from '@/redux/features/db-builder/pageBuilderSlice';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';

import { ItemType, PageContent } from '../utils';
import { Allfields, AllfieldsKeys } from '../all-fields/all-fields-index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENT_MAP: Record<string, { collection: any; keys: string[]; label: string; icon: any; color: string }> = {
  field: { collection: Allfields, keys: AllfieldsKeys, label: 'Fields', icon: Database, color: 'text-blue-400 from-cyan-500 to-blue-500' },
};

const getTypeStyles = (type: ItemType) => {
  switch (type) {
    case 'field':
      return {
        border: 'border-blue-500/30 hover:border-blue-400/60',
        bg: 'bg-slate-900/60',
        badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
        icon: 'text-blue-400',
        glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]',
      };
    default:
      return {
        border: 'border-purple-500/30 hover:border-purple-400/60',
        bg: 'bg-slate-900/40',
        badge: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
        icon: 'text-purple-400',
        glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)]',
      };
  }
};

interface SortableItemProps {
  item: PageContent;
  onEdit: (item: PageContent) => void;
  onDelete: (item: PageContent) => void;
  onOpenMoveDialog: (item: PageContent) => void;
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
          <span>Unknown Component Type: {item.type || 'Undefined'}</span>
        </div>
        <Button onClick={() => onDelete(item)} size="sm" variant="outlineFire" className="h-8 w-8 p-0">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ComponentToRender = (config as any).add;

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
                <ArrowUpDown className="h-4 w-4" />
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
                <span className="text-xs font-medium text-slate-200 tracking-wide truncate max-w-[150px]">{item.heading || item.key}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              <Button onClick={() => onEdit(item)} size="sm" className="min-w-1" variant="outlineGlassy">
                <Edit className="h-4 w-4" />
              </Button>

              <Button onClick={() => onDelete(item)} size="sm" className="min-w-1" variant="outlineGlassy">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="w-full h-auto hidden lg:block">
            <div className="p-6 pt-16 text-slate-300 min-h-[100px]">
              <div className="z-10 pointer-events-none select-none opacity-90 group-hover:opacity-100 transition-opacity">
                {ComponentToRender && <ComponentToRender data={item.data} />}
              </div>
            </div>
          </div>
          <div className="w-full h-auto block lg:hidden">
            <div className="p-6 pt-16 text-slate-300 min-h-[100px]">
              <div className="z-10 select-none opacity-90 group-hover:opacity-100 transition-opacity">
                <div className="w-full h-[400px] max-w-[340px] overflow-scroll border border-gray-300">
                  {ComponentToRender && <ComponentToRender data={item.data} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NormalizedPage {
  _id: string;
  pageName: string;
  path: string;
  content: PageContent[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

function EditPageContent() {
  const searchParams = useSearchParams();
  const pathTitle = searchParams.get('pathTitle') || '/';

  const { data: pagesData, isLoading, error, refetch } = useGetPagesQuery({ page: 1, limit: 1000 });
  const [updatePage] = useUpdatePageMutation();

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

  const currentPage = useMemo(() => {
    return normalizedPages.find(p => p.path === pathTitle);
  }, [normalizedPages, pathTitle]);

  const [items, setItems] = useState<PageContent[]>([]);
  const [editingItem, setEditingItem] = useState<PageContent | null>(null);
  const [deletingItem, setDeletingItem] = useState<PageContent | null>(null);
  const [movingItem, setMovingItem] = useState<PageContent | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAddFieldDialogOpen, setIsAddFieldDialogOpen] = useState(false);
  const [addFieldForm, setAddFieldForm] = useState({ fieldText: '', fieldKey: AllfieldsKeys[0] || '' });
  const [, setIsScrolled] = useState(false);
  const [isDockExpanded, setIsDockExpanded] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentPage?.content) {
      setItems(Array.isArray(currentPage.content) ? currentPage.content : []);
    }
  }, [currentPage]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleAddField = () => {
    const key = addFieldForm.fieldKey;
    const fieldText = addFieldForm.fieldText.trim();
    if (!fieldText || !key) {
      toast.error('Please enter field text and select a field');
      return;
    }

    const type: ItemType = 'field';
    const mapEntry = COMPONENT_MAP.field;
    const config = mapEntry.collection[key];
    if (!config) {
      toast.error('Selected field was not found');
      return;
    }

    const fieldData = typeof config.data === 'object' && config.data !== null ? { ...config.data, fieldName: fieldText } : config.data;
    const newItem: PageContent = {
      id: `${type}-${key}-${Date.now()}`,
      key: key,
      name: fieldText,
      type: type,
      heading: fieldText,
      path: `/${key}`,
      data: fieldData,
    };
    setItems([...items, newItem]);

    toast.success(`${fieldText} added to page`);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);

    setAddFieldForm({ fieldText: '', fieldKey: AllfieldsKeys[0] || '' });
    setIsAddFieldDialogOpen(false);
  };

  const handleEdit = (item: PageContent) => setEditingItem(item);
  const handleDeleteClick = (item: PageContent) => setDeletingItem(item);
  const handleOpenMoveDialog = (item: PageContent) => setMovingItem(item);
  const handlePreviewPage = (path: string) => {
    window.location.href = `/dashboard/db-builder/preview-page?pathTitle=${path}`;
  };
  const handleConfirmDelete = () => {
    if (deletingItem) {
      setItems(items.filter(item => item.id !== deletingItem.id));
      setDeletingItem(null);
    }
  };

  const onSubmitEdit = (updatedData: unknown) => {
    if (editingItem) setItems(items.map(item => (item.id === editingItem.id ? { ...item, data: updatedData } : item)));
    setEditingItem(null);
  };

  const handleSubmitAll = async () => {
    if (!currentPage?._id) {
      toast.error('Page context lost. Please refresh.');
      return;
    }

    setIsSaving(true);
    try {
      await updatePage({
        id: currentPage._id,
        content: items,
      }).unwrap();

      toast.success('Page saved successfully!');
    } catch (err) {
      toast.error('Failed to save page');
      console.error('Error saving page:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    const errorMessage =
      'status' in error ? `Error ${error.status}: ${JSON.stringify(error.data)}` : 'message' in error ? error.message : 'An unexpected error occurred';

    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500 max-w-lg">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/30 blur-3xl rounded-full" />
            <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-2xl">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-white">Failed to Load Page Data</h2>
            <p className="text-slate-400 text-lg">We encountered an error while fetching the page data.</p>
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-left w-full overflow-hidden">
              <p className="text-red-400 text-xs font-mono break-all">{errorMessage}</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <Button onClick={() => (window.location.href = '/dashboard/db-builder')} variant="outlineGlassy" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              View All Pages
            </Button>
            <Button onClick={() => refetch()} variant="outlineGlassy" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full animate-pulse" />
            <Database className="h-10 w-10 text-white animate-pulse relative z-10" />
          </div>
          <div className="text-white text-lg">Loading Page Editor...</div>
        </div>
      </main>
    );
  }

  if (!currentPage) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500 max-w-lg">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/30 blur-3xl rounded-full" />
            <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-2xl">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-white">Page Not Found</h2>
            <p className="text-slate-400 text-lg">The page you&apos;re looking for doesn&apos;t exist or hasn&apos;t been created yet.</p>
            <p className="text-red-400 text-sm font-mono bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 inline-block">Path: {pathTitle}</p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <Button onClick={() => (window.location.href = '/dashboard/db-builder')} variant="outlineGlassy" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              View All Pages
            </Button>
            <Button onClick={() => refetch()} variant="outlineGlassy" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 overflow-x-hidden selection:bg-purple-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/20 blur-[120px] animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-soft-light"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-8 max-w-5xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">{currentPage.pageName}</h1>
          <p className="text-slate-400 font-mono text-sm bg-white/5 inline-block px-3 py-1 rounded-full border border-white/5">{currentPage.path}</p>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pb-60 max-w-5xl">
        {items.length === 0 ? (
          <div className="animate-in zoom-in-95 duration-700 fade-in flex flex-col items-center justify-center min-h-[50vh] border-2 border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm p-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full" />
              <div className="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-2xl">
                <Database className="h-10 w-10 text-blue-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 text-center">Start Creating</h2>
            <p className="text-slate-400 text-center max-w-md mb-8 text-lg">Your canvas is empty. Use the dock below to add powerful components.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-8">
                {items.map(item => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onOpenMoveDialog={handleOpenMoveDialog}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div className="backdrop-blur-xl shadow-2xl rounded-xl border border-blue-500/30 bg-slate-900/90 p-4 flex items-center gap-4 transform scale-105 cursor-grabbing">
                  <GripVertical className="h-6 w-6 text-blue-400" />
                  <span className="text-white font-medium text-lg">Moving Item...</span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      <div className="fixed bottom-6 left-0 right-0 z-50 flex flex-col items-center justify-end gap-4 pointer-events-none">
        <button
          onClick={() => setIsDockExpanded(!isDockExpanded)}
          className={`
            pointer-events-auto flex items-center justify-center w-12 h-8 rounded-full 
            bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-lg 
            text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300
            ${!isDockExpanded ? 'animate-bounce ring-1 ring-blue-500/50 shadow-blue-500/20' : ''}
          `}
        >
          {isDockExpanded ? <ChevronDown className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
        </button>

        <div
          className={`
            flex items-center gap-4 transition-all duration-500 ease-in-out origin-bottom rounded-2xl bg-slate-950/80 backdrop-blur-2xl border border-white/10 shadow-2xl ring-1 ring-white/5 justify-between w-[95%] md:w-2xl lg:w-4xl 
            ${isDockExpanded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95 pointer-events-none absolute bottom-0'}
          `}
        >
          <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 p-2.5">
            <Button onClick={() => setIsAddFieldDialogOpen(true)} variant="outlineGlassy" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Field
            </Button>
          </div>
          <div className="w-full flex items-center justify-end gap-2 pointer-events-auto pr-4">
            <Button size="sm" variant="outlineGlassy" className="min-w-1" onClick={() => handlePreviewPage(currentPage.path)} title="Preview Page">
              <Eye className="h-4 w-4" />
            </Button>
            <div
              className={`
              pointer-events-auto transition-all duration-500 
              ${items.length > 0 ? 'max-h-20 opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-4'}
              `}
            >
              <Button onClick={handleSubmitAll} variant="outlineGlassy" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isAddFieldDialogOpen} onOpenChange={setIsAddFieldDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Add Field</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="field-text" className="text-slate-300">
                Text
              </Label>
              <Input
                id="field-text"
                value={addFieldForm.fieldText}
                onChange={e => setAddFieldForm(prev => ({ ...prev, fieldText: e.target.value }))}
                placeholder="e.g. Student Name"
                className="bg-slate-950 border-white/10 text-white placeholder:text-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Field</Label>
              <Select value={addFieldForm.fieldKey} onValueChange={value => setAddFieldForm(prev => ({ ...prev, fieldKey: value }))}>
                <SelectTrigger className="bg-slate-950 border-white/10 text-white">
                  <SelectValue placeholder="Select a field" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white">
                  {AllfieldsKeys.map(key => (
                    <SelectItem key={key} value={key} className="focus:bg-white/10 focus:text-white">
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsAddFieldDialogOpen(false)} className="text-slate-400 hover:text-white hover:bg-white/5">
              Cancel
            </Button>
            <Button onClick={handleAddField} disabled={!addFieldForm.fieldText.trim() || !addFieldForm.fieldKey} className="bg-blue-600 hover:bg-blue-500 text-white">
              Add Field
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!movingItem} onOpenChange={() => setMovingItem(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-center">Reorder {movingItem?.key}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Button onClick={handleMoveUp} className="h-12 text-lg bg-slate-800 hover:bg-slate-700">
              <ArrowUp className="mr-2 h-5 w-5" /> Move Up
            </Button>
            <Button onClick={handleMoveDown} className="h-12 text-lg bg-slate-800 hover:bg-slate-700">
              <ArrowDown className="mr-2 h-5 w-5" /> Move Down
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <span className="text-xl font-bold mb-2">Delete Component?</span>
            </DialogTitle>
            <p className="text-slate-400 mb-6">
              Are you sure you want to remove <span className="text-white font-semibold">{deletingItem?.heading || 'this item'}</span>? This cannot be undone.
            </p>
            {deletingItem &&
              (() => {
                const meta = COMPONENT_MAP[deletingItem.type];
                const config = meta.collection[deletingItem.key];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const DeleteField = (config as any).delete;
                return DeleteField ? (
                  <div className="mb-6 w-full rounded-lg border border-white/10 bg-black/20 p-4">
                    <DeleteField data={deletingItem.data} />
                  </div>
                ) : null;
              })()}
            <div className="flex gap-3 w-full">
              <Button onClick={() => setDeletingItem(null)} variant="outline" className="flex-1 border-white/10 hover:bg-white/5">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} variant="destructive" className="flex-1 bg-red-600 hover:bg-red-700">
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-4xl md:max-w-6xl h-[85vh] mt-10 p-0 bg-slate-900/95 backdrop-blur-xl border-white/10 text-white flex flex-col">
          <DialogHeader className="p-4 border-b border-white/10 bg-white/5 shrink-0">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Edit className="h-5 w-5 text-blue-400" />
              Edit Component
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 min-h-0 w-full -mt-4">
            <div className="">
              {editingItem &&
                (() => {
                  const meta = COMPONENT_MAP[editingItem.type];
                  const config = meta.collection[editingItem.key];
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const UpdateField = (config as any).update;
                  return UpdateField ? (
                    <UpdateField data={editingItem.data} onSubmit={onSubmitEdit} />
                  ) : (
                    <div className="p-4 text-center text-slate-500">No settings available</div>
                  );
                })()}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <EditPageContent />
    </Suspense>
  );
}
