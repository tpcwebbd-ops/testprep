'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DragOverEvent,
  pointerWithin,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Eye,
  Edit2,
  Trash2,
  Plus,
  GripVertical,
  Save,
  ChevronRight,
  Loader2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Monitor,
  Tablet,
  Smartphone,
  MoreVertical,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  useGetSidebarsQuery,
  useAddSidebarMutation,
  useUpdateSidebarMutation,
  useDeleteSidebarMutation,
  useBulkUpdateSidebarsMutation,
} from '@/redux/features/sidebars/sidebarsSlice';

import { iconMap, iconOptions } from '@/components/all-icons/all-icons-jsx';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface SidebarItem {
  _id?: string;
  sl_no: number;
  name: string;
  path: string;
  iconName?: string;
  icon?: React.ReactNode;
  children?: SidebarItem[];
}

interface DragState {
  activeId: string | null;
  overId: string | null;
  activeItem: SidebarItem | null;
  originalParentId: number | null;
  originalIndex: number;
}

interface SortableItemProps {
  item: SidebarItem;
  onView: (item: SidebarItem) => void;
  onEdit: (item: SidebarItem) => void;
  onDelete: (item: SidebarItem) => void;
  onAddChild?: (parentItem: SidebarItem) => void;
  onToggleCollapse?: (itemId: number) => void;
  onReorderRequest?: (item: SidebarItem) => void;
  isCollapsed?: boolean;
  isChild?: boolean;
  isOverTarget?: boolean;
  isDragging?: boolean;
  dropPosition?: 'before' | 'after' | 'inside' | null;
  deviceType: DeviceType;
}

function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setDeviceType('mobile');
      else if (width < 1024) setDeviceType('tablet');
      else setDeviceType('desktop');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
}

function SortableItem({
  item,
  onView,
  onEdit,
  onDelete,
  onAddChild,
  onToggleCollapse,
  onReorderRequest,
  isCollapsed = false,
  isChild = false,
  isOverTarget = false,
  isDragging = false,
  dropPosition = null,
  deviceType,
}: SortableItemProps) {
  const isDesktop = deviceType === 'desktop';
  const [showActions, setShowActions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.sl_no.toString(),
    disabled: !isDesktop,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };
    if (showActions) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showActions]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const hasChildren = item.children && item.children.length > 0;

  const getBorderClass = () => {
    if (!isOverTarget) return 'border border-white/20';
    if (dropPosition === 'inside') return 'border-2 border-purple-400 ring-2 ring-purple-400/50';
    if (dropPosition === 'before') return 'border-t-4 border-t-blue-400 border-x border-b border-white/20';
    if (dropPosition === 'after') return 'border-b-4 border-b-blue-400 border-x border-t border-white/20';
    return 'border-2 border-blue-400 ring-2 ring-blue-400/50';
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group relative backdrop-blur-xl bg-white/10 rounded-lg p-2 shadow-lg hover:shadow-2xl hover:bg-white/15 transition-all duration-300 ${
        isChild ? 'ml-8' : ''
      } ${getBorderClass()} ${!isDesktop && showActions ? 'mb-2' : 'mb-0'}`}
    >
      <div className="flex items-center gap-2 w-full">
        {isDesktop ? (
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-white/20 rounded-md transition-colors touch-none shrink-0"
          >
            <GripVertical size={18} className="text-gray-400 group-hover:text-white" />
          </div>
        ) : (
          <Button
            onClick={e => {
              e.stopPropagation();
              onReorderRequest?.(item);
            }}
            variant="outlineGlassy"
            className="w-8 h-8 p-0 min-w-1 shrink-0"
            size="xs"
          >
            <ArrowUpDown size={14} className="text-gray-300" />
          </Button>
        )}

        {!isChild && hasChildren && (
          <Button onClick={() => onToggleCollapse?.(item.sl_no)} variant="outlineGlassy" className="w-8 h-8 p-0 shrink-0" size="xs">
            <motion.div animate={{ rotate: isCollapsed ? 0 : 90 }}>
              <ChevronRight size={16} className="text-gray-300" />
            </motion.div>
          </Button>
        )}

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg shrink-0 group-hover:scale-110 transition-transform shadow-inner border border-white/10">
            {item.icon}
          </div>
          <div className="flex flex-col min-w-0 overflow-hidden">
            <span className="font-semibold text-sm text-white truncate">{item.name}</span>
            <span className="text-[10px] text-gray-200/80 truncate font-mono tracking-tight">{item.path}</span>
          </div>
        </div>

        {isDesktop ? (
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 shrink-0 px-2">
            <Button onClick={() => onView(item)} variant="outlineGlassy" className="min-w-1 w-8 h-8 p-0 hover:bg-blue-500/20 hover:text-blue-400" size="xs">
              <Eye size={14} />
            </Button>
            <Button onClick={() => onEdit(item)} variant="outlineGlassy" className="min-w-1 w-8 h-8 p-0 hover:bg-amber-500/20 hover:text-amber-400" size="xs">
              <Edit2 size={14} />
            </Button>
            <Button onClick={() => onDelete(item)} variant="outlineGlassy" className="min-w-1 w-8 h-8 p-0 hover:bg-rose-500/20 hover:text-rose-400" size="xs">
              <Trash2 size={14} />
            </Button>
            {!isChild && onAddChild && (
              <Button
                onClick={() => onAddChild(item)}
                variant="outlineGlassy"
                className="min-w-1 w-8 h-8 p-0 hover:bg-emerald-500/20 hover:text-emerald-400"
                size="xs"
              >
                <Plus size={14} />
              </Button>
            )}
          </div>
        ) : (
          <div className="relative shrink-0" ref={menuRef}>
            <Button
              onClick={() => setShowActions(!showActions)}
              variant="outlineGlassy"
              className={`w-8 h-8 p-0 transition-all ${showActions ? 'bg-white/30 rotate-90 scale-110' : ''} min-w-1`}
              size="xs"
            >
              <MoreVertical size={16} className="text-gray-300" />
            </Button>
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 10 }}
                  className="absolute right-10 top-0 flex items-center gap-2 p-1.5 bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-lg shadow-2xl z-50 ring-1 ring-white/10"
                >
                  <Button
                    onClick={() => {
                      onView(item);
                      setShowActions(false);
                    }}
                    variant="outlineGlassy"
                    className="w-9 h-9 p-0 rounded-md min-w-1"
                    size="xs"
                  >
                    <Eye size={16} className="text-blue-400" />
                  </Button>
                  <Button
                    onClick={() => {
                      onEdit(item);
                      setShowActions(false);
                    }}
                    variant="outlineGlassy"
                    className="w-9 h-9 p-0 rounded-md min-w-1"
                    size="xs"
                  >
                    <Edit2 size={16} className="text-amber-400" />
                  </Button>
                  <Button
                    onClick={() => {
                      onDelete(item);
                      setShowActions(false);
                    }}
                    variant="outlineGlassy"
                    className="w-9 h-9 p-0 rounded-md min-w-1 bg-rose-500/10"
                    size="xs"
                  >
                    <Trash2 size={16} className="text-rose-400" />
                  </Button>
                  {!isChild && onAddChild && (
                    <Button
                      onClick={() => {
                        onAddChild(item);
                        setShowActions(false);
                      }}
                      variant="outlineGlassy"
                      className="w-9 h-9 p-0 rounded-md min-w-1 bg-emerald-500/10"
                      size="xs"
                    >
                      <Plus size={16} className="text-emerald-400" />
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function DropZone({ id, label, isOver }: { id: string; label: string; isOver: boolean }) {
  const { setNodeRef } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`h-14 rounded-xl border-2 border-dashed transition-all duration-300 flex items-center justify-center group mb-4 ${
        isOver ? 'border-blue-400 bg-blue-400/20 scale-[1.02] shadow-blue-500/20 shadow-lg' : 'border-white/10 bg-white/5 hover:border-white/30'
      }`}
    >
      <span className={`text-sm font-semibold transition-colors ${isOver ? 'text-blue-300' : 'text-gray-200/70 group-hover:text-gray-300'}`}>{label}</span>
    </div>
  );
}

export default function SiteMenuPage() {
  const deviceType = useDeviceType();
  const { data: sidebarData, isLoading, refetch } = useGetSidebarsQuery({ page: 1, limit: 100 });
  const [addSidebar] = useAddSidebarMutation();
  const [updateSidebar] = useUpdateSidebarMutation();
  const [deleteSidebar] = useDeleteSidebarMutation();
  const [bulkUpdateSidebars] = useBulkUpdateSidebarsMutation();

  const [menuItems, setMenuItems] = useState<SidebarItem[]>([]);
  const [viewItem, setViewItem] = useState<SidebarItem | null>(null);
  const [editItem, setEditItem] = useState<SidebarItem | null>(null);
  const [addParentItem, setAddParentItem] = useState<SidebarItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<SidebarItem | null>(null);
  const [reorderItem, setReorderItem] = useState<SidebarItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [formData, setFormData] = useState({ name: '', path: '', iconName: 'Menu' });
  const [collapsedItems, setCollapsedItems] = useState<Set<number>>(new Set());
  const [iconSearch, setIconSearch] = useState('');

  const [dragState, setDragState] = useState<DragState>({
    activeId: null,
    overId: null,
    activeItem: null,
    originalParentId: null,
    originalIndex: -1,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const filteredIcons = useMemo(() => {
    if (!iconSearch) return iconOptions.slice(0, 100);
    return iconOptions.filter(i => i.toLowerCase().includes(iconSearch.toLowerCase()));
  }, [iconSearch]);

  useEffect(() => {
    if (sidebarData?.data?.sidebars) {
      const mapItem = (item: SidebarItem): SidebarItem => {
        const IconComp = iconMap[item.iconName || 'Menu'] || iconMap.Menu;
        return {
          ...item,
          icon: <IconComp size={18} />,
          children: item.children?.map(mapItem),
        };
      };
      setMenuItems(sidebarData.data.sidebars.map(mapItem));
    }
  }, [sidebarData]);

  const findItemById = useCallback(
    (id: string, items: SidebarItem[] = menuItems): { item: SidebarItem; parentId: number | null; index: number } | null => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.sl_no.toString() === id) return { item, parentId: null, index: i };
        if (item.children) {
          for (let j = 0; j < item.children.length; j++) {
            if (item.children[j].sl_no.toString() === id) return { item: item.children[j], parentId: item.sl_no, index: j };
          }
        }
      }
      return null;
    },
    [menuItems],
  );

  const getAllSortableIds = (): string[] => {
    const ids: string[] = ['drop-zone-top'];
    menuItems.forEach(item => {
      ids.push(item.sl_no.toString());
      if (item.children) item.children.forEach(child => ids.push(child.sl_no.toString()));
    });
    return ids;
  };

  const updateSlNo = (items: SidebarItem[]): SidebarItem[] => {
    return items.map((item, index) => {
      const newSlNo = (index + 1) * 10;
      return {
        ...item,
        sl_no: newSlNo,
        children: item.children?.map((child, childIndex) => ({
          ...child,
          sl_no: newSlNo + childIndex + 1,
        })),
      };
    });
  };

  const handleManualMove = (direction: 'up' | 'down') => {
    if (!reorderItem) return;
    const deepData = JSON.parse(JSON.stringify(menuItems));
    const result = findItemById(reorderItem.sl_no.toString(), deepData);
    if (!result) return;
    const { parentId, index } = result;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    let targetArray: SidebarItem[] = deepData;
    if (parentId !== null) {
      const parent = deepData.find((i: SidebarItem) => i.sl_no === parentId);
      if (parent && parent.children) targetArray = parent.children;
    }
    if (newIndex < 0 || newIndex >= targetArray.length) {
      toast.info(`End reached`);
      return;
    }
    [targetArray[index], targetArray[newIndex]] = [targetArray[newIndex], targetArray[index]];
    setMenuItems(updateSlNo(deepData));
    toast.success(`Position updated`);
    setReorderItem(null);
  };

  const handleDelete = (item: SidebarItem) => setDeleteItem(item);

  const handleDragStart = (event: DragStartEvent) => {
    if (deviceType !== 'desktop') return;
    const activeId = event.active.id.toString();
    const result = findItemById(activeId);
    if (result) {
      setDragState({
        activeId,
        overId: null,
        activeItem: result.item,
        originalParentId: result.parentId,
        originalIndex: result.index,
      });
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (deviceType !== 'desktop') return;
    setDragState(prev => ({ ...prev, overId: event.over?.id?.toString() || null }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (deviceType !== 'desktop') {
      handleDragCancel();
      return;
    }
    const { active, over } = event;
    if (!over) {
      handleDragCancel();
      return;
    }
    const activeId = active.id.toString();
    const overId = over.id.toString();
    if (activeId === overId) {
      handleDragCancel();
      return;
    }
    const activeResult = findItemById(activeId);
    const overResult = overId === 'drop-zone-top' ? null : findItemById(overId);
    if (!activeResult) {
      handleDragCancel();
      return;
    }

    setMenuItems(items => {
      let newItems = [...items];
      if (overId === 'drop-zone-top') {
        newItems = newItems
          .map(item => ({ ...item, children: item.children?.filter(c => c.sl_no !== activeResult.item.sl_no) }))
          .filter(item => item.sl_no !== activeResult.item.sl_no);
        const itemToMove = { ...activeResult.item, children: [] };
        newItems = [itemToMove, ...newItems];
        return updateSlNo(newItems);
      }
      if (!overResult) return items;
      if (overResult.parentId === null && activeResult.parentId !== overResult.item.sl_no) {
        newItems = newItems
          .map(item => ({ ...item, children: item.children?.filter(c => c.sl_no !== activeResult.item.sl_no) }))
          .filter(item => item.sl_no !== activeResult.item.sl_no);
        const target = newItems.find(i => i.sl_no === overResult.item.sl_no);
        if (target) {
          const child = { ...activeResult.item };
          delete child.children;
          target.children = [...(target.children || []), child];
        }
        return updateSlNo(newItems);
      }
      if (activeResult.parentId === overResult.parentId) {
        const parent = newItems.find(i => i.sl_no === activeResult.parentId);
        if (parent?.children) {
          const oldIdx = parent.children.findIndex(c => c.sl_no === activeResult.item.sl_no);
          const newIdx = parent.children.findIndex(c => c.sl_no === overResult.item.sl_no);
          parent.children = arrayMove(parent.children, oldIdx, newIdx);
        } else if (activeResult.parentId === null) {
          const oldIdx = newItems.findIndex(i => i.sl_no === activeResult.item.sl_no);
          const newIdx = newItems.findIndex(i => i.sl_no === overResult.item.sl_no);
          newItems = arrayMove(newItems, oldIdx, newIdx);
        }
        return updateSlNo(newItems);
      }
      return items;
    });
    handleDragCancel();
  };

  const handleDragCancel = () => setDragState({ activeId: null, overId: null, activeItem: null, originalParentId: null, originalIndex: -1 });

  const handleToggleCollapse = (itemId: number) => {
    setCollapsedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    try {
      if (deleteItem._id) {
        await deleteSidebar({ id: deleteItem._id }).unwrap();
      } else {
        const recursiveDelete = (items: SidebarItem[]): SidebarItem[] => {
          return items.filter(i => i.sl_no !== deleteItem.sl_no).map(i => ({ ...i, children: i.children ? recursiveDelete(i.children) : [] }));
        };
        setMenuItems(recursiveDelete(menuItems));
      }
      toast.success('Removed successfully');
      setDeleteItem(null);
      refetch();
    } catch {
      toast.error('Failed to remove');
    }
  };

  const handleEditSave = async () => {
    if (!editItem) return;
    try {
      if (editItem._id) {
        await updateSidebar({ id: editItem._id, name: formData.name, path: formData.path, iconName: formData.iconName }).unwrap();
      } else {
        const recursiveUpdate = (items: SidebarItem[]): SidebarItem[] => {
          return items.map(item => {
            if (item.sl_no === editItem.sl_no) {
              const IconComp = iconMap[formData.iconName] || iconMap.Menu;
              return { ...item, name: formData.name, path: formData.path, iconName: formData.iconName, icon: <IconComp size={18} /> };
            }
            return { ...item, children: item.children ? recursiveUpdate(item.children) : [] };
          });
        };
        setMenuItems(recursiveUpdate(menuItems));
      }
      toast.success('Updated');
      setEditItem(null);
      refetch();
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleAddNew = async () => {
    try {
      await addSidebar({ sl_no: (menuItems.length + 1) * 10, name: formData.name, path: formData.path, iconName: formData.iconName, children: [] }).unwrap();
      toast.success('Menu created');
      setIsAddingNew(false);
      setFormData({ name: '', path: '', iconName: 'Menu' });
      refetch();
    } catch {
      toast.error('Failed to create');
    }
  };

  const handleAddChild = () => {
    if (!addParentItem) return;
    const IconComp = iconMap[formData.iconName] || iconMap.Menu;
    const newChild: SidebarItem = { sl_no: Date.now(), name: formData.name, path: formData.path, iconName: formData.iconName, icon: <IconComp size={18} /> };
    const recursiveAdd = (items: SidebarItem[]): SidebarItem[] => {
      return items.map(item => {
        if (item.sl_no === addParentItem.sl_no) return { ...item, children: [...(item.children || []), newChild] };
        return { ...item, children: item.children ? recursiveAdd(item.children) : [] };
      });
    };
    setMenuItems(updateSlNo(recursiveAdd(menuItems)));
    setAddParentItem(null);
    setFormData({ name: '', path: '', iconName: 'Menu' });
  };

  const handleSubmitBulk = async () => {
    try {
      const cleanData = menuItems.map(item => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { icon, ...rest } = item;
        return {
          id: item._id,
          updateData: {
            ...rest,
            children: item.children?.map(c => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { icon: _, ...childRest } = c;
              return childRest;
            }),
          },
        };
      });
      await bulkUpdateSidebars(cleanData).unwrap();
      toast.success('Hierarchy saved');
      refetch();
    } catch {
      toast.error('Failed to save');
    }
  };

  const renderIconGrid = () => (
    <div className="space-y-3 mt-2">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
        <Input
          value={iconSearch}
          onChange={e => setIconSearch(e.target.value)}
          placeholder="Search icons..."
          className="pl-10 h-10 bg-white/5 border-white/10 text-sm text-white focus:ring-blue-500/50"
        />
      </div>
      <ScrollArea className="h-56 border border-white/10 rounded-xl p-3 bg-white/5 shadow-inner">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {filteredIcons.map(iconName => {
            const IconComp = iconMap[iconName];
            if (!IconComp) return null;
            const isSelected = formData.iconName === iconName;
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => setFormData({ ...formData, iconName: iconName })}
                className={`flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white/10 gap-2 transition-all h-20 border ${
                  isSelected ? 'bg-blue-600/40 text-white border-blue-400 shadow-lg shadow-blue-500/20' : 'text-gray-400 border-transparent'
                }`}
                title={iconName}
              >
                <IconComp size={20} />
                <span className="text-[10px] truncate w-full text-center px-1 leading-tight font-medium">{iconName}</span>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent animate-pulse" />
        <Loader2 className="w-16 h-16 animate-spin text-blue-500 relative z-10" />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-950 text-white selection:bg-blue-500/30">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-6">
        <header className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-sm p-2 pl-4 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            {deviceType === 'mobile' && <Smartphone size={100} />}
            {deviceType === 'tablet' && <Tablet size={100} />}
            {deviceType === 'desktop' && <Monitor size={100} />}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 relative z-10">
            <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-white via-white/80 to-blue-400 bg-clip-text text-transparent mb-2">Sidebar</h1>
            <Button onClick={() => setIsAddingNew(true)} variant="outlineGlassy">
              <Plus size={20} />
              Add New
            </Button>
          </div>
        </header>

        <section className="space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext items={getAllSortableIds()} strategy={verticalListSortingStrategy}>
              {deviceType === 'desktop' && (
                <DropZone id="drop-zone-top" label="Drag items here to promote to top level" isOver={dragState.overId === 'drop-zone-top'} />
              )}

              <AnimatePresence mode="popLayout">
                {menuItems.map(item => (
                  <div key={item.sl_no} className="space-y-2">
                    <SortableItem
                      item={item}
                      onView={setViewItem}
                      onEdit={i => {
                        setEditItem(i);
                        setFormData({ name: i.name, path: i.path, iconName: i.iconName || 'Menu' });
                      }}
                      onDelete={handleDelete}
                      onAddChild={setAddParentItem}
                      onToggleCollapse={handleToggleCollapse}
                      onReorderRequest={setReorderItem}
                      isCollapsed={collapsedItems.has(item.sl_no)}
                      isOverTarget={dragState.overId === item.sl_no.toString()}
                      isDragging={dragState.activeId === item.sl_no.toString()}
                      deviceType={deviceType}
                    />

                    {item.children && item.children.length > 0 && !collapsedItems.has(item.sl_no) && (
                      <motion.div
                        className="space-y-2 border-l-2 border-white/5 ml-4"
                        initial={{ opacity: 0, height: 0, x: -20 }}
                        animate={{ opacity: 1, height: 'auto', x: 0 }}
                        exit={{ opacity: 0, height: 0, x: -20 }}
                      >
                        {item.children.map(child => (
                          <SortableItem
                            key={child.sl_no}
                            item={child}
                            onView={setViewItem}
                            onEdit={i => {
                              setEditItem(i);
                              setFormData({ name: i.name, path: i.path, iconName: i.iconName || 'Menu' });
                            }}
                            onDelete={handleDelete}
                            onReorderRequest={setReorderItem}
                            isChild
                            isOverTarget={dragState.overId === child.sl_no.toString()}
                            isDragging={dragState.activeId === child.sl_no.toString()}
                            deviceType={deviceType}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </AnimatePresence>
            </SortableContext>

            <DragOverlay dropAnimation={null} zIndex={1000}>
              {dragState.activeItem ? (
                <div className="backdrop-blur-3xl bg-blue-600/30 border-2 border-blue-400/50 rounded-xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 scale-105">
                  <div className="p-2 bg-blue-500/40 rounded-lg shadow-inner">{dragState.activeItem.icon}</div>
                  <span className="font-bold text-white text-lg">{dragState.activeItem.name}</span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </section>

        <footer className="flex justify-end pt-4 pb-12">
          <Button onClick={handleSubmitBulk} variant="outlineGlassy">
            <Save size={22} className="mr-3" />
            Commit Changes
          </Button>
        </footer>
      </motion.div>

      <Dialog open={!!reorderItem} onOpenChange={() => setReorderItem(null)}>
        <DialogContent className="backdrop-blur-3xl bg-slate-900/90 border-white/10 text-white w-[95%] sm:max-w-md rounded-2xl shadow-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Relocate &quot;{reorderItem?.name}&quot;</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-6">
            <Button
              onClick={() => handleManualMove('up')}
              variant="outlineGlassy"
              className="h-16 justify-between px-6 text-lg rounded-xl border-white/10 hover:bg-white/10"
            >
              Shift Upwards <ArrowUp className="text-blue-400" />
            </Button>
            <Button
              onClick={() => handleManualMove('down')}
              variant="outlineGlassy"
              className="h-16 justify-between px-6 text-lg rounded-xl border-white/10 hover:bg-white/10"
            >
              Shift Downwards <ArrowDown className="text-purple-400" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {[
        { open: isAddingNew, set: setIsAddingNew, title: 'Global New Menu', btn: 'Create Entry', action: handleAddNew },
        { open: !!editItem, set: () => setEditItem(null), title: 'Refine Details', btn: 'Apply Edits', action: handleEditSave },
        { open: !!addParentItem, set: () => setAddParentItem(null), title: `Submenu for ${addParentItem?.name}`, btn: 'Attach Child', action: handleAddChild },
      ].map((cfg, idx) => (
        <Dialog key={idx} open={cfg.open} onOpenChange={() => cfg.set(false)}>
          <DialogContent className="backdrop-blur-3xl bg-slate-900/90 border-white/10 text-white w-[95%] sm:max-w-lg rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">{cfg.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Display Name</Label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-blue-500/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Route / URL</Label>
                <Input
                  value={formData.path}
                  onChange={e => setFormData({ ...formData, path: e.target.value })}
                  className="h-12 bg-white/5 border-white/10 rounded-xl font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Visual Icon</Label>
                {renderIconGrid()}
              </div>
              <Button
                onClick={cfg.action}
                className="w-full h-14 mt-4 bg-blue-600 hover:bg-blue-500 text-lg font-black rounded-2xl shadow-xl shadow-blue-600/20"
              >
                {cfg.btn}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ))}

      <Dialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <DialogContent className="backdrop-blur-3xl bg-slate-950/90 border-rose-500/20 text-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-rose-400">Destructive Action</DialogTitle>
          </DialogHeader>
          <p className="text-gray-400 font-medium py-2">
            Confirm permanent removal of <span className="text-white font-bold underline decoration-rose-500/50 underline-offset-4">{deleteItem?.name}</span>?
          </p>
          <DialogFooter className="gap-3 mt-4">
            <Button variant="ghost" onClick={() => setDeleteItem(null)} className="h-12 rounded-xl text-gray-400 hover:text-white">
              Abort
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="h-12 px-8 rounded-xl font-bold bg-rose-600 hover:bg-rose-500">
              Confirm Deletion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="backdrop-blur-3xl bg-slate-900/95 border-white/10 text-white rounded-3xl overflow-hidden p-0">
          {viewItem && (
            <div className="relative">
              <div className="h-32 bg-gradient-to-br from-blue-600/40 to-purple-600/40" />
              <div className="px-8 pb-8 -mt-10 relative z-10">
                <div className="p-4 bg-slate-900 border-4 border-slate-950 rounded-2xl w-20 h-20 shadow-2xl flex items-center justify-center text-blue-400 mb-4">
                  {viewItem.icon}
                </div>
                <h3 className="text-3xl font-black mb-1">{viewItem.name}</h3>
                <code className="text-sm text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-6 inline-block">{viewItem.path}</code>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Index ID</p>
                    <p className="text-lg font-mono font-bold text-gray-200">{viewItem.sl_no}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Sub-Items</p>
                    <p className="text-lg font-bold text-gray-200">{viewItem.children?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
