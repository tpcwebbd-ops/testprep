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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useCoursesStore } from '../store/Store';
import { useAddSpokenLecturesMutation } from '../redux/rtk-Api';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';
import { SpokenCourse } from '../api/v1/model';

const AddCourse: React.FC = () => {
  const { toggleAddModal, isAddModalOpen, setCourses, courses } = useCoursesStore();
  const [addCourse, { isLoading }] = useAddSpokenLecturesMutation();

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
  const [status, setStatus] = useState<'Pending' | 'Private' | 'Public'>('Pending');

  const resetForm = () => {
    setLectureTitle('');
    setLectureNo('');
    setPdf('');
    setWordFile('');
    setVideoLink('');
    setShortDescription('');
    setSummery('');
    setDetails('');
    setNote('');
    setClassDuration('');
    setStatus('Pending');
  };

  const handleAddCourse = async () => {
    const courseData = {
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
      status,
    };

    try {
      const newCourse = (await addCourse(courseData).unwrap()) as SpokenCourse;
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
            {/* Form Fields */}
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="lectureTitle" className="text-right">
                Lecture Title
              </Label>
              <Input id="lectureTitle" value={lectureTitle} onChange={e => setLectureTitle(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="lectureNo" className="text-right">
                Lecture No
              </Label>
              <Input
                id="lectureNo"
                type="number"
                value={lectureNo}
                onChange={e => setLectureNo(e.target.value === '' ? '' : Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="classDuration" className="text-right">
                Class Duration
              </Label>
              <Input id="classDuration" value={classDuration} onChange={e => setClassDuration(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select onValueChange={(value: 'Pending' | 'Private' | 'Public') => setStatus(value)} defaultValue={status}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="pdf" className="text-right">
                PDF Link
              </Label>
              <Input id="pdf" value={pdf} onChange={e => setPdf(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="wordFile" className="text-right">
                Word File Link
              </Label>
              <Input id="wordFile" value={wordFile} onChange={e => setWordFile(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="videoLink" className="text-right">
                Video Link
              </Label>
              <Input id="videoLink" value={videoLink} onChange={e => setVideoLink(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="shortDescription" className="text-right pt-2">
                Short Description
              </Label>
              <Textarea id="shortDescription" value={shortDescription} onChange={e => setShortDescription(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="summery" className="text-right pt-2">
                Summery
              </Label>
              <Textarea id="summery" value={summery} onChange={e => setSummery(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="details" className="text-right pt-2">
                Details
              </Label>
              <Textarea id="details" value={details} onChange={e => setDetails(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="note" className="text-right pt-2">
                Note
              </Label>
              <Textarea id="note" value={note} onChange={e => setNote(e.target.value)} className="col-span-3" />
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
