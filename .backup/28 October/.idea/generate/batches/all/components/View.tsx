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

import { IBatches, defaultBatches } from '../store/data/data'
import { useBatchesStore } from '../store/store'
import { useGetBatchesByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedBatches,
        toggleViewModal,
        setSelectedBatches,
    } = useBatchesStore()

    const { data: batchData, refetch } = useGetBatchesByIdQuery(
        selectedBatches?._id,
        { skip: !selectedBatches?._id }
    )

    useEffect(() => {
        if (selectedBatches?._id) {
            refetch()
        }
    }, [selectedBatches?._id, refetch])

    useEffect(() => {
        if (batchData?.data) {
            setSelectedBatches(batchData.data)
        }
    }, [batchData, setSelectedBatches])

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
                    <DialogTitle>Batches Details</DialogTitle>
                </DialogHeader>
                {selectedBatches && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Batch_title" value={selectedBatches['batch_title']} />
                            <DetailRow label="Course_id" value={selectedBatches['course_id']} />
                            <DetailRow label="Start_date" value={formatDate(selectedBatches['start_date'])} />
                            <DetailRow label="End_date" value={formatDate(selectedBatches['end_date'])} />
                            <DetailRow label="Status" value={selectedBatches['status']} />
                            <DetailRow label="Instructors_user_id" value={selectedBatches['instructors_user_id']} />
                            <DetailRow label="Instructors_name" value={selectedBatches['instructors_name']} />
                            <DetailRow label="Enroll_students" value={selectedBatches['enroll_students']} />
                            <DetailRow label="Created At" value={formatDate(selectedBatches.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedBatches.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedBatches(defaultBatches as IBatches)
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
