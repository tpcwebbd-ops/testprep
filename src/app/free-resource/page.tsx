/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep, April, 2026
|-----------------------------------------
*/

import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Facebook, PlayCircle, Users, ArrowRight, CheckCircle2, ListVideo, Flame } from 'lucide-react';

const resources = [
  {
    title: 'YouTube Channel',
    description: 'Watch free lessons, study tips, exam strategies, playlists, and helpful video content for IELTS and English learning.',
    href: 'https://www.youtube.com/@TestPrepCenter',
    icon: PlayCircle,
    cta: 'Visit YouTube',
    badge: 'Free Video Lessons',
  },
  {
    title: 'Facebook Page',
    description: 'Follow the official TestPrep Center Facebook page for updates, notices, free tips, and learning content.',
    href: 'https://web.facebook.com/TestPrepCenter.BD/',
    icon: Facebook,
    cta: 'Visit Facebook Page',
    badge: 'Official Updates',
  },
  {
    title: 'Facebook Private Group',
    description: 'Join the private community to connect with learners, get support, share progress, and stay motivated.',
    href: 'https://web.facebook.com/groups/ielts.sharif.russel',
    icon: Users,
    cta: 'Join Private Group',
    badge: 'Student Community',
  },
];

const playlists = [
  { title: 'Cue Card 2026 ( Recent + Popular)', totalVideos: 36 },
  { title: 'Vocabulary 2025', totalVideos: 13 },
  { title: 'Master IELTS Speaking', totalVideos: 2 },
  { title: 'IELTS Writing', totalVideos: 27 },
  { title: 'IELTS Test Advice', totalVideos: 7 },
  { title: 'IELTS Listening', totalVideos: 6 },
  { title: 'Spoken English', totalVideos: 15 },
  { title: 'IELTS Reading', totalVideos: 11 },
  { title: 'Seminar', totalVideos: 2 },
  { title: 'IELTS Speaking', totalVideos: 152 },
];

const featuredVideos = [
  {
    title: 'শত শত প্রশ্নের উত্তর দিতে ১টি টেমপ্লেট | IELTS Speaking',
    href: 'https://www.youtube.com/watch?v=iiFi8-2q6mw',
    thumbnail: 'https://i.ytimg.com/vi/iiFi8-2q6mw/hqdefault.jpg',
    views: '4.2K views',
    published: 'Sep 13, 2024',
  },
  {
    title: 'যে ভুলগুলি না বুঝলে IELTS Writing-এ স্কোর বাড়বে না! (Part-2)',
    href: 'https://www.youtube.com/watch?v=lgfxDo6ic50',
    thumbnail: 'https://i.ytimg.com/vi/lgfxDo6ic50/hqdefault.jpg',
    views: '2.6K views',
    published: 'Nov 7, 2024',
  },
  {
    title: 'Writing Task Two: Idea Generation করতে Topic Vocabulary শিখুন!',
    href: 'https://www.youtube.com/watch?v=hXvm_mcC-o8',
    thumbnail: 'https://i.ytimg.com/vi/hXvm_mcC-o8/hqdefault.jpg',
    views: '2.6K views',
    published: 'Nov 26, 2024',
  },
  {
    title: 'Reading এ ভালো করতে 1000 Vocabularies | Part - 4',
    href: 'https://www.youtube.com/watch?v=DOxjN_sDQww',
    thumbnail: 'https://i.ytimg.com/vi/DOxjN_sDQww/hqdefault.jpg',
    views: '2.1K views',
    published: 'Featured from channel',
  },
  {
    title: 'IELTS Speaking | Recent Cue Card (Dec 24)',
    href: 'https://www.youtube.com/watch?v=u37NiOiFag8',
    thumbnail: 'https://i.ytimg.com/vi/u37NiOiFag8/hqdefault.jpg',
    views: '1.4K views',
    published: '2024',
  },
  {
    title: 'IELTS প্রস্তুতির জন্য যথেষ্ট ২টি রিসোর্স!',
    href: 'https://www.youtube.com/watch?v=Zmf684aW8sM',
    thumbnail: 'https://i.ytimg.com/vi/Zmf684aW8sM/hqdefault.jpg',
    views: '826 views',
    published: 'Aug 13, 2024',
  },
];

const highlights = [
  'Free IELTS and English learning materials',
  'Useful video lessons and study guidance',
  'YouTube playlists for structured self-study',
  'Community support and regular updates',
  'Mobile-friendly access anytime, anywhere',
];

export default function FreeResourcePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_left,rgba(14,165,233,0.10),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm backdrop-blur">
                <BookOpen className="h-4 w-4" />
                Free Resources by TestPrep Center
              </div>

              <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Learn smarter with our
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">free study resources</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Explore our free learning platforms to improve your IELTS and English skills. Access helpful videos, official updates, and an active learner
                community from one place.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="https://www.youtube.com/@TestPrepCenter"
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>

                <Link
                  href="https://web.facebook.com/groups/ielts.sharif.russel"
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
                >
                  Join Community
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map(item => (
                <div
                  key={item}
                  className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-md backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">All your free resources in one page</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Choose the platform that fits your learning style. Watch, follow, and connect with TestPrep Center.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {resources.map(resource => {
            const Icon = resource.icon;

            return (
              <div
                key={resource.title}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 transition group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{resource.badge}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900">{resource.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{resource.description}</p>

                <Link
                  href={resource.href}
                  target="_blank"
                  className="mt-6 inline-flex items-center text-sm font-semibold text-blue-600 transition hover:text-blue-800"
                >
                  {resource.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
              <ListVideo className="h-4 w-4" />
              YouTube Playlists
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore all featured playlists</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Start with a complete playlist and learn topic by topic from the official TestPrep Center YouTube channel.
            </p>
          </div>

          <Link
            href="https://www.youtube.com/@TestPrepCenter/playlists"
            target="_blank"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-red-300 hover:text-red-600"
          >
            View All on YouTube
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playlists.map(playlist => (
            <div key={playlist.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <ListVideo className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{playlist.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{playlist.totalVideos} videos</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600">
            <Flame className="h-4 w-4" />
            Trending Videos
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Popular videos from the channel</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Watch some of the most engaging videos from TestPrep Center and start learning right away.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredVideos.map(video => (
            <Link
              key={video.href}
              href={video.href}
              target="_blank"
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <Image src={video.thumbnail} alt={video.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
              </div>

              <div className="p-5">
                <h3 className="line-clamp-2 text-lg font-bold text-slate-900">{video.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1">{video.views}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{video.published}</span>
                </div>
                <div className="mt-5 inline-flex items-center text-sm font-semibold text-red-600 transition group-hover:text-red-700">
                  Watch on YouTube
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white shadow-2xl lg:grid-cols-[1.3fr_0.7fr] lg:p-12">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">Stay connected with TestPrep Center</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50 sm:text-base">
                We regularly share useful content to help students prepare better. Follow our platforms and never miss free resources, study tips, and community
                support.
              </p>
            </div>

            <div className="flex flex-col gap-3 self-center">
              <Link
                href="https://web.facebook.com/TestPrepCenter.BD/"
                target="_blank"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:-translate-y-0.5"
              >
                Follow Facebook Page
              </Link>
              <Link
                href="https://www.youtube.com/@TestPrepCenter"
                target="_blank"
                className="inline-flex items-center justify-center rounded-2xl border border-white/50 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                Subscribe on YouTube
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
