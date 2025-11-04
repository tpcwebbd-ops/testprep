'use client';
import React, { useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField';

import { IRoles, IERoles, defaultRoles, defaulERoles } from '../store/data/data';
import { useRolesStore } from '../store/store';
import { useUpdateRolesMutation } from '@/redux/features/roles/rolesSlice';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';
import { logger } from 'better-auth';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

const EditNextComponents: React.FC = () => {
  const { toggleEditModal, isEditModalOpen, selectedRoles, setSelectedRoles } = useRolesStore();
  const [updateRoles, { isLoading }] = useUpdateRolesMutation();

  const [editedRole, setRole] = useState<IRoles>(defaultRoles);

  const sessionEmail = authClient.useSession().data?.user.email || '';
  useEffect(() => {
    if (selectedRoles) {
      setRole(selectedRoles);
    }
  }, [selectedRoles]);

  const handleFieldChange = (name: string, value: unknown) => {
    setRole(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (module: keyof IERoles, permission: keyof IERoles[keyof IERoles]) => {
    setRole(prev => ({
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

  const handleEditRole = async () => {
    if (!selectedRoles) return;
    try {
      const { _id, createdAt, updatedAt, ...updateData } = editedRole;
      logger.info(JSON.stringify({ _id, createdAt, updatedAt }));
      updateData.email = sessionEmail;
      await updateRoles({
        id: selectedRoles._id,
        ...updateData,
      }).unwrap();

      toggleEditModal(false);
      setSelectedRoles(null);
      handleSuccess('Edit Successful');
    } catch (error: unknown) {
      console.error('Failed to update record:', error);
      let errMessage: string = 'An unknown error occurred.';
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
    <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
      <DialogContent className="sm:max-w-[900px] rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl text-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white/90">Edit Role</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full rounded-md border border-white/10 p-4">
          <div className="grid gap-4 py-4">
            {/* ====== Name ====== */}
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="name" className="text-right text-white/80">
                Role Name
              </Label>
              <div className="col-span-3">
                <InputFieldForString id="name" placeholder="Admin" value={editedRole['name']} onChange={value => handleFieldChange('name', value as string)} />
              </div>
            </div>

            {/* ====== Note ====== */}
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="note" className="text-right text-white/80 pt-3">
                Note
              </Label>
              <div className="col-span-3">
                <RichTextEditorField id="note" value={editedRole['note']} onChange={value => handleFieldChange('note', value)} />
              </div>
            </div>

            {/* ====== Description ====== */}
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="description" className="text-right text-white/80 pt-3">
                Description
              </Label>
              <div className="col-span-3">
                <RichTextEditorField id="description" value={editedRole['description']} onChange={value => handleFieldChange('description', value)} />
              </div>
            </div>

            {/* ====== Email ====== */}
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="email" className="text-right text-white/80">
                Email
              </Label>
              <div className="col-span-3">
                <Input id="email" readOnly value={authClient.useSession().data?.user.email || editedRole['email']} />
              </div>
            </div>

            {/* ====== Role Permission Table ====== */}
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
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
                            <Checkbox checked={editedRole.role[module][permission]} onCheckedChange={() => handlePermissionChange(module, permission)} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              toggleEditModal(false);
              setSelectedRoles(null);
            }}
            className="bg-transparent border-white/20 text-white/80 hover:bg-white/20"
          >
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleEditRole} className="bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white transition-all">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNextComponents;
