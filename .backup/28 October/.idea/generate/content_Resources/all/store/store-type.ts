import { IContent_Resources } from '@/app/generate/content_Resources/all/api/v1/model'

export interface Content_ResourcesStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    content_Resources: IContent_Resources[]
    selectedContent_Resources: IContent_Resources | null
    newContent_Resources: Partial<IContent_Resources>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewContent_Resources: React.Dispatch<
        React.SetStateAction<Partial<IContent_Resources>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IContent_Resources[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setContent_Resources: (Content_Resources: IContent_Resources[]) => void
    setSelectedContent_Resources: (Content_Resources: IContent_Resources | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Content_Resources: boolean) => void
    toggleBulkUpdateModal: (Content_Resources: boolean) => void
    toggleBulkDynamicUpdateModal: (Content_Resources: boolean) => void
    toggleBulkDeleteModal: (Content_Resources: boolean) => void
    setBulkData: (bulkData: IContent_Resources[]) => void
}
