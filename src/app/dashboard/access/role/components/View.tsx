'use client';

import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, XCircle, ShieldCheck, Globe, Clock, FileText } from 'lucide-react';
import { defaultRoles, ICURD } from '../store/data/data';
import { useRolesStore } from '../store/store';
import { useGetRolesByIdQuery } from '@/redux/features/roles/rolesSlice';
import { useGetSidebarsQuery } from '@/redux/features/sidebars/sidebarsSlice';
import { iconMap, SidebarItem } from '../../sidebar/utils';

type PermissionKey = keyof ICURD;

const ViewNextComponents: React.FC = () => {
  const { isViewModalOpen, selectedRoles, toggleViewModal, setSelectedRoles } = useRolesStore();
  const { data: roleData, refetch } = useGetRolesByIdQuery(selectedRoles?._id, { skip: !selectedRoles?._id });
  const { data: sidebarData, isLoading: sidebarIsLoading } = useGetSidebarsQuery({ page: 1, limit: 100 });
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);

  useEffect(() => {
    if (selectedRoles?._id && isViewModalOpen) {
      refetch();
    }
  }, [selectedRoles?._id, refetch, isViewModalOpen]);

  useEffect(() => {
    if (roleData?.data) {
      setSelectedRoles(roleData.data);
    }
  }, [roleData, setSelectedRoles]);

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

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'PPP p');
    } catch {
      return 'Invalid Date';
    }
  };

  const getPermission = (path: string, key: PermissionKey): boolean => {
    const access = selectedRoles?.dashboard_access_ui?.find(item => item.path === path);
    return access?.userAccess ? !!access.userAccess[key] : false;
  };

  const isModuleEnabled = (path: string): boolean => {
    return !!selectedRoles?.dashboard_access_ui?.some(item => item.path === path);
  };

  const PermissionIcon = ({ active }: { active: boolean }) =>
    active ? (
      <CheckCircle2 size={16} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
    ) : (
      <XCircle size={16} className="text-rose-500/40" />
    );

  const AccessRow = ({ item, isChild = false }: { item: SidebarItem; isChild?: boolean }) => {
    const enabled = isModuleEnabled(item.path);
    return (
      <div
        className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl transition-all duration-300 ${enabled ? 'bg-white/5 border border-white/10' : 'opacity-40 grayscale-[0.5]'} ${isChild ? 'ml-6 sm:ml-10' : ''}`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`p-2 rounded-lg ${enabled ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/20'}`}>{item.icon}</div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-bold text-white/90">{item.name}</span>
            <span className="text-[10px] font-mono text-white/40">{item.path}</span>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 px-2 sm:px-0">
          {(['create', 'read', 'update', 'delete'] as PermissionKey[]).map(key => (
            <div key={key} className="flex flex-col items-center gap-1">
              <PermissionIcon active={enabled && getPermission(item.path, key)} />
              <span className="text-[9px] uppercase font-black text-white/20 sm:hidden">{key[0]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[800px] lg:max-w-[950px] bg-[#0f172a]/90 backdrop-blur-2xl border border-white/10 text-white shadow-2xl rounded-3xl overflow-hidden p-0">
        <DialogHeader className="p-6 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/20 rounded-2xl border border-blue-500/30">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight text-white">Role Identification</DialogTitle>
              <p className="text-xs text-white/40 font-medium uppercase tracking-widest mt-1">Security Profile & Permissions</p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] w-full">
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-blue-400">
                  <Globe size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Identity</span>
                </div>
                <p className="text-sm font-semibold text-white/90">{selectedRoles?.name || 'Untitled Role'}</p>
                <p className="text-xs text-white/40 mt-1 truncate">{selectedRoles?.email}</p>
              </div>
              <div className="md:col-span-2 bg-white/5 border border-white/5 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-purple-400">
                  <FileText size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Description</span>
                </div>
                <div
                  className="text-xs text-white/60 leading-relaxed max-h-20 overflow-y-auto pr-2"
                  dangerouslySetInnerHTML={{ __html: selectedRoles?.description || 'No description provided.' }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-white/40">Resource Access Matrix</h3>
                <div className="hidden sm:flex items-center gap-7 text-[10px] font-black text-white/20 mr-2">
                  <span>CREATE</span>
                  <span>READ</span>
                  <span>UPDATE</span>
                  <span>DELETE</span>
                </div>
              </div>

              <div className="space-y-3">
                {sidebarIsLoading ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Decrypting Access Schema...</p>
                  </div>
                ) : (
                  sidebarItems.map(item => (
                    <div key={item.sl_no} className="space-y-2">
                      <AccessRow item={item} />
                      {item.children?.map(child => (
                        <AccessRow key={child.sl_no} item={child} isChild />
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 px-4 py-3 bg-black/20 rounded-xl">
                <Clock className="text-white/20" size={16} />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">Initialized</span>
                  <span className="text-xs font-medium text-white/60">{formatDate(selectedRoles?.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-black/20 rounded-xl">
                <Clock className="text-white/20" size={16} />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">Last Modification</span>
                  <span className="text-xs font-medium text-white/60">{formatDate(selectedRoles?.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 bg-black/40 border-t border-white/5">
          <Button
            onClick={() => {
              toggleViewModal(false);
              setSelectedRoles(defaultRoles);
            }}
            className="w-full sm:w-auto px-10 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all font-bold"
          >
            Acknowledge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewNextComponents;
