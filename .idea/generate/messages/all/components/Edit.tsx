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
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import TimeField from '@/components/dashboard-ui/TimeField'
import { DateField } from '@/components/dashboard-ui/DateField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { IMessages, defaultMessages } from '@/app/generate/messages/all/store/data/data'
import { useMessagesStore } from '../store/store'
import { useUpdateMessagesMutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedMessages,
        setSelectedMessages,
    } = useMessagesStore()

    const [updateMessages, { isLoading }] = useUpdateMessagesMutation()
    const [editedMessage, setMessage] = useState<IMessages>(defaultMessages)

    useEffect(() => {
        if (selectedMessages) {
            setMessage(selectedMessages)
        }
    }, [selectedMessages])

    const handleFieldChange = (name: string, value: unknown) => {
        setMessage(prev => ({ ...prev, [name]: value }));
    };

    const handleEditMessage = async () => {
        if (!selectedMessages) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedMessage;
            await updateMessages({
                id: selectedMessages._id,
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

    const isAddTomarkekingOptions = [
        { label: 'Pending', value: 'Pending' },
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
    ];

    const is_readOptions = [
        { label: 'Read', value: 'Read' },
        { label: 'Unread', value: 'Unread' },
        { label: 'Solved', value: 'Solved' },
        { label: 'Rejected', value: 'Rejected' }
    ];

    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Message</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="sender_mobilenumber" className="text-right">
                                Sender_mobilenumber
                            </Label>
                            <div className="col-span-3">
                                <PhoneInputField id="sender_mobilenumber" value={editedMessage['sender_mobilenumber']} onChange={(value) => handleFieldChange('sender_mobilenumber', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="sender_Name" className="text-right">
                                Sender_Name
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="sender_Name" placeholder="Sender_Name" value={editedMessage['sender_Name']} onChange={(value) => handleFieldChange('sender_Name', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="message_content" className="text-right">
                                Message_content
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="message_content" value={editedMessage['message_content']} onChange={(e) => handleFieldChange('message_content', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="sent_time" className="text-right">
                                Sent_time
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="sent_time" value={editedMessage['sent_time']} onChange={(time) => handleFieldChange('sent_time', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="sent_date" className="text-right">
                                Sent_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="sent_date" value={editedMessage['sent_date']} onChange={(date) => handleFieldChange('sent_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="is_read" className="text-right">
                                Is_read
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={is_readOptions} value={editedMessage['is_read']} onValueChange={(value) => handleFieldChange('is_read', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="replayBy" className="text-right">
                                ReplayBy
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForEmail id="replayBy" value={editedMessage['replayBy']} onChange={(value) => handleFieldChange('replayBy', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="replayTime" className="text-right">
                                ReplayTime
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="replayTime" value={editedMessage['replayTime']} onChange={(time) => handleFieldChange('replayTime', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="replayDate" className="text-right">
                                ReplayDate
                            </Label>
                            <div className="col-span-3">
                                <DateField id="replayDate" value={editedMessage['replayDate']} onChange={(date) => handleFieldChange('replayDate', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="isAddTomarkeking" className="text-right">
                                IsAddTomarkeking
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={isAddTomarkekingOptions} value={editedMessage['isAddTomarkeking']} onValueChange={(value) => handleFieldChange('isAddTomarkeking', value)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedMessages(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditMessage}
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
