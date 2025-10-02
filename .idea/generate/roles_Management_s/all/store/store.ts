import { create } from 'zustand'
import { IRoles_Management_s ,defaultRoles_Management_s} from '@/app/generate/roles_Management_s/all/store/data/data'
import { Roles_Management_sStore } from '@/app/generate/roles_Management_s/all/store/store-type' 
import { queryParams } from '@/app/generate/roles_Management_s/all/store/store-constant';

export const useRoles_Management_sStore = create<Roles_Management_sStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    roles_Management_s: [],
    selectedRoles_Management_s: null,
    newRoles_Management_s: defaultRoles_Management_s,
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
    setBulkData: (bulkData: IRoles_Management_s[]) => set({ bulkData }),
    setRoles_Management_s: (roles_Management_s: IRoles_Management_s[]) =>
        set({ roles_Management_s }),
    setSelectedRoles_Management_s: (Roles_Management_s) =>
        set({ selectedRoles_Management_s: Roles_Management_s }),
    setNewRoles_Management_s: (Roles_Management_s) =>
        set((state) => ({
            newRoles_Management_s:
                typeof Roles_Management_s === 'function'
                    ? Roles_Management_s(state.newRoles_Management_s)
                    : Roles_Management_s,
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
