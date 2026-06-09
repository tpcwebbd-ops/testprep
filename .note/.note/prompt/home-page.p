here is example of 
orders/controller.ts
```
import { FilterQuery } from 'mongoose';

import { withDB } from '@/app/api/utils/db';
import { formatResponse, IResponse } from '@/app/api/utils/utils';

import Order from './model';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

function isMongoError(error: unknown): error is MongoError {
  return error !== null && typeof error === 'object' && 'code' in error && typeof (error as MongoError).code === 'number';
}

export async function createOrder(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const orderData = await req.json();
      const newOrder = await Order.create(orderData);
      return formatResponse(newOrder, 'Order created successfully', 201);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function getOrderById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'ID is required', 400);
    const order = await Order.findById(id);
    if (!order) return formatResponse(null, 'Not found', 404);
    return formatResponse(order, 'Fetched successfully', 200);
  });
}

export async function getOrders(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '1000');
    const skip = (page - 1) * limit;
    const searchQuery = url.searchParams.get('q');
    let filter: FilterQuery<unknown> = {};

    if (searchQuery) {
      filter = {
        $or: [
          { orderNumber: { $regex: searchQuery, $options: 'i' } },
          { 'customer.name': { $regex: searchQuery, $options: 'i' } },
          { 'customer.email': { $regex: searchQuery, $options: 'i' } },
          { 'customer.phone': { $regex: searchQuery, $options: 'i' } },
        ],
      };
    }

    const orders = await Order.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await Order.countDocuments(filter);
    return formatResponse({ orders, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function getAllOrders(): Promise<IResponse> {
  return withDB(async () => {
    const page = parseInt('1');
    const limit = parseInt('1000');
    const skip = (page - 1) * limit;
    const filter: FilterQuery<unknown> = {};
    const orders = await Order.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await Order.countDocuments(filter);
    return formatResponse({ orders, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function updateOrder(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      if (!id) return formatResponse(null, 'ID is required', 400);
      const updated = await Order.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!updated) return formatResponse(null, 'Not found', 404);

      return formatResponse(updated, 'Updated successfully', 200);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function deleteOrder(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    if (!id) return formatResponse(null, 'ID required', 400);
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Deleted successfully', 200);
  });
}

```
orders/model.ts
```

import mongoose, { Schema } from 'mongoose';

const orderSchema = new Schema(
  {
    storeId: { type: Schema.Types.ObjectId },
    orderNumber: { type: String, unique: true },
    customer: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },
    items: [
      {
        productId: { type: Schema.Types.ObjectId },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number },
        variant: {
          name: { type: String },
          option: { type: String },
        },
      },
    ],
    totalAmount: { type: Number },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number },
    paymentMethod: { type: String, enum: ['cod', 'online'] },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    deliveryStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: {
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    notes: { type: String },
    author_email: { type: String },
  },
  { _id: true, timestamps: true },
);

export default mongoose.models.Order || mongoose.model('Order', orderSchema);

```
orders/route.ts
```

import { revalidatePath } from 'next/cache';

import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';
import { isUserHasAccessByRole, IWantAccess } from '@/app/api/utils/is-user-has-access-by-role';

import { getOrders, createOrder, updateOrder, deleteOrder, getOrderById } from './controller';

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'orders',
      access: 'read',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getOrderById(req) : await getOrders(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'orders',
      access: 'create',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await createOrder(req);
  if (result.status === 200 || result.status === 201) {
    revalidatePath('/orders');
  }
  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'orders',
      access: 'update',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await updateOrder(req);
  if (result.status === 200) {
    revalidatePath('/orders');
  }
  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'orders',
      access: 'delete',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await deleteOrder(req);
  if (result.status === 200) {
    revalidatePath('/orders');
  }
  return formatResponse(result.data, result.message, result.status);
}

```
redux/features/orders/ordersSlice.ts
```

import { apiSlice } from '@/redux/api/apiSlice';

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getOrders: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/orders/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeOrders' as const, id: 'LIST' }],
    }),
    getOrderById: builder.query({
      query: id => `/api/orders/v1?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'tagTypeOrders' as const, id }],
    }),
    addOrder: builder.mutation({
      query: newOrder => ({
        url: '/api/orders/v1',
        method: 'POST',
        body: newOrder,
      }),
      invalidatesTags: [{ type: 'tagTypeOrders' as const, id: 'LIST' }],
    }),
    updateOrder: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/orders/v1`,
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeOrders' as const, id },
        { type: 'tagTypeOrders' as const, id: 'LIST' },
      ],
    }),
    deleteOrder: builder.mutation({
      query: ({ id }) => ({
        url: `/api/orders/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeOrders' as const, id },
        { type: 'tagTypeOrders' as const, id: 'LIST' },
      ],
    }),
    bulkUpdateOrders: builder.mutation({
      query: bulkData => ({
        url: `/api/orders/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeOrders' as const, id: 'LIST' }],
    }),
    bulkDeleteOrders: builder.mutation({
      query: bulkData => ({
        url: `/api/orders/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeOrders' as const, id: 'LIST' }],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useAddOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useBulkUpdateOrdersMutation,
  useBulkDeleteOrdersMutation,
} = ordersApi;

```
products/controller.ts
```

import { FilterQuery } from 'mongoose';

import { withDB } from '@/app/api/utils/db';
import { formatResponse, IResponse } from '@/app/api/utils/utils';

import Product from './model';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

function isMongoError(error: unknown): error is MongoError {
  return error !== null && typeof error === 'object' && 'code' in error && typeof (error as MongoError).code === 'number';
}

export async function createProduct(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const productData = await req.json();
      const newProduct = await Product.create(productData);
      return formatResponse(newProduct, 'Product created successfully', 201);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function getProductById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'ID is required', 400);
    const product = await Product.findById(id);
    if (!product) return formatResponse(null, 'Not found', 404);
    return formatResponse(product, 'Fetched successfully', 200);
  });
}

export async function getProducts(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '1000');
    const skip = (page - 1) * limit;
    const searchQuery = url.searchParams.get('q');
    let filter: FilterQuery<unknown> = {};

    if (searchQuery) {
      filter = {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { slug: { $regex: searchQuery, $options: 'i' } },
          { sku: { $regex: searchQuery, $options: 'i' } },
          { category: { $regex: searchQuery, $options: 'i' } },
        ],
      };
    }

    const products = await Product.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await Product.countDocuments(filter);
    return formatResponse({ products, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function getAllProducts(): Promise<IResponse> {
  return withDB(async () => {
    const page = parseInt('1');
    const limit = parseInt('1000');
    const skip = (page - 1) * limit;
    const filter: FilterQuery<unknown> = {};
    const products = await Product.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await Product.countDocuments(filter);
    return formatResponse({ products, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function updateProduct(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      if (!id) return formatResponse(null, 'ID is required', 400);
      const updated = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!updated) return formatResponse(null, 'Not found', 404);

      return formatResponse(updated, 'Updated successfully', 200);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function deleteProduct(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    if (!id) return formatResponse(null, 'ID required', 400);
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Deleted successfully', 200);
  });
}

```
products/model.ts
```

import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema(
  {
    storeId: { type: String },
    name: { type: String },
    slug: { type: String, unique: true },
    description: { type: String },
    price: { type: Number },
    discountPrice: { type: Number },
    sku: { type: String },
    stock: { type: Number, default: 0 },
    category: { type: String },
    tags: [{ type: String }],
    mediaIds: [{ type: String }],
    variants: [
      {
        name: { type: String },
        options: [
          {
            label: { type: String },
            price: { type: Number },
            stock: { type: Number },
          },
        ],
      },
    ],
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'draft',
    },
    author_email: { type: String },
  },
  { _id: true, timestamps: true },
);

export default mongoose.models.Product || mongoose.model('Product', productSchema);

```
products/route.ts
```
import { revalidatePath } from 'next/cache';

import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';
import { isUserHasAccessByRole, IWantAccess } from '@/app/api/utils/is-user-has-access-by-role';

import { getProducts, createProduct, updateProduct, deleteProduct, getProductById } from './controller';

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'products',
      access: 'read',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getProductById(req) : await getProducts(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'products',
      access: 'create',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await createProduct(req);
  if (result.status === 200 || result.status === 201) {
    revalidatePath('/products');
  }
  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'products',
      access: 'update',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await updateProduct(req);
  if (result.status === 200) {
    revalidatePath('/products');
  }
  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'products',
      access: 'delete',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await deleteProduct(req);
  if (result.status === 200) {
    revalidatePath('/products');
  }
  return formatResponse(result.data, result.message, result.status);
}

```
redux/features/products/productsSlice.ts
```

import { apiSlice } from '@/redux/api/apiSlice';

export const productsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/products/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeProducts' as const, id: 'LIST' }],
    }),
    getProductById: builder.query({
      query: id => `/api/products/v1?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'tagTypeProducts' as const, id }],
    }),
    addProduct: builder.mutation({
      query: newProduct => ({
        url: '/api/products/v1',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: [{ type: 'tagTypeProducts' as const, id: 'LIST' }],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/products/v1`,
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeProducts' as const, id },
        { type: 'tagTypeProducts' as const, id: 'LIST' },
      ],
    }),
    deleteProduct: builder.mutation({
      query: ({ id }) => ({
        url: `/api/products/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeProducts' as const, id },
        { type: 'tagTypeProducts' as const, id: 'LIST' },
      ],
    }),
    bulkUpdateProducts: builder.mutation({
      query: bulkData => ({
        url: `/api/products/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeProducts' as const, id: 'LIST' }],
    }),
    bulkDeleteProducts: builder.mutation({
      query: bulkData => ({
        url: `/api/products/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeProducts' as const, id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useBulkUpdateProductsMutation,
  useBulkDeleteProductsMutation,
} = productsApi;

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





Here is information about my company and Please build a home page for my website.
Name: Amar Cart 
Description: best online platfrom for trusted products. we have more then 1000 products with variants of each. We have digital, physical, watch, cloth, all kinks of goods. 

Please add more than 6 sections like top sells, recent, top discount, all products, category, and much more. 

no not add footer. 
make it responsive for mobile, tablet, desktop.
make it eye-catcingt animation, design, and color-combination.

