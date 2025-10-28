import { create } from 'zustand'
import { IProfiles ,defaultProfiles} from '@/app/generate/profiles/all/store/data/data'
import { ProfilesStore } from '@/app/generate/profiles/all/store/store-type' 
import { queryParams } from '@/app/generate/profiles/all/store/store-constant';

export const useProfilesStore = create<ProfilesStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    profiles: [],
    selectedProfiles: null,
    newProfiles: defaultProfiles,
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
    setBulkData: (bulkData: IProfiles[]) => set({ bulkData }),
    setProfiles: (profiles: IProfiles[]) =>
        set({ profiles }),
    setSelectedProfiles: (Profiles) =>
        set({ selectedProfiles: Profiles }),
    setNewProfiles: (Profiles) =>
        set((state) => ({
            newProfiles:
                typeof Profiles === 'function'
                    ? Profiles(state.newProfiles)
                    : Profiles,
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
