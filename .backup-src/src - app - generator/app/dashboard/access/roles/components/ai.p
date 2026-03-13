look at the color combination and style.
here is first Delete.tsx 
```
import React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { IAccessManagements, defaultAccessManagements } from '../store/data/data';
import { useAccessManagementsStore } from '../store/store';
import { useDeleteAccessManagementsMutation } from '@/redux/features/accessManagements/accessManagementsSlice';
import { handleSuccess, handleError } from './utils';

const DeleteNextComponents: React.FC = () => {
  const { toggleDeleteModal, isDeleteModalOpen, selectedAccessManagements, setSelectedAccessManagements } = useAccessManagementsStore();

  const [deleteAccessManagement, { isLoading }] = useDeleteAccessManagementsMutation();

  const handleDelete = async () => {
    if (selectedAccessManagements) {
      try {
        await deleteAccessManagement({
          id: selectedAccessManagements._id,
        }).unwrap();
        toggleDeleteModal(false);
        handleSuccess('Delete Successful');
      } catch (error) {
        console.error('Failed to delete AccessManagement:', error);
        handleError('Failed to delete item. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    toggleDeleteModal(false);
    setSelectedAccessManagements({ ...defaultAccessManagements } as IAccessManagements);
  };

  const displayName = selectedAccessManagements?.['user_name'] || '';

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
      <DialogContent className="sm:max-w-md rounded-sm border border-white/50 bg-white/10 backdrop-blur-2xl shadow-xl text-white">
        <DialogHeader>
          <DialogTitle className="bg-clip-text text-transparent bg-linear-to-r from-white to-red-200">Confirm Deletion</DialogTitle>
        </DialogHeader>

        <p className="text-white/80 py-3">
          Are you sure you want to delete:&nbsp;
          <strong className="text-white">{displayName}</strong> ?
        </p>

        <DialogFooter className="gap-2">
          <Button variant="outlineWater" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="outlineFire" size="sm" disabled={isLoading} onClick={handleDelete}>
            {isLoading ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNextComponents;

```

and here is second Delete.tsx 
```
import React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { IRoles, defaultRoles } from '../store/data/data';
import { useRolesStore } from '../store/store';
import { useDeleteRolesMutation } from '@/redux/features/roles/rolesSlice';
import { handleSuccess, handleError } from './utils';

const DeleteNextComponents: React.FC = () => {
  const { toggleDeleteModal, isDeleteModalOpen, selectedRoles, setSelectedRoles } = useRolesStore();

  const [deleteRole, { isLoading }] = useDeleteRolesMutation();

  const handleDelete = async () => {
    if (selectedRoles) {
      try {
        await deleteRole({
          id: selectedRoles._id,
        }).unwrap();
        toggleDeleteModal(false);
        handleSuccess('Delete Successful');
      } catch (error) {
        console.error('Failed to delete Role:', error);
        handleError('Failed to delete item. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    toggleDeleteModal(false);
    setSelectedRoles({ ...defaultRoles } as IRoles);
  };

  const displayName = selectedRoles?.['name'] || '';

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        {selectedRoles && (
          <div className="py-4">
            <p>
              You are about to delete this role: <span className="font-semibold">{displayName}</span>
            </p>
          </div>
        )}
        <DialogFooter>
          <Button className="cursor-pointer" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button disabled={isLoading} variant="destructive" onClick={handleDelete}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNextComponents;

```

Now Your task is copy only color-combination and style from first Delete.tsx and implement it in second Delete.tsx and remember do not use another color or style from outside. 