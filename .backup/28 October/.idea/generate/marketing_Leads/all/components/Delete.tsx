import React from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { IMarketing_Leads, defaultMarketing_Leads } from '../store/data/data'
import { useMarketing_LeadsStore } from '../store/store'
import { useDeleteMarketing_LeadsMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const DeleteNextComponents: React.FC = () => {
    const {
        toggleDeleteModal,
        isDeleteModalOpen,
        selectedMarketing_Leads,
        setSelectedMarketing_Leads,
    } = useMarketing_LeadsStore()
    
    const [deleteMarketing_Lead, { isLoading }] = useDeleteMarketing_LeadsMutation()

    const handleDelete = async () => {
        if (selectedMarketing_Leads) {
            try {
                await deleteMarketing_Lead({
                    id: selectedMarketing_Leads._id,
                }).unwrap()
                toggleDeleteModal(false)
                handleSuccess('Delete Successful')
            } catch (error) {
                console.error('Failed to delete Marketing_Lead:', error)
                handleError('Failed to delete item. Please try again.')
            }
        }
    }

    const handleCancel = () => {
        toggleDeleteModal(false)
        setSelectedMarketing_Leads({ ...defaultMarketing_Leads } as IMarketing_Leads)
    }

    const displayName = (selectedMarketing_Leads)?.['full_name'] || ''

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {selectedMarketing_Leads && (
                    <div className="py-4">
                        <p>
                            You are about to delete this marketing_lead:{' '}
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
