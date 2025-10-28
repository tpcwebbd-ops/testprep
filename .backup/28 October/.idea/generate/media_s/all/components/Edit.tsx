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
import UrlInputField from '@/components/dashboard-ui/UrlInputField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { IMedia_s, defaultMedia_s } from '@/app/generate/media_s/all/store/data/data'
import { useMedia_sStore } from '../store/store'
import { useUpdateMedia_sMutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedMedia_s,
        setSelectedMedia_s,
    } = useMedia_sStore()

    const [updateMedia_s, { isLoading }] = useUpdateMedia_sMutation()
    const [editedMedia, setMedia] = useState<IMedia_s>(defaultMedia_s)

    useEffect(() => {
        if (selectedMedia_s) {
            setMedia(selectedMedia_s)
        }
    }, [selectedMedia_s])

    const handleFieldChange = (name: string, value: unknown) => {
        setMedia(prev => ({ ...prev, [name]: value }));
    };

    const handleEditMedia = async () => {
        if (!selectedMedia_s) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedMedia;
            await updateMedia_s({
                id: selectedMedia_s._id,
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

    const file_typeOptions = [
        { label: 'image', value: 'image' },
        { label: 'video', value: 'video' },
        { label: 'pdf', value: 'pdf' },
        { label: 'doc', value: 'doc' }
    ];

    const statusOptions = [
        { label: 'active', value: 'active' },
        { label: 'inactive', value: 'inactive' },
        { label: 'trash', value: 'trash' }
    ];

    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Media</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="uploader_email" className="text-right">
                                Uploader_email
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForEmail id="uploader_email" value={editedMedia['uploader_email']} onChange={(value) => handleFieldChange('uploader_email', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="file_name" className="text-right">
                                File_name
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="file_name" placeholder="File_name" value={editedMedia['file_name']} onChange={(value) => handleFieldChange('file_name', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="file_url" className="text-right">
                                File_url
                            </Label>
                            <div className="col-span-3">
                                <UrlInputField id="file_url" value={editedMedia['file_url']} onChange={(value) => handleFieldChange('file_url', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="file_type" className="text-right">
                                File_type
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={file_typeOptions} value={editedMedia['file_type']} onValueChange={(value) => handleFieldChange('file_type', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={statusOptions} value={editedMedia['status']} onValueChange={(value) => handleFieldChange('status', value)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedMedia_s(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditMedia}
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
