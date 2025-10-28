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
import TimeField from '@/components/dashboard-ui/TimeField'
import { DateField } from '@/components/dashboard-ui/DateField'

import { useFollow_UpsStore } from '../store/store'
import { useAddFollow_UpsMutation } from '../redux/rtk-api'
import { IFollow_Ups, defaultFollow_Ups } from '@/app/generate/follow_Ups/all/store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setFollow_Ups } = useFollow_UpsStore()
    const [addFollow_Ups, { isLoading }] = useAddFollow_UpsMutation()
    const [newFollow_Up, setNewFollow_Up] = useState<IFollow_Ups>(defaultFollow_Ups)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewFollow_Up(prev => ({ ...prev, [name]: value }));
    };

    const handleAddFollow_Up = async () => {
        try {
            const { _id, ...updateData } = newFollow_Up
            console.log('Adding new record:', updateData)
            const addedFollow_Up = await addFollow_Ups(updateData).unwrap()
            setFollow_Ups([addedFollow_Up])
            toggleAddModal(false)
            setNewFollow_Up(defaultFollow_Ups)
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
                    <DialogTitle>Add New Follow_Up</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="lead_id" className="text-right">
                                Lead_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="lead_id" placeholder="Lead_id" value={newFollow_Up['lead_id']} onChange={(value) => handleFieldChange('lead_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="followed_by_id" className="text-right">
                                Followed_by_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="followed_by_id" placeholder="Followed_by_id" value={newFollow_Up['followed_by_id']} onChange={(value) => handleFieldChange('followed_by_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="follow_up_date" className="text-right">
                                Follow_up_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="follow_up_date" value={newFollow_Up['follow_up_date']} onChange={(date) => handleFieldChange('follow_up_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="follow_up_time" className="text-right">
                                Follow_up_time
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="follow_up_time" value={newFollow_Up['follow_up_time']} onChange={(time) => handleFieldChange('follow_up_time', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="response_note" className="text-right">
                                Response_note
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="response_note" value={newFollow_Up['response_note']} onChange={(e) => handleFieldChange('response_note', e.target.value)} />
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
                        onClick={handleAddFollow_Up}
                    >
                        {isLoading ? 'Adding...' : 'Add Follow_Up'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
