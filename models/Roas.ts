import mongoose, { Schema, Document } from "mongoose";

export interface IRoas extends Document {
  roas: number;
  plugAccount: string;
  adAccount: string;
  date: string;
}

const RoasSchema: Schema = new Schema({
  roas: Number,
  plugAccount: String,
  adAccount: String,
  date: String,
});

const RoasModel = mongoose.model<IRoas>("roas", RoasSchema);
export default RoasModel;
