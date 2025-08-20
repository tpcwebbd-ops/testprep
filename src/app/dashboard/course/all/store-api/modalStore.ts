// store/modalStore.ts
import { create } from 'zustand';
import { IAllCourse } from '@/app/dashboard/course/all/api/v1/model';

interface ModalState {
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isViewModalOpen: boolean;
  selectedCourse: IAllCourse | null;
  openAddModal: () => void;
  openEditModal: (course: IAllCourse) => void;
  openDeleteModal: (course: IAllCourse) => void;
  openViewModal: (course: IAllCourse) => void;
  closeAllModals: () => void;
}

export const useModalStore = create<ModalState>(set => ({
  isAddModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  isViewModalOpen: false,
  selectedCourse: null,
  openAddModal: () => set({ isAddModalOpen: true }),
  openEditModal: course => set({ isEditModalOpen: true, selectedCourse: course }),
  openDeleteModal: course => set({ isDeleteModalOpen: true, selectedCourse: course }),
  openViewModal: course => set({ isViewModalOpen: true, selectedCourse: course }),
  closeAllModals: () =>
    set({
      isAddModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      isViewModalOpen: false,
      selectedCourse: null,
    }),
}));
