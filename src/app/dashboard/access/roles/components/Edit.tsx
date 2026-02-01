'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ShieldCheck, Zap, X, Save } from 'lucide-react';

import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField';

import { IRoles, defaultRoles, ICURD, defaultCURD } from '../store/data/data';
import { useRolesStore } from '../store/store';
import { useUpdateRolesMutation } from '@/redux/features/roles/rolesSlice';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { useGetSidebarsQuery } from '@/redux/features/sidebars/sidebarsSlice';
import { iconMap, SidebarItem } from '../../sidebar/utils';

type PermissionKey = keyof ICURD;

const EditNextComponents: React.FC = () => {
  const { toggleEditModal, isEditModalOpen, selectedRoles, setSelectedRoles } = useRolesStore();
  const [updateRoles, { isLoading }] = useUpdateRolesMutation();
  const [editedRole, setRole] = useState<IRoles>(defaultRoles);
  const { data: sidebarData, isLoading: sidebarIsLoading } = useGetSidebarsQuery({ page: 1, limit: 100 });
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);

  const session = authClient.useSession();
  const sessionEmail = session.data?.user.email || '';

  useEffect(() => {
    if (selectedRoles) {
      setRole(selectedRoles);
    }
  }, [selectedRoles, isEditModalOpen]);

  useEffect(() => {
    if (sidebarData?.data?.sidebars) {
      const formattedData = sidebarData.data.sidebars.map((item: SidebarItem) => ({
        ...item,
        icon: iconMap[(item.iconName as keyof typeof iconMap) || 'Menu'] || iconMap.Menu,
        children: item.children?.map(child => ({
          ...child,
          icon: iconMap[(child.iconName as keyof typeof iconMap) || 'Menu'] || iconMap.Menu,
        })),
      }));
      setSidebarItems(formattedData);
    }
  }, [sidebarData]);

  const handleFieldChange = (name: keyof IRoles, value: unknown) => {
    setRole(prev => ({ ...prev, [name]: value }));
  };

  const handleDashboardAccessChange = (name: string, path: string, checked: boolean) => {
    setRole(prev => {
      const currentAccess = prev.dashboard_access_ui || [];
      if (checked) {
        return {
          ...prev,
          dashboard_access_ui: [...currentAccess, { name, path, userAccess: { ...defaultCURD } }],
        };
      } else {
        return {
          ...prev,
          dashboard_access_ui: currentAccess.filter(item => item.path !== path),
        };
      }
    });
  };

  const handlePermissionChange = (path: string, permission: PermissionKey, checked: boolean) => {
    setRole(prev => {
      const currentAccess = [...(prev.dashboard_access_ui || [])];
      const index = currentAccess.findIndex(item => item.path === path);
      if (index > -1) {
        currentAccess[index] = {
          ...currentAccess[index],
          userAccess: {
            ...currentAccess[index].userAccess,
            [permission]: checked,
          },
        };
      }
      return { ...prev, dashboard_access_ui: currentAccess };
    });
  };

  const handleFullAccess = () => {
    const fullPermissions: ICURD = Object.keys(defaultCURD).reduce((acc, key) => {
      acc[key as PermissionKey] = true;
      return acc;
    }, {} as ICURD);

    const allPaths: { name: string; path: string; userAccess: ICURD }[] = [];

    sidebarItems.forEach(item => {
      allPaths.push({
        name: item.name,
        path: item.path,
        userAccess: { ...fullPermissions },
      });

      if (item.children && item.children.length > 0) {
        item.children.forEach(child => {
          allPaths.push({
            name: child.name,
            path: child.path,
            userAccess: { ...fullPermissions },
          });
        });
      }
    });

    setRole(prev => ({
      ...prev,
      dashboard_access_ui: allPaths,
    }));
  };

  const isRowChecked = (path: string): boolean => {
    return (editedRole.dashboard_access_ui || []).some(item => item.path === path);
  };

  const getPermissionValue = (path: string, permission: PermissionKey): boolean => {
    const item = (editedRole.dashboard_access_ui || []).find(i => i.path === path);
    if (!item || !item.userAccess) return false;
    return item.userAccess[permission];
  };

  const handleEditRole = async () => {
    if (!selectedRoles?._id) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, createdAt, updatedAt, ...updateData } = editedRole;
      const finalPayload = {
        id: selectedRoles._id,
        ...updateData,
        email: sessionEmail || editedRole.email,
      };

      await updateRoles(finalPayload).unwrap();
      handleSuccess('Update Successful');
      toggleEditModal(false);
      setSelectedRoles(null);
    } catch (error: unknown) {
      let errMessage = 'An unknown error occurred.';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message) || 'An API error occurred.';
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      handleError(errMessage);
    }
  };

  const PermissionCheckboxes = ({ item }: { item: SidebarItem }) => (
    <div className="flex items-center gap-3 sm:gap-4 ml-auto" onClick={e => e.stopPropagation()}>
      {(Object.keys(defaultCURD) as PermissionKey[]).map(key => {
        const isActive = isRowChecked(item.path);
        return (
          <TooltipProvider key={key}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1">
                  <Checkbox
                    disabled={!isActive}
                    checked={getPermissionValue(item.path, key)}
                    onCheckedChange={checked => handlePermissionChange(item.path, key, checked as boolean)}
                    className={`transition-all duration-300 ${!isActive ? 'opacity-20' : 'opacity-100'}`}
                  />
                  <span className="text-[8px] uppercase font-bold text-white/40 sm:hidden">{key[0]}</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-900 border-white/20 text-white text-xs capitalize">{key} Permission</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );

  return (
    <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
      <AnimatePresence>
        {isEditModalOpen && (
          <DialogContent className="sm:max-w-[95vw] md:max-w-[850px] lg:max-w-[1000px] rounded-3xl backdrop-blur-3xl bg-slate-950/80 border border-white/10 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] text-white overflow-hidden p-0 border-t-blue-500/30">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
              <DialogHeader className="p-8 pb-4 border-b border-white/5 relative">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                  </div>
                  <DialogTitle className="text-3xl font-black tracking-tight bg-gradient-to-br from-white via-white to-blue-400/50 bg-clip-text text-transparent">
                    Update System Role
                  </DialogTitle>
                </div>
              </DialogHeader>

              <ScrollArea className="h-[65vh] w-full px-8 py-6">
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-blue-400/80 ml-1">
                        Role Name
                      </Label>
                      <InputFieldForString
                        id="name"
                        placeholder="e.g. Master Administrator"
                        value={editedRole.name}
                        onChange={value => handleFieldChange('name', value as string)}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-blue-400/80 ml-1">
                        Account Holder
                      </Label>
                      <Input
                        id="email"
                        readOnly
                        className="h-12 bg-white/5 border-white/10 focus:ring-blue-500/50 text-white/50 rounded-xl"
                        value={editedRole.email}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-wider text-blue-400/80 ml-1">Admin Notes</Label>
                      <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                        <RichTextEditorField id="note" value={editedRole.note} onChange={value => handleFieldChange('note', value)} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-wider text-blue-400/80 ml-1">Permissions Description</Label>
                      <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                        <RichTextEditorField id="description" value={editedRole.description} onChange={value => handleFieldChange('description', value)} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <div className="space-y-1">
                        <Label className="text-xl font-bold text-white tracking-tight">Access Control List</Label>
                        <p className="text-xs text-white/40 font-medium">Define granular permissions for each module</p>
                      </div>
                      <div className="hidden sm:flex gap-8 text-[10px] uppercase tracking-[0.2em] font-black text-white/30 mr-4">
                        <span>Create</span>
                        <span>Read</span>
                        <span>Update</span>
                        <span>Delete</span>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-black/40 border border-white/10 p-4 shadow-inner">
                      {sidebarIsLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 border-4 border-blue-500/20 rounded-full" />
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0" />
                          </div>
                          <span className="text-white/40 text-xs font-bold tracking-widest uppercase animate-pulse">Synchronizing Schema...</span>
                        </div>
                      ) : (
                        <Accordion type="multiple" className="space-y-4">
                          {sidebarItems.map((item, idx) => {
                            const hasChildren = item.children && item.children.length > 0;
                            const activeRow = isRowChecked(item.path);

                            const RowContent = (
                              <div className="flex items-center gap-4 p-4 rounded-2xl transition-all w-full group">
                                <div className="flex items-center gap-5 flex-1 overflow-hidden">
                                  <Checkbox
                                    checked={activeRow}
                                    onCheckedChange={checked => handleDashboardAccessChange(item.name, item.path, checked as boolean)}
                                    className="w-5 h-5 border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 rounded-md"
                                  />
                                  <div className="flex items-center gap-4 min-w-0">
                                    <div
                                      className={`p-2.5 rounded-xl transition-all duration-500 ${activeRow ? 'bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-white/5 text-white/20'}`}
                                    >
                                      {item.icon}
                                    </div>
                                    <div className="flex flex-col text-left truncate">
                                      <span className={`text-sm font-bold tracking-tight transition-colors ${activeRow ? 'text-white' : 'text-white/30'}`}>
                                        {item.name}
                                      </span>
                                      <span className="text-[10px] font-mono text-white/20 tracking-tighter truncate">{item.path}</span>
                                    </div>
                                  </div>
                                </div>
                                <PermissionCheckboxes item={item} />
                              </div>
                            );

                            return (
                              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} key={item.sl_no}>
                                {hasChildren ? (
                                  <AccordionItem
                                    value={`item-${item.sl_no}`}
                                    className="border border-white/5 rounded-2xl bg-white/[0.02] overflow-hidden data-[state=open]:bg-white/[0.04] transition-colors"
                                  >
                                    <AccordionTrigger className="hover:no-underline hover:bg-white/5 px-2 py-0 border-none transition-all">
                                      {RowContent}
                                    </AccordionTrigger>
                                    <AccordionContent className="p-0 border-t border-white/5">
                                      <div className="bg-black/40 space-y-1 p-3">
                                        {item.children?.map(child => (
                                          <div
                                            key={child.sl_no}
                                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-all group/child"
                                          >
                                            <div className="flex items-center gap-5 flex-1">
                                              <Checkbox
                                                checked={isRowChecked(child.path)}
                                                onCheckedChange={checked => handleDashboardAccessChange(child.name, child.path, checked as boolean)}
                                                className="w-4 h-4 border-white/10 ml-6"
                                              />
                                              <div className="flex items-center gap-4">
                                                <div
                                                  className={`p-2 rounded-lg transition-colors ${isRowChecked(child.path) ? 'text-cyan-400 bg-cyan-500/10' : 'text-white/20 bg-white/5'}`}
                                                >
                                                  {child.icon}
                                                </div>
                                                <div className="flex flex-col">
                                                  <span className={`text-xs font-bold ${isRowChecked(child.path) ? 'text-white/80' : 'text-white/20'}`}>
                                                    {child.name}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <PermissionCheckboxes item={child} />
                                          </div>
                                        ))}
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                ) : (
                                  <div className="border border-white/5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">{RowContent}</div>
                                )}
                              </motion.div>
                            );
                          })}
                        </Accordion>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="p-8 py-6 bg-slate-900/50 border-t border-white/5 gap-4 flex-col sm:flex-row">
                <Button
                  variant="outlineGlassy"
                  size="lg"
                  onClick={handleFullAccess}
                  className="rounded-xl border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 gap-2 font-bold text-xs uppercase tracking-widest"
                >
                  <Zap className="w-4 h-4" /> Full Access
                </Button>
                <div className="flex-1" />
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    variant="outlineGlassy"
                    size="lg"
                    className="flex-1 sm:flex-none rounded-xl border-white/10 text-white/60 hover:text-white gap-2 font-bold text-xs uppercase tracking-widest"
                    onClick={() => {
                      toggleEditModal(false);
                      setSelectedRoles(null);
                    }}
                  >
                    <X className="w-4 h-4" /> Discard
                  </Button>
                  <Button
                    disabled={isLoading}
                    onClick={handleEditRole}
                    variant="outlineGlassy"
                    size="lg"
                    className="flex-1 sm:flex-none rounded-xl bg-blue-600 hover:bg-blue-500 text-white border-none shadow-[0_0_20px_rgba(37,99,235,0.4)] gap-2 font-bold text-xs uppercase tracking-widest"
                  >
                    {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                    {isLoading ? 'Processing...' : 'Save Role'}
                  </Button>
                </div>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default EditNextComponents;
