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
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import TimeField from '@/components/dashboard-ui/TimeField'
import { DateField } from '@/components/dashboard-ui/DateField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { useEmployee_TasksStore } from '../store/store'
import { useAddEmployee_TasksMutation } from '../redux/rtk-api'
import { IEmployee_Tasks, defaultEmployee_Tasks } from '@/app/generate/employee_Tasks/all/store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setEmployee_Tasks } = useEmployee_TasksStore()
    const [addEmployee_Tasks, { isLoading }] = useAddEmployee_TasksMutation()
    const [newEmployee_Task, setNewEmployee_Task] = useState<IEmployee_Tasks>(defaultEmployee_Tasks)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewEmployee_Task(prev => ({ ...prev, [name]: value }));
    };

    const handleAddEmployee_Task = async () => {
        try {
            const { _id, ...updateData } = newEmployee_Task
            console.log('Adding new record:', updateData)
            const addedEmployee_Task = await addEmployee_Tasks(updateData).unwrap()
            setEmployee_Tasks([addedEmployee_Task])
            toggleAddModal(false)
            setNewEmployee_Task(defaultEmployee_Tasks)
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
        { label: 'To Do', value: 'To Do' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Done', value: 'Done' }
    ];

    return (
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add New Employee_Task</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="title" placeholder="Title" value={newEmployee_Task['title']} onChange={(value) => handleFieldChange('title', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="description" value={newEmployee_Task['description']} onChange={(e) => handleFieldChange('description', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="assigned_to_id" className="text-right">
                                Assigned_to_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForEmail id="assigned_to_id" value={newEmployee_Task['assigned_to_id']} onChange={(value) => handleFieldChange('assigned_to_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="assigned_by_id" className="text-right">
                                Assigned_by_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForEmail id="assigned_by_id" value={newEmployee_Task['assigned_by_id']} onChange={(value) => handleFieldChange('assigned_by_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="start_time" className="text-right">
                                Start_time
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="start_time" value={newEmployee_Task['start_time']} onChange={(time) => handleFieldChange('start_time', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="end_time" className="text-right">
                                End_time
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="end_time" value={newEmployee_Task['end_time']} onChange={(time) => handleFieldChange('end_time', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="start_date" className="text-right">
                                Start_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="start_date" value={newEmployee_Task['start_date']} onChange={(date) => handleFieldChange('start_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="end_date" className="text-right">
                                End_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="end_date" value={newEmployee_Task['end_date']} onChange={(date) => handleFieldChange('end_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={statusOptions} value={newEmployee_Task['status']} onValueChange={(value) => handleFieldChange('status', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="checked_by_id" className="text-right">
                                Checked_by_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForEmail id="checked_by_id" value={newEmployee_Task['checked_by_id']} onChange={(value) => handleFieldChange('checked_by_id', value as string)} />
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
                        onClick={handleAddEmployee_Task}
                    >
                        {isLoading ? 'Adding...' : 'Add Employee_Task'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
