import React from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { ICompany_Goals, defaultCompany_Goals } from '../store/data/data'
import { useCompany_GoalsStore } from '../store/store'
import { useDeleteCompany_GoalsMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const DeleteNextComponents: React.FC = () => {
    const {
        toggleDeleteModal,
        isDeleteModalOpen,
        selectedCompany_Goals,
        setSelectedCompany_Goals,
    } = useCompany_GoalsStore()
    
    const [deleteCompany_Goal, { isLoading }] = useDeleteCompany_GoalsMutation()

    const handleDelete = async () => {
        if (selectedCompany_Goals) {
            try {
                await deleteCompany_Goal({
                    id: selectedCompany_Goals._id,
                }).unwrap()
                toggleDeleteModal(false)
                handleSuccess('Delete Successful')
            } catch (error) {
                console.error('Failed to delete Company_Goal:', error)
                handleError('Failed to delete item. Please try again.')
            }
        }
    }

    const handleCancel = () => {
        toggleDeleteModal(false)
        setSelectedCompany_Goals({ ...defaultCompany_Goals } as ICompany_Goals)
    }

    const displayName = (selectedCompany_Goals)?.['title'] || ''

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {selectedCompany_Goals && (
                    <div className="py-4">
                        <p>
                            You are about to delete this company_goal:{' '}
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
