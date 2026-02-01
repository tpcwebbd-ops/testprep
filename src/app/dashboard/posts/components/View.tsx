'use client';

import Image from 'next/image';
import React, { useEffect } from 'react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StringArrayData } from './others-field-type/types';
import { logger } from 'better-auth';
import { formatDuplicateKeyError, isApiErrorResponse } from '@/components/common/utils';

import { IPosts, defaultPosts } from '../store/data/data';
import { usePostsStore } from '../store/store';
import { useGetPostsByIdQuery } from '@/redux/features/posts/postsSlice';

type Primitive = string | number | boolean | null | undefined;
type Arrayish = Array<string | number | boolean>;
type JSONLike =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, unknown>
  | StringArrayData[];

const ViewNextComponents: React.FC = () => {
  const { selectedPosts, isViewModalOpen, toggleViewModal, setSelectedPosts } = usePostsStore();

  const { data: postData, refetch } = useGetPostsByIdQuery(
    selectedPosts?._id,
    { skip: !selectedPosts?._id }
  );

  useEffect(() => {
    if (selectedPosts?._id) refetch();
  }, [selectedPosts?._id, refetch]);

  useEffect(() => {
    if (postData?.data) setSelectedPosts(postData.data as IPosts);
  }, [postData, setSelectedPosts]);

  const formatDate = (d?: string | Date): string => {
    if (!d) return 'N/A';
    try {
      return format(new Date(d), 'MMM dd, yyyy');
    } catch (error: unknown) {
      let errMessage: string = 'Invalid Date';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message) || 'API error';
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      logger.error(JSON.stringify(errMessage));
      return 'Invalid';
    }
  };

  const formatBoolean = (v?: boolean): string => (v ? 'Yes' : 'No');

  const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/10">
      <span className="text-sm text-white/80">{label}</span>
      <span className="col-span-2 text-sm text-white">{(value ?? 'N/A') as Primitive}</span>
    </div>
  );

  const DetailRowArray: React.FC<{ label: string; values?: Arrayish | null }> = ({ label, values }) => (
    <DetailRow label={label} value={values?.join(', ') || 'N/A'} />
  );

  const DetailRowJson: React.FC<{ label: string; value?: JSONLike }> = ({ label, value }) => (
    <div className="py-2 border-b border-white/10">
      <div className="text-sm text-white/80">{label}</div>
      <pre className="text-[11px] text-white/90 bg-white/5 rounded-md p-2 mt-1 overflow-auto">{value ? JSON.stringify(value, null, 2) : 'N/A'}</pre>
    </div>
  );

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent className="sm:max-w-2xl mt-8 rounded-xl bg-white/10 backdrop-blur-2xl border border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="bg-clip-text text-transparent bg-linear-to-r from-white to-blue-200">
            Posts Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[520px] rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-4 mt-3">
          {selectedPosts && (
            <>
              <DetailRow label="Title" value={selectedPosts['title']} />
              <DetailRow label="Email" value={selectedPosts['email']} />
              <DetailRow label="Author Email" value={selectedPosts['author-email']} />
              <DetailRow label="Password" value={selectedPosts['password']} />
              <DetailRow label="Passcode" value={selectedPosts['passcode']} />
              <DetailRow label="Area" value={selectedPosts['area']} />
              <DetailRowArray label="Sub Area" values={selectedPosts['sub-area']} />
              
              
              <DetailRow label="Description" value={selectedPosts['description']} />
              <DetailRow label="Age" value={selectedPosts['age']} />
              <DetailRow label="Amount" value={selectedPosts['amount']} />
              <DetailRow label="IsActive" value={formatBoolean(selectedPosts['isActive'])} />
              <DetailRow label="Start Date" value={formatDate(selectedPosts['start-date'])} />
              <DetailRow label="Start Time" value={selectedPosts['start-time']} />
              <DetailRow label="Schedule Date" value={`${formatDate(selectedPosts['schedule-date']?.from)} - ${formatDate(selectedPosts['schedule-date']?.to)}`} />
              <DetailRow label="Schedule Time" value={`${selectedPosts['schedule-time']?.start || 'N/A'} - ${selectedPosts['schedule-time']?.end || 'N/A'}`} />
              <DetailRow
              label="Favorite Color"
              value={
                <div className="flex items-center gap-2">
                  <span>{selectedPosts['favorite-color']}</span>
                  <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: selectedPosts['favorite-color'] }} />
                </div>
              }
            />
              <DetailRow label="Number" value={selectedPosts['number']} />
              <DetailRow label="Profile" value={selectedPosts['profile']} />
              <DetailRow label="Test" value={selectedPosts['test']} />
              <DetailRow label="Info" value={selectedPosts['info']} />
              <DetailRow label="Shift" value={selectedPosts['shift']} />
              <DetailRow label="Policy" value={formatBoolean(selectedPosts['policy'])} />
              <DetailRowArray label="Hobbies" values={selectedPosts['hobbies']} />
              <DetailRowArray label="Ideas" values={selectedPosts['ideas']} />
              <DetailRowJson label="Students" value={selectedPosts['students']} />
              <DetailRowJson label="ComplexValue" value={selectedPosts['complexValue']} />
              <DetailRow label="Created At" value={formatDate(selectedPosts.createdAt)} />
              <DetailRow label="Updated At" value={formatDate(selectedPosts.updatedAt)} />
              







          <div className="mt-6">
            <h3 className="text-white font-medium mb-2">Products Images</h3>
            {Array.isArray(selectedPosts['products-images']) && selectedPosts['products-images'].length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {selectedPosts['products-images'].map((val: { url: string; name: string }, i: number) => (
                  <div key={i} className="relative h-32 rounded-lg overflow-hidden border border-white/20 bg-white/10 backdrop-blur-lg">
                    <Image src={val.url} fill className="object-cover" alt={val.name || `Products Images ${i + 1}`} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/70 text-sm">No images.</p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-white font-medium mb-2">Personal Image</h3>
            {selectedPosts['personal-image'] ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/20 bg-white/10 backdrop-blur-lg">
                <Image src={selectedPosts['personal-image'].url} fill className="object-cover" alt="Personal Image" />
              </div>
            ) : (
              <p className="text-white/70 text-sm">No image.</p>
            )}
          </div>



















            </>
          )}
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button
            variant="outlineWater"
            onClick={() => {
              toggleViewModal(false);
              setSelectedPosts(defaultPosts as IPosts);
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
