// InputFieldForString.tsx

import { Input } from '@/components/ui/input'
const InputFieldForString = ({
    id,
    value,
    onChange,
    placeholder = 'Please write...',
}: {
    id: string
    value: string
    onChange: (e: string) => void
    placeholder?: string
}) => {
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        onChange(value)
    }
    return (
        <Input
            id={id}
            value={value}
            onChange={handleValueChange}
            placeholder={placeholder}
        />
    )
}
export default InputFieldForString
