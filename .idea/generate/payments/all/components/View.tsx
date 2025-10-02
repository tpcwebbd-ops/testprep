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

import { IPayments, defaultPayments } from '../store/data/data'
import { usePaymentsStore } from '../store/store'
import { useGetPaymentsByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedPayments,
        toggleViewModal,
        setSelectedPayments,
    } = usePaymentsStore()

    const { data: paymentData, refetch } = useGetPaymentsByIdQuery(
        selectedPayments?._id,
        { skip: !selectedPayments?._id }
    )

    useEffect(() => {
        if (selectedPayments?._id) {
            refetch()
        }
    }, [selectedPayments?._id, refetch])

    useEffect(() => {
        if (paymentData?.data) {
            setSelectedPayments(paymentData.data)
        }
    }, [paymentData, setSelectedPayments])

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
                    <DialogTitle>Payments Details</DialogTitle>
                </DialogHeader>
                {selectedPayments && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Payer_name" value={selectedPayments['payer_name']} />
                            <DetailRow label="Payer_email" value={selectedPayments['payer_email']} />
                            <DetailRow label="Payer_phone" value={selectedPayments['payer_phone']} />
                            <DetailRow label="User_id" value={selectedPayments['user_id']} />
                            <DetailRow label="Amount" value={selectedPayments['amount']} />
                            <DetailRow label="Transaction_id" value={selectedPayments['transaction_id']} />
                            <DetailRow label="Payment_method" value={selectedPayments['payment_method']} />
                            <DetailRow label="Verified_by_id" value={selectedPayments['verified_by_id']} />
                            <DetailRow label="Payment_date" value={formatDate(selectedPayments['payment_date'])} />
                            <DetailRow label="Payment_time" value={selectedPayments['payment_time']} />
                            <DetailRow label="Send_by" value={selectedPayments['send_by']} />
                            <DetailRow label="Received_by" value={selectedPayments['received_by']} />
                            <DetailRow label="Payment_for" value={selectedPayments['payment_for']} />
                            <DetailRow label="Status" value={selectedPayments['status']} />
                            <DetailRow label="Created At" value={formatDate(selectedPayments.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedPayments.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedPayments(defaultPayments as IPayments)
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
