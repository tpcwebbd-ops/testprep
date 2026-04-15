Look at the courses/edit/page.tsx 
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

  const [updateCourse, { isLoading: isSaving }] = useUpdateCourseMutation();

  const courseData = courseResponse?.data;

  const [classes, setClasses] = useState<IClass[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (courseData?.lectureData) {
      try {
        let parsedData = courseData.lectureData;

        if (typeof parsedData === 'string') {
          parsedData = JSON.parse(parsedData);
        } else if (typeof parsedData === 'object' && !Array.isArray(parsedData) && parsedData !== null) {
          parsedData = Object.values(parsedData);
        }

        if (Array.isArray(parsedData)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const safeClasses: IClass[] = parsedData.map((cls: any) => ({
            id: cls?.id || Math.random().toString(36).substring(2, 9),
            title: cls?.title || 'Untitled Class',
            description: cls?.description || '',
            duration: cls?.duration || '',
            isActive: typeof cls?.isActive === 'boolean' ? cls.isActive : true,
            resources: Array.isArray(cls?.resources) ? cls.resources : [],
          }));
          console.log('safeClasses : ', safeClasses);
          setClasses(safeClasses);
        } else {
          setClasses([]);
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
  console.log('classes : ', classes);
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
                  className={`${
                    modalMode === 'add' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
                  } text-white rounded-xl h-12 px-8 font-semibold shadow-lg`}
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

here is example of youtube/YTVideoUploadManagerSingle.tsx
```
/*
|-----------------------------------------
| setting up YTVideoUploadManagerSingle for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useMemo, useState, useEffect } from 'react';
import { X, Loader2, RefreshCcw, Search, CheckCircle2, Zap, MonitorPlay, Film, ChevronLeft, ChevronRight, VideoIcon, Youtube, Code } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface MediaItem {
  _id: string;
  name: string;
  url: string;
  status: string;
  contentType: string;
  uploaderPlace?: string;
  createdAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface InternalYouTubeVaultProps {
  onVideoSelect: (val: { name: string; url: string }) => void;
  selectedUrl: string;
}

const InternalYouTubeVault = ({ onVideoSelect, selectedUrl }: InternalYouTubeVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [iframeCode, setIframeCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading: isFetching,
    isFetching: isRefetching,
  } = useGetMediasQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    q: debouncedSearch,
    contentType: 'video',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia] = useAddMediaMutation();

  const availableVideos = useMemo(() => response?.data || [], [response]);
  const totalPages = useMemo(() => Math.ceil((response?.total || 0) / ITEMS_PER_PAGE) || 1, [response]);

  const handleProcessImport = async () => {
    if (!iframeCode.trim()) {
      toast.warn('Please paste iframe from YouTube');
      return;
    }

    setIsProcessing(true);
    try {
      const match = iframeCode.match(/src="([^"]+)"/);
      const url = match ? match[1] : iframeCode.trim();

      const payload = {
        name: `YT_STREAM_${Date.now()}`,
        url: url,
        status: 'active',
        contentType: 'video',
        uploaderPlace: 'youtube',
      };

      const result = await addMedia(payload).unwrap();
      toast.success('YouTube Asset Integrated');
      onVideoSelect({ name: result.name, url: result.url });
      setIframeCode('');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to process YouTube asset');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[85vh] backdrop-blur-3xl rounded-sm overflow-hidden bg-black/60 border border-white/20 shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/10 bg-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH YOUTUBE VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle />
            <DialogDescription />
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400">Syncing Grid...</span>
            </div>
          ) : availableVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableVideos.map((item, idx) => {
                  const isSelected = selectedUrl === item.url;
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => onVideoSelect({ name: item.name, url: item.url })}
                      className="group flex flex-col gap-3"
                    >
                      <div
                        className={`relative aspect-video rounded-sm overflow-hidden border cursor-pointer transition-all duration-500 
                        ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'border-white/10 hover:border-white/30'}
                      `}
                      >
                        <div className="absolute inset-0 bg-black flex items-center justify-center">
                          <iframe
                            src={item.url}
                            className="absolute inset-0 w-full h-full pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                        </div>
                        {isSelected && (
                          <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-[2px] flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-indigo-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 px-1">
                        <Youtube className={`w-3 h-3 ${isSelected ? 'text-indigo-400' : 'text-white/30'}`} />
                        <span className={`text-[10px] font-bold truncate uppercase tracking-tighter ${isSelected ? 'text-indigo-400' : 'text-white/50'}`}>
                          {item.name}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <Film className="w-16 h-16 animate-pulse mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">Vault Empty</p>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="p-6 border-t border-white/10 bg-white/5 space-y-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Import YouTube Embed</label>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <textarea
              value={iframeCode}
              onChange={e => setIframeCode(e.target.value)}
              placeholder='<iframe src="https://www.youtube.com/embed/..." ...></iframe>'
              className="flex-1 bg-black/40 border border-white/10 rounded-sm p-3 text-[11px] font-mono text-indigo-300 focus:outline-none focus:border-indigo-500/50 min-h-[70px] transition-all resize-none"
            />
            <Button
              onClick={handleProcessImport}
              disabled={isProcessing}
              variant="outlineGlassy"
              className="h-auto px-8 bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-400"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Youtube className="w-4 h-4 mr-2" />}
              <span className="text-[10px] font-black uppercase tracking-widest">Process & Link</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Button
              variant="outlineGlassy"
              size="sm"
              className="px-2"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isFetching}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-sm text-[10px] font-black text-white/60">
              {currentPage} / {totalPages}
            </div>
            <Button
              variant="outlineGlassy"
              size="sm"
              className="px-2"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isFetching}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest text-white/20">System Status: Operational</p>
        </div>
      </div>
    </div>
  );
};

export default function YouTubeVideoUploadManagerSingle({
  value,
  onChange,
  label = 'YOUTUBE SOURCE',
}: {
  value: { name: string; url: string };
  onChange: (val: { name: string; url: string }) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 w-full group/container">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Youtube className="w-4 h-4 text-red-500" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
        </div>
        <AnimatePresence>
          {value?.url && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Button variant="outlineFire" size="sm" onClick={() => onChange({ name: '', url: '' })} className="min-w-1">
                <X className="w-3 h-3" /> Remove
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-video rounded-sm backdrop-blur-3xl transition-all duration-700 cursor-pointer overflow-hidden flex flex-col items-center justify-center border border-white/10 hover:border-indigo-500/40 bg-white/[0.02]">
            {value?.url ? (
              <div className="w-full h-full relative">
                <iframe src={value.url} className="w-full h-full pointer-events-none" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-sm bg-indigo-500/10 border border-indigo-500/30 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400"
                  >
                    <RefreshCcw className="w-4 h-4 animate-spin-slow" />
                    RELINK SOURCE
                  </motion.div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-sm">
                  <div className="flex items-center gap-2 truncate">
                    <VideoIcon className="w-3 h-3 text-indigo-400" />
                    <span className="text-[9px] font-black text-white tracking-widest truncate uppercase">{value.name || 'ACTIVE_YOUTUBE_STREAM'}</span>
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.1)', '0 0 0px rgba(99,102,241,0)'],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-16 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center"
                >
                  <MonitorPlay className="w-8 h-8 text-white/20" />
                </motion.div>
                <div className="text-center space-y-2 px-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80 group-hover:text-indigo-400 transition-colors">
                    No Asset Deployed
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Select from YouTube Vault</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent border border-white/40 p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white mt-8">
          <InternalYouTubeVault
            selectedUrl={value?.url}
            onVideoSelect={val => {
              onChange(val);
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

```

here is example of uploadthings/VideoUploadManagerSingle.tsx
```
/*
|-----------------------------------------
| setting up VideoUploadMangerSingle for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  X,
  Zap,
  Film,
  Plus,
  Ghost,
  Search,
  Loader2,
  VideoIcon,
  RefreshCcw,
  MonitorPlay,
  ChevronLeft,
  CheckCircle2,
  ChevronRight,
  Clapperboard,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useMemo, useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { UploadButton } from '@/lib/uploadthing';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';


interface MediaItem {
  _id: string;
  name: string;
  url: string;
  status: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface InternalVideoVaultProps {
  onVideoSelect: (val: { name: string; url: string }) => void;
  selectedUrl: string;
}

const InternalVideoVault = ({ onVideoSelect, selectedUrl }: InternalVideoVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading: isFetching,
    isFetching: isRefetching,
  } = useGetMediasQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    q: debouncedSearch,
    contentType: 'video',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availableVideos = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

  const handleUploadComplete = async (res: { url: string; name: string }[]) => {
    if (res && res[0]) {
      try {
        await addMedia({
          url: res[0].url,
          name: res[0].name || 'Video_Source',
          contentType: 'video',
          status: 'active',
        }).unwrap();
        toast.success('Successfully Uploaded');
        onVideoSelect({ name: res[0].name, url: res[0].url });
      } catch {
        toast.error('Failed to Uploaded');
      } finally {
        setIsUploadingLocal(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-3xl rounded-sm overflow-hidden shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/50 bg-white/2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH VIDEO VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle> </DialogTitle>
            <DialogDescription> </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/60">Initializing Stream...</span>
            </div>
          ) : availableVideos.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableVideos.map((item, idx) => {
                  const isSelected = selectedUrl === item.url;
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
                      onClick={() => onVideoSelect({ name: item.name, url: item.url })}
                      className="group flex flex-col gap-3"
                    >
                      <div
                        className={`relative aspect-video rounded-sm overflow-hidden border cursor-pointer transition-all duration-500 
                        ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-black' : 'border-white/10 hover:border-white/30'}
                      `}
                      >
                        <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                          <Film className="w-8 h-8 text-white/5 group-hover:text-white/20 transition-colors" />
                          <video
                            src={item.url}
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                            muted
                            onMouseOver={e => e.currentTarget.play()}
                            onMouseOut={e => {
                              e.currentTarget.pause();
                              e.currentTarget.currentTime = 0;
                            }}
                          />
                        </div>

                        {isSelected && (
                          <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center backdrop-blur-[2px]">
                            <motion.div
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="bg-indigo-500 text-white rounded-sm p-3 shadow-2xl"
                            >
                              <CheckCircle2 className="w-6 h-6" />
                            </motion.div>
                          </div>
                        )}
                      </div>
                      <div className="-mt-2 flex items-center justify-start gap-2">
                        <VideoIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-white/40'}`} />
                        <h3
                          className={`text-sm font-medium transition-colors duration-300 truncate w-full
                            ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}
                          `}
                        >
                          {item.name || 'Untitled Name'}
                        </h3>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-30 space-y-6">
              <Ghost className="w-24 h-24 animate-bounce" />
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase text-white">No Assets Found</h3>
                <p className="text-[10px] font-bold uppercase mt-3 text-white/60 tracking-widest">Awaiting new production uploads</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 border-white/20 hover:bg-white/10"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-5 h-9 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[11px] font-black text-white">{currentPage}</span>
            <span className="text-[10px] font-black text-white/20">/</span>
            <span className="text-[11px] font-black text-white/60">{totalPages}</span>
          </div>

          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 border-white/20 hover:bg-white/10"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>

          <div className="hidden sm:block ml-4">
            <p className="text-sm text-white/60">Total : {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <UploadButton
            endpoint="videoUploader"
            appearance={{
              button: `bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-white/30 text-white backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 h-8 rounded-md gap-1 max-w-[100px] text-sm`,
              allowedContent: 'hidden',
            }}
            content={{
              button({ ready }) {
                if (isUploadingLocal) return <Loader2 className="w-4 h-4 animate-spin" />;
                return (
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>{ready ? 'Upload' : 'Uonnecting...'}</span>
                  </div>
                );
              },
            }}
            onUploadBegin={() => setIsUploadingLocal(true)}
            onClientUploadComplete={handleUploadComplete}
            onUploadError={err => {
              setIsUploadingLocal(false);
              toast.error(err.message);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function VideoUploadManagerSingle({
  value,
  onChange,
  label = 'VIDEO',
}: {
  value: { name: string; url: string };
  onChange: (val: { name: string; url: string }) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 w-full group/container">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Clapperboard className="w-3.5 h-3.5 text-indigo-50" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
        </div>
        <AnimatePresence>
          {value?.url && (
            <>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Button variant="outlineFire" size="sm" onClick={() => onChange({ name: '', url: '' })}>
                  <X className="w-3.5 h-3.5" /> Remove
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-video rounded-sm backdrop-blur-3xl transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center justify-center border border-white/10 hover:border-indigo-500/40 bg-white/[0.02]">
            {value?.url ? (
              <div className="w-full h-full relative">
                <video
                  src={value.url}
                  className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
                  muted
                  loop
                  onMouseOver={e => e.currentTarget.play()}
                  onMouseOut={e => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-sm bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white"
                  >
                    <RefreshCcw className="w-4 h-4 animate-[spin_4s_linear_infinite]" />
                    CHANGE SOURCE
                  </motion.div>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-sm">
                  <VideoIcon className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] font-bold text-white tracking-wider truncate max-w-[240px]">{value.name || 'ACTIVE_STREAM'}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1 * 0.5,
                  }}
                  className="w-16 h-16 rounded-sm bg-white/20 border border-white/10 flex items-center justify-center"
                >
                  <MonitorPlay className="w-8 h-8 text-white/50" />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">No Video Selected</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Click here to Select one</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent border border-white/50 p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white mt-8">
          <InternalVideoVault
            selectedUrl={value?.url}
            onVideoSelect={val => {
              onChange(val);
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

```

here is example of richTextEditor.tsx 
```
/*
|-----------------------------------------
| setting up RichTextEditorField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from 'lucide-react';
import React, { useEffect } from 'react';

import { cn } from '@/lib/utils';
import StarterKit from '@tiptap/starter-kit';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor, EditorContent, Editor } from '@tiptap/react';

function EditorMenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
    },
    {
      icon: <Heading4 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      isActive: editor.isActive('heading', { level: 4 }),
    },
    {
      icon: <Heading5 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
      isActive: editor.isActive('heading', { level: 5 }),
    },
    {
      icon: <Heading6 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
      isActive: editor.isActive('heading', { level: 6 }),
    },
    { icon: <Bold className="size-4" />, onClick: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive('bold') },
    { icon: <Italic className="size-4" />, onClick: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive('italic') },
    { icon: <Strikethrough className="size-4" />, onClick: () => editor.chain().focus().toggleStrike().run(), isActive: editor.isActive('strike') },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: editor.isActive({ textAlign: 'left' }),
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: editor.isActive({ textAlign: 'center' }),
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: editor.isActive({ textAlign: 'right' }),
    },
    { icon: <List className="size-4" />, onClick: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive('bulletList') },
    { icon: <ListOrdered className="size-4" />, onClick: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive('orderedList') },
    { icon: <Highlighter className="size-4" />, onClick: () => editor.chain().focus().toggleHighlight().run(), isActive: editor.isActive('highlight') },
  ];

  return (
    <div
      className={cn(
        'flex flex-wrap gap-1 p-1 mb-3 rounded-sm border border-white/20',
        'bg-white/10 backdrop-blur-md shadow-sm hover:bg-white/15 transition-all',
      )}
    >
      {options.map((option, index) => (
        <Toggle
          key={index}
          size="sm"
          pressed={option.isActive}
          onPressedChange={option.onClick}
          className={cn(
            'rounded-sm bg-white/5 hover:bg-white/20 transition-all border border-transparent',
            option.isActive && 'bg-white/20 border-white/30 shadow-sm',
          )}
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  );
}

export interface RichTextEditorProps {
  id: string;
  value: string;
  onChange: (content: string) => void;
  label?: string;
  className?: string;
}

export default function RichTextEditorField({ id, value, onChange, label, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: 'list-disc pl-4' } },
        orderedList: { HTMLAttributes: { class: 'list-decimal pl-4' } },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg min-h-[150px] w-full rounded-sm border border-white/20 bg-white/10 backdrop-blur-md px-3 py-2 text-sm text-white/90 placeholder:text-white/40 shadow-inner transition-all focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent focus:outline-none focus:ring-0',
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  return (
    <div className={cn('grid w-full gap-2 text-white', className)}>
      {label && (
        <Label htmlFor={id} className="text-white/80 tracking-wide">
          {label}
        </Label>
      )}
      <div className={cn('rounded-sm border border-white/20 bg-white/5 backdrop-blur-md shadow-lg p-2', 'hover:bg-white/10 transition-all duration-200')}>
        <EditorMenuBar editor={editor} />
        <div className="rounded-sm overflow-hidden border border-white/10">
          <EditorContent editor={editor} id={id} />
        </div>
      </div>
    </div>
  );
}
```

Now your task is implement those features in courses/edit/page.tsx with the following instructions. 
1. remove save curriculum button and enable auto save.
2. When I click add resource button then it will open a pop-up.
3. This pop-up have those button.
  - Add Youtube Video [choose or past embeded code from Youtube]
  - Add Video [uploadthings]
  - text [rich text editor]
  - MCQ [I can add Questions, and answer from 2 to 6 and select answer one of them. (first option is default answer)]
  - assignment. 
  