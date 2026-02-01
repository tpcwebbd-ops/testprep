import { create } from 'zustand'
import { IVerifications ,defaultVerifications} from '../store/data/data'
import { VerificationsStore } from '../store/store-type' 
import { queryParams } from '../store/store-constant';

export const useVerificationsStore = create<VerificationsStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    verifications: [],
    selectedVerifications: null,
    newVerifications: defaultVerifications,
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
    setBulkData: (bulkData: IVerifications[]) => set({ bulkData }),
    setVerifications: (verifications: IVerifications[]) =>
        set({ verifications }),
    setSelectedVerifications: (Verifications) =>
        set({ selectedVerifications: Verifications }),
    setNewVerifications: (Verifications) =>
        set((state) => ({
            newVerifications:
                typeof Verifications === 'function'
                    ? Verifications(state.newVerifications)
                    : Verifications,
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
