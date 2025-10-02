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
import TimeField from '@/components/dashboard-ui/TimeField'
import { DateField } from '@/components/dashboard-ui/DateField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { useMessagesStore } from '../store/store'
import { useAddMessagesMutation } from '../redux/rtk-api'
import { IMessages, defaultMessages } from '@/app/generate/messages/all/store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setMessages } = useMessagesStore()
    const [addMessages, { isLoading }] = useAddMessagesMutation()
    const [newMessage, setNewMessage] = useState<IMessages>(defaultMessages)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewMessage(prev => ({ ...prev, [name]: value }));
    };

    const handleAddMessage = async () => {
        try {
            const { _id, ...updateData } = newMessage
            console.log('Adding new record:', updateData)
            const addedMessage = await addMessages(updateData).unwrap()
            setMessages([addedMessage])
            toggleAddModal(false)
            setNewMessage(defaultMessages)
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
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add New Message</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="sender_mobilenumber" className="text-right">
                                Sender_mobilenumber
                            </Label>
                            <div className="col-span-3">
                                <PhoneInputField id="sender_mobilenumber" value={newMessage['sender_mobilenumber']} onChange={(value) => handleFieldChange('sender_mobilenumber', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="sender_Name" className="text-right">
                                Sender_Name
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="sender_Name" placeholder="Sender_Name" value={newMessage['sender_Name']} onChange={(value) => handleFieldChange('sender_Name', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="message_content" className="text-right">
                                Message_content
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="message_content" value={newMessage['message_content']} onChange={(e) => handleFieldChange('message_content', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="sent_time" className="text-right">
                                Sent_time
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="sent_time" value={newMessage['sent_time']} onChange={(time) => handleFieldChange('sent_time', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="sent_date" className="text-right">
                                Sent_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="sent_date" value={newMessage['sent_date']} onChange={(date) => handleFieldChange('sent_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="is_read" className="text-right">
                                Is_read
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={is_readOptions} value={newMessage['is_read']} onValueChange={(value) => handleFieldChange('is_read', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="replayBy" className="text-right">
                                ReplayBy
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForEmail id="replayBy" value={newMessage['replayBy']} onChange={(value) => handleFieldChange('replayBy', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="replayTime" className="text-right">
                                ReplayTime
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="replayTime" value={newMessage['replayTime']} onChange={(time) => handleFieldChange('replayTime', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="replayDate" className="text-right">
                                ReplayDate
                            </Label>
                            <div className="col-span-3">
                                <DateField id="replayDate" value={newMessage['replayDate']} onChange={(date) => handleFieldChange('replayDate', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="isAddTomarkeking" className="text-right">
                                IsAddTomarkeking
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={isAddTomarkekingOptions} value={newMessage['isAddTomarkeking']} onValueChange={(value) => handleFieldChange('isAddTomarkeking', value)} />
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
                        onClick={handleAddMessage}
                    >
                        {isLoading ? 'Adding...' : 'Add Message'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
