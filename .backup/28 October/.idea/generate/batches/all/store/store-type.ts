import { IBatches } from '@/app/generate/batches/all/api/v1/model'

export interface BatchesStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    batches: IBatches[]
    selectedBatches: IBatches | null
    newBatches: Partial<IBatches>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewBatches: React.Dispatch<
        React.SetStateAction<Partial<IBatches>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IBatches[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setBatches: (Batches: IBatches[]) => void
    setSelectedBatches: (Batches: IBatches | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Batches: boolean) => void
    toggleBulkUpdateModal: (Batches: boolean) => void
    toggleBulkDynamicUpdateModal: (Batches: boolean) => void
    toggleBulkDeleteModal: (Batches: boolean) => void
    setBulkData: (bulkData: IBatches[]) => void
}
