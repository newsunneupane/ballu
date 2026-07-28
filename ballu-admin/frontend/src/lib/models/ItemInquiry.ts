import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IItemInquiry extends Document {
  item: Types.ObjectId;
  customerName: string;
  phoneNumber: string;
  message?: string;
  status: 'Pending' | 'Reviewed' | 'Contacted';
}

const ItemInquirySchema = new Schema<IItemInquiry>(
  {
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    message: { type: String },
    status: { type: String, enum: ['Pending', 'Reviewed', 'Contacted'], default: 'Pending' },
  },
  { timestamps: true }
);

export default mongoose.models.ItemInquiry || mongoose.model<IItemInquiry>('ItemInquiry', ItemInquirySchema);
