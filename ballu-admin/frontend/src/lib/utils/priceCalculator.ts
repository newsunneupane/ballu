import DailyRate from '@/lib/models/DailyRate';

export async function calculateFinalPrice(params: {
  materialId: string;
  weightGrams: number;
  wastageGrams: number;
  makingCharges: number;
  boutiqueDeduction: number;
  diamondValue: number;
}): Promise<number> {
  const { materialId, weightGrams, wastageGrams, makingCharges, boutiqueDeduction, diamondValue } = params;

  const latestRate = await DailyRate.findOne({ material: materialId })
    .sort({ date: -1 })
    .lean();

  if (!latestRate) {
    throw new Error(`No daily rate found for material ${materialId}`);
  }

  const totalWeight = weightGrams + wastageGrams;
  const metalCost = totalWeight * latestRate.ratePerGramNrs;
  const finalPrice = metalCost + makingCharges - boutiqueDeduction + diamondValue;

  return Math.round(finalPrice);
}
