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

import { IEmployee_Tasks, defaultEmployee_Tasks } from '../store/data/data'
import { useEmployee_TasksStore } from '../store/store'
import { useGetEmployee_TasksByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedEmployee_Tasks,
        toggleViewModal,
        setSelectedEmployee_Tasks,
    } = useEmployee_TasksStore()

    const { data: employee_TaskData, refetch } = useGetEmployee_TasksByIdQuery(
        selectedEmployee_Tasks?._id,
        { skip: !selectedEmployee_Tasks?._id }
    )

    useEffect(() => {
        if (selectedEmployee_Tasks?._id) {
            refetch()
        }
    }, [selectedEmployee_Tasks?._id, refetch])

    useEffect(() => {
        if (employee_TaskData?.data) {
            setSelectedEmployee_Tasks(employee_TaskData.data)
        }
    }, [employee_TaskData, setSelectedEmployee_Tasks])

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
                    <DialogTitle>Employee_Tasks Details</DialogTitle>
                </DialogHeader>
                {selectedEmployee_Tasks && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Title" value={selectedEmployee_Tasks['title']} />
                            <DetailRow label="Description" value={selectedEmployee_Tasks['description']} />
                            <DetailRow label="Assigned_to_id" value={selectedEmployee_Tasks['assigned_to_id']} />
                            <DetailRow label="Assigned_by_id" value={selectedEmployee_Tasks['assigned_by_id']} />
                            <DetailRow label="Start_time" value={selectedEmployee_Tasks['start_time']} />
                            <DetailRow label="End_time" value={selectedEmployee_Tasks['end_time']} />
                            <DetailRow label="Start_date" value={formatDate(selectedEmployee_Tasks['start_date'])} />
                            <DetailRow label="End_date" value={formatDate(selectedEmployee_Tasks['end_date'])} />
                            <DetailRow label="Status" value={selectedEmployee_Tasks['status']} />
                            <DetailRow label="Checked_by_id" value={selectedEmployee_Tasks['checked_by_id']} />
                            <DetailRow label="Created At" value={formatDate(selectedEmployee_Tasks.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedEmployee_Tasks.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedEmployee_Tasks(defaultEmployee_Tasks as IEmployee_Tasks)
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
