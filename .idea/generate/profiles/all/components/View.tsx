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

import { IProfiles, defaultProfiles } from '../store/data/data'
import { useProfilesStore } from '../store/store'
import { useGetProfilesByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedProfiles,
        toggleViewModal,
        setSelectedProfiles,
    } = useProfilesStore()

    const { data: profileData, refetch } = useGetProfilesByIdQuery(
        selectedProfiles?._id,
        { skip: !selectedProfiles?._id }
    )

    useEffect(() => {
        if (selectedProfiles?._id) {
            refetch()
        }
    }, [selectedProfiles?._id, refetch])

    useEffect(() => {
        if (profileData?.data) {
            setSelectedProfiles(profileData.data)
        }
    }, [profileData, setSelectedProfiles])

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
                    <DialogTitle>Profiles Details</DialogTitle>
                </DialogHeader>
                {selectedProfiles && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="User_id" value={selectedProfiles['user_id']} />
                            <DetailRow label="Address" value={selectedProfiles['address']} />
                            <DetailRow label="Bio" value={selectedProfiles['bio']} />
                            <DetailRow label="Social_links" value={selectedProfiles['social_links']} />
                            <DetailRow label="Created At" value={formatDate(selectedProfiles.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedProfiles.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedProfiles(defaultProfiles as IProfiles)
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
