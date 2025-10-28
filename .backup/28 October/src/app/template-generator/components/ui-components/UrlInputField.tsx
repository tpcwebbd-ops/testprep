// UrlInputField.tsx

'use client'

import * as React from 'react'
import { Link } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const UrlInputField = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
    const [url, setUrl] = React.useState('')

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value)
    }

    return (
        <div className={cn('grid gap-2', className)}>
            <Label htmlFor="url-input">Website URL</Label>
            <div className="relative flex items-center">
                <Link className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                    id="url-input"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={handleUrlChange}
                    className="pl-10"
                />
            </div>
        </div>
    )
}

export default UrlInputField
