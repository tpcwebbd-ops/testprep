import { IAttendance_s } from '@/app/generate/attendance_s/all/api/v1/model'

export interface Attendance_sStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    attendance_s: IAttendance_s[]
    selectedAttendance_s: IAttendance_s | null
    newAttendance_s: Partial<IAttendance_s>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewAttendance_s: React.Dispatch<
        React.SetStateAction<Partial<IAttendance_s>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IAttendance_s[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setAttendance_s: (Attendance_s: IAttendance_s[]) => void
    setSelectedAttendance_s: (Attendance_s: IAttendance_s | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Attendance_s: boolean) => void
    toggleBulkUpdateModal: (Attendance_s: boolean) => void
    toggleBulkDynamicUpdateModal: (Attendance_s: boolean) => void
    toggleBulkDeleteModal: (Attendance_s: boolean) => void
    setBulkData: (bulkData: IAttendance_s[]) => void
}
