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

import { IEnrollments, defaultEnrollments } from '../store/data/data'
import { useEnrollmentsStore } from '../store/store'
import { useGetEnrollmentsByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedEnrollments,
        toggleViewModal,
        setSelectedEnrollments,
    } = useEnrollmentsStore()

    const { data: enrollmentData, refetch } = useGetEnrollmentsByIdQuery(
        selectedEnrollments?._id,
        { skip: !selectedEnrollments?._id }
    )

    useEffect(() => {
        if (selectedEnrollments?._id) {
            refetch()
        }
    }, [selectedEnrollments?._id, refetch])

    useEffect(() => {
        if (enrollmentData?.data) {
            setSelectedEnrollments(enrollmentData.data)
        }
    }, [enrollmentData, setSelectedEnrollments])

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
                    <DialogTitle>Enrollments Details</DialogTitle>
                </DialogHeader>
                {selectedEnrollments && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Student_email  " value={selectedEnrollments['student_email  ']} />
                            <DetailRow label="Batch_id" value={selectedEnrollments['batch_id']} />
                            <DetailRow label="Enrollment_date" value={formatDate(selectedEnrollments['enrollment_date'])} />
                            <DetailRow label="Enrollment_time" value={selectedEnrollments['enrollment_time']} />
                            <DetailRow label="Is_complete" value={selectedEnrollments['is_complete']} />
                            <DetailRow label="Payment_id" value={selectedEnrollments['payment_id']} />
                            <DetailRow label="Created At" value={formatDate(selectedEnrollments.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedEnrollments.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedEnrollments(defaultEnrollments as IEnrollments)
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
