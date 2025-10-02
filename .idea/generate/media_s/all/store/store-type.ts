import { IMedia_s } from '@/app/generate/media_s/all/api/v1/model'

export interface Media_sStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    media_s: IMedia_s[]
    selectedMedia_s: IMedia_s | null
    newMedia_s: Partial<IMedia_s>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewMedia_s: React.Dispatch<
        React.SetStateAction<Partial<IMedia_s>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IMedia_s[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setMedia_s: (Media_s: IMedia_s[]) => void
    setSelectedMedia_s: (Media_s: IMedia_s | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Media_s: boolean) => void
    toggleBulkUpdateModal: (Media_s: boolean) => void
    toggleBulkDynamicUpdateModal: (Media_s: boolean) => void
    toggleBulkDeleteModal: (Media_s: boolean) => void
    setBulkData: (bulkData: IMedia_s[]) => void
}
