import React from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { IAttendance_s, defaultAttendance_s } from '../store/data/data'
import { useAttendance_sStore } from '../store/store'
import { useDeleteAttendance_sMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const DeleteNextComponents: React.FC = () => {
    const {
        toggleDeleteModal,
        isDeleteModalOpen,
        selectedAttendance_s,
        setSelectedAttendance_s,
    } = useAttendance_sStore()
    
    const [deleteAttendance, { isLoading }] = useDeleteAttendance_sMutation()

    const handleDelete = async () => {
        if (selectedAttendance_s) {
            try {
                await deleteAttendance({
                    id: selectedAttendance_s._id,
                }).unwrap()
                toggleDeleteModal(false)
                handleSuccess('Delete Successful')
            } catch (error) {
                console.error('Failed to delete Attendance:', error)
                handleError('Failed to delete item. Please try again.')
            }
        }
    }

    const handleCancel = () => {
        toggleDeleteModal(false)
        setSelectedAttendance_s({ ...defaultAttendance_s } as IAttendance_s)
    }

    const displayName = (selectedAttendance_s)?.['user_id'] || ''

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {selectedAttendance_s && (
                    <div className="py-4">
                        <p>
                            You are about to delete this attendance:{' '}
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
