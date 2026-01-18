look at the first page.tsx 
```
'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { Eye, Edit2, Trash2, Plus, GripVertical, Save, ChevronDown, ChevronRight, Loader2, Search } from 'lucide-react';
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

// --- Updated Import ---
import { iconMap, iconOptions } from '@/components/all-icons/all-icons-jsx';
import { DragState, SidebarItem, SortableItemProps } from './utils';
import { logger } from 'better-auth';

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
  const [, setHasChanges] = useState(false);
  const [viewItem, setViewItem] = useState<SidebarItem | null>(null);
  const [editItem, setEditItem] = useState<SidebarItem | null>(null);
  const [addParentItem, setAddParentItem] = useState<SidebarItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<SidebarItem | null>(null);
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

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!iconSearch) return iconOptions.slice(0, 100);
    return iconOptions.filter(i => i.toLowerCase().includes(iconSearch.toLowerCase()));
  }, [iconSearch]);

  useEffect(() => {
    if (sidebarData?.data?.sidebars) {
      // Helper to map DB item to State Item
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapItem = (item: any): SidebarItem => {
        const IconComp = iconMap[item.iconName || 'Menu'] || iconMap.Menu;
        return {
          ...item,
          // Render the component
          icon: <IconComp size={18} />,
          children: item.children?.map(mapItem),
        };
      };

      const formattedData = sidebarData.data.sidebars.map(mapItem);
      setMenuItems(formattedData);
      setOriginalData(JSON.parse(JSON.stringify(formattedData)));
      setHasChanges(false);
    }
  }, [sidebarData]);

  // Reset icon search on dialog close
  useEffect(() => {
    if (!editItem && !isAddingNew && !addParentItem) {
      setIconSearch('');
    }
  }, [editItem, isAddingNew, addParentItem]);

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
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
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

    handleDragCancel();
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
      let parentItem = null;
      for (const item of menuItems) {
        if (item.children && item.children.some(child => child.sl_no === deleteItem.sl_no)) {
          parentItem = item;
          break;
        }
      }

      if (parentItem) {
        const updatedChildren = (parentItem.children ?? [])
          .filter(child => child.sl_no !== deleteItem.sl_no)
          .map(({ icon, ...rest }) => {
            logger.info(JSON.stringify(icon));
            return rest;
          });
        await updateSidebar({
          id: parentItem._id,
          name: parentItem.name,
          path: parentItem.path,
          iconName: parentItem.iconName,
          children: updatedChildren,
        }).unwrap();
        toast.success(`"${deleteItem.name}" deleted successfully!`, { toastId: `delete-${Date.now()}` });
      } else if (deleteItem._id) {
        await deleteSidebar({ id: deleteItem._id }).unwrap();
        toast.success(`"${deleteItem.name}" deleted successfully!`, { toastId: `delete-${Date.now()}` });
      }
      setDeleteItem(null);
      refetch();
    } catch {
      toast.error('Failed to delete sidebar item', { toastId: `error-delete-${Date.now()}` });
    }
  };

  const handleEditSave = async () => {
    if (!editItem) return;

    try {
      let parentItem = null;
      for (const item of menuItems) {
        if (item.children && item.children.some(child => child.sl_no === editItem.sl_no)) {
          parentItem = item;
          break;
        }
      }

      if (parentItem) {
        const updatedChildren = (parentItem.children ?? [])
          .map(child => {
            if (child.sl_no === editItem.sl_no) {
              const IconComp = iconMap[formData.iconName] || iconMap.Menu;
              return {
                ...child,
                name: formData.name,
                path: formData.path,
                iconName: formData.iconName,
                icon: <IconComp size={18} />,
              };
            }
            return child;
          })
          .map(({ icon, ...rest }) => {
            logger.info(JSON.stringify(icon));
            return rest;
          });

        await updateSidebar({
          id: parentItem._id,
          name: parentItem.name,
          path: parentItem.path,
          iconName: parentItem.iconName,
          children: updatedChildren,
        }).unwrap();
        toast.success(`"${formData.name}" updated successfully!`, { toastId: `edit-${Date.now()}` });
      } else if (editItem._id) {
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
    } catch {
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
    } catch {
      toast.error('Failed to add sidebar item', { toastId: `error-add-${Date.now()}` });
    }
  };

  const handleAddChild = () => {
    if (!addParentItem || !formData.name || !formData.path) {
      toast.error('Please fill in all fields', { toastId: `error-${Date.now()}` });
      return;
    }

    const IconComp = iconMap[formData.iconName] || iconMap.Menu;

    setMenuItems(items =>
      updateSlNo(
        items.map(item => {
          if (item.sl_no === addParentItem.sl_no) {
            const children = item.children || [];
            const newChild: SidebarItem = {
              sl_no: item.sl_no * 10 + children.length + 1,
              name: formData.name,
              path: formData.path,
              icon: <IconComp size={18} />,
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
        logger.info(JSON.stringify(icon));
        return {
          id: item._id,
          updateData: {
            ...itemWithoutIcon,
            children: item.children?.map(({ icon: childIcon, ...child }) => {
              logger.info(JSON.stringify(childIcon));
              return child;
            }),
          },
        };
      });

      await bulkUpdateSidebars(updates).unwrap();
      toast.success('Menu data saved successfully!', { toastId: `submit-${Date.now()}` });
      refetch();
    } catch (error) {
      logger.error(JSON.stringify(error));
      toast.error('Failed to save menu data', { toastId: `error-submit-${Date.now()}` });
    }
  };

  // Helper for rendering Icon Grid with Names
  const renderIconGrid = () => (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          value={iconSearch}
          onChange={e => setIconSearch(e.target.value)}
          placeholder="Search icons..."
          className="pl-8 h-8 bg-white/5 border-white/10 text-xs text-white"
        />
      </div>
      <ScrollArea className="h-48 border border-white/10 rounded-lg p-2 bg-white/5">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {filteredIcons.map(iconName => {
            const IconComp = iconMap[iconName];
            if (!IconComp) return null;
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => setFormData({ ...formData, iconName: iconName })}
                className={`flex flex-col items-center justify-center p-2 rounded hover:bg-white/20 gap-1 transition-all h-16 hover:text-white hover:border border-slate-100/50 ${
                  formData.iconName === iconName ? 'bg-blue-600 text-white scale-105' : 'text-gray-400'
                }`}
                title={iconName}
              >
                <IconComp size={18} />
                <span className="text-[10px] truncate w-full text-center leading-none">{iconName}</span>
              </button>
            );
          })}
        </div>
        {filteredIcons.length === 0 && <div className="text-center text-gray-500 text-xs py-8">No icons found</div>}
      </ScrollArea>
    </div>
  );

  if (isLoading) {
    return (
      <main className="min-h-screen bg-transparent blur-4xl flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-2 bg-transparent blur-4xl sm:p-4 md:p-6">
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
          <Button onClick={handleSubmit} variant="outlineGlassy">
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
              {renderIconGrid()}
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
              {renderIconGrid()}
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
              {renderIconGrid()}
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

and here is second page.tsx 
```
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  Video,
  ImageIcon,
  FileText,
  FileCode,
  Trash2,
  CheckCircle,
  Plus,
  HardDrive,
  Ghost,
  Headphones,
  Volume2,
  Eye,
  Search,
  X,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { IoReloadCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import Image from 'next/image';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

import { useGetMediasQuery, useAddMediaMutation, useUpdateMediaMutation, useDeleteMediaMutation } from '@/redux/features/media/mediaSlice';

import imageCompression from 'browser-image-compression';
import { UploadButton } from '@/lib/uploadthing';
import { CustomLink } from '@/components/dashboard-ui/LinkButton';

type MediaType = 'all' | 'video' | 'image' | 'pdf' | 'docx' | 'audio';
type MediaStatus = 'active' | 'trash';

interface MediaItem {
  _id: string;
  url: string;
  name?: string;
  contentType: MediaType;
  status: MediaStatus;
  createdAt: string;
}

export default function MediaDashboard() {
  const [activeTab, setActiveTab] = useState<MediaType>('all');
  const [activeStatus, setActiveStatus] = useState<MediaStatus>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetMediasQuery({
    page: currentPage,
    limit: 10,
    q: debouncedSearch,
    contentType: activeTab,
    status: activeStatus,
  });

  const [addMedia, { isLoading: isAdding }] = useAddMediaMutation();
  const [updateMedia] = useUpdateMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();

  const items = useMemo(() => response?.data || [], [response]);
  const totalItems = response?.total || 0;
  const totalPages = Math.ceil(totalItems / 10);

  const handleUpdateStatus = async (id: string, newStatus: MediaStatus) => {
    setProcessingId(id);
    try {
      await updateMedia({ id, status: newStatus }).unwrap();
      toast.success(`Asset status synchronized to ${newStatus}`);
    } catch {
      toast.error('Pessimistic update failed: Server unreachable');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanent deletion is irreversible. Continue?')) return;
    setProcessingId(id);
    try {
      await deleteMedia({ id }).unwrap();
      toast.success('Asset purged from database');
    } catch {
      toast.error('Purge sequence aborted by server');
    } finally {
      setProcessingId(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const toastId = toast.loading('Compressing and uploading...');
    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const formData = new FormData();
      formData.append('image', compressedFile);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        await addMedia({ url: data.data.url, name: file.name, contentType: 'image', status: 'active' }).unwrap();
        toast.update(toastId, { render: 'Asset integrated', type: 'success', isLoading: false, autoClose: 2000 });
        setIsAddDialogOpen(false);
      }
    } catch {
      toast.update(toastId, { render: 'Uplink failure', type: 'error', isLoading: false, autoClose: 2000 });
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 text-white relative">
      <div className="container mx-auto space-y-8 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-5xl font-black uppercase tracking-tighter italic bg-gradient-to-r from-white to-white/30 bg-clip-text text-transparent">
              Media
            </h1>
            <p className="text-[10px] font-mono text-indigo-400/60 uppercase tracking-[0.3em]">System.Media.Controller_v1.0</p>
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" variant="outlineWater" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} /> Sync Array
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outlineGarden">
                  <Plus className="w-4 h-4 mr-2" /> Ingest
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-950/95 border-white/10 rounded-[2rem] text-white">
                <DialogHeader>
                  <DialogTitle className="uppercase italic">New Ingestion Protocol</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-6">
                  <label className="col-span-2 p-10 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-white/5 cursor-pointer transition-all">
                    <ImageIcon className="w-8 h-8 text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Image Source</span>
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                  {['video', 'audio', 'pdf', 'docx'].map(type => (
                    <div key={type} className="p-2 bg-white/5 rounded-xl">
                      <UploadButton
                        endpoint={type === 'docx' ? 'documentUploader' : type === 'pdf' ? 'pdfUploader' : type === 'video' ? 'videoUploader' : 'audioUploader'}
                        onClientUploadComplete={res => {
                          if (res?.[0]) {
                            addMedia({ url: res[0].url, name: res[0].name, contentType: type as MediaType, status: 'active' }).unwrap();
                            setIsAddDialogOpen(false);
                            toast.success('Asset Registered');
                          }
                        }}
                        appearance={{ button: 'w-full bg-indigo-600/20 text-[9px] font-bold uppercase h-8' }}
                      />
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-xl">
          <Tabs
            value={activeTab}
            onValueChange={v => {
              setActiveTab(v as MediaType);
              setCurrentPage(1);
            }}
          >
            <TabsList className="bg-black/40 h-12 rounded-xl">
              {['all', 'image', 'video', 'audio', 'pdf', 'docx'].map(t => (
                <TabsTrigger key={t} value={t} className="uppercase text-[10px] font-black px-4">
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-black/40 border-white/10 pl-10 h-12 rounded-xl"
                placeholder="Filter IDs..."
              />
            </div>
            <div className="flex bg-black/40 p-1 rounded-xl">
              {['active', 'trash'].map(s => (
                <Button
                  key={s}
                  variant="ghost"
                  onClick={() => setActiveStatus(s as MediaStatus)}
                  className={`h-10 px-4 text-[10px] font-black uppercase tracking-widest ${activeStatus === s ? 'bg-white/10 text-white' : 'text-white/20'}`}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <main className="min-h-[500px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Retrieving Array</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <AnimatePresence mode="popLayout">
                {items.map((item: MediaItem) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative bg-slate-900/40 rounded-[2rem] border border-white/10 overflow-hidden transition-all duration-500 hover:border-indigo-500/50"
                  >
                    {/* Media Body */}
                    <div className="aspect-square relative flex items-center justify-center bg-black/20">
                      {item.contentType === 'image' && (
                        <Image
                          src={item.url}
                          alt=""
                          fill
                          className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                          unoptimized
                        />
                      )}
                      {item.contentType === 'video' && <Video className="w-12 h-12 text-white/10" />}
                      {item.contentType === 'audio' && <Volume2 className="w-12 h-12 text-indigo-500/40 animate-pulse" />}
                      {(item.contentType === 'pdf' || item.contentType === 'docx') && <FileText className="w-12 h-12 text-white/10" />}

                      {/* Pessimistic Loading Overlay */}
                      {processingId === item._id && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        </div>
                      )}

                      {/* Hover Controls */}
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outlineWater"
                            className="flex-1 rounded-xl h-10"
                            onClick={() => {
                              setPreviewMedia(item);
                              setIsPreviewDialogOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {activeStatus === 'active' ? (
                            <Button
                              size="sm"
                              variant="outlineFire"
                              className="w-10 h-10 rounded-xl p-0"
                              disabled={!!processingId}
                              onClick={() => handleUpdateStatus(item._id, 'trash')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outlineGarden"
                                className="w-10 h-10 rounded-xl p-0"
                                disabled={!!processingId}
                                onClick={() => handleUpdateStatus(item._id, 'active')}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outlineFire"
                                className="w-10 h-10 rounded-xl p-0"
                                disabled={!!processingId}
                                onClick={() => handleDelete(item._id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-white/5">
                      <p className="text-[10px] font-bold text-white/80 truncate uppercase tracking-widest">{item.name || 'Unnamed'}</p>
                      <p className="text-[8px] font-mono text-white/20 mt-1 uppercase">
                        {item.contentType} // {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-10">
            <Button variant="outlineGlassy" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="h-12 w-12 rounded-xl">
              ←
            </Button>
            <span className="text-[10px] font-black uppercase text-white/40">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outlineGlassy"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="h-12 w-12 rounded-xl"
            >
              →
            </Button>
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] bg-slate-950/98 border-white/10 rounded-[2.5rem] p-0 overflow-hidden">
          <div className="aspect-video relative bg-black flex items-center justify-center">
            {previewMedia?.contentType === 'image' && <Image src={previewMedia.url} alt="" fill className="object-contain" unoptimized />}
            {previewMedia?.contentType === 'video' && <video src={previewMedia.url} controls autoPlay className="w-full h-full" />}
            {previewMedia?.contentType === 'audio' && <audio src={previewMedia.url} controls autoPlay className="w-2/3" />}
            {(previewMedia?.contentType === 'pdf' || previewMedia?.contentType === 'docx') && (
              <iframe src={previewMedia.url} className="w-full h-full min-h-[500px]" />
            )}
          </div>
          <div className="p-6 bg-black/40 backdrop-blur-xl flex justify-between items-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 truncate max-w-md">{previewMedia?.name}</p>
            <Button onClick={() => setIsPreviewDialogOpen(false)} variant="outlineGlassy" className="h-10 rounded-xl px-6 uppercase text-[10px] font-black">
              Close Terminal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

```

Now your task is 
1. copy color-combination, and style from first page.tsx and implement the color-combination and style in second page.tsx 
2. Update Pagination style.
3. Make sure it has eye-catching view and stunning UI with animation. 
