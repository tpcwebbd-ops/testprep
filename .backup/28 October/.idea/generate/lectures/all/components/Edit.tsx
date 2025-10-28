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
import { DateField } from '@/components/dashboard-ui/DateField'

import { ILectures, defaultLectures } from '@/app/generate/lectures/all/store/data/data'
import { useLecturesStore } from '../store/store'
import { useUpdateLecturesMutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedLectures,
        setSelectedLectures,
    } = useLecturesStore()

    const [updateLectures, { isLoading }] = useUpdateLecturesMutation()
    const [editedLecture, setLecture] = useState<ILectures>(defaultLectures)

    useEffect(() => {
        if (selectedLectures) {
            setLecture(selectedLectures)
        }
    }, [selectedLectures])

    const handleFieldChange = (name: string, value: unknown) => {
        setLecture(prev => ({ ...prev, [name]: value }));
    };

    const handleEditLecture = async () => {
        if (!selectedLectures) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedLecture;
            await updateLectures({
                id: selectedLectures._id,
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
                    <DialogTitle>Edit Lecture</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="module_id" className="text-right">
                                Module_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="module_id" placeholder="Module_id" value={editedLecture['module_id']} onChange={(value) => handleFieldChange('module_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="title" placeholder="Title" value={editedLecture['title']} onChange={(value) => handleFieldChange('title', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="description" value={editedLecture['description']} onChange={(e) => handleFieldChange('description', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="lecture_date" className="text-right">
                                Lecture_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="lecture_date" value={editedLecture['lecture_date']} onChange={(date) => handleFieldChange('lecture_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="order_index" className="text-right">
                                Order_index
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldInteger id="order_index" value={editedLecture['order_index']} onChange={(value) => handleFieldChange('order_index',  value as number)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedLectures(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditLecture}
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
