import { create } from 'zustand'
import { IMessages ,defaultMessages} from '@/app/generate/messages/all/store/data/data'
import { MessagesStore } from '@/app/generate/messages/all/store/store-type' 
import { queryParams } from '@/app/generate/messages/all/store/store-constant';

export const useMessagesStore = create<MessagesStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    messages: [],
    selectedMessages: null,
    newMessages: defaultMessages,
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
    setBulkData: (bulkData: IMessages[]) => set({ bulkData }),
    setMessages: (messages: IMessages[]) =>
        set({ messages }),
    setSelectedMessages: (Messages) =>
        set({ selectedMessages: Messages }),
    setNewMessages: (Messages) =>
        set((state) => ({
            newMessages:
                typeof Messages === 'function'
                    ? Messages(state.newMessages)
                    : Messages,
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
