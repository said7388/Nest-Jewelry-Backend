import * as mongoose from 'mongoose';

export const orderSchema = new mongoose.Schema({
  productID: { type: 'string', required: true },
  email: { type: 'string', required: true },
  title: { type: 'string', required: true },
  vendor: { type: 'string' },
  price: { type: 'number', required: true },
  image: { type: 'string', required: true },
  rating: { type: 'number' },
  status: { type: 'string', default: 'pending' },
});

export interface OrderModel extends mongoose.Document {
  productID: string;
  email: string;
  title: string;
  vendor: string;
  price: number;
  image: string;
  rating: number;
  status: string;
}
