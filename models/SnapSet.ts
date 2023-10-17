import mongoose, { Schema, Document } from "mongoose";

enum accountType {
  plug = "tiktok",
  snapchat = "snapchat",
}

enum idType {
  campaign = "campaign",
  adset = "adset",
}

export interface ISnapSet extends Document {
  accountType: accountType;
  idType: idType;
  name: string;
  token: string;
}

const SnapSetSchema: Schema = new Schema({
  accountType: {
    type: String,
    enum: ["tiktok", "snapchat"],
    require: true,
  },
  idType: {
    type: String,
    enum: ["campaign", "adset"],
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  token: {
    type: String,
    require: true,
  },
});

const SnapSetModel = mongoose.model<ISnapSet>("snapsets", SnapSetSchema);
export default SnapSetModel;
