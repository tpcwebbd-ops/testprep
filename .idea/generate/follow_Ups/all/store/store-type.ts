import { IFollow_Ups } from '@/app/generate/follow_Ups/all/api/v1/model'

export interface Follow_UpsStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    follow_Ups: IFollow_Ups[]
    selectedFollow_Ups: IFollow_Ups | null
    newFollow_Ups: Partial<IFollow_Ups>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewFollow_Ups: React.Dispatch<
        React.SetStateAction<Partial<IFollow_Ups>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IFollow_Ups[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setFollow_Ups: (Follow_Ups: IFollow_Ups[]) => void
    setSelectedFollow_Ups: (Follow_Ups: IFollow_Ups | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Follow_Ups: boolean) => void
    toggleBulkUpdateModal: (Follow_Ups: boolean) => void
    toggleBulkDynamicUpdateModal: (Follow_Ups: boolean) => void
    toggleBulkDeleteModal: (Follow_Ups: boolean) => void
    setBulkData: (bulkData: IFollow_Ups[]) => void
}
