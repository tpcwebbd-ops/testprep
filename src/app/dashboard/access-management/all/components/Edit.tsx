/*
|-----------------------------------------
| setting up Edit Component for User Access
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import React, { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { IUsers_access } from '../api/v1/model';
import { useUsersAccessStore } from '../store/Store';
import { useUpdateUsers_accessMutation } from '../redux/rtk-Api';
import { usersAccessSelectorArr } from '../store/StoreConstants';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

const EditUserAccess: React.FC = () => {
  const { isEditModalOpen, toggleEditModal, selectedUsersAccess, setSelectedUsersAccess } = useUsersAccessStore();
  const [updateUsersAccess, { isLoading }] = useUpdateUsers_accessMutation();

  // Local state to hold form data, preventing direct mutation of the global store
  const [formData, setFormData] = useState<Partial<IUsers_access>>({ email: '', role: '' });

  // When a user is selected, populate the local form state
  useEffect(() => {
    if (selectedUsersAccess) {
      setFormData({
        email: selectedUsersAccess.email,
        role: selectedUsersAccess.role || '',
      });
    }
  }, [selectedUsersAccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    // The model expects an array of strings for the role
    setFormData(prev => ({ ...prev, role: value }));
  };
  const sessionData = useSession();

  const data = {
    name: sessionData.data?.user.name,
    email: sessionData.data?.user.email,
  };

  const handleSaveChanges = async () => {
    if (!selectedUsersAccess) {
      handleError('No user selected for editing.');
      return;
    }

    try {
      const updateData = {
        id: selectedUsersAccess._id,
        email: formData.email,
        role: formData.role,
        assignBy: data.name,
        assignByEmail: data.email,
      };

      // The RTK mutation expects an object with the ID and the update body
      await updateUsersAccess(updateData).unwrap();

      handleSuccess('User access updated successfully!');
      toggleEditModal(false);
    } catch (error: unknown) {
      console.error('Failed to update user access:', error);
      const errMessage = isApiErrorResponse(error)
        ? formatDuplicateKeyError(error.data.message)
        : error instanceof Error
        ? error.message
        : 'An unknown error occurred.';
      handleError(errMessage);
    }
  };

  // When the dialog is closed, clear the selected user from the global store
  const handleOnOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedUsersAccess(null);
    }
    toggleEditModal(isOpen);
  };

  return (
    <Dialog open={isEditModalOpen} onOpenChange={handleOnOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Access</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-email" className="text-right">
              Email
            </Label>
            <Input readOnly id="edit-email" name="email" type="email" value={formData.email || ''} onChange={handleInputChange} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-role" className="text-right">
              Role
            </Label>
            <Select onValueChange={handleRoleChange} value={formData.role || ''}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {usersAccessSelectorArr.map(role => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-slate-700 text-sm font-bold flaex items-center justify-between w-full">
            Assign by :{' '}
            <div className="text-sltate-400 font-normal">
              {data.name} ({data.email})
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => toggleEditModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserAccess;
