import { create } from 'zustand'
import { IRewards ,defaultRewards} from '@/app/generate/rewards/all/store/data/data'
import { RewardsStore } from '@/app/generate/rewards/all/store/store-type' 
import { queryParams } from '@/app/generate/rewards/all/store/store-constant';

export const useRewardsStore = create<RewardsStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    rewards: [],
    selectedRewards: null,
    newRewards: defaultRewards,
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
    setBulkData: (bulkData: IRewards[]) => set({ bulkData }),
    setRewards: (rewards: IRewards[]) =>
        set({ rewards }),
    setSelectedRewards: (Rewards) =>
        set({ selectedRewards: Rewards }),
    setNewRewards: (Rewards) =>
        set((state) => ({
            newRewards:
                typeof Rewards === 'function'
                    ? Rewards(state.newRewards)
                    : Rewards,
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
