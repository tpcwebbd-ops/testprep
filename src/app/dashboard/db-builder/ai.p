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






--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


Please look at the file 'src/app/dashboard/news/page.tsx' Inside the page you found Model named 'Add', 'View', and 'Edit'. inside the model you found field named 
- ComplexValue 

* Now please copy Style and How it render inside Add, View, Edit Model.

please also look at the page 'src/app/dashboard/db-builder/edit-page/page.tsx' and you find the following fild inside Add Field Model. 
Now your task is Update Add, Edit, Vew Model inside db-builder based on news/page.tsx here as the naming referance. 

JsonVALUEFIELD  [fieldType | 'bg-builder']         ->    ComplexValue  [Field Name | 'news/page.tsx']


---------------------------------------------------------------------------------

---------------------------------------------------------------------------------


-------------------------------------------
---------------------------------------------------------------------------------
- Title
- Email
- Password
- Passcode
- Area
- Sub Area
- Products Images 
- Personal Image 
- Description 
- Age
- Amount
- IsActive
- Start Date 
- Start Time 
- Schedule Date
- Schedule Time 
- Favorite Color 
- Number
- Profile
- Test
- Info 
- Shift
- Policy
- Hobbies
- Ideas
- Students
- ComplexValue
---------------------------------------------------------------------------------
STRING           ->    Title
EMAIL            ->    Email
PASSWORD         ->    Password
PASSCODE         ->    Passcode
SELECT           ->    Area
DYNAMICSELECT    ->    Sub Area
IMAGES           ->    Products Images 
IMAGE            ->    Personal Image 
DESCRIPTION      ->    Description 
INTNUMBER       ->    Age

FLOATNUMBER     ->    Amount
BOOLEAN         ->    IsActive
DATE            ->    Start Date 
TIME            ->    Start Time 
DATERANGE       ->    Schedule Date
TIMERANGE       ->    Schedule Time 

COLORPICKER     ->    Favorite Color 
PHONE           ->    Number
URL             ->    Profile
RICHTEXT        ->    Test
AUTOCOMPLETE    ->    Info 
RADIOBUTTON     ->    Shift

CHECKBOX        ->    Policy
MULTICHECKBOX   ->    Hobbies   
MULTIOPTIONS    ->    Ideas 
STRINGARRAY     ->    Students   
JsonVALUEFIELD  ->    ComplexValue 