Act as a senior Web App Developer specializing in Next.js and TypeScript, with a long-term vision for building a strong, scalable educational platform for our company. 

I will provide information about our company. Based on that, your task is to generate NextJS api (route.ts, model.ts, controller.ts) I will give you example of that. and You have to generate a page to customize the data. I will provide an image uploader component for uploading Images. 

aboutData 
```
const aboutData: AboutItem[] = [
  {
    id: 1,
    name: 'Our Mission',
    path: '/about/mission',
    icon: '<Globe2 />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/mission.svg',
    description:
      'At TestPrep Centre, our mission is to empower ambitious students across Bangladesh to achieve global academic success. We strive to provide world-class test preparation, scholarship guidance, and mentorship to help our students secure fully funded opportunities at top universities in the USA, UK, and Canada.',
  },
  {
    id: 2,
    name: 'About Our Centre',
    path: '/about/centre',
    icon: '<BookOpen />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/centre.svg',
    description:
      'Founded with the vision to bridge the gap between Bangladeshi students and international education, TestPrep Centre offers comprehensive online and hybrid learning programs. Our experienced instructors and personalized learning system ensure that each student reaches their highest potential in IELTS, GRE, and GMAT preparation.',
  },
  {
    id: 3,
    name: 'Courses We Offer',
    path: '/about/courses',
    icon: '<GraduationCap />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/courses.svg',
    description:
      'We offer expertly designed online courses that prepare students to excel in standardized tests required for global admission and scholarships. Each course is structured for maximum flexibility and real results.',
    childData: [
      {
        id: '3.1',
        name: 'IELTS Preparation',
        path: '/courses/ielts',
        icon: '<BookOpen />',
        image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
        svg: '/svgs/ielts.svg',
        description:
          'Our IELTS course focuses on improving your listening, reading, writing, and speaking skills with intensive practice sessions and expert feedback to help you achieve your target band score.',
      },
      {
        id: '3.2',
        name: 'GRE Preparation',
        path: '/courses/gre',
        icon: '<BookOpen />',
        image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
        svg: '/svgs/gre.svg',
        description:
          'Get ready for graduate studies abroad with our GRE course. We provide comprehensive coverage of quantitative reasoning, verbal reasoning, and analytical writing — with proven strategies for high scores.',
      },
      {
        id: '3.3',
        name: 'GMAT Preparation',
        path: '/courses/gmat',
        icon: '<BookOpen />',
        image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
        svg: '/svgs/gmat.svg',
        description:
          'Designed for MBA aspirants, our GMAT course offers structured lessons, mock tests, and performance tracking to help you stand out in competitive business school applications.',
      },
    ],
  },
  {
    id: 4,
    name: 'Scholarship Support',
    path: '/about/scholarship-support',
    icon: '<Medal />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/scholarship.svg',
    description:
      'We go beyond test preparation by helping students craft strong Statements of Purpose (SOPs), recommendation letters, and scholarship essays. Our experts provide step-by-step guidance to find and apply for full-funding opportunities, including TA, GA, and research assistantships.',
  },
  {
    id: 5,
    name: 'Why Choose Us',
    path: '/about/why-choose-us',
    icon: '<Star />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/why-choose-us.svg',
    description:
      "With our proven success record and student-centered teaching approach, TestPrep Centre is trusted by learners nationwide. We combine expert mentorship, modern online tools, and data-driven learning insights to maximize each student's success rate in both tests and scholarship applications.",
  },
  {
    id: 6,
    name: 'Our Approach',
    path: '/about/our-approach',
    icon: '<Target />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/approach.svg',
    description:
      'Our teaching philosophy blends personalized mentorship with adaptive technology. Every course is data-driven — tracking progress, identifying weaknesses, and continuously improving performance through feedback and simulation-based learning.',
  },
  {
    id: 7,
    name: 'Contact & Location',
    path: '/about/contact',
    icon: '<MapPin />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/contact.svg',
    description:
      "TestPrep Centre is based in Bangladesh and proudly serves students nationwide through our online learning platform. Whether you're in Dhaka, Chittagong, or anywhere else, our instructors and counselors are available online to guide you toward your study abroad dream.",
    childData: [
      {
        id: '7.1',
        name: 'Head Office',
        path: '/contact/head-office',
        icon: '<Building2 />',
        image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
        svg: '/svgs/head-office.svg',
        description:
          'Our main office operates in Dhaka, providing both in-person and online counseling sessions for students preparing for their next academic journey abroad.',
      },
      {
        id: '7.2',
        name: 'Get in Touch',
        path: '/contact/get-in-touch',
        icon: '<Phone />',
        image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
        svg: '/svgs/get-in-touch.svg',
        description:
          "Reach out to us anytime through our website or social channels for free counseling sessions and course information. We're here to help you every step of the way.",
      },
    ],
  },
];
```

for api 
route.ts 
```
import { NextResponse } from 'next/server';
import { getUsers, createUser, updateUser, deleteUser, getUserById } from './controller';
import { handleRateLimit } from '../../utils/rate-limit';

// ✅ Unified response handler
const formatResponse = (data: unknown, message: string, status: number) => {
  return NextResponse.json({ data, message }, { status });
};

// ✅ GET
export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const id = new URL(req.url).searchParams.get('id');
  const result = id ? await getUserById(req) : await getUsers(req);
  return formatResponse(result.data, result.message, result.status);
}

// ✅ POST
export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const result = await createUser(req);
  return formatResponse(result.data, result.message, result.status);
}

// ✅ PUT
export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const result = await updateUser(req);
  return formatResponse(result.data, result.message, result.status);
}

// ✅ DELETE
export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const result = await deleteUser(req);
  return formatResponse(result.data, result.message, result.status);
}

```

model.ts 
```
import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// ✅ Explicitly set collection name to match your MongoDB data
export default mongoose.models.User || mongoose.model('User', userSchema, 'user');

```

controller.ts 
```
import mongoose, { FilterQuery } from 'mongoose';
import User from './model';

interface IResponse {
  data: unknown;
  message: string;
  status: number;
}

// ✅ Centralized response helper
const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
  data,
  message,
  status,
});

// ✅ Connect to MongoDB once and reuse
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.mongooseURI!);
  }
}

// ✅ CREATE User
export async function createUser(req: Request): Promise<IResponse> {
  try {
    await connectDB();
    const userData = await req.json();
    const newUser = await User.create(userData);
    return formatResponse(newUser, 'User created successfully', 201);
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 11000) {
      const err = error as { keyValue?: Record<string, unknown> };
      return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
    }
    throw error; // Re-throw other errors to be handled by `withDB`
  }
}

// ✅ GET single User by ID
export async function getUserById(req: Request): Promise<IResponse> {
  await connectDB();
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return formatResponse(null, 'User ID is required', 400);

  const user = await User.findById(id);
  if (!user) return formatResponse(null, 'User not found', 404);

  return formatResponse(user, 'User fetched successfully', 200);
}

// ✅ GET all Users
export async function getUsers(req: Request): Promise<IResponse> {
  await connectDB();
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;
  const searchQuery = url.searchParams.get('q');

  let filter: FilterQuery<unknown> = {};

  if (searchQuery) {
    filter = {
      $or: [{ name: { $regex: searchQuery, $options: 'i' } }, { email: { $regex: searchQuery, $options: 'i' } }],
    };
  }

  const users = await User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await User.countDocuments(filter);

  return formatResponse({ users, total, page, limit }, 'Users fetched successfully', 200);
}

// ✅ UPDATE User
export async function updateUser(req: Request): Promise<IResponse> {
  await connectDB();
  const { id, ...updateData } = await req.json();

  const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!updatedUser) return formatResponse(null, 'User not found', 404);

  return formatResponse(updatedUser, 'User updated successfully', 200);
}

// ✅ DELETE User
export async function deleteUser(req: Request): Promise<IResponse> {
  await connectDB();
  const { id } = await req.json();

  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) return formatResponse(null, 'User not found', 404);

  return formatResponse({ deletedCount: 1 }, 'User deleted successfully', 200);
}

```


for dashboard page customize 
imageUploadFileSingle.tsx 
```
// ImageUploadFieldSingle.tsx (This code is correct)

'use client'

import Image from 'next/image'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { Loader, UploadCloud, X } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// Define a clear and reusable props interface
interface ImageUploadFieldSingleProps {
    // The value can be a URL string or null if no image is selected
    value: string | null
    // The callback to notify the parent of changes (new URL or null for removal)
    onChange: (newImageUrl: string | null) => void
    // Optional props for customization
    label?: string
    className?: string
}

export default function ImageUploadFieldSingle({
    value,
    onChange, // This is the correct prop name
    label = 'Profile Image',
    className,
}: ImageUploadFieldSingleProps) {
    const [loading, setLoading] = useState(false)
    const uniqueId = `single-image-upload-${label.replace(/\s+/g, '-')}`

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]
        if (!file) return

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('image', file)

            const response = await fetch(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
                { method: 'POST', body: formData }
            )

            const data = await response.json()

            if (data.success) {
                const newImageUrl = data.data.url

                // Optional: Save metadata to your own backend
                await fetch('/api/media', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        delete_url: data.data.delete_url,
                        url: newImageUrl,
                        display_url: data.data.display_url,
                    }),
                })

                toast.success('Image uploaded successfully!')
                // Notify the parent component of the new URL using the onChange prop
                onChange(newImageUrl)
            } else {
                throw new Error(
                    data.error?.message || 'Failed to upload image.'
                )
            }
        } catch (error) {
            console.error('Error uploading profile image:', error)
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred.'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
            e.target.value = '' // Reset the file input
        }
    }

    // Handler to remove the image, notifying the parent by passing null
    const handleRemoveImage = () => {
        onChange(null)
    }

    return (
        <div className={cn('flex flex-col items-start gap-2', className)}>
            <Label htmlFor={uniqueId}>{label}</Label>
            <div className="relative group w-36 h-36 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                        <Loader className="h-8 w-8 animate-spin" />
                        <span className="text-sm">Uploading...</span>
                    </div>
                ) : value ? (
                    <>
                        <Image
                            src={value}
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                                aria-label="Remove image"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <label
                                htmlFor={uniqueId}
                                className="p-2 bg-white text-gray-800 rounded-full cursor-pointer hover:bg-gray-200"
                                aria-label="Change image"
                            >
                                <UploadCloud className="w-4 h-4" />
                            </label>
                        </div>
                    </>
                ) : (
                    <label
                        htmlFor={uniqueId}
                        className="flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 cursor-pointer transition-colors"
                    >
                        <UploadCloud className="w-8 h-8" />
                        <span className="text-xs mt-1">Upload Image</span>
                    </label>
                )}
            </div>
            <Input
                id={uniqueId}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading}
                className="hidden"
            />
        </div>
    )
}

```



Now your task is to generate 

route.ts,
model.ts,
controller.ts  

page.tsx (for update about page data) and implement Image upload option in side the pagel.tsx, you have to generate a single page. 