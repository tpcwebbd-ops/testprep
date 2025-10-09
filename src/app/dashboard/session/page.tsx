'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';

type Session = {
  _id: string;
  token: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

type User = {
  _id: string;
  email: string;
  name?: string;
};

export default function SessionPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/session');
      const data: Session[] = await res.json();
      setSessions(data);

      // Extract unique user IDs
      const uniqueUserIds = Array.from(new Set(data.map(s => s.userId)));

      // Fetch user emails in parallel
      const userPromises = uniqueUserIds.map(async (id): Promise<{ id: string; email: string } | null> => {
        try {
          const userRes = await fetch(`/api/user?id=${id}`);
          if (!userRes.ok) return null;
          const userData: User = await userRes.json();
          return { id, email: userData.email };
        } catch {
          return null;
        }
      });

      const users = await Promise.all(userPromises);

      const userMapObj: Record<string, string> = {};
      users.forEach(u => {
        if (u && typeof u.id === 'string') {
          userMapObj[u.id] = u.email;
        }
      });

      setUserMap(userMapObj);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // ✅ Delete session
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    try {
      const res = await fetch(`/api/session?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete session');
      await fetchSessions();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-lg text-white">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-semibold tracking-wide">Session Management</CardTitle>
          <div className="flex gap-2 mt-3 sm:mt-0">
            <Button onClick={fetchSessions} variant="outline" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30">
              <RefreshCcw className="w-4 h-4" /> Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Table */}
      <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-lg text-white overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin w-8 h-8 text-white" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-center text-gray-300 py-6">No sessions found</p>
          ) : (
            <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
              <table className="min-w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-white/20 text-left text-gray-200 uppercase text-xs">
                    <th className="p-3">Token</th>
                    <th className="p-3">User Email</th>
                    <th className="p-3 hidden md:table-cell">IP Address</th>
                    <th className="p-3 hidden md:table-cell">User Agent</th>
                    <th className="p-3">Expires At</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map(session => (
                    <tr key={session._id} className="border-t border-white/10 hover:bg-white/10 transition">
                      <td className="p-3 break-all max-w-[160px] truncate">{session.token}</td>
                      <td className="p-3">{userMap[session.userId] ?? 'Loading...'}</td>
                      <td className="p-3 hidden md:table-cell">{session.ipAddress}</td>
                      <td className="p-3 hidden md:table-cell max-w-[240px] truncate">{session.userAgent}</td>
                      <td className="p-3">{format(new Date(session.expiresAt), 'yyyy-MM-dd HH:mm')}</td>
                      <td className="p-3">
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(session._id)} className="flex items-center gap-1">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
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
  );
}
