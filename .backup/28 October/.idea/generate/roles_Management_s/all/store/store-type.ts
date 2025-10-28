import { IRoles_Management_s } from '@/app/generate/roles_Management_s/all/api/v1/model'

export interface Roles_Management_sStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    roles_Management_s: IRoles_Management_s[]
    selectedRoles_Management_s: IRoles_Management_s | null
    newRoles_Management_s: Partial<IRoles_Management_s>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewRoles_Management_s: React.Dispatch<
        React.SetStateAction<Partial<IRoles_Management_s>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IRoles_Management_s[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setRoles_Management_s: (Roles_Management_s: IRoles_Management_s[]) => void
    setSelectedRoles_Management_s: (Roles_Management_s: IRoles_Management_s | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Roles_Management_s: boolean) => void
    toggleBulkUpdateModal: (Roles_Management_s: boolean) => void
    toggleBulkDynamicUpdateModal: (Roles_Management_s: boolean) => void
    toggleBulkDeleteModal: (Roles_Management_s: boolean) => void
    setBulkData: (bulkData: IRoles_Management_s[]) => void
}
