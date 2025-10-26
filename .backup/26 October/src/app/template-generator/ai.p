act as a seniour webapp developer in NextJs with Typescript and tailwindCss.

here is an example of a file. I want to modify this code.

JsonEditor.ts
```
// components/JsonEditor.tsx
'use client'

import React, { useState } from 'react'
import { useJsonStore } from '@/lib/store/jsonStore'
import JsonEditorSingleItem from './JsonEditorSingleItem'

import {
    AlertDialog,
    AlertDialogTitle,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogTrigger,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import ViewDataType, { allDataType } from './ViewDataType' // MODIFICATION: Import allDataType
import Link from 'next/link'

// Success Popup Component
const SuccessPopup = ({
    isVisible,
    message,
}: {
    isVisible: boolean
    message: string
}) => {
    if (!isVisible) return null

    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg border border-green-400 flex items-center gap-2">
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                    ></path>
                </svg>
                <span className="font-medium">{message}</span>
            </div>
        </div>
    )
}

const JsonEditor: React.FC = () => {
    const [pathButton, setPathButton] = useState('')
    const [jsonInput, setJsonInput] = useState<string>(
        '{\n  "uid": "000",\n  "templateName": "Basic Template",\n  "schema": {\n    "title": "STRING",\n    "email": "EMAIL", \n    "password": "PASSWORD",\n    "passcode": "PASSCODE",\n    "area": "SELECT#Bangladesh, India, Pakistan, Canada",\n    "sub-area": "DYNAMICSELECT",\n    "products-images": "IMAGES",\n    "personal-image": "IMAGE",\n    "description": "DESCRIPTION",\n    "age": "INTNUMBER",\n    "amount": "FLOATNUMBER",\n    "isActive": "BOOLEAN",\n    "start-date": "DATE",\n    "start-time": "TIME",\n    "schedule-date": "DATERANGE",\n    "schedule-time": "TIMERANGE",\n    "favorite-color": "COLORPICKER",\n    "number": "PHONE",\n    "profile": "URL",\n    "test": "RICHTEXT",\n    "info": "AUTOCOMPLETE",\n    "shift": "RADIOBUTTON#OP 1, OP 2, OP 3, OP 4",\n    "policy": "CHECKBOX",\n    "hobbies": "MULTICHECKBOX",\n    "ideas": "MULTIOPTIONS#O 1, O 2, O 3, O 4"\n  },\n  "namingConvention": {\n    "Users_1_000___": "Posts",\n    "users_2_000___": "posts",\n    "User_3_000___": "Post",\n    "user_4_000___": "post",\n    "ISelect_6_000___": "ISelect",\n    "select_5_000___": "select"\n  }\n}'
    )
    const [error, setError] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false)
    const [successMessage, setSuccessMessage] = useState<string>('')
    const [isGenerating, setIsGenerating] = useState<boolean>(false)

    const { items, addItem, removeItem, clearItems } = useJsonStore()

    const showSuccess = (message: string) => {
        setSuccessMessage(message)
        setShowSuccessPopup(true)
        setTimeout(() => setShowSuccessPopup(false), 1000)
    }

    const handleSave = async () => {
        setError('')
        setIsLoading(true)

        try {
            // Validate JSON
            const parsedJson = JSON.parse(jsonInput)

            // --- START: MODIFIED VALIDATION LOGIC ---
            const schema = parsedJson.schema
            if (!schema || typeof schema !== 'object') {
                setError(
                    'Validation Error: The JSON must include a "schema" object.'
                )
                setIsLoading(false)
                return
            }

            // Create a Set of valid data type names for efficient, case-sensitive lookups.
            const validDataTypes = new Set(
                allDataType.map((item) => item.name.trim())
            )

            // Find the first schema entry with an invalid data type.
            const invalidEntry = Object.entries(schema).find(([, value]) => {
                // Get the base type by splitting at '#' and taking the first part.
                const baseType = (value as string).split('#')[0]
                return !validDataTypes.has(baseType)
            })

            if (invalidEntry) {
                const [fieldName, invalidType] = invalidEntry
                setError(
                    `Validation Error: The type "${invalidType}" for field "${fieldName}" is invalid. Please ensure the base type is a valid, case-sensitive name from the DataType Library.`
                )
                setIsLoading(false)
                return
            }
            // --- END: MODIFIED VALIDATION LOGIC ---

            const isAlreadyExist = items.find(
                (i) =>
                    typeof i.data === 'object' &&
                    i.data !== null &&
                    'uid' in i.data &&
                    (i.data as { uid: string }).uid === parsedJson.uid
            )
            if (isAlreadyExist?.id) {
                setError('Json already exist with this uid.')
                return
            } else {
                // Add to Zustand store
                addItem(parsedJson)
                setJsonInput('')
                showSuccess('JSON saved successfully!')
            }
        } catch (err: unknown) {
            setError(`Invalid JSON format. Please check your syntax. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setJsonInput(e.target.value)
        if (error) setError('')
    }

    // --- START: MODIFIED handleFormat FUNCTION ---
    const handleFormat = (): string | null => {
        try {
            const parsedJson = JSON.parse(jsonInput)
            const formattedJson = JSON.stringify(parsedJson, null, 2)
            setJsonInput(formattedJson)
            showSuccess('JSON formatted successfully!')
            return formattedJson // Return formatted string on success
        } catch (error) {
            setError('Invalid JSON input')
            return null // Return null on failure
        }
    }
    // --- END: MODIFIED handleFormat FUNCTION ---

    // --- START: MODIFIED handleGenerate FUNCTION ---
    const handleGenerate = async () => {
        setError('')
        setIsGenerating(true)

        // Invoke handleFormat and check if it was successful.
        const formattedJson = handleFormat()

        // If formatting fails, handleFormat will set the error and return null.
        if (formattedJson === null) {
            setIsGenerating(false)
            return // Abort the function.
        }

        // If formatting was successful, proceed with the fetch request.
        try {
            const response = await fetch('/api/template', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Use the validated and formatted JSON string directly.
                body: JSON.stringify({ data: formattedJson }),
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const result = await response.json()
            showSuccess('Template generated successfully!')

            // Parse the guaranteed valid JSON.
            const parsedJson = JSON.parse(formattedJson)
            setPathButton(
                `/generate/${parsedJson.namingConvention.users_2_000___}`
            )
        } catch (error) {
            setError('Failed to fetch: ' + (error as Error).message)
        } finally {
            setIsGenerating(false)
        }
    }
    // --- END: MODIFIED handleGenerate FUNCTION ---

    const customBtn =
        'px-6 py-2 mb-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg'
    return (
        <>
            <SuccessPopup
                isVisible={showSuccessPopup}
                message={successMessage}
            />

            <div className="w-full mx-auto p-6">
                <div>
                    {pathButton !== '' && (
                        <div className="w-full flex items-center justify-center gap-4">
                            <Link
                                href={`${pathButton}/all`}
                                target="_blank"
                                className={customBtn}
                            >
                                Go Live
                            </Link>
                            <Link
                                href={`${pathButton}/ssr-view`}
                                target="_blank"
                                className={customBtn}
                            >
                                SSR View
                            </Link>
                            <Link
                                href={`${pathButton}/client-view`}
                                target="_blank"
                                className={customBtn}
                            >
                                Client view
                            </Link>
                        </div>
                    )}
                </div>
                <div className="rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl">
                    <div className="w-full flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                            JSON Editor
                        </h2>
                        <ViewDataType />
                    </div>

                    {/* JSON Input Form */}
                    <div className="space-y-6">
                        <label
                            htmlFor="json-input"
                            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                        >
                            JSON Input
                        </label>
                        <div className="relative">
                            <textarea
                                id="json-input"
                                value={jsonInput}
                                onChange={handleInputChange}
                                className="w-full dark:text-gray-100 h-64 p-4 border dark:bg-gray-900 border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600"
                                placeholder="Enter your JSON data here..."
                            />
                            {(isLoading || isGenerating) && (
                                <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-lg backdrop-blur-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                        <span className="text-blue-600 font-medium">
                                            {isLoading
                                                ? 'Saving...'
                                                : 'Generating...'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center space-x-2">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 flex-wrap">
                            <Button
                                onClick={handleSave}
                                disabled={isLoading || !jsonInput.trim()}
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Saving...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                                            ></path>
                                        </svg>
                                        <span>Save</span>
                                    </div>
                                )}
                            </Button>

                            <Button
                                onClick={handleFormat}
                                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                            >
                                <div className="flex items-center space-x-2">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                        ></path>
                                    </svg>
                                    <span>Format</span>
                                </div>
                            </Button>

                            <Button
                                disabled={isGenerating || !jsonInput.trim()}
                                onClick={handleGenerate}
                                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                            >
                                {isGenerating ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Generating...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                            ></path>
                                        </svg>
                                        <span>Generate</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Saved Items Display */}
                <div className="mt-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 transition-all duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                ></path>
                            </svg>
                            <span>Saved Items ({items.length})</span>
                        </h3>
                        {items.length > 0 && (
                            <AlertDialog>
                                <AlertDialogTrigger className="px-4 py-2 cursor-pointer bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg">
                                    <div className="flex items-center space-x-2">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            ></path>
                                        </svg>
                                        <span>Clear All</span>
                                    </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white dark:bg-gray-800">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
                                            Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                            This action cannot be undone. This
                                            will permanently delete all your
                                            saved JSON templates.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="transition-all duration-200 hover:scale-105">
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            className="px-4 py-2 cursor-pointer bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-md hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                                            onClick={clearItems}
                                        >
                                            Clear All
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                ></path>
                            </svg>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                No items saved yet
                            </p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                                Add some JSON data above to get started!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {items
                                .sort((a, b) => {
                                    if (a.timestamp > b.timestamp) {
                                        return -1
                                    } else {
                                        return 1
                                    }
                                })
                                .map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="animate-in slide-in-from-left-2 duration-300"
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                        }}
                                    >
                                        <JsonEditorSingleItem
                                            item={item}
                                            removeItem={removeItem}
                                            setJsonInput={setJsonInput}
                                        />
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default JsonEditor
```


I want input the old json file which look like 
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
    "students": "STRINGARRAY#Name, Class, Roll",
  },
  "namingConvention": {
    "Users_1_000___": "Posts",
    "users_2_000___": "posts",
    "User_3_000___": "Post",
    "user_4_000___": "post",
    "ISelect_6_000___": "ISelect",
    "select_5_000___": "select"
  }
}
```


I want input the updated json file which look like 
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
    "students": "STRINGARRAY#Name, Class, Roll",
    "complexValue": JSONVALUE#{
      "id": "1234",
      "title": " The Name of Country",
      "parent": {
        "id": "111234",
        "title": " The Name of Parent",
        "child": {
          "id": "1234",
          "title": " The Name of Child",
          "child": "",
          "note": "The Note"
        },
        "note": "The Note"
      },
      "note": "The Note"
    }
  },
  "namingConvention": {
    "Users_1_000___": "Posts",
    "users_2_000___": "posts",
    "User_3_000___": "Post",
    "user_4_000___": "post",
    "ISelect_6_000___": "ISelect",
    "select_5_000___": "select"
  }
}
```





Now you have to update JsonEditor.ts so that it could be handle PUREJSON and I will provide JSON file after # tag.  
 