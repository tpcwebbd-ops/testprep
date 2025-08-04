/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import Image from 'next/image';
import { format } from 'date-fns';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { IUsers_1_000___ } from '../api/v1/Model';
import { useUsers_1_000___Store } from '../store/Store';
import { baseIUsers_1_000___ } from '../store/StoreConstants';
import { useGetUsers_1_000___ByIdQuery } from '../redux/rtk-Api';

import { ViewRichText } from './view-rich-text/ViewRichText';

const ViewNextComponents: React.FC = () => {
  const { isViewModalOpen, selectedUsers_1_000___, toggleViewModal, setSelectedUsers_1_000___ } = useUsers_1_000___Store();
  const { data: Users_1_000___Data, refetch } = useGetUsers_1_000___ByIdQuery(selectedUsers_1_000___?._id, { skip: !selectedUsers_1_000___?._id });

  useEffect(() => {
    if (selectedUsers_1_000___?._id) {
      refetch(); // Fetch the latest Users_1_000___ data
    }
  }, [selectedUsers_1_000___?._id, refetch]);

  useEffect(() => {
    if (Users_1_000___Data?.data) {
      setSelectedUsers_1_000___(Users_1_000___Data.data); // Update selectedUsers_1_000___ with the latest data
    }
  }, [Users_1_000___Data, setSelectedUsers_1_000___]);

  const formatDate = (date?: Date) => (date ? format(date, 'MMM dd, yyyy') : 'N/A');

  const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="grid grid-cols-3 gap-2">
      <div className="font-semibold">{label}:</div>
      <div className="col-span-2">{value || 'N/A'}</div>
    </div>
  );
  const DetailRowArray = ({ label, values }: { label: string; values: string[] }) => (
    <div className="grid grid-cols-3 gap-2">
      <div className="font-semibold">{label}:</div>
      <div className="col-span-2">{values?.join(', ')}</div>
    </div>
  );

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Users_1_000___ Details</DialogTitle>
        </DialogHeader>
        {selectedUsers_1_000___ && (
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="w-full flex flex-col">
              <div className="grid gap-2">
                <DetailRow label="Name" value={selectedUsers_1_000___.name as string} />
                <DetailRow label="Email" value={selectedUsers_1_000___.email as string} />
                <DetailRow label="Pass Code" value={selectedUsers_1_000___.passCode as string} />
                <DetailRow label="Alias" value={selectedUsers_1_000___.alias as string} />
                <DetailRow
                  label="Role"
                  value={
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedUsers_1_000___.role === 'admin'
                          ? 'bg-amber-100 text-amber-700'
                          : selectedUsers_1_000___.role === 'moderator'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {selectedUsers_1_000___.role as string}
                    </span>
                  }
                />
                <DetailRowArray label="Data Array" values={selectedUsers_1_000___.dataArr as string[]} />
                <DetailRow label="Created At" value={formatDate(selectedUsers_1_000___.createdAt)} />
                <DetailRow label="Updated At" value={formatDate(selectedUsers_1_000___.updatedAt)} />
              </div>
              <div className="w-full flex items-center justify-center mt-2 min-h-[10vh]">
                {Array.isArray(selectedUsers_1_000___.images) && selectedUsers_1_000___.images?.length > 0 ? (
                  <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-1">
                    {selectedUsers_1_000___.images.map((i, index) => (
                      <div
                        key={index + i}
                        className={`relative w-full h-[150px] border-1 border-slate-300 shadow-xl hover:shadow-2xl cursor-pointer hover:border-slate-600 flex items-center justify-center rounded-lg overflow-hidden`}
                      >
                        <Image src={i} fill alt="Media" objectFit="cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col w-full items-center justify-center">
                    <p>Ops! there is no Image</p>
                  </div>
                )}
              </div>
              <div className="w-full m-2" />
              <ViewRichText data={selectedUsers_1_000___.descriptions || ''} />
            </div>
          </ScrollArea>
        )}
        <DialogFooter>
          <Button
            className="cursor-pointer border-1 border-slate-400 hover:border-slate-500"
            onClick={() => {
              toggleViewModal(false);
              setSelectedUsers_1_000___({ ...baseIUsers_1_000___ } as IUsers_1_000___);
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
