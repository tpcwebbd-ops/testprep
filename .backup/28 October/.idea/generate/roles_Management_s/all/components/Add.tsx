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

import { useRoles_Management_sStore } from '../store/store'
import { useAddRoles_Management_sMutation } from '../redux/rtk-api'
import { IRoles_Management_s, defaultRoles_Management_s } from '@/app/generate/roles_Management_s/all/store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setRoles_Management_s } = useRoles_Management_sStore()
    const [addRoles_Management_s, { isLoading }] = useAddRoles_Management_sMutation()
    const [newRoles_Management, setNewRoles_Management] = useState<IRoles_Management_s>(defaultRoles_Management_s)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewRoles_Management(prev => ({ ...prev, [name]: value }));
    };

    const handleAddRoles_Management = async () => {
        try {
            const { _id, ...updateData } = newRoles_Management
            console.log('Adding new record:', updateData)
            const addedRoles_Management = await addRoles_Management_s(updateData).unwrap()
            setRoles_Management_s([addedRoles_Management])
            toggleAddModal(false)
            setNewRoles_Management(defaultRoles_Management_s)
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



    return (
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add New Roles_Management</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="users_id" className="text-right">
                                Users_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="users_id" placeholder="Users_id" value={newRoles_Management['users_id']} onChange={(value) => handleFieldChange('users_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="role_ids" className="text-right">
                                Role_ids
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="role_ids" placeholder="Role_ids" value={newRoles_Management['role_ids']} onChange={(value) => handleFieldChange('role_ids', value as string)} />
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
                        onClick={handleAddRoles_Management}
                    >
                        {isLoading ? 'Adding...' : 'Add Roles_Management'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
