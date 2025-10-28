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

import { IWebsite_Settings, defaultWebsite_Settings } from '../store/data/data'
import { useWebsite_SettingsStore } from '../store/store'
import { useGetWebsite_SettingsByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedWebsite_Settings,
        toggleViewModal,
        setSelectedWebsite_Settings,
    } = useWebsite_SettingsStore()

    const { data: website_SettingData, refetch } = useGetWebsite_SettingsByIdQuery(
        selectedWebsite_Settings?._id,
        { skip: !selectedWebsite_Settings?._id }
    )

    useEffect(() => {
        if (selectedWebsite_Settings?._id) {
            refetch()
        }
    }, [selectedWebsite_Settings?._id, refetch])

    useEffect(() => {
        if (website_SettingData?.data) {
            setSelectedWebsite_Settings(website_SettingData.data)
        }
    }, [website_SettingData, setSelectedWebsite_Settings])

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
                    <DialogTitle>Website_Settings Details</DialogTitle>
                </DialogHeader>
                {selectedWebsite_Settings && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Name" value={selectedWebsite_Settings['Name']} />
                            <DetailRow label="Logourl" value={selectedWebsite_Settings['logourl']} />
                            <DetailRow label="Description" value={selectedWebsite_Settings['description']} />
                            <DetailRow label="Short Description" value={selectedWebsite_Settings['short description']} />
                            <DetailRow label="MobileNumber" value={selectedWebsite_Settings['mobileNumber']} />
                            <DetailRow label="Address" value={selectedWebsite_Settings['address']} />
                            <DetailRow label="Menu" value={selectedWebsite_Settings['menu']} />
                            <DetailRow label="Footer" value={selectedWebsite_Settings['footer']} />
                            <DetailRow label="Created At" value={formatDate(selectedWebsite_Settings.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedWebsite_Settings.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedWebsite_Settings(defaultWebsite_Settings as IWebsite_Settings)
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
