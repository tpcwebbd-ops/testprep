// app/page.tsx
import EmailVerificationForm from '@/components/EmailVerificationForm';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600/30 to-purple-600/20 backdrop-blur-2xl text-white">
      <EmailVerificationForm />
    </main>
  );
}
