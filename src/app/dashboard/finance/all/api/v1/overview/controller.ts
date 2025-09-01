import { withDB } from '@/app/api/utils/db';
import PaymentFinance from '../model'; // Adjust the import path based on your file structure

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

// GET Finance Overview
export async function getFinanceOverview(): Promise<IResponse> {
  return withDB(async () => {
    // In a real app, you would use new Date() to get the actual current date.
    // We are hardcoding it here to match your sample data's context.
    const now = new Date('2025-09-01T00:00:00.000Z');

    // --- FIX IS HERE ---
    // Define the boundaries correctly
    const firstDayOfCurrentMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const firstDayOfNextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)); // This will be Oct 1st

    const firstDayOfLastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    const lastDayOfLastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0, 23, 59, 59, 999));

    const overviewPipeline = [
      {
        $facet: {
          // Pipeline for overall lifetime statistics
          overall: [
            {
              $group: {
                _id: null,
                totalPayment: { $sum: { $cond: [{ $eq: ['$paymentStatus', true] }, { $toDouble: '$totalPayment' }, 0] } },
                totalDue: { $sum: { $cond: [{ $eq: ['$paymentStatus', false] }, { $toDouble: '$coursePrice' }, 0] } },
                totalDiscount: { $sum: { $toDouble: '$discount' } },
                totalTransactions: { $sum: 1 },
              },
            },
          ],
          // Pipeline for last month's statistics
          lastMonth: [
            { $match: { createdAt: { $gte: firstDayOfLastMonth, $lte: lastDayOfLastMonth } } },
            {
              $group: {
                _id: null,
                totalPayment: { $sum: { $cond: [{ $eq: ['$paymentStatus', true] }, { $toDouble: '$totalPayment' }, 0] } },
                totalDue: { $sum: { $cond: [{ $eq: ['$paymentStatus', false] }, { $toDouble: '$coursePrice' }, 0] } },
                totalDiscount: { $sum: { $toDouble: '$discount' } },
                totalTransactions: { $sum: 1 },
              },
            },
          ],
          // Pipeline for current month's statistics
          currentMonth: [
            // Use `$lt` (less than) the first day of the NEXT month.
            // This correctly captures everything from Sep 1st 00:00:00 up to Sep 30th 23:59:59.999
            { $match: { createdAt: { $gte: firstDayOfCurrentMonth, $lt: firstDayOfNextMonth } } },
            {
              $group: {
                _id: null,
                totalPayment: { $sum: { $cond: [{ $eq: ['$paymentStatus', true] }, { $toDouble: '$totalPayment' }, 0] } },
                totalDue: { $sum: { $cond: [{ $eq: ['$paymentStatus', false] }, { $toDouble: '$coursePrice' }, 0] } },
                totalDiscount: { $sum: { $toDouble: '$discount' } },
                totalTransactions: { $sum: 1 },
              },
            },
          ],
        },
      },
      {
        // Project the results into a cleaner structure
        $project: {
          totalPayment: { $ifNull: [{ $arrayElemAt: ['$overall.totalPayment', 0] }, 0] },
          totalDue: { $ifNull: [{ $arrayElemAt: ['$overall.totalDue', 0] }, 0] },
          totalDiscount: { $ifNull: [{ $arrayElemAt: ['$overall.totalDiscount', 0] }, 0] },
          totalTransactions: { $ifNull: [{ $arrayElemAt: ['$overall.totalTransactions', 0] }, 0] },

          lastMonthPayment: { $ifNull: [{ $arrayElemAt: ['$lastMonth.totalPayment', 0] }, 0] },
          lastMonthDue: { $ifNull: [{ $arrayElemAt: ['$lastMonth.totalDue', 0] }, 0] },
          lastMonthDiscount: { $ifNull: [{ $arrayElemAt: ['$lastMonth.totalDiscount', 0] }, 0] },
          lastMonthTransactions: { $ifNull: [{ $arrayElemAt: ['$lastMonth.totalTransactions', 0] }, 0] },

          currentMonthPayment: { $ifNull: [{ $arrayElemAt: ['$currentMonth.totalPayment', 0] }, 0] },
          currentMonthDue: { $ifNull: [{ $arrayElemAt: ['$currentMonth.totalDue', 0] }, 0] },
          currentMonthDiscount: { $ifNull: [{ $arrayElemAt: ['$currentMonth.totalDiscount', 0] }, 0] },
          currentMonthTransactions: { $ifNull: [{ $arrayElemAt: ['$currentMonth.totalTransactions', 0] }, 0] },
        },
      },
    ];

    const result = await PaymentFinance.aggregate(overviewPipeline);
    const stats = result[0] || {}; // Aggregation returns an array

    return formatResponse(stats, 'Finance overview fetched successfully', 200);
  });
}
