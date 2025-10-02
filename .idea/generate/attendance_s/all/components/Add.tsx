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
import TimeField from '@/components/dashboard-ui/TimeField'
import UrlInputField from '@/components/dashboard-ui/UrlInputField'
import { DateField } from '@/components/dashboard-ui/DateField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { useAttendance_sStore } from '../store/store'
import { useAddAttendance_sMutation } from '../redux/rtk-api'
import { IAttendance_s, defaultAttendance_s } from '@/app/generate/attendance_s/all/store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setAttendance_s } = useAttendance_sStore()
    const [addAttendance_s, { isLoading }] = useAddAttendance_sMutation()
    const [newAttendance, setNewAttendance] = useState<IAttendance_s>(defaultAttendance_s)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewAttendance(prev => ({ ...prev, [name]: value }));
    };

    const handleAddAttendance = async () => {
        try {
            const { _id, ...updateData } = newAttendance
            console.log('Adding new record:', updateData)
            const addedAttendance = await addAttendance_s(updateData).unwrap()
            setAttendance_s([addedAttendance])
            toggleAddModal(false)
            setNewAttendance(defaultAttendance_s)
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

    const statusOptions = [
        { label: 'Present', value: 'Present' },
        { label: 'Parmit_Leave', value: 'Parmit_Leave' },
        { label: 'Absent', value: 'Absent' }
    ];

    return (
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add New Attendance</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="user_id" className="text-right">
                                User_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="user_id" placeholder="User_id" value={newAttendance['user_id']} onChange={(value) => handleFieldChange('user_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="date" className="text-right">
                                Date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="date" value={newAttendance['date']} onChange={(date) => handleFieldChange('date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="time" className="text-right">
                                Time
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="time" value={newAttendance['time']} onChange={(time) => handleFieldChange('time', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="notes" className="text-right">
                                Notes
                            </Label>
                            <div className="col-span-3">
                                <UrlInputField id="notes" value={newAttendance['notes']} onChange={(value) => handleFieldChange('notes', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={statusOptions} value={newAttendance['status']} onValueChange={(value) => handleFieldChange('status', value)} />
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
                        onClick={handleAddAttendance}
                    >
                        {isLoading ? 'Adding...' : 'Add Attendance'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
