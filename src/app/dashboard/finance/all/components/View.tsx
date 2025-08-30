import { format } from 'date-fns';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { IFinances, defaultFinances } from '../api/v1/model';
import { useFinancesStore } from '../store/store';
import { useGetfinancesByIdQuery } from '../redux/rtk-api';

const ViewNextComponents: React.FC = () => {
  const { isViewModalOpen, selectedFinances, toggleViewModal, setSelectedFinances } = useFinancesStore();

  const { data: financeData, refetch } = useGetfinancesByIdQuery(selectedFinances?._id, { skip: !selectedFinances?._id });

  useEffect(() => {
    if (selectedFinances?._id) {
      refetch();
    }
  }, [selectedFinances?._id, refetch]);

  useEffect(() => {
    if (financeData?.data) {
      setSelectedFinances(financeData.data);
    }
  }, [financeData, setSelectedFinances]);

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch (error) {
      console.log('error : ', error);
      return 'Invalid Date';
    }
  };

  const formatBoolean = (value?: boolean) => (value ? 'Yes' : 'No');

  const DetailRow: React.FC<{
    label: string;
    value: React.ReactNode;
  }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b">
      <div className="font-semibold text-sm text-gray-600">{label}</div>
      <div className="col-span-2 text-sm">{value || 'N/A'}</div>
    </div>
  );

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Finances Details</DialogTitle>
        </DialogHeader>
        {selectedFinances && (
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <div className="grid gap-1">
              <DetailRow label="StudentName" value={selectedFinances['studentName']} />
              <DetailRow label="StudentEmail" value={selectedFinances['studentEinfo']} />
              <DetailRow label="StudentNumber" value={selectedFinances['studentNumber']} />
              <DetailRow label="CourseName" value={selectedFinances['courseName']} />
              <DetailRow label="CoursePrice" value={selectedFinances['coursePrice']} />
              <DetailRow label="CoureCode" value={selectedFinances['coureCode']} />
              <DetailRow label="BatchNo" value={selectedFinances['batchNo']} />
              <DetailRow label="PaymentStatus" value={formatBoolean(selectedFinances['paymentStatus'])} />
              <DetailRow label="Discount" value={selectedFinances['discount']} />
              <DetailRow label="TotalPayment" value={selectedFinances['totalPayment']} />
              <DetailRow label="EnrollmentDate" value={formatDate(selectedFinances['enrollmentDate'])} />
              <DetailRow label="PaymentData" value={formatDate(selectedFinances['paymentData'])} />
              <DetailRow label="VerifyWhomName" value={selectedFinances['verifyWhomName']} />
              <DetailRow label="VerifyWhomEmail" value={selectedFinances['verifyWhomEinfo']} />
              <DetailRow label="TransectionId" value={selectedFinances['transectionId']} />
              <DetailRow label="InvoiceNumber" value={selectedFinances['invoiceNumber']} />
              <DetailRow label="RefundStatus" value={formatBoolean(selectedFinances['refundStatus'])} />
              <DetailRow label="RefundAmount" value={selectedFinances['refundAmount']} />
              <DetailRow label="Created At" value={formatDate(selectedFinances.createdAt)} />
              <DetailRow label="Updated At" value={formatDate(selectedFinances.updatedAt)} />
            </div>
          </ScrollArea>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              toggleViewModal(false);
              setSelectedFinances(defaultFinances as IFinances);
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewNextComponents;
