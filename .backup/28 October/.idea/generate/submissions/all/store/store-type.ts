import { ISubmissions } from '@/app/generate/submissions/all/api/v1/model'

export interface SubmissionsStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    submissions: ISubmissions[]
    selectedSubmissions: ISubmissions | null
    newSubmissions: Partial<ISubmissions>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewSubmissions: React.Dispatch<
        React.SetStateAction<Partial<ISubmissions>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: ISubmissions[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setSubmissions: (Submissions: ISubmissions[]) => void
    setSelectedSubmissions: (Submissions: ISubmissions | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Submissions: boolean) => void
    toggleBulkUpdateModal: (Submissions: boolean) => void
    toggleBulkDynamicUpdateModal: (Submissions: boolean) => void
    toggleBulkDeleteModal: (Submissions: boolean) => void
    setBulkData: (bulkData: ISubmissions[]) => void
}
