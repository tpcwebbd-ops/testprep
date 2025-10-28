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

import { IRewards, defaultRewards } from '../store/data/data'
import { useRewardsStore } from '../store/store'
import { useGetRewardsByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedRewards,
        toggleViewModal,
        setSelectedRewards,
    } = useRewardsStore()

    const { data: rewardData, refetch } = useGetRewardsByIdQuery(
        selectedRewards?._id,
        { skip: !selectedRewards?._id }
    )

    useEffect(() => {
        if (selectedRewards?._id) {
            refetch()
        }
    }, [selectedRewards?._id, refetch])

    useEffect(() => {
        if (rewardData?.data) {
            setSelectedRewards(rewardData.data)
        }
    }, [rewardData, setSelectedRewards])

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
                    <DialogTitle>Rewards Details</DialogTitle>
                </DialogHeader>
                {selectedRewards && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="User_id" value={selectedRewards['user_id']} />
                            <DetailRow label="User_Name" value={selectedRewards['user_Name']} />
                            <DetailRow label="Given_by_id" value={selectedRewards['given_by_id']} />
                            <DetailRow label="Given_by_Name" value={selectedRewards['given_by_Name']} />
                            <DetailRow label="Reward_date" value={formatDate(selectedRewards['reward_date'])} />
                            <DetailRow label="Reward_time" value={selectedRewards['reward_time']} />
                            <DetailRow label="Reason" value={selectedRewards['reason']} />
                            <DetailRow label="Created At" value={formatDate(selectedRewards.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedRewards.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedRewards(defaultRewards as IRewards)
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
