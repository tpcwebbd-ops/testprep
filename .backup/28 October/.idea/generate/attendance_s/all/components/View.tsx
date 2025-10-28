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

import { IAttendance_s, defaultAttendance_s } from '../store/data/data'
import { useAttendance_sStore } from '../store/store'
import { useGetAttendance_sByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedAttendance_s,
        toggleViewModal,
        setSelectedAttendance_s,
    } = useAttendance_sStore()

    const { data: attendanceData, refetch } = useGetAttendance_sByIdQuery(
        selectedAttendance_s?._id,
        { skip: !selectedAttendance_s?._id }
    )

    useEffect(() => {
        if (selectedAttendance_s?._id) {
            refetch()
        }
    }, [selectedAttendance_s?._id, refetch])

    useEffect(() => {
        if (attendanceData?.data) {
            setSelectedAttendance_s(attendanceData.data)
        }
    }, [attendanceData, setSelectedAttendance_s])

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
                    <DialogTitle>Attendance_s Details</DialogTitle>
                </DialogHeader>
                {selectedAttendance_s && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="User_id" value={selectedAttendance_s['user_id']} />
                            <DetailRow label="Date" value={formatDate(selectedAttendance_s['date'])} />
                            <DetailRow label="Time" value={selectedAttendance_s['time']} />
                            <DetailRow label="Notes" value={selectedAttendance_s['notes']} />
                            <DetailRow label="Status" value={selectedAttendance_s['status']} />
                            <DetailRow label="Created At" value={formatDate(selectedAttendance_s.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedAttendance_s.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedAttendance_s(defaultAttendance_s as IAttendance_s)
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
