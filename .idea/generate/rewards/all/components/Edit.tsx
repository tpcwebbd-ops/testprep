import React, { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

// Dynamically import only the components needed for the form
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString'
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import TimeField from '@/components/dashboard-ui/TimeField'
import { DateField } from '@/components/dashboard-ui/DateField'

import { IRewards, defaultRewards } from '@/app/generate/rewards/all/store/data/data'
import { useRewardsStore } from '../store/store'
import { useUpdateRewardsMutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedRewards,
        setSelectedRewards,
    } = useRewardsStore()

    const [updateRewards, { isLoading }] = useUpdateRewardsMutation()
    const [editedReward, setReward] = useState<IRewards>(defaultRewards)

    useEffect(() => {
        if (selectedRewards) {
            setReward(selectedRewards)
        }
    }, [selectedRewards])

    const handleFieldChange = (name: string, value: unknown) => {
        setReward(prev => ({ ...prev, [name]: value }));
    };

    const handleEditReward = async () => {
        if (!selectedRewards) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedReward;
            await updateRewards({
                id: selectedRewards._id,
                ...updateData,
            }).unwrap()
            toggleEditModal(false)
            handleSuccess('Edit Successful')
        } catch (error: unknown) {
            console.error('Failed to update record:', error)
            let errMessage: string = 'An unknown error occurred.'
            if (isApiErrorResponse(error)) {
                errMessage = formatDuplicateKeyError(error.data.message) || 'An API error occurred.'
            } else if (error instanceof Error) {
                errMessage = error.message
            }
            handleError(errMessage)
        }
    }



    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Reward</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="user_id" className="text-right">
                                User_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="user_id" placeholder="User_id" value={editedReward['user_id']} onChange={(value) => handleFieldChange('user_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="user_Name" className="text-right">
                                User_Name
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="user_Name" placeholder="User_Name" value={editedReward['user_Name']} onChange={(value) => handleFieldChange('user_Name', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="given_by_id" className="text-right">
                                Given_by_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="given_by_id" placeholder="Given_by_id" value={editedReward['given_by_id']} onChange={(value) => handleFieldChange('given_by_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="given_by_Name" className="text-right">
                                Given_by_Name
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="given_by_Name" placeholder="Given_by_Name" value={editedReward['given_by_Name']} onChange={(value) => handleFieldChange('given_by_Name', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="reward_date" className="text-right">
                                Reward_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="reward_date" value={editedReward['reward_date']} onChange={(date) => handleFieldChange('reward_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="reward_time" className="text-right">
                                Reward_time
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="reward_time" value={editedReward['reward_time']} onChange={(time) => handleFieldChange('reward_time', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="reason" className="text-right">
                                Reason
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="reason" value={editedReward['reason']} onChange={(e) => handleFieldChange('reason', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedRewards(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditReward}
                        className="bg-green-100 text-green-600 hover:bg-green-200"
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditNextComponents
