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

import { IProfiles, defaultProfiles } from '@/app/generate/profiles/all/store/data/data'
import { useProfilesStore } from '../store/store'
import { useUpdateProfilesMutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedProfiles,
        setSelectedProfiles,
    } = useProfilesStore()

    const [updateProfiles, { isLoading }] = useUpdateProfilesMutation()
    const [editedProfile, setProfile] = useState<IProfiles>(defaultProfiles)

    useEffect(() => {
        if (selectedProfiles) {
            setProfile(selectedProfiles)
        }
    }, [selectedProfiles])

    const handleFieldChange = (name: string, value: unknown) => {
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleEditProfile = async () => {
        if (!selectedProfiles) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedProfile;
            await updateProfiles({
                id: selectedProfiles._id,
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
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="user_id" className="text-right">
                                User_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="user_id" placeholder="User_id" value={editedProfile['user_id']} onChange={(value) => handleFieldChange('user_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="address" className="text-right">
                                Address
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="address" placeholder="Address" value={editedProfile['address']} onChange={(value) => handleFieldChange('address', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="bio" className="text-right">
                                Bio
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="bio" value={editedProfile['bio']} onChange={(e) => handleFieldChange('bio', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="social_links" className="text-right">
                                Social_links
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="social_links" placeholder="Social_links" value={editedProfile['social_links']} onChange={(value) => handleFieldChange('social_links', value as string)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedProfiles(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditProfile}
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
