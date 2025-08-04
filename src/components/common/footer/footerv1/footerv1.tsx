/*
|-----------------------------------------
| setting up FooterV1 for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: tecmart-template, May, 2025
|-----------------------------------------
*/

import Image from 'next/image';
import Link from 'next/link';
import { BiLogoFacebookCircle, BiLogoLinkedin } from 'react-icons/bi';
import { BsTwitter } from 'react-icons/bs';

const FooterV1 = () => {
  const categoriesData = [
    { id: 1, title: 'Vegetables & Fruits', link: '/#' },
    { id: 2, title: 'Breakfast & instant food', link: '/#' },
    { id: 3, title: 'Bakery & Biscuits', link: '/#' },
    { id: 4, title: 'Atta, rice & dal', link: '/#' },
    { id: 5, title: 'Sauces & spreads', link: '/#' },
    { id: 6, title: 'Organic & gourmet', link: '/#' },
    { id: 7, title: 'Baby care', link: '/#' },
    { id: 8, title: 'Cleaning essentials', link: '/#' },
    { id: 9, title: 'Personal care', link: '/#' },
  ];
  const categoriesData2 = [
    { id: 1, title: 'Dairy, bread & eggs', link: '/#' },
    { id: 2, title: 'Cold drinks & juices', link: '/#' },
    { id: 3, title: 'Tea, coffee & drinks', link: '/#' },
    { id: 4, title: 'Masala, oil & more', link: '/#' },
    { id: 5, title: 'Chicken, meat & fish', link: '/#' },
    { id: 6, title: 'Paan corner', link: '/#' },
    { id: 7, title: 'Pharma & wellness', link: '/#' },
    { id: 8, title: 'Home & office', link: '/#' },
    { id: 9, title: 'Pet care', link: '/#' },
  ];
  const getToKnowsUs = [
    { id: 1, title: 'Company', link: '/#' },
    { id: 2, title: 'About', link: '/#' },
    { id: 3, title: 'Blog', link: '/#' },
    { id: 4, title: 'Help Center', link: '/#' },
    { id: 5, title: 'Our Value', link: '/#' },
  ];
  const forConsumers = [
    { id: 1, title: 'Payments', link: '/#' },
    { id: 2, title: 'Shipping', link: '/#' },
    { id: 3, title: 'Product Returns', link: '/#' },
    { id: 4, title: 'FAQ', link: '/#' },
    { id: 5, title: 'Shop Checkout', link: '/#' },
  ];
  const becomeAShopper = [
    { id: 1, title: 'Shopper Opportunities', link: '/#' },
    { id: 2, title: 'Become a Shopper', link: '/#' },
    { id: 3, title: 'Earnings', link: '/#' },
    { id: 4, title: 'Ideas & Guides', link: '/#' },
    { id: 5, title: 'New Retailers', link: '/#' },
  ];
  const freshCartPrograms = [
    { id: 1, title: 'Freshcart programs', link: '/#' },
    { id: 2, title: 'Gift Cards', link: '/#' },
    { id: 3, title: 'Promos & Coupons', link: '/#' },
    { id: 4, title: 'Freshcart Ads', link: '/#' },
    { id: 5, title: 'Careers', link: '/#' },
  ];
  const linkStye = 'hover-underline-animation hover:text-green-400 cursor-pointer';
  const mobileLayoutTitleStyle = 'text-xl font-semibold text-slate-800 border-b border-slate-200 mt-4';
  const TabletLayout = () => (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center">
      <div className="flex w-full flex-col">
        <div className="grid w-full grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          <div className="py-4">
            <div className="grid w-full grid-cols-2">
              <div className="flex w-full flex-col gap-2 text-slate-600">
                <h2 className="mb-3 text-[18px] font-semibold text-slate-800">Categories</h2>
                {categoriesData.map(curr => (
                  <Link href={curr.link} key={curr.id} className="cursor-auto">
                    <span className={linkStye}>{curr.title}</span>
                  </Link>
                ))}
              </div>
              <div className="flex w-full flex-col gap-2 text-slate-600">
                <h2 className="invisible mb-3 text-[18px] ">Hidden</h2>
                {categoriesData2.map(curr => (
                  <Link href={curr.link} key={curr.id} className="cursor-auto">
                    <span className={linkStye}>{curr.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="py-4">
            <div className="grid w-full grid-cols-2">
              <div className="flex w-full flex-col gap-2  text-slate-600">
                <h2 className="mb-3 text-[18px] font-semibold text-slate-800">Get to knows us</h2>
                {getToKnowsUs.map(curr => (
                  <Link href={curr.link} key={curr.id} className="cursor-auto">
                    <span className={linkStye}>{curr.title}</span>
                  </Link>
                ))}
              </div>
              <div className="flex w-full flex-col gap-2  text-slate-600">
                <h2 className="mb-3 text-[18px] font-semibold text-slate-800">For Consumers</h2>
                {forConsumers.map(curr => (
                  <Link href={curr.link} key={curr.id} className="cursor-auto">
                    <span className={linkStye}>{curr.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="py-4">
            <div className="grid w-full lg:grid-cols-2">
              <div className="flex w-full flex-col gap-2  text-slate-600">
                <h2 className="mb-3 text-[18px] font-semibold text-slate-800">Become a Shopper</h2>
                {becomeAShopper.map(curr => (
                  <Link href={curr.link} key={curr.id} className="cursor-auto">
                    <span className={linkStye}>{curr.title}</span>
                  </Link>
                ))}
              </div>
              <div className="flex w-full flex-col gap-2  text-slate-600">
                <h2 className="mb-3 text-[18px] font-semibold text-slate-800">Fresh cart Programs</h2>
                {freshCartPrograms.map(curr => (
                  <Link href={curr.link} key={curr.id} className="cursor-auto">
                    <span className={linkStye}>{curr.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const MobileLayout = () => (
    <div className="flex w-full flex-col gap-4 pb-8">
      <div className="flex w-full flex-col gap-1 text-slate-600">
        <h2 className={mobileLayoutTitleStyle}>Categories</h2>
        {categoriesData.map(curr => (
          <Link href={curr.link} key={curr.id} className="cursor-auto">
            <span className={linkStye}>{curr.title}</span>
          </Link>
        ))}
      </div>
      <div className="flex w-full flex-col gap-1 text-slate-600">
        {categoriesData2.map(curr => (
          <Link href={curr.link} key={curr.id} className="cursor-auto">
            <span className={linkStye}>{curr.title}</span>
          </Link>
        ))}
      </div>
      <div className="flex w-full flex-col gap-1 text-slate-600">
        <h2 className={mobileLayoutTitleStyle}>Get to knows us</h2>
        {getToKnowsUs.map(curr => (
          <Link href={curr.link} key={curr.id} className="cursor-auto">
            <span className={linkStye}>{curr.title}</span>
          </Link>
        ))}
      </div>
      <div className="flex w-full flex-col gap-1 text-slate-600">
        <h2 className={mobileLayoutTitleStyle}>For Consumers</h2>
        {forConsumers.map(curr => (
          <Link href={curr.link} key={curr.id} className="cursor-auto">
            <span className={linkStye}>{curr.title}</span>
          </Link>
        ))}
      </div>
      <div className="flex w-full flex-col gap-1 text-slate-600">
        <h2 className={mobileLayoutTitleStyle}>Become a Shopper</h2>
        {becomeAShopper.map(curr => (
          <Link href={curr.link} key={curr.id} className="cursor-auto">
            <span className={linkStye}>{curr.title}</span>
          </Link>
        ))}
      </div>
      <div className="flex w-full flex-col gap-1 text-slate-600">
        <h2 className={mobileLayoutTitleStyle}>Fresh Cart Programs</h2>
        {freshCartPrograms.map(curr => (
          <Link href={curr.link} key={curr.id} className="cursor-auto">
            <span className={linkStye}>{curr.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
  return (
    <section className="border-t bg-slate-100 px-2 pb-2 pt-12">
      <div className="md:block hidden">
        <TabletLayout />
      </div>
      <div className="block md:hidden">
        <MobileLayout />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex w-full flex-col items-start justify-between gap-4 border-t py-4 md:flex-row md:items-center">
          <div className="flex h-auto items-center justify-start gap-4">
            <h2 className="text-sm font-semibold text-slate-600">Payment Partners</h2>

            <Image src="https://i.ibb.co/YWYchGk/amazonpay.png" width={200} height={75} alt="Amazon Pay" className="h-auto w-[35px]" />
            <Image src="https://i.ibb.co/Fhjmzxy/american-express.png" width={150} height={94} alt="American Express" className="h-auto w-[35px]" />
            <Image src="https://i.ibb.co/jVQX8RN/mastercard.png" width={150} height={94} alt="Mastercard" className="h-auto w-[35px]" />
          </div>
          <div className="flex h-auto items-center justify-end gap-4">
            <h2 className="text-sm font-semibold text-slate-600">Get deliveries with FreshCart</h2>

            <Image src="https://i.ibb.co/K0wmb8Z/appstore-btn.png" width={250} height={84} alt="Download on the App Store" className="h-auto w-[100px]" />

            <Image src="https://i.ibb.co/k1svBvr/googleplay-btn.png" width={294} height={87} alt="Get it on Google Play" className="h-auto w-[100px]" />
          </div>
        </div>

        <div className="flex w-full flex-col items-start justify-between gap-4 border-t py-4 text-xs md:flex-row md:items-center">
          <p className=" text-slate-500">
            &copy; 2022 - {new Date().getFullYear()} FreshCart eCommerce HTML Template. All rights reserved. Powered by{' '}
            <span className="font-semibold text-green-500">Tec Mart</span>.
          </p>

          <div className="flex h-auto items-center justify-end gap-4">
            <h2 className="text-sm font-semibold text-slate-600">Follow us on</h2>
            <span className="cursor-pointer rounded-lg border p-2 hover:bg-slate-200">
              <BiLogoFacebookCircle />
            </span>
            <span className="cursor-pointer rounded-lg border p-2 hover:bg-slate-200">
              <BsTwitter />
            </span>
            <span className="cursor-pointer rounded-lg border p-2 hover:bg-slate-200">
              <BiLogoLinkedin />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterV1;
