import { IEmployee_Tasks } from '@/app/generate/employee_Tasks/all/api/v1/model'

export interface Employee_TasksStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    employee_Tasks: IEmployee_Tasks[]
    selectedEmployee_Tasks: IEmployee_Tasks | null
    newEmployee_Tasks: Partial<IEmployee_Tasks>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewEmployee_Tasks: React.Dispatch<
        React.SetStateAction<Partial<IEmployee_Tasks>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IEmployee_Tasks[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setEmployee_Tasks: (Employee_Tasks: IEmployee_Tasks[]) => void
    setSelectedEmployee_Tasks: (Employee_Tasks: IEmployee_Tasks | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Employee_Tasks: boolean) => void
    toggleBulkUpdateModal: (Employee_Tasks: boolean) => void
    toggleBulkDynamicUpdateModal: (Employee_Tasks: boolean) => void
    toggleBulkDeleteModal: (Employee_Tasks: boolean) => void
    setBulkData: (bulkData: IEmployee_Tasks[]) => void
}
