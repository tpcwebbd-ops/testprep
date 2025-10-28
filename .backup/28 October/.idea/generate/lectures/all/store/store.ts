import { create } from 'zustand'
import { ILectures ,defaultLectures} from '@/app/generate/lectures/all/store/data/data'
import { LecturesStore } from '@/app/generate/lectures/all/store/store-type' 
import { queryParams } from '@/app/generate/lectures/all/store/store-constant';

export const useLecturesStore = create<LecturesStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    lectures: [],
    selectedLectures: null,
    newLectures: defaultLectures,
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
    setBulkData: (bulkData: ILectures[]) => set({ bulkData }),
    setLectures: (lectures: ILectures[]) =>
        set({ lectures }),
    setSelectedLectures: (Lectures) =>
        set({ selectedLectures: Lectures }),
    setNewLectures: (Lectures) =>
        set((state) => ({
            newLectures:
                typeof Lectures === 'function'
                    ? Lectures(state.newLectures)
                    : Lectures,
        })),
    toggleAddModal: (data) => set({ isAddModalOpen: data }),
    toggleViewModal: (data) => set({ isViewModalOpen: data }),
    toggleEditModal: (data) => set({ isEditModalOpen: data }),
    toggleDeleteModal: (data) => set({ isDeleteModalOpen: data }),
    toggleBulkEditModal: (data) => set({ isBulkEditModalOpen: data }),
    toggleBulkUpdateModal: (data) => set({ isBulkUpdateModalOpen: data }),
    toggleBulkDynamicUpdateModal: (data) =>
        set({ isBulkDynamicUpdateModal: data }),
    toggleBulkDeleteModal: (data) => set({ isBulkDeleteModalOpen: data }),
}))
