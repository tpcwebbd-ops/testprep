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

import { ILectures, defaultLectures } from '../store/data/data'
import { useLecturesStore } from '../store/store'
import { useGetLecturesByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedLectures,
        toggleViewModal,
        setSelectedLectures,
    } = useLecturesStore()

    const { data: lectureData, refetch } = useGetLecturesByIdQuery(
        selectedLectures?._id,
        { skip: !selectedLectures?._id }
    )

    useEffect(() => {
        if (selectedLectures?._id) {
            refetch()
        }
    }, [selectedLectures?._id, refetch])

    useEffect(() => {
        if (lectureData?.data) {
            setSelectedLectures(lectureData.data)
        }
    }, [lectureData, setSelectedLectures])

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
                    <DialogTitle>Lectures Details</DialogTitle>
                </DialogHeader>
                {selectedLectures && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Module_id" value={selectedLectures['module_id']} />
                            <DetailRow label="Title" value={selectedLectures['title']} />
                            <DetailRow label="Description" value={selectedLectures['description']} />
                            <DetailRow label="Lecture_date" value={formatDate(selectedLectures['lecture_date'])} />
                            <DetailRow label="Order_index" value={selectedLectures['order_index']} />
                            <DetailRow label="Created At" value={formatDate(selectedLectures.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedLectures.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedLectures(defaultLectures as ILectures)
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
