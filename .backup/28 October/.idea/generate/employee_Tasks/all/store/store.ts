import { create } from 'zustand'
import { IEmployee_Tasks ,defaultEmployee_Tasks} from '@/app/generate/employee_Tasks/all/store/data/data'
import { Employee_TasksStore } from '@/app/generate/employee_Tasks/all/store/store-type' 
import { queryParams } from '@/app/generate/employee_Tasks/all/store/store-constant';

export const useEmployee_TasksStore = create<Employee_TasksStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    employee_Tasks: [],
    selectedEmployee_Tasks: null,
    newEmployee_Tasks: defaultEmployee_Tasks,
    isBulkEditModalOpen: false,
    isBulkDynamicUpdateModal: false,
    isBulkUpdateModalOpen: false,
    isBulkDeleteModalOpen: false,
    isAddModalOpen: false,
    isViewModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    bulkData: [],
    setQueryPramsLimit: (payload: number) => set({ queryPramsLimit: payload }),
    setQueryPramsPage: (payload: number) => set({ queryPramsPage: payload }),
    setQueryPramsQ: (payload: string) => set({ queryPramsQ: payload }),
    setBulkData: (bulkData: IEmployee_Tasks[]) => set({ bulkData }),
    setEmployee_Tasks: (employee_Tasks: IEmployee_Tasks[]) =>
        set({ employee_Tasks }),
    setSelectedEmployee_Tasks: (Employee_Tasks) =>
        set({ selectedEmployee_Tasks: Employee_Tasks }),
    setNewEmployee_Tasks: (Employee_Tasks) =>
        set((state) => ({
            newEmployee_Tasks:
                typeof Employee_Tasks === 'function'
                    ? Employee_Tasks(state.newEmployee_Tasks)
                    : Employee_Tasks,
        })),
    toggleAddModal: (data) => set({ isAddModalOpen: data }),
    toggleViewModal: (data) => set({ isViewModalOpen: data }),
    toggleEditModal: (data) => set({ isEditModalOpen: data }),
    toggleDeleteModal: (data) => set({ isDeleteModalOpen: data }),
    toggleBulkEditModal: (data) => set({ isBulkEditModalOpen: data }),
    toggleBulkUpdateModal: (data) => set({ isBulkUpdateModalOpen: data }),
    toggleBulkDynamicUpdateModal: (data) =>
        set({ isBulkDynamicUpdateModal: data }),
    toggleBulkDeleteModal: (data) => set({ isBulkDeleteModalOpen: data }),
}))
