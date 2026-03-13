import React from 'react';
import connectDB from '@/app/api/utils/mongoose';
import Footer from '@/app/api/footer-settings/v1/model'; // Adjust path to your Mongoose Model

import { unstable_cache } from 'next/cache';
import FooterClient from './FooterClient';

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

// Helper to fetch footer data efficiently
const getActiveFooter = unstable_cache(
  async () => {
    await connectDB();
    // Find the one marked as enabled
    const footer = await Footer.findOne({ isEnabled: true }).lean();

    if (!footer) return null;

    // Convert ObjectId and dates to string for serialization
    return JSON.parse(JSON.stringify(footer));
  },
  ['active-footer'],
  { tags: ['footer-settings'] },
);

const FooterServer = async () => {
  const activeFooter = await getActiveFooter();

  return <FooterClient initialFooter={activeFooter} />;
};

export default FooterServer;
