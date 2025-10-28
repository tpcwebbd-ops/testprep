import { useState } from 'react'

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

import { useCompany_GoalsStore } from '../store/store'
import { useAddCompany_GoalsMutation } from '../redux/rtk-api'
import { ICompany_Goals, defaultCompany_Goals } from '@/app/generate/company_Goals/all/store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setCompany_Goals } = useCompany_GoalsStore()
    const [addCompany_Goals, { isLoading }] = useAddCompany_GoalsMutation()
    const [newCompany_Goal, setNewCompany_Goal] = useState<ICompany_Goals>(defaultCompany_Goals)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewCompany_Goal(prev => ({ ...prev, [name]: value }));
    };

    const handleAddCompany_Goal = async () => {
        try {
            const { _id, ...updateData } = newCompany_Goal
            console.log('Adding new record:', updateData)
            const addedCompany_Goal = await addCompany_Goals(updateData).unwrap()
            setCompany_Goals([addedCompany_Goal])
            toggleAddModal(false)
            setNewCompany_Goal(defaultCompany_Goals)
            handleSuccess('Added Successfully')
        } catch (error: unknown) {
            console.error('Failed to add record:', error)
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
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add New Company_Goal</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="title" placeholder="Title" value={newCompany_Goal['title']} onChange={(value) => handleFieldChange('title', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="description" value={newCompany_Goal['description']} onChange={(e) => handleFieldChange('description', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="set_by_user_id" className="text-right">
                                Set_by_user_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="set_by_user_id" placeholder="Set_by_user_id" value={newCompany_Goal['set_by_user_id']} onChange={(value) => handleFieldChange('set_by_user_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="start_date" className="text-right">
                                Start_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="start_date" value={newCompany_Goal['start_date']} onChange={(date) => handleFieldChange('start_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="end_date" className="text-right">
                                End_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="end_date" value={newCompany_Goal['end_date']} onChange={(date) => handleFieldChange('end_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={statusOptions} value={newCompany_Goal['status']} onValueChange={(value) => handleFieldChange('status', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="notes" className="text-right">
                                Notes
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="notes" value={newCompany_Goal['notes']} onChange={(e) => handleFieldChange('notes', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="checked_by_user_id" className="text-right">
                                Checked_by_user_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForEmail id="checked_by_user_id" value={newCompany_Goal['checked_by_user_id']} onChange={(value) => handleFieldChange('checked_by_user_id', value as string)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => toggleAddModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleAddCompany_Goal}
                    >
                        {isLoading ? 'Adding...' : 'Add Company_Goal'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
