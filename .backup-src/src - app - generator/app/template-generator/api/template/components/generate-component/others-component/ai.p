act as a seniour webapp developer in NextJs with Typescript and tailwindCss.

I will give you so example of code named inputJsonFile(just a json file) , generate-table-view.ts (this file is generate a new file named table-view.tsx), TableView_V1.tsx (out put file), expected out TableView_V2.tsx(expected output file).

look those 4 code carefully, based on inputJsonFile generate-table-view.ts create a new file named TableView_V1.tsx, but I implement some changes in TableView_V2.tsx, Now please update the generate-table-view.ts file so it can generate or create expected TableView_V2.tsx 

example of inputJsonFile
```
{
  "uid": "1327f52d-35bc-428c-9b6b-c4f2a4cc42aa",
  "templateName": "Role Permission Template",
  "schema": {
    "roleName": "STRING",
    "note": "RICHTEXT",
    "description": "RICHTEXT",
    "authorEmail": "EMAIL",
    "permission": {
      "user": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "website_setting": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "role_permission": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "access_management": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "course": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "review": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "lecture": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "batch": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "q_and_a": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "content_resource": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "assessment": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "payment": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "submissions": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "enrollment": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "marketing_lead": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "profile": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "message": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "media": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "follow_up": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "attendance": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "company_goal": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "support_ticket": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "post": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "reward": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      },
      "employee_task ": {
        "create": true,
        "read": true,
        "update": false,
        "delete": false
      }
    }
  },
  "namingConvention": {
    "Users_1_000___": "Roles",
    "users_2_000___": "roles",
    "User_3_000___": "Role",
    "user_4_000___": "role",
    "ISelect_6_000___": "ISelect",
    "select_5_000___": "select",
    "use_generate_folder": false,
    "bulk_action": [
      "title",
      "area"
    ]
  }
}
```

generate-table-view.ts 
```
export const generateViewTableComponentFile = (
    inputJsonFile: string
): string => {
    const { schema, namingConvention } = JSON.parse(inputJsonFile)

    const pluralPascalCase = namingConvention.Users_1_000___
    const pluralLowerCase = namingConvention.users_2_000___
    const interfaceName = `I${pluralPascalCase}`
    const displayableKeysTypeName = `Displayable${pluralPascalCase}Keys`
    const isUsedGenerateFolder = namingConvention.use_generate_folder
    let reduxPath = ''
    if (isUsedGenerateFolder) {
        reduxPath = `../redux/rtk-api`
    } else {
        reduxPath = `@/redux/features/${pluralLowerCase}/${pluralLowerCase}Slice`
    }

    const suitableTypes = [
        'STRING',
        'EMAIL',
        'SELECT',
        'RADIOBUTTON',
        'INTNUMBER',
        'FLOATNUMBER',
        'BOOLEAN',
        'CHECKBOX',
        'DATE',
        'TIME',
    ]
    const excludedKeys = [
        'password',
        'passcode',
        'description',
        'richtext',
        'image',
        'images',
    ]
    const tableHeaders = Object.entries(schema)
        .filter(
            ([key, type]) =>
                typeof type === 'string' &&
                !key.includes('-') &&
                suitableTypes.includes(type.toUpperCase()) &&
                !excludedKeys.includes(key.toLowerCase())
        )
        .slice(0, 7)
        .map(([key]) => ({
            key: key,
            label: key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase()),
        }))
    tableHeaders.push({ key: 'createdAt', label: 'Created At' })

    const displayableKeysType = `type ${displayableKeysTypeName} = \n    | '${tableHeaders
        .map((h) => h.key)
        .join("'\n    | '")}'`

    const columnVisibilityStateType = `type ColumnVisibilityState = Record<${displayableKeysTypeName}, boolean>`

    return `'use client'

import { format } from 'date-fns'
import React, { useState, useMemo } from 'react'
import { 
    MoreHorizontalIcon, 
    EyeIcon, 
    PencilIcon, 
    TrashIcon, 
    DownloadIcon 
} from 'lucide-react'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import LoadingComponent from '@/components/common/Loading'
import ErrorMessageComponent from '@/components/common/Error'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ${interfaceName} } from '../store/data/data'
import { pageLimitArr } from '../store/store-constant'
import { use${pluralPascalCase}Store } from '../store/store'
import { useGet${pluralPascalCase}Query } from '${reduxPath}'
import Pagination from './Pagination'
import ExportDialog from './ExportDialog' // Import the new dialog component

// Dynamically generated types for type safety
${displayableKeysType}
${columnVisibilityStateType}


const ViewTableNextComponents: React.FC = () => {
    const [sortConfig, setSortConfig] = useState<{
        key: ${displayableKeysTypeName}
        direction: 'asc' | 'desc'
    } | null>(null)
    
    // State to control the export dialog visibility
    const [isExportDialogOpen, setExportDialogOpen] = useState(false);
    
    const {
        setSelected${pluralPascalCase},
        toggleBulkEditModal,
        toggleBulkUpdateModal,
        toggleViewModal,
        queryPramsLimit,
        queryPramsPage,
        queryPramsQ,
        toggleEditModal,
        toggleDeleteModal,
        bulkData,
        setBulkData,
        setQueryPramsLimit,
        setQueryPramsPage,
        toggleBulkDeleteModal,
    } = use${pluralPascalCase}Store()

    const {
        data: getResponseData,
        isLoading,
        isError,
        error,
    } = useGet${pluralPascalCase}Query({
        q: queryPramsQ,
        limit: queryPramsLimit,
        page: queryPramsPage,
    })

    const allData = useMemo(
        () => getResponseData?.data?.${pluralLowerCase} || [],
        [getResponseData]
    )

    const tableHeaders: { key: ${displayableKeysTypeName}; label: string }[] = [
        ${tableHeaders.map((h) => `{ key: '${h.key}', label: '${h.label}' }`).join(',\n        ')}
    ];

    const [columnVisibility, setColumnVisibility] =
        useState<ColumnVisibilityState>(() => {
            const initialState = {} as ColumnVisibilityState
            let counter = 0
            for (const header of tableHeaders) {
                if (counter > 3) {
                    initialState[header.key] = false
                } else {
                    initialState[header.key] = true
                }
                counter++
            }
            return initialState
        })
            
    const visibleHeaders = useMemo(
        () => tableHeaders.filter(header => columnVisibility[header.key]),
        [columnVisibility, tableHeaders]
    );

    const formatDate = (date?: Date | string) => {
        if (!date) return 'N/A'
        try {
            return format(new Date(date), 'MMM dd, yyyy')
        } catch {
            return 'Invalid Date'
        }
    }

    const handleSort = (key: ${displayableKeysTypeName}) => {
        setSortConfig((prev) =>
            prev?.key === key
                ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
                : { key, direction: 'asc' }
        )
    }

    const sortedData = useMemo(() => {
        if (!sortConfig) return allData
        return [...allData].sort((a, b) => {
            const aValue = a[sortConfig.key]
            const bValue = b[sortConfig.key]
            if (aValue === undefined || aValue === null) return 1
            if (bValue === undefined || bValue === null) return -1
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })
    }, [allData, sortConfig])

    const handleSelectAll = (isChecked: boolean) =>
        setBulkData(isChecked ? allData : [])

    const handleSelectRow = (isChecked: boolean, item: ${interfaceName}) =>
        setBulkData(
            isChecked
                ? [...bulkData, item]
                : bulkData.filter((i) => i._id !== item._id)
        )

    const renderActions = (item: ${interfaceName}) => (
        <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => { setSelected${pluralPascalCase}(item); toggleViewModal(true); }}>
                <EyeIcon className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setSelected${pluralPascalCase}(item); toggleEditModal(true); }}>
                <PencilIcon className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => { setSelected${pluralPascalCase}(item); toggleDeleteModal(true); }}>
                <TrashIcon className="w-4 h-4" />
            </Button>
        </div>
    )

    const renderTableRows = () =>
        sortedData.map((item: ${interfaceName}) => (
            <TableRow key={item._id}>
                <TableCell>
                    <Checkbox
                        onCheckedChange={(checked) => handleSelectRow(!!checked, item)}
                        checked={bulkData.some((i) => i._id === item._id)}
                    />
                </TableCell>
                {visibleHeaders.map(header => (
                     <TableCell key={header.key}>
                        {header.key === 'createdAt' 
                            ? formatDate(item.createdAt) 
                            : String(item[header.key] ?? '')}
                     </TableCell>
                ))}
                <TableCell className="text-right max-w-[10px]">
                    {renderActions(item)}
                </TableCell>
            </TableRow>
        ))

    if (isLoading) return <LoadingComponent />
    if (isError) return <ErrorMessageComponent message={error?.toString() || 'An error occurred'} />
    
    return (
        <div className="w-full flex flex-col">
            <div className="w-full my-4">
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pb-2 border-b">
                    <div className="flex items-center gap-2 justify-start w-full">
                        <Label>Selected: </Label>
                        <span className="text-sm text-slate-500">({bulkData.length})</span>
                    </div>
                    {/* Updated Toolbar Layout */}
                    <div className="flex items-center justify-end w-full gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <MoreHorizontalIcon className="w-4 h-4 mr-2" />
                                    Columns
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {tableHeaders.map((header) => (
                                    <DropdownMenuCheckboxItem
                                        key={header.key}
                                        className="capitalize"
                                        checked={columnVisibility[header.key]}
                                        onCheckedChange={(value) =>
                                            setColumnVisibility(prev => ({
                                                ...prev,
                                                [header.key]: !!value
                                            }))
                                        }
                                    >
                                        {header.label}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Updated Export Button to open the dialog */}
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setExportDialogOpen(true)}
                            disabled={bulkData.length === 0}
                        >
                            <DownloadIcon className="w-4 h-4 mr-1" /> Export
                        </Button>
                        <div className="w-2 h-auto" />

                        <Button size="sm" variant="outline" onClick={() => toggleBulkUpdateModal(true)} disabled={bulkData.length === 0}>
                            <PencilIcon className="w-4 h-4 mr-1" /> B.Update
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toggleBulkEditModal(true)} disabled={bulkData.length === 0}>
                            <PencilIcon className="w-4 h-4 mr-1" /> B.Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => toggleBulkDeleteModal(true)} disabled={bulkData.length === 0}>
                            <TrashIcon className="w-4 h-4 mr-1" /> B.Delete
                        </Button>
                    </div>
                </div>
            </div>

            {allData.length === 0 ? (
                 <div className="py-12 text-center text-2xl text-slate-500">Ops! Nothing was found.</div>
            ) : (
                <Table className="border">
                    <TableHeader className="bg-accent">
                        <TableRow>
                            <TableHead>
                                <Checkbox
                                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                    checked={bulkData.length === allData.length && allData.length > 0}
                                />
                            </TableHead>
                            {visibleHeaders.map(({ key, label }) => (
                                <TableHead key={key} className="cursor-pointer" onClick={() => handleSort(key)}>
                                    {label}{' '}
                                    {sortConfig?.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </TableHead>
                            ))}
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>{renderTableRows()}</TableBody>
                </Table>
            )}

            <Pagination
                currentPage={queryPramsPage}
                itemsPerPage={queryPramsLimit}
                onPageChange={(page) => setQueryPramsPage(page)}
                totalItems={getResponseData?.data?.total || 0}
            />

             <div className="max-w-xs flex items-center self-center justify-between pl-2 gap-4 border rounded-lg w-full mx-auto mt-8">
                <Label htmlFor="set-limit" className="text-right text-slate-500 font-normal pl-3">
                    ${pluralPascalCase} per page
                </Label>
                <Select
                    onValueChange={(value) => { setQueryPramsLimit(Number(value)); setQueryPramsPage(1); }}
                    defaultValue={queryPramsLimit.toString()}
                >
                    <SelectTrigger className="border-0">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        {pageLimitArr.map((i) => (
                            <SelectItem key={i} value={i.toString()} className="cursor-pointer">
                                {i}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Render the ExportDialog and pass it the required props */}
            <ExportDialog
                isOpen={isExportDialogOpen}
                onOpenChange={setExportDialogOpen}
                headers={tableHeaders}
                data={bulkData}
                fileName={\`Exported_${pluralPascalCase}_\${new Date().toISOString()}.xlsx\`}
            />
        </div>
    )
}
    export default ViewTableNextComponents
`
}

```

TableView_V1.tsx 
```
'use client'

import { format } from 'date-fns'
import React, { useState, useMemo } from 'react'
import { 
    MoreHorizontalIcon, 
    EyeIcon, 
    PencilIcon, 
    TrashIcon, 
    DownloadIcon 
} from 'lucide-react'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import LoadingComponent from '@/components/common/Loading'
import ErrorMessageComponent from '@/components/common/Error'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { IRoles } from '../store/data/data'
import { pageLimitArr } from '../store/store-constant'
import { useRolesStore } from '../store/store'
import { useGetRolesQuery } from '@/redux/features/roles/rolesSlice'
import Pagination from './Pagination'
import ExportDialog from './ExportDialog' // Import the new dialog component

// Dynamically generated types for type safety
type DisplayableRolesKeys = 
    | 'roleName'
    | 'authorEmail'
    | 'createdAt'
type ColumnVisibilityState = Record<DisplayableRolesKeys, boolean>


const ViewTableNextComponents: React.FC = () => {
    const [sortConfig, setSortConfig] = useState<{
        key: DisplayableRolesKeys
        direction: 'asc' | 'desc'
    } | null>(null)
    
    // State to control the export dialog visibility
    const [isExportDialogOpen, setExportDialogOpen] = useState(false);
    
    const {
        setSelectedRoles,
        toggleBulkEditModal,
        toggleBulkUpdateModal,
        toggleViewModal,
        queryPramsLimit,
        queryPramsPage,
        queryPramsQ,
        toggleEditModal,
        toggleDeleteModal,
        bulkData,
        setBulkData,
        setQueryPramsLimit,
        setQueryPramsPage,
        toggleBulkDeleteModal,
    } = useRolesStore()

    const {
        data: getResponseData,
        isLoading,
        isError,
        error,
    } = useGetRolesQuery({
        q: queryPramsQ,
        limit: queryPramsLimit,
        page: queryPramsPage,
    })

    const allData = useMemo(
        () => getResponseData?.data?.roles || [],
        [getResponseData]
    )

    const tableHeaders: { key: DisplayableRolesKeys; label: string }[] = [
        { key: 'roleName', label: 'Role Name' },
        { key: 'authorEmail', label: 'Author Email' },
        { key: 'createdAt', label: 'Created At' }
    ];

    const [columnVisibility, setColumnVisibility] =
        useState<ColumnVisibilityState>(() => {
            const initialState = {} as ColumnVisibilityState
            let counter = 0
            for (const header of tableHeaders) {
                if (counter > 3) {
                    initialState[header.key] = false
                } else {
                    initialState[header.key] = true
                }
                counter++
            }
            return initialState
        })
            
    const visibleHeaders = useMemo(
        () => tableHeaders.filter(header => columnVisibility[header.key]),
        [columnVisibility, tableHeaders]
    );

    const formatDate = (date?: Date | string) => {
        if (!date) return 'N/A'
        try {
            return format(new Date(date), 'MMM dd, yyyy')
        } catch {
            return 'Invalid Date'
        }
    }

    const handleSort = (key: DisplayableRolesKeys) => {
        setSortConfig((prev) =>
            prev?.key === key
                ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
                : { key, direction: 'asc' }
        )
    }

    const sortedData = useMemo(() => {
        if (!sortConfig) return allData
        return [...allData].sort((a, b) => {
            const aValue = a[sortConfig.key]
            const bValue = b[sortConfig.key]
            if (aValue === undefined || aValue === null) return 1
            if (bValue === undefined || bValue === null) return -1
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })
    }, [allData, sortConfig])

    const handleSelectAll = (isChecked: boolean) =>
        setBulkData(isChecked ? allData : [])

    const handleSelectRow = (isChecked: boolean, item: IRoles) =>
        setBulkData(
            isChecked
                ? [...bulkData, item]
                : bulkData.filter((i) => i._id !== item._id)
        )

    const renderActions = (item: IRoles) => (
        <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => { setSelectedRoles(item); toggleViewModal(true); }}>
                <EyeIcon className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setSelectedRoles(item); toggleEditModal(true); }}>
                <PencilIcon className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => { setSelectedRoles(item); toggleDeleteModal(true); }}>
                <TrashIcon className="w-4 h-4" />
            </Button>
        </div>
    )

    const renderTableRows = () =>
        sortedData.map((item: IRoles) => (
            <TableRow key={item._id}>
                <TableCell>
                    <Checkbox
                        onCheckedChange={(checked) => handleSelectRow(!!checked, item)}
                        checked={bulkData.some((i) => i._id === item._id)}
                    />
                </TableCell>
                {visibleHeaders.map(header => (
                     <TableCell key={header.key}>
                        {header.key === 'createdAt' 
                            ? formatDate(item.createdAt) 
                            : String(item[header.key] ?? '')}
                     </TableCell>
                ))}
                <TableCell className="text-right max-w-[10px]">
                    {renderActions(item)}
                </TableCell>
            </TableRow>
        ))

    if (isLoading) return <LoadingComponent />
    if (isError) return <ErrorMessageComponent message={error?.toString() || 'An error occurred'} />
    
    return (
        <div className="w-full flex flex-col">
            <div className="w-full my-4">
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pb-2 border-b">
                    <div className="flex items-center gap-2 justify-start w-full">
                        <Label>Selected: </Label>
                        <span className="text-sm text-slate-500">({bulkData.length})</span>
                    </div>
                    {/* Updated Toolbar Layout */}
                    <div className="flex items-center justify-end w-full gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <MoreHorizontalIcon className="w-4 h-4 mr-2" />
                                    Columns
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {tableHeaders.map((header) => (
                                    <DropdownMenuCheckboxItem
                                        key={header.key}
                                        className="capitalize"
                                        checked={columnVisibility[header.key]}
                                        onCheckedChange={(value) =>
                                            setColumnVisibility(prev => ({
                                                ...prev,
                                                [header.key]: !!value
                                            }))
                                        }
                                    >
                                        {header.label}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Updated Export Button to open the dialog */}
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setExportDialogOpen(true)}
                            disabled={bulkData.length === 0}
                        >
                            <DownloadIcon className="w-4 h-4 mr-1" /> Export
                        </Button>
                        <div className="w-2 h-auto" />

                        <Button size="sm" variant="outline" onClick={() => toggleBulkUpdateModal(true)} disabled={bulkData.length === 0}>
                            <PencilIcon className="w-4 h-4 mr-1" /> B.Update
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toggleBulkEditModal(true)} disabled={bulkData.length === 0}>
                            <PencilIcon className="w-4 h-4 mr-1" /> B.Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => toggleBulkDeleteModal(true)} disabled={bulkData.length === 0}>
                            <TrashIcon className="w-4 h-4 mr-1" /> B.Delete
                        </Button>
                    </div>
                </div>
            </div>

            {allData.length === 0 ? (
                 <div className="py-12 text-center text-2xl text-slate-500">Ops! Nothing was found.</div>
            ) : (
                <Table className="border">
                    <TableHeader className="bg-accent">
                        <TableRow>
                            <TableHead>
                                <Checkbox
                                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                    checked={bulkData.length === allData.length && allData.length > 0}
                                />
                            </TableHead>
                            {visibleHeaders.map(({ key, label }) => (
                                <TableHead key={key} className="cursor-pointer" onClick={() => handleSort(key)}>
                                    {label}{' '}
                                    {sortConfig?.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </TableHead>
                            ))}
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>{renderTableRows()}</TableBody>
                </Table>
            )}

            <Pagination
                currentPage={queryPramsPage}
                itemsPerPage={queryPramsLimit}
                onPageChange={(page) => setQueryPramsPage(page)}
                totalItems={getResponseData?.data?.total || 0}
            />

             <div className="max-w-xs flex items-center self-center justify-between pl-2 gap-4 border rounded-lg w-full mx-auto mt-8">
                <Label htmlFor="set-limit" className="text-right text-slate-500 font-normal pl-3">
                    Roles per page
                </Label>
                <Select
                    onValueChange={(value) => { setQueryPramsLimit(Number(value)); setQueryPramsPage(1); }}
                    defaultValue={queryPramsLimit.toString()}
                >
                    <SelectTrigger className="border-0">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        {pageLimitArr.map((i) => (
                            <SelectItem key={i} value={i.toString()} className="cursor-pointer">
                                {i}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Render the ExportDialog and pass it the required props */}
            <ExportDialog
                isOpen={isExportDialogOpen}
                onOpenChange={setExportDialogOpen}
                headers={tableHeaders}
                data={bulkData}
                fileName={`Exported_Roles_${new Date().toISOString()}.xlsx`}
            />
        </div>
    )
}
    export default ViewTableNextComponents

```

Expected outPut 
TableView_V2.tsx 
```
'use client';

import { format } from 'date-fns';
import React, { useState, useMemo } from 'react';
import { MoreHorizontalIcon, EyeIcon, PencilIcon, TrashIcon, DownloadIcon, XIcon } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingComponent from '@/components/common/Loading';
import ErrorMessageComponent from '@/components/common/Error';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

import { IRoles } from '../store/data/data';
import { pageLimitArr } from '../store/store-constant';
import { useRolesStore } from '../store/store';
import { useGetRolesQuery } from '@/redux/features/roles/rolesSlice';
import Pagination from './Pagination';
import ExportDialog from './ExportDialog';

type DisplayableRolesKeys = 'name' | 'email' | 'createdAt';
type ColumnVisibilityState = Record<DisplayableRolesKeys, boolean>;

const ViewTableNextComponents: React.FC = () => {
  const [open, setOpen] = useState(false); // Add inside your component or move to a child if you prefer
  const [sortConfig, setSortConfig] = useState<{
    key: DisplayableRolesKeys;
    direction: 'asc' | 'desc';
  } | null>(null);

  const [isExportDialogOpen, setExportDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    setSelectedRoles,
    toggleBulkEditModal,
    toggleBulkUpdateModal,
    toggleViewModal,
    queryPramsLimit,
    queryPramsPage,
    queryPramsQ,
    toggleEditModal,
    toggleDeleteModal,
    bulkData,
    setBulkData,
    setQueryPramsLimit,
    setQueryPramsPage,
    toggleBulkDeleteModal,
  } = useRolesStore();

  const {
    data: getResponseData,
    isLoading,
    isError,
    error,
  } = useGetRolesQuery({
    q: queryPramsQ,
    limit: queryPramsLimit,
    page: queryPramsPage,
  });

  const allData = useMemo(() => getResponseData?.data?.roles || [], [getResponseData]);

  const tableHeaders: { key: DisplayableRolesKeys; label: string }[] = useMemo(
    () => [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'createdAt', label: 'Created At' },
    ],
    [],
  );

  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(() => {
    const initialState = {} as ColumnVisibilityState;
    for (const header of tableHeaders) initialState[header.key] = true;
    return initialState;
  });

  const visibleHeaders = useMemo(() => tableHeaders.filter(header => columnVisibility[header.key]), [columnVisibility, tableHeaders]);

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  const handleSort = (key: DisplayableRolesKeys) => {
    setSortConfig(prev => (prev?.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }));
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return allData;
    return [...allData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [allData, sortConfig]);

  const handleSelectAll = (isChecked: boolean) => setBulkData(isChecked ? allData : []);
  const handleSelectRow = (isChecked: boolean, item: IRoles) => setBulkData(isChecked ? [...bulkData, item] : bulkData.filter(i => i._id !== item._id));

  const renderActions = (item: IRoles) => {
    return (
      <div className="flex justify-end items-center">
        {/* ===== Desktop Actions ===== */}
        <div className="hidden md:flex gap-2">
          <Button
            variant="outlineWater"
            className="min-w-[8px]"
            size="sm"
            onClick={() => {
              setSelectedRoles(item);
              toggleViewModal(true);
            }}
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outlineWater"
            className="min-w-[8px]"
            size="sm"
            onClick={() => {
              setSelectedRoles(item);
              toggleEditModal(true);
            }}
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            className="min-w-[8px]"
            size="sm"
            onClick={() => {
              setSelectedRoles(item);
              toggleDeleteModal(true);
            }}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* ===== Mobile Actions (Sheet popup) ===== */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outlineWater" className="min-w-[8px] rounded-full border-none">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="bottom"
              className={cn(
                'w-full backdrop-blur-xl bg-white/10 border-t border-white/20 text-white shadow-2xl',
                'rounded-t-2xl p-4 flex flex-col space-y-4 animate-in slide-in-from-bottom',
              )}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-base font-semibold text-white/90">Actions</h2>
              </div>

              <Button
                variant="outlineWater"
                size="sm"
                onClick={() => {
                  setSelectedRoles(item);
                  toggleViewModal(true);
                  setOpen(false);
                }}
              >
                <EyeIcon className="w-4 h-4 mr-2" /> View
              </Button>

              <Button
                variant="outlineWater"
                size="sm"
                onClick={() => {
                  setSelectedRoles(item);
                  toggleEditModal(true);
                  setOpen(false);
                }}
              >
                <PencilIcon className="w-4 h-4 mr-2" /> Edit
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setSelectedRoles(item);
                  toggleDeleteModal(true);
                  setOpen(false);
                }}
              >
                <TrashIcon className="w-4 h-4 mr-2" /> Delete
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    );
  };

  const renderTableRows = () =>
    sortedData.map((item: IRoles) => (
      <TableRow key={item._id}>
        <TableCell>
          <Checkbox onCheckedChange={checked => handleSelectRow(!!checked, item)} checked={bulkData.some(i => i._id === item._id)} />
        </TableCell>
        {visibleHeaders.map(header => (
          <TableCell key={header.key}>{header.key === 'createdAt' ? formatDate(item.createdAt) : String(item[header.key] ?? '')}</TableCell>
        ))}
        <TableCell className="text-right max-w-[10px]">{renderActions(item)}</TableCell>
      </TableRow>
    ));

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorMessageComponent message={error?.toString() || 'An error occurred'} />;

  return (
    <div className="w-full flex flex-col">
      {/* Toolbar Section */}
      <div className="w-full my-4">
        <div className="w-full flex md:flex-row items-center justify-between gap-4 pb-2 border-b">
          <div className="flex items-center gap-2 justify-start w-full">
            <Label>Selected:</Label>
            <span className="text-sm text-slate-300">({bulkData.length})</span>
          </div>

          {/* ===== Desktop Toolbar ===== */}
          <div className="hidden md:flex items-center justify-end w-full gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outlineWater" size="sm">
                  <MoreHorizontalIcon className="w-4 h-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {tableHeaders.map(header => (
                  <DropdownMenuCheckboxItem
                    key={header.key}
                    className="capitalize"
                    checked={columnVisibility[header.key]}
                    onCheckedChange={value =>
                      setColumnVisibility(prev => ({
                        ...prev,
                        [header.key]: !!value,
                      }))
                    }
                  >
                    {header.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" variant="outlineWater" onClick={() => setExportDialogOpen(true)} disabled={bulkData.length === 0}>
              <DownloadIcon className="w-4 h-4 mr-1" /> Export
            </Button>
            <Button size="sm" variant="outlineWater" onClick={() => toggleBulkUpdateModal(true)} disabled={bulkData.length === 0}>
              <PencilIcon className="w-4 h-4 mr-1" /> B.Update
            </Button>
            <Button size="sm" variant="outlineWater" onClick={() => toggleBulkEditModal(true)} disabled={bulkData.length === 0}>
              <PencilIcon className="w-4 h-4 mr-1" /> B.Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => toggleBulkDeleteModal(true)} disabled={bulkData.length === 0}>
              <TrashIcon className="w-4 h-4 mr-1" /> B.Delete
            </Button>
          </div>

          {/* ===== Mobile Toolbar (Sheet) ===== */}
          <div className="flex md:hidden justify-end w-full">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button size="icon" variant="outlineWater" className="rounded-full backdrop-blur-md bg-white/10 border-white/20 min-w-[8px]">
                  <MoreHorizontalIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className={cn(
                  'w-64 sm:w-72 backdrop-blur-xl bg-white/10 border border-white/20 text-white shadow-2xl',
                  'rounded-l-2xl p-4 flex flex-col space-y-4',
                )}
              >
                <SheetHeader className="flex justify-between items-center">
                  <SheetTitle className="text-lg font-semibold text-white/90"></SheetTitle>
                </SheetHeader>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outlineWater" size="sm" className="justify-start">
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {tableHeaders.map(header => (
                      <DropdownMenuCheckboxItem
                        key={header.key}
                        className="capitalize"
                        checked={columnVisibility[header.key]}
                        onCheckedChange={value =>
                          setColumnVisibility(prev => ({
                            ...prev,
                            [header.key]: !!value,
                          }))
                        }
                      >
                        {header.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button size="sm" variant="outlineWater" onClick={() => setExportDialogOpen(true)} disabled={bulkData.length === 0}>
                  <DownloadIcon className="w-4 h-4 mr-1" /> Export
                </Button>
                <Button size="sm" variant="outlineWater" onClick={() => toggleBulkUpdateModal(true)} disabled={bulkData.length === 0}>
                  <PencilIcon className="w-4 h-4 mr-1" /> B.Update
                </Button>
                <Button size="sm" variant="outlineWater" onClick={() => toggleBulkEditModal(true)} disabled={bulkData.length === 0}>
                  <PencilIcon className="w-4 h-4 mr-1" /> B.Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => toggleBulkDeleteModal(true)} disabled={bulkData.length === 0}>
                  <TrashIcon className="w-4 h-4 mr-1" /> B.Delete
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* ===== Responsive Scrollable Table ===== */}
      {allData.length === 0 ? (
        <div className="py-12 text-center text-2xl text-slate-300">Ops! Nothing was found.</div>
      ) : (
        <Table className="min-w-max border">
          <>
            <TableHeader>
              <TableRow className="bg-blue-300/40 text-white font-bold">
                <TableHead>
                  <Checkbox onCheckedChange={checked => handleSelectAll(!!checked)} checked={bulkData.length === allData.length && allData.length > 0} />
                </TableHead>
                {visibleHeaders.map(({ key, label }) => (
                  <TableHead key={key} className="cursor-pointer bg-accent-100/60 text-slate-50 font-bold whitespace-nowrap" onClick={() => handleSort(key)}>
                    {label}
                    {sortConfig?.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                ))}
                <TableHead className="text-right bg-accent-100/60 text-slate-50 font-bold whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderTableRows()}</TableBody>
          </>
        </Table>
      )}

      <Pagination
        currentPage={queryPramsPage}
        itemsPerPage={queryPramsLimit}
        onPageChange={page => setQueryPramsPage(page)}
        totalItems={getResponseData?.data?.total || 0}
      />

      <div className="max-w-xs flex items-center self-center justify-between pl-2 gap-4 border rounded-lg w-full mx-auto mt-8">
        <Label htmlFor="set-limit" className="text-right text-slate-300 font-normal pl-3">
          Roles per page
        </Label>
        <Select
          onValueChange={value => {
            setQueryPramsLimit(Number(value));
            setQueryPramsPage(1);
          }}
          defaultValue={queryPramsLimit.toString()}
        >
          <SelectTrigger className="border-0">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {pageLimitArr.map(i => (
              <SelectItem key={i} value={i.toString()} className="cursor-pointer">
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ExportDialog
        isOpen={isExportDialogOpen}
        onOpenChange={setExportDialogOpen}
        headers={tableHeaders}
        data={bulkData}
        fileName={`Exported_Roles_${new Date().toISOString()}.xlsx`}
      />
    </div>
  );
};

export default ViewTableNextComponents;

```