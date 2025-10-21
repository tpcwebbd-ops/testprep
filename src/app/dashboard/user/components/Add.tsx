import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import { BooleanInputField } from '@/components/dashboard-ui/BooleanInputField';
import { useUsersStore } from '../store/store';
import { useAddUsersMutation } from '@/redux/features/user/userSlice';
import { IUsers, defaultUsers } from '../store/data/data';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

const AddNextComponents: React.FC = () => {
  const { toggleAddModal, isAddModalOpen, setUsers } = useUsersStore();
  const [addUsers, { isLoading }] = useAddUsersMutation();
  const [newUser, setNewUser] = useState<IUsers>(defaultUsers);

  const handleFieldChange = (name: string, value: unknown) => {
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      const updateData = { ...newUser };
      delete updateData._id;
      const addedUser = await addUsers(updateData).unwrap();
      setUsers([addedUser]);
      toggleAddModal(false);
      setNewUser(defaultUsers);
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
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="name" className="text-right ">
                Name
              </Label>
              <div className="col-span-3">
                <InputFieldForString id="name" placeholder="Name" value={newUser['name']} onChange={value => handleFieldChange('name', value as string)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="email" className="text-right ">
                Email
              </Label>
              <div className="col-span-3">
                <InputFieldForEmail id="email" value={newUser['email']} onChange={value => handleFieldChange('email', value as string)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="emailVerified" className="text-right ">
                EmailVerified
              </Label>
              <div className="col-span-3">
                <BooleanInputField
                  id="emailVerified"
                  checked={newUser['emailVerified']}
                  onCheckedChange={checked => handleFieldChange('emailVerified', checked)}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => toggleAddModal(false)}>
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleAddUser}>
            {isLoading ? 'Adding...' : 'Add User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNextComponents;
