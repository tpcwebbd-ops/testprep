'use client';

import { useState } from 'react';
import { Loader2, Pencil, Trash2, Plus, MoreVertical, CheckSquare, XSquare } from 'lucide-react';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useGetPageBuilderQuery,
  useGetPageBuilderByIdQuery,
  useAddPageBuilderMutation,
  useUpdatePageBuilderMutation,
  useDeletePageBuilderMutation,
  useBulkUpdatePageBuilderMutation,
  useBulkDeletePageBuilderMutation,
} from '@/app/workshop/page-builder/redux/features/page-builder/pageBuilderSlice';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

const iconOptions: string[] = [
  'Home',
  'Shield',
  'Layers',
  'Sparkles',
  'FileText',
  'Settings',
  'Users',
  'Package',
  'Globe',
  'Database',
  'Code',
  'Zap',
  'Target',
  'TrendingUp',
  'Activity',
];

interface PageFormData {
  title: string;
  path: string;
  iconName: string;
  isActive: boolean;
}

interface PageData {
  _id: string;
  title: string;
  path: string;
  iconName: string;
  isActive: boolean;
  content?: Array<{
    id: string;
    title: string;
    sectionUid: string;
    serialNumber: number;
    isActive: boolean;
    picture: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

const initialFormData: PageFormData = {
  title: '',
  path: '/',
  iconName: 'Home',
  isActive: true,
};

const Page = () => {
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);

  // Refactored dialog state management
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const [formData, setFormData] = useState<PageFormData>(initialFormData);

  const { data: pagesData, isLoading: isPagesLoading } = useGetPageBuilderQuery({ q: '', page: 1, limit: 100 });
  const { data: selectedPageData } = useGetPageBuilderByIdQuery(selectedPageId || '', { skip: !selectedPageId });
  const [addPage, { isLoading: isAdding }] = useAddPageBuilderMutation();
  const [updatePage, { isLoading: isUpdating }] = useUpdatePageBuilderMutation();
  const [deletePage, { isLoading: isDeleting }] = useDeletePageBuilderMutation();
  const [bulkUpdatePages, { isLoading: isBulkUpdating }] = useBulkUpdatePageBuilderMutation();
  const [bulkDeletePages, { isLoading: isBulkDeleting }] = useBulkDeletePageBuilderMutation();

  const pages = (pagesData?.data?.sections || []) as PageData[];

  const closeDialog = () => {
    setActiveDialog(null);
    setFormData(initialFormData);
    setSelectedPageId(null);
    setPageToDelete(null);
  };

  const handleAddPage = async () => {
    if (!formData.title || !formData.path) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await addPage({
        title: formData.title,
        path: formData.path,
        iconName: formData.iconName,
        isActive: formData.isActive,
        content: [],
      }).unwrap();

      toast.success('Page created successfully!');
      closeDialog();
    } catch (error) {
      console.error('Failed to add page:', error);
      toast.error('Failed to create page');
    }
  };

  const handleEditClick = (page: PageData) => {
    setSelectedPageId(page._id);
    setFormData({
      title: page.title,
      path: page.path,
      iconName: page.iconName || 'Home',
      isActive: page.isActive,
    });
    setActiveDialog('edit');
  };

  const handleUpdatePage = async () => {
    if (!selectedPageId || !formData.title || !formData.path) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await updatePage({
        id: selectedPageId,
        title: formData.title,
        path: formData.path,
        iconName: formData.iconName,
        isActive: formData.isActive,
      }).unwrap();

      toast.success('Page updated successfully!');
      closeDialog();
    } catch (error) {
      console.error('Failed to update page:', error);
      toast.error('Failed to update page');
    }
  };

  const handleDeleteClick = (pageId: string) => {
    setPageToDelete(pageId);
    setActiveDialog('delete');
  };

  const handleDeletePage = async () => {
    if (!pageToDelete) return;

    try {
      await deletePage(pageToDelete).unwrap();
      toast.success('Page deleted successfully!');
      closeDialog();
    } catch (error) {
      console.error('Failed to delete page:', error);
      toast.error('Failed to delete page');
    }
  };

  const handleSelectPage = (pageId: string, checked: boolean) => {
    if (checked) {
      setSelectedPages([...selectedPages, pageId]);
    } else {
      setSelectedPages(selectedPages.filter(id => id !== pageId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPages(pages.map(page => page._id));
    } else {
      setSelectedPages([]);
    }
  };

  const handleBulkActivate = async () => {
    if (selectedPages.length === 0) {
      toast.error('Please select pages to activate');
      return;
    }

    try {
      await bulkUpdatePages({
        ids: selectedPages,
        isActive: true,
      }).unwrap();

      toast.success(`${selectedPages.length} page(s) activated successfully!`);
      setSelectedPages([]);
    } catch (error) {
      console.error('Failed to activate pages:', error);
      toast.error('Failed to activate pages');
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedPages.length === 0) {
      toast.error('Please select pages to deactivate');
      return;
    }

    try {
      await bulkUpdatePages({
        ids: selectedPages,
        isActive: false,
      }).unwrap();

      toast.success(`${selectedPages.length} page(s) deactivated successfully!`);
      setSelectedPages([]);
    } catch (error) {
      console.error('Failed to deactivate pages:', error);
      toast.error('Failed to deactivate pages');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPages.length === 0) {
      toast.error('Please select pages to delete');
      return;
    }

    try {
      await bulkDeletePages({ ids: selectedPages }).unwrap();
      toast.success(`${selectedPages.length} page(s) deleted successfully!`);
      setSelectedPages([]);
      closeDialog();
    } catch (error) {
      console.error('Failed to delete pages:', error);
      toast.error('Failed to delete pages');
    }
  };

  if (isPagesLoading) {
    return (
      <main className="min-h-screen bg-transparent p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <p className="text-white/80">Loading pages...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Page Management</h1>
            <p className="text-white/60 text-sm mt-1">Manage all your pages and sections</p>
          </div>
          <Button
            onClick={() => setActiveDialog('add')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Page
          </Button>
        </div>

        {selectedPages.length > 0 && (
          <div className="mb-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg flex items-center justify-between">
            <span className="text-white">{selectedPages.length} page(s) selected</span>
            <div className="flex gap-2">
              <Button
                onClick={handleBulkActivate}
                disabled={isBulkUpdating}
                variant="outline"
                size="sm"
                className="border-green-500/30 text-green-400 hover:bg-green-500/10"
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                Activate
              </Button>
              <Button
                onClick={handleBulkDeactivate}
                disabled={isBulkUpdating}
                variant="outline"
                size="sm"
                className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
              >
                <XSquare className="w-4 h-4 mr-2" />
                Deactivate
              </Button>
              <Button
                onClick={() => setActiveDialog('bulk-delete')}
                disabled={isBulkDeleting}
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}

        {pages.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Checkbox id="selectAll" checked={selectedPages.length === pages.length} onCheckedChange={handleSelectAll} className="border-purple-500/30" />
              <Label htmlFor="selectAll" className="text-gray-300 cursor-pointer">
                Select All
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.map(page => {
                const Icon = (Icons[page.iconName as keyof typeof Icons] || Icons.Home) as LucideIcon;
                const isSelected = selectedPages.includes(page._id);

                return (
                  <Card key={page._id} className={`bg-slate-900/50 border-purple-500/30 transition-all ${isSelected ? 'ring-2 ring-purple-500' : ''}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex items-center gap-3 flex-1">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={checked => handleSelectPage(page._id, checked as boolean)}
                          className="border-purple-500/30"
                        />
                        <Icon className="w-5 h-5 text-purple-400" />
                        <CardTitle className="text-white text-lg">{page.title}</CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-slate-800 border-purple-500/30">
                          <DropdownMenuItem onClick={() => handleEditClick(page)} className="text-white hover:bg-slate-700 cursor-pointer">
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(page._id)} className="text-red-400 hover:bg-red-500/10 cursor-pointer">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-400">
                        <div className="flex flex-col gap-2">
                          <span className="text-sm">
                            <span className="font-semibold">Path:</span> {page.path}
                          </span>
                          <span className="text-sm">
                            <span className="font-semibold">Status:</span>{' '}
                            <span className={page.isActive ? 'text-green-400' : 'text-red-400'}>{page.isActive ? 'Active' : 'Inactive'}</span>
                          </span>
                          <span className="text-sm">
                            <span className="font-semibold">Sections:</span> {page.content?.length || 0}
                          </span>
                        </div>
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-white/80 text-lg mb-4">No pages found</p>
            <p className="text-white/60">Click the &quot;Add New Page&quot; button to create your first page</p>
          </div>
        )}

        <Dialog open={activeDialog === 'add'} onOpenChange={isOpen => !isOpen && closeDialog()}>
          <DialogContent className="bg-slate-900 border-purple-500/30">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Page</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">
                  Page Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Dashboard"
                  className="bg-slate-800 border-purple-500/30 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="path" className="text-gray-300">
                  Path *
                </Label>
                <Input
                  id="path"
                  value={formData.path}
                  onChange={e => setFormData({ ...formData, path: e.target.value })}
                  placeholder="e.g., /dashboard"
                  className="bg-slate-800 border-purple-500/30 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon" className="text-gray-300">
                  Icon
                </Label>
                <Select value={formData.iconName} onValueChange={value => setFormData({ ...formData, iconName: value })}>
                  <SelectTrigger className="bg-slate-800 border-purple-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-500/30">
                    {iconOptions.map(iconName => {
                      const IconComponent = Icons[iconName as keyof typeof Icons] as LucideIcon;
                      return (
                        <SelectItem key={iconName} value={iconName} className="text-white hover:bg-slate-700">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" />
                            <span>{iconName}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={checked => setFormData({ ...formData, isActive: checked as boolean })}
                  className="border-purple-500/30"
                />
                <Label htmlFor="isActive" className="text-gray-300 cursor-pointer">
                  Active
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleAddPage}
                disabled={isAdding}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Page'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={activeDialog === 'edit'} onOpenChange={isOpen => !isOpen && closeDialog()}>
          <DialogContent className="bg-slate-900 border-purple-500/30">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Page</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editTitle" className="text-gray-300">
                  Page Title *
                </Label>
                <Input
                  id="editTitle"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Dashboard"
                  className="bg-slate-800 border-purple-500/30 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editPath" className="text-gray-300">
                  Path *
                </Label>
                <Input
                  id="editPath"
                  value={formData.path}
                  onChange={e => setFormData({ ...formData, path: e.target.value })}
                  placeholder="e.g., /dashboard"
                  className="bg-slate-800 border-purple-500/30 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editIcon" className="text-gray-300">
                  Icon
                </Label>
                <Select value={formData.iconName} onValueChange={value => setFormData({ ...formData, iconName: value })}>
                  <SelectTrigger className="bg-slate-800 border-purple-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-500/30">
                    {iconOptions.map(iconName => {
                      const IconComponent = Icons[iconName as keyof typeof Icons] as LucideIcon;
                      return (
                        <SelectItem key={iconName} value={iconName} className="text-white hover:bg-slate-700">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" />
                            <span>{iconName}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="editIsActive"
                  checked={formData.isActive}
                  onCheckedChange={checked => setFormData({ ...formData, isActive: checked as boolean })}
                  className="border-purple-500/30"
                />
                <Label htmlFor="editIsActive" className="text-gray-300 cursor-pointer">
                  Active
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleUpdatePage}
                disabled={isUpdating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Page'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={activeDialog === 'delete'} onOpenChange={isOpen => !isOpen && closeDialog()}>
          <DialogContent className="bg-slate-900 border-red-500/30">
            <DialogHeader>
              <DialogTitle className="text-white">Delete Page</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-white/80">Are you sure you want to delete this page? This action cannot be undone.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog} className="border-purple-500/30 text-white hover:bg-white/10">
                Cancel
              </Button>
              <Button onClick={handleDeletePage} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={activeDialog === 'bulk-delete'} onOpenChange={isOpen => !isOpen && closeDialog()}>
          <DialogContent className="bg-slate-900 border-red-500/30">
            <DialogHeader>
              <DialogTitle className="text-white">Bulk Delete Pages</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-white/80">Are you sure you want to delete {selectedPages.length} page(s)? This action cannot be undone.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog} className="border-purple-500/30 text-white hover:bg-white/10">
                Cancel
              </Button>
              <Button onClick={handleBulkDelete} disabled={isBulkDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                {isBulkDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete All'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
};

export default Page;
