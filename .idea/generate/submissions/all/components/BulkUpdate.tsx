import React from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { ISubmissions } from '../store/data/data'
import { useSubmissionsStore } from '../store/store'
import { submissionsSelectorArr } from '../store/store-constant'
import { useBulkUpdateSubmissionsMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const BulkUpdateNextComponents: React.FC = () => {
    const {
        toggleBulkUpdateModal,
        isBulkUpdateModalOpen,
        bulkData,
        setBulkData,
    } = useSubmissionsStore()
    
    const [bulkUpdateSubmissions, { isLoading }] = useBulkUpdateSubmissionsMutation()

    const handleBulkUpdate = async () => {
        if (!bulkData.length) return
        try {
            const newBulkData = bulkData.map(({ _id, ...rest }) => ({
                id: _id,
                updateData: rest,
            }))
            await bulkUpdateSubmissions(newBulkData).unwrap()
            toggleBulkUpdateModal(false)
            setBulkData([])
            handleSuccess('Update Successful')
        } catch (error) {
            console.error('Failed to edit submissions:', error)
            handleError('Failed to update items. Please try again.')
        }
    }

    const handleFieldChangeForAll = (value: string) => {
        setBulkData(
            bulkData.map((submission) => ({
                ...submission,
                ['role']: value,
            })) as ISubmissions[]
        )
    }

    return (
        <Dialog
            open={isBulkUpdateModalOpen}
            onOpenChange={toggleBulkUpdateModal}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Bulk Update</DialogTitle>
                </DialogHeader>
                {bulkData.length > 0 && (
                    <div>
                        <p className="pt-2">
                            You are about to update{' '}
                            <span className="font-semibold">
                                ({bulkData.length})
                            </span>{' '}
                            submissions.
                        </p>
                        <div className="w-full flex items-center justify-between pt-2">
                            <p>Set all <span className="font-semibold">Role</span> to</p>
                            <Select
                                onValueChange={(value) =>
                                    handleFieldChangeForAll(value)
                                }
                                defaultValue={
                                    (submissionsSelectorArr[0] as string) || ''
                                }
                            >
                                <SelectTrigger className="bg-slate-50 w-[180px]">
                                    <SelectValue placeholder="Select a value" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-50">
                                    {submissionsSelectorArr?.map((option, index) => (
                                        <SelectItem
                                            key={option + index}
                                            value={option}
                                            className="cursor-pointer hover:bg-slate-200"
                                        >
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="flex flex-col gap-2">
                        {bulkData.map((submission, idx) => (
                            <div
                                key={(submission._id as string) || idx}
                                className="flex items-center justify-between"
                            >
                                <span>
                                    {idx + 1}. {(submission)['assessment_id'] as string || ''}
                                </span>
                                <span className="text-blue-500">{submission['assessment_id'] as string}</span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => toggleBulkUpdateModal(false)}
                        className="cursor-pointer border-slate-400 hover:border-slate-500"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        variant="outline"
                        onClick={handleBulkUpdate}
                        className="text-green-500 hover:text-green-600 cursor-pointer bg-green-100 hover:bg-green-200 border border-green-300 hover:border-green-400"
                    >
                        {isLoading ? 'Updating...' : 'Update Selected'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BulkUpdateNextComponents
