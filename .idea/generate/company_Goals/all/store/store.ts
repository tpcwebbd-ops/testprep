import { create } from 'zustand'
import { ICompany_Goals ,defaultCompany_Goals} from '@/app/generate/company_Goals/all/store/data/data'
import { Company_GoalsStore } from '@/app/generate/company_Goals/all/store/store-type' 
import { queryParams } from '@/app/generate/company_Goals/all/store/store-constant';

export const useCompany_GoalsStore = create<Company_GoalsStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    company_Goals: [],
    selectedCompany_Goals: null,
    newCompany_Goals: defaultCompany_Goals,
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
    setBulkData: (bulkData: ICompany_Goals[]) => set({ bulkData }),
    setCompany_Goals: (company_Goals: ICompany_Goals[]) =>
        set({ company_Goals }),
    setSelectedCompany_Goals: (Company_Goals) =>
        set({ selectedCompany_Goals: Company_Goals }),
    setNewCompany_Goals: (Company_Goals) =>
        set((state) => ({
            newCompany_Goals:
                typeof Company_Goals === 'function'
                    ? Company_Goals(state.newCompany_Goals)
                    : Company_Goals,
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
