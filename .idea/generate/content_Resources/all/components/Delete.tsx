import React from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { IContent_Resources, defaultContent_Resources } from '../store/data/data'
import { useContent_ResourcesStore } from '../store/store'
import { useDeleteContent_ResourcesMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const DeleteNextComponents: React.FC = () => {
    const {
        toggleDeleteModal,
        isDeleteModalOpen,
        selectedContent_Resources,
        setSelectedContent_Resources,
    } = useContent_ResourcesStore()
    
    const [deleteContent_Resourc, { isLoading }] = useDeleteContent_ResourcesMutation()

    const handleDelete = async () => {
        if (selectedContent_Resources) {
            try {
                await deleteContent_Resourc({
                    id: selectedContent_Resources._id,
                }).unwrap()
                toggleDeleteModal(false)
                handleSuccess('Delete Successful')
            } catch (error) {
                console.error('Failed to delete Content_Resourc:', error)
                handleError('Failed to delete item. Please try again.')
            }
        }
    }

    const handleCancel = () => {
        toggleDeleteModal(false)
        setSelectedContent_Resources({ ...defaultContent_Resources } as IContent_Resources)
    }

    const displayName = (selectedContent_Resources)?.['title'] || ''

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {selectedContent_Resources && (
                    <div className="py-4">
                        <p>
                            You are about to delete this content_resourc:{' '}
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
