'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { usePostsStore } from '../store/store';
import { useBulkUpdatePostsMutation } from '@/redux/features/posts/postsSlice';
import { handleSuccess, handleError } from './utils';

const BulkEditNextComponents: React.FC = () => {
  const { isBulkEditModalOpen, toggleBulkEditModal, bulkData, setBulkData } = usePostsStore();

  const [bulkUpdatePosts, { isLoading }] = useBulkUpdatePostsMutation();

  // Use current state directly (matches expected output)
  const handleFieldChange = (id: string, key: string, value: string) => {
    const updatedData = bulkData.map(item => (item._id === id ? { ...item, [key]: value } : item));
    setBulkData(updatedData);
  };

  const handleBulkEdit = async () => {
    if (!bulkData.length) return;
    try {
      const formatted = bulkData.map(({ _id, ...rest }) => ({
        id: _id,
        updateData: rest,
      }));
      await bulkUpdatePosts(formatted).unwrap();

      toggleBulkEditModal(false);
      setBulkData([]);
      handleSuccess('Bulk Update Successful');
    } catch (error) {
      console.error('Bulk Update Failed:', error);
      handleError('Failed to update selected items.');
    }
  };

  return (
    <Dialog open={isBulkEditModalOpen} onOpenChange={toggleBulkEditModal}>
      <DialogContent className="sm:max-w-xl rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl text-white">
        <DialogHeader>
          <DialogTitle className="bg-clip-text bg-gradient-to-r from-white to-blue-200 text-white">Bulk Edit Posts</DialogTitle>
        </DialogHeader>

        {bulkData.length > 0 && (
          <p className="text-white/80">
            Editing <strong>{bulkData.length}</strong> selected posts.
          </p>
        )}

        <ScrollArea className="h-[420px] w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-md p-4 mt-3">
          <div className="flex flex-col gap-3">
            {bulkData.map((item, idx) => (
              <div key={item._id || idx} className="p-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-lg flex flex-col gap-3">
                <span className="font-medium text-white">
                  {idx + 1}. {String(item['title'] || '')}
                </span>


                <div className="flex items-center gap-3">
                  <Label className="min-w-[120px] text-white">Area</Label>
                  <Select
                    onValueChange={v => handleFieldChange(item._id as string, 'area', v)}
                    defaultValue={String(item['area'] ?? '')}
                  >
                    <SelectTrigger className="w-[180px] bg-white/10 backdrop-blur-md border-white/30 text-white">
                      <SelectValue placeholder="Select…" />
                    </SelectTrigger>
                    <SelectContent className="border-white/20 bg-white/10 backdrop-blur-xl text-white">
                      <SelectItem value="Bangladesh">Bangladesh</SelectItem><SelectItem value="India">India</SelectItem><SelectItem value="Pakistan">Pakistan</SelectItem><SelectItem value="Canada">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3">
                  <Label className="min-w-[120px] text-white">Shift</Label>
                  <Select
                    onValueChange={v => handleFieldChange(item._id as string, 'shift', v)}
                    defaultValue={String(item['shift'] ?? '')}
                  >
                    <SelectTrigger className="w-[180px] bg-white/10 backdrop-blur-md border-white/30 text-white">
                      <SelectValue placeholder="Select…" />
                    </SelectTrigger>
                    <SelectContent className="border-white/20 bg-white/10 backdrop-blur-xl text-white">
                      <SelectItem value="OP 1">OP 1</SelectItem><SelectItem value="OP 2">OP 2</SelectItem><SelectItem value="OP 3">OP 3</SelectItem><SelectItem value="OP 4">OP 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outlineWater" size="sm" onClick={() => toggleBulkEditModal(false)}>
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleBulkEdit} variant="outlineWater" size="sm">
            {isLoading ? 'Updating…' : 'Update Selected'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkEditNextComponents;