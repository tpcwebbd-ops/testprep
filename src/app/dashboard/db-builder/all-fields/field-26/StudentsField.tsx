'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { createStudentId, StudentValue } from './students-utils';

interface StudentsFieldProps {
  value: StudentValue[];
  onChange: (newValue: StudentValue[]) => void;
}

const StudentsField = ({ value, onChange }: StudentsFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editList, setEditList] = useState<StudentValue[]>(value);

  useEffect(() => {
    setEditList(value);
  }, [value]);

  const handleNameChange = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const nextName = e.target.value;
    setEditList(prev => prev.map(item => (item._id === id ? { ...item, Name: nextName } : item)));
  };

  const handleClassChange = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const nextClass = e.target.value;
    setEditList(prev => prev.map(item => (item._id === id ? { ...item, Class: nextClass } : item)));
  };

  const handleRollChange = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const nextRoll = parseInt(e.target.value, 10);
    setEditList(prev => prev.map(item => (item._id === id ? { ...item, Roll: Number.isNaN(nextRoll) ? 0 : nextRoll } : item)));
  };

  const handleAddListItem = () => {
    setEditList(prev => [
      ...prev,
      {
        _id: createStudentId(),
        Name: '',
        Class: '',
        Roll: 0,
      },
    ]);
  };

  const handleDeleteListItem = (id: string) => {
    setEditList(prev => prev.filter(item => item._id !== id));
  };

  const handleSubmit = () => {
    onChange(editList);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditList(value);
    setIsEditing(false);
  };

  return (
    <div className="flex w-full flex-col items-center rounded-xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-xl">
      <h2 className="mb-3 text-center text-lg font-semibold text-white drop-shadow-sm md:text-xl">Students List</h2>

      {!isEditing && (
        <div className="w-full space-y-3">
          {value.length === 0 ? (
            <p className="text-center text-sm text-white/60">Nothing found.</p>
          ) : (
            value.map(item => (
              <div key={item._id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/10 p-3 shadow-md backdrop-blur-lg">
                <span className="text-sm text-white">{item.Name || 'Untitled'}</span>
                <span className="text-sm text-white/70">
                  Class: {item.Class || '-'} | Roll: {item.Roll || '-'}
                </span>
              </div>
            ))
          )}

          <div className="flex w-full items-center justify-center">
            <Button variant="outlineGarden" onClick={() => setIsEditing(true)} size="sm">
              Update
            </Button>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="mt-2 flex w-full flex-col gap-3">
          {editList.length === 0 && <p className="text-center text-sm text-white/60">No students yet - add some below.</p>}

          {editList.map(item => (
            <div key={item._id} className="flex flex-col items-center gap-2 rounded-lg border border-white/20 bg-white/10 p-3 shadow-md backdrop-blur-xl sm:flex-row">
              <Input type="text" value={item.Name} onChange={e => handleNameChange(item._id!, e)} placeholder="Student Name" />
              <Input type="text" value={item.Class} onChange={e => handleClassChange(item._id!, e)} placeholder="Class" />
              <Input type="number" value={item.Roll} onChange={e => handleRollChange(item._id!, e)} placeholder="Roll" />
              <FaTrash size={14} onClick={() => handleDeleteListItem(item._id!)} className="min-w-3 cursor-pointer text-rose-400 duration-300 hover:text-rose-300" />
            </div>
          ))}

          <div className="mt-2 flex gap-2">
            <Button variant="outlineWater" onClick={handleAddListItem} size="sm">
              + Add
            </Button>
            <Button variant="outlineWater" onClick={handleSubmit} size="sm">
              Submit
            </Button>
            <Button variant="outlineFire" onClick={handleCancel} size="sm" className="text-white">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsField;
