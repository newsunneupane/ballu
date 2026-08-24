import mongoose, { Schema, Types } from 'mongoose';

export interface IItem {
  collections: Types.ObjectId[];
  material: Types.ObjectId;
  group: Types.ObjectId;
  occasion?: Types.ObjectId[];
  name: { en: string; np: string };
  description?: string;
  tag?: string;
  purity?: string;
  weightGrams: number;
  wastagePercent: number;
  makingCharges: number;
  accessoriesCharge: number;
  boutiqueDeduction: number;
  diamondValue: number;
  caratWeight?: number;
  stonesDetails?: string;
  karigarName?: string;
  images: string[];
  isAvailable: boolean;
  showPrice: boolean;
  estimatedMakingDays?: { min?: number; max?: number };
  manualPriceNpr?: number;
  viewCount: number;
}

const ItemSchema = new Schema<IItem>(
  {
    collections: { type: [{ type: Schema.Types.ObjectId, ref: 'Collection' }], required: true, validate: [(v: unknown[]) => Array.isArray(v) && v.length > 0, 'At least one collection is required'] },
    material: { type: Schema.Types.ObjectId, ref: 'Material', required: true },
    group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    occasion: { type: [{ type: Schema.Types.ObjectId, ref: 'Occasion' }] },
    name: { en: { type: String, required: true }, np: { type: String, required: true } },
    description: { type: String },
    tag: { type: String, enum: ['new-arrival', 'best-seller', 'limited-edition', 'sale', 'bestseller', 'trending'] },
    purity: { type: String },
    weightGrams: { type: Number, required: true },
    wastagePercent: { type: Number, default: 0 },
    makingCharges: { type: Number, default: 0 },
    accessoriesCharge: { type: Number, default: 0 },
    boutiqueDeduction: { type: Number, default: 0 },
    diamondValue: { type: Number, default: 0 },
    caratWeight: { type: Number },
    stonesDetails: { type: String },
    karigarName: { type: String },
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    showPrice: { type: Boolean, default: true },
    estimatedMakingDays: {
      type: { min: { type: Number }, max: { type: Number } },
      default: undefined,
    },
    manualPriceNpr: { type: Number },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== 'production' && mongoose.models.Item) {
  delete mongoose.models.Item;
}

export default mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
