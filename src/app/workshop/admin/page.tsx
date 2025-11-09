// Page.tsx

'use client';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AddSectionDialog } from './components/add-section-dialog';
import { SectionCard } from './components/section-card';
import { useSectionStore } from './store/section-store';

const Page = () => {
  const { sectionList, reorderSections } = useSectionStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sectionList.findIndex(s => s.id === active.id);
      const newIndex = sectionList.findIndex(s => s.id === over.id);
      reorderSections(oldIndex, newIndex);
    }
  };

  console.log('sectionList', sectionList);
  return (
    <main className="min-h-screen bg-transparent p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Page</h1>
            <p className="text-white/70 mt-1">Manage your sections with drag and drop</p>
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
    </main>
  );
};

export default Page;
