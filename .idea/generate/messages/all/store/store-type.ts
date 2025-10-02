import { IMessages } from '@/app/generate/messages/all/api/v1/model'

export interface MessagesStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    messages: IMessages[]
    selectedMessages: IMessages | null
    newMessages: Partial<IMessages>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewMessages: React.Dispatch<
        React.SetStateAction<Partial<IMessages>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IMessages[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setMessages: (Messages: IMessages[]) => void
    setSelectedMessages: (Messages: IMessages | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Messages: boolean) => void
    toggleBulkUpdateModal: (Messages: boolean) => void
    toggleBulkDynamicUpdateModal: (Messages: boolean) => void
    toggleBulkDeleteModal: (Messages: boolean) => void
    setBulkData: (bulkData: IMessages[]) => void
}
