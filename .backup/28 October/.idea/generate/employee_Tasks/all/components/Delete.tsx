import React from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { IEmployee_Tasks, defaultEmployee_Tasks } from '../store/data/data'
import { useEmployee_TasksStore } from '../store/store'
import { useDeleteEmployee_TasksMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const DeleteNextComponents: React.FC = () => {
    const {
        toggleDeleteModal,
        isDeleteModalOpen,
        selectedEmployee_Tasks,
        setSelectedEmployee_Tasks,
    } = useEmployee_TasksStore()
    
    const [deleteEmployee_Task, { isLoading }] = useDeleteEmployee_TasksMutation()

    const handleDelete = async () => {
        if (selectedEmployee_Tasks) {
            try {
                await deleteEmployee_Task({
                    id: selectedEmployee_Tasks._id,
                }).unwrap()
                toggleDeleteModal(false)
                handleSuccess('Delete Successful')
            } catch (error) {
                console.error('Failed to delete Employee_Task:', error)
                handleError('Failed to delete item. Please try again.')
            }
        }
    }

    const handleCancel = () => {
        toggleDeleteModal(false)
        setSelectedEmployee_Tasks({ ...defaultEmployee_Tasks } as IEmployee_Tasks)
    }

    const displayName = (selectedEmployee_Tasks)?.['title'] || ''

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {selectedEmployee_Tasks && (
                    <div className="py-4">
                        <p>
                            You are about to delete this employee_task:{' '}
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
