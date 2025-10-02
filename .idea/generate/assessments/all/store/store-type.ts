import { IAssessments } from '@/app/generate/assessments/all/api/v1/model'

export interface AssessmentsStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    assessments: IAssessments[]
    selectedAssessments: IAssessments | null
    newAssessments: Partial<IAssessments>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewAssessments: React.Dispatch<
        React.SetStateAction<Partial<IAssessments>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IAssessments[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setAssessments: (Assessments: IAssessments[]) => void
    setSelectedAssessments: (Assessments: IAssessments | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Assessments: boolean) => void
    toggleBulkUpdateModal: (Assessments: boolean) => void
    toggleBulkDynamicUpdateModal: (Assessments: boolean) => void
    toggleBulkDeleteModal: (Assessments: boolean) => void
    setBulkData: (bulkData: IAssessments[]) => void
}
