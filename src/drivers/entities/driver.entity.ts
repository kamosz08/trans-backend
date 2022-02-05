import * as mongoose from 'mongoose';

export interface Driver extends mongoose.Document {
  _id: string;
  firstName: string;
  lastName: string;
  pesel: number;
}

const DriverSchema = new mongoose.Schema<Driver>({
  pesel: { type: Number, required: true, index: { unique: true } },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

export { DriverSchema };
