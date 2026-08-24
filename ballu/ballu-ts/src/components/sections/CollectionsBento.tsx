import Link from 'next/link';
import { Cormorant_Garamond } from 'next/font/google';
import { cloudinaryUrl } from '@/lib/cloudinary';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-serif-editorial',
});

type CollectionTile = {
  id: string;
  slug: string;
  image?: string;
  englishTitle: string;
  nepaliTitle?: string;
  pieces?: string;
};

const CARD_BASE =
  'group relative overflow-hidden rounded-xl border border-bj-border bg-bj-bg-elevated block';

export default function CollectionsBento({
  collections,
}: {
  collections: CollectionTile[];
}) {
  if (!collections.length) {
    return (
      <p className="text-[12px] tracking-wide text-bj-text-muted">
        No collections yet.
      </p>
    );
  }

  return (
    <div
      className={`${cormorant.variable} grid grid-cols-2 md:grid-cols-3 auto-rows-[180px] md:auto-rows-[200px] gap-1.5`}
    >
      {collections.map((c, i) => {
        const href = `/catalogue?collection=${encodeURIComponent(
          c.englishTitle.trim().toUpperCase()
        )}`;
        const span = i === 0 ? 'md:col-span-2 md:row-span-2' : i === 3 ? 'md:col-span-2' : '';
        return (
          <Link key={c.slug} href={href} className={`${CARD_BASE} ${span}`}>
            {c.image ? (
              <img
                src={cloudinaryUrl(c.image, { width: 800 })}
                alt={c.englishTitle}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#423722] to-[#1a140f]" />
            )}
            <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 md:p-5">
              <h3 className="font-serif-editorial text-base text-white leading-tight">
                {c.englishTitle}
              </h3>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
