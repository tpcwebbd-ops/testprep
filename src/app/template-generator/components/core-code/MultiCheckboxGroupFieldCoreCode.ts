export const MultiCheckboxGroupFieldCoreCode = `
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const MultiCheckboxGroupField = () => {
    return (
        <div className="flex gap-4 flex-col">
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
            </div>
        </div>
    )
}
export default MultiCheckboxGroupField
`
