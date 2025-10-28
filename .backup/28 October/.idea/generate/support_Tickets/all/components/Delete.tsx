import React from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { ISupport_Tickets, defaultSupport_Tickets } from '../store/data/data'
import { useSupport_TicketsStore } from '../store/store'
import { useDeleteSupport_TicketsMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const DeleteNextComponents: React.FC = () => {
    const {
        toggleDeleteModal,
        isDeleteModalOpen,
        selectedSupport_Tickets,
        setSelectedSupport_Tickets,
    } = useSupport_TicketsStore()
    
    const [deleteSupport_Ticket, { isLoading }] = useDeleteSupport_TicketsMutation()

    const handleDelete = async () => {
        if (selectedSupport_Tickets) {
            try {
                await deleteSupport_Ticket({
                    id: selectedSupport_Tickets._id,
                }).unwrap()
                toggleDeleteModal(false)
                handleSuccess('Delete Successful')
            } catch (error) {
                console.error('Failed to delete Support_Ticket:', error)
                handleError('Failed to delete item. Please try again.')
            }
        }
    }

    const handleCancel = () => {
        toggleDeleteModal(false)
        setSelectedSupport_Tickets({ ...defaultSupport_Tickets } as ISupport_Tickets)
    }

    const displayName = (selectedSupport_Tickets)?.['title'] || ''

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {selectedSupport_Tickets && (
                    <div className="py-4">
                        <p>
                            You are about to delete this support_ticket:{' '}
                            <span className="font-semibold">
                                {displayName}
                            </span>
                        </p>
                    </div>
                )}
                <DialogFooter>
                    <Button
                        className="cursor-pointer"
                        variant="outline"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteNextComponents
