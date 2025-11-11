// store/section-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SectionData } from './data-index';

interface SectionStore {
  sectionList: SectionData[];
  addSection: (section: SectionData) => void;
  removeSection: (id: string) => void;
  updateSection: (id: string, updates: Partial<SectionData>) => void;
  toggleActive: (id: string) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
}

export const useSectionStore = create<SectionStore>()(
  persist(
    set => ({
      sectionList: [],
      addSection: section =>
        set(state => ({
          sectionList: [...state.sectionList, { ...section, id: Date.now().toString() }],
        })),
      removeSection: id =>
        set(state => ({
          sectionList: state.sectionList.filter(s => s.id !== id),
        })),
      updateSection: (id, updates) =>
        set(state => ({
          sectionList: state.sectionList.map(s => (s.id === id ? { ...s, ...updates } : s)),
        })),
      toggleActive: id =>
        set(state => ({
          sectionList: state.sectionList.map(s => (s.id === id ? { ...s, isActive: !s.isActive } : s)),
        })),
      reorderSections: (startIndex, endIndex) =>
        set(state => {
          const result = Array.from(state.sectionList);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { sectionList: result };
        }),
    }),
    {
      name: 'section-storage',
    },
  ),
);
