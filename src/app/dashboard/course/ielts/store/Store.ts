import { create } from 'zustand';
import { IELTScourse } from '../api/v1/model';
import { CoursesStore } from './StoreTypes';
import { baseICourses, queryParams } from './StoreConstants';

export const useCoursesStore = create<CoursesStore>(set => ({
  queryPramsLimit: queryParams.limit,
  queryPramsPage: queryParams.page,
  queryPramsQ: queryParams.q,
  courses: [],
  selectedCourses: null,
  newCourses: baseICourses,
  isBulkEditModalOpen: false,
  isBulkDynamicUpdateModal: false,
  isBulkUpdateModalOpen: false,
  isBulkDeleteModalOpen: false,
  isAddModalOpen: false,
  isViewModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  bulkData: [],
  setQueryPramsLimit: (payload: number) => set({ queryPramsLimit: payload }),
  setQueryPramsPage: (payload: number) => set({ queryPramsPage: payload }),
  setQueryPramsQ: (payload: string) => set({ queryPramsQ: payload }),
  setBulkData: (bulkData: IELTScourse[]) => set({ bulkData }),
  setCourses: (courses: IELTScourse[]) => set({ courses }),
  setSelectedCourses: Courses => set({ selectedCourses: Courses }),
  setNewCourses: Courses =>
    set(state => ({
      newCourses: typeof Courses === 'function' ? Courses(state.newCourses) : Courses,
    })),
  toggleAddModal: data => set({ isAddModalOpen: data }),
  toggleViewModal: data => set({ isViewModalOpen: data }),
  toggleEditModal: data => set({ isEditModalOpen: data }),
  toggleDeleteModal: data => set({ isDeleteModalOpen: data }),
  toggleBulkEditModal: data => set({ isBulkEditModalOpen: data }),
  toggleBulkUpdateModal: data => set({ isBulkUpdateModalOpen: data }),
  toggleBulkDynamicUpdateModal: data => set({ isBulkDynamicUpdateModal: data }),
  toggleBulkDeleteModal: data => set({ isBulkDeleteModalOpen: data }),
}));
