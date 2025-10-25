interface Schema {
    [key: string]: string | Schema
}

interface InputConfig {
    uid: string
    templateName: string
    schema: Schema
    namingConvention: {
        Users_1_000___: string
        users_2_000___: string
        User_3_000___: string
        user_4_000___: string
        use_generate_folder: boolean
    }
}

export const generateViewComponentFile = (inputJsonFile: string): string => {
    const { schema, namingConvention }: InputConfig =
        JSON.parse(inputJsonFile) || {}

    const pluralPascalCase = namingConvention.Users_1_000___
    const pluralLowerCase = pluralPascalCase.toLowerCase()
    const singularLowerCase = namingConvention.user_4_000___
    const interfaceName = `I${pluralPascalCase}`
    const defaultInstanceName = `default${pluralPascalCase}`

    const isUsedGenerateFolder = namingConvention.use_generate_folder

    let reduxPath = ''
    if (isUsedGenerateFolder) {
        reduxPath = `../redux/rtk-api`
    } else {
        reduxPath = `@/redux/features/${pluralLowerCase}/${pluralLowerCase}Slice`
    }

    const generateDetailRowsJsx = (currentSchema: Schema): string => {
        const imageKeys = Object.keys(currentSchema).filter((key) => {
            const value = currentSchema[key]
            return (
                typeof value === 'string' &&
                ['IMAGE', 'IMAGES'].includes(value.toUpperCase().split('#')[0])
            )
        })

        return Object.entries(currentSchema)
            .filter(([key]) => !imageKeys.includes(key))
            .map(([key, type]) => {
                const label = key
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())

                if (typeof type === 'object' && !Array.isArray(type)) {
                    return `<DetailRowJson label="${label}" value={selected${pluralPascalCase}['${key}']} />`
                }

                const [typeName] = (type as string).toUpperCase().split('#')

                switch (typeName) {
                    case 'BOOLEAN':
                    case 'CHECKBOX':
                        return `<DetailRow label="${label}" value={formatBoolean(selected${pluralPascalCase}['${key}'])} />`
                    case 'DATE':
                        return `<DetailRow label="${label}" value={formatDate(selected${pluralPascalCase}['${key}'])} />`
                    case 'IMAGES':
                    case 'MULTICHECKBOX':
                    case 'MULTIOPTIONS':
                    case 'DYNAMICSELECT':
                        return `<DetailRowArray label="${label}" values={selected${pluralPascalCase}['${key}']} />`

                    case 'STRINGARRAY':
                        return `<DetailRowJson label="${label}" value={selected${pluralPascalCase}['${key}']} />`

                    case 'DATERANGE':
                        return `<DetailRow label="${label}" value={\`\${formatDate(selected${pluralPascalCase}['${key}']?.start)} to \${formatDate(selected${pluralPascalCase}['${key}']?.end)}\`} />`
                    case 'TIMERANGE':
                        return `<DetailRow label="${label}" value={\`\${selected${pluralPascalCase}['${key}']?.start || 'N/A'} to \${selected${pluralPascalCase}['${key}']?.end || 'N/A'}\`} />`
                    case 'COLORPICKER':
                        return `<DetailRow
                                label="${label}"
                                value={
                                    <div className="flex items-center gap-2">
                                        <span>{selected${pluralPascalCase}['${key}']}</span>
                                        <div
                                            className="w-5 h-5 rounded-full border"
                                            style={{ backgroundColor: selected${pluralPascalCase}['${key}'] }}
                                        />
                                    </div>
                                }
                            />`
                    default:
                        return `<DetailRow label="${label}" value={selected${pluralPascalCase}['${key}']} />`
                }
            })
            .join('\n                            ')
    }

    const generateImageViewerJsx = (currentSchema: Schema): string => {
        return Object.entries(currentSchema)
            .map(([key, type]) => {
                const label = key
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())

                if (typeof type !== 'string') return ''

                const [typeName] = type.toUpperCase().split('#')

                if (typeName === 'IMAGE') {
                    return `
                        <div className="mt-4">
                            <h3 className="font-semibold text-md mb-2">${label}</h3>
                            {selected${pluralPascalCase}['${key}'] ? (
                                <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                                    <Image
                                        src={selected${pluralPascalCase}['${key}']}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        alt="${label}"
                                    />
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No image provided.</p>
                            )}
                        </div>`
                }
                if (typeName === 'IMAGES') {
                    return `
                        <div className="mt-4">
                            <h3 className="font-semibold text-md mb-2">${label}</h3>
                            {Array.isArray(selected${pluralPascalCase}['${key}']) && selected${pluralPascalCase}['${key}'].length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {selected${pluralPascalCase}['${key}'].map((image: string, index: number) => (
                                        <div
                                            key={\`\${index}-\${image}\`}
                                            className="relative w-full h-32 border rounded-lg overflow-hidden"
                                        >
                                            <Image
                                                src={image}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                alt={\`Image \${index + 1}\`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No images provided.</p>
                            )}
                        </div>`
                }
                return ''
            })
            .join('')
    }

    const detailRowsJsx = generateDetailRowsJsx(schema)
    const imageViewerJsx = generateImageViewerJsx(schema)

    return `import Image from 'next/image'
import { format } from 'date-fns'
import React, { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { ${interfaceName}, ${defaultInstanceName} } from '../store/data/data'
import { use${pluralPascalCase}Store } from '../store/store'
import { useGet${pluralPascalCase}ByIdQuery } from '${reduxPath}'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selected${pluralPascalCase},
        toggleViewModal,
        setSelected${pluralPascalCase},
    } = use${pluralPascalCase}Store()

    const { data: ${singularLowerCase}Data, refetch } = useGet${pluralPascalCase}ByIdQuery(
        selected${pluralPascalCase}?._id,
        { skip: !selected${pluralPascalCase}?._id }
    )

    useEffect(() => {
        if (selected${pluralPascalCase}?._id) {
            refetch()
        }
    }, [selected${pluralPascalCase}?._id, refetch])

    useEffect(() => {
        if (${singularLowerCase}Data?.data) {
            setSelected${pluralPascalCase}(${singularLowerCase}Data.data)
        }
    }, [${singularLowerCase}Data, setSelected${pluralPascalCase}])

    const formatDate = (date?: Date | string) => {
        if (!date) return 'N/A'
        try {
            return format(new Date(date), 'MMM dd, yyyy')
        } catch (error) {
            return 'Invalid Date'
        }
    }

    const formatBoolean = (value?: boolean) => (value ? 'Yes' : 'No')

    const DetailRow: React.FC<{
        label: string
        value: React.ReactNode
    }> = ({ label, value }) => (
        <div className="grid grid-cols-3 gap-2 py-2 border-b">
            <div className="font-semibold text-sm text-gray-600 dark:text-gray-300">{label}</div>
            <div className="col-span-2 text-sm text-gray-800 dark:text-gray-100">{value || 'N/A'}</div>
        </div>
    )
    
    const DetailRowArray: React.FC<{
        label: string
        values?: (string | number)[]
    }> = ({ label, values }) => (
        <DetailRow label={label} value={values?.join(', ') || 'N/A'} />
    )

    // --- NEW HELPER COMPONENT FOR RENDERING JSON ---
    const DetailRowJson: React.FC<{
        label: string
        value?: object | any[]
    }> = ({ label, value }) => (
        <div className="grid grid-cols-1 gap-1 py-2 border-b">
            <div className="font-semibold text-sm text-gray-600 dark:text-gray-300">{label}</div>
            <div className="col-span-1 text-sm bg-slate-100 dark:bg-slate-800 p-2 rounded-md mt-1">
                <pre className="whitespace-pre-wrap text-xs">{value ? JSON.stringify(value, null, 2) : 'N/A'}</pre>
            </div>
        </div>
    )

    return (
        <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>${pluralPascalCase} Details</DialogTitle>
                </DialogHeader>
                {selected${pluralPascalCase} && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            ${detailRowsJsx}
                            <DetailRow label="Created At" value={formatDate(selected${pluralPascalCase}.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selected${pluralPascalCase}.updatedAt)} />
                        </div>
                        ${imageViewerJsx}
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelected${pluralPascalCase}(${defaultInstanceName} as ${interfaceName})
                        }}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ViewNextComponents
`
}
