import React, { useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import DynamicSelectField from '@/components/dashboard-ui/DynamicSelectField';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import { IAccessManagements, defaultAccessManagements } from '../store/data/data';
import { useAccessManagementsStore } from '../store/store';
import { useUpdateAccessManagementsMutation } from '@/redux/features/accessManagements/accessManagementsSlice';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';
import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail';
import { logger } from 'better-auth';

const EditNextComponents: React.FC = () => {
  const { toggleEditModal, isEditModalOpen, selectedAccessManagements, setSelectedAccessManagements } = useAccessManagementsStore();

  const [updateAccessManagements, { isLoading }] = useUpdateAccessManagementsMutation();
  const [editedAccessManagement, setAccessManagement] = useState<IAccessManagements>(defaultAccessManagements);

  useEffect(() => {
    if (selectedAccessManagements) {
      setAccessManagement(selectedAccessManagements);
    }
  }, [selectedAccessManagements]);

  const handleFieldChange = (name: string, value: unknown) => {
    setAccessManagement(prev => ({ ...prev, [name]: value }));
  };

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
          <DialogTitle>Edit AccessManagement</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="user_name" className="text-right ">
                User_name
              </Label>
              <div className="col-span-3">
                <InputFieldForString
                  id="user_name"
                  placeholder="User_name"
                  value={editedAccessManagement['user_name']}
                  onChange={value => handleFieldChange('user_name', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="user_email" className="text-right ">
                User_email
              </Label>
              <div className="col-span-3">
                <InputFieldForEmail
                  id="user_email"
                  value={editedAccessManagement['user_email']}
                  onChange={value => handleFieldChange('user_email', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="assign_role" className="text-right ">
                Assign_role
              </Label>
              <div className="col-span-3">
                <DynamicSelectField
                  value={editedAccessManagement['assign_role']}
                  apiUrl="https://jsonplaceholder.typicode.com/users"
                  onChange={values => handleFieldChange('assign_role', values)}
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
              setSelectedAccessManagements(null);
            }}
          >
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleEditAccessManagement} className="bg-green-100 text-green-600 hover:bg-green-200">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNextComponents;
