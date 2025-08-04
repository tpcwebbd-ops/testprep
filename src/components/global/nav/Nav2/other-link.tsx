/*
|-----------------------------------------
| setting up OtherLink for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, May, 2024
|-----------------------------------------
*/
import Link from 'next/link';
import navData from './nav-data';
import LogInDashboardButton from './LogInDashboardButton';

const { othersLink } = navData || {};

const OtherLink = () => {
  return (
    <>
      {othersLink.map(curr => (
        <Link key={curr.id} href={curr.url}>
          {curr.title}
        </Link>
      ))}

      <LogInDashboardButton />
    </>
  );
};
export default OtherLink;
