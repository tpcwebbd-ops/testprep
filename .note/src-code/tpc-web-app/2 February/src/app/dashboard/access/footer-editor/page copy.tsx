'use client';

import React, { useState } from 'react';
import {
  useGetFootersQuery,
  useAddFooterMutation,
  useDeleteFooterMutation,
  useUpdateFooterMutation,
  FooterItem,
} from '@/redux/features/footer-settings/footerSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  X,
  Settings,
  Loader2,
  AlertCircle,
  Search,
  Save,
  CheckCircle2,
  ShieldAlert,
  Download,
  ChevronDown,
  ChevronUp,
  LayoutTemplate,
  MonitorPlay,
  FileJson,
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { cn } from '@/lib/utils';
import { AllFooter, AllFooterKeys } from '@/components/all-footer/all-footer-index/all-footer';

// --- Types ---
interface ApiError {
  data?: { message?: string; error?: string };
  error?: string;
  status?: number;
}

interface FooterDataPayload {
  templateKey: string;
  content: string; // JSON stringified data
}

// --- Reusable Components ---

const ToggleSwitch = ({ checked, onChange, disabled }: { checked: boolean; onChange: (val: boolean) => void; disabled?: boolean }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={e => {
      e.stopPropagation();
      if (!disabled) onChange(!checked);
    }}
    className={cn(
      'relative w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50',
      checked ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-neutral-700',
      disabled && 'opacity-50 cursor-not-allowed grayscale',
    )}
  >
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 700, damping: 30 }}
      className={cn('bg-white w-4 h-4 rounded-full shadow-md pointer-events-none', checked ? 'translate-x-5' : 'translate-x-0')}
    />
  </button>
);

const Button = ({
  onClick,
  children,
  variant = 'primary',
  className,
  disabled,
  loading,
  type = 'button',
}: {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'danger' | 'secondary' | 'ghost' | 'outline';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}) => {
  const variants = {
    primary:
      'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 border-transparent',
    danger: 'bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white shadow-lg shadow-rose-500/20 border-transparent',
    secondary: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700 hover:border-neutral-600',
    ghost: 'bg-transparent hover:bg-white/5 text-neutral-400 hover:text-white border-transparent',
    outline: 'bg-transparent border border-violet-500/30 text-violet-300 hover:bg-violet-500/10 hover:border-violet-500/60',
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all border disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className,
      )}
    >
      {loading ? <Loader2 className="animate-spin" size={18} /> : children}
    </motion.button>
  );
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  icon: Icon,
  maxWidth = 'max-w-lg',
  fullScreen = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ElementType;
  maxWidth?: string;
  fullScreen?: boolean;
}) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 top-[120px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className={cn(
            'relative z-10 bg-[#121212] border border-white/10 w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col',
            fullScreen ? 'h-[95vh] max-w-[95vw]' : `max-h-[80vh] ${maxWidth}`,
          )}
        >
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              {Icon && <Icon className="text-violet-500" size={24} />}
              {title}
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-0 relative">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// --- Main Page Component ---
const FooterManager = () => {
 
  // RTK Query Hooks
  const { data: footers = [], isLoading, isError, refetch } = useGetFootersQuery();
  const [addFooter, { isLoading: isAdding }] = useAddFooterMutation();
  const [updateFooter, { isLoading: isUpdating }] = useUpdateFooterMutation();
  const [deleteFooter, { isLoading: isDeleting }] = useDeleteFooterMutation();

  // Local State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isEditContentOpen, setIsEditContentOpen] = useState(false);

  // Selection State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [importTargetId, setImportTargetId] = useState<string | null>(null);
  const [expandedFooterId, setExpandedFooterId] = useState<string | null>(null);
  const [contentEditingFooter, setContentEditingFooter] = useState<FooterItem | null>(null);

  const [formData, setFormData] = useState<Partial<FooterItem>>({
    name: '',
    disabledPaths: [],
    isEnabled: true,
    data: {},
  });
  const [pathInput, setPathInput] = useState('');

  // Helper to extract error message
  const getErrorMessage = (err: unknown) => {
    const error = err as ApiError;
    return error?.data?.message || error?.data?.error || error?.error || 'An unexpected error occurred.';
  };

  // --- Handlers: Basic CRUD ---

  const handleOpenAdd = () => {
    setFormData({ name: '', disabledPaths: [], isEnabled: true, data: {} });
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleOpenEditSettings = (footer: FooterItem) => {
    setFormData({
      _id: footer?._id,
      name: footer?.name || '',
      disabledPaths: footer?.disabledPaths ? [...footer.disabledPaths] : [],
      isEnabled: footer?.isEnabled ?? true,
      data: footer?.data || {},
    });
    setEditingId(footer?._id);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  // --- Handlers: Content & Import ---

  const handleOpenImport = (id: string) => {
    setImportTargetId(id);
    setIsImportOpen(true);
  };

  const handleSelectTemplate = async (key: string) => {
    if (!importTargetId) return;

    // Get default data from template
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const templateData = (AllFooter as any)[key]?.data;

    // Construct payload structure
    const payload: FooterDataPayload = {
      templateKey: key,
      content: JSON.stringify(templateData),
    };

    // Find original footer to preserve other fields
    const original = footers.find(f => f._id === importTargetId);
    if (!original) return;

    const updatedFooter = { ...original, data: payload };

    toast.promise(updateFooter(updatedFooter).unwrap(), {
      loading: 'Importing template...',
      success: () => {
        setIsImportOpen(false);
        setImportTargetId(null);
        // Automatically expand the accordion to show the new footer
        setExpandedFooterId(original._id);
        return 'Template imported successfully!';
      },
      error: err => `Import failed: ${getErrorMessage(err)}`,
    });
  };

  const handleOpenEditContent = (footer: FooterItem) => {
    setContentEditingFooter(footer);
    setIsEditContentOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveContent = async (newSettings: any) => {
    if (!contentEditingFooter) return;

    // We need to keep the existing templateKey
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentData = contentEditingFooter.data as any;
    const templateKey = currentData?.templateKey;

    if (!templateKey) {
      toast.error('Template key missing, cannot save.');
      return;
    }

    const payload: FooterDataPayload = {
      templateKey,
      content: JSON.stringify(newSettings),
    };

    const updatedFooter = { ...contentEditingFooter, data: payload };

    try {
      await updateFooter(updatedFooter).unwrap();
      // Toast is handled in MutationComponent usually, but we can double ensure here or rely on the mutation
      // We'll let the MutationComponent's `onSave` logic flow, but since `MutationFooter` calls `onSave` which is async
      setIsEditContentOpen(false);
      setContentEditingFooter(null);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to save content: ${getErrorMessage(err)}`);
    }
  };

  // --- Handlers: Paths ---
  const handleAddPath = () => {
    if (pathInput?.trim()) {
      setFormData(prev => ({
        ...prev,
        disabledPaths: [...(prev?.disabledPaths || []), { path: pathInput.trim(), isExcluded: true }],
      }));
      setPathInput('');
    }
  };

  const togglePathRule = (index: number) => {
    const newPaths = [...(formData?.disabledPaths || [])];
    if (newPaths[index]) {
      newPaths[index] = {
        ...newPaths[index],
        isExcluded: !newPaths[index]?.isExcluded,
      };
      setFormData({ ...formData, disabledPaths: newPaths });
    }
  };

  const removePath = (index: number) => {
    const newPaths = (formData?.disabledPaths || []).filter((_, i) => i !== index);
    setFormData({ ...formData, disabledPaths: newPaths });
  };

  // --- Handlers: Submit Settings ---
  const handleSubmitSettings = async () => {
    if (!formData?.name?.trim()) {
      toast.error('Validation Error', { description: 'Friendly Name is required.' });
      return;
    }

    const isEdit = !!editingId;
    const mutationPromise = isEdit ? updateFooter({ ...formData, _id: editingId }).unwrap() : addFooter(formData).unwrap();

    toast.promise(mutationPromise, {
      loading: isEdit ? 'Updating settings...' : 'Creating new footer...',
      success: () => {
        setIsFormOpen(false);
        return isEdit ? 'Settings updated!' : 'Footer created!';
      },
      error: err => `Failed to save: ${getErrorMessage(err)}`,
    });
  };

  const handleListToggle = async (footer: FooterItem) => {
    const newState = !footer?.isEnabled;
    toast.promise(updateFooter({ ...footer, isEnabled: newState }).unwrap(), {
      loading: 'Updating status...',
      success: newState ? 'Footer visible globally.' : 'Footer hidden globally.',
      error: err => `Failed: ${getErrorMessage(err)}`,
    });
  };

  const confirmDelete = async () => {
    if (deleteId) {
      toast.promise(deleteFooter(deleteId).unwrap(), {
        loading: 'Deleting...',
        success: () => {
          setIsDeleteOpen(false);
          setDeleteId(null);
          return 'Footer deleted.';
        },
        error: err => getErrorMessage(err),
      });
    }
  };

  // --- Render Helpers ---

  const renderFooterPreview = (footer: FooterItem) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = footer.data as any;
    if (!data || !data.templateKey || !data.content) return <div className="p-4 text-red-400">Invalid Data Structure</div>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = (AllFooter as any)[data.templateKey]?.query;

    if (!Component) return <div className="p-4 text-amber-400">Unknown Template: {data.templateKey}</div>;

    return (
      <div className="bg-slate-900/50 rounded-lg overflow-hidden border border-white/5 relative group/preview">
        {/* Block interaction in preview */}
        <div className="absolute inset-0 z-50 bg-transparent" />
        <div className="transform origin-top scale-[0.6] sm:scale-[0.8] lg:scale-100 w-full h-full origin-top-left pointer-events-none p-4">
          <Component data={data.content} />
        </div>
      </div>
    );
  };

  const renderMutationForm = () => {
    if (!contentEditingFooter) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = contentEditingFooter.data as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = (AllFooter as any)[data?.templateKey]?.mutation;

    if (!Component) return <div className="p-10 text-center text-white">Template Component Not Found</div>;

    return (
      <div className="h-full bg-slate-950 overflow-y-auto">
        <Component data={data.content} onSave={handleSaveContent} />
      </div>
    );
  };

  // Loading / Error
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center flex-col gap-6 relative overflow-hidden">
        <Loader2 className="text-violet-500 animate-spin" size={48} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Footers</h2>
          <Button onClick={() => refetch()} variant="secondary">
            Retry
          </Button>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 p-4 md:p-8 font-sans selection:bg-violet-500/30 relative">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-tr from-violet-500/5 via-transparent to-emerald-500/5 pointer-events-none" />

      <Toaster theme="dark" position="top-center" richColors closeButton toastOptions={{ style: { background: '#0a0a0a', border: '1px solid #262626' } }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white tracking-tight">
              Footer Manager
            </h1>
            <p className="text-neutral-400 mt-2 font-medium">Create, Customize & Deploy Global Footers</p>
          </div>
          <Button onClick={handleOpenAdd} className="w-full md:w-auto shadow-violet-500/25">
            <Plus size={20} strokeWidth={2.5} /> New Configuration
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {footers.length > 0 ? (
              footers.map(footer => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const hasData = footer.data && (footer.data as any).templateKey;
                const isExpanded = expandedFooterId === footer._id;

                return (
                  <motion.div
                    key={footer._id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl transition-all hover:border-violet-500/20"
                  >
                    {/* Header Row */}
                    <div className="p-5 md:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      {/* Left: Status & Info */}
                      <div className="flex items-center gap-5 w-full lg:w-auto">
                        <div className="relative">
                          <div
                            className={cn(
                              'w-3 h-3 rounded-full',
                              footer.isEnabled ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]' : 'bg-neutral-600',
                            )}
                          />
                          {footer.isEnabled && <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            {footer.name}
                            {/* Show Template Badge if exists */}
                            {hasData && (
                              <span className="text-[10px] font-mono bg-violet-500/10 text-violet-300 border border-violet-500/20 px-2 py-0.5 rounded uppercase">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {(footer.data as any).templateKey}
                              </span>
                            )}
                          </h3>
                          <div className="flex gap-3 text-xs text-neutral-500 mt-1.5">
                            <span className="flex items-center gap-1">
                              <ShieldAlert size={12} /> {footer.disabledPaths?.length || 0} Exclusions
                            </span>
                            <span className="flex items-center gap-1 border-l border-white/10 pl-3">
                              <span className={footer.isEnabled ? 'text-emerald-400' : 'text-neutral-500'}>
                                {footer.isEnabled ? 'Globally Active' : 'Disabled'}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Controls */}
                      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
                        {/* 1. Toggle Active */}
                        <div className="mr-4 flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                          <span className="text-xs font-medium text-neutral-400">Visibility</span>
                          <ToggleSwitch checked={!!footer.isEnabled} onChange={() => handleListToggle(footer)} disabled={isUpdating} />
                        </div>

                        {/* 2. Primary Action Button */}
                        {hasData ? (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setExpandedFooterId(isExpanded ? null : footer._id)}
                              className={cn(isExpanded && 'bg-violet-500/10 border-violet-500/50 text-white')}
                            >
                              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                              {isExpanded ? 'Hide Preview' : 'View Footer'}
                            </Button>
                            <Button onClick={() => handleOpenEditContent(footer)}>
                              <FileJson size={18} /> Edit Data
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="primary"
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20 border-transparent animate-pulse hover:animate-none"
                            onClick={() => footer._id && handleOpenImport(footer._id)}
                          >
                            <Download size={18} /> Import Template
                          </Button>
                        )}

                        {/* 3. Settings & Delete */}
                        <div className="flex gap-2 pl-4 border-l border-white/10 ml-2">
                          <Button variant="secondary" onClick={() => handleOpenEditSettings(footer)} className="!p-2.5">
                            <Settings size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => footer._id && handleOpenDelete(footer._id)}
                            className="!p-2.5 text-neutral-500 hover:text-rose-500"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Accordion: Preview Content */}
                    <AnimatePresence>
                      {isExpanded && hasData && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/10 bg-black/20"
                        >
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                                <MonitorPlay size={16} /> Live Preview
                              </h4>
                              <span className="text-xs text-neutral-600">Interact disabled in preview</span>
                            </div>
                            {renderFooterPreview(footer)}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]"
              >
                <div className="bg-neutral-800/50 p-4 rounded-full mb-4">
                  <Search className="text-neutral-500" size={32} />
                </div>
                <h3 className="text-lg font-medium text-white">No configurations found</h3>
                <Button onClick={handleOpenAdd} variant="secondary" className="mt-4">
                  Create First Footer
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- Modal 1: Settings (Create/Edit Config) --- */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? 'Edit Configuration' : 'Create Footer'} icon={Settings}>
        <div className="space-y-6 p-1">
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Friendly Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-neutral-700"
              placeholder="e.g. Marketing Footer"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="space-y-1">
              <span className="flex items-center gap-2 text-sm font-medium text-white">
                <CheckCircle2 size={16} className={formData.isEnabled ? 'text-emerald-500' : 'text-neutral-500'} />
                Global Visibility
              </span>
              <p className="text-xs text-neutral-500">Master switch for this footer</p>
            </div>
            <ToggleSwitch checked={!!formData.isEnabled} onChange={val => setFormData({ ...formData, isEnabled: val })} />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Path Exclusion Rules</label>
              <span className="text-[10px] bg-white/10 text-neutral-300 px-2 py-0.5 rounded-full">{formData.disabledPaths?.length || 0} active</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={pathInput}
                onChange={e => setPathInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddPath()}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-all placeholder:text-neutral-700"
                placeholder="/path/to/hide"
              />
              <button onClick={handleAddPath} className="bg-white/5 hover:bg-violet-500/20 border border-white/10 p-2.5 rounded-xl text-white">
                <Plus size={20} />
              </button>
            </div>

            <div className="bg-black/20 rounded-xl border border-white/5 min-h-[100px] max-h-[200px] overflow-y-auto p-2 space-y-2 custom-scrollbar">
              {formData.disabledPaths?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-sm font-mono text-amber-500 truncate max-w-[200px]">{item.path}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-black/40 px-2 py-1 rounded border border-white/5">
                      <span className={cn('text-[10px] font-bold uppercase', item.isExcluded ? 'text-rose-400' : 'text-neutral-500')}>
                        {item.isExcluded ? 'Hidden' : 'Visible'}
                      </span>
                      <ToggleSwitch checked={!!item.isExcluded} onChange={() => togglePathRule(idx)} />
                    </div>
                    <button onClick={() => removePath(idx)} className="p-1.5 hover:bg-rose-500/10 text-neutral-500 hover:text-rose-500 rounded-md">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <Button onClick={handleSubmitSettings} className="w-full" disabled={!formData.name} loading={isAdding || isUpdating}>
              <Save size={18} />
              {editingId ? 'Save Changes' : 'Create Footer'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* --- Modal 2: Import Template --- */}
      <Modal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} title="Select Template" icon={LayoutTemplate} maxWidth="max-w-2xl">
        <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AllFooterKeys.map(key => (
            <button
              key={key}
              onClick={() => handleSelectTemplate(key)}
              className="group relative flex flex-col items-center gap-4 p-6 bg-white/5 border border-white/5 rounded-xl hover:bg-violet-500/10 hover:border-violet-500/50 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-300 group-hover:scale-110 transition-transform">
                <LayoutTemplate size={24} />
              </div>
              <div className="text-center">
                <h4 className="font-bold text-white mb-1 group-hover:text-violet-300 capitalize">{key.replace(/-/g, ' ')}</h4>
                <p className="text-xs text-neutral-500">Click to import this design structure</p>
              </div>
            </button>
          ))}
        </div>
      </Modal>

      {/* --- Modal 3: Edit Footer Content (Full Screenish) --- */}
      <Modal
        isOpen={isEditContentOpen}
        onClose={() => setIsEditContentOpen(false)}
        title={`Edit ${contentEditingFooter?.name || 'Footer'} Data`}
        icon={FileJson}
        fullScreen
      >
        <div className="h-full">{renderMutationForm()}</div>
      </Modal>

      {/* --- Modal 4: Delete Confirmation --- */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Confirm Deletion" icon={Trash2}>
        <div className="text-center py-2">
          <div className="w-20 h-20 bg-rose-500/5 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 ring-1 ring-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
            <Trash2 size={36} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Delete this footer?</h3>
          <p className="text-neutral-400 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
            This action will permanently remove this configuration. This cannot be undone.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="secondary" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} loading={isDeleting}>
              Delete Forever
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FooterManager;
