I will give you two example of code. 

1. page.tsx (it render the sidebar data)
2. Add.tsx (it will add role)

Your task is show the list of sidebar data in Add.tsx.
and implement those instruction.
1. every list has a boolean options. 
2. in Add.tsx I want to save the list of name and path.
3. if a list (name, path) is checked then it will save to dashboard_access_ui




example of IRoles and defaultRoles
```
export interface IRoles {
  name: string;
  email: string;
  note: string;
  description: string;
  role: IERoles;
  dashboard_access_ui?: { name: string; path: string }[];
  createdAt: Date;
  updatedAt: Date;
  _id?: string;
}

export const defaultRoles = {
  name: '',
  email: '',
  role: defaulERoles,
  dashboard_access_ui: [],
  note: '',
  description: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  _id: '',
};
```





example of page.tsx 
```
'use client';

import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  FolderKanban,
  FileSignature,
  User,
  Users,
  FileText,
  Settings,
  Info,
  Wrench,
  Phone,
  HelpCircle,
  Menu,
  Lock,
  ScrollText,
  FileBadge,
  Eye,
  Edit2,
  Trash2,
  Plus,
  GripVertical,
  Save,
  ChevronDown,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

export interface SidebarItem {
  _id?: string;
  sl_no: number;
  name: string;
  path: string;
  icon: React.ReactNode;
  iconName?: string;
  children?: SidebarItem[];
}

export interface DragState {
  activeId: string | null;
  overId: string | null;
  activeItem: SidebarItem | null;
  originalParentId: number | null;
  originalIndex: number;
}

export const iconMap: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck size={18} />,
  FolderKanban: <FolderKanban size={16} />,
  FileSignature: <FileSignature size={16} />,
  User: <User size={16} />,
  Users: <Users size={16} />,
  FileText: <FileText size={16} />,
  Settings: <Settings size={18} />,
  Info: <Info size={16} />,
  Wrench: <Wrench size={16} />,
  Phone: <Phone size={16} />,
  HelpCircle: <HelpCircle size={16} />,
  Menu: <Menu size={16} />,
  Lock: <Lock size={16} />,
  ScrollText: <ScrollText size={16} />,
  FileBadge: <FileBadge size={16} />,
};

export const iconOptions = Object.keys(iconMap);

export interface SortableItemProps {
  item: SidebarItem;
  onView: (item: SidebarItem) => void;
  onEdit: (item: SidebarItem) => void;
  onDelete: (item: SidebarItem) => void;
  onAddChild?: (parentItem: SidebarItem) => void;
  onToggleCollapse?: (itemId: number) => void;
  isCollapsed?: boolean;
  isChild?: boolean;
  isOverTarget?: boolean;
  isDragging?: boolean;
  dropPosition?: 'before' | 'after' | 'inside' | null;
}

function SortableItem({
  item,
  onView,
  onEdit,
  onDelete,
  onAddChild,
  onToggleCollapse,
  isCollapsed = false,
  isChild = false,
  isOverTarget = false,
  isDragging = false,
  dropPosition = null,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.sl_no.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
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
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={`group relative backdrop-blur-xl bg-white/10 rounded-lg p-2 shadow-lg hover:shadow-2xl hover:bg-white/20 transition-all duration-300 ${
        isChild ? 'ml-6' : ''
      } ${getBorderClass()}`}
    >
      <div className="flex items-center gap-2">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/20 rounded transition-colors">
          <GripVertical size={18} className="text-gray-300" />
        </div>

        {!isChild && hasChildren && (
          <Button onClick={() => onToggleCollapse?.(item.sl_no)} variant="outlineGlassy" className="w-1 min-w-1" size="xs">
            {isCollapsed ? <ChevronRight size={16} className="text-gray-300" /> : <ChevronDown size={16} className="text-gray-300" />}
          </Button>
        )}

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="p-1.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">{item.icon}</div>
          <span className="font-medium text-sm text-white truncate">{item.name}</span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button onClick={() => onView(item)} variant="outlineGlassy" className="min-w-1" size="xs">
            <Eye size={14} />
          </Button>
          <Button onClick={() => onEdit(item)} variant="outlineGlassy" className="min-w-1" size="xs">
            <Edit2 size={14} />
          </Button>
          <Button onClick={() => onDelete(item)} variant="outlineGlassy" className="min-w-1" size="xs">
            <Trash2 size={14} />
          </Button>
          {!isChild && onAddChild && (
            <Button onClick={() => onAddChild(item)} variant="outlineGlassy" className="min-w-1" size="xs">
              Add +
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function DropZone({ id, label, isOver }: { id: string; label: string; isOver: boolean }) {
  const { setNodeRef } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`h-12 rounded-lg border-2 border-dashed transition-all duration-200 flex items-center justify-center ${
        isOver ? 'border-green-400 bg-green-400/20 scale-105' : 'border-white/20 bg-white/5'
      }`}
    >
      <span className={`text-sm font-medium transition-colors ${isOver ? 'text-green-300' : 'text-gray-400'}`}>{label}</span>
    </div>
  );
}

export default function SiteMenuPage() {
  const { data: sidebarData, isLoading, refetch } = useGetSidebarsQuery({ page: 1, limit: 100 });
  const [addSidebar] = useAddSidebarMutation();
  const [updateSidebar] = useUpdateSidebarMutation();
  const [deleteSidebar] = useDeleteSidebarMutation();
  const [bulkUpdateSidebars] = useBulkUpdateSidebarsMutation();

  const [menuItems, setMenuItems] = useState<SidebarItem[]>([]);
  const [originalData, setOriginalData] = useState<SidebarItem[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [viewItem, setViewItem] = useState<SidebarItem | null>(null);
  const [editItem, setEditItem] = useState<SidebarItem | null>(null);
  const [addParentItem, setAddParentItem] = useState<SidebarItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<SidebarItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({ name: '', path: '', iconName: 'Menu' });
  const [collapsedItems, setCollapsedItems] = useState<Set<number>>(new Set());

  const [dragState, setDragState] = useState<DragState>({
    activeId: null,
    overId: null,
    activeItem: null,
    originalParentId: null,
    originalIndex: -1,
  });

  useEffect(() => {
    if (sidebarData?.data?.sidebars) {
      const formattedData = sidebarData.data.sidebars.map((item: SidebarItem) => ({
        ...item,
        icon: iconMap[item.iconName || 'Menu'] || iconMap.Menu,
        children: item.children?.map(child => ({
          ...child,
          icon: iconMap[child.iconName || 'Menu'] || iconMap.Menu,
        })),
      }));
      setMenuItems(formattedData);
      setOriginalData(JSON.parse(JSON.stringify(formattedData)));
      setHasChanges(false);
    }
  }, [sidebarData]);

  useEffect(() => {
    const compareItems = (items1: SidebarItem[], items2: SidebarItem[]): boolean => {
      if (items1.length !== items2.length) return false;

      return items1.every((item1, index) => {
        const item2 = items2[index];
        if (!item2) return false;

        const basicMatch = item1.sl_no === item2.sl_no && item1.name === item2.name && item1.path === item2.path && item1.iconName === item2.iconName;

        if (!basicMatch) return false;

        const children1 = item1.children || [];
        const children2 = item2.children || [];

        if (children1.length !== children2.length) return false;

        return children1.every((child1, childIndex) => {
          const child2 = children2[childIndex];
          return child2 && child1.sl_no === child2.sl_no && child1.name === child2.name && child1.path === child2.path && child1.iconName === child2.iconName;
        });
      });
    };

    const dataChanged = !compareItems(menuItems, originalData);
    setHasChanges(dataChanged);
  }, [menuItems, originalData]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  const findItemById = (id: string, items: SidebarItem[] = menuItems): { item: SidebarItem; parentId: number | null; index: number } | null => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.sl_no.toString() === id) {
        return { item, parentId: null, index: i };
      }
      if (item.children) {
        for (let j = 0; j < item.children.length; j++) {
          if (item.children[j].sl_no.toString() === id) {
            return { item: item.children[j], parentId: item.sl_no, index: j };
          }
        }
      }
    }
    return null;
  };

  const getAllSortableIds = (): string[] => {
    const ids: string[] = ['drop-zone-top'];
    menuItems.forEach(item => {
      ids.push(item.sl_no.toString());
      if (item.children) {
        item.children.forEach(child => ids.push(child.sl_no.toString()));
      }
    });
    return ids;
  };

  const getDropPosition = (overId: string, activeId: string): 'before' | 'after' | 'inside' | null => {
    if (!overId || overId === activeId) return null;

    const overItem = findItemById(overId);
    const activeItem = findItemById(activeId);

    if (!overItem || !activeItem) return null;

    if (overItem.parentId === null && activeItem.parentId !== null) {
      return 'inside';
    }

    if (overItem.parentId === activeItem.parentId) {
      return overItem.index > activeItem.index ? 'after' : 'before';
    }

    return 'inside';
  };

  const handleDragStart = (event: DragStartEvent) => {
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
    const overId = event.over?.id?.toString() || null;
    setDragState(prev => ({ ...prev, overId }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setDragState({
        activeId: null,
        overId: null,
        activeItem: null,
        originalParentId: null,
        originalIndex: -1,
      });
      return;
    }

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId === overId) {
      setDragState({
        activeId: null,
        overId: null,
        activeItem: null,
        originalParentId: null,
        originalIndex: -1,
      });
      return;
    }

    const activeResult = findItemById(activeId);
    const overResult = overId === 'drop-zone-top' ? null : findItemById(overId);

    if (!activeResult) {
      setDragState({
        activeId: null,
        overId: null,
        activeItem: null,
        originalParentId: null,
        originalIndex: -1,
      });
      return;
    }

    setMenuItems(items => {
      let newItems = [...items];

      if (overId === 'drop-zone-top') {
        newItems = newItems.map(item => ({
          ...item,
          children: item.children?.filter(c => c.sl_no !== activeResult.item.sl_no),
        }));

        const itemToMove = { ...activeResult.item, children: [] };
        newItems = [itemToMove, ...newItems];
        toast.success(`"${activeResult.item.name}" moved to top level!`, { toastId: `move-top-${Date.now()}` });
        return updateSlNo(newItems);
      }

      if (!overResult) return items;

      if (overResult.parentId === null) {
        newItems = newItems.map(item => ({
          ...item,
          children: item.children?.filter(c => c.sl_no !== activeResult.item.sl_no),
        }));

        newItems = newItems.filter(item => item.sl_no !== activeResult.item.sl_no);

        const targetParent = newItems.find(item => item.sl_no === overResult.item.sl_no);
        if (targetParent) {
          const childToAdd = { ...activeResult.item };
          delete childToAdd.children;
          targetParent.children = [...(targetParent.children || []), childToAdd];
          toast.success(`"${activeResult.item.name}" moved to "${targetParent.name}" submenu!`, { toastId: `move-submenu-${Date.now()}` });
        }

        return updateSlNo(newItems);
      }

      if (activeResult.parentId === overResult.parentId) {
        const parent = newItems.find(item => item.sl_no === activeResult.parentId);
        if (parent?.children) {
          const oldIndex = parent.children.findIndex(c => c.sl_no === activeResult.item.sl_no);
          const newIndex = parent.children.findIndex(c => c.sl_no === overResult.item.sl_no);
          parent.children = arrayMove(parent.children, oldIndex, newIndex);
          toast.success('Submenu reordered!', { toastId: `reorder-${Date.now()}` });
        }
        return updateSlNo(newItems);
      }

      newItems = newItems.map(item => {
        if (item.sl_no === activeResult.parentId) {
          return {
            ...item,
            children: item.children?.filter(c => c.sl_no !== activeResult.item.sl_no),
          };
        }
        if (item.sl_no === overResult.parentId) {
          const childToAdd = { ...activeResult.item };
          delete childToAdd.children;
          return {
            ...item,
            children: [...(item.children || []), childToAdd],
          };
        }
        return item;
      });

      toast.success(`"${activeResult.item.name}" moved successfully!`, { toastId: `move-${Date.now()}` });
      return updateSlNo(newItems);
    });

    setDragState({
      activeId: null,
      overId: null,
      activeItem: null,
      originalParentId: null,
      originalIndex: -1,
    });
  };

  const handleDragCancel = () => {
    setDragState({
      activeId: null,
      overId: null,
      activeItem: null,
      originalParentId: null,
      originalIndex: -1,
    });
  };

  const handleToggleCollapse = (itemId: number) => {
    setCollapsedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleDelete = (item: SidebarItem) => {
    setDeleteItem(item);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;

    try {
      if (deleteItem._id) {
        await deleteSidebar({ id: deleteItem._id }).unwrap();
        toast.success(`"${deleteItem.name}" deleted successfully!`, { toastId: `delete-${Date.now()}` });
      }
      setDeleteItem(null);
      refetch();
    } catch (error) {
      toast.error('Failed to delete sidebar item', { toastId: `error-delete-${Date.now()}` });
    }
  };

  const handleEditSave = async () => {
    if (!editItem) return;

    try {
      if (editItem._id) {
        await updateSidebar({
          id: editItem._id,
          name: formData.name,
          path: formData.path,
          iconName: formData.iconName,
        }).unwrap();

        toast.success(`"${formData.name}" updated successfully!`, { toastId: `edit-${Date.now()}` });
      }

      setEditItem(null);
      setFormData({ name: '', path: '', iconName: 'Menu' });
      refetch();
    } catch (error) {
      toast.error('Failed to update sidebar item', { toastId: `error-edit-${Date.now()}` });
    }
  };

  const handleAddNew = async () => {
    if (!formData.name || !formData.path) {
      toast.error('Please fill in all fields', { toastId: `error-${Date.now()}` });
      return;
    }

    try {
      const newSlNo = (menuItems.length + 1) * 10;

      await addSidebar({
        sl_no: newSlNo,
        name: formData.name,
        path: formData.path,
        iconName: formData.iconName,
        children: [],
      }).unwrap();

      toast.success(`"${formData.name}" added successfully!`, { toastId: `add-${Date.now()}` });
      setIsAddingNew(false);
      setFormData({ name: '', path: '', iconName: 'Menu' });
      refetch();
    } catch (error) {
      toast.error('Failed to add sidebar item', { toastId: `error-add-${Date.now()}` });
    }
  };

  const handleAddChild = () => {
    if (!addParentItem || !formData.name || !formData.path) {
      toast.error('Please fill in all fields', { toastId: `error-${Date.now()}` });
      return;
    }

    setMenuItems(items =>
      updateSlNo(
        items.map(item => {
          if (item.sl_no === addParentItem.sl_no) {
            const children = item.children || [];
            const newChild: SidebarItem = {
              sl_no: item.sl_no * 10 + children.length + 1,
              name: formData.name,
              path: formData.path,
              icon: iconMap[formData.iconName] || iconMap.Menu,
              iconName: formData.iconName,
            };
            return { ...item, children: [...children, newChild] };
          }
          return item;
        }),
      ),
    );

    toast.success(`"${formData.name}" added as submenu!`, { toastId: `add-child-${Date.now()}` });
    setAddParentItem(null);
    setFormData({ name: '', path: '', iconName: 'Menu' });
  };

  const handleSubmit = async () => {
    try {
      const updates = menuItems.map(item => {
        const { icon, ...itemWithoutIcon } = item;
        return {
          id: item._id,
          updateData: {
            ...itemWithoutIcon,
            children: item.children?.map(({ icon: childIcon, ...child }) => child),
          },
        };
      });

      await bulkUpdateSidebars(updates).unwrap();
      toast.success('Menu data saved successfully!', { toastId: `submit-${Date.now()}` });
      refetch();
    } catch (error) {
      toast.error('Failed to save menu data', { toastId: `error-submit-${Date.now()}` });
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4 md:p-6">
      <div className="mt-[65px]" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-3 sm:p-4 mb-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Site Menu Editor</h1>
              <p className="text-sm text-gray-300">Drag submenu items anywhere: reorder, move between parents, or promote to top-level</p>
            </div>
            <Button onClick={() => setIsAddingNew(true)} variant="outlineGlassy" size="sm">
              <Plus size={18} className="mr-2" />
              Add New Menu
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext items={getAllSortableIds()} strategy={verticalListSortingStrategy}>
              <DropZone id="drop-zone-top" label="Drop here to create top-level menu" isOver={dragState.overId === 'drop-zone-top'} />

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
                      isCollapsed={collapsedItems.has(item.sl_no)}
                      isOverTarget={dragState.overId === item.sl_no.toString()}
                      isDragging={dragState.activeId === item.sl_no.toString()}
                      dropPosition={getDropPosition(dragState.overId || '', dragState.activeId || '')}
                    />

                    {item.children && item.children.length > 0 && !collapsedItems.has(item.sl_no) && (
                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
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
                            isChild
                            isOverTarget={dragState.overId === child.sl_no.toString()}
                            isDragging={dragState.activeId === child.sl_no.toString()}
                            dropPosition={getDropPosition(dragState.overId || '', dragState.activeId || '')}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </AnimatePresence>
            </SortableContext>

            <DragOverlay dropAnimation={null}>
              {dragState.activeItem ? (
                <div className="backdrop-blur-xl bg-white/30 border-2 border-blue-400 rounded-lg p-2 shadow-2xl cursor-grabbing">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-white/40 rounded">
                      <GripVertical size={18} className="text-white" />
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <div className="p-1.5 bg-gradient-to-br from-blue-400/50 to-purple-400/50 rounded-lg">{dragState.activeItem.icon}</div>
                      <span className="font-semibold text-sm text-white">{dragState.activeItem.name}</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        <div className="w-full flex items-center justify-end mt-4">
          <Button onClick={handleSubmit} variant="outlineGlassy" disabled={!hasChanges}>
            <Save size={20} className="mr-2" />
            Submit Menu
          </Button>
        </div>
      </motion.div>

      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="backdrop-blur-xl bg-transparent border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">View Menu Item</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">{viewItem.icon}</div>
                <span className="font-semibold text-lg">{viewItem.name}</span>
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="p-2 bg-white/5 rounded">
                  <span className="text-gray-400">Serial No:</span>
                  <span className="ml-2 font-mono">{viewItem.sl_no}</span>
                </div>
                <div className="p-2 bg-white/5 rounded">
                  <span className="text-gray-400">Path:</span>
                  <span className="ml-2 font-mono">{viewItem.path}</span>
                </div>
                <div className="p-2 bg-white/5 rounded">
                  <span className="text-gray-400">Icon:</span>
                  <span className="ml-2">{viewItem.iconName || 'N/A'}</span>
                </div>
                {viewItem.children && (
                  <div className="p-2 bg-white/5 rounded">
                    <span className="text-gray-400">Submenu Items:</span>
                    <span className="ml-2">{viewItem.children.length}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="backdrop-blur-xl bg-transparent border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Menu Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white mb-2">Name</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label className="text-white mb-2">Path</Label>
              <Input
                value={formData.path}
                onChange={e => setFormData({ ...formData, path: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label className="text-white mb-2">Icon</Label>
              <ScrollArea className="w-full h-48 pr-1">
                <div className="grid grid-cols-4 gap-2 p-2">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, iconName: icon })}
                      className={`flex flex-col items-center gap-1 p-2 rounded-md transition-all ${
                        formData.iconName === icon ? 'bg-blue-500/30 border-2 border-blue-400' : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-white">{iconMap[icon]}</div>
                      <span className="text-xs text-gray-300 truncate w-full text-center">{icon}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="w-full flex items-center justify-end">
              <Button onClick={handleEditSave} variant="outlineGlassy" size="sm">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
        <DialogContent className="backdrop-blur-xl bg-transparent border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add New Menu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white mb-2">Name</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter menu name"
              />
            </div>
            <div>
              <Label className="text-white mb-2">Path</Label>
              <Input
                value={formData.path}
                onChange={e => setFormData({ ...formData, path: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="/dashboard/..."
              />
            </div>
            <div>
              <Label className="text-white mb-2">Icon</Label>
              <ScrollArea className="w-full h-48 pr-1">
                <div className="grid grid-cols-4 gap-2 p-2">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, iconName: icon })}
                      className={`flex flex-col items-center gap-1 p-2 rounded-md transition-all ${
                        formData.iconName === icon ? 'bg-blue-500/30 border-2 border-blue-400' : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-white">{iconMap[icon]}</div>
                      <span className="text-xs text-gray-300 truncate w-full text-center">{icon}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="w-full flex justify-end">
              <Button onClick={handleAddNew} variant="outlineGlassy">
                Add Menu
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!addParentItem} onOpenChange={() => setAddParentItem(null)}>
        <DialogContent className="backdrop-blur-xl bg-transparent border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add Submenu to &quot;{addParentItem?.name}&quot;</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white mb-2">Name</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter submenu name"
              />
            </div>
            <div>
              <Label className="text-white mb-2">Path</Label>
              <Input
                value={formData.path}
                onChange={e => setFormData({ ...formData, path: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="/dashboard/..."
              />
            </div>
            <div>
              <Label className="text-white mb-2">Icon</Label>
              <ScrollArea className="w-full h-48 pr-1">
                <div className="grid grid-cols-4 gap-2 p-2">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, iconName: icon })}
                      className={`flex flex-col items-center gap-1 p-2 rounded-md transition-all ${
                        formData.iconName === icon ? 'bg-blue-500/30 border-2 border-blue-400' : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-white">{iconMap[icon]}</div>
                      <span className="text-xs text-gray-300 truncate w-full text-center">{icon}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="w-full flex items-center justify-end">
              <Button onClick={handleAddChild} variant="outlineGlassy" size="sm">
                Add Submenu
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <DialogContent className="backdrop-blur-xl bg-transparent border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Delete Menu Item</DialogTitle>
          </DialogHeader>
          {deleteItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="p-2 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg">{deleteItem.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{deleteItem.name}</p>
                  <p className="text-sm text-gray-400 font-mono">{deleteItem.path}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Are you sure you want to delete <span className="font-semibold text-white">&quot;{deleteItem.name}&quot;</span>? This action cannot be undone.
              </p>
              {deleteItem.children && deleteItem.children.length > 0 && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-300 text-sm font-medium">
                    ⚠️ Warning: This menu has {deleteItem.children.length} submenu item(s) that will also be deleted.
                  </p>
                </div>
              )}
              <div className="flex items-center gap-3 justify-end pt-2">
                <Button onClick={() => setDeleteItem(null)} variant="outlineGlassy" size="sm">
                  Cancel
                </Button>
                <Button onClick={confirmDelete} variant="outlineFire" size="sm">
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
```

example of Add.tsx 
```
'use client';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField';

import { useRolesStore } from '../store/store';
import { useAddRolesMutation } from '@/redux/features/roles/rolesSlice';
import { IRoles, IERoles, defaultRoles, defaulERoles } from '../store/data/data';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';
import { authClient } from '@/lib/auth-client';
import { Input } from '@/components/ui/input';
import { useGetSidebarsQuery } from '@/redux/features/sidebars/sidebarsSlice';

const AddNextComponents: React.FC = () => {
  const { toggleAddModal, isAddModalOpen, setRoles } = useRolesStore();
  const [addRoles, { isLoading }] = useAddRolesMutation();
  const [newRole, setNewRole] = useState<IRoles>(defaultRoles);
  const { data: sidebarData, isLoading: sidebarIsLoading, refetch } = useGetSidebarsQuery({ page: 1, limit: 100 });

  const sessionEmail = authClient.useSession().data?.user.email || '';
  const handleFieldChange = (name: string, value: unknown) => {
    setNewRole(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (module: keyof IERoles, permission: keyof IERoles[keyof IERoles]) => {
    setNewRole(prev => ({
      ...prev,
      role: {
        ...prev.role,
        [module]: {
          ...prev.role[module],
          [permission]: !prev.role[module][permission],
        },
      },
    }));
  };

  const handleAddRole = async () => {
    try {
      const updateData = { ...newRole };
      delete updateData._id;
      updateData.email = sessionEmail;
      const addedRole = await addRoles(updateData).unwrap();
      setRoles([addedRole]);
      toggleAddModal(false);
      setNewRole(defaultRoles);
      handleSuccess('Added Successfully');
    } catch (error: unknown) {
      console.error('Failed to add record:', error);
      let errMessage: string = 'An unknown error occurred.';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message) || 'An API error occurred.';
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      handleError(errMessage);
    }
  };

  const permissionKeys = Object.keys(defaulERoles) as (keyof IERoles)[];

  return (
    <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
      <DialogContent className="sm:max-w-[900px] rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl text-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white/90">Add New Role</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full rounded-md border border-white/10 p-4">
          <div className="grid gap-4 py-4">
            {/* ====== Name ====== */}
            <div className="grid grid-cols-1  items-center gap-4 pr-1">
              <Label htmlFor="name" className="text-right text-white/80">
                Role Name
              </Label>
              <div className="col-span-3">
                <InputFieldForString id="name" placeholder="Admin" value={newRole['name']} onChange={value => handleFieldChange('name', value as string)} />
              </div>
            </div>

            {/* ====== Note ====== */}
            <div className="grid grid-cols-1  items-start gap-4 pr-1">
              <Label htmlFor="note" className="text-right text-white/80 pt-3">
                Note
              </Label>
              <div className="col-span-3">
                <RichTextEditorField id="note" value={newRole['note']} onChange={value => handleFieldChange('note', value)} />
              </div>
            </div>

            {/* ====== Description ====== */}
            <div className="grid grid-cols-1  items-start gap-4 pr-1">
              <Label htmlFor="description" className="text-right text-white/80 pt-3">
                Description
              </Label>
              <div className="col-span-3">
                <RichTextEditorField id="description" value={newRole['description']} onChange={value => handleFieldChange('description', value)} />
              </div>
            </div>

            {/* ====== Email ====== */}
            <div className="grid grid-cols-1  items-center gap-4 pr-1">
              <Label htmlFor="email" className="text-right text-white/80">
                Email
              </Label>
              <div className="col-span-3">
                <Input id="email" readOnly value={authClient.useSession().data?.user.email || newRole['email']} />
              </div>
            </div>

            {/* ====== Role Permission Table ====== */}
            <div className="grid grid-cols-1  items-start gap-4 pr-1">
              <Label htmlFor="role" className="text-right text-white/80 pt-3">
                Role Permissions
              </Label>

              <div className="col-span-3 overflow-x-auto rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md p-4">
                <table className="w-full text-sm text-left text-white/90">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="py-2 px-3 text-left">Module</th>
                      <th className="py-2 px-3 text-center">Create</th>
                      <th className="py-2 px-3 text-center">Read</th>
                      <th className="py-2 px-3 text-center">Update</th>
                      <th className="py-2 px-3 text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissionKeys.map(module => (
                      <tr key={module} className="border-b border-white/10 hover:bg-white/10 transition-all duration-150">
                        <td className="py-2 px-3 capitalize">{module.replace(/_/g, ' ')}</td>
                        {(['create', 'read', 'update', 'delete'] as const).map(permission => (
                          <td key={permission} className="py-2 px-3 text-center">
                            <Checkbox checked={newRole.role[module][permission]} onCheckedChange={() => handlePermissionChange(module, permission)} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => toggleAddModal(false)} className="bg-transparent border-white/20 text-white/80 hover:bg-white/20">
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleAddRole} className="bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white transition-all">
            {isLoading ? 'Adding...' : 'Add Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNextComponents;
```



Now please generate Add.tsx.