act as a seniour webapp developer in NextJs with Typescript and tailwindCss.

look at those code 


generate-store-data.ts 
```
interface Schema {
    [key: string]: string | Schema
}


interface NamingConvention {
    Users_1_000___: string
    users_2_000___: string
    User_3_000___: string
    user_4_000___: string
}

interface InputConfig {
    uid: string
    templateName: string
    schema: Schema
    namingConvention: NamingConvention
}


export const generateStoreData = (inputJsonFile: string): string => {
    const config: InputConfig = JSON.parse(inputJsonFile)
    const { namingConvention, schema } = config

    const interfaceName = namingConvention.Users_1_000___ || 'Items'

    const mapToInterfaceType = (type: string): string => {
        const [typeName] = type.split('#')

        switch (typeName.toUpperCase()) {
            case 'INTNUMBER':
            case 'FLOATNUMBER':
                return 'number'
            case 'BOOLEAN':
            case 'CHECKBOX':
                return 'boolean'
            case 'IMAGES':
            case 'MULTICHECKBOX':
            case 'DYNAMICSELECT':
            case 'MULTIOPTIONS': 
                return 'string[]'
            case 'DATE':
                return 'Date'
            case 'DATERANGE':
                return '{ from: Date; to: Date }'
            case 'TIMERANGE':
                return '{ start: string; end: string }'
            default:
                return 'string'
        }
    }

    const mapToDefaultValue = (type: string): string => {
        const [typeName] = type.split('#')

        switch (typeName.toUpperCase()) {
            case 'INTNUMBER':
            case 'FLOATNUMBER':
                return '0'
            case 'BOOLEAN':
            case 'CHECKBOX':
                return 'false'
            case 'IMAGES':
            case 'MULTICHECKBOX':
            case 'DYNAMICSELECT':
            case 'MULTIOPTIONS': 
                return '[]'
            case 'DATE':
                return 'new Date()'
            case 'DATERANGE':
                return '{ from: new Date(), to: new Date() }'
            case 'TIMERANGE':
                return '{ start: "", end: "" }'
            default:
                return "''"
        }
    }

 
    const generateInterfaceFields = (
        currentSchema: Schema,
        depth: number
    ): string => {
        const indent = '    '.repeat(depth)
        return Object.entries(currentSchema)
            .map(([key, value]) => {
                const quotedKey = `"${key}"`
                if (typeof value === 'object' && !Array.isArray(value)) {
                    return `${indent}${quotedKey}: {\n${generateInterfaceFields(value, depth + 1)}\n${indent}}`
                }
                return `${indent}${quotedKey}: ${mapToInterfaceType(value as string)}`
            })
            .join(';\n')
    }

    const generateDefaultObjectFields = (
        currentSchema: Schema,
        depth: number
    ): string => {
        const indent = '    '.repeat(depth)
        return Object.entries(currentSchema)
            .map(([key, value]) => {
                const quotedKey = `"${key}"`
                if (typeof value === 'object' && !Array.isArray(value)) {
                    return `${indent}${quotedKey}: {\n${generateDefaultObjectFields(value, depth + 1)}\n${indent}}`
                }
                return `${indent}${quotedKey}: ${mapToDefaultValue(value as string)}`
            })
            .join(',\n')
    }


    const interfaceContent = generateInterfaceFields(schema, 1)
    const defaultObjectContent = generateDefaultObjectFields(schema, 1)

    return `

    import { DateRange } from 'react-day-picker'

export interface I${interfaceName} {
${interfaceContent};
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const default${interfaceName} = {
${defaultObjectContent},
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
`
}

```

data.ts 
```
import { DateRange } from 'react-day-picker'
import { StringArrayData } from '../../components/others-field-type/types'

export interface ITesta {
    title: string
    students: StringArrayData[]
    createdAt: Date
    updatedAt: Date
    _id: string
}

export const defaultTesta = {
    title: '',
    students: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}

```


inputJsonFile
```
```


Now please udpate generate-store-data.ts for update STRINGARRAY case.