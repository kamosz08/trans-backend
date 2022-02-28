import * as mongoose from 'mongoose';

export interface Vehicle extends mongoose.Document {
  _id: string;
  class: string;
  registration: string;
}

const VehicleSchema = new mongoose.Schema<Vehicle>({
  registration: { type: String, required: true, index: { unique: true } },
  class: { type: String, required: true },
});

export { VehicleSchema };
