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
import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail'
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString'
import PhoneInputField from '@/components/dashboard-ui/PhoneInputField'
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { useMarketing_LeadsStore } from '../store/store'
import { useAddMarketing_LeadsMutation } from '../redux/rtk-api'
import { IMarketing_Leads, defaultMarketing_Leads } from '@/app/generate/marketing_Leads/all/store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setMarketing_Leads } = useMarketing_LeadsStore()
    const [addMarketing_Leads, { isLoading }] = useAddMarketing_LeadsMutation()
    const [newMarketing_Lead, setNewMarketing_Lead] = useState<IMarketing_Leads>(defaultMarketing_Leads)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewMarketing_Lead(prev => ({ ...prev, [name]: value }));
    };

    const handleAddMarketing_Lead = async () => {
        try {
            const { _id, ...updateData } = newMarketing_Lead
            console.log('Adding new record:', updateData)
            const addedMarketing_Lead = await addMarketing_Leads(updateData).unwrap()
            setMarketing_Leads([addedMarketing_Lead])
            toggleAddModal(false)
            setNewMarketing_Lead(defaultMarketing_Leads)
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

    const source_contentOptions = [
        { label: 'Whats Apps', value: 'Whats Apps' },
        { label: 'Facebook', value: 'Facebook' },
        { label: 'Manual collection', value: 'Manual collection' }
    ];

    return (
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add New Marketing_Lead</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="full_name" className="text-right">
                                Full_name
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="full_name" placeholder="Full_name" value={newMarketing_Lead['full_name']} onChange={(value) => handleFieldChange('full_name', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="phone_number" className="text-right">
                                Phone_number
                            </Label>
                            <div className="col-span-3">
                                <PhoneInputField id="phone_number" value={newMarketing_Lead['phone_number']} onChange={(value) => handleFieldChange('phone_number', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForEmail id="email" value={newMarketing_Lead['email']} onChange={(value) => handleFieldChange('email', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="source_content" className="text-right">
                                Source_content
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={source_contentOptions} value={newMarketing_Lead['source_content']} onValueChange={(value) => handleFieldChange('source_content', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="collected_by" className="text-right">
                                Collected_by
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="collected_by" placeholder="Collected_by" value={newMarketing_Lead['collected_by']} onChange={(value) => handleFieldChange('collected_by', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="notes" className="text-right">
                                Notes
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="notes" value={newMarketing_Lead['notes']} onChange={(e) => handleFieldChange('notes', e.target.value)} />
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
                        onClick={handleAddMarketing_Lead}
                    >
                        {isLoading ? 'Adding...' : 'Add Marketing_Lead'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
