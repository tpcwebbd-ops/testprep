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
1. for home page in 'src/app/dashboard/db-builder/page.tsx'
    - only use Edit Icon 
    - Preview Icon
    - Delete Icon
    - and remove all others icon.
    


2. inside edit-page 'src/app/dashboard/db-builder/edit-page/page.tsx'  
    - Femove 'Fields' button and implement a button named 'Add Field' it will open a pop-up. insdie the pop there are two field. One is text and second is selected. It will select from 'Fields' button. 