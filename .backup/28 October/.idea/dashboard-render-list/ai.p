Act as a senior web designer and Software architect. I will give you some data like 
"01. /profile            -> User" here '01.' is searal no, '/profile' is path and '-> User' is user role.
here is another example "64. /profile            ->   Social Media Marketer" here '64.' is searal no, '/profile' is path and '-> Social Media Marketer' is user role. 

Your task is to generate a const variable in Typescript with type. 
here is expected output 

const userComponentAndRole: IUserComponentAndRole = [
    {id:1, name:"profile", path: "/profile", userAndComponentLst: [
        {id:1, user: "user", component: <UserProfile/>},
        {id:2, user: "Social Media Marketer", component: <SocialMediaMarketerProfile/>}
    ]}
]


here is data list 

```
01. /profile            -> User
02. /message            -> User
03. /assignment         ->  Student
04. /test               ->  Student
05. /mock-test          ->  Student
06. /review             ->  Student
07. /payment            ->  Student
08. /book-mark          ->  Student
09. /my-class           ->  Student
10. /my-course          ->  Student
11. /attendance         ->  Student
12. /support            ->  Student
13. /profile            ->  Student
14. /batch              ->    Mentor
15. /absent-student     ->    Mentor
16. /task and review    ->    Mentor
17. /assignment         ->    Mentor
18. /mock-test          ->    Mentor
19. /reword             ->    Mentor
20. /profile            ->    Mentor
21. /target-and-goal    ->  MD
22. /work-summery       ->  MD
23. /access-management  ->  MD
24. /profile            ->  MD
25. /finance            ->    CFO
26. /work-summery       ->    CFO
27. /profile            ->    CFO
28. /batch-and-progress ->      COO
29. /employee-progress  ->      COO
30. /summery            ->      COO
31. /access management  ->      COO
32. /profile            ->      COO
33. /batch-and-progress ->   Admin
34. /employee-progress  ->   Admin
35. /summery            ->   Admin
36. /access management  ->   Admin
37. /profile            ->   Admin
38. /site-setting       ->   Admin
39. /batch-and-progress -> Instructor
40. /course-content     -> Instructor
41. /summery            -> Instructor
42. /media              -> Instructor
43. /profile            -> Instructor
44. /site-setting       -> Instructor
45. /message            ->   Moderator
46. /course-content     ->   Moderator
47. /summery            ->   Moderator
48. /media              ->   Moderator
49. /profile            ->   Moderator
50. /site-setting       ->   Moderator
51. /batch-and-progress -> CTO
52. /employee-progress  -> CTO
53. /summery            -> CTO
54. /access-management  -> CTO
55. /profile            -> CTO
56. /site-setting       -> CTO
57. /target-and-goal    -> CTO
58. /content-planner    -> Social Media Manager
59. /batch-and-progress -> Social Media Manager
60. /profile            -> Social Media Manager
61. /site-setting       -> Social Media Manager
62. /content-planner    ->   Social Media Marketer
63. /batch-and-progress ->   Social Media Marketer
64. /profile            ->   Social Media Marketer
65. /audience-modifier  ->   Social Media Marketer
```

