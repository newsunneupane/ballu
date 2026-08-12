import DailyRate from '@/lib/models/DailyRate';

const rateCache = new Map<string, Awaited<ReturnType<typeof DailyRate.findOne>>>();

export async function calculateFinalPrice(params: {
  materialId: string;
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
  const { materialId, weightGrams, wastagePercent, makingCharges, accessoriesCharge, boutiqueDeduction, diamondValue } = params;

  let latestRate = rateCache.get(materialId);
  if (!latestRate) {
    latestRate = await DailyRate.findOne({ material: materialId })
      .sort({ date: -1 })
      .lean();
    if (latestRate) rateCache.set(materialId, latestRate);
  }

  if (!latestRate) {
    throw new Error(`No daily rate found for material ${materialId}`);
  }

  const goldValue = weightGrams * latestRate.ratePerGramNrs;
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
    ratePerGramNrs: latestRate.ratePerGramNrs,
  };
}
