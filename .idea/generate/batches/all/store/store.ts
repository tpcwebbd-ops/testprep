import { create } from 'zustand'
import { IBatches ,defaultBatches} from '@/app/generate/batches/all/store/data/data'
import { BatchesStore } from '@/app/generate/batches/all/store/store-type' 
import { queryParams } from '@/app/generate/batches/all/store/store-constant';

export const useBatchesStore = create<BatchesStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    batches: [],
    selectedBatches: null,
    newBatches: defaultBatches,
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
    setBulkData: (bulkData: IBatches[]) => set({ bulkData }),
    setBatches: (batches: IBatches[]) =>
        set({ batches }),
    setSelectedBatches: (Batches) =>
        set({ selectedBatches: Batches }),
    setNewBatches: (Batches) =>
        set((state) => ({
            newBatches:
                typeof Batches === 'function'
                    ? Batches(state.newBatches)
                    : Batches,
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
