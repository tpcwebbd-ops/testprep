import { ChangeEvent, FC, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useFinancesStore } from '../store/store';
import { useAddfinancesMutation } from '../redux/rtk-api';
import { IFinances, defaultFinances } from '@/app/dashboard/finance/all/api/v1/model';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

const InputField: FC<{
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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

const AddNextComponents: FC = () => {
  const { toggleAddModal, isAddModalOpen, setFinances } = useFinancesStore();
  const [addFinances, { isLoading }] = useAddfinancesMutation();
  const [newFinance, setNewFinance] = useState<IFinances>(defaultFinances);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewFinance({ ...newFinance, [name]: value });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setNewFinance({ ...newFinance, [name]: checked });
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
    const { value } = e.target;
    if (nestedField) {
      setNewFinance({
        ...newFinance,
        [field]: {
          ...(newFinance[field as keyof IFinances] as object),
          [nestedField]: new Date(value),
        },
      });
    } else {
      setNewFinance({ ...newFinance, [field]: new Date(value) });
    }
  };

  const handleAddFinance = async () => {
    try {
      const addedFinance = await addFinances(newFinance).unwrap();
      setFinances([addedFinance]);
      toggleAddModal(false);
      setNewFinance(defaultFinances);
      handleSuccess('Added Successful');
    } catch (error: unknown) {
      console.error(error);
      let errMessage: string = 'An unknown error occurred.';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message) || 'API error';
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      handleError(errMessage);
    }
  };

  return (
    <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add New Finance</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <div className="grid gap-4 py-4">
            <InputField id="studentName" name="studentName" label="Student Name" value={newFinance['studentName']} onChange={handleInputChange} />
            <InputField
              id="studentEinfo" // Changed from studentEmail
              name="studentEinfo" // Changed from studentEmail
              label="Student Email"
              type="email"
              value={newFinance['studentEinfo']} // Changed from studentEmail
              onChange={handleInputChange}
            />
            <InputField id="studentNumber" name="studentNumber" label="Student Number" value={newFinance['studentNumber']} onChange={handleInputChange} />
            <InputField id="courseName" name="courseName" label="Course Name" value={newFinance['courseName']} onChange={handleInputChange} />
            <InputField id="coursePrice" name="coursePrice" label="Course Price" value={newFinance['coursePrice']} onChange={handleInputChange} />
            <InputField id="coureCode" name="coureCode" label="Course Code" value={newFinance['coureCode']} onChange={handleInputChange} />
            <InputField id="batchNo" name="batchNo" label="Batch No" value={newFinance['batchNo']} onChange={handleInputChange} />
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="paymentStatus" className="text-right">
                Payment Status
              </Label>
              <Checkbox
                id="paymentStatus"
                name="paymentStatus"
                checked={newFinance['paymentStatus']}
                onCheckedChange={checked => handleCheckboxChange('paymentStatus', !!checked)}
              />
            </div>
            <InputField id="discount" name="discount" label="Discount" value={newFinance['discount']} onChange={handleInputChange} />
            <InputField id="totalPayment" name="totalPayment" label="Total Payment" value={newFinance['totalPayment']} onChange={handleInputChange} />
            <InputField
              id="enrollmentDate"
              name="enrollmentDate"
              label="Enrollment Date"
              type="date"
              value={newFinance['enrollmentDate'] ? new Date(newFinance['enrollmentDate']).toISOString().split('T')[0] : ''}
              onChange={e => handleDateChange(e as ChangeEvent<HTMLInputElement>, 'enrollmentDate')}
            />
            <InputField
              id="paymentData"
              name="paymentData"
              label="Payment Date"
              type="date"
              value={newFinance['paymentData'] ? new Date(newFinance['paymentData']).toISOString().split('T')[0] : ''}
              onChange={e => handleDateChange(e as ChangeEvent<HTMLInputElement>, 'paymentData')}
            />
            <InputField id="verifyWhomName" name="verifyWhomName" label="Verifier Name" value={newFinance['verifyWhomName']} onChange={handleInputChange} />
            <InputField
              id="verifyWhomEinfo" // Changed from verifyWhomEmail
              name="verifyWhomEinfo" // Changed from verifyWhomEmail
              label="Verifier Email"
              type="email"
              value={newFinance['verifyWhomEinfo']} // Changed from verifyWhomEmail
              onChange={handleInputChange}
            />
            <InputField id="transectionId" name="transectionId" label="Transaction ID" value={newFinance['transectionId']} onChange={handleInputChange} />
            <InputField id="invoiceNumber" name="invoiceNumber" label="Invoice Number" value={newFinance['invoiceNumber']} onChange={handleInputChange} />
            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="refundStatus" className="text-right">
                Refund Status
              </Label>
              <Checkbox
                id="refundStatus"
                name="refundStatus"
                checked={newFinance['refundStatus']}
                onCheckedChange={checked => handleCheckboxChange('refundStatus', !!checked)}
              />
            </div>
            <InputField id="refundAmount" name="refundAmount" label="Refund Amount" value={newFinance['refundAmount']} onChange={handleInputChange} />
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => toggleAddModal(false)}>
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleAddFinance}>
            {isLoading ? 'Adding...' : 'Add Finance'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNextComponents;
