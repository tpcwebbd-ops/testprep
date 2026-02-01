export const CheckboxFieldCoreCode = `
'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export function CheckboxField() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>
        </div>
    )
}
`
