Look at the page. 
Dashboard UI:
'src/app/dashboard/db-builder/page.tsx'
'src/app/dashboard/db-builder/utils.ts'
'src/app/dashboard/db-builder/edit-page/page.tsx'
'src/app/dashboard/db-builder/preview-page/page.tsx'


Redux:
'src/redux/features/db-builder/pageBuilderSlice.ts'

Api: 
'src/app/api/db-builder/v1/controller.ts'
'src/app/api/db-builder/v1/model.ts'
'src/app/api/db-builder/v1/route.ts'

Now your task is implement those featues as the following instructins.
1. Remove open in new tab. inside home 'src/app/dashboard/db-builder/page.tsx' and edit-page 'src/app/dashboard/db-builder/edit-page/page.tsx'
2. inside edit-page pease remove Form and Sections. and please implement 
    - Fields. from './all-fields/all-fields-index'