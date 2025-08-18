import { create } from 'zustand'
import { IPosts } from '@/app/dashboard/posts/all/api/v1/model'
import { PostsStore } from '@/app/dashboard/posts/all/store/StoreTypes'
import {
    baseIPosts,
    queryParams,
} from '@/app/dashboard/posts/all/store/StoreConstants'

export const usePostsStore = create<PostsStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    posts: [],
    selectedPosts: null,
    newPosts: baseIPosts,
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
    setBulkData: (bulkData: IPosts[]) => set({ bulkData }),
    setPosts: (posts: IPosts[]) =>
        set({ posts }),
    setSelectedPosts: (Posts) =>
        set({ selectedPosts: Posts }),
    setNewPosts: (Posts) =>
        set((state) => ({
            newPosts:
                typeof Posts === 'function'
                    ? Posts(state.newPosts)
                    : Posts,
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
