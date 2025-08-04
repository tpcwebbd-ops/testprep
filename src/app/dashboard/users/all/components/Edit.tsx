import React, { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

import { IGAuthUsers } from '../api/v1/Model';
import { useGAuthUsersStore } from '../store/Store';
import { useUpdateGAuthUsersMutation } from '../redux/rtk-Api';
import { baseIGAuthUsers } from '../store/StoreConstants';

import DataSelect from './DataSelect';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';
import { useSession } from 'next-auth/react';

const Edit: React.FC = () => {
  const [newUserRole, setNewUserRole] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');

  const { toggleEditModal, isEditModalOpen, newGAuthUsers, selectedGAuthUsers, setNewGAuthUsers, setSelectedGAuthUsers } = useGAuthUsersStore();

  const [updateGAuthUsers] = useUpdateGAuthUsersMutation();

  useEffect(() => {
    if (selectedGAuthUsers) {
      setNewGAuthUsers(selectedGAuthUsers);
      setNewUserRole(selectedGAuthUsers.userRole || []);
      setImageUrl(selectedGAuthUsers.imageUrl || '');
    }
  }, [selectedGAuthUsers, setNewGAuthUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewGAuthUsers({ ...newGAuthUsers, [name]: value });
  };

  const { data: sessionData } = useSession();
  const handleCheckboxChange = (checked: boolean) => {
    setNewGAuthUsers({ ...newGAuthUsers, isBlocked: checked, blockedBy: checked ? sessionData?.user?.email || '' : '' });
  };

  const handleEdit = async () => {
    if (!selectedGAuthUsers) return;

    try {
      const updateData: IGAuthUsers = {
        name: newGAuthUsers.name || '',
        userRole: newUserRole,
        imageUrl: imageUrl || '',
        isBlocked: newGAuthUsers.isBlocked || false,
        blockedBy: newGAuthUsers.blockedBy || '',
        email: newGAuthUsers.email || '',
        passCode: newGAuthUsers.passCode || '',
        userUID: newGAuthUsers.userUID || '',
        createdAt: newGAuthUsers.createdAt || new Date(),
        updatedAt: new Date(),
        _id: newGAuthUsers._id,
      };

      await updateGAuthUsers({ id: selectedGAuthUsers._id, ...updateData }).unwrap();
      toggleEditModal(false);
      handleSuccess('Edit Successful');
    } catch (error: unknown) {
      let errMessage: string = '';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message);
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      handleError(errMessage);
    }
  };

  return (
    <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit GAuth User</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input id="edit-name" name="name" value={newGAuthUsers.name || ''} onChange={handleInputChange} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input readOnly id="edit-email" name="email" type="email" value={newGAuthUsers.email || ''} onChange={handleInputChange} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-passCode" className="text-right">
                Pass Code
              </Label>
              <Input
                id="edit-passCode"
                name="passCode"
                type="password"
                value={newGAuthUsers.passCode || ''}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-userUID" className="text-right">
                User UID
              </Label>
              <Input id="edit-userUID" name="userUID" value={newGAuthUsers.userUID || ''} onChange={handleInputChange} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-blockedBy" className="text-right">
                Blocked By
              </Label>
              <Input readOnly id="edit-blockedBy" name="blockedBy" value={newGAuthUsers.blockedBy || ''} onChange={handleInputChange} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-isBlocked" className="text-right">
                Is Blocked
              </Label>
              <div className="col-span-3">
                <Checkbox id="edit-isBlocked" checked={newGAuthUsers.isBlocked || false} onCheckedChange={handleCheckboxChange} />
              </div>
            </div>

            <DataSelect newItemTags={newUserRole} setNewItemTags={setNewUserRole} label="User Roles" />
          </div>

          <div className="mt-4 pt-4" />
        </ScrollArea>

        <DialogFooter>
          <Button
            className="cursor-pointer border-1 border-slate-400 hover:border-slate-500"
            variant="outline"
            onClick={() => {
              toggleEditModal(false);
              setSelectedGAuthUsers({ ...baseIGAuthUsers } as IGAuthUsers);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEdit}
            className="text-green-400 hover:text-green-500 cursor-pointer bg-green-100 hover:bg-green-200 border-1 border-green-300 hover:border-green-400"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Edit;
