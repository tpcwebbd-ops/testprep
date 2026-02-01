'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sparkles, ShieldCheck, Trash2 } from 'lucide-react';

import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField';

import { useRolesStore } from '../store/store';
import { useAddRolesMutation } from '@/redux/features/roles/rolesSlice';
import { IRoles, defaultRoles, defaultCURD, ICURD } from '../store/data/data';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';
import { authClient } from '@/lib/auth-client';
import { Input } from '@/components/ui/input';
import { useGetSidebarsQuery } from '@/redux/features/sidebars/sidebarsSlice';
import { iconMap, SidebarItem } from '../../sidebar/utils';

type PermissionKey = keyof ICURD;

const AddNextComponents: React.FC = () => {
  const { toggleAddModal, isAddModalOpen } = useRolesStore();
  const [addRoles, { isLoading }] = useAddRolesMutation();
  const [newRole, setNewRole] = useState<IRoles>(defaultRoles);
  const { data: sidebarData, isLoading: sidebarIsLoading } = useGetSidebarsQuery({ page: 1, limit: 100 });
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);

  const session = authClient.useSession();
  const sessionEmail = session.data?.user.email || '';

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
    setNewRole(prev => ({ ...prev, [name]: value }));
  };

  const handleDashboardAccessChange = (name: string, path: string, checked: boolean) => {
    setNewRole(prev => {
      const currentAccess = prev.dashboard_access_ui || [];
      if (checked) {
        return {
          ...prev,
          dashboard_access_ui: [
            ...currentAccess,
            {
              name,
              path,
              userAccess: { ...defaultCURD },
            },
          ],
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
    setNewRole(prev => {
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

  const handleFullAccess = useCallback(() => {
    const fullAccessList: NonNullable<IRoles['dashboard_access_ui']> = [];

    const traverseAndAdd = (items: SidebarItem[]) => {
      items.forEach(item => {
        const fullPermissions: ICURD = Object.keys(defaultCURD).reduce((acc, key) => {
          acc[key as PermissionKey] = true;
          return acc;
        }, {} as ICURD);

        fullAccessList.push({
          name: item.name,
          path: item.path,
          userAccess: fullPermissions,
        });

        if (item.children && item.children.length > 0) {
          traverseAndAdd(item.children);
        }
      });
    };

    traverseAndAdd(sidebarItems);
    setNewRole(prev => ({
      ...prev,
      dashboard_access_ui: fullAccessList,
    }));
  }, [sidebarItems]);

  const isRowChecked = (path: string): boolean => {
    return (newRole.dashboard_access_ui || []).some(item => item.path === path);
  };

  const getPermissionValue = (path: string, permission: PermissionKey): boolean => {
    const item = (newRole.dashboard_access_ui || []).find(i => i.path === path);
    if (!item || !item.userAccess) return false;
    return !!item.userAccess[permission];
  };

  const handleAddRole = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, createdAt, updatedAt, ...updateData } = newRole;
      const finalPayload = {
        ...updateData,
        email: sessionEmail,
      };
      await addRoles(finalPayload).unwrap();
      handleSuccess('Added Successfully');
      toggleAddModal(false);
      setNewRole(defaultRoles);
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
                <div className="flex flex-col items-center gap-1">
                  <Checkbox
                    disabled={!isActive}
                    checked={getPermissionValue(item.path, key)}
                    onCheckedChange={checked => handlePermissionChange(item.path, key, checked as boolean)}
                    className={`transition-all duration-300 ${!isActive ? 'opacity-20 scale-90' : 'opacity-100 hover:scale-110 shadow-[0_0_10px_rgba(168,85,247,0.4)]'}`}
                  />
                  <span className="text-[8px] uppercase font-black text-white/30 sm:hidden">{key[0]}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-950 border-white/10 text-white text-xs capitalize backdrop-blur-xl">{key} Permission</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );

  return (
    <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[850px] mt-12 lg:max-w-[1000px] rounded-3xl backdrop-blur-3xl bg-black/40 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] text-white overflow-hidden p-0 ring-1 ring-white/5">
        <DialogHeader className="p-8 pb-4 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-3xl font-black tracking-tight bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent">
                Create System Role
              </DialogTitle>
              <p className="text-white/40 text-sm font-medium">Define access levels and administrative capabilities</p>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 hidden sm:block">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] w-full px-8 py-6">
          <div className="space-y-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 group">
                <Label
                  htmlFor="name"
                  className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1 group-focus-within:text-purple-400 transition-colors"
                >
                  Role Identity
                </Label>
                <InputFieldForString
                  id="name"
                  placeholder="e.g. Master Administrator"
                  value={newRole.name}
                  onChange={value => handleFieldChange('name', value as string)}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">
                  Creator Reference
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    readOnly
                    className="bg-white/5 border-white/10 focus:ring-purple-500/50 text-white/40 font-mono text-sm h-12 rounded-xl"
                    value={sessionEmail || newRole.email}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 gap-8">
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Internal Protocol Note</Label>
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 focus-within:border-purple-500/50 transition-all">
                  <RichTextEditorField id="note" value={newRole.note} onChange={value => handleFieldChange('note', value)} />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Scope of Authority</Label>
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 focus-within:border-purple-500/50 transition-all">
                  <RichTextEditorField id="description" value={newRole.description} onChange={value => handleFieldChange('description', value)} />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                  <Label className="text-xl font-bold text-white/90 tracking-tight">Access Matrix</Label>
                </div>
                <div className="hidden sm:flex gap-8 text-[10px] uppercase tracking-widest font-black text-white/30 mr-4">
                  <span className="w-8 text-center">Create</span>
                  <span className="w-8 text-center">Read</span>
                  <span className="w-8 text-center">Update</span>
                  <span className="w-8 text-center">Delete</span>
                </div>
              </div>

              <div className="rounded-3xl bg-white/[0.02] border border-white/10 p-2 sm:p-4 backdrop-blur-md">
                {sidebarIsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 border-2 border-purple-500/20 rounded-full" />
                      <div className="w-12 h-12 border-t-2 border-purple-500 rounded-full animate-spin absolute top-0 left-0" />
                    </div>
                    <span className="text-white/40 text-xs font-bold uppercase tracking-widest animate-pulse">Syncing Permissions...</span>
                  </div>
                ) : (
                  <Accordion type="multiple" className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {sidebarItems.map((item, index) => {
                        const hasChildren = item.children && item.children.length > 0;
                        const activeRow = isRowChecked(item.path);

                        const RowContent = (
                          <div
                            className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all w-full group ${activeRow ? 'bg-white/5' : 'hover:bg-white/[0.02]'}`}
                          >
                            <div className="flex items-center gap-4 flex-1 overflow-hidden">
                              <Checkbox
                                checked={activeRow}
                                onCheckedChange={checked => handleDashboardAccessChange(item.name, item.path, checked as boolean)}
                                className="border-white/20 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 transition-all duration-500"
                              />
                              <div className="flex items-center gap-4 min-w-0">
                                <div
                                  className={`p-2.5 rounded-xl transition-all duration-500 ${activeRow ? 'bg-purple-500/20 text-purple-400 scale-110 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-white/5 text-white/20'}`}
                                >
                                  {item.icon}
                                </div>
                                <div className="flex flex-col text-left truncate">
                                  <span
                                    className={`text-sm font-bold tracking-tight transition-colors duration-300 ${activeRow ? 'text-white' : 'text-white/30'}`}
                                  >
                                    {item.name}
                                  </span>
                                  <span className="text-[10px] font-mono text-white/10 truncate tracking-tighter uppercase">{item.path}</span>
                                </div>
                              </div>
                            </div>
                            <PermissionCheckboxes item={item} />
                          </div>
                        );

                        return (
                          <motion.div key={item.sl_no} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                            {hasChildren ? (
                              <AccordionItem value={`item-${item.sl_no}`} className="border border-white/5 rounded-2xl bg-white/[0.01] overflow-hidden">
                                <AccordionTrigger className="hover:no-underline hover:bg-white/5 px-2 py-0 [&[data-state=open]>svg]:rotate-0 [&_svg]:transition-none outline-none">
                                  {RowContent}
                                </AccordionTrigger>
                                <AccordionContent className="p-0 border-t border-white/5">
                                  <div className="bg-black/40 space-y-1 p-2 pl-6">
                                    {item.children?.map(child => (
                                      <div key={child.sl_no} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
                                        <div className="flex items-center gap-4 flex-1">
                                          <Checkbox
                                            checked={isRowChecked(child.path)}
                                            onCheckedChange={checked => handleDashboardAccessChange(child.name, child.path, checked as boolean)}
                                            className="border-white/10 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                          />
                                          <div className="flex items-center gap-3">
                                            <div
                                              className={`p-2 rounded-lg transition-colors ${isRowChecked(child.path) ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/10'}`}
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
                              <div className="border border-white/5 rounded-2xl bg-white/[0.01]">{RowContent}</div>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </Accordion>
                )}
              </div>
            </motion.div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-8 py-5 bg-black/60 backdrop-blur-3xl border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outlineGlassy"
              onClick={handleFullAccess}
              size="sm"
              className="rounded-xl border-purple-500/30 text-purple-400 hover:bg-purple-500/10 gap-2 font-bold uppercase tracking-widest text-[10px]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Grant Full Access
            </Button>
            <Button
              variant="outlineGlassy"
              onClick={() => setNewRole(defaultRoles)}
              size="sm"
              className="rounded-xl border-red-500/30 text-red-400 hover:bg-red-500/10 gap-2 font-bold uppercase tracking-widest text-[10px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </Button>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outlineGlassy"
              onClick={() => toggleAddModal(false)}
              size="sm"
              className="rounded-xl font-bold uppercase tracking-widest text-[10px] flex-1 sm:flex-none"
            >
              Discard
            </Button>
            <Button
              disabled={isLoading || !newRole.name}
              onClick={handleAddRole}
              variant="outlineGlassy"
              size="sm"
              className="rounded-xl bg-white text-black hover:bg-white/90 font-bold uppercase tracking-widest text-[10px] px-8 flex-1 sm:flex-none"
            >
              {isLoading ? 'Encrypting...' : 'Authorize Role'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNextComponents;
