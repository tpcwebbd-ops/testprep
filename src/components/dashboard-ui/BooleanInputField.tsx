// BooleanInputField.tsx
import { Switch } from '@/components/ui/switch'

export function BooleanInputField({
    id,
    checked,
    onCheckedChange,
}: {
    id: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
}) {
    return (
        <div id={id} className="flex items-center space-x-2 justify-end">
            <Switch checked={checked} onCheckedChange={onCheckedChange} />
        </div>
    )
}
