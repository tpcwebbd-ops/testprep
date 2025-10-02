import React from 'react'

import { Label } from '@/components/ui/label'
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

import { IWebsite_Settings } from '../store/data/data'
import { useWebsite_SettingsStore } from '../store/store'
import { useBulkUpdateWebsite_SettingsMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const BulkEditNextComponents: React.FC = () => {
    const { isBulkEditModalOpen, toggleBulkEditModal, bulkData, setBulkData } =
        useWebsite_SettingsStore()
    const [bulkUpdateWebsite_Settings, { isLoading }] = useBulkUpdateWebsite_SettingsMutation()

    const handleBulkEditWebsite_Settings = async () => {
        if (!bulkData.length) return
        try {
            const newBulkData = bulkData.map(({ _id, ...rest }) => ({
                id: _id,
                updateData: rest,
            }))
            await bulkUpdateWebsite_Settings(newBulkData).unwrap()
            toggleBulkEditModal(false)
            setBulkData([])
            handleSuccess('Edit Successful')
        } catch (error) {
            console.error('Failed to edit website_Settings:', error)
            handleError('Failed to update items. Please try again.')
        }
    }

    const handleFieldChange = (itemId: string, fieldName: string, value: string) => {
        setBulkData(
            bulkData.map((website_setting) =>
                website_setting._id === itemId
                    ? { ...website_setting, [fieldName]: value }
                    : website_setting
            ) as IWebsite_Settings[]
        )
    }

    return (
        <Dialog open={isBulkEditModalOpen} onOpenChange={toggleBulkEditModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Bulk Update</DialogTitle>
                </DialogHeader>
                {bulkData.length > 0 && (
                    <p className="pt-4">
                        You are about to update{' '}
                        <span className="font-semibold">
                            ({bulkData.length})
                        </span>{' '}
                        website_Settings.
                    </p>
                )}
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="flex flex-col gap-2">
                        {bulkData.map((website_setting, idx) => (
                            <div
                                key={(website_setting._id as string) || idx}
                                className="flex items-center justify-between"
                            >
                                <span>
                                    {idx + 1}. {(website_setting)['Name'] as string || ''}
                                </span>
                                
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => toggleBulkEditModal(false)}
                        className="cursor-pointer border-slate-400 hover:border-slate-500"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        variant="outline"
                        onClick={handleBulkEditWebsite_Settings}
                        className="text-green-500 hover:text-green-600 cursor-pointer bg-green-100 hover:bg-green-200 border border-green-300 hover:border-green-400"
                    >
                        {isLoading ? 'Updating...' : 'Update Selected'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BulkEditNextComponents
