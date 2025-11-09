// components/section-card.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { GripVertical, Trash2, Edit } from 'lucide-react';
import { SectionData } from '../../section/data';
import { useSectionStore } from '../store/section-store';

interface SectionCardProps {
  section: SectionData;
}

export const SectionCard = ({ section }: SectionCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { removeSection, toggleActive } = useSectionStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = () => {
    removeSection(section.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="group h-[300px] flex overflow-hidden rounded-xl border border-white/20 bg-transparent backdrop-blur-md shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="w-[70%] relative h-full overflow-hidden">
          <Image src={section.picture} alt={section.title} className="object-cover w-full h-full" width={1200} height={1200} />
        </div>

        <div className="w-[30%] flex flex-col p-4 bg-transparent backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2 mb-4">
            <button
              className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-white/10 rounded-md transition-colors flex-shrink-0"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4 text-white/70" />
            </button>
            <Switch checked={section.isActive} onCheckedChange={() => toggleActive(section.id)} className="flex-shrink-0" />
          </div>

          <h3 className="font-semibold text-sm mb-2 line-clamp-3 text-white">{section.title}</h3>

          <div className="flex-1" />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${section.isActive ? 'bg-green-500' : 'bg-white/30'}`} />
              <span className={`text-xs font-medium ${section.isActive ? 'text-green-400' : 'text-white/60'}`}>{section.isActive ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" className="w-full h-9 gap-2 hover:bg-white/10 transition-colors bg-transparent border-white/20 text-white">
                <Edit className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Edit</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-9 text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-400/30 gap-2 transition-colors bg-transparent"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-transparent backdrop-blur-md border border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Section</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete {section.title}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
