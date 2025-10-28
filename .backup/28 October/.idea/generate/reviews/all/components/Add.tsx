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
import TimeField from '@/components/dashboard-ui/TimeField'

import { useReviewsStore } from '../store/store'
import { useAddReviewsMutation } from '../redux/rtk-api'
import { IReviews, defaultReviews } from '@/app/generate/reviews/all/store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setReviews } = useReviewsStore()
    const [addReviews, { isLoading }] = useAddReviewsMutation()
    const [newReview, setNewReview] = useState<IReviews>(defaultReviews)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewReview(prev => ({ ...prev, [name]: value }));
    };

    const handleAddReview = async () => {
        try {
            const { _id, ...updateData } = newReview
            console.log('Adding new record:', updateData)
            const addedReview = await addReviews(updateData).unwrap()
            setReviews([addedReview])
            toggleAddModal(false)
            setNewReview(defaultReviews)
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
                    <DialogTitle>Add New Review</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="course_id" className="text-right">
                                Course_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="course_id" placeholder="Course_id" value={newReview['course_id']} onChange={(value) => handleFieldChange('course_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="user_id" className="text-right">
                                User_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="user_id" placeholder="User_id" value={newReview['user_id']} onChange={(value) => handleFieldChange('user_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="rating" className="text-right">
                                Rating
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldInteger id="rating" value={newReview['rating']} onChange={(value) => handleFieldChange('rating',  value as number)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="review_text" className="text-right">
                                Review_text
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="review_text" value={newReview['review_text']} onChange={(e) => handleFieldChange('review_text', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="created_at" className="text-right">
                                Created_at
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="created_at" value={newReview['created_at']} onChange={(time) => handleFieldChange('created_at', time)} />
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
                        onClick={handleAddReview}
                    >
                        {isLoading ? 'Adding...' : 'Add Review'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
