act as a seniour webapp developer in NextJs with Typescript and tailwindCss.

look at those code 


generate-edit.tsx
```
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

export const generateEditComponentFile = (inputJsonFile: string): string => {
    const { schema, namingConvention }: InputConfig =
        JSON.parse(inputJsonFile) || {}

    const pluralPascalCase = namingConvention.Users_1_000___
    const singularPascalCase = namingConvention.User_3_000___
    const pluralLowerCase = namingConvention.users_2_000___
    const interfaceName = `I${pluralPascalCase}`
    const defaultInstanceName = `default${pluralPascalCase}`
    const editedStateName = `edited${singularPascalCase}`
    const isUsedGenerateFolder = namingConvention.use_generate_folder

    const componentBodyStatements = new Set<string>()

    const toCamelCase = (str: string) => {
        return str.replace(/-(\w)/g, (_, c) => c.toUpperCase())
    }

    const generateOptionsVariable = (
        key: string,
        optionsString: string | undefined,
        defaultOptions: { label: string; value: string }[]
    ): string => {
        const varName = `${toCamelCase(key)}Options`
        const optionsArray = optionsString
            ? optionsString.split(',').map((opt) => ({
                  label: opt.trim(),
                  value: opt.trim(),
              }))
            : defaultOptions

        const optionsJsArrayString = `[\n${optionsArray
            .map(
                (opt) =>
                    `        { label: '${opt.label}', value: '${opt.value}' }`
            )
            .join(',\n')}\n    ]`

        componentBodyStatements.add(
            `    const ${varName} = ${optionsJsArrayString};`
        )
        return varName
    }

    const generateFormFieldJsx = (key: string, type: string): string => {
        const label = key
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase())

        const [typeName, optionsString] = type.split('#')

        const formFieldWrapper = (
            label: string,
            componentJsx: string,
            alignTop: boolean = false
        ): string => `
                        <div className="grid grid-cols-4 ${
                            alignTop ? 'items-start' : 'items-center'
                        } gap-4 pr-1">
                            <Label htmlFor="${key}" className="text-right ${
                                alignTop ? 'pt-3' : ''
                            }">
                                ${label}
                            </Label>
                            <div className="col-span-3">
                                ${componentJsx}
                            </div>
                        </div>`

        let componentJsx: string
        let isTallComponent = false

        switch (typeName.toUpperCase()) {
            case 'STRING':
                componentJsx = `<InputFieldForString id="${key}" placeholder="${label}" value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'EMAIL':
                componentJsx = `<InputFieldForEmail id="${key}" value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'PASSWORD':
                componentJsx = `<InputFieldForPassword id="${key}" value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'PASSCODE':
                componentJsx = `<InputFieldForPasscode id="${key}" value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'URL':
                componentJsx = `<UrlInputField id="${key}" value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'PHONE':
                componentJsx = `<PhoneInputField id="${key}" value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}', value)} />`
                break
            case 'DESCRIPTION':
                isTallComponent = true
                componentJsx = `<TextareaFieldForDescription id="${key}" value={${editedStateName}['${key}']} onChange={(e) => handleFieldChange('${key}', e.target.value)} />`
                break
            case 'RICHTEXT':
                isTallComponent = true
                componentJsx = `<RichTextEditorField id="${key}" value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}', value)} />`
                break
            case 'INTNUMBER':
                componentJsx = `<NumberInputFieldInteger id="${key}" value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}',  value as number)} />`
                break
            case 'FLOATNUMBER':
                componentJsx = `<NumberInputFieldFloat id="${key}" value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}', value as number)} />`
                break
            case 'BOOLEAN':
                componentJsx = `<BooleanInputField id="${key}" checked={${editedStateName}['${key}']} onCheckedChange={(checked) => handleFieldChange('${key}', checked)} />`
                break
            case 'CHECKBOX':
                componentJsx = `<CheckboxField id="${key}" checked={${editedStateName}['${key}']} onCheckedChange={(checked) => handleFieldChange('${key}', checked)} />`
                break
            case 'DATE':
                componentJsx = `<DateField id="${key}" value={${editedStateName}['${key}']} onChange={(date) => handleFieldChange('${key}', date)} />`
                break
            case 'TIME':
                componentJsx = `<TimeField id="${key}" value={${editedStateName}['${key}']} onChange={(time) => handleFieldChange('${key}', time)} />`
                break
            case 'DATERANGE':
                componentJsx = `<DateRangePickerField id="${key}" value={${editedStateName}['${key}']} onChange={(range) => handleFieldChange('${key}', range)} />`
                break
            case 'TIMERANGE':
                componentJsx = `<TimeRangePickerField id="${key}" value={${editedStateName}['${key}']} onChange={(range) => handleFieldChange('${key}', range)} />`
                break
            case 'COLORPICKER':
                componentJsx = `<ColorPickerField id="${key}" value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'SELECT':
                const selectVarName = generateOptionsVariable(
                    key,
                    optionsString,
                    [{ label: 'Option 1', value: 'Option 1' }]
                )
                componentJsx = `<SelectField options={${selectVarName}} value={${editedStateName}['${key}']} onValueChange={(value) => handleFieldChange('${key}', value)} />`
                break
            case 'RADIOBUTTON':
                const radioVarName = generateOptionsVariable(
                    key,
                    optionsString,
                    [{ label: 'Choice A', value: 'Choice A' }]
                )
                componentJsx = `<RadioButtonGroupField options={${radioVarName}} value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}', value)} />`
                break
            case 'DYNAMICSELECT':
                componentJsx = `<DynamicSelectField value={${editedStateName}['${key}']} apiUrl='https://jsonplaceholder.typicode.com/users' onChange={(values) => handleFieldChange('${key}', values)} />`
                break
            case 'IMAGE':
                componentJsx = `<ImageUploadFieldSingle value={${editedStateName}['${key}']} onChange={(url) => handleFieldChange('${key}', url)} />`
                break
            case 'IMAGES':
                componentJsx = `<ImageUploadManager value={${editedStateName}['${key}']} onChange={(urls) => handleFieldChange('${key}', urls)} />`
                break
            case 'MULTICHECKBOX':
                isTallComponent = true
                componentJsx = `<MultiCheckboxGroupField value={${editedStateName}['${key}']} onChange={(values) => handleFieldChange('${key}', values)} />`
                break
            case 'MULTIOPTIONS':
                const multiOptionsVarName = generateOptionsVariable(
                    key,
                    optionsString,
                    [{ label: 'Default A', value: 'Default A' }]
                )
                componentJsx = `<MultiOptionsField options={${multiOptionsVarName}} value={${editedStateName}['${key}']} onChange={(values) => handleFieldChange('${key}', values)} />`
                break
            case 'STRINGARRAY':
                isTallComponent = true
                componentJsx = `<StringArrayField />` // Note: This may need updating based on previous discussions
                break
            case 'AUTOCOMPLETE':
                componentJsx = `<AutocompleteField id="${key}" value={${editedStateName}['${key}']} />`
                break
            default:
                componentJsx = `<Input id="${key}" value={String(${editedStateName}['${key}'] || '')} disabled placeholder="Unsupported type: ${typeName}" />`
                break
        }

        return formFieldWrapper(label, componentJsx, isTallComponent)
    }

    const formFieldsJsx = Object.entries(schema)
        .map(([key, value]) => {
            // --- MODIFIED SECTION ---
            if (typeof value === 'object' && !Array.isArray(value)) {
                const label = key
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())
                // Correctly bind the component to the state for editing.
                const componentJsx = `<JsonTextareaField id="${key}" value={${editedStateName}['${key}'] || {}} onChange={(value) => handleFieldChange('${key}', value)} />`
                return `
                        <div className="grid grid-cols-4 items-start gap-4 pr-1">
                            <Label htmlFor="${key}" className="text-right pt-3">
                                ${label}
                            </Label>
                            <div className="col-span-3">
                                ${componentJsx}
                            </div>
                        </div>`
            }
            // --- END MODIFIED SECTION ---
            return generateFormFieldJsx(key, value as string)
        })
        .join('')

    const dynamicVariablesContent =
        componentBodyStatements.size > 0
            ? `${[...componentBodyStatements].sort().join('\n\n')}`
            : ''

    let reduxPath = ''
    if (isUsedGenerateFolder) {
        reduxPath = `../redux/rtk-api`
    } else {
        reduxPath = `@/redux/features/${pluralLowerCase}/${pluralLowerCase}Slice`
    }

    const staticImports = `import AutocompleteField from '@/components/dashboard-ui/AutocompleteField'
import ColorPickerField from '@/components/dashboard-ui/ColorPickerField'
import DateRangePickerField from '@/components/dashboard-ui/DateRangePickerField'
import DynamicSelectField from '@/components/dashboard-ui/DynamicSelectField'
import ImageUploadFieldSingle from '@/components/dashboard-ui/ImageUploadFieldSingle'
import ImageUploadManager from '@/components/dashboard-ui/ImageUploadManager'
import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail'
import InputFieldForPasscode from '@/components/dashboard-ui/InputFieldForPasscode'
import InputFieldForPassword from '@/components/dashboard-ui/InputFieldForPassword'
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString'
import JsonTextareaField from '@/components/dashboard-ui/JsonTextareaField'
import MultiCheckboxGroupField from '@/components/dashboard-ui/MultiCheckboxGroupField'
import MultiOptionsField from '@/components/dashboard-ui/MultiOptionsField'
import NumberInputFieldFloat from '@/components/dashboard-ui/NumberInputFieldFloat'
import NumberInputFieldInteger from '@/components/dashboard-ui/NumberInputFieldInteger'
import PhoneInputField from '@/components/dashboard-ui/PhoneInputField'
import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField'
import StringArrayField from '@/components/dashboard-ui/StringArrayField'
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import TimeField from '@/components/dashboard-ui/TimeField'
import TimeRangePickerField from '@/components/dashboard-ui/TimeRangePickerField'
import UrlInputField from '@/components/dashboard-ui/UrlInputField'
import { BooleanInputField } from '@/components/dashboard-ui/BooleanInputField'
import { CheckboxField } from '@/components/dashboard-ui/CheckboxField'
import { DateField } from '@/components/dashboard-ui/DateField'
import { RadioButtonGroupField } from '@/components/dashboard-ui/RadioButtonGroupField'
import { SelectField } from '@/components/dashboard-ui/SelectField'`

    return `import React, { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

// Static import for all possible form components
${staticImports}

import { ${interfaceName}, ${defaultInstanceName} } from '../store/data/data'
import { use${pluralPascalCase}Store } from '../store/store'
import { useUpdate${pluralPascalCase}Mutation } from '${reduxPath}'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selected${pluralPascalCase},
        setSelected${pluralPascalCase},
    } = use${pluralPascalCase}Store()

    const [update${pluralPascalCase}, { isLoading }] = useUpdate${pluralPascalCase}Mutation()
    const [${editedStateName}, set${singularPascalCase}] = useState<${interfaceName}>(${defaultInstanceName})

    useEffect(() => {
        if (selected${pluralPascalCase}) {
            set${singularPascalCase}(selected${pluralPascalCase})
        }
    }, [selected${pluralPascalCase}])

    const handleFieldChange = (name: string, value: unknown) => {
        set${singularPascalCase}(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit${singularPascalCase} = async () => {
        if (!selected${pluralPascalCase}) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = ${editedStateName};
            await update${pluralPascalCase}({
                id: selected${pluralPascalCase}._id,
                ...updateData,
            }).unwrap()
            toggleEditModal(false)
            handleSuccess('Edit Successful')
        } catch (error: unknown) {
            console.error('Failed to update record:', error)
            let errMessage: string = 'An unknown error occurred.'
            if (isApiErrorResponse(error)) {
                errMessage = formatDuplicateKeyError(error.data.message) || 'An API error occurred.'
            } else if (error instanceof Error) {
                errMessage = error.message
            }
            handleError(errMessage)
        }
    }

${dynamicVariablesContent}

    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit ${singularPascalCase}</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        ${formFieldsJsx}
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelected${pluralPascalCase}(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEdit${singularPascalCase}}
                        className="bg-green-100 text-green-600 hover:bg-green-200"
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditNextComponents
`
}

```


Edit.tsx 
```
import React, { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

// Static import for all possible form components
import AutocompleteField from '@/components/dashboard-ui/AutocompleteField'
import ColorPickerField from '@/components/dashboard-ui/ColorPickerField'
import DateRangePickerField from '@/components/dashboard-ui/DateRangePickerField'
import DynamicSelectField from '@/components/dashboard-ui/DynamicSelectField'
import ImageUploadFieldSingle from '@/components/dashboard-ui/ImageUploadFieldSingle'
import ImageUploadManager from '@/components/dashboard-ui/ImageUploadManager'
import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail'
import InputFieldForPasscode from '@/components/dashboard-ui/InputFieldForPasscode'
import InputFieldForPassword from '@/components/dashboard-ui/InputFieldForPassword'
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString'
import JsonTextareaField from '@/components/dashboard-ui/JsonTextareaField'
import MultiCheckboxGroupField from '@/components/dashboard-ui/MultiCheckboxGroupField'
import MultiOptionsField from '@/components/dashboard-ui/MultiOptionsField'
import NumberInputFieldFloat from '@/components/dashboard-ui/NumberInputFieldFloat'
import NumberInputFieldInteger from '@/components/dashboard-ui/NumberInputFieldInteger'
import PhoneInputField from '@/components/dashboard-ui/PhoneInputField'
import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField'
import StringArrayField from '@/app/dashboard/testa/all/components/others-fields-types/StringArrayField'
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import TimeField from '@/components/dashboard-ui/TimeField'
import TimeRangePickerField from '@/components/dashboard-ui/TimeRangePickerField'
import UrlInputField from '@/components/dashboard-ui/UrlInputField'
import { BooleanInputField } from '@/components/dashboard-ui/BooleanInputField'
import { CheckboxField } from '@/components/dashboard-ui/CheckboxField'
import { DateField } from '@/components/dashboard-ui/DateField'
import { RadioButtonGroupField } from '@/components/dashboard-ui/RadioButtonGroupField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { ITesta, defaultTesta } from '../store/data/data'
import { useTestaStore } from '../store/store'
import { useUpdateTestaMutation } from '@/redux/features/testa/testaSlice'
import {
    formatDuplicateKeyError,
    handleError,
    handleSuccess,
    isApiErrorResponse,
} from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedTesta,
        setSelectedTesta,
    } = useTestaStore()

    const [updateTesta, { isLoading }] = useUpdateTestaMutation()
    const [editedTesta, setTesta] = useState<ITesta>(defaultTesta)

    useEffect(() => {
        if (selectedTesta) {
            setTesta(selectedTesta)
        }
    }, [selectedTesta])

    const handleFieldChange = (name: string, value: unknown) => {
        setTesta((prev) => ({ ...prev, [name]: value }))
    }

    const handleEditTesta = async () => {
        if (!selectedTesta) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedTesta
            await updateTesta({
                id: selectedTesta._id,
                ...updateData,
            }).unwrap()
            toggleEditModal(false)
            handleSuccess('Edit Successful')
        } catch (error: unknown) {
            console.error('Failed to update record:', error)
            let errMessage: string = 'An unknown error occurred.'
            if (isApiErrorResponse(error)) {
                errMessage =
                    formatDuplicateKeyError(error.data.message) ||
                    'An API error occurred.'
            } else if (error instanceof Error) {
                errMessage = error.message
            }
            handleError(errMessage)
        }
    }

    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Testa</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right ">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString
                                    id="title"
                                    placeholder="Title"
                                    value={editedTesta['title']}
                                    onChange={(value) =>
                                        handleFieldChange(
                                            'title',
                                            value as string
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4 pr-1">
                            <Label
                                htmlFor="students"
                                className="text-right pt-3"
                            >
                                Students
                            </Label>
                            <div className="col-span-3">
                                <StringArrayField
                                    value={editedTesta['students']}
                                    onChange={(value) =>
                                        handleFieldChange('students', value)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedTesta(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditTesta}
                        className="bg-green-100 text-green-600 hover:bg-green-200"
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditNextComponents

```


here is example of inputJsonFile
```
{
  "uid": "000",
  "templateName": "Basic Template",
  "schema": {
    "title": "STRING",
    "email": "EMAIL",
    "password": "PASSWORD",
    "passcode": "PASSCODE",
    "area": "SELECT#Bangladesh, India, Pakistan, Canada",
    "sub-area": "DYNAMICSELECT",
    "products-images": "IMAGES",
    "personal-image": "IMAGE",
    "description": "DESCRIPTION",
    "age": "INTNUMBER",
    "amount": "FLOATNUMBER",
    "isActive": "BOOLEAN",
    "start-date": "DATE",
    "start-time": "TIME",
    "schedule-date": "DATERANGE",
    "schedule-time": "TIMERANGE",
    "favorite-color": "COLORPICKER",
    "number": "PHONE",
    "profile": "URL",
    "test": "RICHTEXT",
    "info": "AUTOCOMPLETE",
    "shift": "RADIOBUTTON#OP 1, OP 2, OP 3, OP 4",
    "policy": "CHECKBOX",
    "hobbies": "MULTICHECKBOX",
    "ideas": "MULTIOPTIONS#O 1, O 2, O 3, O 4",
    "students": "STRINGARRAY#Name:STRING, Class:STRING, Roll:NUMBER",
    "complexValue": {
      "id": "STRING",
      "title": "STRING",
      "parent": {
        "id": "STRING",
        "title": "STRING",
        "child": {
          "id": "STRING",
          "title": "STRING",
          "child": "STRING",
          "note": "STRING"
        },
        "note": "STRING"
      },
      "note": "STRING"
    }
  },
  "namingConvention": {
    "Users_1_000___": "Posts",
    "users_2_000___": "posts",
    "User_3_000___": "Post",
    "user_4_000___": "post",
    "ISelect_6_000___": "ISelect",
    "select_5_000___": "select",
    "use_generate_folder": false
  }
}
```

Now update the generate-edit.tsx so it can properly generate Edit.tsx 
