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

export default mongoose.models.Material || mongoose.model<IMaterial>('Material', MaterialSchema);
