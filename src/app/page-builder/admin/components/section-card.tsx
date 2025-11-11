// components/section-card.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

import { initialSectionData, SectioinDataType, SectionData } from '../store/data-index';
import { useSectionStore } from '../store/section-store';

// ✅ Import 6 Form Components (All accept SectionFormProps)
import MutationSection1 from '../../all-section/section-1/Mutation';
import MutationSection2 from '../../all-section/section-2/Mutation';
import MutationSection3 from '../../all-section/section-3/Mutation';
import MutationSection4 from '../../all-section/section-4/Mutation';
import MutationSection5 from '../../all-section/section-5/Mutation';
import MutationSection6 from '../../all-section/section-6/Mutation';

import { ScrollArea } from '@/components/ui/scroll-area';
import { ISectionData } from '../../all-section/section-2/data';

export type SectionFormProps = {
  data?: SectioinDataType;
  onSubmit: (v: SectioinDataType) => void;
};

interface SectionCardProps {
  section: SectionData;
}

const SectionMutationRegistry = {
  [initialSectionData[0].sectionUid]: MutationSection1,
  [initialSectionData[1].sectionUid]: MutationSection2,
  [initialSectionData[2].sectionUid]: MutationSection3,
  [initialSectionData[3].sectionUid]: MutationSection4,
  [initialSectionData[4].sectionUid]: MutationSection5,
  [initialSectionData[5].sectionUid]: MutationSection6,
};

export const SectionCard = ({ section }: SectionCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editComponent, setEditComponent] = useState<React.ReactNode>(null);

  const { removeSection, toggleActive, updateSection } = useSectionStore();

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

  const handleSectionEdit = (updatedValue: SectioinDataType) => {
    updateSection(section.id, { ...section, content: updatedValue });
    setShowEditDialog(false);
  };

  const handleEdit = () => {
    const SectionForm = SectionMutationRegistry[section.sectionUid];

    if (SectionForm) {
      setEditComponent(<SectionForm data={section.content as ISectionData} onSubmit={handleSectionEdit} />);
    } else {
      setEditComponent(<div className="text-red-400 p-4">⚠ No Mutation Form Found for this Section</div>);
    }

    setShowEditDialog(true);
  };

  return (
    <>
      {/* Card */}
      <div ref={setNodeRef} style={style} className="group h-[300px] flex rounded-xl border border-white/20 backdrop-blur-md">
        <div className="w-[70%] relative">
          <Image src={section.picture} alt={section.title} className="object-cover w-full h-full" width={1200} height={1200} />
        </div>

        <div className="w-[30%] flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="h-4 w-4 text-white/70" />
            </button>

            <Switch checked={section.isActive} onCheckedChange={() => toggleActive(section.id)} />
          </div>

          <h3 className="text-white text-sm mb-2 line-clamp-3">{section.title}</h3>

          <div className="flex-1" />

          <Button variant="outlineGlassy" size="sm" onClick={handleEdit}>
            <Edit className="h-3.5 w-3.5" /> Edit
          </Button>

          <Button variant="outlineGlassy" size="sm" className="mt-2 text-red-400 border-red-400/30" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-slate-900/95 text-white max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription className="text-white/70">Update the section data below</DialogDescription>
          </DialogHeader>
          <ScrollArea className="w-full h-[400px] pr-4">{editComponent}</ScrollArea>

          <DialogFooter>
            <Button variant="outlineGlassy" onClick={() => setShowEditDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-slate-900/95 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/30 text-white backdrop-blur-xl shadow-lg shadow-blue-500/20
           hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02]
           transition-all duration-300"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className=" border border-rose-400/50 text-rose-100 bg-rose-400/20 backdrop-blur-md shadow-lg shadow-rose-500/20
           hover:bg-rose-400/30 hover:border-rose-400/70 hover:shadow-xl hover:shadow-rose-500/30 hover:scale-[1.02]
           transition-all duration-300"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
