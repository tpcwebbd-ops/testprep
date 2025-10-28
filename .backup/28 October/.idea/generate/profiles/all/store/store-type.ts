import { IProfiles } from '@/app/generate/profiles/all/api/v1/model'

export interface ProfilesStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    profiles: IProfiles[]
    selectedProfiles: IProfiles | null
    newProfiles: Partial<IProfiles>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewProfiles: React.Dispatch<
        React.SetStateAction<Partial<IProfiles>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IProfiles[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setProfiles: (Profiles: IProfiles[]) => void
    setSelectedProfiles: (Profiles: IProfiles | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Profiles: boolean) => void
    toggleBulkUpdateModal: (Profiles: boolean) => void
    toggleBulkDynamicUpdateModal: (Profiles: boolean) => void
    toggleBulkDeleteModal: (Profiles: boolean) => void
    setBulkData: (bulkData: IProfiles[]) => void
}
