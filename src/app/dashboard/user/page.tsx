'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Trash2, Edit3, Plus } from 'lucide-react';

type User = {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
};

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Name and Email are required');
      return;
    }

    try {
      const res = await fetch(`/api/user${isEditing ? `?id=${formData._id}` : ''}`, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to save user');
      await fetchUsers();
      setFormData({});
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/user?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      await fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (user: User) => {
    setFormData(user);
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Form Card */}
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-xl font-semibold text-white">
              {isEditing ? 'Edit User' : 'Add New User'}
              {isEditing && (
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => {
                    setFormData({});
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-200">Name</label>
                <Input
                  className="bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter name"
                  value={formData.name ?? ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-200">Email</label>
                <Input
                  className="bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter email"
                  type="email"
                  value={formData.email ?? ''}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-200">Email Verified:</label>
                <input
                  type="checkbox"
                  checked={formData.emailVerified ?? false}
                  onChange={e => setFormData({ ...formData, emailVerified: e.target.checked })}
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-all duration-300">
                {isEditing ? (
                  <>
                    <Edit3 className="w-4 h-4 mr-2" /> Update User
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" /> Create User
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* User List */}
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center justify-between">
              All Users
              <Button onClick={fetchUsers} variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin w-8 h-8 text-white" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-center text-gray-300 py-6">No users found</p>
            ) : (
              // ✅ Responsive horizontal scroll wrapper
              <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
                <table className="min-w-full text-sm border-collapse">
                  <thead className="bg-white/20 text-gray-200 uppercase text-xs">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3 hidden sm:table-cell">Verified</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id} className="border-t border-white/10 hover:bg-white/10 transition">
                        <td className="p-3">{user.name}</td>
                        <td className="p-3 break-all max-w-[220px] truncate">{user.email}</td>
                        <td className="p-3 hidden sm:table-cell">{user.emailVerified ? '✅' : '❌'}</td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-blue-500/20 border border-blue-300/30 hover:bg-blue-500/40 text-white"
                              onClick={() => handleEdit(user)}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="bg-red-500/30 hover:bg-red-500/50 border border-red-300/30 text-white"
                              onClick={() => handleDelete(user._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
