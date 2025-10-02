import { IEnrollments } from '@/app/generate/enrollments/all/api/v1/model'

export interface EnrollmentsStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    enrollments: IEnrollments[]
    selectedEnrollments: IEnrollments | null
    newEnrollments: Partial<IEnrollments>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewEnrollments: React.Dispatch<
        React.SetStateAction<Partial<IEnrollments>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IEnrollments[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setEnrollments: (Enrollments: IEnrollments[]) => void
    setSelectedEnrollments: (Enrollments: IEnrollments | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Enrollments: boolean) => void
    toggleBulkUpdateModal: (Enrollments: boolean) => void
    toggleBulkDynamicUpdateModal: (Enrollments: boolean) => void
    toggleBulkDeleteModal: (Enrollments: boolean) => void
    setBulkData: (bulkData: IEnrollments[]) => void
}
