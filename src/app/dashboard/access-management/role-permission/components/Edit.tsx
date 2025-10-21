import React, { useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import JsonTextareaField from '@/components/dashboard-ui/JsonTextareaField';
import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField';
import { IRoles, defaultRoles } from '../store/data/data';
import { useRolesStore } from '../store/store';
import { useUpdateRolesMutation } from '@/redux/features/roles/rolesSlice';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';
import { logger } from 'better-auth';

const EditNextComponents: React.FC = () => {
  const { toggleEditModal, isEditModalOpen, selectedRoles, setSelectedRoles } = useRolesStore();

  const [updateRoles, { isLoading }] = useUpdateRolesMutation();
  const [editedRole, setRole] = useState<IRoles>(defaultRoles);

  useEffect(() => {
    if (selectedRoles) {
      setRole(selectedRoles);
    }
  }, [selectedRoles]);

  const handleFieldChange = (name: string, value: unknown) => {
    setRole(prev => ({ ...prev, [name]: value }));
  };

  const handleEditRole = async () => {
    if (!selectedRoles) return;

    try {
      const { _id, createdAt, updatedAt, ...updateData } = editedRole;
      logger.info(JSON.stringify({ _id, createdAt, updatedAt }));
      await updateRoles({
        id: selectedRoles._id,
        ...updateData,
      }).unwrap();
      toggleEditModal(false);
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

  return (
    <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="name" className="text-right ">
                Role Name
              </Label>
              <div className="col-span-3">
                <InputFieldForString id="name" placeholder="Admin" value={editedRole['name']} onChange={value => handleFieldChange('name', value as string)} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="note" className="text-right pt-3">
                Note
              </Label>
              <div className="col-span-3">
                <RichTextEditorField id="note" value={editedRole['note']} onChange={value => handleFieldChange('note', value)} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="description" className="text-right pt-3">
                Description
              </Label>
              <div className="col-span-3">
                <RichTextEditorField id="description" value={editedRole['description']} onChange={value => handleFieldChange('description', value)} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="email" className="text-right ">
                email
              </Label>
              <div className="col-span-3">
                <InputFieldForEmail id="email" value={editedRole['email']} onChange={value => handleFieldChange('email', value as string)} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="role" className="text-right pt-3">
                role
              </Label>
              <div className="col-span-3">
                <JsonTextareaField id="role" value={editedRole['role'] || {}} onChange={value => handleFieldChange('role', value)} />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              toggleEditModal(false);
              setSelectedRoles(null);
            }}
          >
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleEditRole} className="bg-green-100 text-green-600 hover:bg-green-200">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNextComponents;
