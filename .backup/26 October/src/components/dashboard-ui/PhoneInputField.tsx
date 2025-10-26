// PhoneInputField.tsx

'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const PhoneInputField = ({
    id,
    value,
    onChange,
    className,
}: {
    id: string
    value: string
    onChange: (data: string) => void
    className?: string
}) => {
    const countryCode = '+880'

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        let numericValue = value.replace(/\D/g, '')

        if (numericValue.startsWith('0')) {
            numericValue = numericValue.substring(1)
        }
        onChange(numericValue)
    }

    return (
        <div id={id} className={cn('grid gap-2', className)}>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative flex items-center">
                <span className="absolute left-3 text-muted-foreground">
                    {countryCode}
                </span>
                <Input
                    id="phone"
                    type="tel"
                    placeholder="1711223344"
                    value={value}
                    onChange={handlePhoneChange}
                    className="pl-14"
                />
            </div>
        </div>
    )
}

export default PhoneInputField
