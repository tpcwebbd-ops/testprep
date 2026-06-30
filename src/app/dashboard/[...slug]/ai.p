Look at the page 'src/app/dashboard/[...slug]/page.tsx'
'src/app/dashboard/[...slug]/PreviewPage.tsx'

and here is db-builder preview page 'src/app/dashboard/db-builder/preview-page/page.tsx'

and here is url example 1 = '/dashboard/db-builder/preview-page?pathTitle=/dashboard/dynamo-bd-parent/dynamoc-1'
and here is url example 2 = '/dashboard/db-builder/preview-page?pathTitle=/dashboard/dynamo-bd-parent/dynamoc-2'

and here is url example 4 = '/dashboard/dynamodbParent/dynamoc-1'
and here is url example 5 = '/dashboard/dynamodbParent/dynamoc-2'
and here is url example 6 = '/dashboard/dynamoc-1'
and here is url example 7 = '/dashboard/dynamoc-2'

url 1 and 2 is working well. But I want If I visit url 4, and 5 then it will render data dynamic db like url 1 and 2. and make sure it will work for url 6,7.