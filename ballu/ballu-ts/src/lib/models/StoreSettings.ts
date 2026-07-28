import mongoose, { Schema, Document } from 'mongoose';

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
  },
  { timestamps: true }
);

export default mongoose.models.StoreSettings || mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);
