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

import { ISupport_Tickets, defaultSupport_Tickets } from '../store/data/data'
import { useSupport_TicketsStore } from '../store/store'
import { useGetSupport_TicketsByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedSupport_Tickets,
        toggleViewModal,
        setSelectedSupport_Tickets,
    } = useSupport_TicketsStore()

    const { data: support_TicketData, refetch } = useGetSupport_TicketsByIdQuery(
        selectedSupport_Tickets?._id,
        { skip: !selectedSupport_Tickets?._id }
    )

    useEffect(() => {
        if (selectedSupport_Tickets?._id) {
            refetch()
        }
    }, [selectedSupport_Tickets?._id, refetch])

    useEffect(() => {
        if (support_TicketData?.data) {
            setSelectedSupport_Tickets(support_TicketData.data)
        }
    }, [support_TicketData, setSelectedSupport_Tickets])

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
                    <DialogTitle>Support_Tickets Details</DialogTitle>
                </DialogHeader>
                {selectedSupport_Tickets && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Student_id" value={selectedSupport_Tickets['student_id']} />
                            <DetailRow label="Assigned_to_id " value={selectedSupport_Tickets['assigned_to_id ']} />
                            <DetailRow label="Title" value={selectedSupport_Tickets['title']} />
                            <DetailRow label="Description" value={selectedSupport_Tickets['description']} />
                            <DetailRow label="Created_at" value={selectedSupport_Tickets['created_at']} />
                            <DetailRow label="Closed_at" value={selectedSupport_Tickets['closed_at']} />
                            <DetailRow label="Status" value={selectedSupport_Tickets['status']} />
                            <DetailRow label="Created At" value={formatDate(selectedSupport_Tickets.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedSupport_Tickets.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedSupport_Tickets(defaultSupport_Tickets as ISupport_Tickets)
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
