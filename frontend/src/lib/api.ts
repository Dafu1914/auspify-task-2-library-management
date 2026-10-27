import axios from 'axios';

const BOOK_API_URL = 'http://localhost:5000/api/books';

export interface Book {
  _id?: string;
  title: string;
  author: string;
  isbn: string;
  isIssued: boolean;
  issuedTo?: string;
  returnDate?: string;
}

export const getBooks = async (): Promise<Book[]> => {
  const res = await axios.get(BOOK_API_URL);
  return res.data.data;
};

export const createBook = async (book: Book): Promise<Book> => {
  const res = await axios.post(BOOK_API_URL, book);
  return res.data.data;
};

export const issueBook = async (id: string, issuedTo: string, returnDate: string): Promise<Book> => {
  const res = await axios.put(`${BOOK_API_URL}/${id}/issue`, { issuedTo, returnDate });
  return res.data.data;
};

export const returnBook = async (id: string): Promise<Book> => {
  const res = await axios.put(`${BOOK_API_URL}/${id}/return`);
  return res.data.data;
};

export const deleteBook = async (id: string): Promise<void> => {
  await axios.delete(`${BOOK_API_URL}/${id}`);
};