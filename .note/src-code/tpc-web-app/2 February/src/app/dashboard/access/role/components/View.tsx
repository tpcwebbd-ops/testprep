'use client';

import React, { useEffect, useState } from 'react';
import { Shield, Clock, Globe, Check, X } from 'lucide-react';
import { format } from 'date-fns';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

import { ICURD, defaultRoles } from '../store/data/data';
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

  const isRowChecked = (path: string): boolean => {
    return (selectedRoles?.dashboard_access_ui || []).some(item => item.path === path);
  };

  const getPermissionValue = (path: string, permission: PermissionKey): boolean => {
    const item = (selectedRoles?.dashboard_access_ui || []).find(i => i.path === path);
    return item?.userAccess ? !!item.userAccess[permission] : false;
  };

  const PermissionIndicator = ({ active, label }: { active: boolean; label: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-500 ${
                active ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-white/5 border-white/10 text-white/10'
              }`}
            >
              {active ? <Check size={12} strokeWidth={3} /> : <X size={10} strokeWidth={3} />}
            </div>
            <span className={`text-[8px] uppercase font-bold tracking-tighter sm:hidden ${active ? 'text-blue-400' : 'text-white/20'}`}>{label[0]}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-950 border-white/10 text-[10px] font-bold uppercase tracking-widest">
          {label}: {active ? 'Enabled' : 'Disabled'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const PermissionGroup = ({ item }: { item: SidebarItem }) => (
    <div className="flex items-center gap-3 sm:gap-4 ml-auto">
      {(['create', 'read', 'update', 'delete'] as PermissionKey[]).map(key => (
        <PermissionIndicator key={key} active={isRowChecked(item.path) && getPermissionValue(item.path, key)} label={key} />
      ))}
    </div>
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ReadOnlyField = ({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) => (
    <div className="space-y-2 group">
      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">{label}</Label>
      <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-3 flex items-center gap-3 transition-colors group-hover:border-white/20">
        {Icon && <Icon size={16} className="text-blue-400/60" />}
        <span className="text-sm font-medium text-white/90 truncate">{value || 'Not specified'}</span>
      </div>
    </div>
  );

  const ContentBlock = ({ label, html }: { label: string; html?: string }) => (
    <div className="space-y-2">
      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">{label}</Label>
      <div className="min-h-[100px] rounded-2xl bg-white/5 border border-white/10 p-4">
        <div
          className="text-sm text-white/60 leading-relaxed prose prose-invert prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: html || '<p className="text-white/20 italic">No additional data provided.</p>' }}
        />
      </div>
    </div>
  );

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent className="sm:max-w-[95vw] mt-12 md:max-w-[850px] lg:max-w-[1000px] rounded-[2rem] backdrop-blur-3xl bg-white/10 border border-white/10 shadow-2xl text-white overflow-hidden p-0">
        <DialogHeader className="p-6 py-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                Role Configuration
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] w-full">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReadOnlyField label="Access Identity" value={selectedRoles?.name || ''} />
              <ReadOnlyField label="Account Anchor" value={selectedRoles?.email || ''} icon={Globe} />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <ContentBlock label="Internal Administrative Notes" html={selectedRoles?.note} />
              <ContentBlock label="Permissions Architecture" html={selectedRoles?.description} />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <Label className="text-sm font-black uppercase tracking-widest text-white/80">Access Control Matrix</Label>
                </div>
                <div className="hidden sm:flex gap-6 text-[10px] uppercase tracking-widest font-black text-white/20 mr-4">
                  <span>Create</span>
                  <span>Read</span>
                  <span>Update</span>
                  <span>Delete</span>
                </div>
              </div>

              <div className="rounded-3xl bg-black/10 border border-white/5 p-2 sm:p-4">
                {sidebarIsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Decrypting Schema...</span>
                  </div>
                ) : (
                  <Accordion type="multiple" className="space-y-3">
                    {sidebarItems.map(item => {
                      const hasChildren = item.children && item.children.length > 0;
                      const activeRow = isRowChecked(item.path);

                      const RowContent = (
                        <div className={`flex items-center gap-3 p-4 rounded-2xl transition-all w-full group ${activeRow ? 'bg-white/5' : 'opacity-40'}`}>
                          <div className="flex items-center gap-4 flex-1 overflow-hidden">
                            <div
                              className={`p-2.5 rounded-xl transition-all duration-500 ${
                                activeRow
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                  : 'bg-white/5 text-white/20'
                              }`}
                            >
                              {item.icon}
                            </div>
                            <div className="flex flex-col text-left truncate">
                              <span className={`text-sm font-bold tracking-tight transition-colors ${activeRow ? 'text-white' : 'text-white/40'}`}>
                                {item.name}
                              </span>
                              <span className="text-[10px] font-mono font-medium text-white/20 truncate uppercase tracking-tighter">{item.path}</span>
                            </div>
                          </div>
                          <PermissionGroup item={item} />
                        </div>
                      );

                      if (hasChildren) {
                        return (
                          <AccordionItem key={item.sl_no} value={`item-${item.sl_no}`} className="border-none">
                            <AccordionTrigger className="hover:no-underline hover:bg-white/5 px-2 py-0">{RowContent}</AccordionTrigger>
                            <AccordionContent className="pt-2 pb-0">
                              <div className="ml-8 space-y-2 border-l border-white/10 pl-4 py-2">
                                {item.children?.map(child => (
                                  <div
                                    key={child.sl_no}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                                      isRowChecked(child.path) ? 'bg-white/[0.03]' : 'opacity-30'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      <div className="p-1.5 bg-white/5 rounded text-cyan-400/70">{child.icon}</div>
                                      <span className="text-xs font-semibold text-white/60">{child.name}</span>
                                    </div>
                                    <PermissionGroup item={child} />
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      }

                      return (
                        <div key={item.sl_no} className="w-full">
                          {RowContent}
                        </div>
                      );
                    })}
                  </Accordion>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/5">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <Clock className="w-4 h-4 text-white/20" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Record Created</span>
                  <span className="text-xs font-bold text-white/60">{formatDate(selectedRoles?.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <Globe className="w-4 h-4 text-white/20" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">System Synced</span>
                  <span className="text-xs font-bold text-white/60">{formatDate(selectedRoles?.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 py-4 bg-white/5 border-t border-white/5">
          <Button
            onClick={() => {
              toggleViewModal(false);
              setSelectedRoles(defaultRoles);
            }}
            variant="outlineGlassy"
            size="sm"
            className="px-8"
          >
            Close Inspector
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewNextComponents;
