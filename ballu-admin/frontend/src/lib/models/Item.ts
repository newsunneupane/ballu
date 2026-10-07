import mongoose, { Schema, Types } from 'mongoose';

export interface IItemVariant {
  label: string;
  weightGrams: number;
  manualPriceNpr?: number;
  isAvailable?: boolean;
}

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
  images: string[];
  isAvailable: boolean;
  showPrice: boolean;
  estimatedMakingDays?: { min?: number; max?: number };
  manualPriceNpr?: number;
  variants?: IItemVariant[];
  viewCount: number;
}

const VariantSchema = new Schema<IItemVariant>(
  {
    label: { type: String, required: true, trim: true, maxlength: 24 },
    weightGrams: { type: Number, required: true, min: 0 },
    manualPriceNpr: { type: Number },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);

const ItemSchema = new Schema<IItem>(
  {
    // Canonical shape: plural array. Never reintroduce a singular
    // `collection` field — strict mode silently drops it on write/read.
    collections: { type: [{ type: Schema.Types.ObjectId, ref: 'Collection' }], required: true, validate: [(v: unknown[]) => Array.isArray(v) && v.length > 0, 'At least one collection is required'] },
    material: { type: Schema.Types.ObjectId, ref: 'Material', required: true },
    group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    occasion: { type: [{ type: Schema.Types.ObjectId, ref: 'Occasion' }] },
    name: { en: { type: String, required: true }, np: { type: String, required: true } },
    description: { type: String },
    tag: { type: String, enum: ['new-arrival', 'best-seller', 'limited-edition', 'sale', 'bestseller', 'trending', 'light-weight'] },
    purity: { type: String },
    weightGrams: { type: Number, required: true },
    wastagePercent: { type: Number, default: 0 },
    makingCharges: { type: Number, default: 0 },
    accessoriesCharge: { type: Number, default: 0 },
    boutiqueDeduction: { type: Number, default: 0 },
    diamondValue: { type: Number, default: 0 },
    caratWeight: { type: Number },
    stonesDetails: { type: String },
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    showPrice: { type: Boolean, default: true },
    estimatedMakingDays: {
      type: { min: { type: Number }, max: { type: Number } },
      default: undefined,
    },
    manualPriceNpr: { type: Number },
    variants: { type: [VariantSchema], default: undefined },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== 'production' && mongoose.models.Item) {
  delete mongoose.models.Item;
}

export default mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
