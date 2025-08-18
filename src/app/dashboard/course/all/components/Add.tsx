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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

import { useCoursesStore } from '../store/Store';
import { useAddCoursesMutation } from '../redux/rtk-Api';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';
import { ICourses } from '../api/v1/model';

// A reusable component for handling string array inputs
const MultiInputField: React.FC<{
  label: string;
  values: string[];
  setValues: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ label, values, setValues }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = () => {
    if (inputValue.trim() !== '' && !values.includes(inputValue.trim())) {
      setValues([...values, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    setValues(values.filter(item => item !== itemToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div className="grid grid-cols-4 items-start gap-4 pr-1">
      <Label htmlFor={label} className="text-right pt-2">
        {label}
      </Label>
      <div className="col-span-3">
        <div className="flex gap-2">
          <Input
            id={label}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Enter a ${label.slice(0, -1).toLowerCase()}`}
          />
          <Button type="button" onClick={handleAddItem}>
            Add
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {values.map((item, index) => (
            <div key={index} className="flex items-center gap-1 bg-gray-200 rounded-md px-2 py-1 text-sm">
              <span>{item}</span>
              <X className="cursor-pointer h-4 w-4" onClick={() => handleRemoveItem(item)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AddCourseComponent: React.FC = () => {
  const { toggleAddModal, isAddModalOpen, setCourses, courses } = useCoursesStore();
  const [addCourse, { isLoading }] = useAddCoursesMutation();

  const [name, setName] = useState('');
  const [books, setBooks] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<string[]>([]);
  const [runningStudents, setRunningStudents] = useState<string[]>([]);

  const resetForm = () => {
    setName('');
    setBooks([]);
    setTopics([]);
    setEnrolledStudents([]);
    setRunningStudents([]);
  };

  const handleAddCourse = async () => {
    const courseData = {
      name,
      books,
      topics,
      enrolledStudents,
      runningStudents,
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

            <MultiInputField label="Books" values={books} setValues={setBooks} />
            <MultiInputField label="Topics" values={topics} setValues={setTopics} />
            <MultiInputField label="Enrolled Students" values={enrolledStudents} setValues={setEnrolledStudents} />
            <MultiInputField label="Running Students" values={runningStudents} setValues={setRunningStudents} />
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

export default AddCourseComponent;
