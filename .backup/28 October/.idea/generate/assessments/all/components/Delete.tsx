import React from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { IAssessments, defaultAssessments } from '../store/data/data'
import { useAssessmentsStore } from '../store/store'
import { useDeleteAssessmentsMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const DeleteNextComponents: React.FC = () => {
    const {
        toggleDeleteModal,
        isDeleteModalOpen,
        selectedAssessments,
        setSelectedAssessments,
    } = useAssessmentsStore()
    
    const [deleteAssessment, { isLoading }] = useDeleteAssessmentsMutation()

    const handleDelete = async () => {
        if (selectedAssessments) {
            try {
                await deleteAssessment({
                    id: selectedAssessments._id,
                }).unwrap()
                toggleDeleteModal(false)
                handleSuccess('Delete Successful')
            } catch (error) {
                console.error('Failed to delete Assessment:', error)
                handleError('Failed to delete item. Please try again.')
            }
        }
    }

    const handleCancel = () => {
        toggleDeleteModal(false)
        setSelectedAssessments({ ...defaultAssessments } as IAssessments)
    }

    const displayName = (selectedAssessments)?.['title'] || ''

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {selectedAssessments && (
                    <div className="py-4">
                        <p>
                            You are about to delete this assessment:{' '}
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
