import { create } from 'zustand';
import { NavData } from './interface';

interface HeaderStore {
  isEditModalOpen: boolean;
  toggleEditModal: (isOpen: boolean) => void;
  selectedHeaderData: NavData | null;
  setSelectedHeaderData: (data: NavData | null) => void;
}

export const useHeaderStore = create<HeaderStore>(set => ({
  isEditModalOpen: false,
  toggleEditModal: isOpen => set({ isEditModalOpen: isOpen }),
  selectedHeaderData: null,
  setSelectedHeaderData: data => set({ selectedHeaderData: data }),
}));
