import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { useRolesStore } from '../store/store'
import { useBulkUpdateRolesMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'
import DynamicDataSelect from './DynamicDataSelect'

const BulkDynamicUpdateNextComponents: React.FC = () => {
    const [newItemTags, setNewItemTags] = useState<string[]>([])
    const {
        toggleBulkDynamicUpdateModal,
        isBulkDynamicUpdateModal,
        bulkData,
        setBulkData,
    } = useRolesStore()

    const [bulkUpdateRoles, { isLoading }] = useBulkUpdateRolesMutation()

    const handleBulkEditRoles = async () => {
        if (!bulkData.length) return
        try {
            // Note: This assumes the schema has a 'dataArr' field to be updated.
            // This logic can be adapted if the target field is different.
            const newBulkData = bulkData.map(({ _id, ...rest }) => ({
                id: _id,
                updateData: { ...rest, dataArr: newItemTags },
            }))

            await bulkUpdateRoles(newBulkData).unwrap()
            toggleBulkDynamicUpdateModal(false)
            setBulkData([])
            setNewItemTags([])
            handleSuccess('Update Successful')
        } catch (error) {
            console.error('Failed to edit roles:', error)
            handleError('Failed to update items. Please try again.')
        }
    }

    return (
        <Dialog
            open={isBulkDynamicUpdateModal}
            onOpenChange={toggleBulkDynamicUpdateModal}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Dynamic Update</DialogTitle>
                </DialogHeader>
                {bulkData.length > 0 && (
                    <div>
                        <p className="pt-2">
                            You are about to update{' '}
                            <span className="font-semibold">
                                ({bulkData.length})
                            </span>{' '}
                            roles.
                        </p>
                        <div className="w-full flex items-center justify-between pt-2">
                            <DynamicDataSelect
                                label="Update all data as"
                                newItemTags={newItemTags as string[]}
                                setNewItemTags={setNewItemTags}
                            />
                        </div>
                    </div>
                )}
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="flex flex-col gap-2">
                        {bulkData.map((role, idx) => (
                            <div
                                key={(role._id as string) || idx}
                                className="flex items-start mb-2 justify-between flex-col"
                            >
                                <div className="flex flex-col">
                                    <span>
                                        {idx + 1}.{' '}
                                        {(role)['assign_access'] as string || ''}
                                    </span>
                                    <span className="text-xs mt-0 text-blue-500">
                                        Will be updated to: {newItemTags.join(', ') || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => toggleBulkDynamicUpdateModal(false)}
                        className="cursor-pointer border-slate-400 hover:border-slate-500"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        variant="outline"
                        onClick={handleBulkEditRoles}
                        className="text-green-500 hover:text-green-600 cursor-pointer bg-green-100 hover:bg-green-200 border border-green-300 hover:border-green-400"
                    >
                        {isLoading ? 'Updating...' : 'Update Selected'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BulkDynamicUpdateNextComponents
