import { Suspense } from "react";
import CatalogueContent from "@/components/sections/CatalogueContent";

export default function BridalPage() {
  return (
    <Suspense>
      <CatalogueContent
        defaultCategory="BRIDAL"
        title="Bridal Heritage."
        subtitle="बेहुलीको शृङ्गार"
        breadcrumb="Home · Bridal"
        hideCategories
      />
    </Suspense>
  );
}