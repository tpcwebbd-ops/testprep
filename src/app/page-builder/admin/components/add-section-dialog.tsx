'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { initialSectionData, SectionData } from '../store/data-index';
import { useSectionStore } from '../store/section-store';
import { ScrollArea } from '@/components/ui/scroll-area';

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
        <Button className="gap-2" variant="outlineGlassy">
          <Plus className="h-4 w-4" />
          Add Section
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-blue/80 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogContent className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-[95vw] min-w-6xl mt-8 max-w-6xl text-white h-[85vh] overflow-hidden backdrop-blur-2xl bg-slate-900/80 border border-white/20 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Add New Section
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="w-full h-[calc(85vh-80px)] pr-4 -mr-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 pb-4">
              {initialSectionData.map(section => (
                <button
                  key={section.id}
                  onClick={() => handleAddSection(section)}
                  className="group relative overflow-hidden rounded-lg border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 backdrop-blur-xl bg-white/5"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <Image src={section.picture} alt={section.title} fill className="object-cover transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-4 backdrop-blur-xl bg-slate-900/60 border-t border-white/10">
                    <h3 className="font-semibold text-lg text-white">{section.title}</h3>
                    <p className="text-sm text-white/70 mt-1">Click to add this section</p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
