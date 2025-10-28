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
import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail'
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString'
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import { DateField } from '@/components/dashboard-ui/DateField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { ICompany_Goals, defaultCompany_Goals } from '@/app/generate/company_Goals/all/store/data/data'
import { useCompany_GoalsStore } from '../store/store'
import { useUpdateCompany_GoalsMutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedCompany_Goals,
        setSelectedCompany_Goals,
    } = useCompany_GoalsStore()

    const [updateCompany_Goals, { isLoading }] = useUpdateCompany_GoalsMutation()
    const [editedCompany_Goal, setCompany_Goal] = useState<ICompany_Goals>(defaultCompany_Goals)

    useEffect(() => {
        if (selectedCompany_Goals) {
            setCompany_Goal(selectedCompany_Goals)
        }
    }, [selectedCompany_Goals])

    const handleFieldChange = (name: string, value: unknown) => {
        setCompany_Goal(prev => ({ ...prev, [name]: value }));
    };

    const handleEditCompany_Goal = async () => {
        if (!selectedCompany_Goals) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedCompany_Goal;
            await updateCompany_Goals({
                id: selectedCompany_Goals._id,
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

    const statusOptions = [
        { label: 'Think', value: 'Think' },
        { label: 'Planning', value: 'Planning' },
        { label: 'Active', value: 'Active' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Failed', value: 'Failed' }
    ];

    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Company_Goal</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="title" placeholder="Title" value={editedCompany_Goal['title']} onChange={(value) => handleFieldChange('title', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="description" value={editedCompany_Goal['description']} onChange={(e) => handleFieldChange('description', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="set_by_user_id" className="text-right">
                                Set_by_user_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="set_by_user_id" placeholder="Set_by_user_id" value={editedCompany_Goal['set_by_user_id']} onChange={(value) => handleFieldChange('set_by_user_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="start_date" className="text-right">
                                Start_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="start_date" value={editedCompany_Goal['start_date']} onChange={(date) => handleFieldChange('start_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="end_date" className="text-right">
                                End_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="end_date" value={editedCompany_Goal['end_date']} onChange={(date) => handleFieldChange('end_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={statusOptions} value={editedCompany_Goal['status']} onValueChange={(value) => handleFieldChange('status', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="notes" className="text-right">
                                Notes
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="notes" value={editedCompany_Goal['notes']} onChange={(e) => handleFieldChange('notes', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="checked_by_user_id" className="text-right">
                                Checked_by_user_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForEmail id="checked_by_user_id" value={editedCompany_Goal['checked_by_user_id']} onChange={(value) => handleFieldChange('checked_by_user_id', value as string)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedCompany_Goals(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditCompany_Goal}
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
