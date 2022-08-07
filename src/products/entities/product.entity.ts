import * as mongoose from 'mongoose';

export const productSchema = new mongoose.Schema({
  // _id: { type: mongoose.Schema.Types.ObjectId },
  title: { type: 'string', required: true },
  vendor: { type: 'string' },
  price: { type: 'number', required: true },
  image: { type: 'string', required: true },
  rating: { type: 'number' },
});

export interface ProductModel extends mongoose.Document {
  title: string;
  vendor: string;
  price: number;
  image: string;
  rating: number;
}
