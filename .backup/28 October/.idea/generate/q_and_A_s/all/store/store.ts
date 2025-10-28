import { create } from 'zustand'
import { IQ_and_A_s ,defaultQ_and_A_s} from '@/app/generate/q_and_A_s/all/store/data/data'
import { Q_and_A_sStore } from '@/app/generate/q_and_A_s/all/store/store-type' 
import { queryParams } from '@/app/generate/q_and_A_s/all/store/store-constant';

export const useQ_and_A_sStore = create<Q_and_A_sStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    q_and_A_s: [],
    selectedQ_and_A_s: null,
    newQ_and_A_s: defaultQ_and_A_s,
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
    setBulkData: (bulkData: IQ_and_A_s[]) => set({ bulkData }),
    setQ_and_A_s: (q_and_A_s: IQ_and_A_s[]) =>
        set({ q_and_A_s }),
    setSelectedQ_and_A_s: (Q_and_A_s) =>
        set({ selectedQ_and_A_s: Q_and_A_s }),
    setNewQ_and_A_s: (Q_and_A_s) =>
        set((state) => ({
            newQ_and_A_s:
                typeof Q_and_A_s === 'function'
                    ? Q_and_A_s(state.newQ_and_A_s)
                    : Q_and_A_s,
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
