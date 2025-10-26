// ../store/jsonStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { JsonTemplate } from '../components/JsonEditor'

// Define the type for an item stored in the JSON store
export interface JsonTemplateItem {
    // Renamed from JsonItem to JsonTemplateItem and exported
    id: string
    data: JsonTemplate // 'data' is now strongly typed as JsonTemplate
    timestamp: number
}

interface JsonStore {
    items: JsonTemplateItem[] // Use JsonTemplateItem here
    addItem: (data: JsonTemplate) => void // 'data' is now strongly typed
    removeItem: (id: string) => void
    updateItem: (id: string, newData: JsonTemplate) => void // 'newData' is now strongly typed
    clearItems: () => void
}

export const useJsonStore = create<JsonStore>()(
    persist(
        (set) => ({
            items: [],
            addItem: (data) =>
                set((state) => ({
                    items: [
                        { id: uuidv4(), data, timestamp: Date.now() },
                        ...state.items,
                    ],
                })),
            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),
            updateItem: (
                id,
                newData // 'newData' is now strongly typed
            ) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id
                            ? { ...item, data: newData, timestamp: Date.now() }
                            : item
                    ),
                })),
            clearItems: () => set({ items: [] }),
        }),
        {
            name: 'json-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
