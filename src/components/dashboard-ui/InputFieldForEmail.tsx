// InputFieldForEmail.tsx

import { Input } from '@/components/ui/input'

const InputFieldForEmail = ({
    id,
    value,
    onChange,
    placeholder = 'Email',
}: {
    id: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
}) => {
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        onChange(value)
    }
    return (
        <Input
            id={id}
            value={value}
            onChange={handlePasswordChange}
            placeholder={placeholder}
        />
    )
}
export default InputFieldForEmail
