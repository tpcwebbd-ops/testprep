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
import {
  useGetPageBuilderQuery,
  useAddPageBuilderMutation,
  useUpdatePageBuilderMutation,
} from '@/app/workshop/page-builder/redux/features/page-builder/pageBuilderSlice';

const Page = () => {
  const { sectionList, setSections, reorderSections } = useSectionStore();
  const [hasExistingData, setHasExistingData] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);

  const { data: getResponseData, isLoading } = useGetPageBuilderQuery({ q: '', page: 1, limit: 100 });
  const [addPageBuilder, { isLoading: isAdding }] = useAddPageBuilderMutation();
  const [updatePageBuilder, { isLoading: isUpdating }] = useUpdatePageBuilderMutation();

  const isSaving = isAdding || isUpdating;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (getResponseData?.data?.sections && getResponseData.data.sections.length > 0) {
      const firstSection = getResponseData.data.sections[0];
      setHasExistingData(true);
      setExistingId(firstSection._id);

      if (firstSection.content && Array.isArray(firstSection.content)) {
        setSections(firstSection.content);
      }
    } else {
      setHasExistingData(false);
    }
  }, [getResponseData, setSections]);

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
      const sectionsWithSerial = sectionList.map((section, index) => ({
        ...section,
        serialNumber: index + 1,
      }));

      if (hasExistingData && existingId) {
        await updatePageBuilder({
          id: existingId,
          content: sectionsWithSerial,
        }).unwrap();
      } else {
        const result = await addPageBuilder({
          title: 'Main Page',
          path: '/',
          iconName: 'Home',
          content: sectionsWithSerial,
          isActive: true,
        }).unwrap();

        if (result.data) {
          setHasExistingData(true);
          setExistingId(result.data._id);
        }
      }

      toast.success('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving sections:', error);
      toast.error('Failed to save changes');
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
