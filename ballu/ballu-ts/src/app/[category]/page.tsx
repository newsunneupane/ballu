import { notFound } from 'next/navigation';
import { productService } from '@/services/product-service';
import CatalogueContent from '@/components/sections/CatalogueContent';

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const resolved = productService.getCategoryBySlug(category);

  if (!resolved) {
    notFound();
  }

  return (
    <CatalogueContent
      defaultCategory={resolved.category}
      title={resolved.config.title}
      subtitle={resolved.config.subtitle}
      breadcrumb={resolved.config.breadcrumb}
      hideCategories
    />
  );
}
