import { createModel } from './client';

export interface ISetting {
  key: string;
  value: string;
}

const Setting = createModel<ISetting>('Setting', {
  key: { type: String, required: true },
  value: { type: String, required: true },
});

export async function getSetting(key: string, value?: string) {
  let doc = await Setting.findOne({ key }).exec();

  if (doc === null && value == null) {
    throw Error(`Setting 不存在`);
  }
  doc = new Setting({ key, value });
  await doc.save();
  return doc.value;
}
