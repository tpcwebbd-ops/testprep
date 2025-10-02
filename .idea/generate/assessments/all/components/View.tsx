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

import { IAssessments, defaultAssessments } from '../store/data/data'
import { useAssessmentsStore } from '../store/store'
import { useGetAssessmentsByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedAssessments,
        toggleViewModal,
        setSelectedAssessments,
    } = useAssessmentsStore()

    const { data: assessmentData, refetch } = useGetAssessmentsByIdQuery(
        selectedAssessments?._id,
        { skip: !selectedAssessments?._id }
    )

    useEffect(() => {
        if (selectedAssessments?._id) {
            refetch()
        }
    }, [selectedAssessments?._id, refetch])

    useEffect(() => {
        if (assessmentData?.data) {
            setSelectedAssessments(assessmentData.data)
        }
    }, [assessmentData, setSelectedAssessments])

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
                    <DialogTitle>Assessments Details</DialogTitle>
                </DialogHeader>
                {selectedAssessments && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Batch_id" value={selectedAssessments['batch_id']} />
                            <DetailRow label="Lecture_id" value={selectedAssessments['lecture_id']} />
                            <DetailRow label="Course_id" value={selectedAssessments['course_id']} />
                            <DetailRow label="Title" value={selectedAssessments['title']} />
                            <DetailRow label="Description" value={selectedAssessments['description']} />
                            <DetailRow label="Start_time" value={selectedAssessments['start_time']} />
                            <DetailRow label="End_time" value={selectedAssessments['end_time']} />
                            <DetailRow label="Start_date" value={formatDate(selectedAssessments['start_date'])} />
                            <DetailRow label="End_date" value={formatDate(selectedAssessments['end_date'])} />
                            <DetailRow label="Total_marks" value={selectedAssessments['total_marks']} />
                            <DetailRow label="Marks_obtained" value={selectedAssessments['marks_obtained']} />
                            <DetailRow label="Assessment_sheet" value={selectedAssessments['assessment_sheet']} />
                            <DetailRow label="Assesment_checked_by" value={selectedAssessments['assesment_checked_by']} />
                            <DetailRow label="Assesment_create_by" value={selectedAssessments['assesment_create_by']} />
                            <DetailRow label="Assessment_type" value={selectedAssessments['assessment_type']} />
                            <DetailRow label="Created At" value={formatDate(selectedAssessments.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedAssessments.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedAssessments(defaultAssessments as IAssessments)
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
