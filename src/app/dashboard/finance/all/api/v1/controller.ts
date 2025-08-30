import { withDB } from '@/app/api/utils/db';

import PaymentFinance from './model';

interface IResponse {
  data: unknown;
  message: string;
  status: number;
}

// Helper to format responses
const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
  data,
  message,
  status,
});

// CREATE Finance
export async function createFinance(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const financeData = await req.json();
      const newFinance = await PaymentFinance.create({
        ...financeData,
      });
      return formatResponse(newFinance, 'Finance created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}

// GET single Finance by ID
export async function getFinanceById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'Finance ID is required', 400);

    const finance = await PaymentFinance.findById(id);
    if (!finance) return formatResponse(null, 'Finance not found', 404);

    return formatResponse(finance, 'Finance fetched successfully', 200);
  });
}

// GET all Finances with pagination
export async function getFinances(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const searchQuery = url.searchParams.get('q');

    let searchFilter = {};

    // Apply search filter only if a search query is provided
    if (searchQuery) {
      searchFilter = {
        $or: [
          { studentName: { $regex: searchQuery, $options: 'i' } },
          { studentEmail: { $regex: searchQuery, $options: 'i' } },
          { studentNumber: { $regex: searchQuery, $options: 'i' } },
          { courseName: { $regex: searchQuery, $options: 'i' } },
          { coursePrice: { $regex: searchQuery, $options: 'i' } },
          { coureCode: { $regex: searchQuery, $options: 'i' } },
          { batchNo: { $regex: searchQuery, $options: 'i' } },
          { paymentStatus: { $regex: searchQuery, $options: 'i' } },
          { discount: { $regex: searchQuery, $options: 'i' } },
          { totalPayment: { $regex: searchQuery, $options: 'i' } },
          { enrollmentDate: { $regex: searchQuery, $options: 'i' } },
          { paymentData: { $regex: searchQuery, $options: 'i' } },
          { verifyWhomName: { $regex: searchQuery, $options: 'i' } },
          { verifyWhomEmail: { $regex: searchQuery, $options: 'i' } },
          { transectionId: { $regex: searchQuery, $options: 'i' } },
          { invoiceNumber: { $regex: searchQuery, $options: 'i' } },
          { refundStatus: { $regex: searchQuery, $options: 'i' } },
          { refundAmount: { $regex: searchQuery, $options: 'i' } },
        ],
      };
    }

    const finances = await PaymentFinance.find(searchFilter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit);

    const totalFinances = await PaymentFinance.countDocuments(searchFilter);

    return formatResponse(
      {
        finances: finances || [],
        total: totalFinances,
        page,
        limit,
      },
      'Finances fetched successfully',
      200,
    );
  });
}

// UPDATE single Finance by ID
export async function updateFinance(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      const updatedFinance = await PaymentFinance.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!updatedFinance) return formatResponse(null, 'Finance not found', 404);
      return formatResponse(updatedFinance, 'Finance updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}

// BULK UPDATE Finances
export async function bulkUpdateFinances(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json();
    const results = await Promise.allSettled(
      updates.map(({ id, updateData }) =>
        PaymentFinance.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        }),
      ),
    );

    const successfulUpdates = results.filter((r): r is PromiseFulfilledResult<unknown> => r.status === 'fulfilled' && r.value).map(r => r.value);

    const failedUpdates = results
      .map((r, i) => (r.status === 'rejected' || !('value' in r && r.value) ? updates[i].id : null))
      .filter((id): id is string => id !== null);

    return formatResponse({ updated: successfulUpdates, failed: failedUpdates }, 'Bulk update completed', 200);
  });
}

// DELETE single Finance by ID
export async function deleteFinance(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    const deletedFinance = await PaymentFinance.findByIdAndDelete(id);
    if (!deletedFinance) return formatResponse(null, 'Finance not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Finance deleted successfully', 200);
  });
}

// BULK DELETE Finances
export async function bulkDeleteFinances(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { ids }: { ids: string[] } = await req.json();
    const deletedIds: string[] = [];
    const invalidIds: string[] = [];

    for (const id of ids) {
      try {
        const doc = await PaymentFinance.findById(id);
        if (doc) {
          const deletedDoc = await PaymentFinance.findByIdAndDelete(id);
          if (deletedDoc) {
            deletedIds.push(id);
          }
        } else {
          invalidIds.push(id);
        }
      } catch {
        invalidIds.push(id);
      }
    }

    return formatResponse({ deleted: deletedIds.length, deletedIds, invalidIds }, 'Bulk delete operation completed', 200);
  });
}
