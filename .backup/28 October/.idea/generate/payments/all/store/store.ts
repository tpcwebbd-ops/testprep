import { create } from 'zustand'
import { IPayments ,defaultPayments} from '@/app/generate/payments/all/store/data/data'
import { PaymentsStore } from '@/app/generate/payments/all/store/store-type' 
import { queryParams } from '@/app/generate/payments/all/store/store-constant';

export const usePaymentsStore = create<PaymentsStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    payments: [],
    selectedPayments: null,
    newPayments: defaultPayments,
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
    setBulkData: (bulkData: IPayments[]) => set({ bulkData }),
    setPayments: (payments: IPayments[]) =>
        set({ payments }),
    setSelectedPayments: (Payments) =>
        set({ selectedPayments: Payments }),
    setNewPayments: (Payments) =>
        set((state) => ({
            newPayments:
                typeof Payments === 'function'
                    ? Payments(state.newPayments)
                    : Payments,
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
