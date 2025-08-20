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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useCoursesStore } from '../store/Store';
import { useUpdateCoursesMutation } from '../redux/rtk-Api';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';
import { IELTScourse } from '../api/v1/model';

const EditCourse: React.FC = () => {
  const { toggleEditModal, isEditModalOpen, selectedCourses, setSelectedCourses } = useCoursesStore();
  const [updateCourse, { isLoading }] = useUpdateCoursesMutation();

  // State updated to match the new IELTScourse model
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureNo, setLectureNo] = useState<number | ''>('');
  const [pdf, setPdf] = useState('');
  const [wordFile, setWordFile] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [summery, setSummery] = useState('');
  const [details, setDetails] = useState('');
  const [note, setNote] = useState('');
  const [classDuration, setClassDuration] = useState('');

  useEffect(() => {
    if (selectedCourses) {
      setLectureTitle(selectedCourses.lectureTitle || '');
      setLectureNo(selectedCourses.lectureNo || '');
      setPdf(selectedCourses.pdf || '');
      setWordFile(selectedCourses.wordFile || '');
      setVideoLink(selectedCourses.videoLink || '');
      setShortDescription(selectedCourses.shortDescription || '');
      setSummery(selectedCourses.summery || '');
      setDetails(selectedCourses.details || '');
      setNote(selectedCourses.note || '');
      setClassDuration(selectedCourses.classDuration || '');
    }
  }, [selectedCourses]);

  const handleUpdateCourse = async () => {
    if (!selectedCourses) return;

    const updatedData = {
      lectureTitle,
      lectureNo: Number(lectureNo),
      pdf,
      wordFile,
      videoLink,
      shortDescription,
      summery,
      details,
      note,
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
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="edit-lectureTitle" className="text-right">
                Lecture Title
              </Label>
              <Input id="edit-lectureTitle" value={lectureTitle} onChange={e => setLectureTitle(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="edit-lectureNo" className="text-right">
                Lecture No
              </Label>
              <Input
                id="edit-lectureNo"
                type="number"
                value={lectureNo}
                onChange={e => setLectureNo(e.target.value === '' ? '' : Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="edit-classDuration" className="text-right">
                Class Duration
              </Label>
              <Input id="edit-classDuration" value={classDuration} onChange={e => setClassDuration(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="edit-pdf" className="text-right">
                PDF Link
              </Label>
              <Input id="edit-pdf" value={pdf} onChange={e => setPdf(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="edit-wordFile" className="text-right">
                Word File Link
              </Label>
              <Input id="edit-wordFile" value={wordFile} onChange={e => setWordFile(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="edit-videoLink" className="text-right">
                Video Link
              </Label>
              <Input id="edit-videoLink" value={videoLink} onChange={e => setVideoLink(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="edit-shortDescription" className="text-right pt-2">
                Short Description
              </Label>
              <Textarea id="edit-shortDescription" value={shortDescription} onChange={e => setShortDescription(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="edit-summery" className="text-right pt-2">
                Summery
              </Label>
              <Textarea id="edit-summery" value={summery} onChange={e => setSummery(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="edit-details" className="text-right pt-2">
                Details
              </Label>
              <Textarea id="edit-details" value={details} onChange={e => setDetails(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="edit-note" className="text-right pt-2">
                Note
              </Label>
              <Textarea id="edit-note" value={note} onChange={e => setNote(e.target.value)} className="col-span-3" />
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
