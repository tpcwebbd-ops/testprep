A. Core User and Access Management
1. Users
    Description: This table will store essential information for every individual, including students, employees, and general users. It serves as the primary identity record.
    Fields:
        -   id (Primary Key)
        -   full_name
        -   email (Unique)
        -   password_hash
        -   phone_number
        -   profile_image_url
        -   status ('active', 'inactive', 'suspended')
        -   created_at (Timestamp)
        -   updated_at (Timestamp)

2. Profiles
    Description: A one-to-one extension of theUsers table for storing additional, non-essential user information.
    Fields:
        -   id (Primary Key)
        -   user_id (Foreign Key to Users)
        -   address
        -   bio
        -   social_links (JSON or Text)

3. Roles
    Description: Defines the distinct roles within the system (Admin, Instructor, Student).
    Fields:
        -  id (Primary Key)
        -  role_name ('MD', 'CTO', 'Instructor', 'Student')
        -  description
        -  assign_access ({view:[], Create:[], Update: [], delete:[]})

4. Roles_Management
    Description: A many-to-many join table that assigns one or more roles to a user, enabling flexible permission management.
    Fields: 
        -  user_id (Foreign Key to Users)
        -  role_id (Foreign Key to Roles)
        -  role_name (Foreign Key to Roles)


B. Course and Enrollment Management
This section defines the structure of the educational content and how students enroll in it.

5. Courses
    Description: Stores information about each course offered by the TestPrep Center.
    Fields:
        -   id (Primary Key)
        -   title (e.g., 'IELTS', 'Spoken English')
        -   description
        -   duration_months
        -   total_lectures
        -   is_published (Boolean)

6. Batches
    Description: Represents a specific instance of a course that starts on a particular date with a dedicated group of students and instructors.
    Fields:
        -  id (Primary Key)
        -  course_id (Foreign Key to Courses)
        -  batch_title (e.g., 'IELTS B1 - Jan 2025')
        -  start_date
        -  end_date
        -  status ('upcoming', 'ongoing', 'completed')
        -  instructors_id
        -  instructors_name
        -  enroll_students

7. Enrollments
       Description: Manages the many-to-many relationship between students and batches. An enrollment record is created when a student joins a batch.
       Fields:
            -  id (Primary Key)
            -  student_id (Foreign Key to Users)
            -  batch_id (Foreign Key to Batches)
            -  enrollment_date`
            -  is_complete (Boolean)
            -  payment_id (Foreign Key to Payments)


C. Learning Content and Activities
These tables organize the actual learning materials and student assessments.

8. Modules
    Description: A course can be broken down into several modules or sections.
    Fields:
        -   id (Primary Key)
        -   course_id (Foreign Key to Courses)
        -   title
        -   order_index

9. Lectures
       Description: Represents an individual lecture or topic within a module.
       Fields:
          -  id (Primary Key)
          -  module_id (Foreign Key to Modules)
          -  title
          -  description
          -  lecture_date
          -  order_index

10. Content_Resources
       Description: Stores the actual content for each lecture, such as video links, documents, or text.
       Fields:
           -   id (Primary Key)
           -   lecture_id (Foreign Key to Lectures)
           -   content_type (e.g., 'video', 'pdf', 'text')
           -   title
           -   url_or_content
           -   media_id (Optional, Foreign Key to Media)

11. Assessments
       Description: A generalized table for all types of student evaluations, including assignments, tasks, and mock tests.
       Fields:
          -  id (Primary Key)
          -  batch_id (Foreign Key to Batches)
          -  lecture_id (Optional, Foreign Key to Lectures)
          -  course_id (Optional, Foreign Key to Lectures)
          -  title
          -  description
          -  assessment_type ('Assignment', 'Task', 'Mock Test')
          -  start_time
          -  end_time
          -  total_marks
          -  marks_obtained
          -  assessment_sheet
          -  assesment_checked_by

12. Submissions
       Description: Tracks student submissions for each assessment.
       Fields:
           -   id (Primary Key)
           -   assessment_id (Foreign Key to Assessments)
           -   student_id (Foreign Key to Users)
           -   submission_time
           -   submitted_content (URL or Text)
           -   marks_obtained
           -   feedback
           -   checked_by_mentor_id (Foreign Key to Users)

13. Attendance
       Description: Records student and employee attendance for specific events, like lectures or workdays.
       Fields:
        -  id (Primary Key)
        -  user_id (Foreign Key to Users)
        -  date
        -  status ('Present', 'Parmit_Absent')
        -  notes


D. Communication and Support
This section covers interactions between users within the platform.

14. Messages
       Description: Stores the individual messages sent within a conversation.
       Fields:
           -  id (Primary Key)
           -  sender_mobilenumber
           -  message_content
           -  sent_at
           -  is_read (Boolean)
           -  replayBy
           -  replayTime
           -  isAddTomarkeking

15. Q_and_A
       Description: A structured table for questions and answers related to courses, modules, or lectures.
       Fields:
           -  id (Primary Key)
           -  course_id (Foreign Key to Courses)
           -  lecture_id (Optional, Foreign Key to Lectures)
           -  student_id (Foreign Key to Users, the asker)
           -  question_text
           -  question_time
           -  answer_text
           -  answered_by_id (Foreign Key to Users, the replier)
           -  answer_time

16. Support_Tickets
       Description: A system for students to request support from mentors or staff.
       Fields:
           -  id (Primary Key)
           -  student_id (Foreign Key to Users)
           -  assigned_to_id (Foreign Key to Users)
           -  title
           -  description
           -  status ('Open', 'In Progress', 'Closed')
           -  created_at
           -  closed_at


E. Financial and Administrative
Tables for managing payments, employee tasks, and company-wide goals.

17. Payments
       Description: Records all financial transactions.
       Fields:
           -  id (Primary Key)
           -  user_id (Foreign Key to Users, who paid)
           -  amount
           -  payment_for ('Course Enrollment','salary','commission','bonus','others')
           -  transaction_id
           -  payment_method
           -  status ('Completed', 'Failed', 'Pending')
           -  verified_by_id (Foreign Key to Users)
           -  payment_date
           -  send_by
           -  received_by

18. Employee_Tasks
       Description: Tracks work assigned to employees. Replaces "Work archive".
       Fields:
           -  id (Primary Key)
           -  title
           -  description
           -  assigned_to_id (Foreign Key to Users)
           -  assigned_by_id (Foreign Key to Users)
           -  start_time
           -  end_time
           -  status ('To Do', 'In Progress', 'Done')
           -  checked_by_id (Foreign Key to Users)

19. Company_Goals
       Description: For leadership to set and track company-wide targets and ideas. Replaces "Rarget and Goal".
       Fields:
           -  id (Primary Key)
           -  title
           -  description
           -  set_by_id (Foreign Key to Users)
           -  start_date
           -  end_date
           -  status
           -  notes
           -  checked_by_id

20. Rewards
       Description: Manages rewards and recognition for students and employees.
       Fields:
           -  id (Primary Key)
           -  user_id (Foreign Key to Users, recipient)
           -  user_name (Foreign Key to Users, recipient)
           -  given_by_id (Foreign Key to Users)
           -  given_by_name (Foreign Key to Users)
           -  reward_date
           -  reason


F. Website and Content Management
Tables dedicated to managing public-facing content and marketing activities.

21. Posts
       Description: Manages content for blogs, social media, and notices. Replaces "Post-Content".
       Fields:
           -  id (Primary Key)
           -  author_id (Foreign Key to Users)
           -  title
           -  content
           -  post_type ('Blog', 'Notice', 'Social Media')
           -  publish_media ('Website', 'Facebook', 'YouTube')
           -  status ('Draft', 'Published', 'Archived')
           -  published_at
           -  checked_by_id (Foreign Key to Users)

22. Marketing_Leads
       Description: A simple CRM to track potential students. Replaces "Marketing-numbers".
       Fields:
           -  id (Primary Key)
           -  full_name
           -  phone_number
           -  email
           -  source
           -  notes

23. Follow_Ups
       Description: Tracks follow-up interactions with marketing leads.
       Fields:
           -  id (Primary Key)
           -  lead_id (Foreign Key to Marketing_Leads)
           -  followed_by_id (Foreign Key to Users)
           -  follow_up_date
           -  response_note

24. Website_Settings
       Description: Stores key-value pairs for website configuration data. Replaces "Web-Database".
       Fields:
           -  id
           -  Name
           -  logourl
           -  description
           -  short description
           -  mobileNumber
           -  address
           -  menu 
           -  footer

25. Media
       Description: A central library for all media files (images, videos, documents).
       Fields:
           -  id (Primary Key)
           -  uploader_id (Foreign Key to Users)
           -  file_name
           -  file_url
           -  file_type
           -  status ('active', 'inactive', 'trash')
           -  uploaded_at

26. Reviews
       Description: Manages reviews for courses.
       Fields:
           -  id (Primary Key)
           -  course_id (Foreign Key to Courses)
           -  user_id (Foreign Key to Users)
           -  rating (1 to 5)
           -  review_text
           -  created_at