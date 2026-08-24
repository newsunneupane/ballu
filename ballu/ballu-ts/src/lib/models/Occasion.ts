import mongoose, { Schema, Document } from 'mongoose';

export interface IOccasion extends Document {
  name: { en: string; np: string };
  description?: string;
  image?: string;
}

const OccasionSchema = new Schema<IOccasion>(
  { name: { en: { type: String, required: true }, np: { type: String, required: true } }, description: { type: String }, image: { type: String } },
  { timestamps: true }
);

export default mongoose.models.Occasion || mongoose.model<IOccasion>('Occasion', OccasionSchema);
