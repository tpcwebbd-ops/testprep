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
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { IPosts, defaultPosts } from '@/app/generate/posts/all/store/data/data'
import { usePostsStore } from '../store/store'
import { useUpdatePostsMutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedPosts,
        setSelectedPosts,
    } = usePostsStore()

    const [updatePosts, { isLoading }] = useUpdatePostsMutation()
    const [editedPost, setPost] = useState<IPosts>(defaultPosts)

    useEffect(() => {
        if (selectedPosts) {
            setPost(selectedPosts)
        }
    }, [selectedPosts])

    const handleFieldChange = (name: string, value: unknown) => {
        setPost(prev => ({ ...prev, [name]: value }));
    };

    const handleEditPost = async () => {
        if (!selectedPosts) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedPost;
            await updatePosts({
                id: selectedPosts._id,
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

    const post_typeOptions = [
        { label: 'Blog', value: 'Blog' },
        { label: 'Notice', value: 'Notice' },
        { label: 'Social Media', value: 'Social Media' }
    ];

    const publish_mediaOptions = [
        { label: 'Website', value: 'Website' },
        { label: 'Facebook', value: 'Facebook' },
        { label: 'YouTube', value: 'YouTube' }
    ];

    const statusOptions = [
        { label: 'Draft', value: 'Draft' },
        { label: 'Published', value: 'Published' },
        { label: 'Archive', value: 'Archive' },
        { label: 'Schedule', value: 'Schedule' }
    ];

    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Post</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="author_id" className="text-right">
                                Author_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="author_id" placeholder="Author_id" value={editedPost['author_id']} onChange={(value) => handleFieldChange('author_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="title" placeholder="Title" value={editedPost['title']} onChange={(value) => handleFieldChange('title', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="content" className="text-right">
                                Content
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="content" value={editedPost['content']} onChange={(e) => handleFieldChange('content', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="published_date" className="text-right">
                                Published_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="published_date" value={editedPost['published_date']} onChange={(date) => handleFieldChange('published_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="published_time" className="text-right">
                                Published_time
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="published_time" value={editedPost['published_time']} onChange={(time) => handleFieldChange('published_time', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="checked_by_user_id" className="text-right">
                                Checked_by_user_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="checked_by_user_id" placeholder="Checked_by_user_id" value={editedPost['checked_by_user_id']} onChange={(value) => handleFieldChange('checked_by_user_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="post_type" className="text-right">
                                Post_type
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={post_typeOptions} value={editedPost['post_type']} onValueChange={(value) => handleFieldChange('post_type', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="publish_media" className="text-right">
                                Publish_media
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={publish_mediaOptions} value={editedPost['publish_media']} onValueChange={(value) => handleFieldChange('publish_media', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={statusOptions} value={editedPost['status']} onValueChange={(value) => handleFieldChange('status', value)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedPosts(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditPost}
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
