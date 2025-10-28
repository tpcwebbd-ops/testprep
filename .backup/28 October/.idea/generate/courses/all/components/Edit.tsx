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
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { ICourses, defaultCourses } from '@/app/generate/courses/all/store/data/data'
import { useCoursesStore } from '../store/store'
import { useUpdateCoursesMutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedCourses,
        setSelectedCourses,
    } = useCoursesStore()

    const [updateCourses, { isLoading }] = useUpdateCoursesMutation()
    const [editedCourse, setCourse] = useState<ICourses>(defaultCourses)

    useEffect(() => {
        if (selectedCourses) {
            setCourse(selectedCourses)
        }
    }, [selectedCourses])

    const handleFieldChange = (name: string, value: unknown) => {
        setCourse(prev => ({ ...prev, [name]: value }));
    };

    const handleEditCourse = async () => {
        if (!selectedCourses) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedCourse;
            await updateCourses({
                id: selectedCourses._id,
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

    const is_publishedOptions = [
        { label: 'Published', value: 'Published' },
        { label: 'private', value: 'private' },
        { label: 'suspended', value: 'suspended' }
    ];

    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Course</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="title" placeholder="Title" value={editedCourse['title']} onChange={(value) => handleFieldChange('title', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="description" value={editedCourse['description']} onChange={(e) => handleFieldChange('description', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="duration_months" className="text-right">
                                Duration_months
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldInteger id="duration_months" value={editedCourse['duration_months']} onChange={(value) => handleFieldChange('duration_months',  value as number)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="total_lectures" className="text-right">
                                Total_lectures
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldInteger id="total_lectures" value={editedCourse['total_lectures']} onChange={(value) => handleFieldChange('total_lectures',  value as number)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="is_published" className="text-right">
                                Is_published
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={is_publishedOptions} value={editedCourse['is_published']} onValueChange={(value) => handleFieldChange('is_published', value)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedCourses(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditCourse}
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
