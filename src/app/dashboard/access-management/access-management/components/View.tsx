import { format } from 'date-fns';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { IAccessManagements, defaultAccessManagements } from '../store/data/data';
import { useAccessManagementsStore } from '../store/store';
import { useGetAccessManagementsByIdQuery } from '@/redux/features/accessManagements/accessManagementsSlice';
import { logger } from 'better-auth';

const ViewNextComponents: React.FC = () => {
  const { isViewModalOpen, selectedAccessManagements, toggleViewModal, setSelectedAccessManagements } = useAccessManagementsStore();

  const { data: accessManagementData, refetch } = useGetAccessManagementsByIdQuery(selectedAccessManagements?._id, {
    skip: !selectedAccessManagements?._id,
  });

  useEffect(() => {
    if (selectedAccessManagements?._id) {
      refetch();
    }
  }, [selectedAccessManagements?._id, refetch]);

  useEffect(() => {
    if (accessManagementData?.data) {
      setSelectedAccessManagements(accessManagementData.data);
    }
  }, [accessManagementData, setSelectedAccessManagements]);

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch (error) {
      logger.error(JSON.stringify(error));
      return 'Invalid Date';
    }
  };

  const DetailRow: React.FC<{
    label: string;
    value: React.ReactNode;
  }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b">
      <div className="font-semibold text-sm text-gray-600 dark:text-gray-300">{label}</div>
      <div className="col-span-2 text-sm text-gray-800 dark:text-gray-100">{value || 'N/A'}</div>
    </div>
  );

  const DetailRowArray: React.FC<{
    label: string;
    values?: (string | number)[];
  }> = ({ label, values }) => <DetailRow label={label} value={values?.join(', ') || 'N/A'} />;

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>AccessManagements Details</DialogTitle>
        </DialogHeader>
        {selectedAccessManagements && (
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <div className="grid gap-1">
              <DetailRow label="User_name" value={selectedAccessManagements['user_name']} />
              <DetailRow label="User_email" value={selectedAccessManagements['user_email']} />
              <DetailRowArray label="Assign_role" values={selectedAccessManagements['assign_role']} />
              <DetailRow label="Created At" value={formatDate(selectedAccessManagements.createdAt)} />
              <DetailRow label="Updated At" value={formatDate(selectedAccessManagements.updatedAt)} />
            </div>
          </ScrollArea>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              toggleViewModal(false);
              setSelectedAccessManagements(defaultAccessManagements as IAccessManagements);
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
