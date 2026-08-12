import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { productService } from '@/services/product-service';
import CatalogueContent from '@/components/sections/CatalogueContent';
import { connectDB } from '@/lib/db';
import Category from '@/lib/models/Category';

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  let resolved = productService.getCategoryBySlug(category);

  if (!resolved) {
    await connectDB();
    const cat = await Category.findOne({
      'name.en': { $regex: new RegExp(`^${category.replace(/-/g, ' ').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
    }).lean();
    if (cat) {
      resolved = {
        category: cat.name.en.toUpperCase(),
        config: {
          slug: category,
          title: cat.name.en,
          subtitle: cat.name.np,
          breadcrumb: `Catalogue · ${cat.name.en}`,
        },
      };
    }
  }

  if (!resolved) {
    notFound();
  }

  return (
    <Suspense>
      <CatalogueContent
        defaultCategory={resolved.category}
        title={resolved.config.title}
        subtitle={resolved.config.subtitle}
        breadcrumb={resolved.config.breadcrumb}
        hideCategories
      />
    </Suspense>
  );
}
