import { withDB } from '@/app/api/utils/db';
import User_access from '../model'; // Adjust the import path to your User model
import { IResponse } from '@/app/api/utils/jwt-verify';

// Helper to format responses consistently
const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
  data,
  message,
  status,
});

export async function getUserByEmail(req: Request): Promise<IResponse> {
  // Use a database connection wrapper for robust error handling
  return withDB(async () => {
    // Extract the email from the request URL's search parameters
    const email = new URL(req.url).searchParams.get('email');

    // Validate that the email parameter is present
    if (!email) {
      return formatResponse(null, 'Email is required', 400);
    }

    // Find the user in the database by their email
    const user = await User_access.findOne({ email });

    // If no user is found, return a 404 error
    if (!user) {
      return formatResponse(null, 'User not found', 404);
    }

    // If the user is found, return the user data with a success message
    return formatResponse(user, 'User fetched successfully', 200);
  });
}
