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

import { useSupport_TicketsStore } from '../store/store'
import { useBulkDeleteSupport_TicketsMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const BulkDeleteNextComponents: React.FC = () => {
    const {
        isBulkDeleteModalOpen,
        toggleBulkDeleteModal,
        bulkData,
        setBulkData,
    } = useSupport_TicketsStore()
    
    const [bulkDeleteSupport_Tickets, { isLoading }] = useBulkDeleteSupport_TicketsMutation()

    const handleBulkDelete = async () => {
        if (!bulkData?.length) return
        try {
            const ids = bulkData.map((support_tickets) => support_tickets._id)
            await bulkDeleteSupport_Tickets({ ids }).unwrap()
            toggleBulkDeleteModal(false)
            setBulkData([])
            handleSuccess('Delete Successful')
        } catch (error) {
            console.error('Failed to delete Support_Tickets:', error)
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
                            support_Tickets.
                        </p>
                    </div>
                )}
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="flex flex-col">
                        {bulkData.map((support_tickets, idx) => (
                            <span
                                key={(support_tickets._id as string) + idx}
                                className="text-xs"
                            >
                                {idx + 1}. {(support_tickets)['title'] as string || ''}
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
