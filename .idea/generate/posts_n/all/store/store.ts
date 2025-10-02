import { create } from 'zustand'
import { IPosts_n ,defaultPosts_n} from '@/app/generate/posts_n/all/store/data/data'
import { Posts_nStore } from '@/app/generate/posts_n/all/store/store-type' 
import { queryParams } from '@/app/generate/posts_n/all/store/store-constant';

export const usePosts_nStore = create<Posts_nStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    posts_n: [],
    selectedPosts_n: null,
    newPosts_n: defaultPosts_n,
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
    setBulkData: (bulkData: IPosts_n[]) => set({ bulkData }),
    setPosts_n: (posts_n: IPosts_n[]) =>
        set({ posts_n }),
    setSelectedPosts_n: (Posts_n) =>
        set({ selectedPosts_n: Posts_n }),
    setNewPosts_n: (Posts_n) =>
        set((state) => ({
            newPosts_n:
                typeof Posts_n === 'function'
                    ? Posts_n(state.newPosts_n)
                    : Posts_n,
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
