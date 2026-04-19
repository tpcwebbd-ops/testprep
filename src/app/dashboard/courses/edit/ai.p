Look at the page.tsx 
```
'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Clock,
  AlertTriangle,
  X,
  Power,
  ArrowLeft,
  FileText,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  Youtube,
  Video as VideoIcon,
  HelpCircle,
  ClipboardList,
  Save,
  Check,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useGetCourseByIdQuery, useUpdateCourseMutation } from '@/redux/features/courses/coursesSlice';
import YouTubeVideoUploadManagerSingle from '@/app/dashboard/media/example/yt-videos/components/YTVideoUploadManagerSingle';
import VideoUploadManagerSingle from '@/app/dashboard/media/example/uploadthings/components/VideoUploadMangerSingle';
import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField';

type ResourceType = 'youtube' | 'video' | 'text' | 'mcq' | 'assignment';

interface IResource {
  id: string;
  type: ResourceType;
  title: string;
  url?: string;
  content?: string;
  mcqData?: {
    question: string;
    options: string[];
    correctAnswerIndex: number;
  };
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

  const [updateCourse] = useUpdateCourseMutation();
  const courseData = courseResponse?.data;

  const [classes, setClasses] = useState<IClass[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const initialLoad = useRef(true);

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
            resources: Array.isArray(cls?.resources)
              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cls.resources.map((r: any) => ({
                  id: r.id || Math.random().toString(36).substring(2, 9),
                  type: r.type || 'text',
                  title: r.title || r.text || 'Untitled Resource',
                  url: r.url || '',
                  content: r.content || r.text || '',
                  mcqData: r.mcqData || { question: '', options: ['Option 1', 'Option 2'], correctAnswerIndex: 0 },
                }))
              : [],
          }));
          setClasses(safeClasses);
        } else {
          setClasses([]);
        }
      } catch {
        setClasses([]);
      }
    }
  }, [courseData]);

  useEffect(() => {
    if (initialLoad.current) {
      if (classes.length > 0) initialLoad.current = false;
      return;
    }

    if (!hasUnsavedChanges || !courseId) return;

    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        const totalLecturesCount = classes.reduce((acc, cls) => acc + cls.resources.length, 0);
        await updateCourse({
          id: courseId,
          lectureData: classes,
          totalClass: classes.length,
          totalLecture: totalLecturesCount,
        }).unwrap();
        setSaveStatus('saved');
        setHasUnsavedChanges(false);
      } catch {
        setSaveStatus('error');
        toast.error('Auto-save failed. Please check your connection.');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [classes, hasUnsavedChanges, courseId, updateCourse]);

  const updateClassesState = (newClasses: IClass[]) => {
    setClasses(newClasses);
    setHasUnsavedChanges(true);
    setSaveStatus('idle');
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

  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [resourceModalMode, setResourceModalMode] = useState<'add' | 'edit'>('add');
  const [activeClassId, setActiveClassId] = useState<string | null>(null);
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [deletingResource, setDeletingResource] = useState<{ classId: string; resource: IResource } | null>(null);

  const [resourceType, setResourceType] = useState<ResourceType | null>(null);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrlData, setResourceUrlData] = useState({ name: '', url: '' });
  const [resourceHtml, setResourceHtml] = useState('');
  const [mcqQuestion, setMcqQuestion] = useState('');
  const [mcqOptions, setMcqOptions] = useState<string[]>(['Option 1', 'Option 2']);
  const [mcqCorrectIndex, setMcqCorrectIndex] = useState(0);

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
      toast.success('Class created');
    } else if (modalMode === 'edit' && currentEditId) {
      updateClassesState(classes.map(cls => (cls.id === currentEditId ? { ...cls, ...formData } : cls)));
      toast.success('Class updated');
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
    toast.success(`Class ${!classToToggle.isActive ? 'activated' : 'deactivated'}`);
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
    toast.success('Class deleted');
    setIsDeleteDialogOpen(false);
    setClassToDelete(null);
  };

  const toggleExpand = (classId: string) => {
    setExpandedClassId(prev => (prev === classId ? null : classId));
  };

  const resetResourceStates = () => {
    setResourceType(null);
    setResourceTitle('');
    setResourceUrlData({ name: '', url: '' });
    setResourceHtml('');
    setMcqQuestion('');
    setMcqOptions(['Option 1', 'Option 2']);
    setMcqCorrectIndex(0);
  };

  const openAddResourceModal = (classId: string) => {
    setActiveClassId(classId);
    setResourceModalMode('add');
    setEditingResourceId(null);
    resetResourceStates();
    setIsResourceModalOpen(true);
    setExpandedClassId(classId);
  };

  const openEditResourceModal = (classId: string, resource: IResource) => {
    setActiveClassId(classId);
    setResourceModalMode('edit');
    setEditingResourceId(resource.id);
    setResourceType(resource.type);
    setResourceTitle(resource.title);
    setResourceUrlData({ name: resource.title, url: resource.url || '' });
    setResourceHtml(resource.content || '');
    if (resource.type === 'mcq' && resource.mcqData) {
      setMcqQuestion(resource.mcqData.question);
      setMcqOptions(resource.mcqData.options);
      setMcqCorrectIndex(resource.mcqData.correctAnswerIndex);
    }
    setIsResourceModalOpen(true);
  };

  const handleSaveResource = () => {
    if (!activeClassId || !resourceType) return;
    if (!resourceTitle.trim()) {
      toast.error('Resource title is required');
      return;
    }

    const newResource: IResource = {
      id: editingResourceId || Math.random().toString(36).substring(2, 9),
      type: resourceType,
      title: resourceTitle.trim(),
      url: resourceUrlData.url,
      content: resourceHtml,
      mcqData: resourceType === 'mcq' ? { question: mcqQuestion, options: mcqOptions, correctAnswerIndex: mcqCorrectIndex } : undefined,
    };

    if (resourceModalMode === 'add') {
      updateClassesState(classes.map(cls => (cls.id === activeClassId ? { ...cls, resources: [...cls.resources, newResource] } : cls)));
      toast.success('Resource added');
    } else {
      updateClassesState(
        classes.map(cls => (cls.id === activeClassId ? { ...cls, resources: cls.resources.map(r => (r.id === editingResourceId ? newResource : r)) } : cls)),
      );
      toast.success('Resource updated');
    }

    setIsResourceModalOpen(false);
    resetResourceStates();
  };

  const confirmDeleteResource = () => {
    if (!deletingResource) return;
    updateClassesState(
      classes.map(cls => (cls.id === deletingResource.classId ? { ...cls, resources: cls.resources.filter(r => r.id !== deletingResource.resource.id) } : cls)),
    );
    toast.success('Resource deleted');
    setDeletingResource(null);
  };

  const updateMcqOption = (index: number, val: string) => {
    const newOptions = [...mcqOptions];
    newOptions[index] = val;
    setMcqOptions(newOptions);
  };

  const addMcqOption = () => {
    if (mcqOptions.length < 6) {
      setMcqOptions([...mcqOptions, `Option ${mcqOptions.length + 1}`]);
    }
  };

  const removeMcqOption = (index: number) => {
    if (mcqOptions.length > 2) {
      const newOptions = mcqOptions.filter((_, i) => i !== index);
      setMcqOptions(newOptions);
      if (mcqCorrectIndex === index) {
        setMcqCorrectIndex(0);
      } else if (mcqCorrectIndex > index) {
        setMcqCorrectIndex(mcqCorrectIndex - 1);
      }
    }
  };

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="h-4 w-4 text-red-400" />;
      case 'video':
        return <VideoIcon className="h-4 w-4 text-indigo-400" />;
      case 'text':
        return <FileText className="h-4 w-4 text-teal-400" />;
      case 'mcq':
        return <HelpCircle className="h-4 w-4 text-amber-400" />;
      case 'assignment':
        return <ClipboardList className="h-4 w-4 text-fuchsia-400" />;
      default:
        return <FileText className="h-4 w-4 text-slate-400" />;
    }
  };

  const courseTitleDisplay = isCourseLoading ? 'Loading...' : (courseData?.courseTitle ?? 'Course Details');

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
                  {courseTitleDisplay}
                </h1>
                <p className="text-sm text-emerald-100/60 font-medium tracking-wide">
                  {classes.length} Class{classes.length !== 1 ? 'es' : ''} • Auto-saving enabled
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/50 border border-white/5">
                {saveStatus === 'saving' && <Loader2 className="h-4 w-4 text-amber-400 animate-spin" />}
                {saveStatus === 'saved' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                {saveStatus === 'error' && <AlertTriangle className="h-4 w-4 text-red-400" />}
                {saveStatus === 'idle' && <Save className="h-4 w-4 text-slate-400" />}
                <span className="text-sm font-medium text-slate-300">
                  {saveStatus === 'saving' && 'Saving changes...'}
                  {saveStatus === 'saved' && 'All changes saved'}
                  {saveStatus === 'error' && 'Failed to save'}
                  {saveStatus === 'idle' && 'Waiting to save...'}
                </span>
              </div>

              <Button
                onClick={handleOpenAddModal}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white border-none shadow-lg shadow-emerald-500/25 h-11 px-6 rounded-xl font-semibold"
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
                      onClick={() => openAddResourceModal(cls.id)}
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
                          {cls.resources.length === 0 && <p className="text-xs text-slate-600 py-2 text-center">No resources yet. Add one above.</p>}

                          {cls.resources.map(resource => (
                            <motion.div
                              key={resource.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between gap-3 group/res bg-slate-900/50 rounded-xl px-4 py-3 border border-white/5 hover:border-white/10 hover:bg-slate-800/50 transition-all"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2 bg-slate-950 rounded-lg border border-white/5 shrink-0">{getResourceIcon(resource.type)}</div>
                                <div className="flex flex-col overflow-hidden">
                                  <span className="text-sm font-medium text-slate-200 truncate">{resource.title}</span>
                                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{resource.type}</span>
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover/res:opacity-100 transition-opacity shrink-0">
                                <button
                                  onClick={() => openEditResourceModal(cls.id, resource)}
                                  className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-500/10 hover:bg-blue-500/30 text-blue-400 transition-colors"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeletingResource({ classId: cls.id, resource })}
                                  className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
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
        {isResourceModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIsResourceModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-4">
                  {resourceType && resourceModalMode === 'add' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setResourceType(null)}
                      className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-white"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  )}
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    {resourceModalMode === 'add' ? 'Add Resource' : 'Edit Resource'}
                    {resourceType && (
                      <span className="text-sm font-medium bg-slate-800 text-slate-300 px-3 py-1 rounded-full uppercase tracking-wider ml-2">
                        {resourceType}
                      </span>
                    )}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsResourceModalOpen(false)}
                  className="hover:bg-white/10 text-slate-400 hover:text-white rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                {!resourceType ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        type: 'youtube' as ResourceType,
                        title: 'YouTube Video',
                        icon: <Youtube className="h-8 w-8 text-red-500" />,
                        desc: 'Embed from YouTube',
                      },
                      {
                        type: 'video' as ResourceType,
                        title: 'Direct Video',
                        icon: <VideoIcon className="h-8 w-8 text-indigo-500" />,
                        desc: 'Upload or select video',
                      },
                      { type: 'text' as ResourceType, title: 'Text Content', icon: <FileText className="h-8 w-8 text-teal-500" />, desc: 'Rich text editor' },
                      {
                        type: 'mcq' as ResourceType,
                        title: 'Quiz (MCQ)',
                        icon: <HelpCircle className="h-8 w-8 text-amber-500" />,
                        desc: 'Multiple choice question',
                      },
                      {
                        type: 'assignment' as ResourceType,
                        title: 'Assignment',
                        icon: <ClipboardList className="h-8 w-8 text-fuchsia-500" />,
                        desc: 'Task description',
                      },
                    ].map(item => (
                      <button
                        key={item.type}
                        onClick={() => setResourceType(item.type)}
                        className="group flex flex-col items-center justify-center p-8 bg-slate-950 rounded-2xl border border-white/5 hover:border-emerald-500/50 hover:bg-slate-900 transition-all duration-300"
                      >
                        <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-300 mb-4">{item.icon}</div>
                        <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-sm text-slate-500 text-center">{item.desc}</p>
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 max-w-3xl mx-auto">
                    <div className="space-y-2">
                      <Label className="text-slate-300 text-base">
                        Resource Title <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        placeholder="Enter a title for this resource..."
                        value={resourceTitle}
                        onChange={e => setResourceTitle(e.target.value)}
                        className="bg-slate-950 border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-500 h-12 rounded-xl text-lg"
                      />
                    </div>

                    {resourceType === 'youtube' && (
                      <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
                        <YouTubeVideoUploadManagerSingle value={resourceUrlData} onChange={setResourceUrlData} label="Select YouTube Video" />
                      </div>
                    )}

                    {resourceType === 'video' && (
                      <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
                        <VideoUploadManagerSingle value={resourceUrlData} onChange={setResourceUrlData} label="Select Source Video" />
                      </div>
                    )}

                    {(resourceType === 'text' || resourceType === 'assignment') && (
                      <div className="space-y-2">
                        <Label className="text-slate-300 text-base">Content Details</Label>
                        <div className="bg-slate-950 p-2 rounded-xl border border-white/10 min-h-[300px]">
                          <RichTextEditorField id="resource-content" value={resourceHtml} onChange={setResourceHtml} />
                        </div>
                      </div>
                    )}

                    {resourceType === 'mcq' && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label className="text-slate-300 text-base">
                            Question <span className="text-red-400">*</span>
                          </Label>
                          <textarea
                            placeholder="Type your question here..."
                            value={mcqQuestion}
                            onChange={e => setMcqQuestion(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-500 rounded-xl p-4 min-h-[100px] resize-none outline-none"
                          />
                        </div>

                        <div className="space-y-4 bg-slate-950 p-6 rounded-xl border border-white/10">
                          <div className="flex items-center justify-between">
                            <Label className="text-slate-300 text-base">Answer Options</Label>
                            <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded-md">Select correct answer</span>
                          </div>

                          <div className="space-y-3">
                            {mcqOptions.map((opt, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                <button
                                  onClick={() => setMcqCorrectIndex(idx)}
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                    mcqCorrectIndex === idx ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-600 hover:border-emerald-500/50'
                                  }`}
                                >
                                  {mcqCorrectIndex === idx && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                                </button>
                                <Input
                                  value={opt}
                                  onChange={e => updateMcqOption(idx, e.target.value)}
                                  placeholder={`Option ${idx + 1}`}
                                  className={`flex-1 bg-slate-900 border-white/5 text-white transition-colors h-11 ${
                                    mcqCorrectIndex === idx ? 'border-emerald-500/50 bg-emerald-500/5' : 'focus:border-emerald-500'
                                  }`}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeMcqOption(idx)}
                                  disabled={mcqOptions.length <= 2}
                                  className="shrink-0 text-slate-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>

                          <Button
                            onClick={addMcqOption}
                            disabled={mcqOptions.length >= 6}
                            variant="outline"
                            className="w-full border-dashed border-slate-700 hover:border-emerald-500 hover:text-emerald-400 text-slate-400 bg-transparent h-11 mt-4"
                          >
                            <Plus className="h-4 w-4 mr-2" /> Add Option
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              <div className="p-6 border-t border-white/10 bg-slate-950/50 flex justify-end gap-3 shrink-0">
                <Button
                  variant="ghost"
                  onClick={() => setIsResourceModalOpen(false)}
                  className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl h-12 px-6"
                >
                  Cancel
                </Button>
                {resourceType && (
                  <Button
                    onClick={handleSaveResource}
                    disabled={!resourceTitle.trim()}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-12 px-8 font-semibold shadow-lg shadow-emerald-500/20"
                  >
                    <Check className="mr-2 h-5 w-5" />
                    Save Resource
                  </Button>
                )}
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
                <div className="bg-slate-800 rounded-xl px-4 py-3 border border-white/5 flex flex-col items-center">
                  <div className="mb-2 bg-slate-900 p-2 rounded-full">{getResourceIcon(deletingResource.resource.type)}</div>
                  <p className="text-sm text-white font-semibold line-clamp-2 text-center">&quot;{deletingResource.resource.title}&quot;</p>
                </div>
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

and here is example of  
app/dashboard/media/example/uploadthings/components/AudioUploadManagerSingle.tsx 
```

'use client';

import { toast } from 'react-toastify';
import { FaFileAudio } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useMemo, useState, useEffect } from 'react';
import { X, Loader2, Ghost, RefreshCcw, Search, CheckCircle2, Zap, FileText, Files, ChevronLeft, ChevronRight, FilePlus, Plus } from 'lucide-react';

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

interface InternalAudioVaultProps {
  onAudioSelect: (val: { name: string; url: string }) => void;
  selectedUrl: string;
}

const InternalAudioVault = ({ onAudioSelect, selectedUrl }: InternalAudioVaultProps) => {
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
    contentType: 'audio',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availableAudios = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

  const handleUploadComplete = async (res: { url: string; name: string }[]) => {
    if (res && res[0]) {
      try {
        await addMedia({
          url: res[0].url,
          name: res[0].name || 'AUDIO_Source',
          contentType: 'audio',
          status: 'active',
        }).unwrap();
        toast.success('Successfully Uploaded');
        onAudioSelect({ name: res[0].name, url: res[0].url });
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
              placeholder="SEARCH AUDIO VAULT..."
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
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/60">Initializing Archive...</span>
            </div>
          ) : availableAudios.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableAudios.map((item, idx) => {
                  const isSelected = selectedUrl === item.url;
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
                      onClick={() => onAudioSelect({ name: item.name, url: item.url })}
                      className="group flex flex-col gap-3"
                    >
                      <div
                        className={`relative aspect-[3/4] rounded-sm overflow-hidden border cursor-pointer transition-all duration-500 
                        ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-black' : 'border-white/10 hover:border-white/30'}
                      `}
                      >
                        <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                          <FaFileAudio className="w-12 h-12 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />
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
                      <div className="-mt-1 flex items-center justify-start gap-2">
                        <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-white/40'}`} />
                        <h3
                          className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 truncate w-full
                            ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}
                          `}
                        >
                          {item.name || 'Untitled Audio'}
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
                <p className="text-[10px] font-bold uppercase mt-3 text-white/60 tracking-widest">Awaiting new audio uploads</p>
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
            endpoint="audioUploader"
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
                    <span>{ready ? 'Upload' : 'Connecting...'}</span>
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

export default function AudioUploadManagerSingle({
  value,
  onChange,
  label = 'AUDIO',
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
          <Files className="w-3.5 h-3.5 text-indigo-50" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
        </div>
        <AnimatePresence>
          {value?.url && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Button variant="outlineFire" size="sm" onClick={() => onChange({ name: '', url: '' })}>
                <X className="w-3.5 h-3.5" /> Remove
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-video rounded-sm backdrop-blur-3xl transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center justify-center border border-white/10 hover:border-indigo-500/40 bg-white/[0.02]">
            {value?.url ? (
              <div className="w-full h-full relative flex flex-col items-center justify-center bg-white/[0.03]">
                <FaFileAudio className="w-24 h-24 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-sm bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white"
                  >
                    <RefreshCcw className="w-4 h-4 animate-[spin_4s_linear_infinite]" />
                    CHANGE ASSET
                  </motion.div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-sm">
                  <FileText className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] font-bold text-white tracking-wider truncate flex-1">{value.name || 'ACTIVE_AUDIO'}</span>
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
                  <FilePlus className="w-8 h-8 text-white/50" />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">No audio Selected</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Click here to Select one</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent border border-white/50 p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white mt-8">
          <InternalAudioVault
            selectedUrl={value?.url}
            onAudioSelect={val => {
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
app/dashboard/media/example/uploadthings/components/PdfUploadManagerSingle.tsx
```

'use client';

import { toast } from 'react-toastify';
import { FaFilePdf } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useMemo, useState, useEffect } from 'react';
import { X, Loader2, Ghost, RefreshCcw, Search, CheckCircle2, Zap, FileText, Files, ChevronLeft, ChevronRight, FilePlus, Plus } from 'lucide-react';

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

interface InternalPdfVaultProps {
  onPdfSelect: (val: { name: string; url: string }) => void;
  selectedUrl: string;
}

const InternalPdfVault = ({ onPdfSelect, selectedUrl }: InternalPdfVaultProps) => {
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
    contentType: 'pdf',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availablePdfs = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

  const handleUploadComplete = async (res: { url: string; name: string }[]) => {
    if (res && res[0]) {
      try {
        await addMedia({
          url: res[0].url,
          name: res[0].name || 'PDF_Source',
          contentType: 'pdf',
          status: 'active',
        }).unwrap();
        toast.success('Successfully Uploaded');
        onPdfSelect({ name: res[0].name, url: res[0].url });
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
              placeholder="SEARCH PDF VAULT..."
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
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/60">Initializing Archive...</span>
            </div>
          ) : availablePdfs.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availablePdfs.map((item, idx) => {
                  const isSelected = selectedUrl === item.url;
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
                      onClick={() => onPdfSelect({ name: item.name, url: item.url })}
                      className="group flex flex-col gap-3"
                    >
                      <div
                        className={`relative aspect-[3/4] rounded-sm overflow-hidden border cursor-pointer transition-all duration-500 
                        ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-black' : 'border-white/10 hover:border-white/30'}
                      `}
                      >
                        <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                          <FaFilePdf className="w-12 h-12 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />
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
                      <div className="-mt-1 flex items-center justify-start gap-2">
                        <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-white/40'}`} />
                        <h3
                          className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 truncate w-full
                            ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}
                          `}
                        >
                          {item.name || 'Untitled Document'}
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
                <p className="text-[10px] font-bold uppercase mt-3 text-white/60 tracking-widest">Awaiting new pdf uploads</p>
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
            endpoint="pdfUploader"
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
                    <span>{ready ? 'Upload' : 'Connecting...'}</span>
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

export default function PdfUploadManagerSingle({
  value,
  onChange,
  label = 'PDF',
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
          <Files className="w-3.5 h-3.5 text-indigo-50" />
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
              <div className="w-full h-full relative flex flex-col items-center justify-center bg-white/[0.03]">
                <FaFilePdf className="w-24 h-24 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-sm bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white"
                  >
                    <RefreshCcw className="w-4 h-4 animate-[spin_4s_linear_infinite]" />
                    CHANGE ASSET
                  </motion.div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-sm">
                  <FileText className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] font-bold text-white tracking-wider truncate flex-1">{value.name || 'ACTIVE_DOC'}</span>
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
                  <FilePlus className="w-8 h-8 text-white/50" />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">No pdf Selected</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Click here to Select one</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent border border-white/50 p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white mt-8">
          <InternalPdfVault
            selectedUrl={value?.url}
            onPdfSelect={val => {
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
app/dashboard/media/example/uploadthings/components/DocxUploadManagerSingle.tsx
```
'use client';

import { toast } from 'react-toastify';
import { FaFileWord } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useMemo, useState, useEffect } from 'react';
import { X, Loader2, Ghost, RefreshCcw, Search, CheckCircle2, Zap, FileText, Files, ChevronLeft, ChevronRight, FilePlus, Plus } from 'lucide-react';

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

interface InternalDocxVaultProps {
  onDocxSelect: (val: { name: string; url: string }) => void;
  selectedUrl: string;
}

const InternalDocxVault = ({ onDocxSelect, selectedUrl }: InternalDocxVaultProps) => {
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
    contentType: 'docx',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availableDocxs = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

  const handleUploadComplete = async (res: { url: string; name: string }[]) => {
    if (res && res[0]) {
      try {
        await addMedia({
          url: res[0].url,
          name: res[0].name || 'DOCX_Source',
          contentType: 'docx',
          status: 'active',
        }).unwrap();
        toast.success('Successfully Uploaded');
        onDocxSelect({ name: res[0].name, url: res[0].url });
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
              placeholder="SEARCH DOCX VAULT..."
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
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/60">Initializing Archive...</span>
            </div>
          ) : availableDocxs.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableDocxs.map((item, idx) => {
                  const isSelected = selectedUrl === item.url;
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
                      onClick={() => onDocxSelect({ name: item.name, url: item.url })}
                      className="group flex flex-col gap-3"
                    >
                      <div
                        className={`relative aspect-[3/4] rounded-sm overflow-hidden border cursor-pointer transition-all duration-500 
                        ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-black' : 'border-white/10 hover:border-white/30'}
                      `}
                      >
                        <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                          <FaFileWord className="w-12 h-12 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />
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
                      <div className="-mt-1 flex items-center justify-start gap-2">
                        <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-white/40'}`} />
                        <h3
                          className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 truncate w-full
                            ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}
                          `}
                        >
                          {item.name || 'Untitled Document'}
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
                <p className="text-[10px] font-bold uppercase mt-3 text-white/60 tracking-widest">Awaiting new docx uploads</p>
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
            endpoint="docxUploader"
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
                    <span>{ready ? 'Upload' : 'Connecting...'}</span>
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

export default function DocxUploadManagerSingle({
  value,
  onChange,
  label = 'DOCX',
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
          <Files className="w-3.5 h-3.5 text-indigo-50" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
        </div>
        <AnimatePresence>
          {value?.url && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Button variant="outlineFire" size="sm" onClick={() => onChange({ name: '', url: '' })}>
                <X className="w-3.5 h-3.5" /> Remove
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-video rounded-sm backdrop-blur-3xl transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center justify-center border border-white/10 hover:border-indigo-500/40 bg-white/[0.02]">
            {value?.url ? (
              <div className="w-full h-full relative flex flex-col items-center justify-center bg-white/[0.03]">
                <FaFileWord className="w-24 h-24 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-sm bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white"
                  >
                    <RefreshCcw className="w-4 h-4 animate-[spin_4s_linear_infinite]" />
                    CHANGE ASSET
                  </motion.div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-sm">
                  <FileText className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] font-bold text-white tracking-wider truncate flex-1">{value.name || 'ACTIVE_DOC'}</span>
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
                  <FilePlus className="w-8 h-8 text-white/50" />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">No docx Selected</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Click here to Select one</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent border border-white/50 p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white mt-8">
          <InternalDocxVault
            selectedUrl={value?.url}
            onDocxSelect={val => {
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

Now your task is implement those three features in page.tsx so user can add audio, documents, and pdf to it.