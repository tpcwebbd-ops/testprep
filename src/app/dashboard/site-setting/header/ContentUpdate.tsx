'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Globe, Settings, Edit3, Save, X, Users, Briefcase, Link2, Calendar, Mail, Sparkles } from 'lucide-react';
// import { useHeaderStore } from './store'; // Adjust path as per your project structure
// import { useUpdateHeaderDataMutation } from './rtk-api'; // Adjust path as per your project structure
// import { NavData } from './interface'; // Adjust path as per your project structure
// import { handleError, handleSuccess, isApiErrorResponse } from '@/components/common/utils';

// Mock interfaces and data for demonstration
interface NavData {
  id: string;
  baseInfo: {
    firstName: string;
    lastName: string;
  };
  about: {
    groupTitle: string;
    fullName: string;
    description: string;
    links: Array<{
      id: string;
      title: string;
      url: string;
      description?: string;
    }>;
  };
  services: {
    groupTitle: string;
    data: Array<{
      title: string;
      href: string;
      description: string;
    }>;
  };
  othersLink: Array<{
    id: string;
    title: string;
    url: string;
  }>;
}

// Mock data
const mockHeaderData: NavData = {
  id: '1',
  baseInfo: {
    firstName: 'John',
    lastName: 'Doe',
  },
  about: {
    groupTitle: 'About Me',
    fullName: 'John Doe',
    description: 'A passionate developer creating amazing digital experiences.',
    links: [
      { id: '1', title: 'Portfolio', url: 'https://johndoe.com', description: 'My personal portfolio' },
      { id: '2', title: 'Blog', url: 'https://blog.johndoe.com', description: 'Technical articles and insights' },
    ],
  },
  services: {
    groupTitle: 'Services',
    data: [
      { title: 'Web Development', href: '/services/web', description: 'Modern web applications' },
      { title: 'Mobile Apps', href: '/services/mobile', description: 'Cross-platform mobile solutions' },
    ],
  },
  othersLink: [
    { id: '1', title: 'Contact', url: '/contact' },
    { id: '2', title: 'Resume', url: '/resume' },
  ],
};

const HeaderManagementPage: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHeaderData, setSelectedHeaderData] = useState<NavData | null>(null);
  const [formData, setFormData] = useState<NavData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [headerData] = useState<NavData>(mockHeaderData);

  const { data: session } = useSession();
  const userName = session?.user?.name || 'Unknown User';
  const userEmail = session?.user?.email || 'user@example.com';

  useEffect(() => {
    if (selectedHeaderData) {
      setFormData(selectedHeaderData);
    }
  }, [selectedHeaderData]);

  const handleEditClick = () => {
    setSelectedHeaderData(headerData);
    setIsEditModalOpen(true);
  };

  const handleBaseInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => (prev ? { ...prev, baseInfo: { ...prev.baseInfo, [name]: value } } : null));
  };

  const handleAboutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => (prev ? { ...prev, about: { ...prev.about, [name]: value } } : null));
  };

  const handleAboutLinkChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return null;
      const updatedLinks = [...prev.about.links];
      updatedLinks[index] = { ...updatedLinks[index], [name]: value };
      return { ...prev, about: { ...prev.about, links: updatedLinks } };
    });
  };

  const handleServiceLinkChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return null;
      const updatedServices = [...prev.services.data];
      updatedServices[index] = { ...updatedServices[index], [name]: value };
      return { ...prev, services: { ...prev.services, data: updatedServices } };
    });
  };

  const handleOtherLinkChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return null;
      const updatedOthers = [...prev.othersLink];
      updatedOthers[index] = { ...updatedOthers[index], [name]: value };
      return { ...prev, othersLink: updatedOthers };
    });
  };

  const handleSaveChanges = async () => {
    if (!formData) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saved data:', formData);
      setIsEditModalOpen(false);
      setSelectedHeaderData(null);
    } catch (error) {
      console.error('Failed to update:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedHeaderData(null);
    }
    setIsEditModalOpen(isOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Header Management</h1>
                <p className="text-sm text-gray-500">Manage your website&lsquo;s navigation and content</p>
              </div>
            </div>
            <Button
              onClick={handleEditClick}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Header
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Base Info Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Base Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">First Name</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {headerData.baseInfo.firstName}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Name</span>
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                    {headerData.baseInfo.lastName}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Section Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>About Section</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{headerData.about.groupTitle}</h3>
                  <p className="text-sm text-gray-600 mt-1">{headerData.about.fullName}</p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{headerData.about.description}</p>
                <div className="flex flex-wrap gap-2">
                  {headerData.about.links.map((link, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Link2 className="h-3 w-3 mr-1" />
                      {link.title}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5" />
                <span>Services</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">{headerData.services.groupTitle}</h3>
                <div className="space-y-3">
                  {headerData.services.data.map((service, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 text-sm">{service.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{service.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Other Links Section */}
        <Card className="mt-8 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Other Links</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {headerData.othersLink.map((link, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg hover:from-orange-50 hover:to-red-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <div className="p-1 bg-orange-200 rounded">
                      <Link2 className="h-3 w-3 text-orange-700" />
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{link.title}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 truncate">{link.url}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Info */}
        <Card className="mt-8 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">Last Updated by</p>
                  <p className="text-sm opacity-90">{userName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{userEmail}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleOnOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 -m-6 mb-6">
            <DialogTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Edit Header Data</span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-2">
            <div className="space-y-8">
              {/* Base Info */}
              <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2 text-blue-900">
                  <User className="h-5 w-5" />
                  <span>Base Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-blue-800 font-medium">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData?.baseInfo.firstName || ''}
                      onChange={handleBaseInfoChange}
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-blue-800 font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData?.baseInfo.lastName || ''}
                      onChange={handleBaseInfoChange}
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>
              </section>

              {/* About Section */}
              <section className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2 text-emerald-900">
                  <Users className="h-5 w-5" />
                  <span>About Section</span>
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="aboutGroupTitle" className="text-emerald-800 font-medium">
                        Group Title
                      </Label>
                      <Input
                        id="aboutGroupTitle"
                        name="groupTitle"
                        value={formData?.about.groupTitle || ''}
                        onChange={handleAboutChange}
                        className="border-emerald-200 focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-emerald-800 font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData?.about.fullName || ''}
                        onChange={handleAboutChange}
                        className="border-emerald-200 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aboutDescription" className="text-emerald-800 font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="aboutDescription"
                      name="description"
                      value={formData?.about.description || ''}
                      onChange={handleAboutChange}
                      rows={3}
                      className="border-emerald-200 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <h4 className="font-medium mb-4 text-emerald-800">About Links</h4>
                    <div className="space-y-4">
                      {formData?.about.links.map((link, index) => (
                        <div key={link.id} className="bg-white p-4 rounded-lg border border-emerald-200 shadow-sm">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-emerald-700">Title</Label>
                              <Input
                                name="title"
                                value={link.title}
                                onChange={e => handleAboutLinkChange(index, e)}
                                className="border-emerald-200 focus:border-emerald-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-emerald-700">URL</Label>
                              <Input
                                name="url"
                                value={link.url}
                                onChange={e => handleAboutLinkChange(index, e)}
                                className="border-emerald-200 focus:border-emerald-500"
                              />
                            </div>
                          </div>
                          <div className="mt-4 space-y-2">
                            <Label className="text-sm font-medium text-emerald-700">Description</Label>
                            <Textarea
                              name="description"
                              value={link.description || ''}
                              onChange={e => handleAboutLinkChange(index, e)}
                              rows={2}
                              className="border-emerald-200 focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Services Section */}
              <section className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2 text-purple-900">
                  <Briefcase className="h-5 w-5" />
                  <span>Services Section</span>
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="servicesGroupTitle" className="text-purple-800 font-medium">
                      Group Title
                    </Label>
                    <Input
                      id="servicesGroupTitle"
                      name="groupTitle"
                      value={formData?.services.groupTitle || ''}
                      onChange={e => setFormData(prev => (prev ? { ...prev, services: { ...prev.services, groupTitle: e.target.value } } : null))}
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium mb-4 text-purple-800">Service Links</h4>
                    <div className="space-y-4">
                      {formData?.services.data.map((service, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-purple-700">Title</Label>
                              <Input
                                name="title"
                                value={service.title}
                                onChange={e => handleServiceLinkChange(index, e)}
                                className="border-purple-200 focus:border-purple-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-purple-700">URL (href)</Label>
                              <Input
                                name="href"
                                value={service.href}
                                onChange={e => handleServiceLinkChange(index, e)}
                                className="border-purple-200 focus:border-purple-500"
                              />
                            </div>
                          </div>
                          <div className="mt-4 space-y-2">
                            <Label className="text-sm font-medium text-purple-700">Description</Label>
                            <Textarea
                              name="description"
                              value={service.description}
                              onChange={e => handleServiceLinkChange(index, e)}
                              rows={2}
                              className="border-purple-200 focus:border-purple-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Other Links */}
              <section className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2 text-orange-900">
                  <Globe className="h-5 w-5" />
                  <span>Other Links</span>
                </h3>
                <div className="space-y-4">
                  {formData?.othersLink.map((link, index) => (
                    <div key={link.id} className="bg-white p-4 rounded-lg border border-orange-200 shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-orange-700">Title</Label>
                          <Input
                            name="title"
                            value={link.title}
                            onChange={e => handleOtherLinkChange(index, e)}
                            className="border-orange-200 focus:border-orange-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-orange-700">URL</Label>
                          <Input
                            name="url"
                            value={link.url}
                            onChange={e => handleOtherLinkChange(index, e)}
                            className="border-orange-200 focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <Separator className="my-4" />

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 text-sm text-gray-600 flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>
                Last updated by {userName} ({userEmail})
              </span>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="border-gray-300 hover:bg-gray-50">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeaderManagementPage;
