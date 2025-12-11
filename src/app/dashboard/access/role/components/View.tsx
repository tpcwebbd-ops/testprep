import { format } from 'date-fns';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

import { IRoles, IERoles, defaultRoles, defaulERoles } from '../store/data/data';
import { useRolesStore } from '../store/store';
import { useGetRolesByIdQuery } from '@/redux/features/roles/rolesSlice';
import { logger } from 'better-auth';
import { useGetSidebarsQuery } from '@/redux/features/sidebars/sidebarsSlice';
import { iconMap, SidebarItem } from '../../sidebar/utils';

const ViewNextComponents: React.FC = () => {
  const { isViewModalOpen, selectedRoles, toggleViewModal, setSelectedRoles } = useRolesStore();
  const { data: roleData, refetch } = useGetRolesByIdQuery(selectedRoles?._id, { skip: !selectedRoles?._id });
  const { data: sidebarData, isLoading: sidebarIsLoading } = useGetSidebarsQuery({ page: 1, limit: 100 });
  const [sidebarItems, setSidebarItems] = React.useState<SidebarItem[]>([]);

  useEffect(() => {
    if (selectedRoles?._id) {
      refetch();
    }
  }, [selectedRoles?._id, refetch]);

  useEffect(() => {
    if (roleData?.data) {
      setSelectedRoles(roleData.data);
    }
  }, [roleData, setSelectedRoles]);

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

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch (error) {
      logger.error(JSON.stringify(error));
      return 'Invalid Date';
    }
  };

  const isChecked = (name: string, path: string): boolean => {
    return (selectedRoles?.dashboard_access_ui || []).some(item => item.name === name && item.path === path);
  };

  const DetailRow: React.FC<{
    label: string;
    value: React.ReactNode;
  }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/10">
      <div className="font-semibold text-sm text-white/70">{label}</div>
      <div className="col-span-2 text-sm text-white/90">{value || 'N/A'}</div>
    </div>
  );

  const DashboardAccessTable: React.FC<{
    label: string;
  }> = ({ label }) => (
    <div className="grid grid-cols-1 gap-2 py-2 border-b border-white/10">
      <div className="font-semibold text-sm text-white/70">{label}</div>
      <div className="col-span-1 mt-1">
        <div className="overflow-x-auto rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md p-4">
          {sidebarIsLoading ? (
            <div className="text-center py-4 text-white/70">Loading sidebar data...</div>
          ) : sidebarItems.length === 0 ? (
            <div className="text-center py-4 text-white/70">No sidebar items available</div>
          ) : (
            <div className="space-y-3">
              {sidebarItems.map(item => (
                <div key={item.sl_no} className="space-y-2">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/10">
                    <Checkbox checked={isChecked(item.name, item.path)} disabled className="cursor-default" />
                    <div className="flex items-center gap-2 flex-1">
                      <div className="p-1.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">{item.icon}</div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-white">{item.name}</span>
                        <span className="text-xs text-white/60 font-mono">{item.path}</span>
                      </div>
                    </div>
                  </div>

                  {item.children && item.children.length > 0 && (
                    <div className="ml-8 space-y-2 border-l-2 border-white/10 pl-4">
                      {item.children.map(child => (
                        <div key={child.sl_no} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/10">
                          <Checkbox checked={isChecked(child.name, child.path)} disabled className="cursor-default" />
                          <div className="flex items-center gap-2 flex-1">
                            <div className="p-1.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">{child.icon}</div>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm text-white">{child.name}</span>
                              <span className="text-xs text-white/60 font-mono">{child.path}</span>
                            </div>
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
    </div>
  );

  const RolePermissionsTable: React.FC<{
    label: string;
    permissions?: IERoles;
  }> = ({ label, permissions }) => {
    const permissionKeys = Object.keys(defaulERoles) as (keyof IERoles)[];

    return (
      <div className="grid grid-cols-1 gap-2 py-2 border-b border-white/10">
        <div className="font-semibold text-sm text-white/70">{label}</div>
        <div className="col-span-1 mt-1">
          {!permissions ? (
            <div className="text-sm text-white/50 italic">No permissions assigned</div>
          ) : (
            <div className="overflow-x-auto rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md">
              <table className="w-full text-xs text-left text-white/90">
                <thead>
                  <tr className="border-b border-white/20 bg-white/5">
                    <th className="py-2 px-3 text-left font-semibold">Module</th>
                    <th className="py-2 px-3 text-center font-semibold">Create</th>
                    <th className="py-2 px-3 text-center font-semibold">Read</th>
                    <th className="py-2 px-3 text-center font-semibold">Update</th>
                    <th className="py-2 px-3 text-center font-semibold">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {permissionKeys.map(module => (
                    <tr key={module} className="border-b border-white/10 hover:bg-white/5 transition-all duration-150">
                      <td className="py-2 px-3 capitalize font-medium">{module.replace(/_/g, ' ')}</td>
                      {(['create', 'read', 'update', 'delete'] as const).map(permission => (
                        <td key={permission} className="py-2 px-3 text-center">
                          {permissions[module]?.[permission] ? (
                            <CheckCircle2 size={16} className="inline text-green-400" />
                          ) : (
                            <XCircle size={16} className="inline text-rose-500" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent className="sm:max-w-[800px] bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-lg rounded-2xl">
        <DialogHeader className="border-b border-white/10 pb-3">
          <DialogTitle className="text-lg font-semibold tracking-wide text-white/90">Role Details</DialogTitle>
        </DialogHeader>
        {selectedRoles && (
          <ScrollArea className="h-[500px] w-full rounded-md border border-white/10 p-4 bg-white/5 backdrop-blur-md shadow-inner">
            <div className="grid gap-1">
              <DetailRow label="Name" value={selectedRoles.name} />
              <DetailRow label="Email" value={selectedRoles.email} />
              <DetailRow label="Note" value={selectedRoles.note} />
              <DetailRow label="Description" value={selectedRoles.description} />
              <DashboardAccessTable label="Dashboard Access" />
              <RolePermissionsTable label="Role Permissions" permissions={selectedRoles.role} />
              <DetailRow label="Created At" value={formatDate(selectedRoles.createdAt)} />
              <DetailRow label="Updated At" value={formatDate(selectedRoles.updatedAt)} />
            </div>
          </ScrollArea>
        )}
        <DialogFooter className="border-t border-white/10 pt-3">
          <Button
            variant="outlineDefault"
            onClick={() => {
              toggleViewModal(false);
              setSelectedRoles(defaultRoles as IRoles);
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewNextComponents;
