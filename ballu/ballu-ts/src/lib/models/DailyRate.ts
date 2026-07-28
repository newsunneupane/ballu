import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDailyRate extends Document {
  material: Types.ObjectId;
  ratePerGramNrs: number;
  ratePerGramInr: number;
  date?: Date;
}

const DailyRateSchema = new Schema<IDailyRate>(
  {
    material: { type: Schema.Types.ObjectId, ref: 'Material', required: true },
    ratePerGramNrs: { type: Number, required: true },
    ratePerGramInr: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

DailyRateSchema.index({ material: 1, date: -1 });

export default mongoose.models.DailyRate || mongoose.model<IDailyRate>('DailyRate', DailyRateSchema);
