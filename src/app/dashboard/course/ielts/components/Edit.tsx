/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useCoursesStore } from '../store/Store';
import { useUpdateCoursesMutation } from '../redux/rtk-Api';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';
import { IELTScourse } from '../api/v1/model';

// Helper function to format date for input[type="date"]
const formatDateForInput = (date: Date | string | undefined): string => {
  if (!date) return '';
  try {
    return new Date(date).toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
};

const EditCourse: React.FC = () => {
  const { toggleEditModal, isEditModalOpen, selectedCourses, setSelectedCourses } = useCoursesStore();
  const [updateCourse, { isLoading }] = useUpdateCoursesMutation();

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

  useEffect(() => {
    if (selectedCourses) {
      setLectureTitle(selectedCourses.lectureTitle || '');
      setLectureNo(selectedCourses.lectureNo || 0);
      setPdf(selectedCourses.pdf || '');
      setWordFile(selectedCourses.wordFile || '');
      setVideoLink(selectedCourses.videoLink || '');
      setDescription(selectedCourses.description || '');
      setDetails(selectedCourses.details || '');
      setEnrollmentStatus(selectedCourses.enrollmentStatus || false);
      setEnrollmentStateDate(formatDateForInput(selectedCourses.enrollmentStateDate));
      setEnrollmentEndDate(formatDateForInput(selectedCourses.enrollmentEndDate));
      setPrice(selectedCourses.price || 0);
      setNumberOfClass(selectedCourses.numberOfClass || 0);
      setClassDuration(selectedCourses.classDuration || '');
    }
  }, [selectedCourses]);

  const handleUpdateCourse = async () => {
    if (!selectedCourses) return;

    const updatedData = {
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
      await updateCourse({ id: selectedCourses._id, ...updatedData }).unwrap();
      toggleEditModal(false);
      handleSuccess('Update Successful');
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

  const handleCancel = () => {
    toggleEditModal(false);
    setSelectedCourses(null as unknown as IELTScourse);
  };

  return (
    <Dialog open={isEditModalOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <div className="grid gap-4 py-4">
            {/* Lecture Title */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="edit-lectureTitle" className="text-right">
                Lecture Title
              </Label>
              <Input id="edit-lectureTitle" value={lectureTitle} onChange={e => setLectureTitle(e.target.value)} className="col-span-3" />
            </div>

            {/* Lecture No */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="edit-lectureNo" className="text-right">
                Lecture No
              </Label>
              <Input id="edit-lectureNo" type="number" value={lectureNo} onChange={e => setLectureNo(Number(e.target.value))} className="col-span-3" />
            </div>

            {/* Price */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="edit-price" className="text-right">
                Price
              </Label>
              <Input id="edit-price" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="col-span-3" />
            </div>

            {/* Number of Classes */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="edit-numberOfClass" className="text-right">
                Number of Classes
              </Label>
              <Input
                id="edit-numberOfClass"
                type="number"
                value={numberOfClass}
                onChange={e => setNumberOfClass(Number(e.target.value))}
                className="col-span-3"
              />
            </div>

            {/* Class Duration */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="edit-classDuration" className="text-right">
                Class Duration
              </Label>
              <Input id="edit-classDuration" value={classDuration} onChange={e => setClassDuration(e.target.value)} className="col-span-3" />
            </div>

            {/* PDF Link */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="edit-pdf" className="text-right">
                PDF Link
              </Label>
              <Input id="edit-pdf" value={pdf} onChange={e => setPdf(e.target.value)} className="col-span-3" />
            </div>

            {/* Word File Link */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="edit-wordFile" className="text-right">
                Word File Link
              </Label>
              <Input id="edit-wordFile" value={wordFile} onChange={e => setWordFile(e.target.value)} className="col-span-3" />
            </div>

            {/* Video Link */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="edit-videoLink" className="text-right">
                Video Link
              </Label>
              <Input id="edit-videoLink" value={videoLink} onChange={e => setVideoLink(e.target.value)} className="col-span-3" />
            </div>

            {/* Enrollment Start Date */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="edit-enrollmentStateDate" className="text-right">
                Enrollment Start
              </Label>
              <Input
                id="edit-enrollmentStateDate"
                type="date"
                value={enrollmentStateDate}
                onChange={e => setEnrollmentStateDate(e.target.value)}
                className="col-span-3"
              />
            </div>

            {/* Enrollment End Date */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="edit-enrollmentEndDate" className="text-right">
                Enrollment End
              </Label>
              <Input
                id="edit-enrollmentEndDate"
                type="date"
                value={enrollmentEndDate}
                onChange={e => setEnrollmentEndDate(e.target.value)}
                className="col-span-3"
              />
            </div>

            {/* Description */}
            <div className="grid grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="edit-description" className="text-right pt-2">
                Description
              </Label>
              <Textarea id="edit-description" value={description} onChange={e => setDescription(e.target.value)} className="col-span-3" />
            </div>

            {/* Details */}
            <div className="grid grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="edit-details" className="text-right pt-2">
                Details
              </Label>
              <Textarea id="edit-details" value={details} onChange={e => setDetails(e.target.value)} className="col-span-3" />
            </div>

            {/* Enrollment Status */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="edit-enrollmentStatus" className="text-right">
                Enrollment Active
              </Label>
              <div className="col-span-3 flex items-center">
                <Checkbox id="edit-enrollmentStatus" checked={enrollmentStatus} onCheckedChange={checked => setEnrollmentStatus(Boolean(checked))} />
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleUpdateCourse}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourse;
