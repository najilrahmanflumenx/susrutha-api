import { Schema, model, Document } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  value: Record<string, any>;
  description?: string;
  isSystem: boolean;
}

const SettingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true, uppercase: true, trim: true },
    value: { type: Schema.Types.Mixed, required: true },
    description: { type: String },
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Setting = model<ISetting>('Setting', SettingSchema);
