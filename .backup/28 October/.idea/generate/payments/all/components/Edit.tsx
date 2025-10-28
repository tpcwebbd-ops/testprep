import React, { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

// Dynamically import only the components needed for the form
import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail'
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString'
import NumberInputFieldInteger from '@/components/dashboard-ui/NumberInputFieldInteger'
import PhoneInputField from '@/components/dashboard-ui/PhoneInputField'
import TimeField from '@/components/dashboard-ui/TimeField'
import { DateField } from '@/components/dashboard-ui/DateField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { IPayments, defaultPayments } from '@/app/generate/payments/all/store/data/data'
import { usePaymentsStore } from '../store/store'
import { useUpdatePaymentsMutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedPayments,
        setSelectedPayments,
    } = usePaymentsStore()

    const [updatePayments, { isLoading }] = useUpdatePaymentsMutation()
    const [editedPayment, setPayment] = useState<IPayments>(defaultPayments)

    useEffect(() => {
        if (selectedPayments) {
            setPayment(selectedPayments)
        }
    }, [selectedPayments])

    const handleFieldChange = (name: string, value: unknown) => {
        setPayment(prev => ({ ...prev, [name]: value }));
    };

    const handleEditPayment = async () => {
        if (!selectedPayments) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedPayment;
            await updatePayments({
                id: selectedPayments._id,
                ...updateData,
            }).unwrap()
            toggleEditModal(false)
            handleSuccess('Edit Successful')
        } catch (error: unknown) {
            console.error('Failed to update record:', error)
            let errMessage: string = 'An unknown error occurred.'
            if (isApiErrorResponse(error)) {
                errMessage = formatDuplicateKeyError(error.data.message) || 'An API error occurred.'
            } else if (error instanceof Error) {
                errMessage = error.message
            }
            handleError(errMessage)
        }
    }

    const payment_forOptions = [
        { label: 'Course Enrollment', value: 'Course Enrollment' },
        { label: 'salary', value: 'salary' },
        { label: 'commission', value: 'commission' },
        { label: 'bonus', value: 'bonus' },
        { label: 'others', value: 'others' }
    ];

    const statusOptions = [
        { label: 'Completed', value: 'Completed' },
        { label: 'Failed', value: 'Failed' },
        { label: 'Pending', value: 'Pending' }
    ];

    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Payment</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="payer_name" className="text-right">
                                Payer_name
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="payer_name" placeholder="Payer_name" value={editedPayment['payer_name']} onChange={(value) => handleFieldChange('payer_name', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="payer_email" className="text-right">
                                Payer_email
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForEmail id="payer_email" value={editedPayment['payer_email']} onChange={(value) => handleFieldChange('payer_email', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="payer_phone" className="text-right">
                                Payer_phone
                            </Label>
                            <div className="col-span-3">
                                <PhoneInputField id="payer_phone" value={editedPayment['payer_phone']} onChange={(value) => handleFieldChange('payer_phone', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="user_id" className="text-right">
                                User_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="user_id" placeholder="User_id" value={editedPayment['user_id']} onChange={(value) => handleFieldChange('user_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldInteger id="amount" value={editedPayment['amount']} onChange={(value) => handleFieldChange('amount',  value as number)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="transaction_id" className="text-right">
                                Transaction_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="transaction_id" placeholder="Transaction_id" value={editedPayment['transaction_id']} onChange={(value) => handleFieldChange('transaction_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="payment_method" className="text-right">
                                Payment_method
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="payment_method" placeholder="Payment_method" value={editedPayment['payment_method']} onChange={(value) => handleFieldChange('payment_method', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="verified_by_id" className="text-right">
                                Verified_by_id
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="verified_by_id" placeholder="Verified_by_id" value={editedPayment['verified_by_id']} onChange={(value) => handleFieldChange('verified_by_id', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="payment_date" className="text-right">
                                Payment_date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="payment_date" value={editedPayment['payment_date']} onChange={(date) => handleFieldChange('payment_date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="payment_time" className="text-right">
                                Payment_time
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="payment_time" value={editedPayment['payment_time']} onChange={(time) => handleFieldChange('payment_time', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="send_by" className="text-right">
                                Send_by
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="send_by" placeholder="Send_by" value={editedPayment['send_by']} onChange={(value) => handleFieldChange('send_by', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="received_by" className="text-right">
                                Received_by
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="received_by" placeholder="Received_by" value={editedPayment['received_by']} onChange={(value) => handleFieldChange('received_by', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="payment_for" className="text-right">
                                Payment_for
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={payment_forOptions} value={editedPayment['payment_for']} onValueChange={(value) => handleFieldChange('payment_for', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={statusOptions} value={editedPayment['status']} onValueChange={(value) => handleFieldChange('status', value)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedPayments(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditPayment}
                        className="bg-green-100 text-green-600 hover:bg-green-200"
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditNextComponents
