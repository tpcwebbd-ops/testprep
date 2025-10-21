import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import DynamicSelectField from '@/components/dashboard-ui/DynamicSelectField';
import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';

import { useAccessManagementsStore } from '../store/store';
import { useAddAccessManagementsMutation } from '@/redux/features/accessManagements/accessManagementsSlice';
import { IAccessManagements, defaultAccessManagements } from '../store/data/data';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';
import { authClient } from '@/lib/auth-client';

const AddNextComponents: React.FC = () => {
  const { toggleAddModal, isAddModalOpen, setAccessManagements } = useAccessManagementsStore();
  const [addAccessManagements, { isLoading }] = useAddAccessManagementsMutation();
  const [newAccessManagement, setNewAccessManagement] = useState<IAccessManagements>(defaultAccessManagements);
  const sessionEmail = authClient.useSession().data?.user.email || '';
  const handleFieldChange = (name: string, value: unknown) => {
    setNewAccessManagement(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAccessManagement = async () => {
    try {
      const updateData = { ...newAccessManagement };
      delete updateData._id;

      const addedAccessManagement = await addAccessManagements(updateData).unwrap();
      setAccessManagements([addedAccessManagement]);
      toggleAddModal(false);
      setNewAccessManagement(defaultAccessManagements);
      handleSuccess('Added Successfully');
    } catch (error: unknown) {
      console.error('Failed to add record:', error);
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
    <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Add New AccessManagement</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-4 pr-1">
              <Label htmlFor="user_name" className="text-right ">
                User_name
              </Label>
              <div className="col-span-3">
                <InputFieldForString
                  id="user_name"
                  placeholder="User_name"
                  value={newAccessManagement['user_name']}
                  onChange={value => handleFieldChange('user_name', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 items-center gap-4 pr-1">
              <Label htmlFor="user_email" className="text-right ">
                User_email
              </Label>
              <div className="col-span-3">
                <InputFieldForEmail
                  id="user_email"
                  value={newAccessManagement['user_email']}
                  onChange={value => handleFieldChange('user_email', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 items-center gap-4 pr-1">
              <Label htmlFor="assign_role" className="text-right ">
                Assign_role
              </Label>
              <div className="col-span-3">
                <DynamicSelectField
                  value={newAccessManagement['assign_role']}
                  apiUrl="https://jsonplaceholder.typicode.com/users"
                  onChange={values => handleFieldChange('assign_role', values)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 items-center gap-4 pr-1">
              <Label htmlFor="given_by_email" className="text-right ">
                Given_by_email
              </Label>
              <div className="col-span-3">
                <Input id="given_by_email" value={sessionEmail} readOnly />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => toggleAddModal(false)}>
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleAddAccessManagement}>
            {isLoading ? 'Adding...' : 'Add AccessManagement'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNextComponents;
