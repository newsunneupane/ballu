import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITimingSlot {
  dayFrom: string;
  dayTo: string;
  timeFrom: string;
  timeTo: string;
}

export type HeroBannerType = 'collection' | 'material' | 'group' | 'item';

export interface IHeroBanner {
  type: HeroBannerType;
  refId: Types.ObjectId;
  image: string;
  title?: string;
  subtitle?: string;
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
  heroBanners?: IHeroBanner[];
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

const HeroBannerSchema = new Schema<IHeroBanner>(
  {
    type: { type: String, enum: ['collection', 'material', 'group', 'item'], required: true },
    refId: { type: Schema.Types.ObjectId, required: true },
    image: { type: String, required: true },
    title: { type: String },
    subtitle: { type: String },
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
    heroBanners: { type: [HeroBannerSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.StoreSettings || mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);
