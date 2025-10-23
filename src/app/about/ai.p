Act as a senior Web App Developer specializing in Next.js and TypeScript, with a long-term vision for building a strong, scalable educational platform for our company. 

I will provide information about our company. Based on that, your task is to generate a web page for NextJS with PWA and written with TypeScript. and remember image and svg is optional, if there is no image or svg then render a default svg. make the page responsive, glassimorphism effect and a little bit animation. and make the div mid-big size. 


export const aboutData = [
  {
    id: 1,
    name: "Our Mission",
    path: "/about/mission",
    icon: "<Globe2 />",
    image: "/images/about/mission.jpg",
    svg: "/svgs/mission.svg",
    description:
      "At TestPrep Centre, our mission is to empower ambitious students across Bangladesh to achieve global academic success. We strive to provide world-class test preparation, scholarship guidance, and mentorship to help our students secure fully funded opportunities at top universities in the USA, UK, and Canada."
  },
  {
    id: 2,
    name: "About Our Centre",
    path: "/about/centre",
    icon: "<BookOpen />",
    image: "/images/about/centre.jpg",
    svg: "/svgs/centre.svg",
    description:
      "Founded with the vision to bridge the gap between Bangladeshi students and international education, TestPrep Centre offers comprehensive online and hybrid learning programs. Our experienced instructors and personalized learning system ensure that each student reaches their highest potential in IELTS, GRE, and GMAT preparation."
  },
  {
    id: 3,
    name: "Courses We Offer",
    path: "/about/courses",
    icon: "<GraduationCap />",
    image: "/images/about/courses.jpg",
    svg: "/svgs/courses.svg",
    description:
      "We offer expertly designed online courses that prepare students to excel in standardized tests required for global admission and scholarships. Each course is structured for maximum flexibility and real results.",
    childData: [
      {
        id: 3.1,
        name: "IELTS Preparation",
        path: "/courses/ielts",
        icon: "<BookOpen />",
        image: "/images/courses/ielts.jpg",
        svg: "/svgs/ielts.svg",
        description:
          "Our IELTS course focuses on improving your listening, reading, writing, and speaking skills with intensive practice sessions and expert feedback to help you achieve your target band score."
      },
      {
        id: 3.2,
        name: "GRE Preparation",
        path: "/courses/gre",
        icon: "<BookOpen />",
        image: "/images/courses/gre.jpg",
        svg: "/svgs/gre.svg",
        description:
          "Get ready for graduate studies abroad with our GRE course. We provide comprehensive coverage of quantitative reasoning, verbal reasoning, and analytical writing — with proven strategies for high scores."
      },
      {
        id: 3.3,
        name: "GMAT Preparation",
        path: "/courses/gmat",
        icon: "<BookOpen />",
        image: "/images/courses/gmat.jpg",
        svg: "/svgs/gmat.svg",
        description:
          "Designed for MBA aspirants, our GMAT course offers structured lessons, mock tests, and performance tracking to help you stand out in competitive business school applications."
      }
    ]
  },
  {
    id: 4,
    name: "Scholarship Support",
    path: "/about/scholarship-support",
    icon: "<Medal />",
    image: "/images/about/scholarship.jpg",
    svg: "/svgs/scholarship.svg",
    description:
      "We go beyond test preparation by helping students craft strong Statements of Purpose (SOPs), recommendation letters, and scholarship essays. Our experts provide step-by-step guidance to find and apply for full-funding opportunities, including TA, GA, and research assistantships."
  },
  {
    id: 5,
    name: "Why Choose Us",
    path: "/about/why-choose-us",
    icon: "<Star />",
    image: "/images/about/why-choose-us.jpg",
    svg: "/svgs/why-choose-us.svg",
    description:
      "With our proven success record and student-centered teaching approach, TestPrep Centre is trusted by learners nationwide. We combine expert mentorship, modern online tools, and data-driven learning insights to maximize each student’s success rate in both tests and scholarship applications."
  },
  {
    id: 6,
    name: "Our Approach",
    path: "/about/our-approach",
    icon: "<Target />",
    image: "/images/about/approach.jpg",
    svg: "/svgs/approach.svg",
    description:
      "Our teaching philosophy blends personalized mentorship with adaptive technology. Every course is data-driven — tracking progress, identifying weaknesses, and continuously improving performance through feedback and simulation-based learning."
  },
  {
    id: 7,
    name: "Contact & Location",
    path: "/about/contact",
    icon: "<MapPin />",
    image: "/images/about/contact.jpg",
    svg: "/svgs/contact.svg",
    description:
      "TestPrep Centre is based in Bangladesh and proudly serves students nationwide through our online learning platform. Whether you’re in Dhaka, Chittagong, or anywhere else, our instructors and counselors are available online to guide you toward your study abroad dream.",
    childData: [
      {
        id: 7.1,
        name: "Head Office",
        path: "/contact/head-office",
        icon: "<Building2 />",
        image: "/images/contact/head-office.jpg",
        svg: "/svgs/head-office.svg",
        description:
          "Our main office operates in Dhaka, providing both in-person and online counseling sessions for students preparing for their next academic journey abroad."
      },
      {
        id: 7.2,
        name: "Get in Touch",
        path: "/contact/get-in-touch",
        icon: "<Phone />",
        image: "/images/contact/get-in-touch.jpg",
        svg: "/svgs/get-in-touch.svg",
        description:
          "Reach out to us anytime through our website or social channels for free counseling sessions and course information. We’re here to help you every step of the way."
      }
    ]
  }
];
