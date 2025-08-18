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

import { IPosts, defaultPosts } from '../api/v1/model'
import { usePostsStore } from '../store/Store'
import { useGetPostsByIdQuery } from '../redux/rtk-Api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedPost,
        toggleViewModal,
        setSelectedPost,
    } = usePostsStore()

    const { data: postData, refetch } = useGetPostsByIdQuery(
        selectedPost?._id,
        { skip: !selectedPost?._id }
    )

    useEffect(() => {
        if (selectedPost?._id) {
            refetch()
        }
    }, [selectedPost?._id, refetch])

    useEffect(() => {
        if (postData?.data) {
            setSelectedPost(postData.data)
        }
    }, [postData, setSelectedPost])

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
                    <DialogTitle>Post Details</DialogTitle>
                </DialogHeader>
                {selectedPost && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Title" value={selectedPost['title']} />
                            <DetailRow label="Books" value={selectedPost['books']} />
                            <DetailRow label="Created At" value={formatDate(selectedPost.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedPost.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedPost(defaultPosts as IPosts)
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
