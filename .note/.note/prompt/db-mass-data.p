Look at the dashboard/enrollments/page.tsx
```
const Page = () => {
  return <main>Page</main>;
};
export default Page;
```

api/enrollments/controller.ts
```

```
api/enrollments/model.ts
```

```
api/enrollments/route.ts
```

```

redux/enrollmentsSlice.ts
```

```

components/ImageUploadManager.ts
```

```

components/ImageUploadManagerSingle
```

```

components/YTVideoUploadManager
```

```

components/YTVideoUploadManagerSingle
```

```

and here is example of response
```
{
    "data": {
        "enrollments": [],
        "total": 0,
        "page": 1,
        "limit": 10
    },
    "message": "Fetched successfully",
    "status": 200
}
```

Now your task is to update `dashboard/enrollments/page.tsx` with the following requirements:

1. 🔘 Add Button & Modal (Top Right)
   - Place a visually appealing **"Add Order"** button at the top-right corner.
   - On click, open a **modern modal (centered, responsive)** with:
     - Smooth **fade + scale animation** on open/close.
     - A **close (✕) icon** at the top-right.
   - Inside the modal:
     - Dynamically generate **all fields from the model**.
     - Handle media inputs:
       - Single image → `ImageUploadManagerSingle`
       - Multiple images → `ImageUploadManager`
       - Single video → `VideoUploadImageManagerSingle`
       - Multiple videos → `VideoUploadImageManager`
     - Bottom aligned **"Add" button** with loading state.
   - Ensure:
     - Proper **form validation**
     - Clear **error messages**
     - **Responsive layout** (stack fields on mobile, grid on desktop)

2. 📊 Summary Section (Filterable Cards)
   - Create a **summary dashboard section** with 3 cards:
     - Last Month (30 days)
     - Last Week (7 days)
     - Total (Lifetime)
   - Each card:
     - Displays **total sales/enrollments**
     - Has **hover animation (scale + shadow)**
     - Is **clickable to filter data**
   - Use a clean **card layout with icons and color distinction**
   - Make it **responsive (grid → stacked on mobile)**

3. 🔍 Smart Search Bar
   - Add a **debounced search input**:
     - Trigger API call after **3 characters**
     - Add **300ms–500ms debounce**
     - Avoid duplicate fetch if input hasn’t changed
   - Include:
     - Search icon inside input
     - Loading indicator while fetching

4. 📋 Table Section (Advanced Data Table)
   - Build a **fully responsive data table** with:
     - Horizontal scroll on mobile
     - Sticky header (optional)
   - Features:
     - Column visibility toggle (show/hide columns)
     - Export options (CSV, Excel)
     - Bulk select (checkbox per row + select all)
     - Bulk actions:
       - Delete
       - Update
     - Row actions:
       - Edit
       - Delete
       - View (optional modal/drawer)
   - Pagination:
     - Bottom aligned
     - Select items per page (10–500)
     - Smooth transition when changing pages

5. ⚙️ State Management (Redux Toolkit)
   - Use **Redux Toolkit Query (RTK Query)**:
     - Queries for fetching data
     - Mutations for add, update, delete
   - Ensure:
     - Proper cache invalidation
     - Optimistic updates (optional but preferred)

6. 🚦 UX States Handling
   - Loading:
     - Use skeleton loaders or spinners
   - Error:
     - Show user-friendly error messages
   - Empty State:
     - Display:
       👉 “No data found in database”
       - Add illustration or icon for better UX

7. 🎨 UI/UX & Design Guidelines
   - Use **modern design system (Tailwind / ShadCN / Material UI)**:
     - Soft shadows, rounded corners (lg/2xl)
     - Consistent spacing (padding & margins)
   - Color palette:
     - Primary: Indigo / Blue
     - Accent: Emerald / Orange
     - Background: Light gray / white
   - Typography:
     - Clear hierarchy (title, subtitle, body)
   - Animations:
     - Button hover → scale + color transition
     - Modal → fade + zoom
     - Cards → hover lift effect
     - Table rows → subtle hover highlight

8. 📱 Full Responsiveness
   - Mobile:
     - Stack layouts vertically
     - Scrollable table
   - Tablet:
     - 2-column grids where possible
   - Desktop/Laptop:
     - Full grid layout with proper spacing

9. 🧩 Code Quality
   - Keep components reusable:
     - Modal component
     - Table component
     - Form components
   - Use clean folder structure
   - Maintain readability and separation of concerns