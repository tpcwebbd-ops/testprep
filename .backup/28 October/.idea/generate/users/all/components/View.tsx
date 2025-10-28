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

import { IUsers, defaultUsers } from '../store/data/data'
import { useUsersStore } from '../store/store'
import { useGetUsersByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedUsers,
        toggleViewModal,
        setSelectedUsers,
    } = useUsersStore()

    const { data: userData, refetch } = useGetUsersByIdQuery(
        selectedUsers?._id,
        { skip: !selectedUsers?._id }
    )

    useEffect(() => {
        if (selectedUsers?._id) {
            refetch()
        }
    }, [selectedUsers?._id, refetch])

    useEffect(() => {
        if (userData?.data) {
            setSelectedUsers(userData.data)
        }
    }, [userData, setSelectedUsers])

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
                    <DialogTitle>Users Details</DialogTitle>
                </DialogHeader>
                {selectedUsers && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Full_name" value={selectedUsers['full_name']} />
                            <DetailRow label="Uid" value={selectedUsers['uid']} />
                            <DetailRow label="Email" value={selectedUsers['email']} />
                            <DetailRow label="Password_hash" value={selectedUsers['password_hash']} />
                            <DetailRow label="Phone_number" value={selectedUsers['phone_number']} />
                            <DetailRow label="Profile_image_url" value={selectedUsers['profile_image_url']} />
                            <DetailRow label="Sign_up_by" value={selectedUsers['sign_up_by']} />
                            <DetailRow label="Status" value={selectedUsers['status']} />
                            <DetailRow label="Created At" value={formatDate(selectedUsers.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedUsers.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedUsers(defaultUsers as IUsers)
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
