/*
|-----------------------------------------
| setting up View Component for User Access
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { format } from 'date-fns';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useUsersAccessStore } from '../store/Store';
import { useGetUsers_student_accessByIdQuery } from '../redux/rtk-Api';

// Helper function to get styling for role badges
const getRoleBadgeStyle = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'moderator':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'mentor':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'instructor':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'student':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const ViewUserAccess: React.FC = () => {
  const { isViewModalOpen, selectedUsersAccess, toggleViewModal, setSelectedUsersAccess } = useUsersAccessStore();
  const { data: userAccessData, refetch } = useGetUsers_student_accessByIdQuery(selectedUsersAccess?._id, { skip: !selectedUsersAccess?._id });

  // Refetch data when a new user is selected
  useEffect(() => {
    if (selectedUsersAccess?._id) {
      refetch();
    }
  }, [selectedUsersAccess?._id, refetch]);

  // Update the store's selected user with the fresh data from the API
  useEffect(() => {
    if (userAccessData?.data) {
      setSelectedUsersAccess(userAccessData.data);
    }
  }, [userAccessData, setSelectedUsersAccess]);

  const formatDate = (date?: Date | string) => (date ? format(new Date(date), 'MMM dd, yyyy, h:mm a') : 'N/A');

  const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between border-b py-2">
      <div className="font-semibold text-slate-600">{label}</div>
      <div className="text-right">{value || 'N/A'}</div>
    </div>
  );

  // When the dialog is closed, clear the selected user from the global store
  const handleOnOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedUsersAccess(null);
    }
    toggleViewModal(isOpen);
  };
  return (
    <Dialog open={isViewModalOpen} onOpenChange={handleOnOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Access Details</DialogTitle>
        </DialogHeader>
        {selectedUsersAccess && (
          <ScrollArea className="h-auto max-h-[60vh] w-full rounded-md p-4">
            <div className="grid gap-2">
              <DetailRow label="Name" value={selectedUsersAccess.name} />
              <DetailRow label="Email" value={selectedUsersAccess.email} />
              <DetailRow
                label="Roles"
                value={
                  <div className="flex flex-wrap gap-1 justify-end">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeStyle(selectedUsersAccess.role || '')}`}>
                      {selectedUsersAccess.role}
                    </span>
                  </div>
                }
              />
              <DetailRow label="Assigned By" value={selectedUsersAccess.assignBy} />
              <DetailRow label="Created At" value={formatDate(selectedUsersAccess.createdAt)} />
              <DetailRow label="Last Updated" value={formatDate(selectedUsersAccess.updatedAt)} />
            </div>
          </ScrollArea>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => toggleViewModal(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserAccess;
