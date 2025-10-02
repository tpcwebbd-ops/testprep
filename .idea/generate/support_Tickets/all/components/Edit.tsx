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
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import TimeField from '@/components/dashboard-ui/TimeField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { ISupport_Tickets, defaultSupport_Tickets } from '@/app/generate/support_Tickets/all/store/data/data'
import { useSupport_TicketsStore } from '../store/store'
import { useUpdateSupport_TicketsMutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedSupport_Tickets,
        setSelectedSupport_Tickets,
    } = useSupport_TicketsStore()

    const [updateSupport_Tickets, { isLoading }] = useUpdateSupport_TicketsMutation()
    const [editedSupport_Ticket, setSupport_Ticket] = useState<ISupport_Tickets>(defaultSupport_Tickets)

    useEffect(() => {
        if (selectedSupport_Tickets) {
            setSupport_Ticket(selectedSupport_Tickets)
        }
    }, [selectedSupport_Tickets])

    const handleFieldChange = (name: string, value: unknown) => {
        setSupport_Ticket(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSupport_Ticket = async () => {
        if (!selectedSupport_Tickets) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedSupport_Ticket;
            await updateSupport_Tickets({
                id: selectedSupport_Tickets._id,
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

    const statusOptions = [
        { label: 'Open', value: 'Open' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Closed', value: 'Closed' },
        { label: 'Solved', value: 'Solved' },
        { label: 'Rejected', value: 'Rejected' }
    ];

    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Support_Ticket</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="student_id" className="text-right">
                                Student_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="student_id" placeholder="Student_id" value={editedSupport_Ticket['student_id']} onChange={(value) => handleFieldChange('student_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="assigned_to_id " className="text-right">
                                Assigned_to_id 
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForEmail id="assigned_to_id " value={editedSupport_Ticket['assigned_to_id ']} onChange={(value) => handleFieldChange('assigned_to_id ', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="title" placeholder="Title" value={editedSupport_Ticket['title']} onChange={(value) => handleFieldChange('title', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="description" value={editedSupport_Ticket['description']} onChange={(e) => handleFieldChange('description', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="created_at" className="text-right">
                                Created_at
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="created_at" value={editedSupport_Ticket['created_at']} onChange={(time) => handleFieldChange('created_at', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="closed_at" className="text-right">
                                Closed_at
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="closed_at" value={editedSupport_Ticket['closed_at']} onChange={(time) => handleFieldChange('closed_at', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={statusOptions} value={editedSupport_Ticket['status']} onValueChange={(value) => handleFieldChange('status', value)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedSupport_Tickets(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditSupport_Ticket}
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
