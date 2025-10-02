import { IReviews } from '@/app/generate/reviews/all/api/v1/model'

export interface ReviewsStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    reviews: IReviews[]
    selectedReviews: IReviews | null
    newReviews: Partial<IReviews>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewReviews: React.Dispatch<
        React.SetStateAction<Partial<IReviews>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IReviews[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setReviews: (Reviews: IReviews[]) => void
    setSelectedReviews: (Reviews: IReviews | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Reviews: boolean) => void
    toggleBulkUpdateModal: (Reviews: boolean) => void
    toggleBulkDynamicUpdateModal: (Reviews: boolean) => void
    toggleBulkDeleteModal: (Reviews: boolean) => void
    setBulkData: (bulkData: IReviews[]) => void
}
