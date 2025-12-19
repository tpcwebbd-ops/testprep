Look at the Add.tsx 
```
'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField';

import { useRolesStore } from '../store/store';
import { useAddRolesMutation } from '@/redux/features/roles/rolesSlice';
import { IRoles, IERoles, defaultRoles, defaulERoles, defaultCURD } from '../store/data/data';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';
import { authClient } from '@/lib/auth-client';
import { Input } from '@/components/ui/input';
import { useGetSidebarsQuery } from '@/redux/features/sidebars/sidebarsSlice';
import { iconMap, SidebarItem } from '../../sidebar/utils';

const AddNextComponents: React.FC = () => {
  const { toggleAddModal, isAddModalOpen, setRoles } = useRolesStore();
  const [addRoles, { isLoading }] = useAddRolesMutation();
  const [newRole, setNewRole] = useState<IRoles>(defaultRoles);
  const { data: sidebarData, isLoading: sidebarIsLoading } = useGetSidebarsQuery({ page: 1, limit: 100 });
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);

  const sessionEmail = authClient.useSession().data?.user.email || '';

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
      setSidebarItems(formattedData);
    }
  }, [sidebarData]);

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

  const handleDashboardAccessChange = (name: string, path: string, checked: boolean) => {
    setNewRole(prev => {
      const currentAccess = prev.dashboard_access_ui || [];

      if (checked) {
        return {
          ...prev,
          dashboard_access_ui: [...currentAccess, { name, path }],
        };
      } else {
        return {
          ...prev,
          dashboard_access_ui: currentAccess.filter(item => !(item.name === name && item.path === path)),
        };
      }
    });
  };

  const isChecked = (name: string, path: string): boolean => {
    return (newRole.dashboard_access_ui || []).some(item => item.name === name && item.path === path);
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
      let errMessage = 'An unknown error occurred.';
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
            <div className="grid grid-cols-1 items-center gap-4 pr-1">
              <Label htmlFor="name" className="text-right text-white/80">
                Role Name
              </Label>
              <div className="col-span-3">
                <InputFieldForString id="name" placeholder="Admin" value={newRole.name} onChange={value => handleFieldChange('name', value as string)} />
              </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-4 pr-1">
              <Label htmlFor="note" className="text-right text-white/80 pt-3">
                Note
              </Label>
              <div className="col-span-3">
                <RichTextEditorField id="note" value={newRole.note} onChange={value => handleFieldChange('note', value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-4 pr-1">
              <Label htmlFor="description" className="text-right text-white/80 pt-3">
                Description
              </Label>
              <div className="col-span-3">
                <RichTextEditorField id="description" value={newRole.description} onChange={value => handleFieldChange('description', value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 items-center gap-4 pr-1">
              <Label htmlFor="email" className="text-right text-white/80">
                Email
              </Label>
              <div className="col-span-3">
                <Input id="email" readOnly value={authClient.useSession().data?.user.email || newRole.email} />
              </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-4 pr-1">
              <Label htmlFor="dashboard-access" className="text-right text-white/80 pt-3">
                Dashboard Access
              </Label>

              <div className="col-span-3 overflow-x-auto rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md p-4">
                {sidebarIsLoading ? (
                  <div className="text-center py-4 text-white/70">Loading sidebar data...</div>
                ) : sidebarItems.length === 0 ? (
                  <div className="text-center py-4 text-white/70">No sidebar items available</div>
                ) : (
                  <div className="">
                    {sidebarItems.map((item, parentIdx) => (
                      <div key={item.sl_no} className={`space-y-2 ${parentIdx % 2 ? ' bg-slate-200/20 ' : ' bg-slate-200/10 '} `}>
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all">
                          <Checkbox
                            checked={isChecked(item.name, item.path)}
                            onCheckedChange={checked => handleDashboardAccessChange(item.name, item.path, checked as boolean)}
                          />
                          <div className="flex items-center gap-2 flex-1">
                            <div className="p-1.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">{item.icon}</div>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm text-white">{item.name}</span>
                              <span className="text-xs text-white/60 font-mono">{item.path}</span>
                            </div>
                          </div>
                          <div className="w-full gap-2 flex items-center justify-end">
                            {Object.keys(defaultCURD).map(key => (
                              <Checkbox key={key} title={key} checked={false} onCheckedChange={() => ''} />
                            ))}
                          </div>
                        </div>

                        {item.children && item.children.length > 0 && (
                          <div className="ml-8 border-l-2 border-white/10 pl-4">
                            {item.children.map((child, childIdx) => (
                              <div
                                key={child.sl_no}
                                className={`flex items-center gap-3 p-2 transition-all ${childIdx % 2 ? ' bg-slate-200/20 ' : ' bg-slate-200/10 '} `}
                              >
                                <Checkbox
                                  checked={isChecked(child.name, child.path)}
                                  onCheckedChange={checked => handleDashboardAccessChange(child.name, child.path, checked as boolean)}
                                />
                                <div className="flex items-center gap-2 flex-1">
                                  <div className="p-1.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">{child.icon}</div>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm text-white">{child.name}</span>
                                    <span className="text-xs text-white/60 font-mono">{child.path}</span>
                                  </div>
                                </div>
                                <div className="w-full gap-2 flex items-center justify-end">
                                  {Object.keys(defaultCURD).map(key => (
                                    <Checkbox key={key} title={key} checked={false} onCheckedChange={() => ''} />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* 
            <div className="grid grid-cols-1 items-start gap-4 pr-1">
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
            </div> */}
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


Your task is only implement accordion from shadcn UI.

if item.children.length is greather then 0 them implement it. 