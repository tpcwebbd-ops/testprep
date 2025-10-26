import { create } from 'zustand'
import { IPosts ,defaultPosts} from '../store/data/data'
import { PostsStore } from '../store/store-type' 
import { queryParams } from '../store/store-constant';

export const usePostsStore = create<PostsStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    posts: [],
    selectedPosts: null,
    newPosts: defaultPosts,
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
