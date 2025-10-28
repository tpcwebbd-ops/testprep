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
import TimeField from '@/components/dashboard-ui/TimeField'
import { DateField } from '@/components/dashboard-ui/DateField'

import { IFollow_Ups, defaultFollow_Ups } from '@/app/generate/follow_Ups/all/store/data/data'
import { useFollow_UpsStore } from '../store/store'
import { useUpdateFollow_UpsMutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedFollow_Ups,
        setSelectedFollow_Ups,
    } = useFollow_UpsStore()

    const [updateFollow_Ups, { isLoading }] = useUpdateFollow_UpsMutation()
    const [editedFollow_Up, setFollow_Up] = useState<IFollow_Ups>(defaultFollow_Ups)

    useEffect(() => {
        if (selectedFollow_Ups) {
            setFollow_Up(selectedFollow_Ups)
        }
    }, [selectedFollow_Ups])

    const handleFieldChange = (name: string, value: unknown) => {
        setFollow_Up(prev => ({ ...prev, [name]: value }));
    };

    const handleEditFollow_Up = async () => {
        if (!selectedFollow_Ups) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedFollow_Up;
            await updateFollow_Ups({
                id: selectedFollow_Ups._id,
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
                    <DialogTitle>Edit Follow_Up</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="lead_id" className="text-right">
                                Lead_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="lead_id" placeholder="Lead_id" value={editedFollow_Up['lead_id']} onChange={(value) => handleFieldChange('lead_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="followed_by_id" className="text-right">
                                Followed_by_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="followed_by_id" placeholder="Followed_by_id" value={editedFollow_Up['followed_by_id']} onChange={(value) => handleFieldChange('followed_by_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="follow_up_date" className="text-right">
                                Follow_up_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="follow_up_date" value={editedFollow_Up['follow_up_date']} onChange={(date) => handleFieldChange('follow_up_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="follow_up_time" className="text-right">
                                Follow_up_time
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="follow_up_time" value={editedFollow_Up['follow_up_time']} onChange={(time) => handleFieldChange('follow_up_time', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="response_note" className="text-right">
                                Response_note
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="response_note" value={editedFollow_Up['response_note']} onChange={(e) => handleFieldChange('response_note', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedFollow_Ups(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditFollow_Up}
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
