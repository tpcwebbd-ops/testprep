import { IPosts_n } from '@/app/generate/posts_n/all/api/v1/model'

export interface Posts_nStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    posts_n: IPosts_n[]
    selectedPosts_n: IPosts_n | null
    newPosts_n: Partial<IPosts_n>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewPosts_n: React.Dispatch<
        React.SetStateAction<Partial<IPosts_n>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IPosts_n[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setPosts_n: (Posts_n: IPosts_n[]) => void
    setSelectedPosts_n: (Posts_n: IPosts_n | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Posts_n: boolean) => void
    toggleBulkUpdateModal: (Posts_n: boolean) => void
    toggleBulkDynamicUpdateModal: (Posts_n: boolean) => void
    toggleBulkDeleteModal: (Posts_n: boolean) => void
    setBulkData: (bulkData: IPosts_n[]) => void
}
