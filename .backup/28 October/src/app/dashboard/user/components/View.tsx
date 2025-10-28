import { format } from 'date-fns';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { IUsers, defaultUsers } from '../store/data/data';
import { useUsersStore } from '../store/store';
import { useGetUsersByIdQuery } from '@/redux/features/user/userSlice';
import { logger } from 'better-auth';

const ViewNextComponents: React.FC = () => {
  const { isViewModalOpen, selectedUsers, toggleViewModal, setSelectedUsers } = useUsersStore();

  const { data: userData, refetch } = useGetUsersByIdQuery(selectedUsers?._id, { skip: !selectedUsers?._id });

  useEffect(() => {
    if (selectedUsers?._id) {
      refetch();
    }
  }, [selectedUsers?._id, refetch]);

  useEffect(() => {
    if (userData?.data) {
      setSelectedUsers(userData.data);
    }
  }, [userData, setSelectedUsers]);

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch (error) {
      logger.error(JSON.stringify(error));
      return 'Invalid Date';
    }
  };

  const formatBoolean = (value?: boolean) => (value ? 'Yes' : 'No');

  const DetailRow: React.FC<{
    label: string;
    value: React.ReactNode;
  }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b">
      <div className="font-semibold text-sm text-gray-600 dark:text-gray-300">{label}</div>
      <div className="col-span-2 text-sm text-gray-800 dark:text-gray-100">{value || 'N/A'}</div>
    </div>
  );

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Users Details</DialogTitle>
        </DialogHeader>
        {selectedUsers && (
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <div className="grid gap-1">
              <DetailRow label="Name" value={selectedUsers['name']} />
              <DetailRow label="Email" value={selectedUsers['email']} />
              <DetailRow label="EmailVerified" value={formatBoolean(selectedUsers['emailVerified'])} />
              <DetailRow label="Created At" value={formatDate(selectedUsers.createdAt)} />
              <DetailRow label="Updated At" value={formatDate(selectedUsers.updatedAt)} />
            </div>
          </ScrollArea>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              toggleViewModal(false);
              setSelectedUsers(defaultUsers as IUsers);
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
