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
import UrlInputField from '@/components/dashboard-ui/UrlInputField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { IContent_Resources, defaultContent_Resources } from '@/app/generate/content_Resources/all/store/data/data'
import { useContent_ResourcesStore } from '../store/store'
import { useUpdateContent_ResourcesMutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedContent_Resources,
        setSelectedContent_Resources,
    } = useContent_ResourcesStore()

    const [updateContent_Resources, { isLoading }] = useUpdateContent_ResourcesMutation()
    const [editedContent_Resourc, setContent_Resourc] = useState<IContent_Resources>(defaultContent_Resources)

    useEffect(() => {
        if (selectedContent_Resources) {
            setContent_Resourc(selectedContent_Resources)
        }
    }, [selectedContent_Resources])

    const handleFieldChange = (name: string, value: unknown) => {
        setContent_Resourc(prev => ({ ...prev, [name]: value }));
    };

    const handleEditContent_Resourc = async () => {
        if (!selectedContent_Resources) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedContent_Resourc;
            await updateContent_Resources({
                id: selectedContent_Resources._id,
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

    const content_typeOptions = [
        { label: 'video', value: 'video' },
        { label: 'pdf', value: 'pdf' },
        { label: 'text', value: 'text' },
        { label: 'description', value: 'description' }
    ];

    const url_or_contentOptions = [
        { label: 'url', value: 'url' },
        { label: 'content', value: 'content' }
    ];

    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Content_Resourc</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="lecture_id" className="text-right">
                                Lecture_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="lecture_id" placeholder="Lecture_id" value={editedContent_Resourc['lecture_id']} onChange={(value) => handleFieldChange('lecture_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="title" placeholder="Title" value={editedContent_Resourc['title']} onChange={(value) => handleFieldChange('title', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="url_or_content" className="text-right">
                                Url_or_content
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={url_or_contentOptions} value={editedContent_Resourc['url_or_content']} onValueChange={(value) => handleFieldChange('url_or_content', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="media_id" className="text-right">
                                Media_id
                            </Label>
                            <div className="col-span-3">
                                <UrlInputField id="media_id" value={editedContent_Resourc['media_id']} onChange={(value) => handleFieldChange('media_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="content_type" className="text-right">
                                Content_type
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={content_typeOptions} value={editedContent_Resourc['content_type']} onValueChange={(value) => handleFieldChange('content_type', value)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedContent_Resources(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditContent_Resourc}
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
