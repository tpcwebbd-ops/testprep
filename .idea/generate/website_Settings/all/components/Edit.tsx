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
import PhoneInputField from '@/components/dashboard-ui/PhoneInputField'
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import UrlInputField from '@/components/dashboard-ui/UrlInputField'

import { IWebsite_Settings, defaultWebsite_Settings } from '@/app/generate/website_Settings/all/store/data/data'
import { useWebsite_SettingsStore } from '../store/store'
import { useUpdateWebsite_SettingsMutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedWebsite_Settings,
        setSelectedWebsite_Settings,
    } = useWebsite_SettingsStore()

    const [updateWebsite_Settings, { isLoading }] = useUpdateWebsite_SettingsMutation()
    const [editedWebsite_Setting, setWebsite_Setting] = useState<IWebsite_Settings>(defaultWebsite_Settings)

    useEffect(() => {
        if (selectedWebsite_Settings) {
            setWebsite_Setting(selectedWebsite_Settings)
        }
    }, [selectedWebsite_Settings])

    const handleFieldChange = (name: string, value: unknown) => {
        setWebsite_Setting(prev => ({ ...prev, [name]: value }));
    };

    const handleEditWebsite_Setting = async () => {
        if (!selectedWebsite_Settings) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedWebsite_Setting;
            await updateWebsite_Settings({
                id: selectedWebsite_Settings._id,
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
                    <DialogTitle>Edit Website_Setting</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="Name" className="text-right">
                                Name
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="Name" placeholder="Name" value={editedWebsite_Setting['Name']} onChange={(value) => handleFieldChange('Name', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="logourl" className="text-right">
                                Logourl
                            </Label>
                            <div className="col-span-3">
                                <UrlInputField id="logourl" value={editedWebsite_Setting['logourl']} onChange={(value) => handleFieldChange('logourl', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="description" value={editedWebsite_Setting['description']} onChange={(e) => handleFieldChange('description', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="short description" className="text-right">
                                Short Description
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="short description" value={editedWebsite_Setting['short description']} onChange={(e) => handleFieldChange('short description', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="mobileNumber" className="text-right">
                                MobileNumber
                            </Label>
                            <div className="col-span-3">
                                <PhoneInputField id="mobileNumber" value={editedWebsite_Setting['mobileNumber']} onChange={(value) => handleFieldChange('mobileNumber', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="address" className="text-right">
                                Address
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="address" value={editedWebsite_Setting['address']} onChange={(e) => handleFieldChange('address', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="menu" className="text-right">
                                Menu
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="menu" placeholder="Menu" value={editedWebsite_Setting['menu']} onChange={(value) => handleFieldChange('menu', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="footer" className="text-right">
                                Footer
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="footer" placeholder="Footer" value={editedWebsite_Setting['footer']} onChange={(value) => handleFieldChange('footer', value as string)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedWebsite_Settings(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditWebsite_Setting}
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
