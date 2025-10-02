import React from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { IWebsite_Settings, defaultWebsite_Settings } from '../store/data/data'
import { useWebsite_SettingsStore } from '../store/store'
import { useDeleteWebsite_SettingsMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const DeleteNextComponents: React.FC = () => {
    const {
        toggleDeleteModal,
        isDeleteModalOpen,
        selectedWebsite_Settings,
        setSelectedWebsite_Settings,
    } = useWebsite_SettingsStore()
    
    const [deleteWebsite_Setting, { isLoading }] = useDeleteWebsite_SettingsMutation()

    const handleDelete = async () => {
        if (selectedWebsite_Settings) {
            try {
                await deleteWebsite_Setting({
                    id: selectedWebsite_Settings._id,
                }).unwrap()
                toggleDeleteModal(false)
                handleSuccess('Delete Successful')
            } catch (error) {
                console.error('Failed to delete Website_Setting:', error)
                handleError('Failed to delete item. Please try again.')
            }
        }
    }

    const handleCancel = () => {
        toggleDeleteModal(false)
        setSelectedWebsite_Settings({ ...defaultWebsite_Settings } as IWebsite_Settings)
    }

    const displayName = (selectedWebsite_Settings)?.['Name'] || ''

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {selectedWebsite_Settings && (
                    <div className="py-4">
                        <p>
                            You are about to delete this website_setting:{' '}
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
