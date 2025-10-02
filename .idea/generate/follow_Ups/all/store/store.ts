import { create } from 'zustand'
import { IFollow_Ups ,defaultFollow_Ups} from '@/app/generate/follow_Ups/all/store/data/data'
import { Follow_UpsStore } from '@/app/generate/follow_Ups/all/store/store-type' 
import { queryParams } from '@/app/generate/follow_Ups/all/store/store-constant';

export const useFollow_UpsStore = create<Follow_UpsStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    follow_Ups: [],
    selectedFollow_Ups: null,
    newFollow_Ups: defaultFollow_Ups,
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
    setBulkData: (bulkData: IFollow_Ups[]) => set({ bulkData }),
    setFollow_Ups: (follow_Ups: IFollow_Ups[]) =>
        set({ follow_Ups }),
    setSelectedFollow_Ups: (Follow_Ups) =>
        set({ selectedFollow_Ups: Follow_Ups }),
    setNewFollow_Ups: (Follow_Ups) =>
        set((state) => ({
            newFollow_Ups:
                typeof Follow_Ups === 'function'
                    ? Follow_Ups(state.newFollow_Ups)
                    : Follow_Ups,
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
