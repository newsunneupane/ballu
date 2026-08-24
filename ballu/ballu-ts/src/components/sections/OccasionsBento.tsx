import Link from 'next/link';
import { Cormorant_Garamond } from 'next/font/google';
import { cloudinaryUrl } from '@/lib/cloudinary';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-serif-editorial',
});

type OccasionTile = {
  _id: string;
  name: { en: string; np?: string };
  image?: string;
};

const CARD_BASE =
  'group relative overflow-hidden rounded-xl border border-bj-border bg-bj-bg-elevated block';

export default function OccasionsBento({
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
      className={`${cormorant.variable} grid grid-cols-2 md:grid-cols-4 auto-rows-[170px] md:auto-rows-[200px] gap-1.5`}
    >
      {occasions.map((o, i) => {
        const href = `/catalogue?occasion=${encodeURIComponent(
          (o.name.en || '').trim().toUpperCase()
        )}`;
        const span =
          i === 0
            ? 'md:col-span-2 md:row-span-2'
            : i === 1 || i === 4 || i === 5
              ? 'md:col-span-2'
              : '';
        return (
          <Link key={o._id} href={href} className={`${CARD_BASE} ${span}`}>
            {o.image ? (
              <img
                src={cloudinaryUrl(o.image, { width: 800 })}
                alt={o.name.en}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#423722] to-[#1a140f]" />
            )}
            <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 md:p-5">
              <h3 className="font-serif-editorial text-base md:text-lg font-light text-white leading-tight">
                {o.name.en}
              </h3>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
