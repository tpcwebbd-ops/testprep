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
import { ICourses } from '../api/v1/model';

const EditCourse: React.FC = () => {
  const { toggleEditModal, isEditModalOpen, selectedCourses, setSelectedCourses } = useCoursesStore();
  const [updateCourse, { isLoading }] = useUpdateCoursesMutation();

  const [name, setName] = useState('');
  const [pdf, setPdf] = useState('');
  const [wordFile, setWordFile] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (selectedCourses) {
      setName(selectedCourses.name || '');
      setPdf(selectedCourses.pdf || '');
      setWordFile(selectedCourses.wordFile || '');
      setVideoLink(selectedCourses.videoLink || '');
      setDescription(selectedCourses.description || '');
    }
  }, [selectedCourses]);

  const handleUpdateCourse = async () => {
    if (!selectedCourses) return;

    const updatedData = {
      name,
      pdf,
      wordFile,
      videoLink,
      description,
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
    setSelectedCourses(null as unknown as ICourses);
  };

  return (
    <Dialog open={isEditModalOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input id="edit-name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
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
              <Label htmlFor="edit-description" className="text-right pt-2">
                Description
              </Label>
              <Textarea id="edit-description" value={description} onChange={e => setDescription(e.target.value)} className="col-span-3" />
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
