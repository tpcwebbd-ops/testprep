import React from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useAccessManagementsStore } from '../store/store';
import { useBulkUpdateAccessManagementsMutation } from '@/redux/features/accessManagements/accessManagementsSlice';
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
      <DialogContent className="bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-xl rounded-2xl">
        <DialogHeader className="border-b border-white/10 pb-3">
          <DialogTitle className="text-lg font-semibold tracking-wide text-white/90">Confirm Bulk Update</DialogTitle>
        </DialogHeader>
        {bulkData.length > 0 && (
          <p className="pt-4 text-white/80">
            You are about to update <span className="font-semibold text-white/90">({bulkData.length})</span> accessManagements.
          </p>
        )}
        <ScrollArea className="h-[400px] w-full rounded-md border border-white/10 p-4 bg-white/5 backdrop-blur-md shadow-inner">
          <div className="flex flex-col gap-2">
            {bulkData.map((accessmanagement, idx) => (
              <div key={(accessmanagement._id as string) || idx} className="flex items-center justify-between p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                <span className="text-white/90">
                  {idx + 1}. {(accessmanagement['user_name'] as string) || ''}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter className="border-t border-white/10 pt-3">
          <Button variant="outlineDefault" onClick={() => toggleBulkEditModal(false)} className="cursor-pointer">
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            variant="outlineWater"
            onClick={handleBulkEditAccessManagements}
            className="cursor-pointer"
          >
            {isLoading ? 'Updating...' : 'Update Selected'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkEditNextComponents;
