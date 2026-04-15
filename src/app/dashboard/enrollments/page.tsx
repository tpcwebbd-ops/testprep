'use client';

import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CheckSquare,
  Square,
  Check,
  X,
  CreditCard,
  User,
  Mail,
  DollarSign,
  Tag,
  Calendar,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Loader2,
  BookOpen,
  Layers,
} from 'lucide-react';
import {
  useGetEnrollmentsQuery,
  useAddEnrollmentMutation,
  useUpdateEnrollmentMutation,
  useDeleteEnrollmentMutation,
  useBulkUpdateEnrollmentsMutation,
  useBulkDeleteEnrollmentsMutation,
} from '@/redux/features/enrollments/enrollmentsSlice';

interface Enrollment {
  _id: string;
  studentName: string;
  studentEmail: string;
  studentsStatus: 'blocked' | 'pending' | 'complete' | 'running';
  enrollmentDate: string;
  enrollCoursesIDS: string[];
  realPrice: number;
  discountPrice: number;
  paymentAmount: number;
  paymentMethod: string;
  couponCode: string | null;
  checkedbyEmail: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
}

type SortKey = 'enrollmentDate' | 'paymentAmount' | 'paymentMethod' | 'paymentStatus';

interface SortConfig {
  key: SortKey;
  direction: 'asc' | 'desc';
}

const Page = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'enrollmentDate', direction: 'desc' });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<Partial<Enrollment> | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [enrollmentToDelete, setEnrollmentToDelete] = useState<string | null>(null);

  const lastExecuted = useRef<number>(Date.now());
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const { data, isLoading, isFetching, error, refetch } = useGetEnrollmentsQuery({ page, limit, q: debouncedSearch });

  const [addEnrollment, { isLoading: isAdding }] = useAddEnrollmentMutation();
  const [updateEnrollment, { isLoading: isUpdating }] = useUpdateEnrollmentMutation();
  const [deleteEnrollment, { isLoading: isDeleting }] = useDeleteEnrollmentMutation();
  const [bulkUpdate, { isLoading: isBulkUpdating }] = useBulkUpdateEnrollmentsMutation();
  const [bulkDelete, { isLoading: isBulkDeleting }] = useBulkDeleteEnrollmentsMutation();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);

    if (val.length >= 3 || val.length === 0) {
      const now = Date.now();
      if (now - lastExecuted.current >= 5000) {
        setDebouncedSearch(val);
        lastExecuted.current = now;
      } else {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(
          () => {
            setDebouncedSearch(val);
            lastExecuted.current = Date.now();
          },
          5000 - (now - lastExecuted.current),
        );
      }
    }
  };

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const enrollments: Enrollment[] = useMemo(() => {
    if (!data?.data?.enrollments) return [];
    const arr = [...data.data.enrollments];
    arr.sort((a, b) => {
      let aVal: string | number = a[sortConfig.key];
      let bVal: string | number = b[sortConfig.key];
      if (sortConfig.key === 'enrollmentDate') {
        aVal = new Date(aVal as string).getTime();
        bVal = new Date(bVal as string).getTime();
      }
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [data, sortConfig]);

  const stats = useMemo(() => {
    if (!data?.data?.enrollments) return { month: 0, week: 0, total: 0 };
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7));

    const monthCount = data.data.enrollments.filter((e: Enrollment) => new Date(e.enrollmentDate) >= thirtyDaysAgo).length;
    const weekCount = data.data.enrollments.filter((e: Enrollment) => new Date(e.enrollmentDate) >= sevenDaysAgo).length;

    return {
      month: monthCount,
      week: weekCount,
      total: data.data.total || 0,
    };
  }, [data]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === enrollments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(enrollments.map(e => e._id));
    }
  };

  const confirmDelete = async () => {
    if (!enrollmentToDelete) return;
    try {
      await deleteEnrollment({ id: enrollmentToDelete }).unwrap();
      toast.success('Enrollment deleted successfully');
      setSelectedIds(prev => prev.filter(i => i !== enrollmentToDelete));
      setIsDeleteDialogOpen(false);
      setEnrollmentToDelete(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to delete enrollment');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDelete({ ids: selectedIds }).unwrap();
      toast.success('Selected enrollments deleted successfully');
      setSelectedIds([]);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to delete selected enrollments');
    }
  };

  const handleSaveEnrollment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      studentName: formData.get('studentName') as string,
      studentEmail: formData.get('studentEmail') as string,
      paymentAmount: Number(formData.get('paymentAmount')),
      paymentMethod: formData.get('paymentMethod') as string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      paymentStatus: formData.get('paymentStatus') as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      studentsStatus: formData.get('studentsStatus') as any,
    };

    try {
      if (editingEnrollment?._id) {
        await updateEnrollment({ id: editingEnrollment._id, ...payload }).unwrap();
        toast.success('Enrollment updated successfully');
      } else {
        await addEnrollment(payload).unwrap();
        toast.success('Enrollment created successfully');
      }
      setIsModalOpen(false);
      setEditingEnrollment(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error(`Failed to ${editingEnrollment ? 'update' : 'create'} enrollment`);
    }
  };

  const handleBulkUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      ids: selectedIds,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      paymentStatus: formData.get('paymentStatus') as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      studentsStatus: formData.get('studentsStatus') as any,
    };
    try {
      await bulkUpdate(payload).unwrap();
      toast.success('Enrollments updated successfully');
      setIsBulkModalOpen(false);
      setSelectedIds([]);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to update enrollments');
    }
  };

  const statusColors = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
    refunded: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    blocked: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    complete: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    running: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 pt-[90px] pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/30 blur-3xl rounded-full animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl">
                <BookOpen className="h-10 w-10 text-white animate-pulse" />
              </div>
            </div>
            <div className="text-white text-xl font-semibold mt-4 flex items-center gap-2">
              <Loader2 className="animate-spin h-5 w-5" /> Loading enrollments...
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 pt-[90px] pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 max-w-md">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/30 blur-3xl rounded-full" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-2xl">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Failed to Load Enrollments</h2>
              <p className="text-slate-400 text-sm">We encountered an error while fetching the enrollment data.</p>
            </div>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all"
            >
              <RefreshCw className="h-4 w-4" /> Retry Connection
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  const isSaving = isAdding || isUpdating;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 pt-[90px] pb-20 px-4 md:px-8 font-sans overflow-hidden relative">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              Enrollments
            </h1>
            <p className="text-emerald-100/60 mt-2 text-sm md:text-base">Manage and track student registrations effortlessly.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
            <button
              onClick={() => refetch()}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all flex items-center justify-center"
            >
              <RefreshCw className={`h-5 w-5 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => {
                setEditingEnrollment(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition-all font-semibold border-none"
            >
              <Plus size={20} />
              <span>New Enrollment</span>
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Last 30 Days', value: stats.month, icon: Calendar, color: 'from-emerald-500/20 to-teal-500/20', text: 'text-emerald-400' },
            { label: 'Last 7 Days', value: stats.week, icon: Tag, color: 'from-cyan-500/20 to-blue-500/20', text: 'text-cyan-400' },
            { label: 'Total Enrollments', value: stats.total, icon: User, color: 'from-violet-500/20 to-fuchsia-500/20', text: 'text-violet-400' },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`relative overflow-hidden rounded-3xl p-6 shadow-xl backdrop-blur-xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/30 group`}
            >
              <div className={`absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform duration-500 ${stat.text}`}>
                <stat.icon size={80} />
              </div>
              <p className="text-slate-400 font-medium mb-2">{stat.label}</p>
              <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-5xl font-bold tracking-tight ${stat.text}`}>
                {stat.value}
              </motion.h3>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              />
            </motion.div>
          ))}
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative">
          <div className="p-6 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-950/40">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-slate-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search by name, email or coupon..."
                value={search}
                onChange={handleSearch}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none bg-slate-950 text-white placeholder:text-slate-500"
              />
            </div>

            <AnimatePresence>
              {selectedIds.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 20 }}
                  className="flex items-center gap-3 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20"
                >
                  <span className="text-sm font-semibold text-emerald-400 whitespace-nowrap">{selectedIds.length} selected</span>
                  <div className="h-6 w-px bg-emerald-500/20 mx-2" />
                  <button
                    onClick={() => setIsBulkModalOpen(true)}
                    className="text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-all"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    disabled={isBulkDeleting}
                    className="text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-all flex items-center gap-2"
                  >
                    {isBulkDeleting ? <Loader2 className="animate-spin h-4 w-4" /> : null}
                    Delete Selected
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden md:block overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-950/50 border-b border-white/10">
                <tr>
                  <th className="p-4 w-16 text-center">
                    <button onClick={toggleSelectAll} className="text-slate-500 hover:text-emerald-400 transition-colors">
                      {selectedIds.length === enrollments.length && enrollments.length > 0 ? (
                        <CheckSquare size={20} className="text-emerald-400" />
                      ) : (
                        <Square size={20} />
                      )}
                    </button>
                  </th>
                  <th className="p-4 font-semibold text-slate-300 text-sm">Student</th>
                  <th className="p-4 font-semibold text-slate-300 text-sm">
                    <button onClick={() => handleSort('enrollmentDate')} className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                      Date <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="p-4 font-semibold text-slate-300 text-sm">
                    <button onClick={() => handleSort('paymentAmount')} className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                      Amount <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="p-4 font-semibold text-slate-300 text-sm">
                    <button onClick={() => handleSort('paymentMethod')} className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                      Method <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="p-4 font-semibold text-slate-300 text-sm">
                    <button onClick={() => handleSort('paymentStatus')} className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                      Status <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="p-4 font-semibold text-slate-300 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {enrollments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-16 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                            <AlertCircle size={32} className="text-slate-400" />
                          </div>
                          <p className="text-lg font-medium text-slate-400">No enrollments found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    enrollments.map(enrollment => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={enrollment._id}
                        className="border-b border-white/5 hover:bg-slate-800/40 transition-colors group"
                      >
                        <td className="p-4 text-center">
                          <button onClick={() => toggleSelect(enrollment._id)} className="text-slate-500 hover:text-emerald-400 transition-colors">
                            {selectedIds.includes(enrollment._id) ? <CheckSquare size={20} className="text-emerald-400" /> : <Square size={20} />}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-white">{enrollment.studentName}</div>
                          <div className="text-sm text-slate-400">{enrollment.studentEmail}</div>
                          <span
                            className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[enrollment.studentsStatus]}`}
                          >
                            {enrollment.studentsStatus}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-400">{new Date(enrollment.enrollmentDate).toLocaleDateString()}</td>
                        <td className="p-4 text-sm font-semibold text-emerald-400">${enrollment.paymentAmount}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm text-slate-400 capitalize bg-slate-950 px-3 py-1.5 rounded-lg border border-white/5 w-fit">
                            <CreditCard size={14} className="text-slate-500" />
                            {enrollment.paymentMethod || 'N/A'}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[enrollment.paymentStatus]}`}>
                            {enrollment.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingEnrollment(enrollment);
                                setIsModalOpen(true);
                              }}
                              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all border border-transparent hover:border-blue-500/20"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setEnrollmentToDelete(enrollment._id);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
            <AnimatePresence>
              {enrollments.map(enrollment => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={enrollment._id}
                  className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 shadow-sm relative"
                >
                  <div className="absolute top-4 right-4">
                    <button onClick={() => toggleSelect(enrollment._id)} className="text-slate-500">
                      {selectedIds.includes(enrollment._id) ? <CheckSquare size={24} className="text-emerald-400" /> : <Square size={24} />}
                    </button>
                  </div>
                  <div className="mb-4 pr-10">
                    <h3 className="font-bold text-white text-lg">{enrollment.studentName}</h3>
                    <p className="text-slate-400 text-sm">{enrollment.studentEmail}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Date</p>
                      <p className="text-sm font-medium text-slate-300">{new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Amount</p>
                      <p className="text-sm font-bold text-emerald-400">${enrollment.paymentAmount}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${statusColors[enrollment.paymentStatus]}`}>
                      {enrollment.paymentStatus}
                    </span>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${statusColors[enrollment.studentsStatus]}`}>
                      {enrollment.studentsStatus}
                    </span>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => {
                        setEditingEnrollment(enrollment);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        setEnrollmentToDelete(enrollment._id);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-4 border-t border-white/10 bg-slate-950/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-slate-400 font-medium">
              Showing page <span className="text-white font-bold">{page}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={enrollments.length < limit}
                className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {editingEnrollment ? <Edit2 className="h-5 w-5 text-blue-400" /> : <Plus className="h-5 w-5 text-emerald-400" />}
                  {editingEnrollment ? 'Edit Enrollment' : 'New Enrollment'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSaveEnrollment} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-300">
                      Student Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        required
                        name="studentName"
                        defaultValue={editingEnrollment?.studentName}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder:text-slate-600 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-300">
                      Student Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        required
                        type="email"
                        name="studentEmail"
                        defaultValue={editingEnrollment?.studentEmail}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder:text-slate-600 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">
                      Amount <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        required
                        type="number"
                        name="paymentAmount"
                        defaultValue={editingEnrollment?.paymentAmount}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder:text-slate-600 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">
                      Payment Method <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        required
                        name="paymentMethod"
                        defaultValue={editingEnrollment?.paymentMethod}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder:text-slate-600 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        placeholder="e.g. Card, PayPal"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">Payment Status</label>
                    <select
                      name="paymentStatus"
                      defaultValue={editingEnrollment?.paymentStatus || 'pending'}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">Student Status</label>
                    <select
                      name="studentsStatus"
                      defaultValue={editingEnrollment?.studentsStatus || 'pending'}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="running">Running</option>
                      <option value="complete">Complete</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-end gap-3 mt-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`px-8 py-3 rounded-xl font-semibold text-white shadow-lg flex items-center gap-2 transition-all ${
                      editingEnrollment ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                    }`}
                  >
                    {isSaving && <Loader2 className="animate-spin h-4 w-4" />}
                    {isSaving ? 'Processing...' : 'Save Enrollment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBulkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsBulkModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layers className="h-5 w-5 text-emerald-400" />
                  Bulk Update
                </h2>
                <button
                  onClick={() => setIsBulkModalOpen(false)}
                  className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleBulkUpdate} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Payment Status</label>
                  <select
                    name="paymentStatus"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Student Status</label>
                  <select
                    name="studentsStatus"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="running">Running</option>
                    <option value="complete">Complete</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-end gap-3 mt-auto">
                  <button
                    type="button"
                    onClick={() => setIsBulkModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isBulkUpdating}
                    className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    {isBulkUpdating ? <Loader2 className="animate-spin h-4 w-4" /> : <Check size={18} />}
                    {isBulkUpdating ? 'Updating...' : 'Apply'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteDialogOpen && enrollmentToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsDeleteDialogOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-slate-900 border border-red-500/20 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-red-500/5">
                <div className="flex items-center gap-3 text-red-400">
                  <div className="p-2 bg-red-500/10 rounded-full">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold">Delete Enrollment</h2>
                </div>
                <button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                  <Trash2 className="h-8 w-8 text-red-400" />
                </div>
                <p className="text-slate-300 text-lg">Are you absolutely sure you want to delete this enrollment?</p>
                <p className="text-sm text-slate-500">This action is permanent and cannot be undone.</p>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 className="animate-spin h-4 w-4" /> : null}
                  {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;
