import Link from 'next/link';
import { Cormorant_Garamond } from 'next/font/google';
import { cloudinaryUrl } from '@/lib/cloudinary';
import type { OccasionTile } from '@/components/sections/OccasionsBento';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-serif-editorial',
});

export default function OccasionsGrid({
  occasions,
}: {
  occasions: OccasionTile[];
}) {
  if (!occasions.length) {
    return (
      <p className="text-[12px] tracking-wide text-bj-text-muted">
        No occasions yet.
      </p>
    );
  }

  return (
    <div
      className={`${cormorant.variable} grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4`}
    >
      {occasions.map((o) => {
        const href = `/catalogue?occasion=${encodeURIComponent(
          (o.name.en || '').trim().toUpperCase()
        )}`;
        return (
          <Link
            key={o._id}
            href={href}
            className="group relative block overflow-hidden rounded-xl border border-bj-border bg-bj-bg-elevated aspect-[4/5]"
          >
            {o.image ? (
              <img
                src={cloudinaryUrl(o.image, { width: 600 })}
                alt={o.name.en}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#423722] to-[#1a140f]" />
            )}
            <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-serif-editorial text-lg text-white leading-tight">
                {o.name.en}
              </h3>
              {o.name.np && o.name.np !== o.name.en && (
                <p className="text-[12px] text-white/70 mt-0.5">{o.name.np}</p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
