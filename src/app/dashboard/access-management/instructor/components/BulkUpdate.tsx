import React from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { IUsers_access } from '../api/v1/model';
import { usersAccessSelectorArr } from '../store/StoreConstants';

import { useUsersAccessStore } from '../store/Store';
import { useBulkUpdateUsers_instructor_accessMutation } from '../redux/rtk-Api';

import { handleSuccess, handleError } from './utils';

const BulkUpdateNextComponents: React.FC = () => {
  const { toggleBulkUpdateModal, isBulkUpdateModalOpen, bulkData, setBulkData } = useUsersAccessStore();

  const [bulkUpdateAccesses, { isLoading }] = useBulkUpdateUsers_instructor_accessMutation();

  const handleBulkUpdate = async () => {
    if (!bulkData.length) return;
    try {
      const newBulkData = bulkData.map(({ _id, ...rest }) => ({
        id: _id,
        updateData: rest,
      }));
      console.log('newBulkData', newBulkData);
      await bulkUpdateAccesses(newBulkData).unwrap();
      toggleBulkUpdateModal(false);
      setBulkData([]);
      handleSuccess('Update Successful');
    } catch (error) {
      console.error('Failed to edit accessess:', error);
      handleError('Failed to update items. Please try again.');
    }
  };

  const handleFieldChangeForAll = (value: string) => {
    setBulkData(
      bulkData.map(access => ({
        ...access,
        ['role']: value,
      })) as IUsers_access[],
    );
  };

  return (
    <Dialog open={isBulkUpdateModalOpen} onOpenChange={toggleBulkUpdateModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Bulk Update</DialogTitle>
        </DialogHeader>
        {bulkData.length > 0 && (
          <div>
            <p className="pt-2">
              You are about to update <span className="font-semibold">({bulkData.length})</span> accessess.
            </p>
            <div className="w-full flex items-center justify-between pt-2">
              <p>
                Set all <span className="font-semibold">Role</span> to
              </p>
              <Select onValueChange={value => handleFieldChangeForAll(value)} defaultValue={(usersAccessSelectorArr[0] as string) || ''}>
                <SelectTrigger className="bg-slate-50 w-[180px]">
                  <SelectValue placeholder="Select a value" />
                </SelectTrigger>
                <SelectContent className="bg-slate-50">
                  {usersAccessSelectorArr?.map((option: string, index: number) => (
                    <SelectItem key={option + index} value={option} className="cursor-pointer hover:bg-slate-200">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="flex flex-col gap-2">
            {bulkData.map((access, idx) => (
              <div key={(access._id as string) || idx} className="flex items-center justify-between">
                <span>
                  {idx + 1}. {(access as IUsers_access)?.name || ''}
                </span>
                <span className="text-blue-500">{access['role'] as string}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => toggleBulkUpdateModal(false)} className="cursor-pointer border-slate-400 hover:border-slate-500">
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            variant="outline"
            onClick={handleBulkUpdate}
            className="text-green-500 hover:text-green-600 cursor-pointer bg-green-100 hover:bg-green-200 border border-green-300 hover:border-green-400"
          >
            {isLoading ? 'Updating...' : 'Update Selected'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUpdateNextComponents;
