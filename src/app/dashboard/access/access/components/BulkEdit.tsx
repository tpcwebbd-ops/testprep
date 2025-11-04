import React from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useAccessManagementsStore } from '../store/store';
import { useBulkUpdateAccessManagementsMutation } from '@/redux/features/accessManagements/accessmaMagementsSlice';
import { handleSuccess, handleError } from './utils';

const BulkEditNextComponents: React.FC = () => {
  const { isBulkEditModalOpen, toggleBulkEditModal, bulkData, setBulkData } = useAccessManagementsStore();
  const [bulkUpdateAccessManagements, { isLoading }] = useBulkUpdateAccessManagementsMutation();

  const handleBulkEditAccessManagements = async () => {
    if (!bulkData.length) return;
    try {
      const newBulkData = bulkData.map(({ _id, ...rest }) => ({
        id: _id,
        updateData: rest,
      }));
      await bulkUpdateAccessManagements(newBulkData).unwrap();
      toggleBulkEditModal(false);
      setBulkData([]);
      handleSuccess('Edit Successful');
    } catch (error) {
      console.error('Failed to edit accessManagements:', error);
      handleError('Failed to update items. Please try again.');
    }
  };

  return (
    <Dialog open={isBulkEditModalOpen} onOpenChange={toggleBulkEditModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Bulk Update</DialogTitle>
        </DialogHeader>
        {bulkData.length > 0 && (
          <p className="pt-4">
            You are about to update <span className="font-semibold">({bulkData.length})</span> accessManagements.
          </p>
        )}
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="flex flex-col gap-2">
            {bulkData.map((accessmanagement, idx) => (
              <div key={(accessmanagement._id as string) || idx} className="flex items-center justify-between">
                <span>
                  {idx + 1}. {(accessmanagement['user_name'] as string) || ''}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => toggleBulkEditModal(false)} className="cursor-pointer border-slate-400 hover:border-slate-500">
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            variant="outline"
            onClick={handleBulkEditAccessManagements}
            className="text-green-500 hover:text-green-600 cursor-pointer bg-green-100 hover:bg-green-200 border border-green-300 hover:border-green-400"
          >
            {isLoading ? 'Updating...' : 'Update Selected'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkEditNextComponents;
