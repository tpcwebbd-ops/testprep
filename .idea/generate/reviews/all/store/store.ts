import { create } from 'zustand'
import { IReviews ,defaultReviews} from '@/app/generate/reviews/all/store/data/data'
import { ReviewsStore } from '@/app/generate/reviews/all/store/store-type' 
import { queryParams } from '@/app/generate/reviews/all/store/store-constant';

export const useReviewsStore = create<ReviewsStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    reviews: [],
    selectedReviews: null,
    newReviews: defaultReviews,
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
    setBulkData: (bulkData: IReviews[]) => set({ bulkData }),
    setReviews: (reviews: IReviews[]) =>
        set({ reviews }),
    setSelectedReviews: (Reviews) =>
        set({ selectedReviews: Reviews }),
    setNewReviews: (Reviews) =>
        set((state) => ({
            newReviews:
                typeof Reviews === 'function'
                    ? Reviews(state.newReviews)
                    : Reviews,
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
