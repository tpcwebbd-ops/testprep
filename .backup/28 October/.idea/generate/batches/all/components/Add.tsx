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
import { DateField } from '@/components/dashboard-ui/DateField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { useBatchesStore } from '../store/store'
import { useAddBatchesMutation } from '../redux/rtk-api'
import { IBatches, defaultBatches } from '@/app/generate/batches/all/store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setBatches } = useBatchesStore()
    const [addBatches, { isLoading }] = useAddBatchesMutation()
    const [newBatch, setNewBatch] = useState<IBatches>(defaultBatches)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewBatch(prev => ({ ...prev, [name]: value }));
    };

    const handleAddBatch = async () => {
        try {
            const { _id, ...updateData } = newBatch
            console.log('Adding new record:', updateData)
            const addedBatch = await addBatches(updateData).unwrap()
            setBatches([addedBatch])
            toggleAddModal(false)
            setNewBatch(defaultBatches)
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
        { label: 'upcoming', value: 'upcoming' },
        { label: 'ongoing', value: 'ongoing' },
        { label: 'completed', value: 'completed' }
    ];

    return (
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add New Batch</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="batch_title" className="text-right">
                                Batch_title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="batch_title" placeholder="Batch_title" value={newBatch['batch_title']} onChange={(value) => handleFieldChange('batch_title', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="course_id" className="text-right">
                                Course_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="course_id" placeholder="Course_id" value={newBatch['course_id']} onChange={(value) => handleFieldChange('course_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="start_date" className="text-right">
                                Start_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="start_date" value={newBatch['start_date']} onChange={(date) => handleFieldChange('start_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="end_date" className="text-right">
                                End_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="end_date" value={newBatch['end_date']} onChange={(date) => handleFieldChange('end_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={statusOptions} value={newBatch['status']} onValueChange={(value) => handleFieldChange('status', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="instructors_user_id" className="text-right">
                                Instructors_user_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="instructors_user_id" placeholder="Instructors_user_id" value={newBatch['instructors_user_id']} onChange={(value) => handleFieldChange('instructors_user_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="instructors_name" className="text-right">
                                Instructors_name
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="instructors_name" placeholder="Instructors_name" value={newBatch['instructors_name']} onChange={(value) => handleFieldChange('instructors_name', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="enroll_students" className="text-right">
                                Enroll_students
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="enroll_students" placeholder="Enroll_students" value={newBatch['enroll_students']} onChange={(value) => handleFieldChange('enroll_students', value as string)} />
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
                        onClick={handleAddBatch}
                    >
                        {isLoading ? 'Adding...' : 'Add Batch'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
