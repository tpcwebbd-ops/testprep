import Image from 'next/image';
import { defaultData, Section1Props } from './data';

const ClientSection1 = ({ data }: Section1Props) => {
  const sectionData = data || defaultData;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl">
      <div className="grid lg:grid-cols-2 gap-6 p-6">
        <div className="relative h-64 lg:h-full rounded-xl overflow-hidden shadow-lg">
          <Image src={sectionData.image} alt={sectionData.title} fill className="object-cover" priority />
          <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
            <span className="text-white text-xs font-semibold">{sectionData.heading}</span>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">{sectionData.featuredLabel}</h3>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
              {sectionData.title}
            </h1>
            <div className="h-0.5 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
          </div>

          <p className="text-gray-300 text-sm leading-relaxed">{sectionData.description}</p>

          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold">
              {sectionData.buttonPrimary}
            </button>
            <button className="px-6 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-sm font-semibold">{sectionData.buttonSecondary}</button>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-white/10">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-slate-900 flex items-center justify-center text-white text-xs font-semibold"
                >
                  {i}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{sectionData.studentCount}</p>
              <p className="text-gray-400 text-xs">{sectionData.enrollmentText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSection1;
