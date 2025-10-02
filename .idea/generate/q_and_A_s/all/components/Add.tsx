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
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import TimeField from '@/components/dashboard-ui/TimeField'

import { useQ_and_A_sStore } from '../store/store'
import { useAddQ_and_A_sMutation } from '../redux/rtk-api'
import { IQ_and_A_s, defaultQ_and_A_s } from '@/app/generate/q_and_A_s/all/store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setQ_and_A_s } = useQ_and_A_sStore()
    const [addQ_and_A_s, { isLoading }] = useAddQ_and_A_sMutation()
    const [newQ_and_A, setNewQ_and_A] = useState<IQ_and_A_s>(defaultQ_and_A_s)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewQ_and_A(prev => ({ ...prev, [name]: value }));
    };

    const handleAddQ_and_A = async () => {
        try {
            const { _id, ...updateData } = newQ_and_A
            console.log('Adding new record:', updateData)
            const addedQ_and_A = await addQ_and_A_s(updateData).unwrap()
            setQ_and_A_s([addedQ_and_A])
            toggleAddModal(false)
            setNewQ_and_A(defaultQ_and_A_s)
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



    return (
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add New Q_and_A</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="course_id" className="text-right">
                                Course_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="course_id" placeholder="Course_id" value={newQ_and_A['course_id']} onChange={(value) => handleFieldChange('course_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="lecture_id" className="text-right">
                                Lecture_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="lecture_id" placeholder="Lecture_id" value={newQ_and_A['lecture_id']} onChange={(value) => handleFieldChange('lecture_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="student_uid" className="text-right">
                                Student_uid
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="student_uid" placeholder="Student_uid" value={newQ_and_A['student_uid']} onChange={(value) => handleFieldChange('student_uid', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="question_text" className="text-right">
                                Question_text
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="question_text" value={newQ_and_A['question_text']} onChange={(e) => handleFieldChange('question_text', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="question_time" className="text-right">
                                Question_time
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="question_time" value={newQ_and_A['question_time']} onChange={(time) => handleFieldChange('question_time', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="answer_text" className="text-right">
                                Answer_text
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="answer_text" value={newQ_and_A['answer_text']} onChange={(e) => handleFieldChange('answer_text', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="answered_by_user_id" className="text-right">
                                Answered_by_user_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="answered_by_user_id" placeholder="Answered_by_user_id" value={newQ_and_A['answered_by_user_id']} onChange={(value) => handleFieldChange('answered_by_user_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="answer_time" className="text-right">
                                Answer_time
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="answer_time" value={newQ_and_A['answer_time']} onChange={(time) => handleFieldChange('answer_time', time)} />
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
                        onClick={handleAddQ_and_A}
                    >
                        {isLoading ? 'Adding...' : 'Add Q_and_A'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
