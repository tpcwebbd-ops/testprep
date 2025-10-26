// TextareaFieldForDescription.tsx

'use client'

import * as React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const TextareaFieldForDescription = ({
    id,
    value,
    className,
    onChange,
}: {
    id: string
    value: string
    className?: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) => {
    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        onChange(e)
    }

    return (
        <div id={id} className={cn('grid w-full gap-2', className)}>
            <Label htmlFor="description">Description</Label>
            <Textarea
                id="description"
                placeholder="Type your description here."
                value={value}
                onChange={handleDescriptionChange}
            />
        </div>
    )
}

export default TextareaFieldForDescription
