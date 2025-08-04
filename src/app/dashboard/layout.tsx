/*
|-----------------------------------------
| setting up Layout for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: tecmart-template, May, 2025
|-----------------------------------------
*/

import AuthCheckingComponent from './dashboard-utils/AuthChecking';
// import SiteNavLayoutClickV1 from './dashboard-utils/site-nav/site-nav-v1/SiteNavLayoutClickV1';
// import SiteNavLayoutClickV2 from './dashboard-utils/site-nav/site-nav-v2/SiteNavLayoutClickV2';
import SiteNavLayoutClickV3 from './dashboard-utils/site-nav/site-nav-v3/SiteNavLayoutClickV3';
// import SiteNavLayoutClickV4 from './dashboard-utils/site-nav/site-nav-v4/SiteNavLayoutClickV4';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthCheckingComponent redirectUrl="/dashboard">
      {/* <SiteNavLayoutClickV1> {children}</SiteNavLayoutClickV1> */}
      {/* <SiteNavLayoutClickV2> {children}</SiteNavLayoutClickV2> */}
      <SiteNavLayoutClickV3> {children}</SiteNavLayoutClickV3>
      {/* <SiteNavLayoutClickV4> {children}</SiteNavLayoutClickV4> */}
    </AuthCheckingComponent>
  );
}
