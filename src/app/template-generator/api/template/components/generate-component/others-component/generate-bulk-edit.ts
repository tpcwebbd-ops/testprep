export const generateBulkEditComponentFile = (
    inputJsonFile: string
): string => {
    const { schema, namingConvention } = JSON.parse(inputJsonFile)

    // 1. Extract and format names.
    const pluralPascalCase = namingConvention.Users_1_000___
    const pluralLowerCase = namingConvention.users_2_000___
    const singularPascalCase = namingConvention.User_3_000___
    const interfaceName = `I${pluralPascalCase}`

    const isUsedGenerateFolder = namingConvention.use_generate_folder

    let reduxPath = ''
    if (isUsedGenerateFolder) {
        reduxPath = `../redux/rtk-api`
    } else {
        reduxPath = `@/redux/features/${pluralLowerCase}/${pluralLowerCase}Slice`
    }

    const schemaKeys = Object.keys(schema)
    const displayKey =
        schemaKeys.find((key) => key.toLowerCase() === 'name') ||
        schemaKeys.find((key) => key.toLowerCase() === 'title') ||
        schemaKeys.find((key) => schema[key] === 'STRING') ||
        '_id'

    const editableField = Object.entries(schema).find(
        ([, value]) =>
            typeof value === 'string' &&
            ['SELECT', 'RADIOBUTTON'].includes(value.toUpperCase())
    )
    const editableFieldKey = editableField ? editableField[0] : null
    const editableFieldLabel = editableFieldKey
        ? editableFieldKey
              .replace(/-/g, ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase())
        : ''

    const editableFieldJsx = editableFieldKey
        ? `
                                <div className="flex items-center gap-4 min-w-[180px]">
                                    <Label htmlFor="edit-${editableFieldKey}">${editableFieldLabel}</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            handleFieldChange(
                                                ${singularPascalCase.toLowerCase()}._id as string,
                                                '${editableFieldKey}',
                                                value
                                            )
                                        }
                                        defaultValue={
                                            (${singularPascalCase.toLowerCase()}['${editableFieldKey}'] as string) || ''
                                        }
                                    >
                                        <SelectTrigger className="bg-slate-50">
                                            <SelectValue placeholder="Select an option" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-50">
                                            {/* Note: Options are hardcoded as they are not in the JSON schema */}
                                            <SelectItem value="Option 1" className="cursor-pointer hover:bg-slate-200">Option 1</SelectItem>
                                            <SelectItem value="Option 2" className="cursor-pointer hover:bg-slate-200">Option 2</SelectItem>
                                            <SelectItem value="Option 3" className="cursor-pointer hover:bg-slate-200">Option 3</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>`
        : ''

    return `import React from 'react'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { ${interfaceName} } from '../store/data/data'
import { use${pluralPascalCase}Store } from '../store/store'
import { useBulkUpdate${pluralPascalCase}Mutation } from '${reduxPath}'
import { handleSuccess, handleError } from './utils'

const BulkEditNextComponents: React.FC = () => {
    const { isBulkEditModalOpen, toggleBulkEditModal, bulkData, setBulkData } =
        use${pluralPascalCase}Store()
    const [bulkUpdate${pluralPascalCase}, { isLoading }] = useBulkUpdate${pluralPascalCase}Mutation()

    const handleBulkEdit${pluralPascalCase} = async () => {
        if (!bulkData.length) return
        try {
            const newBulkData = bulkData.map(({ _id, ...rest }) => ({
                id: _id,
                updateData: rest,
            }))
            await bulkUpdate${pluralPascalCase}(newBulkData).unwrap()
            toggleBulkEditModal(false)
            setBulkData([])
            handleSuccess('Edit Successful')
        } catch (error) {
            console.error('Failed to edit ${pluralLowerCase}:', error)
            handleError('Failed to update items. Please try again.')
        }
    }

    const handleFieldChange = (itemId: string, fieldName: string, value: string) => {
        setBulkData(
            bulkData.map((${singularPascalCase.toLowerCase()}) =>
                ${singularPascalCase.toLowerCase()}._id === itemId
                    ? { ...${singularPascalCase.toLowerCase()}, [fieldName]: value }
                    : ${singularPascalCase.toLowerCase()}
            ) as ${interfaceName}[]
        )
    }

    return (
        <Dialog open={isBulkEditModalOpen} onOpenChange={toggleBulkEditModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Bulk Update</DialogTitle>
                </DialogHeader>
                {bulkData.length > 0 && (
                    <p className="pt-4">
                        You are about to update{' '}
                        <span className="font-semibold">
                            ({bulkData.length})
                        </span>{' '}
                        ${pluralLowerCase}.
                    </p>
                )}
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="flex flex-col gap-2">
                        {bulkData.map((${singularPascalCase.toLowerCase()}, idx) => (
                            <div
                                key={(${singularPascalCase.toLowerCase()}._id as string) || idx}
                                className="flex items-center justify-between"
                            >
                                <span>
                                    {idx + 1}. {(${singularPascalCase.toLowerCase()})['${displayKey}'] as string || ''}
                                </span>
                                ${editableFieldJsx}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => toggleBulkEditModal(false)}
                        className="cursor-pointer border-slate-400 hover:border-slate-500"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        variant="outline"
                        onClick={handleBulkEdit${pluralPascalCase}}
                        className="text-green-500 hover:text-green-600 cursor-pointer bg-green-100 hover:bg-green-200 border border-green-300 hover:border-green-400"
                    >
                        {isLoading ? 'Updating...' : 'Update Selected'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BulkEditNextComponents
`
}
