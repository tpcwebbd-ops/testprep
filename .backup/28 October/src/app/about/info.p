Act as a senior Web App Developer specializing in Next.js and TypeScript, with a long-term vision for building a strong, scalable educational platform for our company. 

I will provide information about our company. Based on that, your task is to generate a structured `aboutData` object (TypeScript-friendly JSON format) that will be used to dynamically render the About Page content in our Next.js project. 

The `aboutData` should include:
- `companyName`
- `tagline`
- `mission`
- `vision`
- `services` (array of our core offerings)
- `scholarshipSupport` (how we help students with full-funded scholarships)
- `whyChooseUs` (key differentiators)
- `contactNote` (encouraging message for potential students)
- Keep tone professional, inspiring, and trustworthy.

Here is our company information:

Name: **TestPrep Centre**  
Info: We provide **IELTS, GRE, and GMAT online courses.**  
We help students secure **fully-funded scholarships** in the **USA, UK, or Canada.**  
We offer the **best SOP writing guidance** and assist in finding **TA, GA, or full-funding opportunities.**


copy from other company.
```
About Us
For over a decade, we’ve been a premier destination for nurturing the
nation’s brightest minds, guiding them towards higher education excellence.
Grec Founders Images
Establishment and History
In 2008, Mamoon Rashid founded GREC and since then all operations in Bangladesh have been led by Bilkis Jahan. On 08-08-08 Mamoon Rashid came to Texas Tech University, USA to do Ph.D. Everything was drafted on the plane during the flight, including the basic GREC activities and website design. In the first few months, all activities of GREC were limited to free information distribution on the website. At that time GREC was called GRE Center and all information was distributed through a website called grecenter.net

Best GRE and IELTS Course
in Dhaka, Bangladesh
“Unlock Your Potential: Discover the Premium GRE and IELTS Courses in Dhaka, Bangladesh, and Excel in Your Academic Pursuits!”
Best GRE and IELTS Course in Dhaka, Bangladesh Banner
Our Photo Gallery
“Journey Through Moments: Immerse Yourself in Captivating Visuals and Memorable Memories at Our Vibrant Images Today!”

Group Study
Classroom
Library
Group Discussion
Team Members
“Meet Our Dynamic Team: Get to Know the Diverse and Talented
Individuals Who Make Up Our Team Exceptional.”
Dr Mamoon Rashid - CEO & FOUNDER
Dr Mamoon Rashid
CEO & FOUNDER

Bilkis Jahan
DEPUTY MANAGING DIRECTOR
Akter Hossain - BUSINESS DEVELOPMENT MANAGER
Akter Hossain
BUSINESS DEVELOPMENT MANAGER


Hosne Ara Begum
PMP – PROGRAM ADVISER


Hasnain Md Akif
Manager, Internal Audit & HR


Md Selim Reza
Manager, Operations


Khairen Hesan Pinky
Deputy Branch Manager, Lalmatia


Nur-A-Alam Sakib
Deputy Branch Manager, Banani


Mehrin Ara Anzum
Admission Counselor


Tagfir Islam Shourov
Assistant Manager, Banani


Md. Al Amin Tutul
Deputy Manager, Digital Marketing


Mostafizur Rahman Abir
Video Editor

Sonaton Roy - GRAPHIC DESIGNER
Sonaton Roy
GRAPHIC DESIGNER

Md. Razaul Karim
Supporting Staff

+29 GB free study
materials made for you
Before, Bangladeshi students lacked resources for higher studies. Understanding this, GREC introduced material distribution in September 2015 to help students. This event has been ongoing since then.
Explore Now
+29 GB free study materials made for you
Country's Oldest & Richest
E-Learning Coach
Since 2015, our e-Learning wing has been issued to more than 8,000 active users. More than 15,000 questions and video explanations have been included in our e-Learning site.
6000+
Student-athletes
2700+
Quizzes & lesson
2700+
Assignments
2700+
lecture note
Trade License No: TRAD/DNCC/069695/2022

Subscribe to
GREC's Newsletter
for the latest updates, exam strategies, and exclusive offers
Email
Email

Get Started
GREC Logo HD
The Graduate Record Examination (GRE) is a standardized test conducted by Education Testing Services (ETS), USA. This website is not endorsed by or does not have any affiliation with ETS.

GREC’s Branches
Lalmatia
Banani
Science Lab
Chittagong
Sylhet
Useful Links
Contact
All Courses
GRE Courses
IELTS Courses
My Account
Other Links
```

example of outputData.

```
  const aboutData = [
    {
      id: 1,
      name: 'Our Mission',
      path: '/about/mission',
      icon: <Globe2 />,
      description:
        'To empower learners of all ages with strong English communication skills, helping them achieve excellence in academics, career, and global opportunities.',
    },
    {
      id: 2,
      name: 'About Our Centre',
      path: '/about/centre',
      icon: <BookOpen />,
      description:
        'We are a leading English Centre dedicated to providing high-quality language education. Our programs are designed for school students, professionals, and test-takers who wish to excel in IELTS, Spoken English, and academic English.',
    },
    {
      id: 3,
      name: 'Courses We Offer',
      path: '/about/courses',
      icon: <GraduationCap />,
      childData: [
        {
          id: 31,
          name: 'IELTS Preparation',
          path: '/about/courses/ielts',
          icon: <Award />,
          description:
            'Comprehensive training focused on Listening, Reading, Writing, and Speaking — designed to help students achieve their target band score with confidence.',
        },
        {
          id: 32,
          name: 'Spoken English',
          path: '/about/courses/spoken-english',
          icon: <Users />,
          description: 'Interactive sessions that build fluency, pronunciation, and confidence in everyday and professional communication.',
        },
        {
          id: 33,
          name: 'Special English (Class 1–10)',
          path: '/about/courses/school-english',
          icon: <BookOpen />,
          description:
            'Custom English programs aligned with school syllabuses — designed to strengthen grammar, vocabulary, and writing skills for students from Class 1 to 10.',
        },
        {
          id: 34,
          name: 'English for Professionals',
          path: '/about/courses/professionals',
          icon: <Briefcase />,
          description: 'Professional English classes focused on workplace communication, email writing, presentation skills, and interview preparation.',
        },
      ],
    },
    {
      id: 4,
      name: 'Why Choose Us',
      path: '/about/why-choose-us',
      icon: <Award />,
      description:
        'Experienced instructors, personalized attention, interactive learning environment, and proven success in helping students achieve language mastery.',
    },
    {
      id: 5,
      name: 'Our Approach',
      path: '/about/approach',
      icon: <Users />,
      description:
        'We combine modern teaching techniques with real-life practice. Every class encourages participation, collaboration, and confidence-building in English usage.',
    },
    {
      id: 6,
      name: 'Contact & Location',
      path: '/about/contact',
      icon: <Globe2 />,
      description:
        'Located at a convenient and accessible place, our centre welcomes students and professionals. For inquiries or admissions, visit our contact page or reach out via phone or email.',
    },
  ];```