import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IItem extends Document {
  category: Types.ObjectId;
  material: Types.ObjectId;
  group: Types.ObjectId;
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
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    material: { type: Schema.Types.ObjectId, ref: 'Material', required: true },
    group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
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

export default mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
