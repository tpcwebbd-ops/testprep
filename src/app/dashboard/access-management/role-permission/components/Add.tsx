import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import JsonTextareaField from '@/components/dashboard-ui/JsonTextareaField';
import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField';

import { useRolesStore } from '../store/store';
import { useAddRolesMutation } from '@/redux/features/roles/rolesSlice';
import { IRoles, defaultRoles } from '../store/data/data';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

const AddNextComponents: React.FC = () => {
  const { toggleAddModal, isAddModalOpen, setRoles } = useRolesStore();
  const [addRoles, { isLoading }] = useAddRolesMutation();
  const [newRole, setNewRole] = useState<IRoles>(defaultRoles);

  const handleFieldChange = (name: string, value: unknown) => {
    setNewRole(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRole = async () => {
    try {
      const updateData = { ...newRole };
      delete updateData._id;
      const addedRole = await addRoles(updateData).unwrap();
      setRoles([addedRole]);
      toggleAddModal(false);
      setNewRole(defaultRoles);
      handleSuccess('Added Successfully');
    } catch (error: unknown) {
      console.error('Failed to add record:', error);
      let errMessage: string = 'An unknown error occurred.';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message) || 'An API error occurred.';
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      handleError(errMessage);
    }
  };

  return (
    <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Add New Role</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="name" className="text-right ">
                Role Name
              </Label>
              <div className="col-span-3">
                <InputFieldForString id="name" placeholder="Admin" value={newRole['name']} onChange={value => handleFieldChange('name', value as string)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="note" className="text-right pt-3">
                Note
              </Label>
              <div className="col-span-3">
                <RichTextEditorField id="note" value={newRole['note']} onChange={value => handleFieldChange('note', value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="description" className="text-right pt-3">
                Description
              </Label>
              <div className="col-span-3">
                <RichTextEditorField id="description" value={newRole['description']} onChange={value => handleFieldChange('description', value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="email" className="text-right ">
                email
              </Label>
              <div className="col-span-3">
                <InputFieldForEmail id="email" value={newRole['email']} onChange={value => handleFieldChange('email', value as string)} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="role" className="text-right pt-3">
                role
              </Label>
              <div className="col-span-3">
                <JsonTextareaField id="role" value={newRole['role'] || {}} onChange={value => handleFieldChange('role', value as string)} />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => toggleAddModal(false)}>
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleAddRole}>
            {isLoading ? 'Adding...' : 'Add Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNextComponents;
