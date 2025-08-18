import React from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { usePostsStore } from '../store/Store'
import { useBulkDeletePostsMutation } from '../redux/rtk-Api'
import { handleSuccess, handleError } from './utils'

const BulkDeleteNextComponents: React.FC = () => {
    const {
        isBulkDeleteModalOpen,
        toggleBulkDeleteModal,
        bulkData,
        setBulkData,
    } = usePostsStore()
    
    const [bulkDeletePosts, { isLoading }] = useBulkDeletePostsMutation()

    const handleBulkDelete = async () => {
        if (!bulkData?.length) return
        try {
            const ids = bulkData.map((posts) => posts._id)
            await bulkDeletePosts({ ids }).unwrap()
            toggleBulkDeleteModal(false)
            setBulkData([])
            handleSuccess('Delete Successful')
        } catch (error) {
            console.error('Failed to delete Posts:', error)
            handleError('Failed to delete items. Please try again.')
        }
    }

    return (
        <Dialog
            open={isBulkDeleteModalOpen}
            onOpenChange={toggleBulkDeleteModal}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {bulkData?.length > 0 && (
                    <div className="pt-4">
                        <p>
                            You are about to delete{' '}
                            <span className="font-semibold">
                                ({bulkData.length})
                            </span>{' '}
                            posts.
                        </p>
                    </div>
                )}
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="flex flex-col">
                        {bulkData.map((posts, idx) => (
                            <span
                                key={(posts._id as string) + idx}
                                className="text-xs"
                            >
                                {idx + 1}. {(posts as any)['title'] as string || ''}
                            </span>
                        ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button
                        className="cursor-pointer"
                        variant="outline"
                        onClick={() => toggleBulkDeleteModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        variant="destructive"
                        onClick={handleBulkDelete}
                    >
                        {isLoading ? 'Deleting...' : 'Delete Selected'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BulkDeleteNextComponents
