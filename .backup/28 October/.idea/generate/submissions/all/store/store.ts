import { create } from 'zustand'
import { ISubmissions ,defaultSubmissions} from '@/app/generate/submissions/all/store/data/data'
import { SubmissionsStore } from '@/app/generate/submissions/all/store/store-type' 
import { queryParams } from '@/app/generate/submissions/all/store/store-constant';

export const useSubmissionsStore = create<SubmissionsStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    submissions: [],
    selectedSubmissions: null,
    newSubmissions: defaultSubmissions,
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
    setBulkData: (bulkData: ISubmissions[]) => set({ bulkData }),
    setSubmissions: (submissions: ISubmissions[]) =>
        set({ submissions }),
    setSelectedSubmissions: (Submissions) =>
        set({ selectedSubmissions: Submissions }),
    setNewSubmissions: (Submissions) =>
        set((state) => ({
            newSubmissions:
                typeof Submissions === 'function'
                    ? Submissions(state.newSubmissions)
                    : Submissions,
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
