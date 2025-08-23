// /*
// |-----------------------------------------
// | setting up Controller for the App
// | @author: Toufiquer Rahman<toufiquer.0@gmail.com>
// | @copyright: varse-project, May, 2025
// |-----------------------------------------
// */

// import React from 'react';

// import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// import { IUsers_access } from '../api/v1/model';
// import { useUsersAccessStore } from '../store/Store';
// import { usersAccessSelectorArr } from '../store/StoreConstants';
// import { useBulkUpdateUsers_accessMutation } from '../redux/rtk-Api';

// import { handleSuccess } from './utils';

// const BulkUpdateNextComponents: React.FC = () => {
//   const { toggleBulkUpdateModal, isBulkUpdateModalOpen, bulkData, setBulkData } = useUsersAccessStore();
//   const [bulkUpdateUsersAccess, { isLoading }] = useBulkUpdateUsers_accessMutation();

//   const handleBulkEditUsersAccess = async () => {
//     if (!bulkData.length) return;
//     try {
//       const newBulkData = bulkData.map(({ _id, ...rest }) => ({
//         id: _id,
//         updateData: rest,
//       }));
//       await bulkUpdateUsersAccess(newBulkData).unwrap();
//       toggleBulkUpdateModal(false);
//       setBulkData([]);
//       handleSuccess('Update Successful');
//     } catch (error) {
//       console.error('Failed to edit usersAccess:', error);
//     }
//   };

//   const handleRoleChangeForAll = (role: string) => {
//     setBulkData(
//       bulkData.map(UsersAccess => ({
//         ...UsersAccess,
//         role,
//       })) as IUsers_access[],
//     );
//   };

//   return (
//     <Dialog open={isBulkUpdateModalOpen} onOpenChange={toggleBulkUpdateModal}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Confirm Update</DialogTitle>
//         </DialogHeader>
//         {bulkData.length > 0 && (
//           <div>
//             <p className="pt-2">
//               You are about to update <span className="font-semibold">({bulkData.length})</span> usersAccess
//             </p>
//             <div className="w-full flex items-center justify-between pt-2">
//               <p>Update all data as</p>
//               <Select onValueChange={role => handleRoleChangeForAll(role)} defaultValue={(usersAccessSelectorArr[0] as string) || ''}>
//                 <SelectTrigger className="bg-slate-50">
//                   <SelectValue placeholder="Select a role" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-slate-50">
//                   {usersAccessSelectorArr?.map((role, index) => (
//                     <SelectItem key={role + index} value={role} className="cursor-pointer hover:bg-slate-200">
//                       {role}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         )}
//         <ScrollArea className="h-[400px] w-full rounded-md border p-4">
//           <div className="flex flex-col gap-2">
//             {bulkData.map((UsersAccess, idx) => (
//               <div key={(UsersAccess._id as string) || idx} className="flex items-center justify-between">
//                 <span>
//                   {idx + 1}. {(UsersAccess.name as string) || ''}
//                 </span>
//                 <span>{UsersAccess.role as string}</span>
//               </div>
//             ))}
//           </div>
//         </ScrollArea>
//         <DialogFooter>
//           <Button variant="outline" onClick={() => toggleBulkUpdateModal(false)} className="cursor-pointer border-slate-400 hover:border-slate-500">
//             Cancel
//           </Button>
//           <Button
//             disabled={isLoading}
//             variant="outline"
//             onClick={handleBulkEditUsersAccess}
//             className="text-green-400 hover:text-green-500 cursor-pointer bg-green-100 hover:bg-green-200 border-1 border-green-300 hover:border-green-400"
//           >
//             Update Selected
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default BulkUpdateNextComponents;

/*
|-----------------------------------------
| setting up BulkUpdate for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, August, 2025
|-----------------------------------------
*/
const BulkUpdate = () => {
  return <main>BulkUpdate</main>;
};
export default BulkUpdate;
