I will give you some example of code named Add.tsx and data.tsx,

You have to repleace """<JsonTextareaField id="role" value={newRole['role'] || {}} onChange={value => handleFieldChange('role', value as string)} />""" and create a table for type IERoles and defaulERoles. you have to update each boolean field with check mark. and after that I can add a new data to my database. 

Remember, You have to design responsive for mobile, tablet, and desktop. Implement glassemorphisiom effect. 

here is example of code. 

Add.tsx 
```
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

```

data.ts 
```
export interface IERoles {
  user: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  website_setting: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  role_permission: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  access_management: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  course: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  review: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  lecture: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  batch: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  q_and_a: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  content_resource: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  assessment: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  payment: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  submissions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  enrollment: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  marketing_lead: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  profile: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  message: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  media: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  follow_up: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  attendance: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  company_goal: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  support_ticket: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  post: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  reward: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  'employee_task ': {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
}
export const defaulERoles = {
  user: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  website_setting: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  role_permission: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  access_management: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  course: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  review: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  lecture: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  batch: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  q_and_a: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  content_resource: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  assessment: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  payment: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  submissions: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  enrollment: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  marketing_lead: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  profile: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  message: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  media: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  follow_up: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  attendance: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  company_goal: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  support_ticket: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  post: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  reward: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  'employee_task ': {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
};
export interface IRoles {
  name: string;
  email: string;
  note: string;
  description: string;
  role: IERoles;
  createdAt: Date;
  updatedAt: Date;
  _id?: string;
}

export const defaultRoles = {
  name: '',
  email: '',
  role: defaulERoles,
  note: '',
  description: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  _id: '',
};

```

Now update Add.tsx 