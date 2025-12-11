Look at the FormFieldForm1.tsx 
```
/*
|-----------------------------------------
| FormFieldForm1 - Personal Information
|-----------------------------------------
*/
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { IForm1Data } from './data';
import { defaultDataForm1 } from './data';
import { usePathname } from 'next/navigation';

export interface Form1Props {
  data?: IForm1Data;
}

const FormFieldForm1 = ({ data }: Form1Props) => {
  const [formData, setFormData] = useState<IForm1Data>({ ...defaultDataForm1 });

  useEffect(() => {
    if (data) {
      setFormData({ ...data });
    }
  }, [data]);

  const updateField = (field: keyof IForm1Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const currentPath = usePathname();
  const handleSubmit = () => {
    const updateField = { ...formData, currentPath };
    console.log('updateField', updateField);
  };
  return (
    <div className="space-y-6 p-1 text-stone-50">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input value={formData.lastName} onChange={e => updateField('lastName', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={formData.email} onChange={e => updateField('email', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input value={formData.phoneNumber} onChange={e => updateField('phoneNumber', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Input type="date" value={formData.dateOfBirth} onChange={e => updateField('dateOfBirth', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <Input value={formData.gender} onChange={e => updateField('gender', e.target.value)} placeholder="Male / Female / Other" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Passport Number</Label>
          <Input value={formData.passportNumber} onChange={e => updateField('passportNumber', e.target.value)} />
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:opacity-90">
        Save Personal Info
      </Button>
    </div>
  );
};

export default FormFieldForm1;

```

Now here is the url : "/api/form-submission/v1"

after submit the button please make a POST request in this url. and make the button disabole for 10 minutes. 