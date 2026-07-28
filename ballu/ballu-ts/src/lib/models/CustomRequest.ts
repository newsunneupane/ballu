import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICustomRequest extends Document {
  username: string;
  phoneNumber: string;
  category: Types.ObjectId;
  material?: Types.ObjectId;
  pieceType?: string;
  budgetNrs: number;
  requirements?: string;
  description?: string;
  images: string[];
  status: 'Pending' | 'Reviewed' | 'Contacted';
}

const CustomRequestSchema = new Schema<ICustomRequest>(
  {
    username: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    material: { type: Schema.Types.ObjectId, ref: 'Material' },
    pieceType: { type: String },
    budgetNrs: { type: Number, required: true },
    requirements: { type: String },
    description: { type: String },
    images: [{ type: String }],
    status: { type: String, enum: ['Pending', 'Reviewed', 'Contacted'], default: 'Pending' },
  },
  { timestamps: true }
);

export default mongoose.models.CustomRequest || mongoose.model<ICustomRequest>('CustomRequest', CustomRequestSchema);
