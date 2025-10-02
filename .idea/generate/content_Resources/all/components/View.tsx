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

import { IContent_Resources, defaultContent_Resources } from '../store/data/data'
import { useContent_ResourcesStore } from '../store/store'
import { useGetContent_ResourcesByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedContent_Resources,
        toggleViewModal,
        setSelectedContent_Resources,
    } = useContent_ResourcesStore()

    const { data: content_ResourcData, refetch } = useGetContent_ResourcesByIdQuery(
        selectedContent_Resources?._id,
        { skip: !selectedContent_Resources?._id }
    )

    useEffect(() => {
        if (selectedContent_Resources?._id) {
            refetch()
        }
    }, [selectedContent_Resources?._id, refetch])

    useEffect(() => {
        if (content_ResourcData?.data) {
            setSelectedContent_Resources(content_ResourcData.data)
        }
    }, [content_ResourcData, setSelectedContent_Resources])

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
                    <DialogTitle>Content_Resources Details</DialogTitle>
                </DialogHeader>
                {selectedContent_Resources && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Lecture_id" value={selectedContent_Resources['lecture_id']} />
                            <DetailRow label="Title" value={selectedContent_Resources['title']} />
                            <DetailRow label="Url_or_content" value={selectedContent_Resources['url_or_content']} />
                            <DetailRow label="Media_id" value={selectedContent_Resources['media_id']} />
                            <DetailRow label="Content_type" value={selectedContent_Resources['content_type']} />
                            <DetailRow label="Created At" value={formatDate(selectedContent_Resources.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedContent_Resources.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedContent_Resources(defaultContent_Resources as IContent_Resources)
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
