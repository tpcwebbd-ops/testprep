'use client';

import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';

import { IAccessManagements, defaultAccessManagements } from '../store/data/data';
import { useAccessManagementsStore } from '../store/store';
import { useUpdateAccessManagementsMutation } from '@/redux/features/accessManagements/accessManagementsSlice';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';
import { logger } from 'better-auth';

interface RoleItem {
  id: string;
  name: string;
}

const EditNextComponents: React.FC = () => {
  const { toggleEditModal, isEditModalOpen, selectedAccessManagements, setSelectedAccessManagements } = useAccessManagementsStore();

  const [updateAccessManagements, { isLoading }] = useUpdateAccessManagementsMutation();
  const [editedAccessManagement, setAccessManagement] = useState<IAccessManagements>(defaultAccessManagements);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // 🧠 Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true);
        const res = await fetch('/api/roles/v1/list');
        const data = await res.json();
        setRoles(data.data || []);
      } catch (err) {
        console.error('Failed to load roles:', err);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  // 🧠 Initialize selected record
  useEffect(() => {
    if (selectedAccessManagements) {
      setAccessManagement(selectedAccessManagements);
    }
  }, [selectedAccessManagements]);

  const handleFieldChange = (name: string, value: unknown) => {
    setAccessManagement(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Toggle selection by role name instead of ID
  const toggleRoleSelection = (roleName: string) => {
    const currentRoles = Array.isArray(editedAccessManagement.assign_role) ? editedAccessManagement.assign_role : [];

    const updatedRoles = currentRoles.includes(roleName) ? currentRoles.filter(name => name !== roleName) : [...currentRoles, roleName];

    handleFieldChange('assign_role', updatedRoles);
  };

  // 🧠 Handle save
  const handleEditAccessManagement = async () => {
    if (!selectedAccessManagements) return;

    try {
      const { _id, createdAt, updatedAt, ...updateData } = editedAccessManagement;
      logger.info(JSON.stringify({ _id, createdAt, updatedAt }));

      await updateAccessManagements({
        id: selectedAccessManagements._id,
        ...updateData,
      }).unwrap();

      toggleEditModal(false);
      handleSuccess('Edit Successful');
    } catch (error: unknown) {
      console.error('Failed to update record:', error);
      let errMessage = 'An unknown error occurred.';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message) || 'An API error occurred.';
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      handleError(errMessage);
    }
  };

  return (
    <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
      <DialogContent className={cn('sm:max-w-[625px] bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-lg rounded-2xl')}>
        <DialogHeader className="border-b border-white/10 pb-3">
          <DialogTitle className="text-lg font-semibold tracking-wide text-white/90">Edit Access Management</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full rounded-md border border-white/10 p-4 bg-white/5 backdrop-blur-md shadow-inner">
          <div className="grid gap-6 py-4">
            {/* User Name */}
            <div>
              <Label htmlFor="user_name" className="text-white/70 pb-1 block">
                User Name
              </Label>
              <InputFieldForString
                id="user_name"
                placeholder="User Name"
                value={editedAccessManagement.user_name}
                onChange={value => handleFieldChange('user_name', value as string)}
              />
            </div>

            {/* User Email */}
            <div>
              <Label htmlFor="user_email" className="text-white/70 pb-1 block">
                User Email
              </Label>
              <InputFieldForEmail
                id="user_email"
                value={editedAccessManagement.user_email}
                onChange={value => handleFieldChange('user_email', value as string)}
              />
            </div>

            {/* Assign Role (Multi-select) */}
            <div>
              <Label htmlFor="assign_role" className="text-white/70 pb-1 block">
                Assign Role
              </Label>

              <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-lg p-4 space-y-2 shadow-md">
                {loadingRoles ? (
                  <p className="text-sm text-white/60 text-center">Loading roles...</p>
                ) : roles.length === 0 ? (
                  <p className="text-sm text-white/60 text-center">No roles found.</p>
                ) : (
                  roles.map(role => {
                    const selected = editedAccessManagement.assign_role?.includes(role.name);
                    return (
                      <div
                        key={role.id}
                        className={cn(
                          'flex items-center justify-between p-3 rounded-xl transition-all duration-200 border border-transparent cursor-pointer',
                          selected ? 'bg-green-500/20 border-green-400/40 shadow-inner' : 'hover:bg-white/10 hover:border-white/20',
                        )}
                        onClick={() => toggleRoleSelection(role.name)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={role.name}
                            checked={selected}
                            onCheckedChange={() => toggleRoleSelection(role.name)}
                            className="border-white/40 data-[state=checked]:bg-green-400 data-[state=checked]:border-green-300"
                          />
                          <Label htmlFor={role.name} className={cn('text-white/90 cursor-pointer select-none', selected && 'font-semibold text-green-300')}>
                            {role.name}
                          </Label>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Given By Email */}
            <div>
              <Label htmlFor="given_by_email" className="text-white/70 pb-1 block">
                Given By Email
              </Label>
              <InputFieldForEmail
                id="given_by_email"
                value={editedAccessManagement.given_by_email}
                onChange={value => handleFieldChange('given_by_email', value as string)}
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="border-t border-white/10 pt-3">
          <Button
            variant="outlineDefault"
            onClick={() => {
              toggleEditModal(false);
              setSelectedAccessManagements(null);
            }}
          >
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleEditAccessManagement} variant="outlineWater">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNextComponents;
