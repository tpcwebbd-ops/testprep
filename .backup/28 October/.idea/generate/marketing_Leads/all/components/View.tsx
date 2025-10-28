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

import { IMarketing_Leads, defaultMarketing_Leads } from '../store/data/data'
import { useMarketing_LeadsStore } from '../store/store'
import { useGetMarketing_LeadsByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedMarketing_Leads,
        toggleViewModal,
        setSelectedMarketing_Leads,
    } = useMarketing_LeadsStore()

    const { data: marketing_LeadData, refetch } = useGetMarketing_LeadsByIdQuery(
        selectedMarketing_Leads?._id,
        { skip: !selectedMarketing_Leads?._id }
    )

    useEffect(() => {
        if (selectedMarketing_Leads?._id) {
            refetch()
        }
    }, [selectedMarketing_Leads?._id, refetch])

    useEffect(() => {
        if (marketing_LeadData?.data) {
            setSelectedMarketing_Leads(marketing_LeadData.data)
        }
    }, [marketing_LeadData, setSelectedMarketing_Leads])

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
                    <DialogTitle>Marketing_Leads Details</DialogTitle>
                </DialogHeader>
                {selectedMarketing_Leads && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Full_name" value={selectedMarketing_Leads['full_name']} />
                            <DetailRow label="Phone_number" value={selectedMarketing_Leads['phone_number']} />
                            <DetailRow label="Email" value={selectedMarketing_Leads['email']} />
                            <DetailRow label="Source_content" value={selectedMarketing_Leads['source_content']} />
                            <DetailRow label="Collected_by" value={selectedMarketing_Leads['collected_by']} />
                            <DetailRow label="Notes" value={selectedMarketing_Leads['notes']} />
                            <DetailRow label="Created At" value={formatDate(selectedMarketing_Leads.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedMarketing_Leads.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedMarketing_Leads(defaultMarketing_Leads as IMarketing_Leads)
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
