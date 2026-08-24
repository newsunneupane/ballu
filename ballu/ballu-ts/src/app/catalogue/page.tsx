import { Suspense } from "react";
import CatalogueContent from "@/components/sections/CatalogueContent";
import InstagramFeed from "@/components/sections/InstagramFeed";

export const dynamic = 'force-dynamic';

export default function CataloguePage() {
  return (
    <>
      <InstagramFeed />
      <Suspense>
        <CatalogueContent />
      </Suspense>
    </>
  );
}