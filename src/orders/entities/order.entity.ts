import * as mongoose from 'mongoose';

export interface Order extends mongoose.Document {
  _id: string;
  price: number;
  name: string;
  driverId: string;
  vehicleId: string;
}

const OrderSchema = new mongoose.Schema<Order>({
  price: { type: String, required: true },
  name: { type: String, required: true },
  driverId: { type: String, required: true },
  vehicleId: { type: String, required: true },
});

export { OrderSchema };
