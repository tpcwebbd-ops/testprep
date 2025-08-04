import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { updateUser } from './updateUsers';

const handler = NextAuth({
  // Configure authentication providers
  providers: [
    GoogleProvider({
      // Google OAuth credentials from environment variables
      clientId: process.env.GOOGLE_CLIENT_ID!, // Google Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // Google Client Secret
    }),
  ],
  // Custom authentication pages
  pages: {
    signIn: '/login', // Redirect to custom login page
  },
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session }) {
      try {
        updateUser(session as { user: { email: string; name: string; image: string } });
      } catch (e: unknown) {
        console.log(e);
      }
      return session;
    },
    async signIn() {
      return true;
    },
  },
});

// Export handler for API routes
export { handler as GET, handler as POST }; // Handle both GET and POST requests
