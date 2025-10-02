import React, { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

// Dynamically import only the components needed for the form
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString'

import { IRoles_Management_s, defaultRoles_Management_s } from '@/app/generate/roles_Management_s/all/store/data/data'
import { useRoles_Management_sStore } from '../store/store'
import { useUpdateRoles_Management_sMutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedRoles_Management_s,
        setSelectedRoles_Management_s,
    } = useRoles_Management_sStore()

    const [updateRoles_Management_s, { isLoading }] = useUpdateRoles_Management_sMutation()
    const [editedRoles_Management, setRoles_Management] = useState<IRoles_Management_s>(defaultRoles_Management_s)

    useEffect(() => {
        if (selectedRoles_Management_s) {
            setRoles_Management(selectedRoles_Management_s)
        }
    }, [selectedRoles_Management_s])

    const handleFieldChange = (name: string, value: unknown) => {
        setRoles_Management(prev => ({ ...prev, [name]: value }));
    };

    const handleEditRoles_Management = async () => {
        if (!selectedRoles_Management_s) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedRoles_Management;
            await updateRoles_Management_s({
                id: selectedRoles_Management_s._id,
                ...updateData,
            }).unwrap()
            toggleEditModal(false)
            handleSuccess('Edit Successful')
        } catch (error: unknown) {
            console.error('Failed to update record:', error)
            let errMessage: string = 'An unknown error occurred.'
            if (isApiErrorResponse(error)) {
                errMessage = formatDuplicateKeyError(error.data.message) || 'An API error occurred.'
            } else if (error instanceof Error) {
                errMessage = error.message
            }
            handleError(errMessage)
        }
    }



    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Roles_Management</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="users_id" className="text-right">
                                Users_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="users_id" placeholder="Users_id" value={editedRoles_Management['users_id']} onChange={(value) => handleFieldChange('users_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="role_ids" className="text-right">
                                Role_ids
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="role_ids" placeholder="Role_ids" value={editedRoles_Management['role_ids']} onChange={(value) => handleFieldChange('role_ids', value as string)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedRoles_Management_s(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditRoles_Management}
                        className="bg-green-100 text-green-600 hover:bg-green-200"
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditNextComponents
