import { Suspense } from "react";
import CatalogueContent from "@/components/sections/CatalogueContent";

export const dynamic = 'force-dynamic';

export default function CataloguePage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs tracking-[4px] uppercase text-bj-text-muted" role="status" aria-live="polite">Loading catalogue…</div>}>
        <CatalogueContent />
      </Suspense>
    </>
  );
}