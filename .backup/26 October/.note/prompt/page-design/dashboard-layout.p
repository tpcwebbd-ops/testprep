Act as a webApp developer in NextJS with Typescript. PWA is already implement in this NextJS project. And you are using tailwindCss.


dashboardSidebarData = [
    {id: 1, name: "Account": path: "/dashboard/account", icon: <MailCheck />},
    {id: 2, name: "User": path: "/dashboard/user" icon: <MailCheck />},
    {id: 3, name: "Session": path: "/dashboard/session" icon: <MailCheck />},
    {id: 4, name: "Verification": path: "/dashboard/verification" ,icon: <MailCheck />},
    {id: 5, name: "Site Setting": path: "/dashboard/site-setting" ,icon: <MailCheck />, childData: [
        {id: 51, name: "Publish", path: "/dashboard/site-setting/publish" ,icon: <MailCheck />},
        {id: 52, name: "About", path: "/dashboard/site-setting/about" ,icon: <MailCheck />},
        {id: 53, name: "Service", path: "/dashboard/site-setting/service" ,icon: <MailCheck />},
        {id: 54, name: "Contact", path: "/dashboard/site-setting/contact" ,icon: <MailCheck />},
        {id: 55, name: "Frequently Ask Question", path: "/dashboard/site-setting/Frequently-ask-question" ,icon: <MailCheck />},
        {id: 56, name: "Menu", path: "/dashboard/site-setting/menu" ,icon: <MailCheck />},
        {id: 57, name: "Privacy & Policy", path: "/dashboard/site-setting/privacy-and-policy" ,icon: <MailCheck />},
        {id: 58, name: "Terms & Condition", path: "/dashboard/site-setting/terms-and-condition" ,icon: <MailCheck />},
        {id: 59, name: "Footer", path: "/dashboard/site-setting/footer" ,icon: <MailCheck />},
    ]},
]

Now you have do generate a Layout for Dashboard. it has the following features.
 1. it is responsive for both mobile and desktop.
 2. add a little bit animation on transition div. 
 3. you have to design in one single component.
 4. you have to use glass-effect.

 in Desktop: it show the sidebar in left side. it have a toggle features. in sidebar at the top there is button for toggle.
 if there is  childData then it need to render in accordian. with collasp and view option.


 in mobile: there is 3 icon at the bottom.
    1. home
    2. WhatsApp icon 
    3. Settings

    After clicking setting it show the sidebar in left side. there is cross icon at the top. if there is  childData then it need to render in accordian. with collasp and view option.