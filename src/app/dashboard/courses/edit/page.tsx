'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, BookOpen, Clock, Settings, AlertTriangle, X, Power, ArrowLeft, LayoutGrid } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface IClass {
  id: string;
  title: string;
  description: string;
  duration: string;
  isActive: boolean;
}

const defaultClassData: Omit<IClass, 'id'> = {
  title: '',
  description: '',
  duration: '',
  isActive: true,
};

function CourseEditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get('id');

  const [classes, setClasses] = useState<IClass[]>([]);
  const [courseTitle, setCourseTitle] = useState<string>('Loading Course...');

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<IClass, 'id'>>(defaultClassData);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<IClass | null>(null);

  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);
  const [classToToggle, setClassToToggle] = useState<IClass | null>(null);

  useEffect(() => {
    if (courseId) {
      setCourseTitle('Advanced Masterclass Curriculum');
      setClasses([
        {
          id: '1',
          title: 'Introduction to Core Concepts',
          description: 'A deep dive into the foundational elements of the course.',
          duration: '45 mins',
          isActive: true,
        },
        {
          id: '2',
          title: 'Advanced State Management',
          description: 'Exploring complex state patterns and performance optimization.',
          duration: '1h 20m',
          isActive: true,
        },
        {
          id: '3',
          title: 'Architectural Patterns',
          description: 'Building scalable applications from the ground up.',
          duration: '55 mins',
          isActive: false,
        },
      ]);
    }
  }, [courseId]);

  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData(defaultClassData);
    setCurrentEditId(null);
    setIsFormDialogOpen(true);
  };

  const handleOpenEditModal = (cls: IClass) => {
    setModalMode('edit');
    setFormData({
      title: cls.title,
      description: cls.description,
      duration: cls.duration,
      isActive: cls.isActive,
    });
    setCurrentEditId(cls.id);
    setIsFormDialogOpen(true);
  };

  const handleSubmitClass = () => {
    if (!formData.title) {
      toast.error('Class Title is required');
      return;
    }

    if (modalMode === 'add') {
      const newClass: IClass = {
        ...formData,
        id: Math.random().toString(36).substring(2, 9),
      };
      setClasses([...classes, newClass]);
      toast.success('Class created successfully');
    } else if (modalMode === 'edit' && currentEditId) {
      setClasses(classes.map(cls => (cls.id === currentEditId ? { ...formData, id: currentEditId } : cls)));
      toast.success('Class updated successfully');
    }

    setFormData(defaultClassData);
    setIsFormDialogOpen(false);
    setCurrentEditId(null);
  };

  const initiateToggle = (cls: IClass) => {
    setClassToToggle(cls);
    setIsToggleDialogOpen(true);
  };

  const confirmToggleActive = () => {
    if (!classToToggle) return;

    setClasses(classes.map(cls => (cls.id === classToToggle.id ? { ...cls, isActive: !cls.isActive } : cls)));

    toast.success(`Class ${!classToToggle.isActive ? 'activated' : 'deactivated'} successfully`);
    setIsToggleDialogOpen(false);
    setClassToToggle(null);
  };

  const initiateDelete = (cls: IClass) => {
    setClassToDelete(cls);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!classToDelete) return;

    setClasses(classes.filter(cls => cls.id !== classToDelete.id));
    toast.success('Class deleted successfully');
    setIsDeleteDialogOpen(false);
    setClassToDelete(null);
  };

  const handleManageResource = (classId: string) => {
    router.push(`/dashboard/courses/edit?id=${courseId}&class=${classId}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 pt-[90px] pb-20 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
            <Button
              onClick={() => router.push('/dashboard/courses')}
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                {courseTitle}
              </h1>
              <p className="text-emerald-100/60 mt-1 text-sm md:text-base">Curriculum Structure and Class Management</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                <LayoutGrid className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Classes</p>
                <p className="text-2xl font-bold text-white">{classes.length}</p>
              </div>
            </div>

            <Button
              onClick={handleOpenAddModal}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white border-none shadow-lg shadow-emerald-500/25 h-12 px-6 rounded-xl"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Class
            </Button>
          </motion.div>
        </div>

        {classes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[40vh] border-2 border-dashed border-emerald-500/20 rounded-3xl bg-emerald-950/20 backdrop-blur-sm p-12"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
              <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center shadow-2xl">
                <BookOpen className="h-10 w-10 text-emerald-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">No Classes Yet</h2>
            <p className="text-emerald-100/50 text-center max-w-md mb-8">Start building your course structure by adding your first class.</p>
            <Button
              onClick={handleOpenAddModal}
              className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-full px-8 py-6 text-lg shadow-xl shadow-emerald-500/20"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add First Class
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
            {classes.map((cls, index) => (
              <motion.div
                key={cls.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`group relative backdrop-blur-xl rounded-3xl border overflow-hidden transition-all flex flex-col ${
                  !cls.isActive
                    ? 'bg-slate-900/40 border-white/5 opacity-80'
                    : 'bg-slate-900/60 border-white/10 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10'
                }`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex gap-2">
                  <Button
                    size="icon"
                    onClick={() => handleOpenEditModal(cls)}
                    className="h-9 w-9 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded-full backdrop-blur-md border border-blue-500/30"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={() => initiateDelete(cls)}
                    className="h-9 w-9 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-full backdrop-blur-md border border-red-500/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-6 pb-4 flex-1 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-300 bg-teal-500/10 border border-teal-500/20 rounded-full">
                      Class {index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight">{cls.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-6">{cls.description || 'No description provided.'}</p>

                  <div className="flex items-center gap-2 text-slate-300 bg-slate-950/50 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                    <Clock className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-medium">{cls.duration || 'N/A'}</span>
                  </div>
                </div>

                <div className="mt-auto z-10 flex flex-col">
                  <div className="px-6 py-4 bg-slate-950/80 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Button
                      onClick={() => handleManageResource(cls.id)}
                      className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all text-sm h-10 px-4 rounded-xl w-full sm:w-auto"
                    >
                      <Settings className="h-4 w-4 mr-2" /> Manage Resource
                    </Button>
                    <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
                      <span className={`text-xs font-medium uppercase tracking-wider ${cls.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {cls.isActive ? 'Active' : 'Disabled'}
                      </span>
                      <Switch
                        checked={cls.isActive}
                        onCheckedChange={() => initiateToggle(cls)}
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
              className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  {modalMode === 'add' ? <Plus className="h-6 w-6 text-emerald-400" /> : <Edit className="h-6 w-6 text-blue-400" />}
                  {modalMode === 'add' ? 'Create New Class' : 'Edit Class Details'}
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
                      Class Title <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      placeholder="e.g. Introduction to React"
                      className="bg-slate-950 border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-500 h-12 rounded-xl"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Class Description</Label>
                    <textarea
                      placeholder="Detailed overview of what this class covers..."
                      className="w-full bg-slate-950 border border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-4 min-h-[120px] outline-none transition-all resize-none"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Estimated Duration</Label>
                    <Input
                      placeholder="e.g. 45 mins"
                      className="bg-slate-950 border-white/10 text-white focus:border-emerald-500 h-12 rounded-xl"
                      value={formData.duration}
                      onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-950 border border-white/10 rounded-xl p-4 mt-6">
                  <div>
                    <Label className="text-slate-300 text-base">Class Visibility</Label>
                    <p className="text-sm text-slate-500 mt-1">{formData.isActive ? 'Active and accessible to students' : 'Hidden from the curriculum'}</p>
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
                  onClick={handleSubmitClass}
                  disabled={!formData.title}
                  className={`${
                    modalMode === 'add' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
                  } text-white rounded-xl h-12 px-8 font-semibold transition-all shadow-lg`}
                >
                  {modalMode === 'add' ? 'Save Class' : 'Update Class'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isToggleDialogOpen && classToToggle && (
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
                className={`flex items-center justify-between p-6 border-b border-white/10 ${classToToggle.isActive ? 'bg-amber-500/5' : 'bg-emerald-500/5'}`}
              >
                <div className={`flex items-center gap-3 ${classToToggle.isActive ? 'text-amber-400' : 'text-emerald-400'}`}>
                  <div className={`p-2 rounded-full ${classToToggle.isActive ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}>
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
                  <span className={`font-bold ${classToToggle.isActive ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {classToToggle.isActive ? 'deactivate' : 'activate'}
                  </span>{' '}
                  <br />
                  <span className="font-bold text-white mt-1 block">&quot;{classToToggle.title}&quot;?</span>
                </p>
                <p className="text-sm text-slate-500">
                  {classToToggle.isActive ? 'Deactivating will hide this class from students.' : 'Activating will make this class visible to students.'}
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
                  className={`flex-1 text-white border-none rounded-xl h-12 font-semibold shadow-lg ${
                    classToToggle.isActive ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                  }`}
                >
                  {classToToggle.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteDialogOpen && classToDelete && (
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
                  <h2 className="text-xl font-bold">Delete Class</h2>
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
                  <span className="font-bold text-white mt-1 block">&quot;{classToDelete.title}&quot;</span>
                </p>
                <p className="text-sm text-slate-500">This action is permanent and will remove all resources within this class.</p>
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

export default function EditCoursePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
            <p className="text-emerald-400 font-medium tracking-widest">LOADING...</p>
          </div>
        </div>
      }
    >
      <CourseEditorContent />
    </Suspense>
  );
}
