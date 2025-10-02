'use client'

import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog'

// Define the shape of the data and headers we expect
type DataItem = Record<string, unknown>
type HeaderItem = { key: string; label: string }

interface ExportDialogProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    headers: HeaderItem[]
    data: DataItem[]
    fileName: string
}

// Utility function to handle XLSX file download
const downloadFile = (data: DataItem[], fileName: string) => {
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
    XLSX.writeFile(workbook, fileName)
}

const ExportDialog: React.FC<ExportDialogProps> = ({
    isOpen,
    onOpenChange,
    headers,
    data,
    fileName,
}) => {
    // State to manage which columns are checked, initialized to all checked
    const [selectedColumns, setSelectedColumns] = useState<
        Record<string, boolean>
    >({})

    // Reset the selected columns to all 'true' whenever the dialog is opened
    useEffect(() => {
        if (isOpen) {
            const allSelected = headers.reduce(
                (acc, header) => {
                    acc[header.key] = true
                    return acc
                },
                {} as Record<string, boolean>
            )
            setSelectedColumns(allSelected)
        }
    }, [isOpen, headers])

    const handleCheckedChange = (key: string, isChecked: boolean) => {
        // Enforce the rule: at least one checkbox must remain checked.
        const currentlyCheckedCount =
            Object.values(selectedColumns).filter(Boolean).length
        if (currentlyCheckedCount === 1 && !isChecked) {
            // If only one is left and the user is trying to uncheck it, do nothing.
            return
        }

        setSelectedColumns((prev) => ({
            ...prev,
            [key]: isChecked,
        }))
    }

    const handleExport = () => {
        // 1. Get the keys of the columns that are still selected
        const selectedKeys = Object.keys(selectedColumns).filter(
            (key) => selectedColumns[key]
        )

        // 2. Process the data to include only the selected columns
        const processedData = data.map((row) => {
            const newRow: DataItem = {}
            selectedKeys.forEach((key) => {
                if (row.hasOwnProperty(key)) {
                    newRow[key] = row[key]
                }
            })
            return newRow
        })

        // 3. Trigger the download and close the dialog
        downloadFile(processedData, fileName)
        onOpenChange(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Customize Your Export</DialogTitle>
                    <DialogDescription>
                        Select the columns you want to include in the XLSX file.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4 max-h-60 overflow-y-auto pr-2">
                    {headers.map((header) => (
                        <div
                            key={header.key}
                            className="flex items-center space-x-2"
                        >
                            <Checkbox
                                id={`col-${header.key}`}
                                checked={!!selectedColumns[header.key]}
                                onCheckedChange={(checked) =>
                                    handleCheckedChange(header.key, !!checked)
                                }
                            />
                            <Label
                                htmlFor={`col-${header.key}`}
                                className="font-normal"
                            >
                                {header.label}
                            </Label>
                        </div>
                    ))}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleExport}>Export Data</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ExportDialog
