import { create } from 'zustand';
import { IGAuthUsers } from '../api/v1/Model';
import { GAuthUsersStore } from './StoreTypes';
import { baseIGAuthUsers, queryParams } from './StoreConstants';

export const useGAuthUsersStore = create<GAuthUsersStore>(set => ({
  queryPramsLimit: queryParams.limit,
  queryPramsPage: queryParams.page,
  queryPramsQ: queryParams.q,
  gAuthUsers: [],
  selectedGAuthUsers: null,
  newGAuthUsers: baseIGAuthUsers,
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
  setBulkData: (bulkData: IGAuthUsers[]) => set({ bulkData }),
  setGAuthUsers: (gAuthUsers: IGAuthUsers[]) => set({ gAuthUsers }),
  setSelectedGAuthUsers: GAuthUsers => set({ selectedGAuthUsers: GAuthUsers }),
  setNewGAuthUsers: GAuthUsers =>
    set(state => ({
      newGAuthUsers: typeof GAuthUsers === 'function' ? GAuthUsers(state.newGAuthUsers) : GAuthUsers,
    })),
  toggleAddModal: data => set({ isAddModalOpen: data }),
  toggleViewModal: data => set({ isViewModalOpen: data }),
  toggleEditModal: data => set({ isEditModalOpen: data }),
  toggleDeleteModal: data => set({ isDeleteModalOpen: data }),
  toggleBulkEditModal: data => set({ isBulkEditModalOpen: data }),
  toggleBulkUpdateModal: data => set({ isBulkUpdateModalOpen: data }),
  toggleBulkDynamicUpdateModal: data => set({ isBulkDynamicUpdateModal: data }),
  toggleBulkDeleteModal: data => set({ isBulkDeleteModalOpen: data }),
}));
