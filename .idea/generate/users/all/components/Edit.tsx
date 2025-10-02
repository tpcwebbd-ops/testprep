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
import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail'
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString'
import PhoneInputField from '@/components/dashboard-ui/PhoneInputField'
import UrlInputField from '@/components/dashboard-ui/UrlInputField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { IUsers, defaultUsers } from '@/app/generate/users/all/store/data/data'
import { useUsersStore } from '../store/store'
import { useUpdateUsersMutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedUsers,
        setSelectedUsers,
    } = useUsersStore()

    const [updateUsers, { isLoading }] = useUpdateUsersMutation()
    const [editedUser, setUser] = useState<IUsers>(defaultUsers)

    useEffect(() => {
        if (selectedUsers) {
            setUser(selectedUsers)
        }
    }, [selectedUsers])

    const handleFieldChange = (name: string, value: unknown) => {
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleEditUser = async () => {
        if (!selectedUsers) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedUser;
            await updateUsers({
                id: selectedUsers._id,
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

    const sign_up_byOptions = [
        { label: 'Google', value: 'Google' },
        { label: 'Email', value: 'Email' }
    ];

    const statusOptions = [
        { label: 'active', value: 'active' },
        { label: 'inactive', value: 'inactive' },
        { label: 'suspended', value: 'suspended' }
    ];

    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="full_name" className="text-right">
                                Full_name
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="full_name" placeholder="Full_name" value={editedUser['full_name']} onChange={(value) => handleFieldChange('full_name', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="uid" className="text-right">
                                Uid
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="uid" placeholder="Uid" value={editedUser['uid']} onChange={(value) => handleFieldChange('uid', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForEmail id="email" value={editedUser['email']} onChange={(value) => handleFieldChange('email', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="password_hash" className="text-right">
                                Password_hash
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="password_hash" placeholder="Password_hash" value={editedUser['password_hash']} onChange={(value) => handleFieldChange('password_hash', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="phone_number" className="text-right">
                                Phone_number
                            </Label>
                            <div className="col-span-3">
                                <PhoneInputField id="phone_number" value={editedUser['phone_number']} onChange={(value) => handleFieldChange('phone_number', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="profile_image_url" className="text-right">
                                Profile_image_url
                            </Label>
                            <div className="col-span-3">
                                <UrlInputField id="profile_image_url" value={editedUser['profile_image_url']} onChange={(value) => handleFieldChange('profile_image_url', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="sign_up_by" className="text-right">
                                Sign_up_by
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={sign_up_byOptions} value={editedUser['sign_up_by']} onValueChange={(value) => handleFieldChange('sign_up_by', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={statusOptions} value={editedUser['status']} onValueChange={(value) => handleFieldChange('status', value)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedUsers(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditUser}
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
