import { create } from 'zustand'
import { IAssessments ,defaultAssessments} from '@/app/generate/assessments/all/store/data/data'
import { AssessmentsStore } from '@/app/generate/assessments/all/store/store-type' 
import { queryParams } from '@/app/generate/assessments/all/store/store-constant';

export const useAssessmentsStore = create<AssessmentsStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    assessments: [],
    selectedAssessments: null,
    newAssessments: defaultAssessments,
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
    setBulkData: (bulkData: IAssessments[]) => set({ bulkData }),
    setAssessments: (assessments: IAssessments[]) =>
        set({ assessments }),
    setSelectedAssessments: (Assessments) =>
        set({ selectedAssessments: Assessments }),
    setNewAssessments: (Assessments) =>
        set((state) => ({
            newAssessments:
                typeof Assessments === 'function'
                    ? Assessments(state.newAssessments)
                    : Assessments,
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
