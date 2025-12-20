'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
                    className={`transition-all duration-300 ${!isActive ? 'opacity-20' : 'opacity-100 hover:scale-110'}`}
                  />
                  <span className="text-[8px] uppercase font-bold text-white/40 sm:hidden">{key[0]}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-900 border-white/20 text-white text-xs capitalize">{key} Permission</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );

  return (
    <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[850px] mt-12 lg:max-w-[1000px] rounded-2xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl text-white overflow-hidden p-0">
        <DialogHeader className="p-6 py-2 border-b border-white/10">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Create System Role</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] w-full px-6">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-white/70 ml-1">
                  Role Name
                </Label>
                <InputFieldForString
                  id="name"
                  placeholder="e.g. Senior Administrator"
                  value={newRole.name}
                  onChange={value => handleFieldChange('name', value as string)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-white/70 ml-1">
                  Creator Email
                </Label>
                <Input
                  id="email"
                  readOnly
                  className="bg-white/5 border-white/10 focus:ring-purple-500/50 text-white/50"
                  value={sessionEmail || newRole.email}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-white/70 ml-1">Internal Note</Label>
                <RichTextEditorField id="note" value={newRole.note} onChange={value => handleFieldChange('note', value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-white/70 ml-1">Role Description</Label>
                <RichTextEditorField id="description" value={newRole.description} onChange={value => handleFieldChange('description', value)} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <Label className="text-lg font-semibold text-white/90">Dashboard Permissions</Label>
                <div className="hidden sm:flex gap-8 text-[10px] uppercase tracking-widest font-bold text-white/40 mr-4">
                  <span>Create</span>
                  <span>Read</span>
                  <span>Update</span>
                  <span>Delete</span>
                </div>
              </div>

              <div className="rounded-2xl bg-black/20 border border-white/10 p-2 sm:p-4">
                {sidebarIsLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-white/40 text-sm animate-pulse">Fetching structure...</span>
                  </div>
                ) : (
                  <Accordion type="multiple" className="space-y-3">
                    {sidebarItems.map(item => {
                      const hasChildren = item.children && item.children.length > 0;
                      const activeRow = isRowChecked(item.path);

                      const RowContent = (
                        <div className="flex items-center gap-3 p-3 rounded-xl transition-all w-full group">
                          <div className="flex items-center gap-4 flex-1 overflow-hidden">
                            <Checkbox
                              checked={activeRow}
                              onCheckedChange={checked => handleDashboardAccessChange(item.name, item.path, checked as boolean)}
                              className="border-white/30 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                            />
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2 bg-white/5 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">{item.icon}</div>
                              <div className="flex flex-col text-left truncate">
                                <span className={`text-sm font-semibold transition-colors ${activeRow ? 'text-white' : 'text-white/40'}`}>{item.name}</span>
                                <span className="text-[10px] font-mono text-white/20 truncate">{item.path}</span>
                              </div>
                            </div>
                          </div>
                          <PermissionCheckboxes item={item} />
                        </div>
                      );

                      if (hasChildren) {
                        return (
                          <AccordionItem key={item.sl_no} value={`item-${item.sl_no}`} className="border border-white/5 rounded-xl bg-white/5 overflow-hidden">
                            <AccordionTrigger className="hover:no-underline hover:bg-white/5 px-2 py-0 [&[data-state=open]>svg]:rotate-0 [&_svg]:transition-none">
                              {RowContent}
                            </AccordionTrigger>
                            <AccordionContent className="p-0 border-t border-white/5">
                              <div className="bg-black/20 space-y-1 p-2">
                                {item.children?.map(child => (
                                  <div key={child.sl_no} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all">
                                    <div className="flex items-center gap-4 flex-1">
                                      <Checkbox
                                        checked={isRowChecked(child.path)}
                                        onCheckedChange={checked => handleDashboardAccessChange(child.name, child.path, checked as boolean)}
                                        className="border-white/20 ml-4"
                                      />
                                      <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-white/5 rounded text-blue-400">{child.icon}</div>
                                        <div className="flex flex-col">
                                          <span className={`text-xs font-medium ${isRowChecked(child.path) ? 'text-white/80' : 'text-white/30'}`}>
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
                        );
                      }

                      return (
                        <div key={item.sl_no} className="border border-white/5 rounded-xl bg-white/5">
                          {RowContent}
                        </div>
                      );
                    })}
                  </Accordion>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 py-2 bg-black/20 border-t border-white/10 flex items-center justify-end gap-2">
          <Button variant="outlineGlassy" onClick={() => toggleAddModal(false)} size="sm">
            Discard
          </Button>
          <Button disabled={isLoading} onClick={handleAddRole} variant="outlineGlassy" size="sm">
            {isLoading ? 'Processing...' : 'Create Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNextComponents;
