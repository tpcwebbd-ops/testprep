import React from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { IQ_and_A_s, defaultQ_and_A_s } from '../store/data/data'
import { useQ_and_A_sStore } from '../store/store'
import { useDeleteQ_and_A_sMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const DeleteNextComponents: React.FC = () => {
    const {
        toggleDeleteModal,
        isDeleteModalOpen,
        selectedQ_and_A_s,
        setSelectedQ_and_A_s,
    } = useQ_and_A_sStore()
    
    const [deleteQ_and_A, { isLoading }] = useDeleteQ_and_A_sMutation()

    const handleDelete = async () => {
        if (selectedQ_and_A_s) {
            try {
                await deleteQ_and_A({
                    id: selectedQ_and_A_s._id,
                }).unwrap()
                toggleDeleteModal(false)
                handleSuccess('Delete Successful')
            } catch (error) {
                console.error('Failed to delete Q_and_A:', error)
                handleError('Failed to delete item. Please try again.')
            }
        }
    }

    const handleCancel = () => {
        toggleDeleteModal(false)
        setSelectedQ_and_A_s({ ...defaultQ_and_A_s } as IQ_and_A_s)
    }

    const displayName = (selectedQ_and_A_s)?.['course_id'] || ''

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {selectedQ_and_A_s && (
                    <div className="py-4">
                        <p>
                            You are about to delete this q_and_a:{' '}
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
