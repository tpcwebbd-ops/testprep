import { IMarketing_Leads } from '@/app/generate/marketing_Leads/all/api/v1/model'

export interface Marketing_LeadsStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    marketing_Leads: IMarketing_Leads[]
    selectedMarketing_Leads: IMarketing_Leads | null
    newMarketing_Leads: Partial<IMarketing_Leads>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewMarketing_Leads: React.Dispatch<
        React.SetStateAction<Partial<IMarketing_Leads>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IMarketing_Leads[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setMarketing_Leads: (Marketing_Leads: IMarketing_Leads[]) => void
    setSelectedMarketing_Leads: (Marketing_Leads: IMarketing_Leads | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Marketing_Leads: boolean) => void
    toggleBulkUpdateModal: (Marketing_Leads: boolean) => void
    toggleBulkDynamicUpdateModal: (Marketing_Leads: boolean) => void
    toggleBulkDeleteModal: (Marketing_Leads: boolean) => void
    setBulkData: (bulkData: IMarketing_Leads[]) => void
}
