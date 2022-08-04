import * as mongoose from 'mongoose';

export const projectSchema = new mongoose.Schema({
  title: { type: 'string', required: true },
  image: { type: 'string', required: true },
  location: { type: 'string', required: true },
});

export interface Project extends mongoose.Document {
  id: string;
  title: string;
  image: string;
  location: string;
}
