import Material from '@/lib/models/Material';

export async function calculateFinalPrice(params: {
  materialId: string;
  groupId?: string;
  weightGrams: number;
  wastagePercent: number;
  makingCharges: number;
  accessoriesCharge: number;
  boutiqueDeduction: number;
  diamondValue: number;
}): Promise<number> {
  const { materialId, weightGrams, wastagePercent, makingCharges, accessoriesCharge, boutiqueDeduction, diamondValue } = params;

  const material = await Material.findById(materialId).lean();
  if (!material) {
    throw new Error(`No material found for id ${materialId}`);
  }

  const ratePerGram = Number(material.rateNpr) || 0;
  if (ratePerGram <= 0) {
    throw new Error(`No rate set for material ${(material as { name: { en: string } }).name?.en || materialId}`);
  }

  const goldValue = weightGrams * ratePerGram;
  const wastage = goldValue * (wastagePercent / 100);
  const finalPrice = goldValue + wastage + makingCharges + accessoriesCharge - boutiqueDeduction + diamondValue;

  return Math.round(finalPrice);
}