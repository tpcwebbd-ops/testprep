'use client';

import { useEffect, useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AddSectionDialog } from './components/add-section-dialog';
import { SectionCard } from './components/section-card';
import { useSectionStore } from './store/section-store';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Page = () => {
  const { sectionList, setSections, reorderSections } = useSectionStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/page-builder/');

      if (!response.ok) {
        throw new Error('Failed to fetch sections');
      }

      const result = await response.json();

      if (result.data && result.data.sections && result.data.sections.length > 0) {
        const firstSection = result.data.sections[0];
        setHasExistingData(true);
        setExistingId(firstSection._id);

        if (firstSection.content && Array.isArray(firstSection.content)) {
          setSections(firstSection.content);
        }
      } else {
        setHasExistingData(false);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to load sections');
      setHasExistingData(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sectionList.findIndex(s => s.id === active.id);
      const newIndex = sectionList.findIndex(s => s.id === over.id);
      reorderSections(oldIndex, newIndex);
    }
  };

  const handleSaveToDB = async () => {
    try {
      setIsSaving(true);

      const sectionsWithSerial = sectionList.map((section, index) => ({
        ...section,
        serialNumber: index + 1,
      }));

      const payload =
        hasExistingData && existingId
          ? {
              id: existingId,
              content: sectionsWithSerial,
            }
          : {
              title: 'Main Page',
              content: sectionsWithSerial,
              isActive: true,
            };

      const url = '/api/page-builder/';
      const method = hasExistingData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save sections');
      }

      const result = await response.json();

      if (!hasExistingData && result.data) {
        setHasExistingData(true);
        setExistingId(result.data._id);
      }

      toast.success('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving sections:', error);
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-transparent p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <p className="text-white/80">Loading sections...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Page</h1>
            <p className="text-white/60 text-sm mt-1">{hasExistingData ? 'Editing existing page' : 'Creating new page'}</p>
          </div>
          <AddSectionDialog />
        </div>

        {sectionList.length > 0 ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sectionList.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-1 gap-6">
                {sectionList.map(section => (
                  <SectionCard key={section.id} section={section} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-16">
            <p className="text-white/80 text-lg mb-4">No sections added yet</p>
            <p className="text-white/60">Click the &quot;Add Section&quot; button to get started</p>
          </div>
        )}
      </div>

      {sectionList.length > 0 && (
        <div className="w-full flex items-center justify-center py-8">
          <Button onClick={handleSaveToDB} variant="outlineGlassy" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      )}
    </main>
  );
};

export default Page;
