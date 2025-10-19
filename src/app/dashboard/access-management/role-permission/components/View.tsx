import { format } from 'date-fns';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { IRoles, defaultRoles } from '../store/data/data';
import { useRolesStore } from '../store/store';
import { useGetRolesByIdQuery } from '@/redux/features/roles/rolesSlice';

const ViewNextComponents: React.FC = () => {
  const { isViewModalOpen, selectedRoles, toggleViewModal, setSelectedRoles } = useRolesStore();

  const { data: roleData, refetch } = useGetRolesByIdQuery(selectedRoles?._id, { skip: !selectedRoles?._id });

  useEffect(() => {
    if (selectedRoles?._id) {
      refetch();
    }
  }, [selectedRoles?._id, refetch]);

  useEffect(() => {
    if (roleData?.data) {
      setSelectedRoles(roleData.data);
    }
  }, [roleData, setSelectedRoles]);

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid Date' + error;
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

  // --- NEW HELPER COMPONENT FOR RENDERING JSON ---
  const DetailRowJson: React.FC<{
    label: string;
    value?: object | unknown[];
  }> = ({ label, value }) => (
    <div className="grid grid-cols-1 gap-1 py-2 border-b">
      <div className="font-semibold text-sm text-gray-600 dark:text-gray-300">{label}</div>
      <div className="col-span-1 text-sm bg-slate-100 dark:bg-slate-800 p-2 rounded-md mt-1">
        <pre className="whitespace-pre-wrap text-xs">{value ? JSON.stringify(value, null, 2) : 'N/A'}</pre>
      </div>
    </div>
  );

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Roles Details</DialogTitle>
        </DialogHeader>
        {selectedRoles && (
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <div className="grid gap-1">
              <DetailRow label="Name" value={selectedRoles['name']} />
              <DetailRow label="Email" value={selectedRoles['email']} />
              <DetailRowJson label="Role" value={selectedRoles['role']} />
              <DetailRow label="Created At" value={formatDate(selectedRoles.createdAt)} />
              <DetailRow label="Updated At" value={formatDate(selectedRoles.updatedAt)} />
            </div>
          </ScrollArea>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              toggleViewModal(false);
              setSelectedRoles(defaultRoles as IRoles);
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
