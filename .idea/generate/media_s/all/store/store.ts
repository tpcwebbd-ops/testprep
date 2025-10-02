import { create } from 'zustand'
import { IMedia_s ,defaultMedia_s} from '@/app/generate/media_s/all/store/data/data'
import { Media_sStore } from '@/app/generate/media_s/all/store/store-type' 
import { queryParams } from '@/app/generate/media_s/all/store/store-constant';

export const useMedia_sStore = create<Media_sStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    media_s: [],
    selectedMedia_s: null,
    newMedia_s: defaultMedia_s,
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
    setBulkData: (bulkData: IMedia_s[]) => set({ bulkData }),
    setMedia_s: (media_s: IMedia_s[]) =>
        set({ media_s }),
    setSelectedMedia_s: (Media_s) =>
        set({ selectedMedia_s: Media_s }),
    setNewMedia_s: (Media_s) =>
        set((state) => ({
            newMedia_s:
                typeof Media_s === 'function'
                    ? Media_s(state.newMedia_s)
                    : Media_s,
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
