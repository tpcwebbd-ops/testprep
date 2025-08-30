import React from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useFinancesStore } from '../store/store';
import { useBulkDeletefinancesMutation } from '../redux/rtk-api';
import { handleSuccess, handleError } from './utils';
import { IFinances } from '../store/data-type';

const BulkDeleteNextComponents: React.FC = () => {
  const { isBulkDeleteModalOpen, toggleBulkDeleteModal, bulkData, setBulkData } = useFinancesStore();

  const [bulkDeleteFinances, { isLoading }] = useBulkDeletefinancesMutation();

  const handleBulkDelete = async () => {
    if (!bulkData?.length) return;
    try {
      const ids = bulkData.map((finance: IFinances) => finance?._id);
      await bulkDeleteFinances({ ids }).unwrap();
      toggleBulkDeleteModal(false);
      setBulkData([]);
      handleSuccess('Delete Successful');
    } catch (error) {
      console.error('Failed to delete Finances:', error);
      handleError('Failed to delete items. Please try again.');
    }
  };

  return (
    <Dialog open={isBulkDeleteModalOpen} onOpenChange={toggleBulkDeleteModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        {bulkData?.length > 0 && (
          <div className="pt-4">
            <p>
              You are about to delete <span className="font-semibold">({bulkData.length})</span> finances.
            </p>
          </div>
        )}
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="flex flex-col">
            {bulkData.map((finance: IFinances, idx: number) => (
              <span key={(finance?._id as string) + idx} className="text-xs">
                {idx + 1}. {((finance as IFinances)['studentName'] as string) || ''}
              </span>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button className="cursor-pointer" variant="outline" onClick={() => toggleBulkDeleteModal(false)}>
            Cancel
          </Button>
          <Button disabled={isLoading} variant="destructive" onClick={handleBulkDelete}>
            {isLoading ? 'Deleting...' : 'Delete Selected'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkDeleteNextComponents;
