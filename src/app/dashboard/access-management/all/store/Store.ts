import { create } from 'zustand';
import { IUsers_access } from '../api/v1/model';
import { UsersAccessStore } from './StoreTypes';
import { baseIUsers_access, queryParams } from './StoreConstants';

export const useUsersAccessStore = create<UsersAccessStore>(set => ({
  queryPramsLimit: queryParams.limit,
  queryPramsPage: queryParams.page,
  queryPramsQ: queryParams.q,
  usersAccess: [],
  selectedUsersAccess: null,
  newUsersAccess: baseIUsers_access,
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
  setUsersAccess: (usersAccess: IUsers_access[]) => set({ usersAccess }),
  setSelectedUsersAccess: UsersAccess => set({ selectedUsersAccess: UsersAccess }),
  setNewUsersAccess: UsersAccess =>
    set(state => ({
      newUsersAccess: typeof UsersAccess === 'function' ? UsersAccess(state.newUsersAccess) : UsersAccess,
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
