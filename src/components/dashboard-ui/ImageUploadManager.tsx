// ImageUploadManager.tsx

'use client'

import Image from 'next/image'
import { Plus, X, UploadCloud } from 'lucide-react'
import { toast } from 'react-toastify'
import { useEffect, useState, useCallback } from 'react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogClose, // Import DialogClose for better UX
} from '@/components/ui/dialog'

// --- InternalImageDialog Component ---
// This component now receives the list of currently selected images to render its UI correctly.

interface InternalImageDialogProps {
    onImageSelect: (newImage: string) => void
    selectedImages: string[] // List of already selected image URLs
}

const InternalImageDialog = ({
    onImageSelect,
    selectedImages,
}: InternalImageDialogProps) => {
    const [allAvailableImages, setAllAvailableImages] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Memoize the fetch function
    const fetchImages = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/media')
            if (!response.ok) throw new Error('Failed to fetch images.')
            const data = await response.json()
            const imageUrls: string[] =
                data?.data.map((i: { url: string }) => i.url) || []
            setAllAvailableImages(imageUrls)
        } catch (error) {
            console.error(error)
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Could not fetch images.'
            )
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchImages()
    }, [fetchImages])

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append('image', file)

            const response = await fetch(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
                { method: 'POST', body: formData }
            )

            const data = await response.json()
            if (data.success) {
                const newImageUrl = data.data.url
                await fetch('/api/media', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        delete_url: data.data.delete_url,
                        url: newImageUrl,
                        display_url: data.data.display_url,
                    }),
                })
                toast.success('Image uploaded successfully!')
                onImageSelect(newImageUrl) // Immediately select the newly uploaded image
                setAllAvailableImages((prev) => [newImageUrl, ...prev]) // Add to the gallery
            } else {
                throw new Error(data.error.message || 'Image upload failed.')
            }
        } catch (error) {
            console.error('Error uploading image:', error)
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Cannot upload the image.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ScrollArea className="w-full h-[60vh] p-4">
            <header className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-lg font-semibold">Select an Image</h2>
                <Button asChild variant="outline">
                    <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex items-center gap-2"
                    >
                        <UploadCloud className="w-4 h-4" />
                        Upload New
                    </label>
                </Button>
                <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isLoading}
                />
            </header>
            <main>
                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        Loading images...
                    </div>
                ) : allAvailableImages.length > 0 ? (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {allAvailableImages.map((imageUrl) => {
                            const isSelected = selectedImages.includes(imageUrl)
                            return (
                                <DialogClose asChild key={imageUrl}>
                                    <div
                                        onClick={() =>
                                            !isSelected &&
                                            onImageSelect(imageUrl)
                                        }
                                        className={`relative w-full aspect-square rounded-lg overflow-hidden transition-all duration-200
                                            ${
                                                isSelected
                                                    ? 'opacity-50 cursor-not-allowed ring-2 ring-blue-500'
                                                    : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                                            }`}
                                    >
                                        <Image
                                            src={imageUrl}
                                            fill
                                            alt="Media"
                                            className="object-cover"
                                        />
                                        {isSelected && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="text-white font-bold">
                                                    Selected
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </DialogClose>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        No images found in the library.
                    </div>
                )}
            </main>
        </ScrollArea>
    )
}

// --- ImageUploadManager Main Component ---
// This is now a fully controlled component.

interface ImageUploadManagerProps {
    value: string[]
    onChange: (newValues: string[]) => void
    label?: string
}

export default function ImageUploadManager({
    value,
    onChange,
    label = 'Images',
}: ImageUploadManagerProps) {
    // Handler to add a new image URL to the parent's state
    const handleAddImage = (newImageUrl: string) => {
        if (!value.includes(newImageUrl)) {
            // Prepend the new image to show it first
            onChange([newImageUrl, ...value])
        } else {
            toast.info('Image is already selected!')
        }
    }

    // Handler to remove an image URL from the parent's state
    const handleRemoveImage = (imageToRemove: string) => {
        onChange(value.filter((imageUrl) => imageUrl !== imageToRemove))
    }

    return (
        <div className="w-full flex flex-col gap-2">
            <div className="w-full flex items-center justify-between">
                <h2 className="font-medium">{label}</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Image
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl p-0">
                        <InternalImageDialog
                            onImageSelect={handleAddImage}
                            selectedImages={value} // Pass the selected images down
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <div className="w-full min-h-[120px] rounded-lg flex items-center justify-center p-2 border-2 border-dashed border-gray-300">
                {value.length > 0 ? (
                    <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {value.map((imageUrl) => (
                            <div
                                key={imageUrl}
                                className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md group"
                            >
                                <Image
                                    src={imageUrl}
                                    alt="Selected media"
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    onClick={() => handleRemoveImage(imageUrl)}
                                    className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded-full cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Remove image"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        <p>No images selected.</p>
                        <p className="text-sm">
                            Click &quot;Add Image&quot; to begin.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
