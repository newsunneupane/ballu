import { unstable_cache } from 'next/cache';
import { connectDB } from '@/lib/db';
import Item from '@/lib/models/Item';
import Collection from '@/lib/models/Collection';
import Material from '@/lib/models/Material';
import Group from '@/lib/models/Group';
import StoreSettings from '@/lib/models/StoreSettings';
import { calculateFinalPrice } from '@/lib/utils/priceCalculator';

export const CATALOG_REVALIDATE_SECONDS = 300;

export const CATALOG_TAG = 'catalog';
export const STORE_SETTINGS_TAG = 'store-settings';

const revalidate = CATALOG_REVALIDATE_SECONDS;

function stripItemCount(name?: { en?: string; np?: string }): { en: string; np: string } | undefined {
  if (!name) return name;
  const clean = (s?: string) => (s || '').replace(/\s+(?:\(\d+\)|\d+)$/, '');
  return { en: clean(name.en), np: clean(name.np) };
}

function normalizeCollections(item: Record<string, unknown>): void {
  const cols = item.collections as { length?: number } | undefined;
  if (!cols || (cols.length ?? 0) === 0) {
    const legacy = item.collection;
    item.collections = legacy ? [legacy] : [];
  }
}

export const getItemsData = unstable_cache(
  async () => {
    await connectDB();
    const items = await Item.find()
      .populate('collections', 'name')
      .populate('material', 'name')
      .populate('group', 'name')
      .sort({ createdAt: -1 })
      .lean();

    items.forEach((item) => normalizeCollections(item as unknown as Record<string, unknown>));

    const itemsWithPricing = await Promise.all(
      items.map(async (item) => {
        const clean = { ...item, name: stripItemCount((item as { name?: { en?: string; np?: string } }).name) };
        if (!clean.material) return { ...clean, pricing: null };
        try {
          const pricing = await calculateFinalPrice({
            materialId: (clean.material as { _id: string })._id.toString(),
            groupId: clean.group ? (clean.group as { _id: string })._id.toString() : undefined,
            weightGrams: clean.weightGrams,
            wastagePercent: clean.wastagePercent,
            makingCharges: clean.makingCharges,
            accessoriesCharge: clean.accessoriesCharge,
            boutiqueDeduction: clean.boutiqueDeduction,
            diamondValue: clean.diamondValue,
          });
          return { ...clean, pricing };
        } catch {
          return { ...clean, pricing: null };
        }
      })
    );

    return itemsWithPricing;
  },
  ['catalog-items'],
  { revalidate, tags: [CATALOG_TAG, 'catalog-items'] }
);

export const getItemByIdData = unstable_cache(
  async (id: string) => {
    await connectDB();
    const item = await Item.findById(id)
      .populate('collections', 'name')
      .populate('material', 'name')
      .populate('group', 'name')
      .lean();
    if (!item) return null;
    normalizeCollections(item as unknown as Record<string, unknown>);
    const clean = { ...item, name: stripItemCount((item as { name?: { en?: string; np?: string } }).name) };

    try {
      const pricing = await calculateFinalPrice({
        materialId: (clean.material as { _id: string })._id.toString(),
        groupId: clean.group ? (clean.group as { _id: string })._id.toString() : undefined,
        weightGrams: clean.weightGrams,
        wastagePercent: clean.wastagePercent,
        makingCharges: clean.makingCharges,
        accessoriesCharge: clean.accessoriesCharge,
        boutiqueDeduction: clean.boutiqueDeduction,
        diamondValue: clean.diamondValue,
      });
      return { ...clean, pricing };
    } catch {
      return { ...clean, pricing: null };
    }
  },
  ['catalog-item-by-id'],
  { revalidate, tags: [CATALOG_TAG, 'catalog-items'] }
);

export const getCollectionsData = unstable_cache(
  async () => {
    await connectDB();
    return Collection.find().sort({ createdAt: -1 }).lean();
  },
  ['catalog-collections'],
  { revalidate, tags: [CATALOG_TAG, 'catalog-collections'] }
);

export const getMaterialsData = unstable_cache(
  async () => {
    await connectDB();
    return Material.find().sort({ createdAt: -1 }).lean();
  },
  ['catalog-materials'],
  { revalidate, tags: [CATALOG_TAG, 'catalog-materials'] }
);

export const getGroupsData = unstable_cache(
  async () => {
    await connectDB();
    return Group.find().populate('material', 'name').sort({ createdAt: -1 }).lean();
  },
  ['catalog-groups'],
  { revalidate, tags: [CATALOG_TAG, 'catalog-groups'] }
);

export const getStoreSettingsData = unstable_cache(
  async () => {
    await connectDB();
    const settings = await StoreSettings.findOne()
      .populate('pieceOfTheWeek.material', 'name')
      .populate('pieceOfTheWeek.collection', 'name')
      .populate('pieceOfTheWeek.item', 'name images purity weightGrams material group wastagePercent makingCharges accessoriesCharge boutiqueDeduction diamondValue caratWeight isAvailable showPrice estimatedMakingDays')
      .lean();

    if (!settings) {
      return {
        contactEmail: '',
        phoneNumbers: [],
        timings: [
          { dayFrom: 'Mon', dayTo: 'Sat', timeFrom: '10', timeTo: '19' },
          { dayFrom: 'Sun', dayTo: 'Sun', timeFrom: '11', timeTo: '17' },
        ],
      };
    }

    if (settings.pieceOfTheWeek?.item) {
      const item = settings.pieceOfTheWeek.item as any;
      item.name = stripItemCount(item.name as { en?: string; np?: string } | undefined);
      try {
        const pricing = await calculateFinalPrice({
          materialId: item.material?.toString() || '',
          groupId: item.group?.toString(),
          weightGrams: item.weightGrams,
          wastagePercent: item.wastagePercent || 0,
          makingCharges: item.makingCharges || 0,
          accessoriesCharge: item.accessoriesCharge || 0,
          boutiqueDeduction: item.boutiqueDeduction || 0,
          diamondValue: item.diamondValue || 0,
        });
        item.pricing = pricing;
      } catch {
        item.pricing = null;
      }
    }

    if (Array.isArray(settings.heroBanners) && settings.heroBanners.length > 0) {
      settings.heroBanners = await resolveHeroBanners(settings.heroBanners as any[]);
    }

    return settings;
  },
  ['catalog-store-settings'],
  { revalidate, tags: [STORE_SETTINGS_TAG, 'catalog-store-settings'] }
);

async function resolveHeroBanners(banners: any[]) {
  const resolved = await Promise.all(
    banners.map(async (banner) => {
      const result: any = { ...banner };
      if (!banner.refId) return result;
      try {
        if (banner.type === 'collection') {
          const entity = await Collection.findById(banner.refId).select('name').lean();
          if (entity) {
            result.name = (entity.name as any)?.en;
            result.nameNp = (entity.name as any)?.np;
          }
        } else if (banner.type === 'material') {
          const entity = await Material.findById(banner.refId).select('name').lean();
          if (entity) {
            result.name = (entity.name as any)?.en;
            result.nameNp = (entity.name as any)?.np;
          }
        } else if (banner.type === 'group') {
          const entity = await Group.findById(banner.refId).populate('material', 'name').lean();
          if (entity) {
            result.name = (entity as any).name;
            result.material = (entity as any).material;
          }
        } else if (banner.type === 'item') {
          const entity = await Item.findById(banner.refId).select('name').lean();
          if (entity) {
            const cleanName = stripItemCount((entity.name as any) as { en?: string; np?: string } | undefined);
            result.name = cleanName?.en;
            result.nameNp = cleanName?.np;
          }
        }
      } catch {
        /* skip unresolvable banners */
      }
      return result.name ? result : null;
    })
  );
  return resolved.filter(Boolean);
}

export const getRatesData = unstable_cache(
  async () => {
    await connectDB();
    const materials = await Material.find({ rateNpr: { $gt: 0 } }).sort({ createdAt: 1 }).lean();
    const INR_PER_NPR_DIVISOR = 1.6;
    return materials.map((mat) => {
      const matName = (mat.name as any)?.en || mat._id.toString();
      const ratePerGramNrs = Number(mat.rateNpr) || 0;
      return {
        name: matName,
        ratePerGramNrs,
        ratePerGramInr: Math.round((ratePerGramNrs / INR_PER_NPR_DIVISOR) * 100) / 100,
      };
    });
  },
  ['catalog-rates'],
  { revalidate, tags: [CATALOG_TAG, 'catalog-rates'] }
);

export async function loadCatalogData() {
  const [items, collections, materials, groups, storeSettings, rates] = await Promise.all([
    getItemsData(),
    getCollectionsData(),
    getMaterialsData(),
    getGroupsData(),
    getStoreSettingsData(),
    getRatesData(),
  ]);
  return { items, collections, materials, groups, storeSettings, rates };
}
