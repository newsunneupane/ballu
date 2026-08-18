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

export const getItemsData = unstable_cache(
  async () => {
    await connectDB();
    const items = await Item.find()
      .populate('collection', 'name')
      .populate('material', 'name')
      .populate('group', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const itemsWithPricing = await Promise.all(
      items.map(async (item) => {
        if (!item.material) return { ...item, pricing: null };
        try {
          const pricing = await calculateFinalPrice({
            materialId: (item.material as { _id: string })._id.toString(),
            groupId: item.group ? (item.group as { _id: string })._id.toString() : undefined,
            weightGrams: item.weightGrams,
            wastagePercent: item.wastagePercent,
            makingCharges: item.makingCharges,
            accessoriesCharge: item.accessoriesCharge,
            boutiqueDeduction: item.boutiqueDeduction,
            diamondValue: item.diamondValue,
          });
          return { ...item, pricing };
        } catch {
          return { ...item, pricing: null };
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
      .populate('collection', 'name')
      .populate('material', 'name')
      .populate('group', 'name')
      .lean();
    if (!item) return null;

    try {
      const pricing = await calculateFinalPrice({
        materialId: (item.material as { _id: string })._id.toString(),
        groupId: item.group ? (item.group as { _id: string })._id.toString() : undefined,
        weightGrams: item.weightGrams,
        wastagePercent: item.wastagePercent,
        makingCharges: item.makingCharges,
        accessoriesCharge: item.accessoriesCharge,
        boutiqueDeduction: item.boutiqueDeduction,
        diamondValue: item.diamondValue,
      });
      return { ...item, pricing };
    } catch {
      return { ...item, pricing: null };
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
      .populate('pieceOfTheWeek.item', 'name images purity weightGrams material wastagePercent makingCharges accessoriesCharge boutiqueDeduction diamondValue caratWeight isAvailable showPrice estimatedMakingDays')
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
      try {
        const pricing = await calculateFinalPrice({
          materialId: item.material?.toString() || '',
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

    return settings;
  },
  ['catalog-store-settings'],
  { revalidate, tags: [STORE_SETTINGS_TAG, 'catalog-store-settings'] }
);

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
