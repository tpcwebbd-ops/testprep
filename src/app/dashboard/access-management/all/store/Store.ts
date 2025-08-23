import { create } from 'zustand';
import { IUsers_access } from '../api/v1/model';
import { Users_1_000___Store } from './StoreTypes';
import { baseIUsers_access, queryParams } from './StoreConstants';

export const useUsers_1_000___Store = create<Users_1_000___Store>(set => ({
  queryPramsLimit: queryParams.limit,
  queryPramsPage: queryParams.page,
  queryPramsQ: queryParams.q,
  users_2_000___: [],
  selectedUsers_1_000___: null,
  newUsers_1_000___: baseIUsers_access,
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
  setBulkData: (bulkData: IUsers_access[]) => set({ bulkData }),
  setUsers_1_000___: (users_2_000___: IUsers_access[]) => set({ users_2_000___ }),
  setSelectedUsers_1_000___: Users_1_000___ => set({ selectedUsers_1_000___: Users_1_000___ }),
  setNewUsers_1_000___: Users_1_000___ =>
    set(state => ({
      newUsers_1_000___: typeof Users_1_000___ === 'function' ? Users_1_000___(state.newUsers_1_000___) : Users_1_000___,
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
