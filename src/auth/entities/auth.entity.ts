import * as mongoose from 'mongoose';

// User data collection schema
export const authSchema = new mongoose.Schema({
  fullName: { type: 'string', required: true },
  email: { type: 'string', required: true },
  password: { type: 'string', required: true },
  salt: { type: 'string', required: true },
  role: { type: 'string', required: true, default: 'user' },
  active: { type: 'boolean', default: false },
});

export interface AuthModel extends mongoose.Document {
  fullName: string;
  email: string;
  password: string;
  salt: string;
  role: string;
  active: boolean;
}
