import { ICompany_Goals } from '@/app/generate/company_Goals/all/api/v1/model'

export interface Company_GoalsStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    company_Goals: ICompany_Goals[]
    selectedCompany_Goals: ICompany_Goals | null
    newCompany_Goals: Partial<ICompany_Goals>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewCompany_Goals: React.Dispatch<
        React.SetStateAction<Partial<ICompany_Goals>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: ICompany_Goals[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setCompany_Goals: (Company_Goals: ICompany_Goals[]) => void
    setSelectedCompany_Goals: (Company_Goals: ICompany_Goals | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Company_Goals: boolean) => void
    toggleBulkUpdateModal: (Company_Goals: boolean) => void
    toggleBulkDynamicUpdateModal: (Company_Goals: boolean) => void
    toggleBulkDeleteModal: (Company_Goals: boolean) => void
    setBulkData: (bulkData: ICompany_Goals[]) => void
}
