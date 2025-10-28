import React, { useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import { BooleanInputField } from '@/components/dashboard-ui/BooleanInputField';
import { IUsers, defaultUsers } from '../store/data/data';
import { useUsersStore } from '../store/store';
import { useUpdateUsersMutation } from '@/redux/features/user/userSlice';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';
import { logger } from 'better-auth';

const EditNextComponents: React.FC = () => {
  const { toggleEditModal, isEditModalOpen, selectedUsers, setSelectedUsers } = useUsersStore();

  const [updateUsers, { isLoading }] = useUpdateUsersMutation();
  const [editedUser, setUser] = useState<IUsers>(defaultUsers);

  useEffect(() => {
    if (selectedUsers) {
      setUser(selectedUsers);
    }
  }, [selectedUsers]);

  const handleFieldChange = (name: string, value: unknown) => {
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleEditUser = async () => {
    if (!selectedUsers) return;

    try {
      const { _id, createdAt, updatedAt, ...updateData } = editedUser;
      logger.info(JSON.stringify({ _id, createdAt, updatedAt }));
      await updateUsers({
        id: selectedUsers._id,
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
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="name" className="text-right ">
                Name
              </Label>
              <div className="col-span-3">
                <InputFieldForString id="name" placeholder="Name" value={editedUser['name']} onChange={value => handleFieldChange('name', value as string)} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="email" className="text-right ">
                Email
              </Label>
              <div className="col-span-3">
                <InputFieldForEmail id="email" value={editedUser['email']} onChange={value => handleFieldChange('email', value as string)} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="emailVerified" className="text-right ">
                EmailVerified
              </Label>
              <div className="col-span-3">
                <BooleanInputField
                  id="emailVerified"
                  checked={editedUser['emailVerified']}
                  onCheckedChange={checked => handleFieldChange('emailVerified', checked)}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              toggleEditModal(false);
              setSelectedUsers(null);
            }}
          >
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleEditUser} className="bg-green-100 text-green-600 hover:bg-green-200">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNextComponents;
