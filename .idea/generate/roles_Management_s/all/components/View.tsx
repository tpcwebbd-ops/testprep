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

import { IRoles_Management_s, defaultRoles_Management_s } from '../store/data/data'
import { useRoles_Management_sStore } from '../store/store'
import { useGetRoles_Management_sByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedRoles_Management_s,
        toggleViewModal,
        setSelectedRoles_Management_s,
    } = useRoles_Management_sStore()

    const { data: roles_ManagementData, refetch } = useGetRoles_Management_sByIdQuery(
        selectedRoles_Management_s?._id,
        { skip: !selectedRoles_Management_s?._id }
    )

    useEffect(() => {
        if (selectedRoles_Management_s?._id) {
            refetch()
        }
    }, [selectedRoles_Management_s?._id, refetch])

    useEffect(() => {
        if (roles_ManagementData?.data) {
            setSelectedRoles_Management_s(roles_ManagementData.data)
        }
    }, [roles_ManagementData, setSelectedRoles_Management_s])

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
                    <DialogTitle>Roles_Management_s Details</DialogTitle>
                </DialogHeader>
                {selectedRoles_Management_s && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Users_id" value={selectedRoles_Management_s['users_id']} />
                            <DetailRow label="Role_ids" value={selectedRoles_Management_s['role_ids']} />
                            <DetailRow label="Created At" value={formatDate(selectedRoles_Management_s.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedRoles_Management_s.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedRoles_Management_s(defaultRoles_Management_s as IRoles_Management_s)
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
