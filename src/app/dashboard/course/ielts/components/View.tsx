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

import { IELTScourse } from '../api/v1/model';

import { useCoursesStore } from '../store/Store';
import { useGetCoursesByIdQuery } from '../redux/rtk-Api';

const ViewCourse: React.FC = () => {
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

  const formatDate = (date?: Date | string) => (date ? format(new Date(date), 'MMM dd, yyyy') : 'N/A');

  const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b">
      <div className="font-semibold text-right pr-4">{label}:</div>
      <div className="col-span-2 break-words">{value || 'N/A'}</div>
    </div>
  );

  const LinkRow: React.FC<{ label: string; href?: string }> = ({ label, href }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b">
      <div className="font-semibold text-right pr-4">{label}:</div>
      <div className="col-span-2 break-all">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {href}
          </a>
        ) : (
          'N/A'
        )}
      </div>
    </div>
  );

  const handleClose = () => {
    toggleViewModal(false);
    setSelectedCourses(null as unknown as IELTScourse);
  };

  return (
    <Dialog open={isViewModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Course Details</DialogTitle>
        </DialogHeader>
        {selectedCourses && (
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <div className="w-full flex flex-col gap-2">
              <DetailRow label="Lecture Title" value={selectedCourses.lectureTitle} />
              <DetailRow label="Lecture No" value={selectedCourses.lectureNo} />
              <DetailRow label="Class Duration" value={selectedCourses.classDuration} />
              <LinkRow label="PDF" href={selectedCourses.pdf} />
              <LinkRow label="Word File" href={selectedCourses.wordFile} />
              <LinkRow label="Video Link" href={selectedCourses.videoLink} />
              <DetailRow label="Short Description" value={<div className="whitespace-pre-wrap">{selectedCourses.shortDescription}</div>} />
              <DetailRow label="Summery" value={<div className="whitespace-pre-wrap">{selectedCourses.summery}</div>} />
              <DetailRow label="Details" value={<div className="whitespace-pre-wrap">{selectedCourses.details}</div>} />
              <DetailRow label="Note" value={<div className="whitespace-pre-wrap">{selectedCourses.note}</div>} />
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

export default ViewCourse;
