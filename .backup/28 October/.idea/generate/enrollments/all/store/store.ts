import { create } from 'zustand'
import { IEnrollments ,defaultEnrollments} from '@/app/generate/enrollments/all/store/data/data'
import { EnrollmentsStore } from '@/app/generate/enrollments/all/store/store-type' 
import { queryParams } from '@/app/generate/enrollments/all/store/store-constant';

export const useEnrollmentsStore = create<EnrollmentsStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    enrollments: [],
    selectedEnrollments: null,
    newEnrollments: defaultEnrollments,
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
    setBulkData: (bulkData: IEnrollments[]) => set({ bulkData }),
    setEnrollments: (enrollments: IEnrollments[]) =>
        set({ enrollments }),
    setSelectedEnrollments: (Enrollments) =>
        set({ selectedEnrollments: Enrollments }),
    setNewEnrollments: (Enrollments) =>
        set((state) => ({
            newEnrollments:
                typeof Enrollments === 'function'
                    ? Enrollments(state.newEnrollments)
                    : Enrollments,
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
