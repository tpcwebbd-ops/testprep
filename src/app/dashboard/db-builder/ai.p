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

And Look carefully insdie 'src/app/dashboard/db-builder/examples/components/ViewDataType.tsx'
You found a data named allDataType, Now your task is generate folder insdie 'all-fields' named 'field-3', 'field-4'... 
and generate as example data like 
Add.tsx
data.ts
Update.tsx
View.tsx 

Please Update 






Look at the page 'src/app/dashboard/db-builder/edit-page/page.tsx'
And you found a modle named 'Select Field' It will show in two line. make it one single line and add index inside each line.