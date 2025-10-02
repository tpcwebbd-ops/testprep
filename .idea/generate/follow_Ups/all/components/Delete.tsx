import React from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { IFollow_Ups, defaultFollow_Ups } from '../store/data/data'
import { useFollow_UpsStore } from '../store/store'
import { useDeleteFollow_UpsMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const DeleteNextComponents: React.FC = () => {
    const {
        toggleDeleteModal,
        isDeleteModalOpen,
        selectedFollow_Ups,
        setSelectedFollow_Ups,
    } = useFollow_UpsStore()
    
    const [deleteFollow_Up, { isLoading }] = useDeleteFollow_UpsMutation()

    const handleDelete = async () => {
        if (selectedFollow_Ups) {
            try {
                await deleteFollow_Up({
                    id: selectedFollow_Ups._id,
                }).unwrap()
                toggleDeleteModal(false)
                handleSuccess('Delete Successful')
            } catch (error) {
                console.error('Failed to delete Follow_Up:', error)
                handleError('Failed to delete item. Please try again.')
            }
        }
    }

    const handleCancel = () => {
        toggleDeleteModal(false)
        setSelectedFollow_Ups({ ...defaultFollow_Ups } as IFollow_Ups)
    }

    const displayName = (selectedFollow_Ups)?.['lead_id'] || ''

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {selectedFollow_Ups && (
                    <div className="py-4">
                        <p>
                            You are about to delete this follow_up:{' '}
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
