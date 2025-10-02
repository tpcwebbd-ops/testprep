import { create } from 'zustand'
import { IWebsite_Settings ,defaultWebsite_Settings} from '@/app/generate/website_Settings/all/store/data/data'
import { Website_SettingsStore } from '@/app/generate/website_Settings/all/store/store-type' 
import { queryParams } from '@/app/generate/website_Settings/all/store/store-constant';

export const useWebsite_SettingsStore = create<Website_SettingsStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    website_Settings: [],
    selectedWebsite_Settings: null,
    newWebsite_Settings: defaultWebsite_Settings,
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
    setBulkData: (bulkData: IWebsite_Settings[]) => set({ bulkData }),
    setWebsite_Settings: (website_Settings: IWebsite_Settings[]) =>
        set({ website_Settings }),
    setSelectedWebsite_Settings: (Website_Settings) =>
        set({ selectedWebsite_Settings: Website_Settings }),
    setNewWebsite_Settings: (Website_Settings) =>
        set((state) => ({
            newWebsite_Settings:
                typeof Website_Settings === 'function'
                    ? Website_Settings(state.newWebsite_Settings)
                    : Website_Settings,
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
