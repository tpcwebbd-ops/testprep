'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { usePostsStore } from '../store/store';
import { useBulkDeletePostsMutation } from '@/redux/features/posts/postsSlice';
import { handleSuccess, handleError } from './utils';

const BulkDeleteNextComponents: React.FC = () => {
  const {
    isBulkDeleteModalOpen,
    toggleBulkDeleteModal,
    bulkData,
    setBulkData,
  } = usePostsStore();

  const [bulkDeletePosts, { isLoading }] =
    useBulkDeletePostsMutation();

  const handleBulkDelete = async () => {
    if (!bulkData?.length) return;
    try {
      const ids = bulkData.map((item) => item._id);
      await bulkDeletePosts({ ids }).unwrap();

      toggleBulkDeleteModal(false);
      setBulkData([]);
      handleSuccess('Delete Successful');
    } catch (error) {
      console.error('Failed to delete posts:', error);
      handleError('Failed to delete items. Please try again.');
    }
  };

  return (
    <Dialog open={isBulkDeleteModalOpen} onOpenChange={toggleBulkDeleteModal}>
      <DialogContent
        className="sm:max-w-md rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl text-white"
      >
        <DialogHeader>
          <DialogTitle className="text-white bg-clip-text bg-gradient-to-r from-white to-red-200">
            Confirm Deletion
          </DialogTitle>
        </DialogHeader>

        {bulkData?.length > 0 && (
          <p className="text-white/80 mt-2">
            You are deleting&nbsp;
            <strong>({bulkData.length})</strong> posts.
          </p>
        )}

        <ScrollArea className="h-[420px] w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-md p-4 mt-3">
          <div className="flex flex-col gap-2">
            {bulkData.map((item, idx) => (
              <span
                key={(item._id as string) + idx}
                className="text-sm text-white/90"
              >
                {idx + 1}. {String(item['title'] || '')}
              </span>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 mt-3">
          <Button
            variant="outlineWater"
            size="sm"
            onClick={() => toggleBulkDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="outlineFire"
            size="sm"
            disabled={isLoading}
            onClick={handleBulkDelete}
          >
            {isLoading ? 'Deleting…' : 'Delete Selected'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkDeleteNextComponents;