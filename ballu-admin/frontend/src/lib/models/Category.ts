import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: { en: string; np: string };
  description?: string;
}

const CategorySchema = new Schema<ICategory>(
  { name: { en: { type: String, required: true }, np: { type: String, required: true } }, description: { type: String } },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
