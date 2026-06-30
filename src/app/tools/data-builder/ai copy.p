Look at the page.tsx 'src/app/tools/data-builder/page.tsx'.
here is example of redux 
    'src/redux/features/sidebars/sidebarsSlice.ts'
    'src/redux/features/page-builder/pageBuilderSlice.ts'
    'src/redux/features/menu-editor/menuEditorSlice.ts'
    'src/redux/features/footer-editor/footerSlice.ts'
    
and here is deafult data for sidebars 
```
{
    "data": {
        "sidebars": [
            {
                "_id": "69e4a3886e54e154c5de1def",
                "sl_no": 10,
                "name": "Credential",
                "path": "/dashboard",
                "iconName": "HelpCircle",
                "children": [
                    {
                        "sl_no": 11,
                        "name": "Account",
                        "path": "/dashboard/credential/account",
                        "iconName": "Settings"
                    },
                    {
                        "sl_no": 12,
                        "name": "Session",
                        "path": "/dashboard/credential/session",
                        "iconName": "AlertTriangle"
                    },
                    {
                        "sl_no": 13,
                        "name": "Verification",
                        "path": "/dashboard/credential/verification",
                        "iconName": "BookmarkPlus"
                    }
                ],
                "createdAt": "2026-04-19T09:42:32.332Z",
                "updatedAt": "2026-06-30T09:54:25.790Z",
                "__v": 0
            },
            {
                "_id": "69e4a3e06e54e154c5de1dfc",
                "sl_no": 20,
                "name": "Admin",
                "path": "/dashboard/",
                "iconName": "ShieldCheck",
                "children": [
                    {
                        "sl_no": 21,
                        "name": "Access",
                        "path": "/dashboard/admin/access",
                        "iconName": "FileSignature"
                    },
                    {
                        "sl_no": 22,
                        "name": "Role",
                        "path": "/dashboard/admin/role",
                        "iconName": "FileSignature"
                    },
                    {
                        "sl_no": 23,
                        "name": "Sidebar",
                        "path": "/dashboard/admin/sidebar",
                        "iconName": "ScrollText"
                    },
                    {
                        "sl_no": 24,
                        "name": "Menu Editor",
                        "path": "/dashboard/admin/menu-editor",
                        "iconName": "ScrollText"
                    },
                    {
                        "sl_no": 25,
                        "name": "Page Builder",
                        "path": "/dashboard/admin/page-builder",
                        "iconName": "ShieldCheck"
                    }
                ],
                "createdAt": "2026-04-19T09:44:00.040Z",
                "updatedAt": "2026-06-30T09:54:25.790Z",
                "__v": 0
            },
            {
                "_id": "69e4a4356e54e154c5de1e0c",
                "sl_no": 30,
                "name": "Media",
                "path": "/dashboard/media",
                "iconName": "Image",
                "children": [],
                "createdAt": "2026-04-19T09:45:25.844Z",
                "updatedAt": "2026-06-30T09:54:25.790Z",
                "__v": 0
            },
            {
                "_id": "69e4a4456e54e154c5de1e10",
                "sl_no": 40,
                "name": "Profile",
                "path": "/dashboard/profile",
                "iconName": "User",
                "children": [],
                "createdAt": "2026-04-19T09:45:41.278Z",
                "updatedAt": "2026-06-30T09:54:25.790Z",
                "__v": 0
            },
            {
                "_id": "69e4a46a6e54e154c5de1e14",
                "sl_no": 50,
                "name": "Courses",
                "path": "/dashboard/courses",
                "iconName": "Calendar",
                "children": [],
                "createdAt": "2026-04-19T09:46:18.615Z",
                "updatedAt": "2026-06-30T09:54:25.790Z",
                "__v": 0
            },
            {
                "_id": "69e4a48e6e54e154c5de1e18",
                "sl_no": 60,
                "name": "My Course",
                "path": "/dashboard/my-course",
                "iconName": "Server",
                "children": [],
                "createdAt": "2026-04-19T09:46:54.421Z",
                "updatedAt": "2026-06-30T09:54:25.790Z",
                "__v": 0
            },
            {
                "_id": "69e4a4a46e54e154c5de1e1c",
                "sl_no": 70,
                "name": "Enrollments",
                "path": "/dashboard/enrollments",
                "iconName": "Package",
                "children": [],
                "createdAt": "2026-04-19T09:47:16.110Z",
                "updatedAt": "2026-06-30T09:54:25.790Z",
                "__v": 0
            },
            {
                "_id": "6a379763f3ee23362edb8942",
                "sl_no": 80,
                "name": "DB Builder",
                "path": "/dashboard/db-builder",
                "iconName": "Wrench",
                "children": [],
                "createdAt": "2026-06-21T07:48:51.155Z",
                "updatedAt": "2026-06-30T09:54:25.790Z",
                "__v": 0
            },
            {
                "_id": "6a3d01ab4904e16dbd00f379",
                "sl_no": 90,
                "name": "News",
                "path": "/dashboard/news",
                "iconName": "FileBadge",
                "children": [],
                "createdAt": "2026-06-25T10:23:39.390Z",
                "updatedAt": "2026-06-30T09:54:25.790Z",
                "__v": 0
            },
            {
                "_id": "6a43922e8ccb344aad26869b",
                "sl_no": 100,
                "name": "DynamoDB",
                "path": "/dashboard/dynamodbParent",
                "iconName": "Menu",
                "children": [
                    {
                        "sl_no": 101,
                        "name": "Dynamo 1",
                        "path": "/dashboard/dynamodbParent/dynamoc-1",
                        "iconName": "Edit2"
                    },
                    {
                        "sl_no": 102,
                        "name": "Dynamo 2",
                        "path": "/dashboard/dynamodbParent/dynamoc-2",
                        "iconName": "Edit2"
                    }
                ],
                "createdAt": "2026-06-30T09:53:50.418Z",
                "updatedAt": "2026-06-30T09:54:25.790Z",
                "__v": 0
            },
            {
                "_id": "6a4395b18ccb344aad268741",
                "sl_no": 110,
                "name": "bymo-1",
                "path": "/dashboard/bymo-1",
                "iconName": "ShieldCheck",
                "children": [],
                "createdAt": "2026-06-30T10:08:49.283Z",
                "updatedAt": "2026-06-30T10:08:49.283Z",
                "__v": 0
            }
        ],
        "total": 11,
        "page": 1,
        "limit": 100
    },
    "message": "Sidebars fetched successfully",
    "status": 200
}
```

