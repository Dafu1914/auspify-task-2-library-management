import { Request, Response } from 'express';
import Book from '../models/Book';

// Create a book
export const createBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all books
export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find();
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Issue a book
export const issueBook = async (req: Request, res: Response) => {
  try {
    const { issuedTo, returnDate } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { isIssued: true, issuedTo, returnDate },
      { new: true }
    );
    if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
    res.status(200).json({ success: true, data: book });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Return a book
export const returnBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { isIssued: false, issuedTo: '', returnDate: null },
      { new: true }
    );
    if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
    res.status(200).json({ success: true, data: book });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a book
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
    res.status(200).json({ success: true, message: 'Book deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};