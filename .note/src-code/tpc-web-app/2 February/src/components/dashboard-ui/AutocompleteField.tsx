// AutocompleteField.tsx
import { Input } from '@/components/ui/input'
const AutocompleteField = ({ id, value }: { id: string; value: string }) => {
    return <Input value={value} id={id} readOnly />
}
export default AutocompleteField
