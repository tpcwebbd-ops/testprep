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

import { ICourses, defaultCourses } from '../store/data/data'
import { useCoursesStore } from '../store/store'
import { useGetCoursesByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedCourses,
        toggleViewModal,
        setSelectedCourses,
    } = useCoursesStore()

    const { data: courseData, refetch } = useGetCoursesByIdQuery(
        selectedCourses?._id,
        { skip: !selectedCourses?._id }
    )

    useEffect(() => {
        if (selectedCourses?._id) {
            refetch()
        }
    }, [selectedCourses?._id, refetch])

    useEffect(() => {
        if (courseData?.data) {
            setSelectedCourses(courseData.data)
        }
    }, [courseData, setSelectedCourses])

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
                    <DialogTitle>Courses Details</DialogTitle>
                </DialogHeader>
                {selectedCourses && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Title" value={selectedCourses['title']} />
                            <DetailRow label="Description" value={selectedCourses['description']} />
                            <DetailRow label="Duration_months" value={selectedCourses['duration_months']} />
                            <DetailRow label="Total_lectures" value={selectedCourses['total_lectures']} />
                            <DetailRow label="Is_published" value={selectedCourses['is_published']} />
                            <DetailRow label="Created At" value={formatDate(selectedCourses.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedCourses.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedCourses(defaultCourses as ICourses)
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
