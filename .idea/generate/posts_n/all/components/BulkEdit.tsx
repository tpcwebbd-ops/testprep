import React from 'react'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { IPosts_n } from '../store/data/data'
import { usePosts_nStore } from '../store/store'
import { useBulkUpdatePosts_nMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const BulkEditNextComponents: React.FC = () => {
    const { isBulkEditModalOpen, toggleBulkEditModal, bulkData, setBulkData } =
        usePosts_nStore()
    const [bulkUpdatePosts_n, { isLoading }] = useBulkUpdatePosts_nMutation()

    const handleBulkEditPosts_n = async () => {
        if (!bulkData.length) return
        try {
            const newBulkData = bulkData.map(({ _id, ...rest }) => ({
                id: _id,
                updateData: rest,
            }))
            await bulkUpdatePosts_n(newBulkData).unwrap()
            toggleBulkEditModal(false)
            setBulkData([])
            handleSuccess('Edit Successful')
        } catch (error) {
            console.error('Failed to edit posts_n:', error)
            handleError('Failed to update items. Please try again.')
        }
    }

    const handleFieldChange = (itemId: string, fieldName: string, value: string) => {
        setBulkData(
            bulkData.map((post_n) =>
                post_n._id === itemId
                    ? { ...post_n, [fieldName]: value }
                    : post_n
            ) as IPosts_n[]
        )
    }

    return (
        <Dialog open={isBulkEditModalOpen} onOpenChange={toggleBulkEditModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Bulk Update</DialogTitle>
                </DialogHeader>
                {bulkData.length > 0 && (
                    <p className="pt-4">
                        You are about to update{' '}
                        <span className="font-semibold">
                            ({bulkData.length})
                        </span>{' '}
                        posts_n.
                    </p>
                )}
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="flex flex-col gap-2">
                        {bulkData.map((post_n, idx) => (
                            <div
                                key={(post_n._id as string) || idx}
                                className="flex items-center justify-between"
                            >
                                <span>
                                    {idx + 1}. {(post_n)['title'] as string || ''}
                                </span>
                                
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => toggleBulkEditModal(false)}
                        className="cursor-pointer border-slate-400 hover:border-slate-500"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        variant="outline"
                        onClick={handleBulkEditPosts_n}
                        className="text-green-500 hover:text-green-600 cursor-pointer bg-green-100 hover:bg-green-200 border border-green-300 hover:border-green-400"
                    >
                        {isLoading ? 'Updating...' : 'Update Selected'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BulkEditNextComponents
