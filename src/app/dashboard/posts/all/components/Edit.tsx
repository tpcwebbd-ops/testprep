import React, { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { IPosts, defaultPosts } from '../api/v1/model'
import { usePostsStore } from '../store/Store'
import { useUpdatePostsMutation } from '../redux/rtk-Api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const InputField: React.FC<{
    id: string
    name: string
    label: string
    type?: string
    value: string | number
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}> = ({ id, name, label, type = 'text', value, onChange }) => (
    <div className="grid grid-cols-4 items-center gap-4 pr-1">
        <Label htmlFor={id} className="text-right">
            {label}
        </Label>
        {type === 'textarea' ? (
            <Textarea
                id={id}
                name={name}
                value={value as string}
                onChange={onChange}
                className="col-span-3"
            />
        ) : (
            <Input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className="col-span-3"
            />
        )}
    </div>
)

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedPost,
        setSelectedPost,
    } = usePostsStore()

    const [updatePosts, { isLoading }] = useUpdatePostsMutation()
    const [editedPost, setPost] = useState<IPosts>(defaultPosts)

    useEffect(() => {
        if (selectedPost) {
            setPost(selectedPost)
        }
    }, [selectedPost])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setPost({ ...editedPost, [name]: value })
    }

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setPost({ ...editedPost, [name]: checked })
    }

    const handleSelectChange = (name: string, value: string) => {
        setPost({ ...editedPost, [name]: value })
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
        const { value } = e.target
        if (nestedField) {
            setPost({
                ...editedPost,
                [field]: {
                    ...(editedPost[field as keyof IPosts] as object),
                    [nestedField]: new Date(value),
                },
            })
        } else {
            setPost({ ...editedPost, [field]: new Date(value) })
        }
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
        const { value } = e.target
        if (nestedField) {
            setPost({
                ...editedPost,
                [field]: {
                    ...(editedPost[field as keyof IPosts] as object),
                    [nestedField]: value,
                },
            })
        } else {
            setPost({ ...editedPost, [field]: value })
        }
    }

    const handleArrayChange = (name: string, value: string) => {
        setPost({ ...editedPost, [name]: value.split(',').map(s => s.trim()) })
    }

    const handleEditPost = async () => {
        if (!selectedPost) return

        try {
            await updatePosts({
                id: selectedPost._id,
                ...editedPost,
            }).unwrap()
            toggleEditModal(false)
            handleSuccess('Edit Successful')
        } catch (error: unknown) {
            let errMessage: string = ''
            if (isApiErrorResponse(error)) {
                errMessage = formatDuplicateKeyError(error.data.message)
            } else if (error instanceof Error) {
                errMessage = error.message
            }
            handleError(errMessage)
        }
    }
    
    const formatDate = (date: Date | string | undefined): string => {
        if (!date) return ''
        try {
            return new Date(date).toISOString().split('T')[0]
        } catch (error) {
            return ''
        }
    }

    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Post</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <InputField
                            id="title"
                            name="title"
                            label="Title"
                            value={editedPost['title'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="books"
                            name="books"
                            label="Books"
                            value={editedPost['books'] || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedPost(null)
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
