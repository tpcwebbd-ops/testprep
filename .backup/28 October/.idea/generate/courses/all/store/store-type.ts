import { ICourses } from '@/app/generate/courses/all/api/v1/model'

export interface CoursesStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    courses: ICourses[]
    selectedCourses: ICourses | null
    newCourses: Partial<ICourses>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewCourses: React.Dispatch<
        React.SetStateAction<Partial<ICourses>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: ICourses[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setCourses: (Courses: ICourses[]) => void
    setSelectedCourses: (Courses: ICourses | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Courses: boolean) => void
    toggleBulkUpdateModal: (Courses: boolean) => void
    toggleBulkDynamicUpdateModal: (Courses: boolean) => void
    toggleBulkDeleteModal: (Courses: boolean) => void
    setBulkData: (bulkData: ICourses[]) => void
}
