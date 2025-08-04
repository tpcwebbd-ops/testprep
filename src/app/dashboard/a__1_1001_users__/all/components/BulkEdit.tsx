/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import React from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { IUsers_1_000___ } from '../api/v1/Model';
import { useUsers_1_000___Store } from '../store/Store';
import { users_2_000___SelectorArr } from '../store/StoreConstants';
import { useBulkUpdateUsers_1_000___Mutation } from '../redux/rtk-Api';

import { handleSuccess } from './utils';

const BulkEditNextComponents: React.FC = () => {
  const { isBulkEditModalOpen, toggleBulkEditModal, bulkData, setBulkData } = useUsers_1_000___Store();
  const [bulkUpdateUsers_1_000___, { isLoading }] = useBulkUpdateUsers_1_000___Mutation();

  const handleBulkEditUsers_1_000___ = async () => {
    if (!bulkData.length) return;
    try {
      const newBulkData = bulkData.map(({ _id, ...rest }) => ({ id: _id, updateData: rest }));
      await bulkUpdateUsers_1_000___(newBulkData).unwrap();
      toggleBulkEditModal(false);
      setBulkData([]);
      handleSuccess('Edit Successful');
    } catch (error) {
      console.error('Failed to edit users_2_000___:', error);
    }
  };

  const handleRoleChange = (Users_1_000___Id: string, role: string) => {
    setBulkData(bulkData.map(Users_1_000___ => (Users_1_000___._id === Users_1_000___Id ? { ...Users_1_000___, role } : Users_1_000___)) as IUsers_1_000___[]);
  };

  return (
    <Dialog open={isBulkEditModalOpen} onOpenChange={toggleBulkEditModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Update</DialogTitle>
        </DialogHeader>
        {bulkData.length > 0 && (
          <p className="pt-4">
            You are about to update <span className="font-semibold">({bulkData.length})</span> users_1_000___
          </p>
        )}
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="flex flex-col gap-2">
            {bulkData.map((Users_1_000___, idx) => (
              <div key={(Users_1_000___._id as string) || idx} className="flex items-center justify-between">
                <span>
                  {idx + 1}. {(Users_1_000___.name as string) || ''}
                </span>
                <div className="flex items-center gap-4 min-w-[180px]">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select onValueChange={role => handleRoleChange(Users_1_000___._id as string, role)} defaultValue={(Users_1_000___.role as string) || ''}>
                    <SelectTrigger className="bg-slate-50">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-50">
                      {users_2_000___SelectorArr?.map((role, index) => (
                        <SelectItem key={role + index} value={role} className="cursor-pointer hover:bg-slate-200">
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
            onClick={handleBulkEditUsers_1_000___}
            className="text-green-400 hover:text-green-500 cursor-pointer bg-green-100 hover:bg-green-200 border-1 border-green-300 hover:border-green-400"
          >
            Update Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkEditNextComponents;
