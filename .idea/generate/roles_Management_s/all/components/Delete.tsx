import React from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { IRoles_Management_s, defaultRoles_Management_s } from '../store/data/data'
import { useRoles_Management_sStore } from '../store/store'
import { useDeleteRoles_Management_sMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const DeleteNextComponents: React.FC = () => {
    const {
        toggleDeleteModal,
        isDeleteModalOpen,
        selectedRoles_Management_s,
        setSelectedRoles_Management_s,
    } = useRoles_Management_sStore()
    
    const [deleteRoles_Management, { isLoading }] = useDeleteRoles_Management_sMutation()

    const handleDelete = async () => {
        if (selectedRoles_Management_s) {
            try {
                await deleteRoles_Management({
                    id: selectedRoles_Management_s._id,
                }).unwrap()
                toggleDeleteModal(false)
                handleSuccess('Delete Successful')
            } catch (error) {
                console.error('Failed to delete Roles_Management:', error)
                handleError('Failed to delete item. Please try again.')
            }
        }
    }

    const handleCancel = () => {
        toggleDeleteModal(false)
        setSelectedRoles_Management_s({ ...defaultRoles_Management_s } as IRoles_Management_s)
    }

    const displayName = (selectedRoles_Management_s)?.['users_id'] || ''

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {selectedRoles_Management_s && (
                    <div className="py-4">
                        <p>
                            You are about to delete this roles_management:{' '}
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
