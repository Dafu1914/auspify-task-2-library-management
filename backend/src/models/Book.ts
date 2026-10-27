import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  isbn: string;
  isIssued: boolean;
  issuedTo?: string;
  returnDate?: Date;
}

const BookSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    isIssued: { type: Boolean, default: false },
    issuedTo: { type: String, default: '' },
    returnDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IBook>('Book', BookSchema);