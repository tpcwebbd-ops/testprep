import { create } from 'zustand'
import { IMarketing_Leads ,defaultMarketing_Leads} from '@/app/generate/marketing_Leads/all/store/data/data'
import { Marketing_LeadsStore } from '@/app/generate/marketing_Leads/all/store/store-type' 
import { queryParams } from '@/app/generate/marketing_Leads/all/store/store-constant';

export const useMarketing_LeadsStore = create<Marketing_LeadsStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    marketing_Leads: [],
    selectedMarketing_Leads: null,
    newMarketing_Leads: defaultMarketing_Leads,
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
    setBulkData: (bulkData: IMarketing_Leads[]) => set({ bulkData }),
    setMarketing_Leads: (marketing_Leads: IMarketing_Leads[]) =>
        set({ marketing_Leads }),
    setSelectedMarketing_Leads: (Marketing_Leads) =>
        set({ selectedMarketing_Leads: Marketing_Leads }),
    setNewMarketing_Leads: (Marketing_Leads) =>
        set((state) => ({
            newMarketing_Leads:
                typeof Marketing_Leads === 'function'
                    ? Marketing_Leads(state.newMarketing_Leads)
                    : Marketing_Leads,
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
