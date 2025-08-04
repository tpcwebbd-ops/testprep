/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { IGAuthUsers } from '../api/v1/Model';
import { useGAuthUsersStore } from '../store/Store';
import { baseIGAuthUsers } from '../store/StoreConstants';
import { useDeleteGAuthUsersMutation } from '../redux/rtk-Api';

import { handleSuccess } from './utils';

const DeleteNextComponents: React.FC = () => {
  const { toggleDeleteModal, isDeleteModalOpen, selectedGAuthUsers, setSelectedGAuthUsers } = useGAuthUsersStore();
  const [deleteGAuthUsers] = useDeleteGAuthUsersMutation();

  const handleDeleteGAuthUsers = async () => {
    if (selectedGAuthUsers) {
      try {
        await deleteGAuthUsers({ id: selectedGAuthUsers._id }).unwrap();
        toggleDeleteModal(false);
        handleSuccess('Delete Successful');
      } catch (error) {
        console.error('Failed to delete GAuthUsers:', error);
      }
    }
  };

  const handleCancel = () => {
    toggleDeleteModal(false);
    setSelectedGAuthUsers({ ...baseIGAuthUsers } as IGAuthUsers);
  };

  const { name = '' } = selectedGAuthUsers || {};

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        {selectedGAuthUsers && (
          <div className="py-4">
            <p>
              You are about to delete GAuthUsers: <span className="font-semibold">{(name as string) || ''}</span>
            </p>
          </div>
        )}
        <DialogFooter>
          <Button className="cursor-pointer border-1 border-slate-400 hover:border-slate-500" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            className="text-rose-400 hover:text-rose-500 cursor-pointer bg-rose-100 hover:bg-rose-200 border-1 border-rose-300 hover:border-rose-400 "
            variant="outline"
            onClick={handleDeleteGAuthUsers}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNextComponents;
