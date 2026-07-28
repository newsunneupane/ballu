import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
  name: { en: string; np: string };
}

const MaterialSchema = new Schema<IMaterial>(
  { name: { en: { type: String, required: true }, np: { type: String, required: true } } },
  { timestamps: true }
);

export default mongoose.models.Material || mongoose.model<IMaterial>('Material', MaterialSchema);
