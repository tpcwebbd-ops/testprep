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
import NumberInputFieldInteger from '@/components/dashboard-ui/NumberInputFieldInteger'
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import TimeField from '@/components/dashboard-ui/TimeField'
import UrlInputField from '@/components/dashboard-ui/UrlInputField'
import { DateField } from '@/components/dashboard-ui/DateField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { useAssessmentsStore } from '../store/store'
import { useAddAssessmentsMutation } from '../redux/rtk-api'
import { IAssessments, defaultAssessments } from '@/app/generate/assessments/all/store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setAssessments } = useAssessmentsStore()
    const [addAssessments, { isLoading }] = useAddAssessmentsMutation()
    const [newAssessment, setNewAssessment] = useState<IAssessments>(defaultAssessments)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewAssessment(prev => ({ ...prev, [name]: value }));
    };

    const handleAddAssessment = async () => {
        try {
            const { _id, ...updateData } = newAssessment
            console.log('Adding new record:', updateData)
            const addedAssessment = await addAssessments(updateData).unwrap()
            setAssessments([addedAssessment])
            toggleAddModal(false)
            setNewAssessment(defaultAssessments)
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

    const assessment_typeOptions = [
        { label: 'Assignment', value: 'Assignment' },
        { label: 'Task', value: 'Task' },
        { label: 'Mock Test', value: 'Mock Test' }
    ];

    return (
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add New Assessment</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="batch_id" className="text-right">
                                Batch_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="batch_id" placeholder="Batch_id" value={newAssessment['batch_id']} onChange={(value) => handleFieldChange('batch_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="lecture_id" className="text-right">
                                Lecture_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="lecture_id" placeholder="Lecture_id" value={newAssessment['lecture_id']} onChange={(value) => handleFieldChange('lecture_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="course_id" className="text-right">
                                Course_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="course_id" placeholder="Course_id" value={newAssessment['course_id']} onChange={(value) => handleFieldChange('course_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="title" placeholder="Title" value={newAssessment['title']} onChange={(value) => handleFieldChange('title', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="description" value={newAssessment['description']} onChange={(e) => handleFieldChange('description', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="start_time" className="text-right">
                                Start_time
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="start_time" value={newAssessment['start_time']} onChange={(time) => handleFieldChange('start_time', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="end_time" className="text-right">
                                End_time
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="end_time" value={newAssessment['end_time']} onChange={(time) => handleFieldChange('end_time', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="start_date" className="text-right">
                                Start_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="start_date" value={newAssessment['start_date']} onChange={(date) => handleFieldChange('start_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="end_date" className="text-right">
                                End_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="end_date" value={newAssessment['end_date']} onChange={(date) => handleFieldChange('end_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="total_marks" className="text-right">
                                Total_marks
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldInteger id="total_marks" value={newAssessment['total_marks']} onChange={(value) => handleFieldChange('total_marks',  value as number)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="marks_obtained" className="text-right">
                                Marks_obtained
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldInteger id="marks_obtained" value={newAssessment['marks_obtained']} onChange={(value) => handleFieldChange('marks_obtained',  value as number)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="assessment_sheet" className="text-right">
                                Assessment_sheet
                            </Label>
                            <div className="col-span-3">
                                <UrlInputField id="assessment_sheet" value={newAssessment['assessment_sheet']} onChange={(value) => handleFieldChange('assessment_sheet', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="assesment_checked_by" className="text-right">
                                Assesment_checked_by
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForEmail id="assesment_checked_by" value={newAssessment['assesment_checked_by']} onChange={(value) => handleFieldChange('assesment_checked_by', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="assesment_create_by" className="text-right">
                                Assesment_create_by
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForEmail id="assesment_create_by" value={newAssessment['assesment_create_by']} onChange={(value) => handleFieldChange('assesment_create_by', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="assessment_type" className="text-right">
                                Assessment_type
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={assessment_typeOptions} value={newAssessment['assessment_type']} onValueChange={(value) => handleFieldChange('assessment_type', value)} />
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
                        onClick={handleAddAssessment}
                    >
                        {isLoading ? 'Adding...' : 'Add Assessment'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
