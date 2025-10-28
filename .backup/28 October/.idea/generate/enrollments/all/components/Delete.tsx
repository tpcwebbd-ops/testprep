import React from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { IEnrollments, defaultEnrollments } from '../store/data/data'
import { useEnrollmentsStore } from '../store/store'
import { useDeleteEnrollmentsMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const DeleteNextComponents: React.FC = () => {
    const {
        toggleDeleteModal,
        isDeleteModalOpen,
        selectedEnrollments,
        setSelectedEnrollments,
    } = useEnrollmentsStore()
    
    const [deleteEnrollment, { isLoading }] = useDeleteEnrollmentsMutation()

    const handleDelete = async () => {
        if (selectedEnrollments) {
            try {
                await deleteEnrollment({
                    id: selectedEnrollments._id,
                }).unwrap()
                toggleDeleteModal(false)
                handleSuccess('Delete Successful')
            } catch (error) {
                console.error('Failed to delete Enrollment:', error)
                handleError('Failed to delete item. Please try again.')
            }
        }
    }

    const handleCancel = () => {
        toggleDeleteModal(false)
        setSelectedEnrollments({ ...defaultEnrollments } as IEnrollments)
    }

    const displayName = (selectedEnrollments)?.['batch_id'] || ''

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {selectedEnrollments && (
                    <div className="py-4">
                        <p>
                            You are about to delete this enrollment:{' '}
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
