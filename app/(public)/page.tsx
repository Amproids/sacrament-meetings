import Image from 'next/image';
import Link from 'next/link';
import { WARD_NAME } from '@/lib/labels';

export default function Home() {
  return (
    <div className="mx-auto grid max-w-5xl items-center gap-12 px-6 py-16 md:grid-cols-2">
      <div>
        <p className="text-xs tracking-[0.3em] text-olive uppercase">{WARD_NAME}</p>
        <h1 className="mt-4 text-4xl leading-tight text-brown sm:text-5xl">
          Sacrament Meeting Planner
        </h1>
        <div className="mt-6 h-0.5 w-16 bg-olive" />
        <p className="mt-6 text-lg leading-relaxed">
          Plan and review each Sunday&rsquo;s agenda: announcements, hymns,
          prayers, ward business, speakers, and musical numbers. Members can
          view and print the program for this week or any past week.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/meetings/current"
            className="border border-olive bg-olive px-6 py-3 text-sm tracking-[0.15em] text-card uppercase transition-colors hover:bg-olive-dark"
          >
            This Sunday&rsquo;s program
          </Link>
          <Link
            href="/meetings"
            className="border border-brown px-6 py-3 text-sm tracking-[0.15em] text-brown uppercase transition-colors hover:bg-card"
          >
            All meetings
          </Link>
        </div>
      </div>

      {/* Offset olive frame behind the photo for a crisp, layered look. */}
      <div className="relative">
        <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 border border-olive" />
        <Image
          src="/chapel.png"
          alt="The meetinghouse: a red brick chapel with a white steeple under a cloudy sky"
          width={640}
          height={480}
          sizes="(min-width: 768px) 50vw, 100vw"
          preload
          className="relative h-auto w-full border border-brown/40"
        />
      </div>
    </div>
  );
}
