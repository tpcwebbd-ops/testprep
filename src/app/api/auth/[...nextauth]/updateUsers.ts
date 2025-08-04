import dbConnect from '@/app/api/utils/mongoose';
import GAuthUser from '@/app/dashboard/users/all/api/v1/Model';

export async function updateUser(session: { user: { email: string; name: string; image: string } }) {
  try {
    await dbConnect();
    console.log('-----db');
    console.log('session; ', session);
    try {
      const searchFilter = {
        $or: [{ email: { $regex: session.user.email, $options: 'i' } }],
      };
      const gAuthUsers = await GAuthUser.find(searchFilter); 
      if (gAuthUsers.length === 0) { 
        await GAuthUser.create({ ...session.user });
      }
    } catch (err) {
      console.log('err to create users ', err);
    }
  } catch (error: unknown) {
    console.log(error);
    if ((error as { code?: number }).code === 11000) {
      const err = error as { keyValue?: Record<string, unknown> };
      console.log('err', err);
    }
    throw error; // Re-throw other errors to be handled by `withDB`
  }
}
