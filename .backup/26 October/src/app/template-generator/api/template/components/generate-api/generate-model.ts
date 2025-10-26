// generate-model.ts

interface Schema {
    [key: string]: string | Schema
}

interface NamingConvention {
    Users_1_000___: string
    users_2_000___: string
    User_3_000___: string
    user_4_000___: string
    ISelect_6_000___?: string
    select_5_000___?: string
    use_generate_folder?: boolean
}

interface InputConfig {
    uid: string
    templateName: string
    schema: Schema
    namingConvention: NamingConvention
}

export const generateModel = (inputJsonFile: string): string => {
    const config: InputConfig = JSON.parse(inputJsonFile)
    const { namingConvention, schema } = config

    const modelName = namingConvention.User_3_000___ || 'Item'
    const schemaVarName = `${namingConvention.user_4_000___ || 'item'}Schema`

    const mapToMongooseSchema = (type: string): string => {
        const [typeName, options] = type.split('#')

        const createEnumSchema = (
            optionsStr: string | undefined,
            defaultOptions: string[]
        ): string => {
            const enumValues = optionsStr
                ? optionsStr
                      .split(',')
                      .map((option) => `'${option.trim()}'`)
                      .join(', ')
                : defaultOptions.map((opt) => `'${opt}'`).join(', ')
            return `{ type: String, enum: [${enumValues}] }`
        }

        const createMultiEnumSchema = (
            optionsStr: string | undefined,
            defaultOptions: string[]
        ): string => {
            const enumValues = optionsStr
                ? optionsStr
                      .split(',')
                      .map((option) => `'${option.trim()}'`)
                      .join(', ')
                : defaultOptions.map((opt) => `'${opt}'`).join(', ')
            return `{ type: [String], enum: [${enumValues}] }`
        }

        switch (typeName.toUpperCase()) {
            case 'STRING':
                return `{ type: String }`
            case 'EMAIL':
                return `{
          type: String,
          match: [/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/, 'Please enter a valid email'],
        }`
            case 'PASSWORD':
            case 'PASSCODE':
                return `{ type: String, select: false }`
            case 'SELECT':
                return createEnumSchema(options, ['Option 1', 'Option 2'])
            case 'DYNAMICSELECT':
                return `[{ type: String }]`
            case 'IMAGES':
                return `[{ type: String }]`
            case 'IMAGE':
                return `{ type: String }`
            case 'DESCRIPTION':
                return `{ type: String, trim: true }`
            case 'INTNUMBER':
                return `{ type: Number, validate: { validator: Number.isInteger, message: '{VALUE} is not an integer value' } }`
            case 'FLOATNUMBER':
                return `{ type: Number }`
            case 'BOOLEAN':
                return `{ type: Boolean, default: false }`
            case 'DATE':
                return `{ type: Date, default: Date.now }`
            case 'TIME':
                return `{ type: String }`
            case 'DATERANGE':
                return `{ start: { type: Date }, end: { type: Date } }`
            case 'TIMERANGE':
                return `{ start: { type: String }, end: { type: String } }`
            case 'COLORPICKER':
                return `{ type: String, match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please fill a valid color hex code'] }`
            case 'PHONE':
                return `{ type: String }`
            case 'URL':
                return `{ type: String, trim: true }`
            case 'RICHTEXT':
            case 'AUTOCOMPLETE':
                return `{ type: String }`
            case 'RADIOBUTTON':
                return `[{ type: String }]`
            case 'CHECKBOX':
                return `{ type: Boolean, default: false }`
            case 'MULTICHECKBOX':
                return `[{ type: String }]`
            case 'MULTIOPTIONS':
                return createMultiEnumSchema(options, [
                    'Default Option A',
                    'Default Option B',
                ])

            // ✅ UPDATED STRINGARRAY HANDLER
            case 'STRINGARRAY':
                if (options) {
                    const fields = options
                        .split(',')
                        .map((f) => f.trim())
                        .filter(Boolean)

                    if (fields.length > 0) {
                        // Support both formats:
                        // "Name:STRING, Class:STRING, Roll:NUMBER"
                        // or "Name, Class, Roll" (default type = String)
                        const subSchemaFields = fields
                            .map((field) => {
                                const [key, type] = field
                                    .split(':')
                                    .map((s) => s.trim())
                                const fieldType = type
                                    ? type.toUpperCase()
                                    : 'STRING'

                                // Reuse the same logic to infer correct Mongoose type
                                switch (fieldType) {
                                    case 'NUMBER':
                                    case 'INTNUMBER':
                                        return `                "${key}": { type: Number }`
                                    case 'BOOLEAN':
                                        return `                "${key}": { type: Boolean }`
                                    case 'DATE':
                                        return `                "${key}": { type: Date }`
                                    default:
                                        return `                "${key}": { type: String }`
                                }
                            })
                            .join(',\n')

                        return `[\n            {\n${subSchemaFields}\n            }\n        ]`
                    }
                }
                return `[{ type: String }]`

            case 'PUREJSON':
                if (options) {
                    try {
                        JSON.parse(options)
                        return options
                    } catch (e) {
                        console.error(
                            'Invalid JSON provided for PUREJSON type:',
                            options,
                            e
                        )
                        return '{}'
                    }
                }
                return '{}'

            default:
                return `{ type: String }`
        }
    }

    const generateSchemaFields = (
        currentSchema: Schema,
        depth: number
    ): string => {
        const indent = '    '.repeat(depth)
        return Object.entries(currentSchema)
            .map(([key, value]) => {
                const quotedKey = `"${key}"`
                if (typeof value === 'object' && !Array.isArray(value)) {
                    return `${indent}${quotedKey}: {\n${generateSchemaFields(value, depth + 1)}\n${indent}}`
                }
                return `${indent}${quotedKey}: ${mapToMongooseSchema(value as string)}`
            })
            .join(',\n')
    }

    const schemaContent = generateSchemaFields(schema, 1)

    return `import mongoose, { Schema } from 'mongoose'

const ${schemaVarName} = new Schema({
${schemaContent}
}, { timestamps: true })

export default mongoose.models.${modelName} || mongoose.model('${modelName}', ${schemaVarName})
`
}
