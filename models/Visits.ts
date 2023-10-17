import mongoose, { Schema, Document } from "mongoose";

export interface IVisit extends Document {
  ipaddress: string;
}

const VisitSchema: Schema = new Schema({
  ipaddress: String,
  date: Date,
});

const VisitModel = mongoose.model<IVisit>("visits", VisitSchema);
export default VisitModel;
