import Material from '@/lib/models/Material';
import Group from '@/lib/models/Group';

export async function calculateFinalPrice(params: {
  materialId: string;
  groupId?: string;
  weightGrams: number;
  wastagePercent: number;
  makingCharges: number;
  accessoriesCharge: number;
  boutiqueDeduction: number;
  diamondValue: number;
}): Promise<{
  finalPrice: number;
  goldValue: number;
  wastage: number;
  wastagePercent: number;
  making: number;
  accessories: number;
  deduction: number;
  ratePerGramNrs: number;
}> {
  const { materialId, groupId, weightGrams, wastagePercent, makingCharges, accessoriesCharge, boutiqueDeduction, diamondValue } = params;

  const material = await Material.findById(materialId).lean();
  if (!material) {
    throw new Error(`No material found for id ${materialId}`);
  }

  let ratePerGramNrs = Number(material.rateNpr) || 0;
  if (groupId) {
    const group = await Group.findById(groupId).lean();
    if (group && Number((group as { rateNpr?: number }).rateNpr) > 0) {
      ratePerGramNrs = Number((group as { rateNpr?: number }).rateNpr);
    }
  }

  if (ratePerGramNrs <= 0) {
    throw new Error(`No rate set for material ${(material as { name: { en: string } }).name?.en || materialId}`);
  }

  const goldValue = weightGrams * ratePerGramNrs;
  const wastage = goldValue * (wastagePercent / 100);
  const finalPrice = goldValue + wastage + makingCharges + accessoriesCharge - boutiqueDeduction + diamondValue;

  return {
    finalPrice: Math.round(finalPrice),
    goldValue: Math.round(goldValue),
    wastage: Math.round(wastage),
    wastagePercent,
    making: makingCharges,
    accessories: accessoriesCharge,
    deduction: boutiqueDeduction,
    ratePerGramNrs,
  };
}