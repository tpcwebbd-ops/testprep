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

import { SpokenCourse } from '../api/v1/model';
import { useCoursesStore } from '../store/Store';
import { baseICourses } from '../store/StoreConstants';
import { useDeleteSpokenLecturesMutation } from '../redux/rtk-Api';

import { handleSuccess } from './utils';

const DeleteNextComponents: React.FC = () => {
  const { toggleDeleteModal, isDeleteModalOpen, selectedCourses, setSelectedCourses } = useCoursesStore();
  const [deleteCourses] = useDeleteSpokenLecturesMutation();

  const handleDeleteCourses = async () => {
    if (selectedCourses) {
      try {
        await deleteCourses({
          id: selectedCourses._id,
        }).unwrap();
        toggleDeleteModal(false);
        handleSuccess('Delete Successful');
      } catch (error) {
        console.error('Failed to delete Courses:', error);
      }
    }
  };

  const handleCancel = () => {
    toggleDeleteModal(false);
    setSelectedCourses({ ...baseICourses } as SpokenCourse);
  };

  const { lectureTitle = '' } = selectedCourses || {};

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        {selectedCourses && (
          <div className="py-4">
            <p>
              You are about to delete Courses: <span className="font-semibold">{(lectureTitle as string) || ''}</span>
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
            onClick={handleDeleteCourses}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNextComponents;
