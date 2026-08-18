import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITimingSlot {
  dayFrom: string;
  dayTo: string;
  timeFrom: string;
  timeTo: string;
}

export interface IStoreSettings extends Document {
  contactEmail: string;
  phoneNumbers: string[];
  timings: ITimingSlot[];
  tickerItems: string[];
  pieceOfTheWeek?: {
    material: Types.ObjectId;
    collection: Types.ObjectId;
    item: Types.ObjectId;
  };
}

const TimingSlotSchema = new Schema<ITimingSlot>(
  {
    dayFrom: { type: String, required: true },
    dayTo: { type: String, required: true },
    timeFrom: { type: String, required: true },
    timeTo: { type: String, required: true },
  },
  { _id: false }
);

const StoreSettingsSchema = new Schema<IStoreSettings>(
  {
    contactEmail: { type: String, default: '' },
    phoneNumbers: [{ type: String }],
    timings: { type: [TimingSlotSchema], default: [] },
    tickerItems: [{ type: String }],
    pieceOfTheWeek: {
      type: {
        material: { type: Schema.Types.ObjectId, ref: 'Material' },
        collection: { type: Schema.Types.ObjectId, ref: 'Collection' },
        item: { type: Schema.Types.ObjectId, ref: 'Item' },
      },
      default: undefined,
    },
  },
  { timestamps: true }
);

export default mongoose.models.StoreSettings || mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);
