/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import Image from 'next/image';
import { format } from 'date-fns';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { IGAuthUsers } from '../api/v1/Model';
import { useGAuthUsersStore } from '../store/Store';
import { baseIGAuthUsers } from '../store/StoreConstants';
import { useGetGAuthUsersByIdQuery } from '../redux/rtk-Api';

const ViewNextComponents: React.FC = () => {
  const { isViewModalOpen, selectedGAuthUsers, toggleViewModal, setSelectedGAuthUsers } = useGAuthUsersStore();
  const { data: GAuthUsersData, refetch } = useGetGAuthUsersByIdQuery(selectedGAuthUsers?._id, { skip: !selectedGAuthUsers?._id });

  useEffect(() => {
    if (selectedGAuthUsers?._id) {
      refetch(); // Fetch the latest GAuthUsers data
    }
  }, [selectedGAuthUsers?._id, refetch]);

  useEffect(() => {
    if (GAuthUsersData?.data) {
      setSelectedGAuthUsers(GAuthUsersData.data); // Update selectedGAuthUsers with the latest data
    }
  }, [GAuthUsersData, setSelectedGAuthUsers]);

  const formatDate = (date?: Date) => (date ? format(date, 'MMM dd, yyyy') : 'N/A');

  const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="grid grid-cols-3 gap-2">
      <div className="font-semibold">{label}:</div>
      <div className="col-span-2">{value || 'N/A'}</div>
    </div>
  );
  const DetailRowBoolean = ({ label, value }: { label: string; value: boolean }) => (
    <div className="grid grid-cols-3 gap-2">
      <div className="font-semibold">{label}:</div>
      <div className="col-span-2">{value ? 'Yes' : 'No'}</div>
    </div>
  );

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>GAuthUsers Details</DialogTitle>
        </DialogHeader>
        {selectedGAuthUsers && (
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="w-full flex flex-col">
              <div className="grid gap-2">
                {selectedGAuthUsers.imageUrl && (
                  <div className="relative w-24 h-24 rounded">
                    <div className="w-24 h-24 rounded-full object-cover border-3 border-blue-500 mb-6 overflow-hidden relative">
                      <Image fill src={selectedGAuthUsers.imageUrl} alt={selectedGAuthUsers.name} />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white" />
                  </div>
                )}

                <DetailRow label="Name" value={selectedGAuthUsers.name as string} />
                <DetailRow label="Email" value={selectedGAuthUsers.email as string} />
                <DetailRow label="User Role" value={selectedGAuthUsers.userRole.join(', ') as string} />
                <DetailRow label="Pass Code" value={selectedGAuthUsers.passCode as string} />
                <DetailRow label="User UID" value={selectedGAuthUsers.userUID as string} />
                <DetailRowBoolean label="Blocked" value={selectedGAuthUsers.isBlocked as boolean} />
                <DetailRow label="Blocked by" value={selectedGAuthUsers.blockedBy as string} />

                <DetailRow label="Created At" value={formatDate(selectedGAuthUsers.createdAt)} />
                <DetailRow label="Updated At" value={formatDate(selectedGAuthUsers.updatedAt)} />
              </div>

              <div className="w-full m-2" />
            </div>
          </ScrollArea>
        )}
        <DialogFooter>
          <Button
            className="cursor-pointer border-1 border-slate-400 hover:border-slate-500"
            onClick={() => {
              toggleViewModal(false);
              setSelectedGAuthUsers({ ...baseIGAuthUsers } as IGAuthUsers);
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
