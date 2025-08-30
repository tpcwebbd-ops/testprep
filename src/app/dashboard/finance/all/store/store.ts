import { create } from 'zustand';
// V-- CHANGE THIS IMPORT PATH --V

import { FinancesStore } from '@/app/dashboard/finance/all/store/store-type';
import { queryParams } from '@/app/dashboard/finance/all/store/store-constant';
import { defaultFinances, IFinances } from '../api/v1/model';

export const useFinancesStore = create<FinancesStore>(set => ({
  queryPramsLimit: queryParams.limit,
  queryPramsPage: queryParams.page,
  queryPramsQ: queryParams.q,
  finances: [],
  selectedFinances: null,
  newFinances: defaultFinances,
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
  setBulkData: (bulkData: IFinances[]) => set({ bulkData }),
  setFinances: (finances: IFinances[]) => set({ finances }),
  setSelectedFinances: (Finances: IFinances | null) => set({ selectedFinances: Finances }),
  setNewFinances: (payload: Partial<IFinances>) =>
    set((state: FinancesStore) => ({
      newFinances: { ...state.newFinances, ...payload },
    })),
  toggleAddModal: (data: boolean) => set({ isAddModalOpen: data }),
  toggleViewModal: (data: boolean) => set({ isViewModalOpen: data }),
  toggleEditModal: (data: boolean) => set({ isEditModalOpen: data }),
  toggleDeleteModal: (data: boolean) => set({ isDeleteModalOpen: data }),
  toggleBulkEditModal: (data: boolean) => set({ isBulkEditModalOpen: data }),
  toggleBulkUpdateModal: (data: boolean) => set({ isBulkUpdateModalOpen: data }),
  toggleBulkDynamicUpdateModal: (data: boolean) => set({ isBulkDynamicUpdateModal: data }),
  toggleBulkDeleteModal: (data: boolean) => set({ isBulkDeleteModalOpen: data }),
}));
