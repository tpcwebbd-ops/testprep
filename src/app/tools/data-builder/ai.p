Look at the page.tsx 'src/app/tools/data-builder/page.tsx'.
here is example of redux 
    'src/redux/features/sidebars/sidebarsSlice.ts'
    'src/redux/features/page-builder/pageBuilderSlice.ts'
    'src/redux/features/menu-editor/menuEditorSlice.ts'
    'src/redux/features/footer-editor/footerSlice.ts'
    
and here is deafult data for sidebars 
```
{
    "data": {
        "sidebars": [
            {
                "_id": "69e4a3886e54e154c5de1def",
                "sl_no": 10,
                "name": "Credential",
                "path": "/dashboard",
                "iconName": "HelpCircle",
                "children": [
                    {
                        "sl_no": 11,
                        "name": "Account",
                        "path": "/dashboard/credential/account",
                        "iconName": "Settings"
                    },
                    {
                        "sl_no": 12,
                        "name": "Session",
                        "path": "/dashboard/credential/session",
                        "iconName": "AlertTriangle"
                    },
                    {
                        "sl_no": 13,
                        "name": "Verification",
                        "path": "/dashboard/credential/verification",
                        "iconName": "BookmarkPlus"
                    }
                ],
                "createdAt": "2026-04-19T09:42:32.332Z",
                "updatedAt": "2026-06-30T09:54:25.790Z",
                "__v": 0
            },
            {
                "_id": "69e4a3e06e54e154c5de1dfc",
                "sl_no": 20,
                "name": "Admin",
                "path": "/dashboard/",
                "iconName": "ShieldCheck",
                "children": [
                    {
                        "sl_no": 21,
                        "name": "Access",
                        "path": "/dashboard/admin/access",
                        "iconName": "FileSignature"
                    },
                    {
                        "sl_no": 22,
                        "name": "Role",
                        "path": "/dashboard/admin/role",
                        "iconName": "FileSignature"
                    },
                    {
                        "sl_no": 23,
                        "name": "Sidebar",
                        "path": "/dashboard/admin/sidebar",
                        "iconName": "ScrollText"
                    },
                    {
                        "sl_no": 24,
                        "name": "Menu Editor",
                        "path": "/dashboard/admin/menu-editor",
                        "iconName": "ScrollText"
                    },
                    {
                        "sl_no": 25,
                        "name": "Page Builder",
                        "path": "/dashboard/admin/page-builder",
                        "iconName": "ShieldCheck"
                    }
                ],
                "createdAt": "2026-04-19T09:44:00.040Z",
                "updatedAt": "2026-06-30T09:54:25.790Z",
                "__v": 0
            },
            {
                "_id": "69e4a4356e54e154c5de1e0c",
                "sl_no": 30,
                "name": "Media",
                "path": "/dashboard/media",
                "iconName": "Image",
                "children": [],
                "createdAt": "2026-04-19T09:45:25.844Z",
                "updatedAt": "2026-06-30T09:54:25.790Z",
                "__v": 0
            },
            {
                "_id": "69e4a4456e54e154c5de1e10",
                "sl_no": 40,
                "name": "Profile",
                "path": "/dashboard/profile",
                "iconName": "User",
                "children": [],
                "createdAt": "2026-04-19T09:45:41.278Z",
                "updatedAt": "2026-06-30T09:54:25.790Z",
                "__v": 0
            },
            {
                "_id": "69e4a46a6e54e154c5de1e14",
                "sl_no": 50,
                "name": "Courses",
                "path": "/dashboard/courses",
                "iconName": "Calendar",
                "children": [],
                "createdAt": "2026-04-19T09:46:18.615Z",
                "updatedAt": "2026-06-30T09:54:25.790Z",
                "__v": 0
            },
            {
                "_id": "69e4a48e6e54e154c5de1e18",
                "sl_no": 60,
                "name": "My Course",
                "path": "/dashboard/my-course",
                "iconName": "Server",
                "children": [],
                "createdAt": "2026-04-19T09:46:54.421Z",
                "updatedAt": "2026-06-30T09:54:25.790Z",
                "__v": 0
            },
            {
                "_id": "69e4a4a46e54e154c5de1e1c",
                "sl_no": 70,
                "name": "Enrollments",
                "path": "/dashboard/enrollments",
                "iconName": "Package",
                "children": [],
                "createdAt": "2026-04-19T09:47:16.110Z",
                "updatedAt": "2026-06-30T09:54:25.790Z",
                "__v": 0
            },
            {
                "_id": "6a379763f3ee23362edb8942",
                "sl_no": 80,
                "name": "DB Builder",
                "path": "/dashboard/db-builder",
                "iconName": "Wrench",
                "children": [],
                "createdAt": "2026-06-21T07:48:51.155Z",
                "updatedAt": "2026-06-30T09:54:25.790Z",
                "__v": 0
            },
            {
                "_id": "6a3d01ab4904e16dbd00f379",
                "sl_no": 90,
                "name": "News",
                "path": "/dashboard/news",
                "iconName": "FileBadge",
                "children": [],
                "createdAt": "2026-06-25T10:23:39.390Z",
                "updatedAt": "2026-06-30T09:54:25.790Z",
                "__v": 0
            },
            {
                "_id": "6a43922e8ccb344aad26869b",
                "sl_no": 100,
                "name": "DynamoDB",
                "path": "/dashboard/dynamodbParent",
                "iconName": "Menu",
                "children": [
                    {
                        "sl_no": 101,
                        "name": "Dynamo 1",
                        "path": "/dashboard/dynamodbParent/dynamoc-1",
                        "iconName": "Edit2"
                    },
                    {
                        "sl_no": 102,
                        "name": "Dynamo 2",
                        "path": "/dashboard/dynamodbParent/dynamoc-2",
                        "iconName": "Edit2"
                    }
                ],
                "createdAt": "2026-06-30T09:53:50.418Z",
                "updatedAt": "2026-06-30T09:54:25.790Z",
                "__v": 0
            },
            {
                "_id": "6a4395b18ccb344aad268741",
                "sl_no": 110,
                "name": "bymo-1",
                "path": "/dashboard/bymo-1",
                "iconName": "ShieldCheck",
                "children": [],
                "createdAt": "2026-06-30T10:08:49.283Z",
                "updatedAt": "2026-06-30T10:08:49.283Z",
                "__v": 0
            }
        ],
        "total": 11,
        "page": 1,
        "limit": 100
    },
    "message": "Sidebars fetched successfully",
    "status": 200
}
```

here is example of page-Builder
```
{
    "data": {
        "pages": [
            {
                "_id": "69e0dd33f53d77428dd1acd6",
                "pageName": "Courses",
                "path": "/courses",
                "isActive": true,
                "content": [
                    {
                        "id": "section-section-uid-38-1776344594325",
                        "key": "section-uid-38",
                        "type": "section",
                        "heading": "Sections section-uid-38",
                        "path": "/section-uid-38",
                        "data": {
                            "badgeText": "Available in Dhaka & Chittagong",
                            "headingPrefix": "Join Our",
                            "headingHighlight": "Offline IELTS",
                            "headingSuffix": "Classes",
                            "subTitle": "For Personalized Learning Experience",
                            "tab1Label": "Offline Classes",
                            "tab2Label": "Online Classes",
                            "courses": [
                                {
                                    "title": "IELTS Comprehensive",
                                    "level": "Beginner Level",
                                    "levelColorClass": "bg-blue-100 text-blue-700",
                                    "description": "Perfect for beginners who want to build strong English fundamentals before taking IELTS. Comprehensive coverage of all four skills.",
                                    "features": [
                                        "Language Club & Student Lounge",
                                        "3 Mock Tests with Teacher Feedback",
                                        "No Extra Charge for Course Materials",
                                        "Small Batch Size (Max 12 Students)",
                                        "Weekend Practice Sessions"
                                    ],
                                    "duration": "4.5 Months",
                                    "classes": "50+ Classes",
                                    "price": "৳15,000",
                                    "popular": false
                                },
                                {
                                    "title": "IELTS Focus",
                                    "level": "Intermediate Level",
                                    "levelColorClass": "bg-green-100 text-green-700",
                                    "description": "Designed for students with basic English knowledge. Focus on developing IELTS-specific skills and achieving band 6.0-7.0.",
                                    "features": [
                                        "Language Club & Student Lounge",
                                        "3 Mock Tests with Teacher Feedback",
                                        "No Extra Charge for Course Materials",
                                        "Speaking Practice Sessions",
                                        "Writing Task Correction"
                                    ],
                                    "duration": "3 Months",
                                    "classes": "30+ Classes",
                                    "price": "৳12,000",
                                    "popular": true
                                },
                                {
                                    "title": "IELTS Crash",
                                    "level": "Intensive",
                                    "levelColorClass": "bg-red-100 text-red-700",
                                    "description": "Fast-track intensive course for students who need to prepare quickly. Focused exam strategies and daily practice sessions.",
                                    "features": [
                                        "3 Mock Tests with Personalized Teacher",
                                        "No Extra Charge for Course Materials",
                                        "Daily Practice Sessions",
                                        "One-on-One Speaking Practice",
                                        "Express Score Improvement"
                                    ],
                                    "duration": "1.5 Months",
                                    "classes": "30+ Classes",
                                    "price": "৳18,000",
                                    "popular": false,
                                    "schedule": [
                                        "Morning Batch: 10:00 AM - 1:30 PM",
                                        "Evening Batch: 5:00 PM - 8:30 PM"
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        "id": "section-section-uid-40-1776344446973",
                        "key": "section-uid-40",
                        "type": "section",
                        "heading": "Sections section-uid-40",
                        "path": "/section-uid-40",
                        "data": {
                            "title": "Ready to Start Your IELTS Journey?",
                            "subtitle": "Join thousands of successful students who achieved their target band scores",
                            "buttonPrimaryText": "Book Free Consultation",
                            "buttonSecondaryText": "Watch Class Demo",
                            "contactLabel": "Call us now for immediate enrollment",
                            "contactNumber": "📞 +880 1XXX-XXXXXX"
                        }
                    },
                    {
                        "id": "section-section-uid-32-1776344466982",
                        "key": "section-uid-32",
                        "type": "section",
                        "heading": "Sections section-uid-32",
                        "path": "/section-uid-32",
                        "data": {
                            "cards": [
                                {
                                    "title": "Reading Mastery",
                                    "description": "Advanced reading techniques and strategies to achieve Band 8+ scores with expert guidance.",
                                    "iconName": "BookOpen",
                                    "gradient": "from-red-500 to-pink-500"
                                },
                                {
                                    "title": "Listening Excellence",
                                    "description": "Expert listening skills development with comprehensive practice materials and techniques.",
                                    "iconName": "Play",
                                    "gradient": "from-green-500 to-teal-500"
                                },
                                {
                                    "title": "Writing Perfection",
                                    "description": "Task 1 & 2 writing strategies with high band score techniques and personalized feedback.",
                                    "iconName": "Award",
                                    "gradient": "from-blue-500 to-indigo-500"
                                }
                            ]
                        }
                    },
                    {
                        "id": "section-section-uid-34-1776344488518",
                        "key": "section-uid-34",
                        "type": "section",
                        "heading": "Sections section-uid-34",
                        "path": "/section-uid-34",
                        "data": {
                            "badgeText": "Bangladesh's #1 IELTS Preparation Platform",
                            "headingLine1": "Free Online",
                            "headingHighlight": "IELTS",
                            "headingLine2": "Real Mock Tests With",
                            "headingGradient": "Explanations",
                            "subtitle": "Master your IELTS with authentic practice tests, instant results, and detailed explanations. Join thousands of successful students who achieved their target band scores.",
                            "features": [
                                "Real Test Format",
                                "Instant Results",
                                "Detailed Explanations",
                                "Expert Guidance"
                            ]
                        }
                    }
                ],
                "createdAt": "2026-04-16T12:59:31.760Z",
                "updatedAt": "2026-04-16T13:03:30.254Z",
                "__v": 0
            },
            {
                "_id": "69356c9cfbf2f4271c3ccb41",
                "pageName": "Home",
                "path": "/",
                "isActive": true,
                "content": [
                    {
                        "id": "section-section-uid-6-1765439780945",
                        "key": "section-uid-6",
                        "type": "section",
                        "heading": "Sections section-uid-6",
                        "path": "/section-uid-6",
                        "data": {
                            "sectionUid": "section-uid-6",
                            "id": "community_section_005",
                            "title": "Join the IELTS Community",
                            "image": "https://i.ibb.co.com/PGXYXwTq/img.jpg",
                            "heading": "Growing Fast",
                            "description": "Connect with thousands of developers worldwide. Share knowledge, collaborate on projects, get mentorship, and grow your career in a supportive environment.",
                            "featuredLabel": "Global Network",
                            "buttonPrimary": "Join Community",
                            "buttonSecondary": "Explore Features",
                            "studentCount": "50k+ Members",
                            "enrollmentText": "Active developers",
                            "secondaryImage": "https://i.ibb.co.com/PGXYXwTq/img.jpg",
                            "subtitle": "Learn. Build. Connect. Grow.",
                            "additionalDescription": "Our thriving community offers daily discussions, weekly webinars, monthly hackathons, and year-round mentorship programs. Whether you are just starting or are an experienced professional, you will find value.",
                            "ctaText": "Free forever - Premium features available",
                            "highlights": [
                                "Weekly webinars",
                                "Career resources",
                                "Open source projects"
                            ]
                        }
                    },
                    {
                        "id": "section-section-uid-10-1765439788273",
                        "key": "section-uid-10",
                        "type": "section",
                        "heading": "Sections section-uid-10",
                        "path": "/section-uid-10",
                        "data": {
                            "id": "Section 10 Button Text",
                            "title": "Success",
                            "subTitle": "Stories",
                            "description": "Scroll down to witness the journey of excellence. One story at a time."
                        }
                    },
                    {
                        "id": "section-section-uid-12-1765439793977",
                        "key": "section-uid-12",
                        "type": "section",
                        "heading": "Sections section-uid-12",
                        "path": "/section-uid-12",
                        "data": {
                            "id": "section-12-experience",
                            "title": "Professional",
                            "subTitle": "Journey",
                            "description": "A timeline of dedication, innovation, and impactful contributions across the tech industry.",
                            "experiences": [
                                {
                                    "id": "exp-001",
                                    "year": "2022 - Present",
                                    "companyName": "TechFlow Systems",
                                    "role": "Senior Frontend Engineer",
                                    "description": "Leading the core UI team in rebuilding the legacy dashboard into a modern, high-performance React application.",
                                    "lastAchievement": "Reduced initial load time by 45% using server components.",
                                    "highlightMilestone": {
                                        "label": "Users Impacted",
                                        "value": "2M+"
                                    },
                                    "features": [
                                        "Next.js 14",
                                        "TypeScript",
                                        "System Architecture",
                                        "Team Leadership"
                                    ]
                                },
                                {
                                    "id": "exp-002",
                                    "year": "2020 - 2022",
                                    "companyName": "Creative Pulse",
                                    "role": "UI/UX Developer",
                                    "description": "Bridged the gap between design and engineering, creating interactive micro-sites and award-winning landing pages.",
                                    "lastAchievement": "Won the Awwwards Site of the Day for the 2021 Rebrand.",
                                    "highlightMilestone": {
                                        "label": "Conversion Rate",
                                        "value": "+150%"
                                    },
                                    "features": [
                                        "Framer Motion",
                                        "WebGL",
                                        "Interactive Design",
                                        "GSAP"
                                    ]
                                },
                                {
                                    "id": "exp-003",
                                    "year": "2018 - 2020",
                                    "companyName": "StartUp Inc.",
                                    "role": "Junior Web Developer",
                                    "description": "Collaborated with cross-functional teams to ship features rapidly in an agile environment.",
                                    "lastAchievement": "Successfully migrated the payment gateway without downtime.",
                                    "highlightMilestone": {
                                        "label": "Features Shipped",
                                        "value": "45+"
                                    },
                                    "features": [
                                        "React",
                                        "Redux",
                                        "Stripe API",
                                        "Agile/Scrum"
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        "id": "section-section-uid-10-1765439801208",
                        "key": "section-uid-10",
                        "type": "section",
                        "heading": "Sections section-uid-10",
                        "path": "/section-uid-10",
                        "data": {
                            "id": "Section 10 Button Text",
                            "title": "Success",
                            "subTitle": "Stories",
                            "description": "Scroll down to witness the journey of excellence. One story at a time."
                        }
                    },
                    {
                        "id": "section-section-uid-43-1765439806146",
                        "key": "section-uid-43",
                        "type": "section",
                        "heading": "Sections section-uid-43",
                        "path": "/section-uid-43",
                        "data": {
                            "title": "Journeys of Excellence",
                            "subtitle": "Following the path of success, one story at a time.",
                            "stories": [
                                {
                                    "id": "1",
                                    "name": "Sarah Jenkins",
                                    "university": "Stanford University",
                                    "subject": "Computer Science",
                                    "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
                                    "description": "Overcoming initial struggles with algorithms, Sarah dedicated her weekends to coding bootcamps. Her perseverance led to a breakthrough internship at Google."
                                },
                                {
                                    "id": "2",
                                    "name": "Michael Chen",
                                    "university": "MIT",
                                    "subject": "Robotics Engineering",
                                    "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
                                    "description": "Michael balanced a full-time job while pursuing his masters. His innovative thesis on autonomous drone navigation caught the attention of Tesla."
                                },
                                {
                                    "id": "3",
                                    "name": "Priya Patel",
                                    "university": "Cambridge University",
                                    "subject": "Biotechnology",
                                    "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop",
                                    "description": "Starting with limited funding, Priya secured multiple grants. Her work on sustainable bio-plastics is now being adopted by major packaging firms."
                                },
                                {
                                    "id": "4",
                                    "name": "David Okonjo",
                                    "university": "Oxford University",
                                    "subject": "Economics",
                                    "image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop",
                                    "description": "David moved countries to pursue his education. He graduated top of his class and founded a fintech startup helping underbanked communities."
                                },
                                {
                                    "id": "5",
                                    "name": "Emma Wilson",
                                    "university": "Harvard Medical School",
                                    "subject": "Neurology",
                                    "image": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop",
                                    "description": "Emma spent years volunteering in remote clinics. Her empathy-driven approach earned her a fellowship at Johns Hopkins."
                                }
                            ]
                        }
                    },
                    {
                        "id": "section-section-uid-40-1765439815640",
                        "key": "section-uid-40",
                        "type": "section",
                        "heading": "Sections section-uid-40",
                        "path": "/section-uid-40",
                        "data": {
                            "title": "Ready to Start Your IELTS Journey?",
                            "subtitle": "Join thousands of successful students who achieved their target band scores",
                            "buttonPrimaryText": "Book Free Consultation",
                            "buttonSecondaryText": "Watch Class Demo",
                            "contactLabel": "Call us now for immediate enrollment",
                            "contactNumber": "📞 +880 1XXX-XXXXXX"
                        }
                    },
                    {
                        "id": "section-section-uid-9-1765439820280",
                        "key": "section-uid-9",
                        "type": "section",
                        "heading": "Sections section-uid-9",
                        "path": "/section-uid-9",
                        "data": {
                            "id": "Section 9 Button Text",
                            "title": "Be The Next Story",
                            "subTitle": "Your future begins here. Join a community of innovators and leaders shaping the world of tomorrow.",
                            "buttonText": "Apply Now",
                            "buttonUrl": "#"
                        }
                    },
                    {
                        "id": "section-section-uid-29-1765441869748",
                        "key": "section-uid-29",
                        "type": "section",
                        "heading": "Sections section-uid-29",
                        "path": "/section-uid-29",
                        "data": {
                            "height": "h-16",
                            "width": "w-full",
                            "background": "transparent",
                            "display": "block"
                        }
                    },
                    {
                        "id": "section-section-uid-26-1765439833489",
                        "key": "section-uid-26",
                        "type": "section",
                        "heading": "Sections section-uid-26",
                        "path": "/section-uid-26",
                        "data": {
                            "tags": [
                                {
                                    "id": "1",
                                    "text": "Technology",
                                    "link": "#"
                                },
                                {
                                    "id": "2",
                                    "text": "Design",
                                    "link": "#"
                                },
                                {
                                    "id": "3",
                                    "text": "Artificial Intelligence",
                                    "link": "#"
                                },
                                {
                                    "id": "4",
                                    "text": "Development",
                                    "link": "#"
                                },
                                {
                                    "id": "5",
                                    "text": "UI/UX",
                                    "link": "#"
                                },
                                {
                                    "id": "6",
                                    "text": "Business",
                                    "link": "#"
                                },
                                {
                                    "id": "7",
                                    "text": "Marketing",
                                    "link": "#"
                                }
                            ],
                            "autoplaySpeed": 2500,
                            "isAutoplay": true,
                            "infiniteLoop": true,
                            "pauseOnHover": true,
                            "itemsPerSlide": 4,
                            "navPosition": "middle-outside",
                            "tagStyle": "glassy",
                            "gap": "md"
                        }
                    },
                    {
                        "id": "section-section-uid-29-1765440135192",
                        "key": "section-uid-29",
                        "type": "section",
                        "heading": "Sections section-uid-29",
                        "path": "/section-uid-29",
                        "data": {
                            "height": "h-16",
                            "width": "w-full",
                            "background": "transparent",
                            "display": "block"
                        }
                    }
                ],
                "createdAt": "2025-12-07T12:01:32.155Z",
                "updatedAt": "2026-02-01T06:55:42.262Z",
                "__v": 0
            },
            {
                "_id": "693a7420b8f90596fe3acb97",
                "pageName": "Contact ",
                "path": "/contact-us",
                "isActive": true,
                "content": [
                    {
                        "id": "form-form-personal-uid-1-1765438542748",
                        "key": "form-personal-uid-1",
                        "type": "form",
                        "heading": "Forms form-personal-uid-1",
                        "path": "/form-personal-uid-1",
                        "data": {
                            "formUid": "form-personal-uid-1",
                            "formTitle": "Student Personal Information",
                            "firstName": "Aarav",
                            "lastName": "Khan",
                            "email": "aarav.khan@example.com",
                            "phoneNumber": "+8801712345678",
                            "dateOfBirth": "1999-05-15",
                            "passportNumber": "A12345678",
                            "gender": "Male",
                            "submitButtonText": "Save & Next"
                        }
                    },
                    {
                        "id": "section-section-uid-18-1765438517276",
                        "key": "section-uid-18",
                        "type": "section",
                        "heading": "Sections section-uid-18",
                        "path": "/section-uid-18",
                        "data": [
                            {
                                "id": "loc-nyc",
                                "name": "Nexus Prime",
                                "type": "Headquarters",
                                "address": "15 Hudson Yards, Level 88",
                                "city": "New York",
                                "country": "USA",
                                "coordinates": {
                                    "lat": 40.7538,
                                    "lng": -74.0022
                                },
                                "contact": {
                                    "email": "nyc@nexus.protocol",
                                    "phone": "+1 (212) 555-0199",
                                    "manager": "Alex Mercer"
                                },
                                "image": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                "description": "Our primary command center overlooking the Hudson. dedicated to quantum UI research and executive operations.",
                                "features": [
                                    "Executive Suites",
                                    "Quantum Core",
                                    "Rooftop Helipad"
                                ],
                                "schedule": "Mon-Fri, 08:00 - 20:00 EST"
                            },
                            {
                                "id": "loc-tokyo",
                                "name": "Shibuya Node",
                                "type": "Research Lab",
                                "address": "Cerulean Tower, 26-1 Sakuragaokacho",
                                "city": "Tokyo",
                                "country": "Japan",
                                "coordinates": {
                                    "lat": 35.6562,
                                    "lng": 139.6993
                                },
                                "contact": {
                                    "email": "jp@nexus.protocol",
                                    "phone": "+81 3-5550-2341",
                                    "manager": "Yuki Tanaka"
                                },
                                "image": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                "description": "Advanced prototyping facility focused on haptic interfaces and neural link technologies.",
                                "features": [
                                    "Clean Room",
                                    "Haptic Lab",
                                    "Sleeping Pods"
                                ],
                                "schedule": "Mon-Sat, 09:00 - 22:00 JST"
                            },
                            {
                                "id": "loc-berlin",
                                "name": "Kreuzberg Hub",
                                "type": "Data Center",
                                "address": "Köpenicker Str. 126",
                                "city": "Berlin",
                                "country": "Germany",
                                "coordinates": {
                                    "lat": 52.5026,
                                    "lng": 13.4346
                                },
                                "contact": {
                                    "email": "de@nexus.protocol",
                                    "phone": "+49 30 555-0123",
                                    "manager": "Klaus Webber"
                                },
                                "image": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                "description": "The backbone of our European infrastructure. Zero-latency edge computing facility.",
                                "features": [
                                    "Server Farm",
                                    "Cooling Array",
                                    "Bunker Access"
                                ],
                                "schedule": "24/7 Operational"
                            }
                        ]
                    },
                    {
                        "id": "section-section-uid-9-1765438555836",
                        "key": "section-uid-9",
                        "type": "section",
                        "heading": "Sections section-uid-9",
                        "path": "/section-uid-9",
                        "data": {
                            "id": "Section 9 Button Text",
                            "title": "Be The Next Story",
                            "subTitle": "Your future begins here. Join a community of innovators and leaders shaping the world of tomorrow.",
                            "buttonText": "Apply Now",
                            "buttonUrl": "#"
                        }
                    }
                ],
                "createdAt": "2025-12-11T07:34:56.067Z",
                "updatedAt": "2025-12-11T07:35:58.198Z",
                "__v": 0
            },
            {
                "_id": "693a73e3b8f90596fe3acb82",
                "pageName": "About Us",
                "path": "/about-us",
                "isActive": true,
                "content": [
                    {
                        "id": "section-section-uid-4-1765438445044",
                        "key": "section-uid-4",
                        "type": "section",
                        "heading": "Sections section-uid-4",
                        "path": "/section-uid-4",
                        "data": {
                            "sectionUid": "section-uid-4",
                            "id": "event_section_003",
                            "title": "Global Design Summit 2025",
                            "image": "https://i.ibb.co.com/PGXYXwTq/img.jpg",
                            "heading": "March 15-17",
                            "description": "Join designers, innovators, and creative leaders from around the world for three days of inspiring talks, hands-on workshops, and networking opportunities.",
                            "featuredLabel": "Annual Conference",
                            "buttonPrimary": "Register Now",
                            "buttonSecondary": "View Schedule",
                            "studentCount": "3,500+ Attendees",
                            "enrollmentText": "Expected this year",
                            "secondaryImage": "https://i.ibb.co.com/PGXYXwTq/img.jpg",
                            "subtitle": "Where Creativity Meets Innovation",
                            "additionalDescription": "Experience keynotes from industry pioneers, participate in interactive workshops covering the latest design tools and methodologies.",
                            "ctaText": "Early bird pricing ends soon - Save 40%",
                            "highlights": [
                                "50+ expert speakers",
                                "Hands-on workshops",
                                "Networking events"
                            ]
                        }
                    },
                    {
                        "id": "section-section-uid-3-1765438458780",
                        "key": "section-uid-3",
                        "type": "section",
                        "heading": "Sections section-uid-3",
                        "path": "/section-uid-3",
                        "data": {
                            "sectionUid": "section-uid-3",
                            "id": "prod_section_002",
                            "title": "Revolutionary AI-Powered Analytics",
                            "image": "https://i.ibb.co.com/PGXYXwTq/img.jpg",
                            "heading": "New Release",
                            "description": "Transform your business intelligence with our state-of-the-art analytics platform. Get real-time insights, predictive forecasting, and actionable recommendations.",
                            "featuredLabel": "Enterprise Solution",
                            "buttonPrimary": "Start Free Trial",
                            "buttonSecondary": "See Demo",
                            "studentCount": "1,200+ Companies",
                            "enrollmentText": "Trust our platform",
                            "secondaryImage": "https://i.ibb.co.com/PGXYXwTq/img.jpg",
                            "subtitle": "Data-Driven Decision Making",
                            "additionalDescription": "Our platform integrates seamlessly with your existing tools and provides customizable dashboards that deliver insights in real-time.",
                            "ctaText": "No credit card required for 30-day trial",
                            "highlights": [
                                "99.9% uptime SLA",
                                "24/7 support",
                                "SOC 2 compliant"
                            ]
                        }
                    },
                    {
                        "id": "section-section-uid-5-1765438469172",
                        "key": "section-uid-5",
                        "type": "section",
                        "heading": "Sections section-uid-5",
                        "path": "/section-uid-5",
                        "data": {
                            "sectionUid": "section-uid-5",
                            "id": "agency_section_004",
                            "title": "Digital Excellence Delivered",
                            "image": "https://i.ibb.co.com/PGXYXwTq/img.jpg",
                            "heading": "Award Winning",
                            "description": "We are a full-service digital agency specializing in brand strategy, web development, and digital marketing. Our passionate team transforms ambitious ideas into exceptional digital experiences.",
                            "featuredLabel": "Top Rated Agency",
                            "buttonPrimary": "Start Project",
                            "buttonSecondary": "Our Portfolio",
                            "studentCount": "200+ Projects",
                            "enrollmentText": "Successfully delivered",
                            "secondaryImage": "https://i.ibb.co.com/PGXYXwTq/img.jpg",
                            "subtitle": "Strategy. Design. Development.",
                            "additionalDescription": "With over a decade of experience, we have partnered with startups, scale-ups, and established brands to create digital solutions that perform exceptionally.",
                            "ctaText": "Free consultation available - Let's discuss your vision",
                            "highlights": [
                                "95% client retention",
                                "Average 3x ROI",
                                "Agile methodology"
                            ]
                        }
                    }
                ],
                "createdAt": "2025-12-11T07:33:55.108Z",
                "updatedAt": "2025-12-11T07:34:31.858Z",
                "__v": 0
            },
            {
                "_id": "693a737ab8f90596fe3acb66",
                "pageName": "Student portal ",
                "path": "/student-portal",
                "isActive": true,
                "content": [
                    {
                        "id": "section-section-uid-25-1765438342820",
                        "key": "section-uid-25",
                        "type": "section",
                        "heading": "Sections section-uid-25",
                        "path": "/section-uid-25",
                        "data": {
                            "slides": [
                                {
                                    "id": "1",
                                    "image": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
                                    "title": "Modern Architecture",
                                    "description": "Explore the beauty of lines and spaces.",
                                    "buttonText": "View Project",
                                    "buttonLink": "#"
                                },
                                {
                                    "id": "2",
                                    "image": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
                                    "title": "Urban Design",
                                    "description": "Building the future of city living.",
                                    "buttonText": "Read More",
                                    "buttonLink": "#"
                                },
                                {
                                    "id": "3",
                                    "image": "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80",
                                    "title": "Interior Concepts",
                                    "description": "Minimalist approaches to daily life."
                                }
                            ],
                            "autoplaySpeed": 3000,
                            "isAutoplay": true,
                            "infiniteLoop": true,
                            "pauseOnHover": true,
                            "itemsPerSlide": 1,
                            "navPosition": "middle-inside",
                            "showArrowsOnHover": true,
                            "height": "fixed-md",
                            "overlayOpacity": 40
                        }
                    },
                    {
                        "id": "section-section-uid-10-1765438378277",
                        "key": "section-uid-10",
                        "type": "section",
                        "heading": "Sections section-uid-10",
                        "path": "/section-uid-10",
                        "data": {
                            "id": "Section 10 Button Text",
                            "title": "Success",
                            "subTitle": "Stories",
                            "description": "Scroll down to witness the journey of excellence. One story at a time."
                        }
                    },
                    {
                        "id": "section-section-uid-43-1765438361836",
                        "key": "section-uid-43",
                        "type": "section",
                        "heading": "Sections section-uid-43",
                        "path": "/section-uid-43",
                        "data": {
                            "title": "Journeys of Excellence",
                            "subtitle": "Following the path of success, one story at a time.",
                            "stories": [
                                {
                                    "id": "1",
                                    "name": "Sarah Jenkins",
                                    "university": "Stanford University",
                                    "subject": "Computer Science",
                                    "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
                                    "description": "Overcoming initial struggles with algorithms, Sarah dedicated her weekends to coding bootcamps. Her perseverance led to a breakthrough internship at Google."
                                },
                                {
                                    "id": "2",
                                    "name": "Michael Chen",
                                    "university": "MIT",
                                    "subject": "Robotics Engineering",
                                    "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
                                    "description": "Michael balanced a full-time job while pursuing his masters. His innovative thesis on autonomous drone navigation caught the attention of Tesla."
                                },
                                {
                                    "id": "3",
                                    "name": "Priya Patel",
                                    "university": "Cambridge University",
                                    "subject": "Biotechnology",
                                    "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop",
                                    "description": "Starting with limited funding, Priya secured multiple grants. Her work on sustainable bio-plastics is now being adopted by major packaging firms."
                                },
                                {
                                    "id": "4",
                                    "name": "David Okonjo",
                                    "university": "Oxford University",
                                    "subject": "Economics",
                                    "image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop",
                                    "description": "David moved countries to pursue his education. He graduated top of his class and founded a fintech startup helping underbanked communities."
                                },
                                {
                                    "id": "5",
                                    "name": "Emma Wilson",
                                    "university": "Harvard Medical School",
                                    "subject": "Neurology",
                                    "image": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop",
                                    "description": "Emma spent years volunteering in remote clinics. Her empathy-driven approach earned her a fellowship at Johns Hopkins."
                                }
                            ]
                        }
                    },
                    {
                        "id": "section-section-uid-9-1765438370204",
                        "key": "section-uid-9",
                        "type": "section",
                        "heading": "Sections section-uid-9",
                        "path": "/section-uid-9",
                        "data": {
                            "id": "Section 9 Button Text",
                            "title": "Be The Next Story",
                            "subTitle": "Your future begins here. Join a community of innovators and leaders shaping the world of tomorrow.",
                            "buttonText": "Apply Now",
                            "buttonUrl": "#"
                        }
                    }
                ],
                "createdAt": "2025-12-11T07:32:10.514Z",
                "updatedAt": "2025-12-11T07:33:17.715Z",
                "__v": 0
            },
            {
                "_id": "693a7333b8f90596fe3acb51",
                "pageName": "Free Resource",
                "path": "/free-resource",
                "isActive": true,
                "content": [
                    {
                        "id": "section-section-uid-8-1765438297877",
                        "key": "section-uid-8",
                        "type": "section",
                        "heading": "Sections section-uid-8",
                        "path": "/section-uid-8",
                        "data": {
                            "id": "AU-001",
                            "country": "Australia",
                            "city": [
                                "Sydney",
                                "Melbourne",
                                "Brisbane"
                            ],
                            "universitys": [
                                {
                                    "id": "UNI-AU-SYD",
                                    "name": "University of Sydney",
                                    "image": "https://i.ibb.co.com/PGXYXwTq/img.jpg",
                                    "location": "Sydney",
                                    "description": "Australia's first university, consistently ranked in the top 50 worldwide.",
                                    "courses": [
                                        {
                                            "id": "CRS-SYD-01",
                                            "name": "Master of Commerce",
                                            "tutionFees": "AUD 54,000 / year",
                                            "duration": "2 Years",
                                            "description": "Advanced business skills and leadership training.",
                                            "degreeLevelInfo": [
                                                {
                                                    "id": "DL-SYD-01-M",
                                                    "degreeLevel": "Master",
                                                    "tutionFees": "AUD 54,000 / year",
                                                    "duration": "2 Years"
                                                },
                                                {
                                                    "id": "DL-SYD-01-GD",
                                                    "degreeLevel": "Graduate Diploma",
                                                    "tutionFees": "AUD 40,000 / year",
                                                    "duration": "1 Year"
                                                }
                                            ],
                                            "applyBtnParms": [
                                                "Australia",
                                                "Sydney",
                                                "University of Sydney",
                                                "Master of Commerce"
                                            ],
                                            "applyBtnParmsDegreeLevel": [
                                                "Degree",
                                                "Level",
                                                "Commerce"
                                            ]
                                        },
                                        {
                                            "id": "CRS-SYD-02",
                                            "name": "Bachelor of Architecture",
                                            "tutionFees": "AUD 48,000 / year",
                                            "duration": "3 Years",
                                            "description": "Design environments for the future.",
                                            "degreeLevelInfo": [
                                                {
                                                    "id": "DL-SYD-02-B",
                                                    "degreeLevel": "Bachelor",
                                                    "tutionFees": "AUD 48,000 / year",
                                                    "duration": "3 Years"
                                                }
                                            ],
                                            "applyBtnParms": [
                                                "Australia",
                                                "Sydney",
                                                "University of Sydney",
                                                "Bachelor of Architecture"
                                            ],
                                            "applyBtnParmsDegreeLevel": [
                                                "Degree",
                                                "Level",
                                                "Architecture"
                                            ]
                                        },
                                        {
                                            "id": "CRS-SYD-03",
                                            "name": "Veterinary Medicine",
                                            "tutionFees": "AUD 62,000 / year",
                                            "duration": "5 Years",
                                            "description": "Comprehensive training in animal health.",
                                            "degreeLevelInfo": [
                                                {
                                                    "id": "DL-SYD-03-B",
                                                    "degreeLevel": "Bachelor",
                                                    "tutionFees": "AUD 62,000 / year",
                                                    "duration": "5 Years"
                                                },
                                                {
                                                    "id": "DL-SYD-03-D",
                                                    "degreeLevel": "Doctorate",
                                                    "tutionFees": "AUD 68,000 / year",
                                                    "duration": "4 Years"
                                                }
                                            ],
                                            "applyBtnParms": [
                                                "Australia",
                                                "Sydney",
                                                "University of Sydney",
                                                "Veterinary Medicine"
                                            ],
                                            "applyBtnParmsDegreeLevel": [
                                                "Degree",
                                                "Level",
                                                "VetMed"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "id": "UNI-AU-MEL",
                                    "name": "University of Melbourne",
                                    "image": "https://i.ibb.co.com/PGXYXwTq/img.jpg",
                                    "location": "Melbourne",
                                    "description": "A public research university located in Melbourne, Australia.",
                                    "courses": [
                                        {
                                            "id": "CRS-MEL-01",
                                            "name": "Biomedicine",
                                            "tutionFees": "AUD 50,000 / year",
                                            "duration": "3 Years",
                                            "description": "Understand the human body and disease.",
                                            "degreeLevelInfo": [
                                                {
                                                    "id": "DL-MEL-01-B",
                                                    "degreeLevel": "Bachelor",
                                                    "tutionFees": "AUD 50,000 / year",
                                                    "duration": "3 Years"
                                                }
                                            ],
                                            "applyBtnParms": [
                                                "Australia",
                                                "Melbourne",
                                                "University of Melbourne",
                                                "Biomedicine"
                                            ],
                                            "applyBtnParmsDegreeLevel": [
                                                "Degree",
                                                "Level",
                                                "Biomedicine"
                                            ]
                                        },
                                        {
                                            "id": "CRS-MEL-02",
                                            "name": "Juris Doctor (Law)",
                                            "tutionFees": "AUD 46,000 / year",
                                            "duration": "3 Years",
                                            "description": "Graduate law degree for aspiring lawyers.",
                                            "degreeLevelInfo": [
                                                {
                                                    "id": "DL-MEL-02-JD",
                                                    "degreeLevel": "Juris Doctor",
                                                    "tutionFees": "AUD 46,000 / year",
                                                    "duration": "3 Years"
                                                }
                                            ],
                                            "applyBtnParms": [
                                                "Australia",
                                                "Melbourne",
                                                "University of Melbourne",
                                                "Juris Doctor"
                                            ],
                                            "applyBtnParmsDegreeLevel": [
                                                "Degree",
                                                "Level",
                                                "Law"
                                            ]
                                        },
                                        {
                                            "id": "CRS-MEL-03",
                                            "name": "Fine Arts",
                                            "tutionFees": "AUD 38,000 / year",
                                            "duration": "3 Years",
                                            "description": "Visual art, acting, and music performance.",
                                            "degreeLevelInfo": [
                                                {
                                                    "id": "DL-MEL-03-B",
                                                    "degreeLevel": "Bachelor",
                                                    "tutionFees": "AUD 38,000 / year",
                                                    "duration": "3 Years"
                                                },
                                                {
                                                    "id": "DL-MEL-03-M",
                                                    "degreeLevel": "Master",
                                                    "tutionFees": "AUD 42,000 / year",
                                                    "duration": "2 Years"
                                                }
                                            ],
                                            "applyBtnParms": [
                                                "Australia",
                                                "Melbourne",
                                                "University of Melbourne",
                                                "Fine Arts"
                                            ],
                                            "applyBtnParmsDegreeLevel": [
                                                "Degree",
                                                "Level",
                                                "Arts"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "id": "UNI-AU-QLD",
                                    "name": "University of Queensland",
                                    "image": "https://i.ibb.co.com/PGXYXwTq/img.jpg",
                                    "location": "Brisbane",
                                    "description": "One of Australia's leading research and teaching institutions.",
                                    "courses": [
                                        {
                                            "id": "CRS-QLD-01",
                                            "name": "Marine Biology",
                                            "tutionFees": "AUD 45,000 / year",
                                            "duration": "3 Years",
                                            "description": "Study of marine organisms and ecosystems nearby the Great Barrier Reef.",
                                            "degreeLevelInfo": [
                                                {
                                                    "id": "DL-QLD-01-B",
                                                    "degreeLevel": "Bachelor",
                                                    "tutionFees": "AUD 45,000 / year",
                                                    "duration": "3 Years"
                                                }
                                            ],
                                            "applyBtnParms": [
                                                "Australia",
                                                "Brisbane",
                                                "University of Queensland",
                                                "Marine Biology"
                                            ],
                                            "applyBtnParmsDegreeLevel": [
                                                "Degree",
                                                "Level",
                                                "MarineBio"
                                            ]
                                        },
                                        {
                                            "id": "CRS-QLD-02",
                                            "name": "Information Technology",
                                            "tutionFees": "AUD 42,000 / year",
                                            "duration": "3 Years",
                                            "description": "Software engineering and systems design.",
                                            "degreeLevelInfo": [
                                                {
                                                    "id": "DL-QLD-02-B",
                                                    "degreeLevel": "Bachelor",
                                                    "tutionFees": "AUD 42,000 / year",
                                                    "duration": "3 Years"
                                                },
                                                {
                                                    "id": "DL-QLD-02-M",
                                                    "degreeLevel": "Master",
                                                    "tutionFees": "AUD 48,000 / year",
                                                    "duration": "2 Years"
                                                }
                                            ],
                                            "applyBtnParms": [
                                                "Australia",
                                                "Brisbane",
                                                "University of Queensland",
                                                "Information Technology"
                                            ],
                                            "applyBtnParmsDegreeLevel": [
                                                "Degree",
                                                "Level",
                                                "IT"
                                            ]
                                        },
                                        {
                                            "id": "CRS-QLD-03",
                                            "name": "Environmental Science",
                                            "tutionFees": "AUD 44,000 / year",
                                            "duration": "3 Years",
                                            "description": "Solutions to environmental issues.",
                                            "degreeLevelInfo": [
                                                {
                                                    "id": "DL-QLD-03-B",
                                                    "degreeLevel": "Bachelor",
                                                    "tutionFees": "AUD 44,000 / year",
                                                    "duration": "3 Years"
                                                }
                                            ],
                                            "applyBtnParms": [
                                                "Australia",
                                                "Brisbane",
                                                "University of Queensland",
                                                "Environmental Science"
                                            ],
                                            "applyBtnParmsDegreeLevel": [
                                                "Degree",
                                                "Level",
                                                "EnvSci"
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        "id": "section-section-uid-8-1765438301677",
                        "key": "section-uid-8",
                        "type": "section",
                        "heading": "Sections section-uid-8",
                        "path": "/section-uid-8",
                        "data": {
                            "id": "AU-001",
                            "country": "Australia",
                            "city": [
                                "Sydney",
                                "Melbourne",
                                "Brisbane"
                            ],
                            "universitys": [
                                {
                                    "id": "UNI-AU-SYD",
                                    "name": "University of Sydney",
                                    "image": "https://i.ibb.co.com/PGXYXwTq/img.jpg",
                                    "location": "Sydney",
                                    "description": "Australia's first university, consistently ranked in the top 50 worldwide.",
                                    "courses": [
                                        {
                                            "id": "CRS-SYD-01",
                                            "name": "Master of Commerce",
                                            "tutionFees": "AUD 54,000 / year",
                                            "duration": "2 Years",
                                            "description": "Advanced business skills and leadership training.",
                                            "degreeLevelInfo": [
                                                {
                                                    "id": "DL-SYD-01-M",
                                                    "degreeLevel": "Master",
                                                    "tutionFees": "AUD 54,000 / year",
                                                    "duration": "2 Years"
                                                },
                                                {
                                                    "id": "DL-SYD-01-GD",
                                                    "degreeLevel": "Graduate Diploma",
                                                    "tutionFees": "AUD 40,000 / year",
                                                    "duration": "1 Year"
                                                }
                                            ],
                                            "applyBtnParms": [
                                                "Australia",
                                                "Sydney",
                                                "University of Sydney",
                                                "Master of Commerce"
                                            ],
                                            "applyBtnParmsDegreeLevel": [
                                                "Degree",
                                                "Level",
                                                "Commerce"
                                            ]
                                        },
                                        {
                                            "id": "CRS-SYD-02",
                                            "name": "Bachelor of Architecture",
                                            "tutionFees": "AUD 48,000 / year",
                                            "duration": "3 Years",
                                            "description": "Design environments for the future.",
                                            "degreeLevelInfo": [
                                                {
                                                    "id": "DL-SYD-02-B",
                                                    "degreeLevel": "Bachelor",
                                                    "tutionFees": "AUD 48,000 / year",
                                                    "duration": "3 Years"
                                                }
                                            ],
                                            "applyBtnParms": [
                                                "Australia",
                                                "Sydney",
                                                "University of Sydney",
                                                "Bachelor of Architecture"
                                            ],
                                            "applyBtnParmsDegreeLevel": [
                                                "Degree",
                                                "Level",
                                                "Architecture"
                                            ]
                                        },
                                        {
                                            "id": "CRS-SYD-03",
                                            "name": "Veterinary Medicine",
                                            "tutionFees": "AUD 62,000 / year",
                                            "duration": "5 Years",
                                            "description": "Comprehensive training in animal health.",
                                            "degreeLevelInfo": [
                                                {
                                                    "id": "DL-SYD-03-B",
                                                    "degreeLevel": "Bachelor",
                                                    "tutionFees": "AUD 62,000 / year",
                                                    "duration": "5 Years"
                                                },
                                                {
                                                    "id": "DL-SYD-03-D",
                                                    "degreeLevel": "Doctorate",
                                                    "tutionFees": "AUD 68,000 / year",
                                                    "duration": "4 Years"
                                                }
                                            ],
                                            "applyBtnParms": [
                                                "Australia",
                                                "Sydney",
                                                "University of Sydney",
                                                "Veterinary Medicine"
                                            ],
                                            "applyBtnParmsDegreeLevel": [
                                                "Degree",
                                                "Level",
                                                "VetMed"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "id": "UNI-AU-MEL",
                                    "name": "University of Melbourne",
                                    "image": "https://i.ibb.co.com/PGXYXwTq/img.jpg",
                                    "location": "Melbourne",
                                    "description": "A public research university located in Melbourne, Australia.",
                                    "courses": [
                                        {
                                            "id": "CRS-MEL-01",
                                            "name": "Biomedicine",
                                            "tutionFees": "AUD 50,000 / year",
                                            "duration": "3 Years",
                                            "description": "Understand the human body and disease.",
                                            "degreeLevelInfo": [
                                                {
                                                    "id": "DL-MEL-01-B",
                                                    "degreeLevel": "Bachelor",
                                                    "tutionFees": "AUD 50,000 / year",
                                                    "duration": "3 Years"
                                                }
                                            ],
                                            "applyBtnParms": [
                                                "Australia",
                                                "Melbourne",
                                                "University of Melbourne",
                                                "Biomedicine"
                                            ],
                                            "applyBtnParmsDegreeLevel": [
                                                "Degree",
                                                "Level",
                                                "Biomedicine"
                                            ]
                                        },
                                        {
                                            "id": "CRS-MEL-02",
                                            "name": "Juris Doctor (Law)",
                                            "tutionFees": "AUD 46,000 / year",
                                            "duration": "3 Years",
                                            "description": "Graduate law degree for aspiring lawyers.",
                                            "degreeLevelInfo": [
                                                {
                                                    "id": "DL-MEL-02-JD",
                                                    "degreeLevel": "Juris Doctor",
                                                    "tutionFees": "AUD 46,000 / year",
                                                    "duration": "3 Years"
                                                }
                                            ],
                                            "applyBtnParms": [
                                                "Australia",
                                                "Melbourne",
                                                "University of Melbourne",
                                                "Juris Doctor"
                                            ],
                                            "applyBtnParmsDegreeLevel": [
                                                "Degree",
                                                "Level",
                                                "Law"
                                            ]
                                        },
                                        {
                                            "id": "CRS-MEL-03",
                                            "name": "Fine Arts",
                                            "tutionFees": "AUD 38,000 / year",
                                            "duration": "3 Years",
                                            "description": "Visual art, acting, and music performance.",
                                            "degreeLevelInfo": [
                                                {
                                                    "id": "DL-MEL-03-B",
                                                    "degreeLevel": "Bachelor",
                                                    "tutionFees": "AUD 38,000 / year",
                                                    "duration": "3 Years"
                                                },
                                                {
                                                    "id": "DL-MEL-03-M",
                                                    "degreeLevel": "Master",
                                                    "tutionFees": "AUD 42,000 / year",
                                                    "duration": "2 Years"
                                                }
                                            ],
                                            "applyBtnParms": [
                                                "Australia",
                                                "Melbourne",
                                                "University of Melbourne",
                                                "Fine Arts"
                                            ],
                                            "applyBtnParmsDegreeLevel": [
                                                "Degree",
                                                "Level",
                                                "Arts"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "id": "UNI-AU-QLD",
                                    "name": "University of Queensland",
                                    "image": "https://i.ibb.co.com/PGXYXwTq/img.jpg",
                                    "location": "Brisbane",
                                    "description": "One of Australia's leading research and teaching institutions.",
                                    "courses": [
                                        {
                                            "id": "CRS-QLD-01",
                                            "name": "Marine Biology",
                                            "tutionFees": "AUD 45,000 / year",
                                            "duration": "3 Years",
                                            "description": "Study of marine organisms and ecosystems nearby the Great Barrier Reef.",
                                            "degreeLevelInfo": [
                                                {
                                                    "id": "DL-QLD-01-B",
                                                    "degreeLevel": "Bachelor",
                                                    "tutionFees": "AUD 45,000 / year",
                                                    "duration": "3 Years"
                                                }
                                            ],
                                            "applyBtnParms": [
                                                "Australia",
                                                "Brisbane",
                                                "University of Queensland",
                                                "Marine Biology"
                                            ],
                                            "applyBtnParmsDegreeLevel": [
                                                "Degree",
                                                "Level",
                                                "MarineBio"
                                            ]
                                        },
                                        {
                                            "id": "CRS-QLD-02",
                                            "name": "Information Technology",
                                            "tutionFees": "AUD 42,000 / year",
                                            "duration": "3 Years",
                                            "description": "Software engineering and systems design.",
                                            "degreeLevelInfo": [
                                                {
                                                    "id": "DL-QLD-02-B",
                                                    "degreeLevel": "Bachelor",
                                                    "tutionFees": "AUD 42,000 / year",
                                                    "duration": "3 Years"
                                                },
                                                {
                                                    "id": "DL-QLD-02-M",
                                                    "degreeLevel": "Master",
                                                    "tutionFees": "AUD 48,000 / year",
                                                    "duration": "2 Years"
                                                }
                                            ],
                                            "applyBtnParms": [
                                                "Australia",
                                                "Brisbane",
                                                "University of Queensland",
                                                "Information Technology"
                                            ],
                                            "applyBtnParmsDegreeLevel": [
                                                "Degree",
                                                "Level",
                                                "IT"
                                            ]
                                        },
                                        {
                                            "id": "CRS-QLD-03",
                                            "name": "Environmental Science",
                                            "tutionFees": "AUD 44,000 / year",
                                            "duration": "3 Years",
                                            "description": "Solutions to environmental issues.",
                                            "degreeLevelInfo": [
                                                {
                                                    "id": "DL-QLD-03-B",
                                                    "degreeLevel": "Bachelor",
                                                    "tutionFees": "AUD 44,000 / year",
                                                    "duration": "3 Years"
                                                }
                                            ],
                                            "applyBtnParms": [
                                                "Australia",
                                                "Brisbane",
                                                "University of Queensland",
                                                "Environmental Science"
                                            ],
                                            "applyBtnParmsDegreeLevel": [
                                                "Degree",
                                                "Level",
                                                "EnvSci"
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ],
                "createdAt": "2025-12-11T07:30:59.716Z",
                "updatedAt": "2025-12-11T07:31:43.662Z",
                "__v": 0
            },
            {
                "_id": "693a70b5b8f90596fe3acab4",
                "pageName": "Course IELTS",
                "path": "/course/ielts",
                "isActive": true,
                "content": [
                    {
                        "id": "section-section-uid-34-1765437984685",
                        "key": "section-uid-34",
                        "type": "section",
                        "heading": "Sections section-uid-34",
                        "path": "/section-uid-34",
                        "data": {
                            "badgeText": "Bangladesh's #1 IELTS Preparation Platform",
                            "headingLine1": "Free Online",
                            "headingHighlight": "IELTS",
                            "headingLine2": "Real Mock Tests With",
                            "headingGradient": "Explanations",
                            "subtitle": "Master your IELTS with authentic practice tests, instant results, and detailed explanations. Join thousands of successful students who achieved their target band scores.",
                            "features": [
                                "Real Test Format",
                                "Instant Results",
                                "Detailed Explanations",
                                "Expert Guidance"
                            ]
                        }
                    },
                    {
                        "id": "section-section-uid-12-1765438009725",
                        "key": "section-uid-12",
                        "type": "section",
                        "heading": "Sections section-uid-12",
                        "path": "/section-uid-12",
                        "data": {
                            "id": "section-12-experience",
                            "title": "Professional",
                            "subTitle": "Journey",
                            "description": "A timeline of dedication, innovation, and impactful contributions across the tech industry.",
                            "experiences": [
                                {
                                    "id": "exp-001",
                                    "year": "2022 - Present",
                                    "companyName": "TechFlow Systems",
                                    "role": "Senior Frontend Engineer",
                                    "description": "Leading the core UI team in rebuilding the legacy dashboard into a modern, high-performance React application.",
                                    "lastAchievement": "Reduced initial load time by 45% using server components.",
                                    "highlightMilestone": {
                                        "label": "Users Impacted",
                                        "value": "2M+"
                                    },
                                    "features": [
                                        "Next.js 14",
                                        "TypeScript",
                                        "System Architecture",
                                        "Team Leadership"
                                    ]
                                },
                                {
                                    "id": "exp-002",
                                    "year": "2020 - 2022",
                                    "companyName": "Creative Pulse",
                                    "role": "UI/UX Developer",
                                    "description": "Bridged the gap between design and engineering, creating interactive micro-sites and award-winning landing pages.",
                                    "lastAchievement": "Won the Awwwards Site of the Day for the 2021 Rebrand.",
                                    "highlightMilestone": {
                                        "label": "Conversion Rate",
                                        "value": "+150%"
                                    },
                                    "features": [
                                        "Framer Motion",
                                        "WebGL",
                                        "Interactive Design",
                                        "GSAP"
                                    ]
                                },
                                {
                                    "id": "exp-003",
                                    "year": "2018 - 2020",
                                    "companyName": "StartUp Inc.",
                                    "role": "Junior Web Developer",
                                    "description": "Collaborated with cross-functional teams to ship features rapidly in an agile environment.",
                                    "lastAchievement": "Successfully migrated the payment gateway without downtime.",
                                    "highlightMilestone": {
                                        "label": "Features Shipped",
                                        "value": "45+"
                                    },
                                    "features": [
                                        "React",
                                        "Redux",
                                        "Stripe API",
                                        "Agile/Scrum"
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        "id": "section-section-uid-17-1765438047893",
                        "key": "section-uid-17",
                        "type": "section",
                        "heading": "Sections section-uid-17",
                        "path": "/section-uid-17",
                        "data": {
                            "id": "section-uid-17",
                            "categories": [
                                "All",
                                "Quantum UI",
                                "Engineering",
                                "Design Systems",
                                "Algorithms"
                            ],
                            "allData": [
                                {
                                    "id": "post-1",
                                    "title": "The Event Horizon: Designing for Non-Linear Navigation",
                                    "excerpt": "Traditional breadcrumbs fail in multidimensional interfaces. Here is how we implemented spatial state management using probabilistic graph theory.",
                                    "coverImage": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                    "publishedAt": "Nov 28, 2025",
                                    "readTime": "12 min read",
                                    "category": "Quantum UI",
                                    "tags": [
                                        "UX",
                                        "Navigation",
                                        "Math"
                                    ],
                                    "author": {
                                        "name": "Dr. Aris Thorne",
                                        "avatar": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                        "role": "Lead Architect"
                                    },
                                    "featured": true
                                },
                                {
                                    "id": "post-2",
                                    "title": "CSS Grid Level 5: Subgrid Anomalies",
                                    "excerpt": "Exploring the weird parts of the new CSS specification where parent grids inherit constraints from their quantum children.",
                                    "coverImage": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                    "publishedAt": "Nov 25, 2025",
                                    "readTime": "6 min read",
                                    "category": "Engineering",
                                    "tags": [
                                        "CSS",
                                        "Frontend",
                                        "Spec"
                                    ],
                                    "author": {
                                        "name": "Elena Vance",
                                        "avatar": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                        "role": "Principal Designer"
                                    }
                                },
                                {
                                    "id": "post-3",
                                    "title": "Algorithmic Typography: Variable Fonts in Motion",
                                    "excerpt": "Using the Web Audio API to drive font-weight and slant based on ambient user environment noise.",
                                    "coverImage": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                    "publishedAt": "Nov 22, 2025",
                                    "readTime": "8 min read",
                                    "category": "Design Systems",
                                    "tags": [
                                        "Typography",
                                        "Audio",
                                        "Canvas"
                                    ],
                                    "author": {
                                        "name": "Sarah Chen",
                                        "avatar": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                        "role": "Creative Developer"
                                    }
                                },
                                {
                                    "id": "post-4",
                                    "title": "Server Components as Micro-Black Holes",
                                    "excerpt": "Optimizing data density by collapsing the hydration waterfall into a single singularity point.",
                                    "coverImage": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                    "publishedAt": "Nov 18, 2025",
                                    "readTime": "15 min read",
                                    "category": "Engineering",
                                    "tags": [
                                        "React",
                                        "Performance",
                                        "Server"
                                    ],
                                    "author": {
                                        "name": "Marcus K.",
                                        "avatar": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                        "role": "Systems Engineer"
                                    }
                                },
                                {
                                    "id": "post-5",
                                    "title": "Heuristics of the Void",
                                    "excerpt": "Why empty states in complex dashboards should never be truly empty. The psychology of negative space.",
                                    "coverImage": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                    "publishedAt": "Nov 15, 2025",
                                    "readTime": "5 min read",
                                    "category": "Quantum UI",
                                    "tags": [
                                        "Psychology",
                                        "UX"
                                    ],
                                    "author": {
                                        "name": "Elena Vance",
                                        "avatar": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                        "role": "Principal Designer"
                                    }
                                },
                                {
                                    "id": "post-6",
                                    "title": "Refactoring the Monolith",
                                    "excerpt": "A case study on breaking down a 50GB legacy codebase using the Strangler Fig pattern and nuclear fusion.",
                                    "coverImage": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                    "publishedAt": "Nov 10, 2025",
                                    "readTime": "20 min read",
                                    "category": "Algorithms",
                                    "tags": [
                                        "Legacy",
                                        "Architecture"
                                    ],
                                    "author": {
                                        "name": "Dr. Aris Thorne",
                                        "avatar": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                        "role": "Lead Architect"
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "id": "section-section-uid-43-1765438058093",
                        "key": "section-uid-43",
                        "type": "section",
                        "heading": "Sections section-uid-43",
                        "path": "/section-uid-43",
                        "data": {
                            "title": "Journeys of Excellence",
                            "subtitle": "Following the path of success, one story at a time.",
                            "stories": [
                                {
                                    "id": "1",
                                    "name": "Sarah Jenkins",
                                    "university": "Stanford University",
                                    "subject": "Computer Science",
                                    "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
                                    "description": "Overcoming initial struggles with algorithms, Sarah dedicated her weekends to coding bootcamps. Her perseverance led to a breakthrough internship at Google."
                                },
                                {
                                    "id": "2",
                                    "name": "Michael Chen",
                                    "university": "MIT",
                                    "subject": "Robotics Engineering",
                                    "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
                                    "description": "Michael balanced a full-time job while pursuing his masters. His innovative thesis on autonomous drone navigation caught the attention of Tesla."
                                },
                                {
                                    "id": "3",
                                    "name": "Priya Patel",
                                    "university": "Cambridge University",
                                    "subject": "Biotechnology",
                                    "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop",
                                    "description": "Starting with limited funding, Priya secured multiple grants. Her work on sustainable bio-plastics is now being adopted by major packaging firms."
                                },
                                {
                                    "id": "4",
                                    "name": "David Okonjo",
                                    "university": "Oxford University",
                                    "subject": "Economics",
                                    "image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop",
                                    "description": "David moved countries to pursue his education. He graduated top of his class and founded a fintech startup helping underbanked communities."
                                },
                                {
                                    "id": "5",
                                    "name": "Emma Wilson",
                                    "university": "Harvard Medical School",
                                    "subject": "Neurology",
                                    "image": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop",
                                    "description": "Emma spent years volunteering in remote clinics. Her empathy-driven approach earned her a fellowship at Johns Hopkins."
                                }
                            ]
                        }
                    },
                    {
                        "id": "section-section-uid-9-1765438061541",
                        "key": "section-uid-9",
                        "type": "section",
                        "heading": "Sections section-uid-9",
                        "path": "/section-uid-9",
                        "data": {
                            "id": "Section 9 Button Text",
                            "title": "Be The Next Story",
                            "subTitle": "Your future begins here. Join a community of innovators and leaders shaping the world of tomorrow.",
                            "buttonText": "Apply Now",
                            "buttonUrl": "#"
                        }
                    }
                ],
                "createdAt": "2025-12-11T07:20:21.242Z",
                "updatedAt": "2025-12-11T07:27:46.680Z",
                "__v": 0
            },
            {
                "_id": "693a70c6b8f90596fe3acab8",
                "pageName": "Course Online Spoken",
                "path": "/course/online-spoken",
                "isActive": true,
                "content": [
                    {
                        "id": "section-section-uid-40-1765437796742",
                        "key": "section-uid-40",
                        "type": "section",
                        "heading": "Sections section-uid-40",
                        "path": "/section-uid-40",
                        "data": {
                            "title": "Ready to Start Your IELTS Journey?",
                            "subtitle": "Join thousands of successful students who achieved their target band scores",
                            "buttonPrimaryText": "Book Free Consultation",
                            "buttonSecondaryText": "Watch Class Demo",
                            "contactLabel": "Call us now for immediate enrollment",
                            "contactNumber": "📞 +880 1XXX-XXXXXX"
                        }
                    },
                    {
                        "id": "section-section-uid-11-1765437852589",
                        "key": "section-uid-11",
                        "type": "section",
                        "heading": "Sections section-uid-11",
                        "path": "/section-uid-11",
                        "data": {
                            "id": "section-11-stories-reel",
                            "storiesPerPage": 1,
                            "stories": [
                                {
                                    "id": "story-001",
                                    "name": "Jaswanth Vishnumolakala",
                                    "image": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                    "university": "University of Buckingham",
                                    "subject": "BSc Computing (AI & Robotics)",
                                    "description": "Jaswanth achieved a First Class Bachelor's degree. His time at the university was transformative, fostering both personal and professional growth."
                                },
                                {
                                    "id": "story-002",
                                    "name": "Sarah Jenkins",
                                    "image": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                    "university": "Stanford University",
                                    "subject": "MSc Computer Science",
                                    "description": "Sarah led the Google Developer Student Club and published three research papers on Machine Learning. She is now working as a Lead AI Researcher at OpenAI."
                                },
                                {
                                    "id": "story-003",
                                    "name": "Michael Chen",
                                    "image": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                    "university": "MIT",
                                    "subject": "BEng Electrical Engineering",
                                    "description": "Michael developed a patent-pending solar technology during his junior year. His dedication to sustainable energy has earned him the Green Tech Innovator Award."
                                }
                            ]
                        }
                    },
                    {
                        "id": "section-section-uid-17-1765437890941",
                        "key": "section-uid-17",
                        "type": "section",
                        "heading": "Sections section-uid-17",
                        "path": "/section-uid-17",
                        "data": {
                            "id": "section-uid-17",
                            "categories": [
                                "All",
                                "Quantum UI",
                                "Engineering",
                                "Design Systems",
                                "Algorithms"
                            ],
                            "allData": [
                                {
                                    "id": "post-1",
                                    "title": "The Event Horizon: Designing for Non-Linear Navigation",
                                    "excerpt": "Traditional breadcrumbs fail in multidimensional interfaces. Here is how we implemented spatial state management using probabilistic graph theory.",
                                    "coverImage": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                    "publishedAt": "Nov 28, 2025",
                                    "readTime": "12 min read",
                                    "category": "Quantum UI",
                                    "tags": [
                                        "UX",
                                        "Navigation",
                                        "Math"
                                    ],
                                    "author": {
                                        "name": "Dr. Aris Thorne",
                                        "avatar": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                        "role": "Lead Architect"
                                    },
                                    "featured": true
                                },
                                {
                                    "id": "post-2",
                                    "title": "CSS Grid Level 5: Subgrid Anomalies",
                                    "excerpt": "Exploring the weird parts of the new CSS specification where parent grids inherit constraints from their quantum children.",
                                    "coverImage": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                    "publishedAt": "Nov 25, 2025",
                                    "readTime": "6 min read",
                                    "category": "Engineering",
                                    "tags": [
                                        "CSS",
                                        "Frontend",
                                        "Spec"
                                    ],
                                    "author": {
                                        "name": "Elena Vance",
                                        "avatar": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                        "role": "Principal Designer"
                                    }
                                },
                                {
                                    "id": "post-3",
                                    "title": "Algorithmic Typography: Variable Fonts in Motion",
                                    "excerpt": "Using the Web Audio API to drive font-weight and slant based on ambient user environment noise.",
                                    "coverImage": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                    "publishedAt": "Nov 22, 2025",
                                    "readTime": "8 min read",
                                    "category": "Design Systems",
                                    "tags": [
                                        "Typography",
                                        "Audio",
                                        "Canvas"
                                    ],
                                    "author": {
                                        "name": "Sarah Chen",
                                        "avatar": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                        "role": "Creative Developer"
                                    }
                                },
                                {
                                    "id": "post-4",
                                    "title": "Server Components as Micro-Black Holes",
                                    "excerpt": "Optimizing data density by collapsing the hydration waterfall into a single singularity point.",
                                    "coverImage": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                    "publishedAt": "Nov 18, 2025",
                                    "readTime": "15 min read",
                                    "category": "Engineering",
                                    "tags": [
                                        "React",
                                        "Performance",
                                        "Server"
                                    ],
                                    "author": {
                                        "name": "Marcus K.",
                                        "avatar": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                        "role": "Systems Engineer"
                                    }
                                },
                                {
                                    "id": "post-5",
                                    "title": "Heuristics of the Void",
                                    "excerpt": "Why empty states in complex dashboards should never be truly empty. The psychology of negative space.",
                                    "coverImage": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                    "publishedAt": "Nov 15, 2025",
                                    "readTime": "5 min read",
                                    "category": "Quantum UI",
                                    "tags": [
                                        "Psychology",
                                        "UX"
                                    ],
                                    "author": {
                                        "name": "Elena Vance",
                                        "avatar": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                        "role": "Principal Designer"
                                    }
                                },
                                {
                                    "id": "post-6",
                                    "title": "Refactoring the Monolith",
                                    "excerpt": "A case study on breaking down a 50GB legacy codebase using the Strangler Fig pattern and nuclear fusion.",
                                    "coverImage": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                    "publishedAt": "Nov 10, 2025",
                                    "readTime": "20 min read",
                                    "category": "Algorithms",
                                    "tags": [
                                        "Legacy",
                                        "Architecture"
                                    ],
                                    "author": {
                                        "name": "Dr. Aris Thorne",
                                        "avatar": "https://i.ibb.co.com/KpGnqS3D/nature.jpg",
                                        "role": "Lead Architect"
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "id": "section-section-uid-9-1765437899629",
                        "key": "section-uid-9",
                        "type": "section",
                        "heading": "Sections section-uid-9",
                        "path": "/section-uid-9",
                        "data": {
                            "id": "Section 9 Button Text",
                            "title": "Be The Next Story",
                            "subTitle": "Your future begins here. Join a community of innovators and leaders shaping the world of tomorrow.",
                            "buttonText": "Apply Now",
                            "buttonUrl": "#"
                        }
                    }
                ],
                "createdAt": "2025-12-11T07:20:38.959Z",
                "updatedAt": "2025-12-11T07:25:01.646Z",
                "__v": 0
            },
            {
                "_id": "693a70a6b8f90596fe3acab0",
                "pageName": "Course",
                "path": "/course",
                "isActive": true,
                "content": [
                    {
                        "id": "section-section-uid-31-1765437675022",
                        "key": "section-uid-31",
                        "type": "section",
                        "heading": "Sections section-uid-31",
                        "path": "/section-uid-31",
                        "data": {
                            "badge": "Bangladesh's Top Test Prep Platform",
                            "headingPrefix": "Master Your",
                            "headingGradient": "IELTS",
                            "headingSuffix": "Journey",
                            "description": "Join thousands of successful students who achieved their dream scores with our expert guidance, comprehensive materials, and proven strategies.",
                            "buttonPrimary": "Start Free Trial",
                            "buttonSecondary": "Watch Demo",
                            "testimonials": [
                                {
                                    "name": "Sarah Ahmed",
                                    "score": "Band 8.5",
                                    "text": "Achieved my dream IELTS score!"
                                },
                                {
                                    "name": "Mohammad Rahman",
                                    "score": "Band 7.5",
                                    "text": "Excellent preparation materials and guidance."
                                },
                                {
                                    "name": "Fatima Khan",
                                    "score": "Band 8.0",
                                    "text": "The best test prep experience I have had."
                                }
                            ],
                            "stats": [
                                {
                                    "number": "50K+",
                                    "label": "Successful Students",
                                    "iconName": "Users"
                                },
                                {
                                    "number": "8.5",
                                    "label": "Average Band Score",
                                    "iconName": "TrendingUp"
                                },
                                {
                                    "number": "95%",
                                    "label": "Success Rate",
                                    "iconName": "Award"
                                },
                                {
                                    "number": "24/7",
                                    "label": "Expert Support",
                                    "iconName": "BookOpen"
                                }
                            ]
                        }
                    },
                    {
                        "id": "section-section-uid-12-1765437689758",
                        "key": "section-uid-12",
                        "type": "section",
                        "heading": "Sections section-uid-12",
                        "path": "/section-uid-12",
                        "data": {
                            "id": "section-12-experience",
                            "title": "Professional",
                            "subTitle": "Journey",
                            "description": "A timeline of dedication, innovation, and impactful contributions across the tech industry.",
                            "experiences": [
                                {
                                    "id": "exp-001",
                                    "year": "2022 - Present",
                                    "companyName": "TechFlow Systems",
                                    "role": "Senior Frontend Engineer",
                                    "description": "Leading the core UI team in rebuilding the legacy dashboard into a modern, high-performance React application.",
                                    "lastAchievement": "Reduced initial load time by 45% using server components.",
                                    "highlightMilestone": {
                                        "label": "Users Impacted",
                                        "value": "2M+"
                                    },
                                    "features": [
                                        "Next.js 14",
                                        "TypeScript",
                                        "System Architecture",
                                        "Team Leadership"
                                    ]
                                },
                                {
                                    "id": "exp-002",
                                    "year": "2020 - 2022",
                                    "companyName": "Creative Pulse",
                                    "role": "UI/UX Developer",
                                    "description": "Bridged the gap between design and engineering, creating interactive micro-sites and award-winning landing pages.",
                                    "lastAchievement": "Won the Awwwards Site of the Day for the 2021 Rebrand.",
                                    "highlightMilestone": {
                                        "label": "Conversion Rate",
                                        "value": "+150%"
                                    },
                                    "features": [
                                        "Framer Motion",
                                        "WebGL",
                                        "Interactive Design",
                                        "GSAP"
                                    ]
                                },
                                {
                                    "id": "exp-003",
                                    "year": "2018 - 2020",
                                    "companyName": "StartUp Inc.",
                                    "role": "Junior Web Developer",
                                    "description": "Collaborated with cross-functional teams to ship features rapidly in an agile environment.",
                                    "lastAchievement": "Successfully migrated the payment gateway without downtime.",
                                    "highlightMilestone": {
                                        "label": "Features Shipped",
                                        "value": "45+"
                                    },
                                    "features": [
                                        "React",
                                        "Redux",
                                        "Stripe API",
                                        "Agile/Scrum"
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        "id": "section-section-uid-39-1765437717174",
                        "key": "section-uid-39",
                        "type": "section",
                        "heading": "Sections section-uid-39",
                        "path": "/section-uid-39",
                        "data": {
                            "title": "Why Choose Our Classes?",
                            "subtitle": "Experience the difference with our proven teaching methodology",
                            "features": [
                                {
                                    "title": "Small Batches",
                                    "description": "Maximum 12 students per batch for personalized attention",
                                    "iconName": "Users",
                                    "gradient": "from-blue-500 to-blue-600"
                                },
                                {
                                    "title": "Expert Teachers",
                                    "description": "IELTS certified instructors with 8+ band scores",
                                    "iconName": "Award",
                                    "gradient": "from-green-500 to-green-600"
                                },
                                {
                                    "title": "Free Materials",
                                    "description": "All course materials and books included at no extra cost",
                                    "iconName": "BookOpen",
                                    "gradient": "from-purple-500 to-purple-600"
                                },
                                {
                                    "title": "Mock Tests",
                                    "description": "Regular practice tests with detailed feedback",
                                    "iconName": "Star",
                                    "gradient": "from-red-500 to-red-600"
                                }
                            ]
                        }
                    },
                    {
                        "id": "section-section-uid-43-1765437741149",
                        "key": "section-uid-43",
                        "type": "section",
                        "heading": "Sections section-uid-43",
                        "path": "/section-uid-43",
                        "data": {
                            "title": "Journeys of Excellence",
                            "subtitle": "Following the path of success, one story at a time.",
                            "stories": [
                                {
                                    "id": "1",
                                    "name": "Sarah Jenkins",
                                    "university": "Stanford University",
                                    "subject": "Computer Science",
                                    "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
                                    "description": "Overcoming initial struggles with algorithms, Sarah dedicated her weekends to coding bootcamps. Her perseverance led to a breakthrough internship at Google."
                                },
                                {
                                    "id": "2",
                                    "name": "Michael Chen",
                                    "university": "MIT",
                                    "subject": "Robotics Engineering",
                                    "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
                                    "description": "Michael balanced a full-time job while pursuing his masters. His innovative thesis on autonomous drone navigation caught the attention of Tesla."
                                },
                                {
                                    "id": "3",
                                    "name": "Priya Patel",
                                    "university": "Cambridge University",
                                    "subject": "Biotechnology",
                                    "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop",
                                    "description": "Starting with limited funding, Priya secured multiple grants. Her work on sustainable bio-plastics is now being adopted by major packaging firms."
                                },
                                {
                                    "id": "4",
                                    "name": "David Okonjo",
                                    "university": "Oxford University",
                                    "subject": "Economics",
                                    "image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop",
                                    "description": "David moved countries to pursue his education. He graduated top of his class and founded a fintech startup helping underbanked communities."
                                },
                                {
                                    "id": "5",
                                    "name": "Emma Wilson",
                                    "university": "Harvard Medical School",
                                    "subject": "Neurology",
                                    "image": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop",
                                    "description": "Emma spent years volunteering in remote clinics. Her empathy-driven approach earned her a fellowship at Johns Hopkins."
                                }
                            ]
                        }
                    }
                ],
                "createdAt": "2025-12-11T07:20:06.430Z",
                "updatedAt": "2025-12-11T07:22:29.840Z",
                "__v": 0
            }
        ],
        "total": 9,
        "page": 1,
        "limit": 100
    },
    "message": "Fetched successfully",
    "status": 200
}
```

menu editor 
```
{
    "data": {
        "_id": "6937ce9d7457f3510c1f8275",
        "type": "main-menu",
        "__v": 0,
        "createdAt": "2025-12-09T07:24:17.764Z",
        "items": [
            {
                "id": 1765437305952,
                "name": "Course",
                "path": "/courses",
                "imagePath": "",
                "isImagePublish": false,
                "isIconPublish": false,
                "iconName": "ScrollText",
                "_id": "6a28067e794efca2b3030a6d",
                "children": []
            },
            {
                "id": 1765437482871,
                "name": "Free Resource",
                "path": "/free-resource",
                "imagePath": "",
                "isImagePublish": false,
                "isIconPublish": false,
                "iconName": "Package",
                "_id": "6a28067e794efca2b3030a6e",
                "children": []
            },
            {
                "id": 10,
                "name": "About Us",
                "path": "/about-us",
                "imagePath": "",
                "isImagePublish": false,
                "isIconPublish": false,
                "iconName": "AlertCircle",
                "_id": "6a28067e794efca2b3030a6f",
                "children": []
            },
            {
                "id": 1765438593107,
                "name": "Contact",
                "path": "/contact-us",
                "imagePath": "",
                "isImagePublish": false,
                "isIconPublish": false,
                "iconName": "Phone",
                "_id": "6a28067e794efca2b3030a70",
                "children": []
            }
        ],
        "updatedAt": "2026-06-09T12:26:38.012Z"
    },
    "message": "Menu fetched successfully",
    "status": 200
}
```

footer editor 
```
[
    {
        "_id": "69318969310ef65df00a1d21",
        "name": "Footer 2",
        "disabledPaths": [
            {
                "path": "/dashboard",
                "isExcluded": true,
                "_id": "69318969310ef65df00a1d22"
            }
        ],
        "isEnabled": true,
        "createdAt": "2025-12-04T13:15:21.774Z",
        "updatedAt": "2025-12-09T07:43:06.893Z",
        "__v": 0,
        "data": {
            "templateKey": "footer-uid-2",
            "content": "{\"brandName\":\"TestPrep Center 54\",\"tagline\":\"Crafting digital experiences that inspire and innovate. We build the future, one pixel at a time.\",\"logoUrl\":\"https://i.ibb.co/9996pPv6/blob.png\",\"logoWidth\":50,\"contactInfo\":{\"address\":\"101 Innovation Blvd, Tech City, CA 94000\",\"phone\":\"+1 (555) 012-3456\",\"email\":\"hello@nexus.dev\"},\"quickLinks\":[{\"id\":1,\"title\":\"Company\",\"link\":\"/company\"},{\"id\":2,\"title\":\"Services\",\"link\":\"/services\"},{\"id\":3,\"title\":\"Case Studies\",\"link\":\"/work\"},{\"id\":4,\"title\":\"Careers\",\"link\":\"/careers\"},{\"id\":5,\"title\":\"Privacy\",\"link\":\"/privacy\"}],\"socialLinks\":[{\"id\":1,\"platform\":\"Twitter\",\"link\":\"#\"},{\"id\":2,\"platform\":\"Github\",\"link\":\"#\"},{\"id\":3,\"platform\":\"Linkedin\",\"link\":\"#\"},{\"id\":4,\"platform\":\"Instagram\",\"link\":\"#\"}],\"copyrightText\":\"Nexus Inc. All rights reserved.\",\"designerName\":\"Toufiquer\"}"
        }
    },
    {
        "_id": "6931895a310ef65df00a1d19",
        "name": "Footer 1",
        "disabledPaths": [
            {
                "path": "/dashboard",
                "isExcluded": true,
                "_id": "6931895a310ef65df00a1d1a"
            }
        ],
        "isEnabled": false,
        "createdAt": "2025-12-04T13:15:06.462Z",
        "updatedAt": "2025-12-09T07:42:49.344Z",
        "__v": 0,
        "data": {
            "templateKey": "footer-uid-1",
            "content": "{\"brandName\":\"TestPrep Center2.0\",\"tagline\":\"Empowering learners with strong English communication skills for global success. Our commitment is to excellence, growth, and confidence.\",\"logoUrl\":\"https://i.ibb.co/mVNCdgrP/blob.png\",\"logoWidth\":50,\"contactInfo\":{\"address\":\"English, 2nd Floor, Green Plaza, Dhanmondi, Dhaka – 1209\",\"phone\":\"+880 1700-123456\",\"email\":\"info@english.com\"},\"quickLinks\":[{\"id\":1,\"title\":\"About Us\",\"link\":\"http://localhost:3000/dashboard/access/footer-editor'use client';  import React, { useEffect, useState } from 'react'; import { usePathname } from 'next/navigation'; import { AlertTriangle } from 'lucide-react'; import { AllFooter } from '@/components/all-footer/all-footer-index/all-footer';  interface DisabledPath {   path: string;   isExcluded: boolean;   _id: string; }  interface FooterData {   templateKey: string;   content: string; }  interface FooterResponseItem {   _id: string;   name: string;   isEnabled: boolean;   disabledPaths: DisabledPath[];   data?: FooterData; }  const FooterComponent = () => {   const [activeFooter, setActiveFooter] = useState<FooterResponseItem | null>(null);   const [isLoading, setIsLoading] = useState(true);   const [hasError, setHasError] = useState(false);    const pathname = usePathname();    useEffect(() => {     const fetchFooterSettings = async () => {       try {         const response = await fetch('/api/footer-settings/v1', {           cache: 'no-store',           method: 'GET',         });          if (!response.ok) throw new Error('Failed to fetch');          const data: FooterResponseItem[] = await response.json();          const enabledFooter = data.find(item => item.isEnabled);          setActiveFooter(enabledFooter || null);       } catch (error) {         console.error('Footer fetch error:', error);         setHasError(true);       } finally {         setIsLoading(false);       }     };      fetchFooterSettings();   }, []);    // --- Hardcoded Check ---   // If the path starts with \\\"/dashboard\\\", do not render the footer.   if (pathname?.startsWith('/dashboard')) {     return null;   }    if (isLoading) {     return null;   }    if (hasError || !activeFooter || !activeFooter.data) {     return (       <div className=\\\"w-full py-12 bg-neutral-950 border-t border-neutral-800 flex items-center justify-center text-neutral-400\\\">         <div className=\\\"flex flex-col items-center gap-2\\\">           <AlertTriangle size={24} className=\\\"text-amber-500\\\" />           <p className=\\\"text-sm font-medium\\\">Please configure Footer</p>         </div>       </div>     );   }    const isPathDisabled = activeFooter.disabledPaths?.some(rule => rule.isExcluded && rule.path === pathname);    if (isPathDisabled) {     return null;   }    const { templateKey, content } = activeFooter.data;    // eslint-disable-next-line @typescript-eslint/no-explicit-any   const TemplateConfig = (AllFooter as any)[templateKey];    if (!TemplateConfig || !TemplateConfig.query) {     return (       <div className=\\\"w-full py-12 bg-neutral-950 border-t border-neutral-800 flex items-center justify-center text-neutral-400\\\">         <p>           Template <strong>{templateKey}</strong> not found.         </p>       </div>     );   }    const QueryComponent = TemplateConfig.query;   return (     <>       <QueryComponent data={content} />     </>   ); };  export default FooterComponent;/sdabout\"},{\"id\":2,\"title\":\"Our Services\",\"link\":\"http://localhost:3000/dashboard/access/footer-editor/service\"},{\"id\":3,\"title\":\"Contact\",\"link\":\"http://localhost:3000/dashboard/access/footer-editor/contact\"},{\"id\":4,\"title\":\"FAQ\",\"link\":\"/faq\"},{\"id\":5,\"title\":\"Privacy Policy\",\"link\":\"/privacy-and-policy\"},{\"id\":6,\"title\":\"Terms & Conditions\",\"link\":\"/terms-and-condition\"}],\"socialLinks\":[{\"id\":1,\"platform\":\"Facebook\",\"link\":\"#\"},{\"id\":2,\"platform\":\"Twitter\",\"link\":\"#\"},{\"id\":3,\"platform\":\"Linkedin\",\"link\":\"#\"}],\"copyrightText\":\"English . All rights reserved.\",\"designerName\":\"Toufiquer\"}"
        }
    }
]
```