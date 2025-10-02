import { IQ_and_A_s } from '@/app/generate/q_and_A_s/all/api/v1/model'

export interface Q_and_A_sStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    q_and_A_s: IQ_and_A_s[]
    selectedQ_and_A_s: IQ_and_A_s | null
    newQ_and_A_s: Partial<IQ_and_A_s>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewQ_and_A_s: React.Dispatch<
        React.SetStateAction<Partial<IQ_and_A_s>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IQ_and_A_s[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setQ_and_A_s: (Q_and_A_s: IQ_and_A_s[]) => void
    setSelectedQ_and_A_s: (Q_and_A_s: IQ_and_A_s | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Q_and_A_s: boolean) => void
    toggleBulkUpdateModal: (Q_and_A_s: boolean) => void
    toggleBulkDynamicUpdateModal: (Q_and_A_s: boolean) => void
    toggleBulkDeleteModal: (Q_and_A_s: boolean) => void
    setBulkData: (bulkData: IQ_and_A_s[]) => void
}
