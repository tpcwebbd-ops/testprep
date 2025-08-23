// /*
// |-----------------------------------------
// | setting up Controller for the App
// | @author: Toufiquer Rahman<toufiquer.0@gmail.com>
// | @copyright: varse-project, May, 2025
// |-----------------------------------------
// */

// import React, { useEffect, useState } from 'react';

// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// import { IUsers_access } from '../api/v1/model';
// import { useUsersAccessStore } from '../store/Store';
// import { useUpdateUsers_accessMutation } from '../redux/rtk-Api';
// import { ISelectUserAccess, usersAccessSelectorArr, baseIUsers_access } from '../store/StoreConstants';

// import DataSelect from './DataSelect';
// import ImagesSelect from './ImagesSelect';
// import RichTextEditor from './rich-text-editor';
// import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

// const EditNextComponents: React.FC = () => {
//   const [newItemTags, setNewItemTags] = useState<string[]>([]);
//   const [newImages, setNewImages] = useState<string[]>([]);
//   const { toggleEditModal, isEditModalOpen, newUsersAccess, selectedUsersAccess, setNewUsersAccess, setSelectedUsersAccess } =
//     useUsersAccessStore();
//   const [updateUsersAccess] = useUpdateUsers_accessMutation();
//   const [descriptions, setDescriptions] = useState('');

//   const onChange = (content: string) => {
//     setDescriptions(content);
//   };
//   useEffect(() => {
//     if (selectedUsersAccess) {
//       setNewUsersAccess(selectedUsersAccess);
//       setNewItemTags(selectedUsersAccess.dataArr as string[]);
//       setNewImages(selectedUsersAccess.images as string[]);
//     }
//   }, [selectedUsersAccess, setNewUsersAccess]);
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setNewUsersAccess({ ...newUsersAccess, [name]: value });
//   };
//   const handleRoleChange = (value: string) => {
//     setNewUsersAccess({
//       ...newUsersAccess,
//       role: value as ISelectUserAccess,
//     });
//   };

//   const handleEditNextComponents = async () => {
//     if (!selectedUsersAccess) return;

//     try {
//       const updateData = {
//         ...newUsersAccess,
//         dataArr: newItemTags,
//         images: newImages,
//       };
//       await updateUsersAccess({
//         id: selectedUsersAccess._id,
//         ...updateData,
//       }).unwrap(); // Call RTK mutation
//       toggleEditModal(false);
//       handleSuccess('Edit Successful');
//     } catch (error: unknown) {
//       let errMessage: string = '';
//       if (isApiErrorResponse(error)) {
//         errMessage = formatDuplicateKeyError(error.data.message);
//       } else if (error instanceof Error) {
//         errMessage = error.message;
//       }
//       handleError(errMessage);
//     }
//   };

//   return (
//     <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Edit UsersAccess</DialogTitle>
//         </DialogHeader>
//         <ScrollArea className="h-[400px] w-full rounded-md border p-4">
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="edit-name" className="text-right">
//                 Name
//               </Label>
//               <Input id="edit-name" name="name" value={(newUsersAccess.name as string) || ''} onChange={handleInputChange} className="col-span-3" />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="edit-email" className="text-right">
//                 Email
//               </Label>
//               <Input
//                 id="edit-email"
//                 name="email"
//                 type="email"
//                 value={(newUsersAccess.email as string) || ''}
//                 onChange={handleInputChange}
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="edit-passCode" className="text-right">
//                 Pass Code
//               </Label>
//               <Input
//                 id="edit-passCode"
//                 name="passCode"
//                 type="password"
//                 value={(newUsersAccess.passCode as string) || ''}
//                 onChange={handleInputChange}
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="edit-alias" className="text-right">
//                 Alias
//               </Label>
//               <Input id="edit-alias" name="alias" value={(newUsersAccess.alias as string) || ''} onChange={handleInputChange} className="col-span-3" />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="edit-role" className="text-right">
//                 Role
//               </Label>

//               <Select onValueChange={handleRoleChange} defaultValue={(newUsersAccess.role as string) || ''}>
//                 <SelectTrigger className="col-span-3">
//                   <SelectValue placeholder="Select a role" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-slate-50">
//                   {usersAccessSelectorArr?.map((i, index) => (
//                     <SelectItem key={i + index} className="cursor-pointer hover:bg-slate-200" value={i}>
//                       {i}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <DataSelect newItemTags={newItemTags as string[]} setNewItemTags={setNewItemTags} />
//           </div>
//           <ImagesSelect newImages={newImages as string[]} setNewImages={setNewImages} />
//           <div className="w-full mt-2" />

//           <RichTextEditor content={descriptions} onChange={onChange} />
//           <div className="mt-12 pt-12" />
//         </ScrollArea>
//         <DialogFooter>
//           <Button
//             className="cursor-pointer border-1 border-slate-400 hover:border-slate-500"
//             variant="outline"
//             onClick={() => {
//               toggleEditModal(false);
//               setSelectedUsersAccess({
//                 ...baseIUsers_access,
//               } as IUsers_access);
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleEditNextComponents}
//             className="text-green-400 hover:text-green-500 cursor-pointer bg-green-100 hover:bg-green-200 border-1 border-green-300 hover:border-green-400"
//           >
//             Save Changes
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default EditNextComponents;

/*
|-----------------------------------------
| setting up Edit for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, August, 2025
|-----------------------------------------
*/
const Edit = () => {
  return <main>Edit</main>;
};
export default Edit;
