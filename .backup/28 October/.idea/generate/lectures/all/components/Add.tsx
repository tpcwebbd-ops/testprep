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
import { DateField } from '@/components/dashboard-ui/DateField'

import { useLecturesStore } from '../store/store'
import { useAddLecturesMutation } from '../redux/rtk-api'
import { ILectures, defaultLectures } from '@/app/generate/lectures/all/store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setLectures } = useLecturesStore()
    const [addLectures, { isLoading }] = useAddLecturesMutation()
    const [newLecture, setNewLecture] = useState<ILectures>(defaultLectures)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewLecture(prev => ({ ...prev, [name]: value }));
    };

    const handleAddLecture = async () => {
        try {
            const { _id, ...updateData } = newLecture
            console.log('Adding new record:', updateData)
            const addedLecture = await addLectures(updateData).unwrap()
            setLectures([addedLecture])
            toggleAddModal(false)
            setNewLecture(defaultLectures)
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
                    <DialogTitle>Add New Lecture</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="module_id" className="text-right">
                                Module_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="module_id" placeholder="Module_id" value={newLecture['module_id']} onChange={(value) => handleFieldChange('module_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="title" placeholder="Title" value={newLecture['title']} onChange={(value) => handleFieldChange('title', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="description" value={newLecture['description']} onChange={(e) => handleFieldChange('description', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="lecture_date" className="text-right">
                                Lecture_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="lecture_date" value={newLecture['lecture_date']} onChange={(date) => handleFieldChange('lecture_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="order_index" className="text-right">
                                Order_index
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldInteger id="order_index" value={newLecture['order_index']} onChange={(value) => handleFieldChange('order_index',  value as number)} />
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
                        onClick={handleAddLecture}
                    >
                        {isLoading ? 'Adding...' : 'Add Lecture'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
