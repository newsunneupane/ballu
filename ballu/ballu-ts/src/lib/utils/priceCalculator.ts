import DailyRate from '@/lib/models/DailyRate';

export async function calculateFinalPrice(params: {
  materialId: string;
  weightGrams: number;
  wastageGrams: number;
  makingCharges: number;
  boutiqueDeduction: number;
  diamondValue: number;
}): Promise<{ finalPrice: number; goldValue: number; wastage: number; making: number; deduction: number }> {
  const { materialId, weightGrams, wastageGrams, makingCharges, boutiqueDeduction, diamondValue } = params;

  const latestRate = await DailyRate.findOne({ material: materialId })
    .sort({ date: -1 })
    .lean();

  if (!latestRate) {
    throw new Error(`No daily rate found for material ${materialId}`);
  }

  const totalWeight = weightGrams + wastageGrams;
  const goldValue = weightGrams * latestRate.ratePerGramNrs;
  const wastage = wastageGrams * latestRate.ratePerGramNrs;
  const metalCost = totalWeight * latestRate.ratePerGramNrs;
  const finalPrice = metalCost + makingCharges - boutiqueDeduction + diamondValue;

  return {
    finalPrice: Math.round(finalPrice),
    goldValue: Math.round(goldValue),
    wastage: Math.round(wastage),
    making: makingCharges,
    deduction: boutiqueDeduction,
  };
}
