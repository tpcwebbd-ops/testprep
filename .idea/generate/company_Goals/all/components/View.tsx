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

import { ICompany_Goals, defaultCompany_Goals } from '../store/data/data'
import { useCompany_GoalsStore } from '../store/store'
import { useGetCompany_GoalsByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedCompany_Goals,
        toggleViewModal,
        setSelectedCompany_Goals,
    } = useCompany_GoalsStore()

    const { data: company_GoalData, refetch } = useGetCompany_GoalsByIdQuery(
        selectedCompany_Goals?._id,
        { skip: !selectedCompany_Goals?._id }
    )

    useEffect(() => {
        if (selectedCompany_Goals?._id) {
            refetch()
        }
    }, [selectedCompany_Goals?._id, refetch])

    useEffect(() => {
        if (company_GoalData?.data) {
            setSelectedCompany_Goals(company_GoalData.data)
        }
    }, [company_GoalData, setSelectedCompany_Goals])

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
                    <DialogTitle>Company_Goals Details</DialogTitle>
                </DialogHeader>
                {selectedCompany_Goals && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Title" value={selectedCompany_Goals['title']} />
                            <DetailRow label="Description" value={selectedCompany_Goals['description']} />
                            <DetailRow label="Set_by_user_id" value={selectedCompany_Goals['set_by_user_id']} />
                            <DetailRow label="Start_date" value={formatDate(selectedCompany_Goals['start_date'])} />
                            <DetailRow label="End_date" value={formatDate(selectedCompany_Goals['end_date'])} />
                            <DetailRow label="Status" value={selectedCompany_Goals['status']} />
                            <DetailRow label="Notes" value={selectedCompany_Goals['notes']} />
                            <DetailRow label="Checked_by_user_id" value={selectedCompany_Goals['checked_by_user_id']} />
                            <DetailRow label="Created At" value={formatDate(selectedCompany_Goals.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedCompany_Goals.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedCompany_Goals(defaultCompany_Goals as ICompany_Goals)
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
