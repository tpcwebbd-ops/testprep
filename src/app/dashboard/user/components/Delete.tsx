import React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { IUsers, defaultUsers } from '../store/data/data';
import { useUsersStore } from '../store/store';
import { useDeleteUsersMutation } from '@/redux/features/user/userSlice';
import { handleSuccess, handleError } from './utils';

const DeleteNextComponents: React.FC = () => {
  const { toggleDeleteModal, isDeleteModalOpen, selectedUsers, setSelectedUsers } = useUsersStore();

  const [deleteUser, { isLoading }] = useDeleteUsersMutation();

  const handleDelete = async () => {
    if (selectedUsers) {
      try {
        await deleteUser({
          id: selectedUsers._id,
        }).unwrap();
        toggleDeleteModal(false);
        handleSuccess('Delete Successful');
      } catch (error) {
        console.error('Failed to delete User:', error);
        handleError('Failed to delete item. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    toggleDeleteModal(false);
    setSelectedUsers({ ...defaultUsers } as IUsers);
  };

  const displayName = selectedUsers?.['name'] || '';

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        {selectedUsers && (
          <div className="py-4">
            <p>
              You are about to delete this user: <span className="font-semibold">{displayName}</span>
            </p>
          </div>
        )}
        <DialogFooter>
          <Button className="cursor-pointer" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button disabled={isLoading} variant="destructive" onClick={handleDelete}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNextComponents;
