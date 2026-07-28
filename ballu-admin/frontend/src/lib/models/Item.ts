import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IItem extends Document {
  category: Types.ObjectId;
  material: Types.ObjectId;
  name: { en: string; np: string };
  description?: string;
  tag?: string;
  purity?: string;
  weightGrams: number;
  wastageGrams: number;
  makingCharges: number;
  boutiqueDeduction: number;
  diamondValue: number;
  stonesDetails?: string;
  karigarName?: string;
  images: string[];
}

const ItemSchema = new Schema<IItem>(
  {
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    material: { type: Schema.Types.ObjectId, ref: 'Material', required: true },
    name: { en: { type: String, required: true }, np: { type: String, required: true } },
    description: { type: String },
    tag: { type: String, enum: ['new-arrival', 'best-seller', 'limited-edition', 'sale', 'bestseller', 'trending'] },
    purity: { type: String },
    weightGrams: { type: Number, required: true },
    wastageGrams: { type: Number, default: 0 },
    makingCharges: { type: Number, default: 0 },
    boutiqueDeduction: { type: Number, default: 0 },
    diamondValue: { type: Number, default: 0 },
    stonesDetails: { type: String },
    karigarName: { type: String },
    images: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
