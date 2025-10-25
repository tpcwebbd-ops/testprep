// components/JsonEditorSingleItem.tsx
import { Button } from '@/components/ui/button'

import { JsonTemplateItem } from '../store/jsonStore' // Import JsonTemplateItem
import { useState } from 'react'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const JsonEditorSingleItem = ({
    item,
    removeItem,
    setJsonInput,
}: {
    item: JsonTemplateItem
    setJsonInput: React.Dispatch<React.SetStateAction<string>>
    removeItem: (id: string) => void
}) => {
    const [collapsed, setCollapsed] = useState(true)
    const [isRemoving, setIsRemoving] = useState(false)

    const handleSetJson = (data: string) => {
        setJsonInput(data)
    }

    const handleRemove = async () => {
        setIsRemoving(true)
        // Add a small delay for animation
        setTimeout(() => {
            removeItem(item.id)
        }, 200)
    }

    const templateName =
        typeof item.data === 'object' &&
        item.data !== null &&
        'templateName' in item.data
            ? (item.data as unknown as { templateName: string }).templateName
            : 'Untitled Template'

    return (
        <div
            className={`border border-gray-200 dark:border-gray-600 rounded-lg p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 shadow-md hover:shadow-lg transition-all duration-300   ${isRemoving ? 'animate-out slide-out-to-right-2 fade-out duration-200' : 'animate-in slide-in-from-left-2 duration-300'}`}
        >
            <div className="flex justify-between items-center">
                <div className="flex flex-col space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <strong className="dark:text-white text-gray-900 text-lg font-semibold">
                            {templateName}
                        </strong>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                        <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                        <span>Saved: {item.timestamp.toLocaleString()}</span>
                    </span>
                    {/* JSON Stats */}
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            <svg
                                className="w-3 h-3 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z"
                                ></path>
                            </svg>
                            {
                                Object.keys(
                                    item.data &&
                                        typeof item.data === 'object' &&
                                        item.data !== null &&
                                        'schema' in item.data
                                        ? (
                                              item.data as unknown as {
                                                  schema: Record<
                                                      string,
                                                      unknown
                                                  >
                                              }
                                          ).schema || {}
                                        : {}
                                ).length
                            }{' '}
                            fields
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <svg
                                className="w-3 h-3 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                ></path>
                            </svg>
                            {JSON.stringify(item.data).length} chars
                        </span>
                        {typeof item.data === 'object' &&
                            item.data !== null &&
                            'uid' in item.data && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                    <svg
                                        className="w-3 h-3 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                                        ></path>
                                    </svg>
                                    ID: {(item.data as { uid: string }).uid}
                                </span>
                            )}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <AlertDialog>
                        <AlertDialogTrigger className="px-3 py-2 cursor-pointer bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md">
                            <div className="flex items-center space-x-1">
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
                                <span>Remove</span>
                            </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white dark:bg-gray-800">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                    This action cannot be undone. This will
                                    permanently delete &quot;{templateName}
                                    &quot; from your saved templates.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="transition-all duration-200 hover:scale-105">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    className="px-4 py-2 cursor-pointer bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-md hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                                    onClick={handleRemove}
                                >
                                    Remove
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button
                        onClick={() => setCollapsed(!collapsed)}
                        className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    >
                        <div className="flex items-center space-x-1">
                            <svg
                                className={`w-4 h-4 transition-transform duration-200 ${collapsed ? 'rotate-0' : 'rotate-180'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                ></path>
                            </svg>
                            <span>{collapsed ? 'View' : 'Hide'}</span>
                        </div>
                    </Button>

                    <Button
                        onClick={() =>
                            item.data &&
                            handleSetJson(JSON.stringify(item.data))
                        }
                        className="px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    >
                        <div className="flex items-center space-x-1">
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
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                ></path>
                            </svg>
                            <span>Edit</span>
                        </div>
                    </Button>
                </div>
            </div>

            {/* Collapsible JSON Content */}
            <div
                className={`transition-all duration-300 ease-in-out overflow-auto ${
                    collapsed
                        ? 'max-h-0 opacity-0 mt-0'
                        : 'max-h-96 opacity-100 mt-4'
                }`}
            >
                <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                    <div className="relative">
                        <pre className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 text-sm overflow-x-auto bg-gray-900 dark:bg-gray-950 text-green-400 font-mono shadow-inner">
                            {JSON.stringify(item.data, null, 2)}
                        </pre>
                        <div className="absolute top-2 right-2">
                            <button
                                onClick={() =>
                                    navigator.clipboard.writeText(
                                        JSON.stringify(item.data, null, 2)
                                    )
                                }
                                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-md transition-colors duration-200 flex items-center space-x-1"
                                title="Copy to clipboard"
                            >
                                <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    ></path>
                                </svg>
                                <span>Copy</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JsonEditorSingleItem
