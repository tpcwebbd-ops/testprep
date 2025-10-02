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

import { ISubmissions, defaultSubmissions } from '../store/data/data'
import { useSubmissionsStore } from '../store/store'
import { useGetSubmissionsByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedSubmissions,
        toggleViewModal,
        setSelectedSubmissions,
    } = useSubmissionsStore()

    const { data: submissionData, refetch } = useGetSubmissionsByIdQuery(
        selectedSubmissions?._id,
        { skip: !selectedSubmissions?._id }
    )

    useEffect(() => {
        if (selectedSubmissions?._id) {
            refetch()
        }
    }, [selectedSubmissions?._id, refetch])

    useEffect(() => {
        if (submissionData?.data) {
            setSelectedSubmissions(submissionData.data)
        }
    }, [submissionData, setSelectedSubmissions])

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
                    <DialogTitle>Submissions Details</DialogTitle>
                </DialogHeader>
                {selectedSubmissions && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Assessment_id" value={selectedSubmissions['assessment_id']} />
                            <DetailRow label="Student_id " value={selectedSubmissions['student_id ']} />
                            <DetailRow label="Submission_time" value={selectedSubmissions['submission_time']} />
                            <DetailRow label="Submitted_content" value={selectedSubmissions['submitted_content']} />
                            <DetailRow label="Marks_obtained" value={selectedSubmissions['marks_obtained']} />
                            <DetailRow label="Feedback" value={selectedSubmissions['feedback']} />
                            <DetailRow label="Checked_by_mentor_id" value={selectedSubmissions['checked_by_mentor_id']} />
                            <DetailRow label="Created At" value={formatDate(selectedSubmissions.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedSubmissions.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedSubmissions(defaultSubmissions as ISubmissions)
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
