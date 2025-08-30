import React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { IFinances, defaultFinances } from '../api/v1/model';
import { useFinancesStore } from '../store/store';
import { useDeletefinancesMutation } from '../redux/rtk-api';
import { handleSuccess, handleError } from './utils';

const DeleteNextComponents: React.FC = () => {
  const { toggleDeleteModal, isDeleteModalOpen, selectedFinances, setSelectedFinances } = useFinancesStore();

  const [deleteFinance, { isLoading }] = useDeletefinancesMutation();

  const handleDelete = async () => {
    if (selectedFinances) {
      try {
        await deleteFinance({
          id: selectedFinances._id,
        }).unwrap();
        toggleDeleteModal(false);
        handleSuccess('Delete Successful');
      } catch (error) {
        console.error('Failed to delete Finance:', error);
        handleError('Failed to delete item. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    toggleDeleteModal(false);
    setSelectedFinances({ ...defaultFinances } as IFinances);
  };

  const displayName = (selectedFinances as IFinances)?.['studentName'] || '';

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        {selectedFinances && (
          <div className="py-4">
            <p>
              You are about to delete this finance: <span className="font-semibold">{displayName}</span>
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
