here is example of 
orders/controller.ts
```

```
orders/model.ts
```

```
orders/route.ts
```

```
redux/features/orders/ordersSlice.ts
```

```
products/controller.ts
```

```
products/model.ts
```

```
products/route.ts
```

```
redux/features/products/productsSlice.ts
```

```

and here is example of response
```
{
    "data": {
        "orders": [],
        "total": 0,
        "page": 1,
        "limit": 10
    },
    "message": "Fetched successfully",
    "status": 200
}
```

Now your task is to build the following pages with a modern, responsive, and visually appealing UI/UX, including smooth animations and clean design.

────────────────────────────
🏠 Home Page `/page.tsx`
────────────────────────────

1. 🎨 Product Display (Hero + Grid Layout)
   - Create an **eye-catching home page** with:
     - Optional hero/banner section (carousel or static highlight)
     - Smooth entrance animations (fade, slide, staggered cards)
   - Display products in a **responsive grid system**:
     - Mobile → 1 column
     - Tablet → 2 columns
     - Desktop → 3–5 columns

2. 🧾 Product Card Design
   Each product card should include:
   - Product image (hover zoom effect)
   - Name, price, short description
   - Rating (optional)
   - Clean card UI (rounded corners, shadow, spacing)

3. 🛒 Actions on Product Card
   - **Add to Cart** button:
     - With icon + hover animation
     - Show toast/snackbar on success
   - **Order Now** button:
     - Direct checkout flow
   - **View Details** button:
     - Opens a **modern modal**

4. 🔍 Product Details Modal
   - Centered modal with:
     - Smooth **fade + scale animation**
     - **Close (✕) button** at top-right
   - Inside modal:
     - Full product details (image gallery, description, price, stock, etc.)
     - Buttons:
       - Add to Cart
       - Order Now
   - Fully responsive (stack content on mobile)

5. 🎬 Animations & UI
   - Card hover → lift + shadow
   - Button hover → scale + color transition
   - Modal → smooth open/close transitions
   - Use consistent color palette:
     - Primary: Blue/Indigo
     - Accent: Orange/Emerald
     - Background: Light/neutral

────────────────────────────
🛒 Cart Page `/cart.tsx`
────────────────────────────

1. 🧩 Layout Structure
   - Responsive split layout:
     - **Left side (Product Summary)**
     - **Right side (User Form / Checkout)**
   - Mobile → stack vertically
   - Desktop → side-by-side (grid/flex)

2. 📦 Cart Product Section (Left)
   - List all added products with:
     - Image, name, price, quantity
     - Increase/decrease quantity controls
     - Remove item option
   - Show:
     - Subtotal per item
     - Total price summary
   - Smooth UI updates (no full reload)

3. 🧾 Checkout Form (Right)
   - Collect user details:
     - Name
     - Phone
     - Address
     - Optional notes
   - Clean form UI:
     - Floating labels or modern inputs
     - Inline validation

4. ⏱️ Order Restriction Logic
   - If a user orders the same product with the same quantity:
     - Restrict re-order for **10 minutes**
     - Show warning message:
       👉 “You can reorder this item after 10 minutes”

5. ✅ User Feedback & Messaging
   - Success:
     - Show confirmation message (modal/toast)
   - Error:
     - Clear and user-friendly error messages
   - Loading:
     - Show spinner or skeleton

6. 🎟️ Voucher / Coupon Section
   - Add **“View Voucher”** option:
     - Opens modal or expandable section
     - Show available discounts/coupons
     - Allow applying voucher code
   - Update total price dynamically after applying

7. 🎨 UI/UX Enhancements
   - Use modern design system (Tailwind / ShadCN / MUI)
   - Consistent spacing and typography
   - Soft shadows, rounded corners (lg/2xl)
   - Sticky summary or checkout section (optional)

8. 📱 Full Responsiveness
   - Mobile-first design
   - Smooth scrolling and touch-friendly UI
   - Optimized spacing for smaller screens

9. ⚡ Performance & UX
   - Lazy load images
   - Debounced updates for quantity changes
   - Optimistic UI updates for cart actions

10. 🧼 Code Quality
   - Component-based structure:
     - ProductCard
     - ProductModal
     - CartItem
     - CheckoutForm
   - Maintain clean and reusable code
   - Proper state management (Redux / Context / RTK Query optional)





