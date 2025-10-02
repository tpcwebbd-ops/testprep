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

import { useProfilesStore } from '../store/store'
import { useAddProfilesMutation } from '../redux/rtk-api'
import { IProfiles, defaultProfiles } from '@/app/generate/profiles/all/store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setProfiles } = useProfilesStore()
    const [addProfiles, { isLoading }] = useAddProfilesMutation()
    const [newProfile, setNewProfile] = useState<IProfiles>(defaultProfiles)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleAddProfile = async () => {
        try {
            const { _id, ...updateData } = newProfile
            console.log('Adding new record:', updateData)
            const addedProfile = await addProfiles(updateData).unwrap()
            setProfiles([addedProfile])
            toggleAddModal(false)
            setNewProfile(defaultProfiles)
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
                    <DialogTitle>Add New Profile</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="user_id" className="text-right">
                                User_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="user_id" placeholder="User_id" value={newProfile['user_id']} onChange={(value) => handleFieldChange('user_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="address" className="text-right">
                                Address
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="address" placeholder="Address" value={newProfile['address']} onChange={(value) => handleFieldChange('address', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="bio" className="text-right">
                                Bio
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="bio" value={newProfile['bio']} onChange={(e) => handleFieldChange('bio', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="social_links" className="text-right">
                                Social_links
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="social_links" placeholder="Social_links" value={newProfile['social_links']} onChange={(value) => handleFieldChange('social_links', value as string)} />
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
                        onClick={handleAddProfile}
                    >
                        {isLoading ? 'Adding...' : 'Add Profile'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
