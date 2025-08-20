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

import { IELTScourse } from '../api/v1/model';
import { useCoursesStore } from '../store/Store';
import { coursesSelectorArr } from '../store/StoreConstants';
import { useBulkUpdateCoursesMutation } from '../redux/rtk-Api';

import { handleSuccess } from './utils';

const BulkEditNextComponents: React.FC = () => {
  const { isBulkEditModalOpen, toggleBulkEditModal, bulkData, setBulkData } = useCoursesStore();
  const [bulkUpdateCourses, { isLoading }] = useBulkUpdateCoursesMutation();

  const handleBulkEditCourses = async () => {
    if (!bulkData.length) return;
    try {
      const newBulkData = bulkData.map(({ _id, ...rest }) => ({
        id: _id,
        updateData: rest,
      }));
      await bulkUpdateCourses(newBulkData).unwrap();
      toggleBulkEditModal(false);
      setBulkData([]);
      handleSuccess('Edit Successful');
    } catch (error) {
      console.error('Failed to edit courses:', error);
    }
  };

  const handleRoleChange = (CoursesId: string, status: string) => {
    setBulkData(bulkData.map(Courses => (Courses._id === CoursesId ? { ...Courses, status } : Courses)) as IELTScourse[]);
  };

  return (
    <Dialog open={isBulkEditModalOpen} onOpenChange={toggleBulkEditModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Update</DialogTitle>
        </DialogHeader>
        {bulkData.length > 0 && (
          <p className="pt-4">
            You are about to update <span className="font-semibold">({bulkData.length})</span> Courses
          </p>
        )}
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="flex flex-col gap-2">
            {bulkData.map((Courses, idx) => (
              <div key={(Courses._id as string) || idx} className="flex items-center justify-between">
                <span>
                  {idx + 1}. {(Courses.name as string) || ''}
                </span>
                <div className="flex items-center gap-4 min-w-[180px]">
                  <Label htmlFor="edit-role">Public Status</Label>
                  <Select onValueChange={role => handleRoleChange(Courses._id as string, role)} defaultValue={(Courses.name as string) || ''}>
                    <SelectTrigger className="bg-slate-50">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-50">
                      {coursesSelectorArr?.map((role, index) => (
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
            onClick={handleBulkEditCourses}
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
