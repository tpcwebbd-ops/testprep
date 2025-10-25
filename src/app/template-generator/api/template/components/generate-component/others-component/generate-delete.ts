export const generateDeleteComponentFile = (inputJsonFile: string): string => {
    const { schema, namingConvention } = JSON.parse(inputJsonFile)

    const pluralPascalCase = namingConvention.Users_1_000___
    const pluralLowerCase = pluralPascalCase.toLowerCase()
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

    return `import React from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { ${interfaceName}, default${pluralPascalCase} } from '../store/data/data'
import { use${pluralPascalCase}Store } from '../store/store'
import { useDelete${pluralPascalCase}Mutation } from '${reduxPath}'
import { handleSuccess, handleError } from './utils'

const DeleteNextComponents: React.FC = () => {
    const {
        toggleDeleteModal,
        isDeleteModalOpen,
        selected${pluralPascalCase},
        setSelected${pluralPascalCase},
    } = use${pluralPascalCase}Store()
    
    const [delete${singularPascalCase}, { isLoading }] = useDelete${pluralPascalCase}Mutation()

    const handleDelete = async () => {
        if (selected${pluralPascalCase}) {
            try {
                await delete${singularPascalCase}({
                    id: selected${pluralPascalCase}._id,
                }).unwrap()
                toggleDeleteModal(false)
                handleSuccess('Delete Successful')
            } catch (error) {
                console.error('Failed to delete ${singularPascalCase}:', error)
                handleError('Failed to delete item. Please try again.')
            }
        }
    }

    const handleCancel = () => {
        toggleDeleteModal(false)
        setSelected${pluralPascalCase}({ ...default${pluralPascalCase} } as ${interfaceName})
    }

    const displayName = (selected${pluralPascalCase})?.['${displayKey}'] || ''

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {selected${pluralPascalCase} && (
                    <div className="py-4">
                        <p>
                            You are about to delete this ${singularPascalCase.toLowerCase()}:{' '}
                            <span className="font-semibold">
                                {displayName}
                            </span>
                        </p>
                    </div>
                )}
                <DialogFooter>
                    <Button
                        className="cursor-pointer"
                        variant="outline"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteNextComponents
`
}
