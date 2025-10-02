import { create } from 'zustand'
import { IAttendance_s ,defaultAttendance_s} from '@/app/generate/attendance_s/all/store/data/data'
import { Attendance_sStore } from '@/app/generate/attendance_s/all/store/store-type' 
import { queryParams } from '@/app/generate/attendance_s/all/store/store-constant';

export const useAttendance_sStore = create<Attendance_sStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    attendance_s: [],
    selectedAttendance_s: null,
    newAttendance_s: defaultAttendance_s,
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
    setBulkData: (bulkData: IAttendance_s[]) => set({ bulkData }),
    setAttendance_s: (attendance_s: IAttendance_s[]) =>
        set({ attendance_s }),
    setSelectedAttendance_s: (Attendance_s) =>
        set({ selectedAttendance_s: Attendance_s }),
    setNewAttendance_s: (Attendance_s) =>
        set((state) => ({
            newAttendance_s:
                typeof Attendance_s === 'function'
                    ? Attendance_s(state.newAttendance_s)
                    : Attendance_s,
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
