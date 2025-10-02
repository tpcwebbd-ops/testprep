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

import { IQ_and_A_s, defaultQ_and_A_s } from '../store/data/data'
import { useQ_and_A_sStore } from '../store/store'
import { useGetQ_and_A_sByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedQ_and_A_s,
        toggleViewModal,
        setSelectedQ_and_A_s,
    } = useQ_and_A_sStore()

    const { data: q_and_AData, refetch } = useGetQ_and_A_sByIdQuery(
        selectedQ_and_A_s?._id,
        { skip: !selectedQ_and_A_s?._id }
    )

    useEffect(() => {
        if (selectedQ_and_A_s?._id) {
            refetch()
        }
    }, [selectedQ_and_A_s?._id, refetch])

    useEffect(() => {
        if (q_and_AData?.data) {
            setSelectedQ_and_A_s(q_and_AData.data)
        }
    }, [q_and_AData, setSelectedQ_and_A_s])

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
                    <DialogTitle>Q_and_A_s Details</DialogTitle>
                </DialogHeader>
                {selectedQ_and_A_s && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Course_id" value={selectedQ_and_A_s['course_id']} />
                            <DetailRow label="Lecture_id" value={selectedQ_and_A_s['lecture_id']} />
                            <DetailRow label="Student_uid" value={selectedQ_and_A_s['student_uid']} />
                            <DetailRow label="Question_text" value={selectedQ_and_A_s['question_text']} />
                            <DetailRow label="Question_time" value={selectedQ_and_A_s['question_time']} />
                            <DetailRow label="Answer_text" value={selectedQ_and_A_s['answer_text']} />
                            <DetailRow label="Answered_by_user_id" value={selectedQ_and_A_s['answered_by_user_id']} />
                            <DetailRow label="Answer_time" value={selectedQ_and_A_s['answer_time']} />
                            <DetailRow label="Created At" value={formatDate(selectedQ_and_A_s.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedQ_and_A_s.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedQ_and_A_s(defaultQ_and_A_s as IQ_and_A_s)
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
