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
import PhoneInputField from '@/components/dashboard-ui/PhoneInputField'
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import UrlInputField from '@/components/dashboard-ui/UrlInputField'

import { useWebsite_SettingsStore } from '../store/store'
import { useAddWebsite_SettingsMutation } from '../redux/rtk-api'
import { IWebsite_Settings, defaultWebsite_Settings } from '@/app/generate/website_Settings/all/store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setWebsite_Settings } = useWebsite_SettingsStore()
    const [addWebsite_Settings, { isLoading }] = useAddWebsite_SettingsMutation()
    const [newWebsite_Setting, setNewWebsite_Setting] = useState<IWebsite_Settings>(defaultWebsite_Settings)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewWebsite_Setting(prev => ({ ...prev, [name]: value }));
    };

    const handleAddWebsite_Setting = async () => {
        try {
            const { _id, ...updateData } = newWebsite_Setting
            console.log('Adding new record:', updateData)
            const addedWebsite_Setting = await addWebsite_Settings(updateData).unwrap()
            setWebsite_Settings([addedWebsite_Setting])
            toggleAddModal(false)
            setNewWebsite_Setting(defaultWebsite_Settings)
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
                    <DialogTitle>Add New Website_Setting</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="Name" className="text-right">
                                Name
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="Name" placeholder="Name" value={newWebsite_Setting['Name']} onChange={(value) => handleFieldChange('Name', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="logourl" className="text-right">
                                Logourl
                            </Label>
                            <div className="col-span-3">
                                <UrlInputField id="logourl" value={newWebsite_Setting['logourl']} onChange={(value) => handleFieldChange('logourl', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="description" value={newWebsite_Setting['description']} onChange={(e) => handleFieldChange('description', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="short description" className="text-right">
                                Short Description
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="short description" value={newWebsite_Setting['short description']} onChange={(e) => handleFieldChange('short description', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="mobileNumber" className="text-right">
                                MobileNumber
                            </Label>
                            <div className="col-span-3">
                                <PhoneInputField id="mobileNumber" value={newWebsite_Setting['mobileNumber']} onChange={(value) => handleFieldChange('mobileNumber', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="address" className="text-right">
                                Address
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="address" value={newWebsite_Setting['address']} onChange={(e) => handleFieldChange('address', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="menu" className="text-right">
                                Menu
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="menu" placeholder="Menu" value={newWebsite_Setting['menu']} onChange={(value) => handleFieldChange('menu', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="footer" className="text-right">
                                Footer
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="footer" placeholder="Footer" value={newWebsite_Setting['footer']} onChange={(value) => handleFieldChange('footer', value as string)} />
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
                        onClick={handleAddWebsite_Setting}
                    >
                        {isLoading ? 'Adding...' : 'Add Website_Setting'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
