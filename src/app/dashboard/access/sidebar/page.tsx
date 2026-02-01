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
