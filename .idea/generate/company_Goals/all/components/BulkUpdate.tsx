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

import { ICompany_Goals } from '../store/data/data'
import { useCompany_GoalsStore } from '../store/store'
import { company_GoalsSelectorArr } from '../store/store-constant'
import { useBulkUpdateCompany_GoalsMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const BulkUpdateNextComponents: React.FC = () => {
    const {
        toggleBulkUpdateModal,
        isBulkUpdateModalOpen,
        bulkData,
        setBulkData,
    } = useCompany_GoalsStore()
    
    const [bulkUpdateCompany_Goals, { isLoading }] = useBulkUpdateCompany_GoalsMutation()

    const handleBulkUpdate = async () => {
        if (!bulkData.length) return
        try {
            const newBulkData = bulkData.map(({ _id, ...rest }) => ({
                id: _id,
                updateData: rest,
            }))
            await bulkUpdateCompany_Goals(newBulkData).unwrap()
            toggleBulkUpdateModal(false)
            setBulkData([])
            handleSuccess('Update Successful')
        } catch (error) {
            console.error('Failed to edit company_Goals:', error)
            handleError('Failed to update items. Please try again.')
        }
    }

    const handleFieldChangeForAll = (value: string) => {
        setBulkData(
            bulkData.map((company_goal) => ({
                ...company_goal,
                ['role']: value,
            })) as ICompany_Goals[]
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
                            company_Goals.
                        </p>
                        <div className="w-full flex items-center justify-between pt-2">
                            <p>Set all <span className="font-semibold">Role</span> to</p>
                            <Select
                                onValueChange={(value) =>
                                    handleFieldChangeForAll(value)
                                }
                                defaultValue={
                                    (company_GoalsSelectorArr[0] as string) || ''
                                }
                            >
                                <SelectTrigger className="bg-slate-50 w-[180px]">
                                    <SelectValue placeholder="Select a value" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-50">
                                    {company_GoalsSelectorArr?.map((option, index) => (
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
                        {bulkData.map((company_goal, idx) => (
                            <div
                                key={(company_goal._id as string) || idx}
                                className="flex items-center justify-between"
                            >
                                <span>
                                    {idx + 1}. {(company_goal)['title'] as string || ''}
                                </span>
                                <span className="text-blue-500">{company_goal['title'] as string}</span>
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
