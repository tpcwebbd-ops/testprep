import { create } from 'zustand'
import { IContent_Resources ,defaultContent_Resources} from '@/app/generate/content_Resources/all/store/data/data'
import { Content_ResourcesStore } from '@/app/generate/content_Resources/all/store/store-type' 
import { queryParams } from '@/app/generate/content_Resources/all/store/store-constant';

export const useContent_ResourcesStore = create<Content_ResourcesStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    content_Resources: [],
    selectedContent_Resources: null,
    newContent_Resources: defaultContent_Resources,
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
    setBulkData: (bulkData: IContent_Resources[]) => set({ bulkData }),
    setContent_Resources: (content_Resources: IContent_Resources[]) =>
        set({ content_Resources }),
    setSelectedContent_Resources: (Content_Resources) =>
        set({ selectedContent_Resources: Content_Resources }),
    setNewContent_Resources: (Content_Resources) =>
        set((state) => ({
            newContent_Resources:
                typeof Content_Resources === 'function'
                    ? Content_Resources(state.newContent_Resources)
                    : Content_Resources,
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
