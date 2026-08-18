import mongoose, { Schema, Document } from 'mongoose';

export interface ICollection extends Document {
  name: { en: string; np: string };
  description?: string;
}

const CollectionSchema = new Schema<ICollection>(
  { name: { en: { type: String, required: true }, np: { type: String, required: true } }, description: { type: String } },
  { timestamps: true }
);

export default mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema);
