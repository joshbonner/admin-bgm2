import mongoose, { Schema, Document } from "mongoose";

export interface ISocialAPISchema extends Document {
  name: string;
  value: string;
  // parameters: Array<{
  //   name: string,
  //   value: string
  // }>
}

const SocialAPISchema: Schema = new Schema({
  name: {
    type: String,
    require: true,
  },
  value: {
    type: String,
    rqeuire: true,
  },
  // parameters: [{
  //   name: {
  //     type: String,
  //     required: true
  //   },
  //   value: {
  //     type: String,
  //     required: true
  //   }
  // }]
});

const SnapSetModel = mongoose.model<ISocialAPISchema>(
  "socials",
  SocialAPISchema,
);
export default SnapSetModel;
