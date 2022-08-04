import * as mongoose from 'mongoose';

export const authSchema = new mongoose.Schema({
  firstName: { type: 'string', required: true },
  lastName: { type: 'string' },
  email: { type: 'string', required: true },
  password: { type: 'string', required: true },
  salt: { type: 'string', required: true },
});

export interface AuthModel extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  salt: string;
}
