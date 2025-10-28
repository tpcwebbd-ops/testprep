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

import { IMedia_s, defaultMedia_s } from '../store/data/data'
import { useMedia_sStore } from '../store/store'
import { useGetMedia_sByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedMedia_s,
        toggleViewModal,
        setSelectedMedia_s,
    } = useMedia_sStore()

    const { data: mediaData, refetch } = useGetMedia_sByIdQuery(
        selectedMedia_s?._id,
        { skip: !selectedMedia_s?._id }
    )

    useEffect(() => {
        if (selectedMedia_s?._id) {
            refetch()
        }
    }, [selectedMedia_s?._id, refetch])

    useEffect(() => {
        if (mediaData?.data) {
            setSelectedMedia_s(mediaData.data)
        }
    }, [mediaData, setSelectedMedia_s])

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
                    <DialogTitle>Media_s Details</DialogTitle>
                </DialogHeader>
                {selectedMedia_s && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Uploader_email" value={selectedMedia_s['uploader_email']} />
                            <DetailRow label="File_name" value={selectedMedia_s['file_name']} />
                            <DetailRow label="File_url" value={selectedMedia_s['file_url']} />
                            <DetailRow label="File_type" value={selectedMedia_s['file_type']} />
                            <DetailRow label="Status" value={selectedMedia_s['status']} />
                            <DetailRow label="Created At" value={formatDate(selectedMedia_s.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedMedia_s.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedMedia_s(defaultMedia_s as IMedia_s)
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
