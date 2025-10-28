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

import { IFollow_Ups, defaultFollow_Ups } from '../store/data/data'
import { useFollow_UpsStore } from '../store/store'
import { useGetFollow_UpsByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedFollow_Ups,
        toggleViewModal,
        setSelectedFollow_Ups,
    } = useFollow_UpsStore()

    const { data: follow_UpData, refetch } = useGetFollow_UpsByIdQuery(
        selectedFollow_Ups?._id,
        { skip: !selectedFollow_Ups?._id }
    )

    useEffect(() => {
        if (selectedFollow_Ups?._id) {
            refetch()
        }
    }, [selectedFollow_Ups?._id, refetch])

    useEffect(() => {
        if (follow_UpData?.data) {
            setSelectedFollow_Ups(follow_UpData.data)
        }
    }, [follow_UpData, setSelectedFollow_Ups])

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
                    <DialogTitle>Follow_Ups Details</DialogTitle>
                </DialogHeader>
                {selectedFollow_Ups && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Lead_id" value={selectedFollow_Ups['lead_id']} />
                            <DetailRow label="Followed_by_id" value={selectedFollow_Ups['followed_by_id']} />
                            <DetailRow label="Follow_up_date" value={formatDate(selectedFollow_Ups['follow_up_date'])} />
                            <DetailRow label="Follow_up_time" value={selectedFollow_Ups['follow_up_time']} />
                            <DetailRow label="Response_note" value={selectedFollow_Ups['response_note']} />
                            <DetailRow label="Created At" value={formatDate(selectedFollow_Ups.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedFollow_Ups.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedFollow_Ups(defaultFollow_Ups as IFollow_Ups)
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
