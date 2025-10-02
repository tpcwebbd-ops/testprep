import { useState } from 'react'

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

import { useRolesStore } from '../store/store'
import { useAddRolesMutation } from '../redux/rtk-api'
import { IRoles, defaultRoles } from '@/app/generate/roles/all/store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setRoles } = useRolesStore()
    const [addRoles, { isLoading }] = useAddRolesMutation()
    const [newRole, setNewRole] = useState<IRoles>(defaultRoles)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewRole(prev => ({ ...prev, [name]: value }));
    };

    const handleAddRole = async () => {
        try {
            const { _id, ...updateData } = newRole
            console.log('Adding new record:', updateData)
            const addedRole = await addRoles(updateData).unwrap()
            setRoles([addedRole])
            toggleAddModal(false)
            setNewRole(defaultRoles)
            handleSuccess('Added Successfully')
        } catch (error: unknown) {
            console.error('Failed to add record:', error)
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
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add New Role</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="role_name" className="text-right">
                                Role_name
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={role_nameOptions} value={newRole['role_name']} onValueChange={(value) => handleFieldChange('role_name', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="description" value={newRole['description']} onChange={(e) => handleFieldChange('description', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="assign_access" className="text-right">
                                Assign_access
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="assign_access" placeholder="Assign_access" value={newRole['assign_access']} onChange={(value) => handleFieldChange('assign_access', value as string)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => toggleAddModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleAddRole}
                    >
                        {isLoading ? 'Adding...' : 'Add Role'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
