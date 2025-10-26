// ImageUploadFieldSingle.tsx (This code is correct)

'use client'

import Image from 'next/image'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { Loader, UploadCloud, X } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// Define a clear and reusable props interface
interface ImageUploadFieldSingleProps {
    // The value can be a URL string or null if no image is selected
    value: string | null
    // The callback to notify the parent of changes (new URL or null for removal)
    onChange: (newImageUrl: string | null) => void
    // Optional props for customization
    label?: string
    className?: string
}

export default function ImageUploadFieldSingle({
    value,
    onChange, // This is the correct prop name
    label = 'Profile Image',
    className,
}: ImageUploadFieldSingleProps) {
    const [loading, setLoading] = useState(false)
    const uniqueId = `single-image-upload-${label.replace(/\s+/g, '-')}`

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]
        if (!file) return

        setLoading(true)
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

                // Optional: Save metadata to your own backend
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
                // Notify the parent component of the new URL using the onChange prop
                onChange(newImageUrl)
            } else {
                throw new Error(
                    data.error?.message || 'Failed to upload image.'
                )
            }
        } catch (error) {
            console.error('Error uploading profile image:', error)
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred.'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
            e.target.value = '' // Reset the file input
        }
    }

    // Handler to remove the image, notifying the parent by passing null
    const handleRemoveImage = () => {
        onChange(null)
    }

    return (
        <div className={cn('flex flex-col items-start gap-2', className)}>
            <Label htmlFor={uniqueId}>{label}</Label>
            <div className="relative group w-36 h-36 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                        <Loader className="h-8 w-8 animate-spin" />
                        <span className="text-sm">Uploading...</span>
                    </div>
                ) : value ? (
                    <>
                        <Image
                            src={value}
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                                aria-label="Remove image"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <label
                                htmlFor={uniqueId}
                                className="p-2 bg-white text-gray-800 rounded-full cursor-pointer hover:bg-gray-200"
                                aria-label="Change image"
                            >
                                <UploadCloud className="w-4 h-4" />
                            </label>
                        </div>
                    </>
                ) : (
                    <label
                        htmlFor={uniqueId}
                        className="flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 cursor-pointer transition-colors"
                    >
                        <UploadCloud className="w-8 h-8" />
                        <span className="text-xs mt-1">Upload Image</span>
                    </label>
                )}
            </div>
            <Input
                id={uniqueId}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading}
                className="hidden"
            />
        </div>
    )
}
