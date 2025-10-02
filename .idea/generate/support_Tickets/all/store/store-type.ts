import { ISupport_Tickets } from '@/app/generate/support_Tickets/all/api/v1/model'

export interface Support_TicketsStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    support_Tickets: ISupport_Tickets[]
    selectedSupport_Tickets: ISupport_Tickets | null
    newSupport_Tickets: Partial<ISupport_Tickets>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewSupport_Tickets: React.Dispatch<
        React.SetStateAction<Partial<ISupport_Tickets>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: ISupport_Tickets[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setSupport_Tickets: (Support_Tickets: ISupport_Tickets[]) => void
    setSelectedSupport_Tickets: (Support_Tickets: ISupport_Tickets | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Support_Tickets: boolean) => void
    toggleBulkUpdateModal: (Support_Tickets: boolean) => void
    toggleBulkDynamicUpdateModal: (Support_Tickets: boolean) => void
    toggleBulkDeleteModal: (Support_Tickets: boolean) => void
    setBulkData: (bulkData: ISupport_Tickets[]) => void
}
