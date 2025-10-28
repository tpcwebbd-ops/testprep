import { IWebsite_Settings } from '@/app/generate/website_Settings/all/api/v1/model'

export interface Website_SettingsStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    website_Settings: IWebsite_Settings[]
    selectedWebsite_Settings: IWebsite_Settings | null
    newWebsite_Settings: Partial<IWebsite_Settings>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewWebsite_Settings: React.Dispatch<
        React.SetStateAction<Partial<IWebsite_Settings>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IWebsite_Settings[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setWebsite_Settings: (Website_Settings: IWebsite_Settings[]) => void
    setSelectedWebsite_Settings: (Website_Settings: IWebsite_Settings | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Website_Settings: boolean) => void
    toggleBulkUpdateModal: (Website_Settings: boolean) => void
    toggleBulkDynamicUpdateModal: (Website_Settings: boolean) => void
    toggleBulkDeleteModal: (Website_Settings: boolean) => void
    setBulkData: (bulkData: IWebsite_Settings[]) => void
}
