import DailyRate from '@/lib/models/DailyRate';

export async function calculateFinalPrice(params: {
  materialId: string;
  weightGrams: number;
  wastagePercent: number;
  makingCharges: number;
  accessoriesCharge: number;
  boutiqueDeduction: number;
  diamondValue: number;
}): Promise<number> {
  const { materialId, weightGrams, wastagePercent, makingCharges, accessoriesCharge, boutiqueDeduction, diamondValue } = params;

  const latestRate = await DailyRate.findOne({ material: materialId })
    .sort({ date: -1 })
    .lean();

  if (!latestRate) {
    throw new Error(`No daily rate found for material ${materialId}`);
  }

  const goldValue = weightGrams * latestRate.ratePerGramNrs;
  const wastage = goldValue * (wastagePercent / 100);
  const finalPrice = goldValue + wastage + makingCharges + accessoriesCharge - boutiqueDeduction + diamondValue;

  return Math.round(finalPrice);
}
