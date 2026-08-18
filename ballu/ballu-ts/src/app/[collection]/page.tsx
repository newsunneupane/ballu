import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { productService } from '@/services/product-service';
import CatalogueContent from '@/components/sections/CatalogueContent';
import { connectDB } from '@/lib/db';
import Collection from '@/lib/models/Collection';

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  let resolved = productService.getCollectionBySlug(collection);

  if (!resolved) {
    await connectDB();
    const cat = await Collection.findOne({
      'name.en': { $regex: new RegExp(`^${collection.replace(/-/g, ' ').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
    }).lean();
    if (cat) {
      resolved = {
        collection: cat.name.en.toUpperCase(),
        config: {
          slug: collection,
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
        defaultCollection={resolved.collection}
        title={resolved.config.title}
        subtitle={resolved.config.subtitle}
        breadcrumb={resolved.config.breadcrumb}
        hideCategories
      />
    </Suspense>
  );
}
