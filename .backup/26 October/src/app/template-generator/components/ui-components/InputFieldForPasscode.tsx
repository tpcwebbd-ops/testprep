// InputFieldForPasscode.tsx

import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const InputFieldForPasscode = () => {
    const [showPasscode, setShowPasscode] = useState(false)
    const [passcode, setPasscode] = useState('')
    const [error, setError] = useState('')

    const togglePasscodeVisibility = () => {
        setShowPasscode(!showPasscode)
    }

    const handlePasscodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const numericValue = value.replace(/[^0-9]/g, '')
        setPasscode(numericValue)

        if (numericValue.length > 0 && numericValue.length < 6) {
            setError('Passcode must be exactly 6 digits.')
        } else {
            setError('')
        }
    }

    return (
        <div>
            <small>Only number 6 digits allowed</small>
            <div className="relative">
                <Input
                    placeholder="******"
                    type={showPasscode ? 'text' : 'password'}
                    value={passcode}
                    onChange={handlePasscodeChange}
                    maxLength={6}
                    inputMode="numeric"
                    pattern="\d{6}"
                    className={`pr-10 ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                <div
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                    onClick={togglePasscodeVisibility}
                >
                    {showPasscode ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                    )}
                </div>
            </div>
            {error && (
                <div className="mt-2 rounded-md bg-red-100 p-3 text-sm text-red-700">
                    <p>{error}</p>
                </div>
            )}
        </div>
    )
}

export default InputFieldForPasscode
