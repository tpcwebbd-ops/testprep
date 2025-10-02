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
import { DateField } from '@/components/dashboard-ui/DateField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { IBatches, defaultBatches } from '@/app/generate/batches/all/store/data/data'
import { useBatchesStore } from '../store/store'
import { useUpdateBatchesMutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedBatches,
        setSelectedBatches,
    } = useBatchesStore()

    const [updateBatches, { isLoading }] = useUpdateBatchesMutation()
    const [editedBatch, setBatch] = useState<IBatches>(defaultBatches)

    useEffect(() => {
        if (selectedBatches) {
            setBatch(selectedBatches)
        }
    }, [selectedBatches])

    const handleFieldChange = (name: string, value: unknown) => {
        setBatch(prev => ({ ...prev, [name]: value }));
    };

    const handleEditBatch = async () => {
        if (!selectedBatches) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedBatch;
            await updateBatches({
                id: selectedBatches._id,
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
        { label: 'upcoming', value: 'upcoming' },
        { label: 'ongoing', value: 'ongoing' },
        { label: 'completed', value: 'completed' }
    ];

    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Batch</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="batch_title" className="text-right">
                                Batch_title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="batch_title" placeholder="Batch_title" value={editedBatch['batch_title']} onChange={(value) => handleFieldChange('batch_title', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="course_id" className="text-right">
                                Course_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="course_id" placeholder="Course_id" value={editedBatch['course_id']} onChange={(value) => handleFieldChange('course_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="start_date" className="text-right">
                                Start_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="start_date" value={editedBatch['start_date']} onChange={(date) => handleFieldChange('start_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="end_date" className="text-right">
                                End_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="end_date" value={editedBatch['end_date']} onChange={(date) => handleFieldChange('end_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={statusOptions} value={editedBatch['status']} onValueChange={(value) => handleFieldChange('status', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="instructors_user_id" className="text-right">
                                Instructors_user_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="instructors_user_id" placeholder="Instructors_user_id" value={editedBatch['instructors_user_id']} onChange={(value) => handleFieldChange('instructors_user_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="instructors_name" className="text-right">
                                Instructors_name
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="instructors_name" placeholder="Instructors_name" value={editedBatch['instructors_name']} onChange={(value) => handleFieldChange('instructors_name', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="enroll_students" className="text-right">
                                Enroll_students
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="enroll_students" placeholder="Enroll_students" value={editedBatch['enroll_students']} onChange={(value) => handleFieldChange('enroll_students', value as string)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedBatches(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditBatch}
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
