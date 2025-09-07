import AuthCheckingComponent from '../dashboard/dashboard-utils/AuthChecking';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthCheckingComponent redirectUrl="/dashboard">{children}</AuthCheckingComponent>;
}
