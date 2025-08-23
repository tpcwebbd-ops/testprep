// /*
// |-----------------------------------------
// | setting up Controller for the App
// | @author: Toufiquer Rahman<toufiquer.0@gmail.com>
// | @copyright: varse-project, May, 2025
// |-----------------------------------------
// */

// import Image from 'next/image';
// import { format } from 'date-fns';
// import React, { useEffect } from 'react';

// import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// import { IUsers_access } from '../api/v1/model';
// import { useUsersAccessStore } from '../store/Store';
// import { baseIUsers_access } from '../store/StoreConstants';
// import { useGetUsers_accessByIdQuery } from '../redux/rtk-Api';

// import { ViewRichText } from './view-rich-text/ViewRichText';

// const ViewNextComponents: React.FC = () => {
//   const { isViewModalOpen, selectedUsersAccess, toggleViewModal, setSelectedUsersAccess } = useUsersAccessStore();
//   const { data: UsersAccessData, refetch } = useGetUsers_accessByIdQuery(selectedUsersAccess?._id, { skip: !selectedUsersAccess?._id });

//   useEffect(() => {
//     if (selectedUsersAccess?._id) {
//       refetch(); // Fetch the latest UsersAccess data
//     }
//   }, [selectedUsersAccess?._id, refetch]);

//   useEffect(() => {
//     if (UsersAccessData?.data) {
//       setSelectedUsersAccess(UsersAccessData.data); // Update selectedUsersAccess with the latest data
//     }
//   }, [UsersAccessData, setSelectedUsersAccess]);

//   const formatDate = (date?: Date) => (date ? format(date, 'MMM dd, yyyy') : 'N/A');

//   const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
//     <div className="grid grid-cols-3 gap-2">
//       <div className="font-semibold">{label}:</div>
//       <div className="col-span-2">{value || 'N/A'}</div>
//     </div>
//   );
//   const DetailRowArray = ({ label, values }: { label: string; values: string[] }) => (
//     <div className="grid grid-cols-3 gap-2">
//       <div className="font-semibold">{label}:</div>
//       <div className="col-span-2">{values?.join(', ')}</div>
//     </div>
//   );

//   return (
//     <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>UsersAccess Details</DialogTitle>
//         </DialogHeader>
//         {selectedUsersAccess && (
//           <ScrollArea className="h-[400px] w-full rounded-md border p-4">
//             <div className="w-full flex flex-col">
//               <div className="grid gap-2">
//                 <DetailRow label="Name" value={selectedUsersAccess.name as string} />
//                 <DetailRow label="Email" value={selectedUsersAccess.email as string} />
//                 <DetailRow label="Pass Code" value={selectedUsersAccess.passCode as string} />
//                 <DetailRow label="Alias" value={selectedUsersAccess.alias as string} />
//                 <DetailRow
//                   label="Role"
//                   value={
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         selectedUsersAccess.role === 'admin'
//                           ? 'bg-amber-100 text-amber-700'
//                           : selectedUsersAccess.role === 'moderator'
//                           ? 'bg-blue-100 text-blue-700'
//                           : 'bg-green-100 text-green-700'
//                       }`}
//                     >
//                       {selectedUsersAccess.role as string}
//                     </span>
//                   }
//                 />
//                 <DetailRowArray label="Data Array" values={selectedUsersAccess.dataArr as string[]} />
//                 <DetailRow label="Created At" value={formatDate(selectedUsersAccess.createdAt)} />
//                 <DetailRow label="Updated At" value={formatDate(selectedUsersAccess.updatedAt)} />
//               </div>
//               <div className="w-full flex items-center justify-center mt-2 min-h-[10vh]">
//                 {Array.isArray(selectedUsersAccess.images) && selectedUsersAccess.images?.length > 0 ? (
//                   <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-1">
//                     {selectedUsersAccess.images.map((i: string, index: number) => (
//                       <div
//                         key={index + i}
//                         className={`relative w-full h-[150px] border-1 border-slate-300 shadow-xl hover:shadow-2xl cursor-pointer hover:border-slate-600 flex items-center justify-center rounded-lg overflow-hidden`}
//                       >
//                         <Image src={i} fill alt="Media" objectFit="cover" />
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="flex flex-col w-full items-center justify-center">
//                     <p>Ops! there is no Image</p>
//                   </div>
//                 )}
//               </div>
//               <div className="w-full m-2" />
//               <ViewRichText data={selectedUsersAccess.descriptions || ''} />
//             </div>
//           </ScrollArea>
//         )}
//         <DialogFooter>
//           <Button
//             className="cursor-pointer border-1 border-slate-400 hover:border-slate-500"
//             onClick={() => {
//               toggleViewModal(false);
//               setSelectedUsersAccess({
//                 ...baseIUsers_access,
//               } as IUsers_access);
//             }}
//           >
//             Close
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ViewNextComponents;

/*
|-----------------------------------------
| setting up View for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, August, 2025
|-----------------------------------------
*/
const View = () => {
  return <main>View</main>;
};
export default View;
