// components/add-section-dialog.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { initialSectionData, SectionData } from '../../section/data';
import { useSectionStore } from '../store/section-store';

export const AddSectionDialog = () => {
  const [open, setOpen] = useState(false);
  const { addSection } = useSectionStore();

  const handleAddSection = (section: SectionData) => {
    addSection(section);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Section
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-transparent backdrop-blur-md border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Section</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {initialSectionData.map(section => (
            <button
              key={section.id}
              onClick={() => handleAddSection(section)}
              className="group relative overflow-hidden rounded-lg border border-white/20 hover:border-primary transition-all hover:shadow-lg bg-transparent backdrop-blur-sm"
            >
              <div className="aspect-video relative">
                <Image src={section.picture} alt={section.title} fill className="object-cover" />
              </div>
              <div className="p-4 bg-transparent backdrop-blur-md">
                <h3 className="font-semibold text-lg text-white">{section.title}</h3>
                <p className="text-sm text-white/70 mt-1">Click to add this section</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
