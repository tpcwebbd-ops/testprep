'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useAccessManagementsStore } from '../store/store';
import { useAddAccessManagementsMutation } from '@/redux/features/accessManagements/accessManagementsSlice';
import { useGetUsersQuery } from '@/redux/features/user/userSlice';
import { IAccessManagements, defaultAccessManagements } from '../store/data/data';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';
import { authClient } from '@/lib/auth-client';

// 🕒 Debounce helper
function useDebounce<T>(value: T, delay = 1000): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const AddNextComponents: React.FC = () => {
  const { toggleAddModal, isAddModalOpen, setAccessManagements } = useAccessManagementsStore();
  const [addAccessManagements, { isLoading: isAdding }] = useAddAccessManagementsMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 1000);

  // pagination & query setup
  const queryPramsPage = 1;
  const queryPramsLimit = 10;
  const queryPramsQ = debouncedSearch.length >= 3 ? debouncedSearch : '';

  const {
    data: getResponseData,
    isLoading: isFetching,
    isError,
  } = useGetUsersQuery({ q: queryPramsQ, limit: queryPramsLimit, page: queryPramsPage }, { skip: debouncedSearch.length < 3 });

  const users = getResponseData?.data?.users ?? [];
  const sessionEmail = authClient.useSession().data?.user.email || '';

  // Handle Add
  const handleAddAccessManagement = async (user: { _id: string; name: string; email: string }) => {
    try {
      const payload: IAccessManagements = {
        ...defaultAccessManagements,
        user_name: user.name,
        user_email: user.email,
        given_by_email: sessionEmail,
      };
      delete payload._id;
      const addedAccessManagement = await addAccessManagements(payload).unwrap();
      setAccessManagements([addedAccessManagement]);
      handleSuccess(`Access granted to ${user.name}`);
      toggleAddModal(false);
    } catch (error: unknown) {
      console.error('Failed to add record:', error);
      let errMessage = 'An unknown error occurred.';
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
      <DialogContent
        className="sm:max-w-[600px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl 
                   rounded-2xl text-white transition-all duration-300"
      >
        <DialogHeader className="border-b border-white/10 pb-3">
          <DialogTitle className="text-lg font-semibold tracking-wide text-white/90">Add Access for User</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* 🔍 Search bar */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="search" className="text-white/70 text-sm font-medium">
              Search User
            </Label>
            <Input
              id="search"
              placeholder="Type at least 3 characters..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-white/10 border border-white/20 placeholder:text-white/40 text-white 
                         rounded-xl focus-visible:ring-0 focus:border-white/40 backdrop-blur-md"
            />
          </div>

          {/* 👥 User list */}
          <ScrollArea className="h-[400px] rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-inner p-3">
            {isFetching ? (
              <p className="text-center text-sm text-white/60">Loading users...</p>
            ) : isError ? (
              <p className="text-center text-sm text-red-400">Failed to fetch users.</p>
            ) : users.length === 0 ? (
              <p className="text-center text-sm text-white/50">No users found.</p>
            ) : (
              <div className="space-y-2">
                {users.map((user: { _id: string; name: string; email: string }) => (
                  <div
                    key={user._id}
                    className="flex justify-between items-center p-3 rounded-xl border border-white/10 
                               bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-200 shadow-sm"
                  >
                    <div>
                      <p className="font-medium text-white/90">{user.name}</p>
                      <p className="text-xs text-purple-50 ">{user.email}</p>
                    </div>
                    <Button size="sm" variant="outlineWater" disabled={isAdding} onClick={() => handleAddAccessManagement(user)}>
                      {isAdding ? 'Adding...' : 'Add'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="mt-4 border-t border-white/10 pt-3">
          <Button variant="outlineWater" onClick={() => toggleAddModal(false)} className="border-white/30 text-white/80 hover:bg-white/20">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNextComponents;
