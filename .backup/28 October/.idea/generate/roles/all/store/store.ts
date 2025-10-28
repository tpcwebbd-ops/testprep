import { create } from 'zustand'
import { IRoles ,defaultRoles} from '@/app/generate/roles/all/store/data/data'
import { RolesStore } from '@/app/generate/roles/all/store/store-type' 
import { queryParams } from '@/app/generate/roles/all/store/store-constant';

export const useRolesStore = create<RolesStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    roles: [],
    selectedRoles: null,
    newRoles: defaultRoles,
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
    setBulkData: (bulkData: IRoles[]) => set({ bulkData }),
    setRoles: (roles: IRoles[]) =>
        set({ roles }),
    setSelectedRoles: (Roles) =>
        set({ selectedRoles: Roles }),
    setNewRoles: (Roles) =>
        set((state) => ({
            newRoles:
                typeof Roles === 'function'
                    ? Roles(state.newRoles)
                    : Roles,
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
