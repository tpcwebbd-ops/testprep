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

import { IMessages, defaultMessages } from '../store/data/data'
import { useMessagesStore } from '../store/store'
import { useGetMessagesByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedMessages,
        toggleViewModal,
        setSelectedMessages,
    } = useMessagesStore()

    const { data: messageData, refetch } = useGetMessagesByIdQuery(
        selectedMessages?._id,
        { skip: !selectedMessages?._id }
    )

    useEffect(() => {
        if (selectedMessages?._id) {
            refetch()
        }
    }, [selectedMessages?._id, refetch])

    useEffect(() => {
        if (messageData?.data) {
            setSelectedMessages(messageData.data)
        }
    }, [messageData, setSelectedMessages])

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
                    <DialogTitle>Messages Details</DialogTitle>
                </DialogHeader>
                {selectedMessages && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Sender_mobilenumber" value={selectedMessages['sender_mobilenumber']} />
                            <DetailRow label="Sender_Name" value={selectedMessages['sender_Name']} />
                            <DetailRow label="Message_content" value={selectedMessages['message_content']} />
                            <DetailRow label="Sent_time" value={selectedMessages['sent_time']} />
                            <DetailRow label="Sent_date" value={formatDate(selectedMessages['sent_date'])} />
                            <DetailRow label="Is_read" value={selectedMessages['is_read']} />
                            <DetailRow label="ReplayBy" value={selectedMessages['replayBy']} />
                            <DetailRow label="ReplayTime" value={selectedMessages['replayTime']} />
                            <DetailRow label="ReplayDate" value={formatDate(selectedMessages['replayDate'])} />
                            <DetailRow label="IsAddTomarkeking" value={selectedMessages['isAddTomarkeking']} />
                            <DetailRow label="Created At" value={formatDate(selectedMessages.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedMessages.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedMessages(defaultMessages as IMessages)
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
