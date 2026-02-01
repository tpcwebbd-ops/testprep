### Changes for App Generator

- 1. .env.local
     Add AuthorizationEnable=true in .env.local
     NEXT_PUBLIC_AuthorizationEnable=true

- 2. route.ts
     if (process.env.AuthorizationEnable === 'true') {
     }
- 3. dashboard/hasAccess.tsx
     if (process.env.NEXT_PUBLIC_AuthorizationEnable === 'false') {
     return (
     <main>
     <div className="lg:p-10 p-4 pb-12 animate-in fade-in duration-500">{children}</div>
     </main>
     );
     }
- 4. update dashboard/access/access/components/Add.tsx
- 5. remove summery from Access/page.tsx
- 6. remove filter from Access/page.tsx

## Working on too many requests

     - hasAccess in dashboard/hasAccess.tsx
     - components/common/TooManyRequest.tsx
