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
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { IRoles, defaultRoles } from '@/app/generate/roles/all/store/data/data'
import { useRolesStore } from '../store/store'
import { useUpdateRolesMutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedRoles,
        setSelectedRoles,
    } = useRolesStore()

    const [updateRoles, { isLoading }] = useUpdateRolesMutation()
    const [editedRole, setRole] = useState<IRoles>(defaultRoles)

    useEffect(() => {
        if (selectedRoles) {
            setRole(selectedRoles)
        }
    }, [selectedRoles])

    const handleFieldChange = (name: string, value: unknown) => {
        setRole(prev => ({ ...prev, [name]: value }));
    };

    const handleEditRole = async () => {
        if (!selectedRoles) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedRole;
            await updateRoles({
                id: selectedRoles._id,
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

    const role_nameOptions = [
        { label: 'MD', value: 'MD' },
        { label: 'CTO', value: 'CTO' },
        { label: 'COO', value: 'COO' },
        { label: 'CFO', value: 'CFO' },
        { label: 'Admin', value: 'Admin' },
        { label: 'Instructor', value: 'Instructor' },
        { label: 'Moderator', value: 'Moderator' },
        { label: 'Social media manager', value: 'Social media manager' },
        { label: 'Social media marketer', value: 'Social media marketer' },
        { label: 'Mentor', value: 'Mentor' },
        { label: 'Students', value: 'Students' },
        { label: 'Users', value: 'Users' }
    ];

    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Role</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="role_name" className="text-right">
                                Role_name
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={role_nameOptions} value={editedRole['role_name']} onValueChange={(value) => handleFieldChange('role_name', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="description" value={editedRole['description']} onChange={(e) => handleFieldChange('description', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="assign_access" className="text-right">
                                Assign_access
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="assign_access" placeholder="Assign_access" value={editedRole['assign_access']} onChange={(value) => handleFieldChange('assign_access', value as string)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedRoles(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditRole}
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
