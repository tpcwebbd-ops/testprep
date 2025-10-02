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

import { useQ_and_A_sStore } from '../store/store'
import { useBulkDeleteQ_and_A_sMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const BulkDeleteNextComponents: React.FC = () => {
    const {
        isBulkDeleteModalOpen,
        toggleBulkDeleteModal,
        bulkData,
        setBulkData,
    } = useQ_and_A_sStore()
    
    const [bulkDeleteQ_and_A_s, { isLoading }] = useBulkDeleteQ_and_A_sMutation()

    const handleBulkDelete = async () => {
        if (!bulkData?.length) return
        try {
            const ids = bulkData.map((q_and_a_s) => q_and_a_s._id)
            await bulkDeleteQ_and_A_s({ ids }).unwrap()
            toggleBulkDeleteModal(false)
            setBulkData([])
            handleSuccess('Delete Successful')
        } catch (error) {
            console.error('Failed to delete Q_and_A_s:', error)
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
                            q_and_A_s.
                        </p>
                    </div>
                )}
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="flex flex-col">
                        {bulkData.map((q_and_a_s, idx) => (
                            <span
                                key={(q_and_a_s._id as string) + idx}
                                className="text-xs"
                            >
                                {idx + 1}. {(q_and_a_s)['course_id'] as string || ''}
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
