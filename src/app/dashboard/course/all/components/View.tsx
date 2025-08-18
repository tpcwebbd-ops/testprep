/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { format } from 'date-fns';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { ICourses } from '../api/v1/model';
import { useCoursesStore } from '../store/Store';
import { useGetCoursesByIdQuery } from '../redux/rtk-Api';

const ViewCourseComponent: React.FC = () => {
  const { isViewModalOpen, selectedCourses, toggleViewModal, setSelectedCourses } = useCoursesStore();
  const { data: courseData, refetch } = useGetCoursesByIdQuery(selectedCourses?._id, { skip: !selectedCourses?._id });

  useEffect(() => {
    if (selectedCourses?._id) {
      refetch(); // Fetch the latest course data
    }
  }, [selectedCourses?._id, refetch]);

  useEffect(() => {
    if (courseData?.data) {
      setSelectedCourses(courseData.data); // Update selectedCourses with the latest data
    }
  }, [courseData, setSelectedCourses]);

  const formatDate = (date?: Date) => (date ? format(new Date(date), 'MMM dd, yyyy') : 'N/A');

  const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-2 py-1 border-b">
      <div className="font-semibold text-right pr-4">{label}:</div>
      <div className="col-span-2">{value || 'N/A'}</div>
    </div>
  );

  const DetailRowArray: React.FC<{ label: string; values?: string[] }> = ({ label, values }) => (
    <div className="grid grid-cols-3 gap-2 py-1 border-b">
      <div className="font-semibold text-right pr-4">{label}:</div>
      <div className="col-span-2">
        {values && values.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {values.map((item, index) => (
              <span key={index} className="bg-gray-200 rounded-md px-2 py-1 text-sm">
                {item}
              </span>
            ))}
          </div>
        ) : (
          'N/A'
        )}
      </div>
    </div>
  );

  const handleClose = () => {
    toggleViewModal(false);
    setSelectedCourses(null as unknown as ICourses);
  };

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Course Details</DialogTitle>
        </DialogHeader>
        {selectedCourses && (
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="w-full flex flex-col gap-2">
              <DetailRow label="Name" value={selectedCourses.name} />
              <DetailRowArray label="Books" values={selectedCourses.books} />
              <DetailRowArray label="Topics" values={selectedCourses.topics} />
              <DetailRowArray label="Enrolled Students" values={selectedCourses.enrolledStudents} />
              <DetailRowArray label="Running Students" values={selectedCourses.runningStudents} />
              <DetailRow label="Created At" value={formatDate(selectedCourses.createdAt)} />
              <DetailRow label="Updated At" value={formatDate(selectedCourses.updatedAt)} />
            </div>
          </ScrollArea>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCourseComponent;
