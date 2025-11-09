'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import ImageUploadManager from '@/components/dashboard-ui/ImageUploadManager';
import ImageUploadFieldSingle from '@/components/dashboard-ui/ImageUploadFieldSingle';

interface SectionData {
  id: string;
  title: string;
  image: string;
  heading: string;
  description: string;
  featuredLabel: string;
  buttonPrimary: string;
  buttonSecondary: string;
  studentCount: string;
  enrollmentText: string;
}

interface AdminSection1Props {
  data?: SectionData;
}

const defaultData: SectionData = {
  id: 'adsfdsfdfdsaa',
  title: 'Most common Component',
  image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  heading: 'Lecture 45',
  description:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio reprehenderit aliquid harum quae deserunt repudiandae assumenda, atque eos a ad placeat vel vitae.',
  featuredLabel: 'Featured Content',
  buttonPrimary: 'Learn More',
  buttonSecondary: 'View Details',
  studentCount: '2.5k+ Students',
  enrollmentText: 'Already enrolled',
};

const AdminSection1 = ({ data }: AdminSection1Props) => {
  const [formData, setFormData] = useState<SectionData>(data || defaultData);

  const handleFieldChange = (name: keyof SectionData, value: string | null) => {
    if (value !== null) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center ">
      <div className="max-w-6xl lg:max-w-7xl w-full">
        <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10" />

          <div className="relative p-8 lg:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">Edit Section Content</h2>
              <p className="text-gray-400">Update all section fields below</p>
            </div>

            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="id" className="text-right text-white">
                  ID
                </Label>
                <div className="col-span-3">
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={e => handleFieldChange('id', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    placeholder="Section ID"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right text-white">
                  Title
                </Label>
                <div className="col-span-3">
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={e => handleFieldChange('title', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    placeholder="Section Title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right text-white">
                  Image URL
                </Label>
                <div className="col-span-3">
                  <ImageUploadFieldSingle label="Section Image" value={formData.image} onChange={url => handleFieldChange('image', url)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="heading" className="text-right text-white">
                  Heading
                </Label>
                <div className="col-span-3">
                  <Input
                    id="heading"
                    value={formData.heading}
                    onChange={e => handleFieldChange('heading', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    placeholder="Lecture 45"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right text-white pt-3">
                  Description
                </Label>
                <div className="col-span-3">
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e => handleFieldChange('description', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 min-h-[120px]"
                    placeholder="Section description..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="featuredLabel" className="text-right text-white">
                  Featured Label
                </Label>
                <div className="col-span-3">
                  <Input
                    id="featuredLabel"
                    value={formData.featuredLabel}
                    onChange={e => handleFieldChange('featuredLabel', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    placeholder="Featured Content"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="buttonPrimary" className="text-right text-white">
                  Primary Button
                </Label>
                <div className="col-span-3">
                  <Input
                    id="buttonPrimary"
                    value={formData.buttonPrimary}
                    onChange={e => handleFieldChange('buttonPrimary', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    placeholder="Learn More"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="buttonSecondary" className="text-right text-white">
                  Secondary Button
                </Label>
                <div className="col-span-3">
                  <Input
                    id="buttonSecondary"
                    value={formData.buttonSecondary}
                    onChange={e => handleFieldChange('buttonSecondary', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    placeholder="View Details"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="studentCount" className="text-right text-white">
                  Student Count
                </Label>
                <div className="col-span-3">
                  <Input
                    id="studentCount"
                    value={formData.studentCount}
                    onChange={e => handleFieldChange('studentCount', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    placeholder="2.5k+ Students"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="enrollmentText" className="text-right text-white">
                  Enrollment Text
                </Label>
                <div className="col-span-3">
                  <Input
                    id="enrollmentText"
                    value={formData.enrollmentText}
                    onChange={e => handleFieldChange('enrollmentText', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    placeholder="Already enrolled"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleSubmit}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/30"
              >
                <Save className="w-5 h-5 mr-2" />
                Submit Changes
              </Button>
            </div>
          </div>

          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    </main>
  );
};

export default AdminSection1;
