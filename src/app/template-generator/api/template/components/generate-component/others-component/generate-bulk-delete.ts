export const generateBulkDeleteComponentFile = (
    inputJsonFile: string
): string => {
    const { schema, namingConvention } = JSON.parse(inputJsonFile) || {}

    const pluralPascalCase = namingConvention.Users_1_000___
    const pluralLowerCase = namingConvention.users_2_000___
    const isUsedGenerateFolder = namingConvention.use_generate_folder

    const schemaKeys = Object.keys(schema)
    const displayKey =
        schemaKeys.find((key) => key.toLowerCase() === 'name') ||
        schemaKeys.find((key) => key.toLowerCase() === 'title') ||
        schemaKeys.find((key) => schema[key] === 'STRING') ||
        '_id'

    let reduxPath = ''
    if (isUsedGenerateFolder) {
        reduxPath = `../redux/rtk-api`
    } else {
        reduxPath = `@/redux/features/${pluralLowerCase}/${pluralLowerCase}Slice`
    }

    return `import React from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { use${pluralPascalCase}Store } from '../store/store'
import { useBulkDelete${pluralPascalCase}Mutation } from '${reduxPath}'
import { handleSuccess, handleError } from './utils'

const BulkDeleteNextComponents: React.FC = () => {
    const {
        isBulkDeleteModalOpen,
        toggleBulkDeleteModal,
        bulkData,
        setBulkData,
    } = use${pluralPascalCase}Store()
    
    const [bulkDelete${pluralPascalCase}, { isLoading }] = useBulkDelete${pluralPascalCase}Mutation()

    const handleBulkDelete = async () => {
        if (!bulkData?.length) return
        try {
            const ids = bulkData.map((${pluralPascalCase.toLowerCase()}) => ${pluralPascalCase.toLowerCase()}._id)
            await bulkDelete${pluralPascalCase}({ ids }).unwrap()
            toggleBulkDeleteModal(false)
            setBulkData([])
            handleSuccess('Delete Successful')
        } catch (error) {
            console.error('Failed to delete ${pluralPascalCase}:', error)
            handleError('Failed to delete items. Please try again.')
        }
    }

    return (
        <Dialog
            open={isBulkDeleteModalOpen}
            onOpenChange={toggleBulkDeleteModal}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {bulkData?.length > 0 && (
                    <div className="pt-4">
                        <p>
                            You are about to delete{' '}
                            <span className="font-semibold">
                                ({bulkData.length})
                            </span>{' '}
                            ${pluralLowerCase}.
                        </p>
                    </div>
                )}
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="flex flex-col">
                        {bulkData.map((${pluralPascalCase.toLowerCase()}, idx) => (
                            <span
                                key={(${pluralPascalCase.toLowerCase()}._id as string) + idx}
                                className="text-xs"
                            >
                                {idx + 1}. {(${pluralPascalCase.toLowerCase()})['${displayKey}'] as string || ''}
                            </span>
                        ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button
                        className="cursor-pointer"
                        variant="outline"
                        onClick={() => toggleBulkDeleteModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        variant="destructive"
                        onClick={handleBulkDelete}
                    >
                        {isLoading ? 'Deleting...' : 'Delete Selected'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BulkDeleteNextComponents
`
}
