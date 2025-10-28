import Image from 'next/image'
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

import { IRoles, defaultRoles } from '../store/data/data'
import { useRolesStore } from '../store/store'
import { useGetRolesByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedRoles,
        toggleViewModal,
        setSelectedRoles,
    } = useRolesStore()

    const { data: roleData, refetch } = useGetRolesByIdQuery(
        selectedRoles?._id,
        { skip: !selectedRoles?._id }
    )

    useEffect(() => {
        if (selectedRoles?._id) {
            refetch()
        }
    }, [selectedRoles?._id, refetch])

    useEffect(() => {
        if (roleData?.data) {
            setSelectedRoles(roleData.data)
        }
    }, [roleData, setSelectedRoles])

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
            <div className="font-semibold text-sm text-gray-600">{label}</div>
            <div className="col-span-2 text-sm">{value || 'N/A'}</div>
        </div>
    )
    
    const DetailRowArray: React.FC<{
        label: string
        values?: (string | number)[]
    }> = ({ label, values }) => (
        <DetailRow label={label} value={values?.join(', ') || 'N/A'} />
    )

    return (
        <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Roles Details</DialogTitle>
                </DialogHeader>
                {selectedRoles && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Role_name" value={selectedRoles['role_name']} />
                            <DetailRow label="Description" value={selectedRoles['description']} />
                            <DetailRow label="Assign_access" value={selectedRoles['assign_access']} />
                            <DetailRow label="Created At" value={formatDate(selectedRoles.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedRoles.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedRoles(defaultRoles as IRoles)
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
