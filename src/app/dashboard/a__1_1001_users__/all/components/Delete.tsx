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

import { IUsers_1_000___ } from '../api/v1/Model';
import { useUsers_1_000___Store } from '../store/Store';
import { baseIUsers_1_000___ } from '../store/StoreConstants';
import { useDeleteUsers_1_000___Mutation } from '../redux/rtk-Api';

import { handleSuccess } from './utils';

const DeleteNextComponents: React.FC = () => {
  const { toggleDeleteModal, isDeleteModalOpen, selectedUsers_1_000___, setSelectedUsers_1_000___ } = useUsers_1_000___Store();
  const [deleteUsers_1_000___] = useDeleteUsers_1_000___Mutation();

  const handleDeleteUsers_1_000___ = async () => {
    if (selectedUsers_1_000___) {
      try {
        await deleteUsers_1_000___({ id: selectedUsers_1_000___._id }).unwrap();
        toggleDeleteModal(false);
        handleSuccess('Delete Successful');
      } catch (error) {
        console.error('Failed to delete Users_1_000___:', error);
      }
    }
  };

  const handleCancel = () => {
    toggleDeleteModal(false);
    setSelectedUsers_1_000___({ ...baseIUsers_1_000___ } as IUsers_1_000___);
  };

  const { name = '' } = selectedUsers_1_000___ || {};

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        {selectedUsers_1_000___ && (
          <div className="py-4">
            <p>
              You are about to delete Users_1_000___: <span className="font-semibold">{(name as string) || ''}</span>
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
            onClick={handleDeleteUsers_1_000___}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNextComponents;
