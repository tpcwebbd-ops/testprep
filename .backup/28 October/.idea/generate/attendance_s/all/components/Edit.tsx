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
import TimeField from '@/components/dashboard-ui/TimeField'
import UrlInputField from '@/components/dashboard-ui/UrlInputField'
import { DateField } from '@/components/dashboard-ui/DateField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { IAttendance_s, defaultAttendance_s } from '@/app/generate/attendance_s/all/store/data/data'
import { useAttendance_sStore } from '../store/store'
import { useUpdateAttendance_sMutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedAttendance_s,
        setSelectedAttendance_s,
    } = useAttendance_sStore()

    const [updateAttendance_s, { isLoading }] = useUpdateAttendance_sMutation()
    const [editedAttendance, setAttendance] = useState<IAttendance_s>(defaultAttendance_s)

    useEffect(() => {
        if (selectedAttendance_s) {
            setAttendance(selectedAttendance_s)
        }
    }, [selectedAttendance_s])

    const handleFieldChange = (name: string, value: unknown) => {
        setAttendance(prev => ({ ...prev, [name]: value }));
    };

    const handleEditAttendance = async () => {
        if (!selectedAttendance_s) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedAttendance;
            await updateAttendance_s({
                id: selectedAttendance_s._id,
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
        { label: 'Present', value: 'Present' },
        { label: 'Parmit_Leave', value: 'Parmit_Leave' },
        { label: 'Absent', value: 'Absent' }
    ];

    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Attendance</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="user_id" className="text-right">
                                User_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="user_id" placeholder="User_id" value={editedAttendance['user_id']} onChange={(value) => handleFieldChange('user_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="date" className="text-right">
                                Date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="date" value={editedAttendance['date']} onChange={(date) => handleFieldChange('date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="time" className="text-right">
                                Time
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="time" value={editedAttendance['time']} onChange={(time) => handleFieldChange('time', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="notes" className="text-right">
                                Notes
                            </Label>
                            <div className="col-span-3">
                                <UrlInputField id="notes" value={editedAttendance['notes']} onChange={(value) => handleFieldChange('notes', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={statusOptions} value={editedAttendance['status']} onValueChange={(value) => handleFieldChange('status', value)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedAttendance_s(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditAttendance}
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
