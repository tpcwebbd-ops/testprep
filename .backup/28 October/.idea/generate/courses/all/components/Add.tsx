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
import NumberInputFieldInteger from '@/components/dashboard-ui/NumberInputFieldInteger'
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { useCoursesStore } from '../store/store'
import { useAddCoursesMutation } from '../redux/rtk-api'
import { ICourses, defaultCourses } from '@/app/generate/courses/all/store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setCourses } = useCoursesStore()
    const [addCourses, { isLoading }] = useAddCoursesMutation()
    const [newCourse, setNewCourse] = useState<ICourses>(defaultCourses)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewCourse(prev => ({ ...prev, [name]: value }));
    };

    const handleAddCourse = async () => {
        try {
            const { _id, ...updateData } = newCourse
            console.log('Adding new record:', updateData)
            const addedCourse = await addCourses(updateData).unwrap()
            setCourses([addedCourse])
            toggleAddModal(false)
            setNewCourse(defaultCourses)
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

    const is_publishedOptions = [
        { label: 'Published', value: 'Published' },
        { label: 'private', value: 'private' },
        { label: 'suspended', value: 'suspended' }
    ];

    return (
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add New Course</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="title" placeholder="Title" value={newCourse['title']} onChange={(value) => handleFieldChange('title', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="description" value={newCourse['description']} onChange={(e) => handleFieldChange('description', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="duration_months" className="text-right">
                                Duration_months
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldInteger id="duration_months" value={newCourse['duration_months']} onChange={(value) => handleFieldChange('duration_months',  value as number)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="total_lectures" className="text-right">
                                Total_lectures
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldInteger id="total_lectures" value={newCourse['total_lectures']} onChange={(value) => handleFieldChange('total_lectures',  value as number)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="is_published" className="text-right">
                                Is_published
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={is_publishedOptions} value={newCourse['is_published']} onValueChange={(value) => handleFieldChange('is_published', value)} />
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
                        onClick={handleAddCourse}
                    >
                        {isLoading ? 'Adding...' : 'Add Course'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
