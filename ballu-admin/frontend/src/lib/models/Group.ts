import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  material: Types.ObjectId;
}

const GroupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true },
    material: { type: Schema.Types.ObjectId, ref: 'Material', required: true },
  },
  { timestamps: true }
);

GroupSchema.index({ material: 1, name: 1 }, { unique: true });

export default mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema);