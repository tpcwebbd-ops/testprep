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
import TimeField from '@/components/dashboard-ui/TimeField'
import { DateField } from '@/components/dashboard-ui/DateField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { useEnrollmentsStore } from '../store/store'
import { useAddEnrollmentsMutation } from '../redux/rtk-api'
import { IEnrollments, defaultEnrollments } from '@/app/generate/enrollments/all/store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setEnrollments } = useEnrollmentsStore()
    const [addEnrollments, { isLoading }] = useAddEnrollmentsMutation()
    const [newEnrollment, setNewEnrollment] = useState<IEnrollments>(defaultEnrollments)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewEnrollment(prev => ({ ...prev, [name]: value }));
    };

    const handleAddEnrollment = async () => {
        try {
            const { _id, ...updateData } = newEnrollment
            console.log('Adding new record:', updateData)
            const addedEnrollment = await addEnrollments(updateData).unwrap()
            setEnrollments([addedEnrollment])
            toggleAddModal(false)
            setNewEnrollment(defaultEnrollments)
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

    const is_completeOptions = [
        { label: 'Pending', value: 'Pending' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Failed', value: 'Failed' },
        { label: 'Rejected', value: 'Rejected' }
    ];

    return (
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add New Enrollment</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="student_email  " className="text-right">
                                Student_email  
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForEmail id="student_email  " value={newEnrollment['student_email  ']} onChange={(value) => handleFieldChange('student_email  ', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="batch_id" className="text-right">
                                Batch_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="batch_id" placeholder="Batch_id" value={newEnrollment['batch_id']} onChange={(value) => handleFieldChange('batch_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="enrollment_date" className="text-right">
                                Enrollment_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="enrollment_date" value={newEnrollment['enrollment_date']} onChange={(date) => handleFieldChange('enrollment_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="enrollment_time" className="text-right">
                                Enrollment_time
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="enrollment_time" value={newEnrollment['enrollment_time']} onChange={(time) => handleFieldChange('enrollment_time', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="is_complete" className="text-right">
                                Is_complete
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={is_completeOptions} value={newEnrollment['is_complete']} onValueChange={(value) => handleFieldChange('is_complete', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="payment_id" className="text-right">
                                Payment_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="payment_id" placeholder="Payment_id" value={newEnrollment['payment_id']} onChange={(value) => handleFieldChange('payment_id', value as string)} />
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
                        onClick={handleAddEnrollment}
                    >
                        {isLoading ? 'Adding...' : 'Add Enrollment'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
