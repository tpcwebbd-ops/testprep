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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useCoursesStore } from '../store/Store';
import { useAddCoursesMutation } from '../redux/rtk-Api';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';
import { ICourses } from '../api/v1/model';

const AddCourse: React.FC = () => {
  const { toggleAddModal, isAddModalOpen, setCourses, courses } = useCoursesStore();
  const [addCourse, { isLoading }] = useAddCoursesMutation();

  const [name, setName] = useState('');
  const [pdf, setPdf] = useState('');
  const [wordFile, setWordFile] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setName('');
    setPdf('');
    setWordFile('');
    setVideoLink('');
    setDescription('');
  };

  const handleAddCourse = async () => {
    const courseData = {
      name,
      pdf,
      wordFile,
      videoLink,
      description,
    };

    try {
      const newCourse = (await addCourse(courseData).unwrap()) as ICourses;
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
          <DialogTitle>Add New Course</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
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
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className="col-span-3" />
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
