/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import React, { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useCoursesStore } from '../store/Store';
import { useAddCoursesMutation } from '../redux/rtk-Api';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';
import { IELTScourse } from '../api/v1/model';

const AddCourse: React.FC = () => {
  const { toggleAddModal, isAddModalOpen, setCourses, courses } = useCoursesStore();
  const [addCourse, { isLoading }] = useAddCoursesMutation();

  // Expanded state to match the IELTScourse model
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureNo, setLectureNo] = useState<number>(0);
  const [pdf, setPdf] = useState('');
  const [wordFile, setWordFile] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [enrollmentStatus, setEnrollmentStatus] = useState(false);
  const [enrollmentStateDate, setEnrollmentStateDate] = useState('');
  const [enrollmentEndDate, setEnrollmentEndDate] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [numberOfClass, setNumberOfClass] = useState<number>(0);
  const [classDuration, setClassDuration] = useState('');

  const resetForm = () => {
    setLectureTitle('');
    setLectureNo(0);
    setPdf('');
    setWordFile('');
    setVideoLink('');
    setDescription('');
    setDetails('');
    setEnrollmentStatus(false);
    setEnrollmentStateDate('');
    setEnrollmentEndDate('');
    setPrice(0);
    setNumberOfClass(0);
    setClassDuration('');
  };

  const handleAddCourse = async () => {
    const courseData = {
      lectureTitle,
      lectureNo,
      pdf,
      wordFile,
      videoLink,
      description,
      details,
      enrollmentStatus,
      enrollmentStateDate: enrollmentStateDate ? new Date(enrollmentStateDate) : undefined,
      enrollmentEndDate: enrollmentEndDate ? new Date(enrollmentEndDate) : undefined,
      price,
      numberOfClass,
      classDuration,
    };

    try {
      const newCourse = (await addCourse(courseData).unwrap()) as IELTScourse;
      setCourses([newCourse, ...courses]);
      toggleAddModal(false);
      resetForm();
      handleSuccess('Course added successfully');
    } catch (error: unknown) {
      console.error(error);
      let errMessage: string = 'An unknown error occurred.';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message) || 'API error.';
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      handleError(errMessage);
    }
  };

  return (
    <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Lecture</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <div className="grid gap-4 py-4">
            {/* Lecture Title */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="lectureTitle" className="text-right">
                Lecture Title
              </Label>
              <Input id="lectureTitle" value={lectureTitle} onChange={e => setLectureTitle(e.target.value)} className="col-span-3" />
            </div>

            {/* Lecture No */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="lectureNo" className="text-right">
                Lecture No
              </Label>
              <Input id="lectureNo" type="number" value={lectureNo} onChange={e => setLectureNo(Number(e.target.value))} className="col-span-3" />
            </div>

            {/* Price */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input id="price" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="col-span-3" />
            </div>

            {/* Number of Classes */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="numberOfClass" className="text-right">
                Number of Classes
              </Label>
              <Input id="numberOfClass" type="number" value={numberOfClass} onChange={e => setNumberOfClass(Number(e.target.value))} className="col-span-3" />
            </div>

            {/* Class Duration */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="classDuration" className="text-right">
                Class Duration
              </Label>
              <Input id="classDuration" value={classDuration} onChange={e => setClassDuration(e.target.value)} className="col-span-3" />
            </div>

            {/* PDF Link */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="pdf" className="text-right">
                PDF Link
              </Label>
              <Input id="pdf" value={pdf} onChange={e => setPdf(e.target.value)} className="col-span-3" />
            </div>

            {/* Word File Link */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="wordFile" className="text-right">
                Word File Link
              </Label>
              <Input id="wordFile" value={wordFile} onChange={e => setWordFile(e.target.value)} className="col-span-3" />
            </div>

            {/* Video Link */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="videoLink" className="text-right">
                Video Link
              </Label>
              <Input id="videoLink" value={videoLink} onChange={e => setVideoLink(e.target.value)} className="col-span-3" />
            </div>

            {/* Enrollment Start Date */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="enrollmentStateDate" className="text-right">
                Enrollment Start
              </Label>
              <Input
                id="enrollmentStateDate"
                type="date"
                value={enrollmentStateDate}
                onChange={e => setEnrollmentStateDate(e.target.value)}
                className="col-span-3"
              />
            </div>

            {/* Enrollment End Date */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="enrollmentEndDate" className="text-right">
                Enrollment End
              </Label>
              <Input id="enrollmentEndDate" type="date" value={enrollmentEndDate} onChange={e => setEnrollmentEndDate(e.target.value)} className="col-span-3" />
            </div>

            {/* Description */}
            <div className="grid grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className="col-span-3" />
            </div>

            {/* Details */}
            <div className="grid grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="details" className="text-right pt-2">
                Details
              </Label>
              <Textarea id="details" value={details} onChange={e => setDetails(e.target.value)} className="col-span-3" />
            </div>

            {/* Enrollment Status */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="enrollmentStatus" className="text-right">
                Enrollment Active
              </Label>
              <div className="col-span-3 flex items-center">
                <Checkbox id="enrollmentStatus" checked={enrollmentStatus} onCheckedChange={checked => setEnrollmentStatus(Boolean(checked))} />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => toggleAddModal(false)}>
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleAddCourse}>
            {isLoading ? 'Adding...' : 'Add Course'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourse;
