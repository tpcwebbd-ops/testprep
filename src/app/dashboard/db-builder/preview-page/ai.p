Now look at the preview-page 'src/app/dashboard/db-builder/preview-page/page.tsx'
and 
'src/app/dashboard/db-builder/all-fields/field-1/Add.tsx'
'src/app/dashboard/db-builder/all-fields/field-1/Update.tsx'
'src/app/dashboard/db-builder/all-fields/field-1/View.tsx'
'src/app/dashboard/db-builder/all-fields/field-2/Add.tsx'
'src/app/dashboard/db-builder/all-fields/field-2/Update.tsx'
'src/app/dashboard/db-builder/all-fields/field-2/View.tsx'

Now please update 'field-1/Add.tsx' and 'field-2/Add.tsx' so it can render inside Add Model in preview-page.
please update 'field-1/Update.tsx' and 'field-2/Update.tsx' so it can render inside Update Model in preview-page.
please update 'field-1/View.tsx' and 'field-2/View.tsx' so it can render inside View Model in preview-page.











Now look at the preview-page 'src/app/dashboard/db-builder/edit-page/page.tsx' and implement those features as the following instructions. 
1. remove Field selected option. 
    - It will show a button named 'Select Field' it will open a pop-up. and inside the pop-up there is list of Field. I can choose form them. 





Now look at the preview-page 'src/app/dashboard/db-builder/preview-page/page.tsx' and implement those features as the following instructions. 
1. When I click Bulk Edit then it will open a model.
    - Inside Model I can change as the select options.
2. When I click Bulk Delete it will opena model after conform it will delete the data. 
3. When I click Bulk Export then it will open a model and there is two option name CSV and xlm(MS xl).

Add a conformation model to delete each item inside table. 


Look at the color combination, border, and style from 'src/app/dashboard/admin/sidebar/page.tsx' and implement the style in 'src/app/dashboard/db-bulder/edit-page/page.tsx' and 'src/app/dashboard/db-bulder/page.tsx' and 'src/app/dashboard/db-bulder/preview-page/page.tsx'


Now look at the preview-page 
'src/app/dashboard/db-builder/preview-page/page.tsx' 
api:
'src/app/api/db-builder/v1/controller.ts'
'src/app/api/db-builder/v1/model.ts'
'src/app/api/db-builder/v1/route.ts'

here is url ='/dashboard/db-builder/preview-page?pathTitle=/dashboard/db-builder/custom-course' 
and it will render the data base. Now please create a dynamic route so if the url is ='/dashboard/dynamicdb/custom-course' then it will render same as preview page. and make sure if the path is change then it also work. and If not found then it render database not found sections.