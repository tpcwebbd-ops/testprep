// UrlInputField.tsx

'use client'

import * as React from 'react'
import { Link } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const UrlInputField = ({
    id = Math.random().toString(36).substring(2),
    value,
    onChange,
    className,
}: {
    className?: string
    id?: string
    value: string
    onChange: (value: string) => void
}) => {
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
    }

    return (
        <div id={id} className={cn('grid gap-2', className)}>
            <Label htmlFor="url-input">Website URL</Label>
            <div className="relative flex items-center">
                <Link className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                    id="url-input"
                    type="url"
                    placeholder="https://example.com"
                    value={value}
                    onChange={handleUrlChange}
                    className="pl-10"
                />
            </div>
        </div>
    )
}

export default UrlInputField
