Look at the page.tsx 'src/app/tools/data-builder/page.tsx'.
here is example of redux and dashboard page
SideBar data:
    'src/redux/features/sidebars/sidebarsSlice.ts'
    'src/app/api/sidebars/v1/model.ts'
    'src/app/dashboard/admin/sidebar/page.tsx' and you found a model to add sidebars.
    default data 
    ```
1. name:Credential
   path: /dashboard

     a. name: Account
        path:  /dashboard/credential/account

     b. name: Session
        path:  /dashboard/credential/session

     c. name: Verification
        path:  /dashboard/credential/verification

2.  name: Admin
    path: /dashboard

        a.  name: Access
            path:  /dashboard/admin/access

        b.  name: Footer Editor
            path:  /dashboard/admin/footer-editor

        c.  name: Install Popup
            path:  /dashboard/admin/install-popup

        d.  name: Menu Editor
            path:  /dashboard/admin/menu-editor

        e.  name: Role
            path:  /dashboard/admin/role

        f.  name: Sidebar
            path:  /dashboard/admin/sidebar

        g.  name: Users
            path:  /dashboard/admin/users

        h.  name: Page Builder
            path:  /dashboard/admin/page-builder

3.  name: Raw Path
    path: /dashboard

4.  name: Media
    path:  /dashboard/media

5.  name: Profile
    path:  /dashboard/profile
    ```

Now your task is update page.tsx 'src/app/tools/data-builder/page.tsx' as the following instructions.
1. At the top there are accordion name'Add Sidebar' 
    - if it is open then I can see the demo data.
    - at the right there is two button, it will always visible when the model is closed or open. 
    - first button is update sidebar data. and add functionality so I can edit sidebar demo data and can add more data.
    - at the right there is another button name add. 
    - it will open a confiem and if press ok then it will post request one by one. and make sure from 1 to 5 is parent. and from a-z is sub sidebar. 
2. Now generate the page. and if there is an error then show it in display.


Page builder Data:
    'src/redux/features/page-builder/pageBuilderSlice.ts'

Menu editor data:
    'src/redux/features/menu-editor/menuEditorSlice.ts'

Footer editor data:
    'src/redux/features/footer-editor/footerSlice.ts'
    