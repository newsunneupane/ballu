import Material from '@/lib/models/Material';
import Group from '@/lib/models/Group';
import { withFallbackVariants } from '@/lib/utils/variants';

export interface PriceBreakdownInput {
  materialId: string;
  groupId?: string;
  weightGrams: number;
  wastagePercent: number;
  makingCharges: number;
  accessoriesCharge: number;
  boutiqueDeduction: number;
  diamondValue: number;
}

export async function calculateFinalPrice(params: PriceBreakdownInput): Promise<number> {
  const { materialId, groupId, weightGrams, wastagePercent, makingCharges, accessoriesCharge, boutiqueDeduction, diamondValue } = params;

  const material = await Material.findById(materialId).lean();
  if (!material) {
    throw new Error(`No material found for id ${materialId}`);
  }

  let ratePerGram = Number(material.rateNpr) || 0;
  if (groupId) {
    const group = await Group.findById(groupId).lean();
    if (group && Number((group as { rateNpr?: number }).rateNpr) > 0) {
      ratePerGram = Number((group as { rateNpr?: number }).rateNpr);
    }
  }

  if (ratePerGram <= 0) {
    throw new Error(`No rate set for material ${(material as { name: { en: string } }).name?.en || materialId}`);
  }

  const goldValue = weightGrams * ratePerGram;
  const wastage = goldValue * (wastagePercent / 100);
  const finalPrice = goldValue + wastage + makingCharges + accessoriesCharge - boutiqueDeduction + diamondValue;

  return Math.round(finalPrice);
}

/**
 * Price every variant with a single material/group rate lookup.
 * Manual per-variant overrides win; base manualPriceNpr wins for all.
 */
export async function calculateVariantPrices(params: PriceBreakdownInput & {
  variants?: unknown;
  manualPriceNpr?: number | null;
}): Promise<{ base: number; variants: { label: string; weightGrams: number; price: number }[] }> {
  const list = withFallbackVariants(params.weightGrams, params.variants);
  if (params.manualPriceNpr != null) {
    const base = Math.round(Number(params.manualPriceNpr));
    return { base, variants: list.map((v) => ({ label: v.label, weightGrams: v.weightGrams, price: base })) };
  }
  const material = await Material.findById(params.materialId).lean();
  if (!material) throw new Error(`No material found for id ${params.materialId}`);
  let ratePerGram = Number((material as { rateNpr?: number }).rateNpr) || 0;
  if (params.groupId) {
    const group = await Group.findById(params.groupId).lean();
    if (group && Number((group as { rateNpr?: number }).rateNpr) > 0) {
      ratePerGram = Number((group as { rateNpr?: number }).rateNpr);
    }
  }
  if (ratePerGram <= 0) {
    throw new Error(`No rate set for material ${(material as { name: { en: string } }).name?.en || params.materialId}`);
  }
  const variants = list.map((v) => {
    if (v.manualPriceNpr != null) return { label: v.label, weightGrams: v.weightGrams, price: Math.round(v.manualPriceNpr) };
    const goldValue = v.weightGrams * ratePerGram;
    const wastage = goldValue * (params.wastagePercent / 100);
    const total = goldValue + wastage + params.makingCharges + params.accessoriesCharge - params.boutiqueDeduction + params.diamondValue;
    return { label: v.label, weightGrams: v.weightGrams, price: Math.round(total) };
  });
  return { base: variants[0]?.price ?? 0, variants };
}