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
import NumberInputFieldInteger from '@/components/dashboard-ui/NumberInputFieldInteger'
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import TimeField from '@/components/dashboard-ui/TimeField'

import { ISubmissions, defaultSubmissions } from '@/app/generate/submissions/all/store/data/data'
import { useSubmissionsStore } from '../store/store'
import { useUpdateSubmissionsMutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedSubmissions,
        setSelectedSubmissions,
    } = useSubmissionsStore()

    const [updateSubmissions, { isLoading }] = useUpdateSubmissionsMutation()
    const [editedSubmission, setSubmission] = useState<ISubmissions>(defaultSubmissions)

    useEffect(() => {
        if (selectedSubmissions) {
            setSubmission(selectedSubmissions)
        }
    }, [selectedSubmissions])

    const handleFieldChange = (name: string, value: unknown) => {
        setSubmission(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmission = async () => {
        if (!selectedSubmissions) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedSubmission;
            await updateSubmissions({
                id: selectedSubmissions._id,
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



    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Submission</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="assessment_id" className="text-right">
                                Assessment_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="assessment_id" placeholder="Assessment_id" value={editedSubmission['assessment_id']} onChange={(value) => handleFieldChange('assessment_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="student_id " className="text-right">
                                Student_id 
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="student_id " placeholder="Student_id " value={editedSubmission['student_id ']} onChange={(value) => handleFieldChange('student_id ', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="submission_time" className="text-right">
                                Submission_time
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="submission_time" value={editedSubmission['submission_time']} onChange={(time) => handleFieldChange('submission_time', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="submitted_content" className="text-right">
                                Submitted_content
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="submitted_content" value={editedSubmission['submitted_content']} onChange={(e) => handleFieldChange('submitted_content', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="marks_obtained" className="text-right">
                                Marks_obtained
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldInteger id="marks_obtained" value={editedSubmission['marks_obtained']} onChange={(value) => handleFieldChange('marks_obtained',  value as number)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="feedback" className="text-right">
                                Feedback
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="feedback" value={editedSubmission['feedback']} onChange={(e) => handleFieldChange('feedback', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="checked_by_mentor_id" className="text-right">
                                Checked_by_mentor_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="checked_by_mentor_id" placeholder="Checked_by_mentor_id" value={editedSubmission['checked_by_mentor_id']} onChange={(value) => handleFieldChange('checked_by_mentor_id', value as string)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedSubmissions(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditSubmission}
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
