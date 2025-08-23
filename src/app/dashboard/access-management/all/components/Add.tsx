// import { useState } from 'react';

// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Textarea } from '@/components/ui/textarea';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// import { useUsers_1_000___Store } from '..//storestore';
// import { useAddUsers_accessMutation } from '../redux/rtk-api';
// import { IAccesses, defaultAccesses } from '@/app/dashboard/accessess/all/api/v1/model';
// import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

// const InputField: React.FC<{
//   id: string;
//   name: string;
//   label: string;
//   type?: string;
//   value: string | number;
//   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
// }> = ({ id, name, label, type = 'text', value, onChange }) => (
//   <div className="grid grid-cols-4 items-center gap-4 pr-1">
//     <Label htmlFor={id} className="text-right">
//       {label}
//     </Label>
//     {type === 'textarea' ? (
//       <Textarea id={id} name={name} value={value as string} onChange={onChange} className="col-span-3" />
//     ) : (
//       <Input id={id} name={name} type={type} value={value} onChange={onChange} className="col-span-3" />
//     )}
//   </div>
// );

// const AddNextComponents: React.FC = () => {
//   const { toggleAddModal, isAddModalOpen, setUsers_1_000___ } = useUsers_1_000___Store();
//   const [addAccesses, { isLoading }] = useAddUsers_accessMutation();
//   const [newAccess, setNewAccess] = useState<IAccesses>(defaultAccesses);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setNewAccess({ ...newAccess, [name]: value });
//   };

//   const handleCheckboxChange = (name: string, checked: boolean) => {
//     setNewAccess({ ...newAccess, [name]: checked });
//   };

//   const handleSelectChange = (name: string, value: string) => {
//     setNewAccess({ ...newAccess, [name]: value });
//   };

//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
//     const { value } = e.target;
//     if (nestedField) {
//       setNewAccess({
//         ...newAccess,
//         [field]: {
//           ...(newAccess[field as keyof IAccesses] as object),
//           [nestedField]: new Date(value),
//         },
//       });
//     } else {
//       setNewAccess({ ...newAccess, [field]: new Date(value) });
//     }
//   };

//   const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
//     const { value } = e.target;
//     if (nestedField) {
//       setNewAccess({
//         ...newAccess,
//         [field]: {
//           ...(newAccess[field as keyof IAccesses] as object),
//           [nestedField]: value,
//         },
//       });
//     } else {
//       setNewAccess({ ...newAccess, [field]: value });
//     }
//   };

//   const handleArrayChange = (name: string, value: string) => {
//     setNewAccess({ ...newAccess, [name]: value.split(',').map(item => item.trim()) });
//   };

//   const handleAddAccess = async () => {
//     try {
//       const addedAccess = await addAccesses(newAccess).unwrap();
//       setAccesses([addedAccess]);
//       toggleAddModal(false);
//       setNewAccess(defaultAccesses);
//       handleSuccess('Added Successful');
//     } catch (error: unknown) {
//       console.error(error);
//       let errMessage: string = 'An unknown error occurred.';
//       if (isApiErrorResponse(error)) {
//         errMessage = formatDuplicateKeyError(error.data.message) || 'API error';
//       } else if (error instanceof Error) {
//         errMessage = error.message;
//       }
//       handleError(errMessage);
//     }
//   };

//   return (
//     <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
//       <DialogContent className="sm:max-w-[625px]">
//         <DialogHeader>
//           <DialogTitle>Add New Access</DialogTitle>
//         </DialogHeader>

//         <ScrollArea className="h-[500px] w-full rounded-md border p-4">
//           <div className="grid gap-4 py-4">
//             <InputField id="student" name="student" label="Student" value={newAccess['student']} onChange={handleInputChange} />
//             <InputField id="admin" name="admin" label="Admin" value={newAccess['admin']} onChange={handleInputChange} />
//             <InputField id="moderator" name="moderator" label="Moderator" value={newAccess['moderator']} onChange={handleInputChange} />
//             <InputField id="mentor" name="mentor" label="Mentor" value={newAccess['mentor']} onChange={handleInputChange} />
//             <InputField id="instructor" name="instructor" label="Instructor" value={newAccess['instructor']} onChange={handleInputChange} />
//           </div>
//         </ScrollArea>

//         <DialogFooter>
//           <Button variant="outline" onClick={() => toggleAddModal(false)}>
//             Cancel
//           </Button>
//           <Button disabled={isLoading} onClick={handleAddAccess}>
//             {isLoading ? 'Adding...' : 'Add Access'}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AddNextComponents;

/*
|-----------------------------------------
| setting up Add for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, August, 2025
|-----------------------------------------
*/
const Add = () => {
  return <main>Add</main>;
};
export default Add;
