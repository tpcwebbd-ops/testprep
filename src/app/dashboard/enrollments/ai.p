look at the enrollments/page.tsx ``` 
'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const lastExecuted = useRef<number>(Date.now());
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const { data, isLoading, isFetching } = useGetEnrollmentsQuery({ page, limit, q: debouncedSearch });
  const [addEnrollment] = useAddEnrollmentMutation();
  const [updateEnrollment] = useUpdateEnrollmentMutation();
  const [deleteEnrollment] = useDeleteEnrollmentMutation();
  const [bulkUpdate] = useBulkUpdateEnrollmentsMutation();
  const [bulkDelete] = useBulkDeleteEnrollmentsMutation();

  console.log('data', data);
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
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
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
  const handleDelete = async (id: string) => {
    await deleteEnrollment({ id });
    setSelectedIds(prev => prev.filter(i => i !== id));
  };
  const handleBulkDelete = async () => {
    await bulkDelete({ ids: selectedIds });
    setSelectedIds([]);
  };
  const handleSaveEnrollment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      studentName: formData.get('studentName'),
      studentEmail: formData.get('studentEmail'),
      paymentAmount: Number(formData.get('paymentAmount')),
      paymentMethod: formData.get('paymentMethod'),
      paymentStatus: formData.get('paymentStatus'),
      studentsStatus: formData.get('studentsStatus'),
    };
    if (editingEnrollment?._id) {
      await updateEnrollment({ id: editingEnrollment._id, ...payload });
    } else {
      await addEnrollment(payload);
    }
    setIsModalOpen(false);
    setEditingEnrollment(null);
  };
  const handleBulkUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      ids: selectedIds,
      paymentStatus: formData.get('paymentStatus'),
      studentsStatus: formData.get('studentsStatus'),
    };
    await bulkUpdate(payload);
    setIsBulkModalOpen(false);
    setSelectedIds([]);
  };
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
    refunded: 'bg-gray-100 text-gray-800 border-gray-200',
    blocked: 'bg-rose-100 text-rose-800 border-rose-200',
    complete: 'bg-blue-100 text-blue-800 border-blue-200',
    running: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  };
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800 overflow-hidden relative">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Enrollments
            </h1>
            <p className="text-slate-500 mt-1">Manage and track student registrations effortlessly.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingEnrollment(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors font-medium"
          >
            <Plus size={20} />
            <span>New Enrollment</span>
          </motion.button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Last 30 Days', value: stats.month, icon: Calendar, color: 'from-blue-500 to-cyan-500' },
            { label: 'Last 7 Days', value: stats.week, icon: Tag, color: 'from-violet-500 to-fuchsia-500' },
            { label: 'Total Enrollments', value: stats.total, icon: User, color: 'from-emerald-500 to-teal-500' },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-xl bg-gradient-to-br ${stat.color}`}
            >
              <div className="absolute top-0 right-0 p-6 opacity-20">
                <stat.icon size={80} />
              </div>
              <p className="text-white/80 font-medium mb-2">{stat.label}</p>
              <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-5xl font-bold tracking-tight">
                {stat.value}
              </motion.h3>
            </motion.div>
          ))}
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-slate-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search by name, email or coupon..."
                value={search}
                onChange={handleSearch}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none bg-white"
              />
              {isFetching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              )}
            </div>

            <AnimatePresence>
              {selectedIds.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100"
                >
                  <span className="text-sm font-semibold text-indigo-700 whitespace-nowrap">{selectedIds.length} selected</span>
                  <div className="h-6 w-px bg-indigo-200 mx-2" />
                  <button
                    onClick={() => setIsBulkModalOpen(true)}
                    className="text-sm font-medium text-indigo-700 hover:text-indigo-800 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Delete Selected
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 w-16 text-center">
                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-indigo-600 transition-colors">
                      {selectedIds.length === enrollments.length && enrollments.length > 0 ? (
                        <CheckSquare size={20} className="text-indigo-600" />
                      ) : (
                        <Square size={20} />
                      )}
                    </button>
                  </th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Student</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">
                    <button onClick={() => handleSort('enrollmentDate')} className="flex items-center gap-2 hover:text-indigo-600">
                      Date <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">
                    <button onClick={() => handleSort('paymentAmount')} className="flex items-center gap-2 hover:text-indigo-600">
                      Amount <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">
                    <button onClick={() => handleSort('paymentMethod')} className="flex items-center gap-2 hover:text-indigo-600">
                      Method <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">
                    <button onClick={() => handleSort('paymentStatus')} className="flex items-center gap-2 hover:text-indigo-600">
                      Status <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="p-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        Loading...
                      </td>
                    </tr>
                  ) : enrollments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-16 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <AlertCircle size={48} className="mb-4 text-slate-300" />
                          <p className="text-lg font-medium text-slate-500">No enrollments found</p>
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
                        className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="p-4 text-center">
                          <button onClick={() => toggleSelect(enrollment._id)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                            {selectedIds.includes(enrollment._id) ? <CheckSquare size={20} className="text-indigo-600" /> : <Square size={20} />}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-slate-900">{enrollment.studentName}</div>
                          <div className="text-sm text-slate-500">{enrollment.studentEmail}</div>
                          <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[enrollment.studentsStatus]}`}>
                            {enrollment.studentsStatus}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-600">{new Date(enrollment.enrollmentDate).toLocaleDateString()}</td>
                        <td className="p-4 text-sm font-semibold text-slate-900">${enrollment.paymentAmount}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600 capitalize">
                            <CreditCard size={16} />
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
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(enrollment._id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
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
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative"
                >
                  <div className="absolute top-4 right-4">
                    <button onClick={() => toggleSelect(enrollment._id)} className="text-slate-400">
                      {selectedIds.includes(enrollment._id) ? <CheckSquare size={24} className="text-indigo-600" /> : <Square size={24} />}
                    </button>
                  </div>
                  <div className="mb-4 pr-10">
                    <h3 className="font-bold text-slate-900 text-lg">{enrollment.studentName}</h3>
                    <p className="text-slate-500 text-sm">{enrollment.studentEmail}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Date</p>
                      <p className="text-sm font-medium text-slate-800">{new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Amount</p>
                      <p className="text-sm font-bold text-slate-900">${enrollment.paymentAmount}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${statusColors[enrollment.paymentStatus]}`}>
                      {enrollment.paymentStatus}
                    </span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${statusColors[enrollment.studentsStatus]}`}>
                      {enrollment.studentsStatus}
                    </span>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setEditingEnrollment(enrollment);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(enrollment._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-rose-600 bg-rose-50 rounded-lg"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-slate-500 font-medium">
              Showing page <span className="text-slate-900 font-bold">{page}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={enrollments.length < limit}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-bold text-slate-800">{editingEnrollment ? 'Edit Enrollment' : 'New Enrollment'}</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSaveEnrollment} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">Student Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        required
                        name="studentName"
                        defaultValue={editingEnrollment?.studentName}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">Student Email</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        required
                        type="email"
                        name="studentEmail"
                        defaultValue={editingEnrollment?.studentEmail}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Amount</label>
                    <div className="relative">
                      <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        required
                        type="number"
                        name="paymentAmount"
                        defaultValue={editingEnrollment?.paymentAmount}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Payment Method</label>
                    <div className="relative">
                      <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        required
                        name="paymentMethod"
                        defaultValue={editingEnrollment?.paymentMethod}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Payment Status</label>
                    <select
                      name="paymentStatus"
                      defaultValue={editingEnrollment?.paymentStatus || 'pending'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Student Status</label>
                    <select
                      name="studentsStatus"
                      defaultValue={editingEnrollment?.studentsStatus || 'pending'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="running">Running</option>
                      <option value="complete">Complete</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                </div>
                <div className="pt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                  >
                    Save Enrollment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBulkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-bold text-slate-800">Bulk Update</h2>
                <button
                  onClick={() => setIsBulkModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleBulkUpdate} className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Payment Status</label>
                  <select
                    name="paymentStatus"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Student Status</label>
                  <select
                    name="studentsStatus"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="running">Running</option>
                    <option value="complete">Complete</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
                <div className="pt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsBulkModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
                  >
                    <Check size={18} /> Apply
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Page;
```
and here is course/page.tsx 
```
'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, BookOpen, Clock, Award, PlayCircle, FileText, AlertTriangle, RefreshCw, X, Layers, Power } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { useGetCoursesQuery, useAddCourseMutation, useUpdateCourseMutation, useDeleteCourseMutation } from '@/redux/features/courses/coursesSlice';

interface ICourse {
  _id: string;
  courseTitle: string;
  courseDescription?: string;
  totalClass?: number;
  totalAssignment?: number;
  totalDuration?: string;
  totalMockTest?: number;
  realPrice?: number;
  discountPrice?: number;
  challengeDay?: number;
  totalLecture?: number;
  isActive?: boolean;
}

const defaultFormData = {
  courseTitle: '',
  courseDescription: '',
  totalClass: 0,
  totalAssignment: 0,
  totalDuration: '',
  totalMockTest: 0,
  realPrice: 0,
  discountPrice: 0,
  challengeDay: 0,
  totalLecture: 0,
  isActive: true,
};

export default function CoursesPage() {
  const { data: coursesData, isLoading, error, refetch } = useGetCoursesQuery({ page: 1, limit: 100 });
  const [addCourse, { isLoading: isAdding }] = useAddCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<ICourse | null>(null);

  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);
  const [courseToToggle, setCourseToToggle] = useState<ICourse | null>(null);

  const [formData, setFormData] = useState(defaultFormData);

  const courses: ICourse[] = coursesData?.data?.courses || [];
  console.log('courses : ', courses);
  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData(defaultFormData);
    setCurrentEditId(null);
    setIsFormDialogOpen(true);
  };

  const handleOpenEditModal = (course: ICourse) => {
    setModalMode('edit');
    setFormData({
      courseTitle: course.courseTitle || '',
      courseDescription: course.courseDescription || '',
      totalClass: course.totalClass || 0,
      totalAssignment: course.totalAssignment || 0,
      totalDuration: course.totalDuration || '',
      totalMockTest: course.totalMockTest || 0,
      realPrice: course.realPrice || 0,
      discountPrice: course.discountPrice || 0,
      challengeDay: course.challengeDay || 0,
      totalLecture: course.totalLecture || 0,
      isActive: course.isActive ?? true,
    });
    setCurrentEditId(course._id);
    setIsFormDialogOpen(true);
  };

  const handleSubmitCourse = async () => {
    if (!formData.courseTitle) {
      toast.error('Course Title is required');
      return;
    }
    console.log('formData : ', formData);
    try {
      if (modalMode === 'add') {
        await addCourse({
          ...formData,
          lectureData: {},
        }).unwrap();
        toast.success('Course created successfully');
      } else if (modalMode === 'edit' && currentEditId) {
        await updateCourse({
          id: currentEditId,
          ...formData,
        }).unwrap();
        toast.success('Course updated successfully');
      }

      setFormData(defaultFormData);
      setIsFormDialogOpen(false);
      setCurrentEditId(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error(`Failed to ${modalMode} course`);
    }
  };

  const initiateToggle = (course: ICourse) => {
    setCourseToToggle(course);
    setIsToggleDialogOpen(true);
  };

  const confirmToggleActive = async () => {
    if (!courseToToggle) return;

    try {
      const isCurrentlyActive = courseToToggle.isActive ?? false;
      const updatedStatus = !isCurrentlyActive;

      await updateCourse({
        id: courseToToggle._id,
        isActive: updatedStatus,
      }).unwrap();

      toast.success(`Course ${updatedStatus ? 'activated' : 'deactivated'} successfully`);
      setIsToggleDialogOpen(false);
      setCourseToToggle(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to update course status');
    }
  };

  const initiateDelete = (course: ICourse) => {
    setCourseToDelete(course);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete?._id) return;

    try {
      await deleteCourse({ id: courseToDelete._id }).unwrap();
      toast.success('Course deleted successfully');
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  const handleManageClasses = (id: string) => {
    window.open(`/dashboard/courses/edit?id=${id}`, '_blank');
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
            <div className="text-white text-xl font-semibold mt-4">Loading courses...</div>
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
              <h2 className="text-2xl font-bold text-white">Failed to Load Courses</h2>
              <p className="text-slate-400 text-sm">We encountered an error while fetching your curriculum.</p>
            </div>
            <Button onClick={() => refetch()} variant="outline" className="gap-2 bg-transparent text-white border-white/20 hover:bg-white/10">
              <RefreshCw className="h-4 w-4" />
              Retry Connection
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  const isSaving = isAdding || isUpdating;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 pt-[90px] pb-20 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              Course Management
            </h1>
            <p className="text-emerald-100/60 mt-2 text-sm md:text-base">Curate and manage your educational content effortlessly.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
            <Button onClick={() => refetch()} size="icon" className="bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleOpenAddModal}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white border-none shadow-lg shadow-emerald-500/25"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </motion.div>
        </div>

        {courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[50vh] border-2 border-dashed border-emerald-500/20 rounded-3xl bg-emerald-950/20 backdrop-blur-sm p-12"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
              <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center shadow-2xl">
                <BookOpen className="h-10 w-10 text-emerald-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">No Courses Available</h2>
            <p className="text-emerald-100/50 text-center max-w-md mb-8">Start building your curriculum by creating your first course today.</p>
            <Button
              onClick={handleOpenAddModal}
              className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-full px-8 py-6 text-lg shadow-xl shadow-emerald-500/20"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create First Course
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {courses.map(course => (
              <motion.div
                key={course._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`group relative backdrop-blur-xl rounded-3xl border overflow-hidden transition-all flex flex-col ${!course.isActive ? 'bg-slate-900/40 border-white/5 opacity-80' : 'bg-slate-900/60 border-white/10 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10'}`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex gap-2">
                  <Button
                    size="icon"
                    onClick={() => handleOpenEditModal(course)}
                    className="h-8 w-8 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded-full backdrop-blur-md border border-blue-500/30"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={() => initiateDelete(course)}
                    className="h-8 w-8 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-full backdrop-blur-md border border-red-500/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-6 pb-0 flex-1 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      {course.challengeDay || 0} Days Challenge
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight">{course.courseTitle}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-6">{course.courseDescription || 'No description available.'}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-slate-300">
                      <PlayCircle className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-medium">{course.totalClass || 0} Classes</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-medium">{course.totalDuration || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <FileText className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-medium">{course.totalAssignment || 0} Tasks</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Award className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-medium">{course.totalMockTest || 0} Tests</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto z-10 flex flex-col">
                  <div className="px-6 py-4 bg-slate-950/40 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-slate-500" />
                      <span className="text-sm text-slate-400">{course.totalLecture || 0} Lectures</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 line-through decoration-red-500/50"> ৳{course.realPrice || 0}</span>
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                        ৳{course.discountPrice || 0}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-950/80 border-t border-white/5 flex items-center justify-between">
                    <Button
                      onClick={() => handleManageClasses(course._id)}
                      className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all text-sm h-9 px-4"
                    >
                      <Layers className="h-4 w-4 mr-2" /> Manage Classes
                    </Button>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium uppercase tracking-wider ${course.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {course.isActive ? 'Active' : 'Disabled'}
                      </span>
                      <Switch
                        checked={course.isActive ?? false}
                        onCheckedChange={() => initiateToggle(course)}
                        className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-700 border-white/10"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isToggleDialogOpen && courseToToggle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsToggleDialogOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div
                className={`flex items-center justify-between p-6 border-b border-white/10 ${courseToToggle.isActive ? 'bg-amber-500/5' : 'bg-emerald-500/5'}`}
              >
                <div className={`flex items-center gap-3 ${courseToToggle.isActive ? 'text-amber-400' : 'text-emerald-400'}`}>
                  <div className={`p-2 rounded-full ${courseToToggle.isActive ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}>
                    <Power className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold">Confirm Status Change</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsToggleDialogOpen(false)}
                  className="hover:bg-white/10 text-slate-400 hover:text-white rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 text-center space-y-4">
                <p className="text-slate-300 text-lg">
                  Are you sure you want to{' '}
                  <span className={`font-bold ${courseToToggle.isActive ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {courseToToggle.isActive ? 'deactivate' : 'activate'}
                  </span>{' '}
                  <br />
                  <span className="font-bold text-white mt-1 block">&quot;{courseToToggle.courseTitle}&quot;?</span>
                </p>
                <p className="text-sm text-slate-500">
                  {courseToToggle.isActive ? 'Deactivating this course will hide it from users.' : 'Activating this course will make it visible to users.'}
                </p>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setIsToggleDialogOpen(false)}
                  className="flex-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl h-12"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmToggleActive}
                  className={`flex-1 text-white border-none rounded-xl h-12 font-semibold shadow-lg ${courseToToggle.isActive ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'}`}
                >
                  {courseToToggle.isActive ? 'Deactivate Course' : 'Activate Course'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFormDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 mt-[65px]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsFormDialogOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  {modalMode === 'add' ? <Plus className="h-6 w-6 text-emerald-400" /> : <Edit className="h-6 w-6 text-blue-400" />}
                  {modalMode === 'add' ? 'Create New Course' : 'Edit Course Details'}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFormDialogOpen(false)}
                  className="hover:bg-white/10 text-slate-400 hover:text-white rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">
                      Course Title <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      placeholder="e.g. Advanced React Patterns"
                      className="bg-slate-950 border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-500 h-12 rounded-xl"
                      value={formData.courseTitle}
                      onChange={e => setFormData({ ...formData, courseTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Course Description</Label>
                    <textarea
                      placeholder="Detailed description of the course content..."
                      className="w-full bg-slate-950 border border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-4 min-h-[100px] outline-none transition-all resize-none"
                      value={formData.courseDescription}
                      onChange={e => setFormData({ ...formData, courseDescription: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Total Duration (e.g., 40 Hours)</Label>
                    <Input
                      className="bg-slate-950 border-white/10 text-white focus:border-emerald-500 h-12 rounded-xl"
                      value={formData.totalDuration}
                      onChange={e => setFormData({ ...formData, totalDuration: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Total Classes</Label>
                    <Input
                      type="number"
                      className="bg-slate-950 border-white/10 text-white focus:border-emerald-500 h-12 rounded-xl"
                      value={formData.totalClass}
                      onChange={e => setFormData({ ...formData, totalClass: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Total Lectures</Label>
                    <Input
                      type="number"
                      className="bg-slate-950 border-white/10 text-white focus:border-emerald-500 h-12 rounded-xl"
                      value={formData.totalLecture}
                      onChange={e => setFormData({ ...formData, totalLecture: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Total Assignments</Label>
                    <Input
                      type="number"
                      className="bg-slate-950 border-white/10 text-white focus:border-emerald-500 h-12 rounded-xl"
                      value={formData.totalAssignment}
                      onChange={e => setFormData({ ...formData, totalAssignment: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Total Mock Tests</Label>
                    <Input
                      type="number"
                      className="bg-slate-950 border-white/10 text-white focus:border-emerald-500 h-12 rounded-xl"
                      value={formData.totalMockTest}
                      onChange={e => setFormData({ ...formData, totalMockTest: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Challenge Days</Label>
                    <Input
                      type="number"
                      className="bg-slate-950 border-white/10 text-white focus:border-emerald-500 h-12 rounded-xl"
                      value={formData.challengeDay}
                      onChange={e => setFormData({ ...formData, challengeDay: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label className="text-slate-300">Real Price</Label>
                    <div className="relative">
                      ৳
                      <Input
                        type="number"
                        className="bg-slate-950 border-white/10 text-white focus:border-emerald-500 h-12 rounded-xl pl-9"
                        value={formData.realPrice}
                        onChange={e => setFormData({ ...formData, realPrice: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 relative">
                    <Label className="text-slate-300">Discount Price</Label>
                    <div className="relative">
                      ৳
                      <Input
                        type="number"
                        className="bg-slate-950 border-emerald-500/30 text-white focus:border-emerald-500 h-12 rounded-xl pl-9"
                        value={formData.discountPrice}
                        onChange={e => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-950 border border-white/10 rounded-xl p-4 mt-6">
                  <div>
                    <Label className="text-slate-300 text-base">Course Visibility</Label>
                    <p className="text-sm text-slate-500 mt-1">{formData.isActive ? 'Active and visible to all users' : 'Deactivated and hidden from users'}</p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={checked => setFormData({ ...formData, isActive: checked })}
                    className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-700"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-slate-950/50 flex justify-end gap-3 mt-auto">
                <Button
                  variant="ghost"
                  onClick={() => setIsFormDialogOpen(false)}
                  className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl h-12 px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitCourse}
                  disabled={!formData.courseTitle || isSaving}
                  className={`${modalMode === 'add' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'} text-white rounded-xl h-12 px-8 font-semibold transition-all shadow-lg`}
                >
                  {isSaving ? 'Processing...' : modalMode === 'add' ? 'Launch Course' : 'Save Changes'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteDialogOpen && courseToDelete && (
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
                  <h2 className="text-xl font-bold">Delete Course</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="hover:bg-white/10 text-slate-400 hover:text-white rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                  <Trash2 className="h-8 w-8 text-red-400" />
                </div>
                <p className="text-slate-300 text-lg">
                  Are you absolutely sure you want to delete <br />
                  <span className="font-bold text-white mt-1 block">&quot;{courseToDelete.courseTitle}&quot;</span>
                </p>
                <p className="text-sm text-slate-500">This action is permanent and cannot be undone. All associated data will be removed.</p>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="flex-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl h-12"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white border-none rounded-xl h-12 font-semibold shadow-lg shadow-red-500/20"
                >
                  Delete Permanently
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

```

Now Your task is implement those features in enrollments/page.tsx with the following instructions.
1. Copy color-combination, style, border, and background from course/page.tsx and implemetn it in enrollments/page.tsx 
2. add those features in enrollments/page.tsx 
    - Use loading state for update, delete, and feteching.
    - if found error then show a proper message in UI.
