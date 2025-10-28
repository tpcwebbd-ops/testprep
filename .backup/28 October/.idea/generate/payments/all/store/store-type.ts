import { IPayments } from '@/app/generate/payments/all/api/v1/model'

export interface PaymentsStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    payments: IPayments[]
    selectedPayments: IPayments | null
    newPayments: Partial<IPayments>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewPayments: React.Dispatch<
        React.SetStateAction<Partial<IPayments>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IPayments[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setPayments: (Payments: IPayments[]) => void
    setSelectedPayments: (Payments: IPayments | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Payments: boolean) => void
    toggleBulkUpdateModal: (Payments: boolean) => void
    toggleBulkDynamicUpdateModal: (Payments: boolean) => void
    toggleBulkDeleteModal: (Payments: boolean) => void
    setBulkData: (bulkData: IPayments[]) => void
}
