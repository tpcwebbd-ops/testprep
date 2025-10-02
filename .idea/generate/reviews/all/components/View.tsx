import Image from 'next/image'
import { format } from 'date-fns'
import React, { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { IReviews, defaultReviews } from '../store/data/data'
import { useReviewsStore } from '../store/store'
import { useGetReviewsByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedReviews,
        toggleViewModal,
        setSelectedReviews,
    } = useReviewsStore()

    const { data: reviewData, refetch } = useGetReviewsByIdQuery(
        selectedReviews?._id,
        { skip: !selectedReviews?._id }
    )

    useEffect(() => {
        if (selectedReviews?._id) {
            refetch()
        }
    }, [selectedReviews?._id, refetch])

    useEffect(() => {
        if (reviewData?.data) {
            setSelectedReviews(reviewData.data)
        }
    }, [reviewData, setSelectedReviews])

    const formatDate = (date?: Date | string) => {
        if (!date) return 'N/A'
        try {
            return format(new Date(date), 'MMM dd, yyyy')
        } catch (error) {
            return 'Invalid Date'
        }
    }

    const formatBoolean = (value?: boolean) => (value ? 'Yes' : 'No')

    const DetailRow: React.FC<{
        label: string
        value: React.ReactNode
    }> = ({ label, value }) => (
        <div className="grid grid-cols-3 gap-2 py-2 border-b">
            <div className="font-semibold text-sm text-gray-600">{label}</div>
            <div className="col-span-2 text-sm">{value || 'N/A'}</div>
        </div>
    )
    
    const DetailRowArray: React.FC<{
        label: string
        values?: (string | number)[]
    }> = ({ label, values }) => (
        <DetailRow label={label} value={values?.join(', ') || 'N/A'} />
    )

    return (
        <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Reviews Details</DialogTitle>
                </DialogHeader>
                {selectedReviews && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Course_id" value={selectedReviews['course_id']} />
                            <DetailRow label="User_id" value={selectedReviews['user_id']} />
                            <DetailRow label="Rating" value={selectedReviews['rating']} />
                            <DetailRow label="Review_text" value={selectedReviews['review_text']} />
                            <DetailRow label="Created_at" value={selectedReviews['created_at']} />
                            <DetailRow label="Created At" value={formatDate(selectedReviews.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedReviews.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedReviews(defaultReviews as IReviews)
                        }}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ViewNextComponents
