import { ILectures } from '@/app/generate/lectures/all/api/v1/model'

export interface LecturesStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    lectures: ILectures[]
    selectedLectures: ILectures | null
    newLectures: Partial<ILectures>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewLectures: React.Dispatch<
        React.SetStateAction<Partial<ILectures>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: ILectures[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setLectures: (Lectures: ILectures[]) => void
    setSelectedLectures: (Lectures: ILectures | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Lectures: boolean) => void
    toggleBulkUpdateModal: (Lectures: boolean) => void
    toggleBulkDynamicUpdateModal: (Lectures: boolean) => void
    toggleBulkDeleteModal: (Lectures: boolean) => void
    setBulkData: (bulkData: ILectures[]) => void
}
