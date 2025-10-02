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

import { IPosts_n, defaultPosts_n } from '../store/data/data'
import { usePosts_nStore } from '../store/store'
import { useGetPosts_nByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedPosts_n,
        toggleViewModal,
        setSelectedPosts_n,
    } = usePosts_nStore()

    const { data: post_nData, refetch } = useGetPosts_nByIdQuery(
        selectedPosts_n?._id,
        { skip: !selectedPosts_n?._id }
    )

    useEffect(() => {
        if (selectedPosts_n?._id) {
            refetch()
        }
    }, [selectedPosts_n?._id, refetch])

    useEffect(() => {
        if (post_nData?.data) {
            setSelectedPosts_n(post_nData.data)
        }
    }, [post_nData, setSelectedPosts_n])

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
                    <DialogTitle>Posts_n Details</DialogTitle>
                </DialogHeader>
                {selectedPosts_n && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Title" value={selectedPosts_n['title']} />
                            <DetailRow label="Description" value={selectedPosts_n['description']} />
                            <DetailRow label="Set_by_user_id" value={selectedPosts_n['set_by_user_id']} />
                            <DetailRow label="Start_date" value={formatDate(selectedPosts_n['start_date'])} />
                            <DetailRow label="End_date" value={formatDate(selectedPosts_n['end_date'])} />
                            <DetailRow label="Status" value={selectedPosts_n['status']} />
                            <DetailRow label="Notes" value={selectedPosts_n['notes']} />
                            <DetailRow label="Checked_by_user_id" value={selectedPosts_n['checked_by_user_id']} />
                            <DetailRow label="Created At" value={formatDate(selectedPosts_n.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedPosts_n.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedPosts_n(defaultPosts_n as IPosts_n)
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
