import { create } from 'zustand'
import { ISupport_Tickets ,defaultSupport_Tickets} from '@/app/generate/support_Tickets/all/store/data/data'
import { Support_TicketsStore } from '@/app/generate/support_Tickets/all/store/store-type' 
import { queryParams } from '@/app/generate/support_Tickets/all/store/store-constant';

export const useSupport_TicketsStore = create<Support_TicketsStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    support_Tickets: [],
    selectedSupport_Tickets: null,
    newSupport_Tickets: defaultSupport_Tickets,
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
    setBulkData: (bulkData: ISupport_Tickets[]) => set({ bulkData }),
    setSupport_Tickets: (support_Tickets: ISupport_Tickets[]) =>
        set({ support_Tickets }),
    setSelectedSupport_Tickets: (Support_Tickets) =>
        set({ selectedSupport_Tickets: Support_Tickets }),
    setNewSupport_Tickets: (Support_Tickets) =>
        set((state) => ({
            newSupport_Tickets:
                typeof Support_Tickets === 'function'
                    ? Support_Tickets(state.newSupport_Tickets)
                    : Support_Tickets,
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
