import { IFinances } from '@/app/dashboard/finance/all/api/v1/model'

export interface FinancesStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    finances: IFinances[]
    selectedFinances: IFinances | null
    newFinances: Partial<IFinances>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewFinances: React.Dispatch<
        React.SetStateAction<Partial<IFinances>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IFinances[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setFinances: (Finances: IFinances[]) => void
    setSelectedFinances: (Finances: IFinances | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Finances: boolean) => void
    toggleBulkUpdateModal: (Finances: boolean) => void
    toggleBulkDynamicUpdateModal: (Finances: boolean) => void
    toggleBulkDeleteModal: (Finances: boolean) => void
    setBulkData: (bulkData: IFinances[]) => void
}
