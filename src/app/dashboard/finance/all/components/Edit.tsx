import React, { ChangeEvent, useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { IFinances, defaultFinances } from '../api/v1/model';
import { useFinancesStore } from '../store/store';
import { useUpdatefinancesMutation } from '../redux/rtk-api';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

const InputField: React.FC<{
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}> = ({ id, name, label, type = 'text', value, onChange }) => (
  <div className="grid grid-cols-4 items-center gap-4 pr-1">
    <Label htmlFor={id} className="text-right">
      {label}
    </Label>
    {type === 'textarea' ? (
      <Textarea id={id} name={name} value={value as string} onChange={onChange} className="col-span-3" />
    ) : (
      <Input id={id} name={name} type={type} value={value} onChange={onChange} className="col-span-3" />
    )}
  </div>
);

const EditNextComponents: React.FC = () => {
  const { toggleEditModal, isEditModalOpen, selectedFinances, setSelectedFinances } = useFinancesStore();

  const [updateFinances, { isLoading }] = useUpdatefinancesMutation();
  const [editedFinance, setFinance] = useState<IFinances>(defaultFinances);

  useEffect(() => {
    if (selectedFinances) {
      setFinance(selectedFinances);
    }
  }, [selectedFinances]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFinance({ ...editedFinance, [name]: value });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFinance({ ...editedFinance, [name]: checked });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
    const { value } = e.target;
    if (nestedField) {
      setFinance({
        ...editedFinance,
        [field]: {
          ...(editedFinance[field as keyof IFinances] as object),
          [nestedField]: new Date(value),
        },
      });
    } else {
      setFinance({ ...editedFinance, [field]: new Date(value) });
    }
  };

  const handleEditFinance = async () => {
    if (!selectedFinances) return;

    try {
      await updateFinances({
        id: selectedFinances._id,
        ...editedFinance,
      }).unwrap();
      toggleEditModal(false);
      handleSuccess('Edit Successful');
    } catch (error: unknown) {
      let errMessage: string = '';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message);
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      handleError(errMessage);
    }
  };

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '';
    try {
      return new Date(date).toISOString().split('T')[0];
    } catch (error) {
      console.log('error : ', error);
      return '';
    }
  };

  return (
    <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit Finance</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <div className="grid gap-4 py-4">
            <InputField id="studentName" name="studentName" label="StudentName" value={editedFinance['studentName'] || ''} onChange={handleInputChange} />
            <InputField
              id="studentEmail"
              name="studentEmail"
              label="StudentEmail"
              type="email"
              value={editedFinance['studentEinfo'] || ''}
              onChange={handleInputChange}
            />
            <InputField
              id="studentNumber"
              name="studentNumber"
              label="StudentNumber"
              value={editedFinance['studentNumber'] || ''}
              onChange={handleInputChange}
            />
            <InputField id="courseName" name="courseName" label="CourseName" value={editedFinance['courseName'] || ''} onChange={handleInputChange} />
            <InputField id="coureCode" name="coureCode" label="CoureCode" value={editedFinance['coureCode'] || ''} onChange={handleInputChange} />
            <InputField id="batchNo" name="batchNo" label="BatchNo" value={editedFinance['batchNo'] || ''} onChange={handleInputChange} />
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="paymentStatus" className="text-right">
                PaymentStatus
              </Label>
              <Checkbox
                id="paymentStatus"
                name="paymentStatus"
                checked={editedFinance['paymentStatus'] || false}
                onCheckedChange={checked => handleCheckboxChange('paymentStatus', !!checked)}
              />
            </div>
            <InputField id="discount" name="discount" label="Discount" value={editedFinance['discount'] || ''} onChange={handleInputChange} />
            <InputField id="totalPayment" name="totalPayment" label="TotalPayment" value={editedFinance['totalPayment'] || ''} onChange={handleInputChange} />
            <InputField
              id="enrollmentDate"
              name="enrollmentDate"
              label="EnrollmentDate"
              type="date"
              value={formatDate(editedFinance['enrollmentDate'])}
              onChange={e => handleDateChange(e as ChangeEvent<HTMLInputElement>, 'enrollmentDate')}
            />
            <InputField
              id="paymentData"
              name="paymentData"
              label="PaymentData"
              type="date"
              value={formatDate(editedFinance['paymentData'])}
              onChange={e => handleDateChange(e as ChangeEvent<HTMLInputElement>, 'paymentData')}
            />
            <InputField
              id="verifyWhomName"
              name="verifyWhomName"
              label="VerifyWhomName"
              value={editedFinance['verifyWhomName'] || ''}
              onChange={handleInputChange}
            />
            <InputField
              id="verifyWhomEmail"
              name="verifyWhomEmail"
              label="VerifyWhomEmail"
              type="email"
              value={editedFinance['verifyWhomEinfo'] || ''}
              onChange={handleInputChange}
            />
            <InputField
              id="transectionId"
              name="transectionId"
              label="TransectionId"
              value={editedFinance['transectionId'] || ''}
              onChange={handleInputChange}
            />
            <InputField
              id="invoiceNumber"
              name="invoiceNumber"
              label="InvoiceNumber"
              value={editedFinance['invoiceNumber'] || ''}
              onChange={handleInputChange}
            />
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="refundStatus" className="text-right">
                RefundStatus
              </Label>
              <Checkbox
                id="refundStatus"
                name="refundStatus"
                checked={editedFinance['refundStatus'] || false}
                onCheckedChange={checked => handleCheckboxChange('refundStatus', !!checked)}
              />
            </div>
            <InputField id="refundAmount" name="refundAmount" label="RefundAmount" value={editedFinance['refundAmount'] || ''} onChange={handleInputChange} />
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              toggleEditModal(false);
              setSelectedFinances(null);
            }}
          >
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleEditFinance} className="bg-green-100 text-green-600 hover:bg-green-200">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNextComponents;
