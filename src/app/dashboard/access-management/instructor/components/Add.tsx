/*
|-----------------------------------------
| setting up Add Component for User Access
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { useState, useEffect } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LoadingComponent from '@/components/common/Loading';

import { useUsersAccessStore } from '../store/Store';
import { useAddUsers_instructor_accessMutation } from '../redux/rtk-Api';
import { handleError, handleSuccess } from './utils';

// Define the structure of a user from the search API
interface GAuthUser {
  _id: string;
  name: string;
  email: string;
  userRole: string[];
}

const AddUserFromSearch: React.FC = () => {
  const { isAddModalOpen, toggleAddModal } = useUsersAccessStore();
  const [addUserAccess, { isLoading: isAdding }] = useAddUsers_instructor_accessMutation();

  // Local state for the search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GAuthUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedEmails, setAddedEmails] = useState<string[]>([]);

  // 3. Debounced search effect
  useEffect(() => {
    // Clear previous results and errors when query changes
    setSearchResults([]);
    setError(null);

    // Only search if the query has at least 3 characters
    if (searchQuery.length < 3) {
      return;
    }

    const handler = setTimeout(() => {
      const fetchUsers = async () => {
        setIsLoading(true);
        try {
          // 1. Fetch data from the user API
          const response = await fetch(`http://localhost:3000/dashboard/users/all/api/v1?q=${searchQuery}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const result = await response.json();
          // 2. The JSON response has a `data.gAuthUsers` array
          setSearchResults(result.data.gAuthUsers || []);
        } catch (err) {
          setError('Failed to fetch users. Please try again.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUsers();
    }, 500); // 500ms debounce delay

    // Cleanup function to cancel the timeout if the user keeps typing
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // 6. Handle the "Add" button click for a user
  const handleAddUser = async (user: GAuthUser) => {
    console.log(' user ', user);
    try {
      const payload = {
        email: user.email,
        name: user.name,
        role: 'instructor', // Default role is 'instructor'
      };
      await addUserAccess(payload).unwrap();

      // Add email to the list of successfully added users for UI feedback
      setAddedEmails(prev => [...prev, user.email]);
      handleSuccess(`User '${user.name}' added successfully.`);
    } catch (err) {
      console.error('Failed to add user access:', err);
      // The error message from RTK might contain useful info (e.g., "email already exists")
      const errorMessage = `Failed to add ${user.name}.`;
      handleError(errorMessage);
    }
  };

  // Reset local state when the modal is closed
  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setError(null);
      setAddedEmails([]);
    }
    toggleAddModal(isOpen);
  };

  return (
    <Dialog open={isAddModalOpen} onOpenChange={handleModalOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add User Access</DialogTitle>
          <p className="text-sm text-slate-500">Search for users by name or email and add them to the access list.</p>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* 3. Search bar */}
          <Input
            id="search-user"
            placeholder="Type at least 3 characters to search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoFocus
          />

          <ScrollArea className="h-72 w-full rounded-md border">
            <div className="p-4">
              {/* 4. Display search results */}
              {isLoading && <LoadingComponent />}
              {error && <p className="text-center text-red-500">{error}</p>}

              {!isLoading && !error && searchResults.length > 0 && (
                <ul className="space-y-2">
                  {searchResults.map(user => (
                    <li key={user._id} className="flex items-center justify-between p-2 rounded hover:bg-slate-100">
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                      {/* 5. Add button for each user */}
                      <Button
                        size="sm"
                        variant={addedEmails.includes(user.email) ? 'outline' : 'default'}
                        onClick={() => handleAddUser(user)}
                        disabled={isAdding || addedEmails.includes(user.email)}
                      >
                        {addedEmails.includes(user.email) ? 'Added' : 'Add'}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              {!isLoading && searchQuery.length >= 3 && searchResults.length === 0 && <p className="text-center text-slate-500">No users found.</p>}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          {/* 7. Cancel button to close the modal */}
          <Button variant="outline" onClick={() => toggleAddModal(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserFromSearch;
