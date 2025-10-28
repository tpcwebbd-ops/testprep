import { IRewards } from '@/app/generate/rewards/all/api/v1/model'

export interface RewardsStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    rewards: IRewards[]
    selectedRewards: IRewards | null
    newRewards: Partial<IRewards>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewRewards: React.Dispatch<
        React.SetStateAction<Partial<IRewards>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IRewards[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setRewards: (Rewards: IRewards[]) => void
    setSelectedRewards: (Rewards: IRewards | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Rewards: boolean) => void
    toggleBulkUpdateModal: (Rewards: boolean) => void
    toggleBulkDynamicUpdateModal: (Rewards: boolean) => void
    toggleBulkDeleteModal: (Rewards: boolean) => void
    setBulkData: (bulkData: IRewards[]) => void
}
