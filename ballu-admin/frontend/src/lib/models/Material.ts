import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
  name: { en: string; np: string };
  rateNpr: number;
}

const MaterialSchema = new Schema<IMaterial>(
  {
    name: { en: { type: String, required: true }, np: { type: String, required: true } },
    rateNpr: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

MaterialSchema.index({ 'name.en': 1 }, { unique: true });
MaterialSchema.index({ 'name.np': 1 }, { unique: true });

export default mongoose.models.Material || mongoose.model<IMaterial>('Material', MaterialSchema);
