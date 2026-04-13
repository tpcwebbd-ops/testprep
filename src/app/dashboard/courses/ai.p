look at the edit/page.tsx 
```
'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, BookOpen, Clock, AlertTriangle, X, Power, ArrowLeft, FileText, ChevronDown, ChevronUp, Save, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useGetCourseByIdQuery, useUpdateCourseMutation } from '@/redux/features/courses/coursesSlice';

interface IResource {
  id: string;
  text: string;
}

interface IClass {
  id: string;
  title: string;
  description: string;
  duration: string;
  isActive: boolean;
  resources: IResource[];
}

const defaultClassData: Omit<IClass, 'id' | 'resources'> = {
  title: '',
  description: '',
  duration: '',
  isActive: true,
};

function CourseEditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get('id');

  const { data: courseResponse, isLoading: isCourseLoading } = useGetCourseByIdQuery(courseId, {
    skip: !courseId,
  });
  console.log('courseResponse', courseResponse);
  const [updateCourse, { isLoading: isSaving }] = useUpdateCourseMutation();

  const courseData = courseResponse?.data;

  const [classes, setClasses] = useState<IClass[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (courseData?.lectureData) {
      try {
        const parsedData = Array.isArray(courseData.lectureData) ? courseData.lectureData : Object.values(courseData.lectureData);
        if (parsedData.length > 0) {
          setClasses(parsedData as IClass[]);
        }
      } catch {
        setClasses([]);
      }
    }
  }, [courseData]);

  const updateClassesState = (newClasses: IClass[]) => {
    setClasses(newClasses);
    setHasUnsavedChanges(true);
  };

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<IClass, 'id' | 'resources'>>(defaultClassData);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<IClass | null>(null);

  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);
  const [classToToggle, setClassToToggle] = useState<IClass | null>(null);

  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);
  const [resourceText, setResourceText] = useState('');
  const [isResourceFormOpen, setIsResourceFormOpen] = useState<string | null>(null);
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [editResourceText, setEditResourceText] = useState('');
  const [deletingResource, setDeletingResource] = useState<{ classId: string; resource: IResource } | null>(null);

  const handleSaveCurriculum = async () => {
    if (!courseId) return;

    try {
      const totalLecturesCount = classes.reduce((acc, cls) => acc + cls.resources.length, 0);

      await updateCourse({
        id: courseId,
        lectureData: classes,
        totalClass: classes.length,
        totalLecture: totalLecturesCount,
      }).unwrap();

      toast.success('Curriculum synchronized and saved successfully');
      setHasUnsavedChanges(false);
    } catch {
      toast.error('Failed to save curriculum changes');
    }
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData(defaultClassData);
    setCurrentEditId(null);
    setIsFormDialogOpen(true);
  };

  const handleOpenEditModal = (cls: IClass) => {
    setModalMode('edit');
    setFormData({ title: cls.title, description: cls.description, duration: cls.duration, isActive: cls.isActive });
    setCurrentEditId(cls.id);
    setIsFormDialogOpen(true);
  };

  const handleSubmitClass = () => {
    if (!formData.title) {
      toast.error('Class Title is required');
      return;
    }
    if (modalMode === 'add') {
      const newClass: IClass = { ...formData, id: Math.random().toString(36).substring(2, 9), resources: [] };
      updateClassesState([...classes, newClass]);
      toast.success('Class created locally');
    } else if (modalMode === 'edit' && currentEditId) {
      updateClassesState(classes.map(cls => (cls.id === currentEditId ? { ...cls, ...formData } : cls)));
      toast.success('Class updated locally');
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
    updateClassesState(classes.map(cls => (cls.id === classToToggle.id ? { ...cls, isActive: !cls.isActive } : cls)));
    toast.success(`Class ${!classToToggle.isActive ? 'activated' : 'deactivated'} locally`);
    setIsToggleDialogOpen(false);
    setClassToToggle(null);
  };

  const initiateDelete = (cls: IClass) => {
    setClassToDelete(cls);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!classToDelete) return;
    updateClassesState(classes.filter(cls => cls.id !== classToDelete.id));
    toast.success('Class deleted locally');
    setIsDeleteDialogOpen(false);
    setClassToDelete(null);
  };

  const toggleExpand = (classId: string) => {
    setExpandedClassId(prev => (prev === classId ? null : classId));
    setIsResourceFormOpen(null);
    setEditingResourceId(null);
  };

  const openAddResource = (classId: string) => {
    setIsResourceFormOpen(classId);
    setResourceText('');
    setEditingResourceId(null);
    setExpandedClassId(classId);
  };

  const handleAddResource = (classId: string) => {
    if (!resourceText.trim()) {
      toast.error('Resource text is required');
      return;
    }
    updateClassesState(
      classes.map(cls =>
        cls.id === classId ? { ...cls, resources: [...cls.resources, { id: Math.random().toString(36).substring(2, 9), text: resourceText.trim() }] } : cls,
      ),
    );
    setResourceText('');
    setIsResourceFormOpen(null);
    toast.success('Resource added locally');
  };

  const startEditResource = (resource: IResource) => {
    setEditingResourceId(resource.id);
    setEditResourceText(resource.text);
  };

  const handleSaveEditResource = (classId: string, resourceId: string) => {
    if (!editResourceText.trim()) {
      toast.error('Resource text is required');
      return;
    }
    updateClassesState(
      classes.map(cls =>
        cls.id === classId ? { ...cls, resources: cls.resources.map(r => (r.id === resourceId ? { ...r, text: editResourceText.trim() } : r)) } : cls,
      ),
    );
    setEditingResourceId(null);
    toast.success('Resource updated locally');
  };

  const confirmDeleteResource = () => {
    if (!deletingResource) return;
    updateClassesState(
      classes.map(cls => (cls.id === deletingResource.classId ? { ...cls, resources: cls.resources.filter(r => r.id !== deletingResource.resource.id) } : cls)),
    );
    toast.success('Resource deleted locally');
    setDeletingResource(null);
  };

  const courseTitle = isCourseLoading ? 'Loading...' : (courseData?.courseTitle ?? 'Course Details');

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 pt-[90px] pb-20 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-4">
              <Button
                onClick={() => router.push('/dashboard/courses')}
                variant="ghost"
                size="icon"
                className="rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 mt-1 shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                  {courseTitle}
                </h1>
                <p className="text-sm text-emerald-100/60 font-medium tracking-wide">
                  {classes.length} Class{classes.length !== 1 ? 'es' : ''} • Curate Curriculum
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleSaveCurriculum}
                disabled={!hasUnsavedChanges || isSaving}
                className={`relative overflow-hidden transition-all duration-300 h-12 px-6 rounded-xl border-none font-semibold ${
                  hasUnsavedChanges
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                    : 'bg-white/5 text-white/50 cursor-not-allowed'
                }`}
              >
                {hasUnsavedChanges && (
                  <span className="absolute inset-0 w-full h-full -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                )}
                {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                {isSaving ? 'Saving...' : 'Save Curriculum'}
              </Button>

              <Button
                onClick={handleOpenAddModal}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white border-none shadow-lg shadow-emerald-500/25 h-12 px-6 rounded-xl font-semibold"
              >
                <Plus className="mr-2 h-5 w-5" /> Add Class
              </Button>
            </motion.div>
          </div>
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
              <Plus className="h-5 w-5 mr-2" /> Add First Class
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {classes.map((cls, index) => (
              <motion.div
                key={cls.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
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

                <div className="z-10 border-t border-white/5 bg-slate-950/60">
                  <div className="flex items-center justify-between px-6 py-3 gap-3">
                    <button
                      onClick={() => toggleExpand(cls.id)}
                      className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium"
                    >
                      <FileText className="h-4 w-4 text-emerald-400" />
                      <span>
                        {cls.resources.length} Resource{cls.resources.length !== 1 ? 's' : ''}
                      </span>
                      {expandedClassId === cls.id ? (
                        <ChevronUp className="h-3.5 w-3.5 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                      )}
                    </button>
                    <Button
                      size="sm"
                      onClick={() => openAddResource(cls.id)}
                      className="h-8 px-3 text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Resource
                    </Button>
                  </div>

                  <AnimatePresence>
                    {expandedClassId === cls.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 space-y-2">
                          {isResourceFormOpen === cls.id && (
                            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 mb-3">
                              <Input
                                placeholder="Enter resource text..."
                                value={resourceText}
                                onChange={e => setResourceText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddResource(cls.id)}
                                className="flex-1 bg-slate-900 border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-500 h-9 rounded-lg text-sm"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleAddResource(cls.id)}
                                className="h-9 bg-emerald-600 hover:bg-emerald-500 text-white px-3 rounded-lg"
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setIsResourceFormOpen(null)}
                                className="h-9 text-slate-400 hover:text-white hover:bg-white/5 px-3 rounded-lg"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          )}

                          {cls.resources.length === 0 && isResourceFormOpen !== cls.id && (
                            <p className="text-xs text-slate-600 py-2 text-center">No resources yet. Add one above.</p>
                          )}

                          {cls.resources.map(resource => (
                            <motion.div
                              key={resource.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-start gap-2 group/res bg-slate-900/50 rounded-xl px-3 py-2 border border-white/5 hover:border-white/10 transition-colors"
                            >
                              {editingResourceId === resource.id ? (
                                <>
                                  <Input
                                    value={editResourceText}
                                    onChange={e => setEditResourceText(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSaveEditResource(cls.id, resource.id)}
                                    className="flex-1 bg-slate-950 border-white/10 text-white focus:border-emerald-500 h-8 rounded-lg text-sm"
                                    autoFocus
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveEditResource(cls.id, resource.id)}
                                    className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white px-2 rounded-lg text-xs shrink-0"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingResourceId(null)}
                                    className="h-8 text-slate-400 hover:text-white hover:bg-white/5 px-2 rounded-lg shrink-0"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <FileText className="h-3.5 w-3.5 text-teal-400 mt-0.5 shrink-0" />
                                  <span className="flex-1 text-sm text-slate-300 leading-snug break-words">{resource.text}</span>
                                  <div className="flex gap-1 opacity-0 group-hover/res:opacity-100 transition-opacity shrink-0">
                                    <button
                                      onClick={() => startEditResource(resource)}
                                      className="h-6 w-6 flex items-center justify-center rounded-md bg-blue-500/10 hover:bg-blue-500/30 text-blue-400 transition-colors"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => setDeletingResource({ classId: cls.id, resource })}
                                      className="h-6 w-6 flex items-center justify-center rounded-md bg-red-500/10 hover:bg-red-500/30 text-red-400 transition-colors"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="z-10 px-6 py-4 bg-slate-950/80 border-t border-white/5 flex items-center justify-end gap-3">
                  <span className={`text-xs font-medium uppercase tracking-wider ${cls.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {cls.isActive ? 'Active' : 'Disabled'}
                  </span>
                  <Switch
                    checked={cls.isActive}
                    onCheckedChange={() => initiateToggle(cls)}
                    className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-700 border-white/10"
                  />
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
              <div className="p-6 overflow-y-auto space-y-6">
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
                <div className="space-y-2">
                  <Label className="text-slate-300">Estimated Duration</Label>
                  <Input
                    placeholder="e.g. 45 mins"
                    className="bg-slate-950 border-white/10 text-white focus:border-emerald-500 h-12 rounded-xl"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between bg-slate-950 border border-white/10 rounded-xl p-4">
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
                  className={`${modalMode === 'add' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'} text-white rounded-xl h-12 px-8 font-semibold shadow-lg`}
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
                  className={`flex-1 text-white border-none rounded-xl h-12 font-semibold shadow-lg ${classToToggle.isActive ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'}`}
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

      <AnimatePresence>
        {deletingResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeletingResource(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-slate-900 border border-red-500/20 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10 bg-red-500/5">
                <div className="flex items-center gap-3 text-red-400">
                  <div className="p-2 bg-red-500/10 rounded-full">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold">Delete Resource</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeletingResource(null)}
                  className="hover:bg-white/10 text-slate-400 hover:text-white rounded-full h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6 text-center space-y-3">
                <p className="text-slate-300">Are you sure you want to delete this resource?</p>
                <p className="text-sm text-white font-semibold bg-slate-800 rounded-xl px-4 py-2 border border-white/5 line-clamp-2">
                  &quot;{deletingResource.resource.text}&quot;
                </p>
              </div>
              <div className="p-5 pt-0 flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setDeletingResource(null)}
                  className="flex-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl h-11"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDeleteResource}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-xl h-11 font-semibold shadow-lg shadow-red-500/20"
                >
                  Delete
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
```

and here is courseResponse example 
```
{
    "data": {
        "_id": "69dc1ef4293d681a7431e78c",
        "courseTitle": "IELTS ",
        "courseDescription": "DESCRIPTIO",
        "isActive": true,
        "totalClass": 3,
        "totalAssignment": 33,
        "totalDuration": "33",
        "totalMockTest": 33,
        "realPrice": 44,
        "discountPrice": 11,
        "challengeDay": 33,
        "totalLecture": 0,
        "createdAt": "2026-04-12T22:38:44.528Z",
        "updatedAt": "2026-04-13T09:41:18.966Z",
        "__v": 0,
        "lectureData": [
            {
                "title": "Class 1",
                "description": "What will I do",
                "duration": "45 minutes",
                "isActive": true,
                "id": "061gsvi",
                "resources": []
            },
            {
                "title": "Class Two ",
                "description": "Class 22",
                "duration": "20 MInutes",
                "isActive": true,
                "id": "dp4po54",
                "resources": []
            },
            {
                "title": "Class 3",
                "description": "Class 3 description",
                "duration": "30",
                "isActive": true,
                "id": "fv65tqc",
                "resources": []
            }
        ]
    },
    "message": "Fetched successfully",
    "status": 200
}```


Problem: there are 3 classes save in my database but it not shwo in UI. fix it.