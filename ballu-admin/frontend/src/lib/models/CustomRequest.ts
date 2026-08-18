import mongoose, { Schema, Types } from 'mongoose';

export interface ICustomRequest {
  collection: Types.ObjectId;
  username: string;
  phoneNumber: string;
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
    collection: { type: Schema.Types.ObjectId, ref: 'Collection', required: true },
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
