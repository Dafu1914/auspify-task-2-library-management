'use client';

import { useEffect, useState } from 'react';
import {
  getBooks,
  createBook,
  issueBook,
  returnBook,
  deleteBook,
  Book,
} from '@/lib/api';

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState<Book>({
    title: '',
    author: '',
    isbn: '',
    isIssued: false,
  });
  const [issueForm, setIssueForm] = useState({ id: '', issuedTo: '', returnDate: '' });
  const [search, setSearch] = useState('');

  const loadBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBook({ ...form, isIssued: false });
      setForm({ title: '', author: '', isbn: '', isIssued: false });
      loadBooks();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error adding book');
    }
  };

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await issueBook(issueForm.id, issueForm.issuedTo, issueForm.returnDate);
      setIssueForm({ id: '', issuedTo: '', returnDate: '' });
      loadBooks();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error issuing book');
    }
  };

  const handleReturn = async (id: string) => {
    await returnBook(id);
    loadBooks();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this book?')) {
      await deleteBook(id);
      loadBooks();
    }
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.includes(search)
  );

  return (
    <main className="min-h-screen bg-slate-900 p-8 font-sans text-slate-200">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-8">
          📚 Library Management System
        </h1>

        {/* ADD BOOK FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Book Title"
            required
            className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder="Author"
            required
            className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            name="isbn"
            value={form.isbn}
            onChange={handleChange}
            placeholder="ISBN"
            required
            className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition"
          >
            Add Book
          </button>
        </form>

        {/* ISSUE BOOK FORM */}
        <form
          onSubmit={handleIssue}
          className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <select
            value={issueForm.id}
            onChange={(e) => setIssueForm({ ...issueForm, id: e.target.value })}
            required
            className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Select Book to Issue</option>
            {books.filter((b) => !b.isIssued).map((b) => (
              <option key={b._id} value={b._id}>{b.title}</option>
            ))}
          </select>
          <input
            value={issueForm.issuedTo}
            onChange={(e) => setIssueForm({ ...issueForm, issuedTo: e.target.value })}
            placeholder="Issue to (Student Name)"
            required
            className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="date"
            value={issueForm.returnDate}
            onChange={(e) => setIssueForm({ ...issueForm, returnDate: e.target.value })}
            required
            className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-lg transition"
          >
            Issue Book
          </button>
        </form>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="🔍 Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg mb-6 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {/* TABLE */}
        <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-300">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Author</th>
                <th className="p-4">ISBN</th>
                <th className="p-4">Status</th>
                <th className="p-4">Issued To</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No books found.
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book._id} className="border-b border-slate-700/50 hover:bg-slate-700/50 transition">
                    <td className="p-4 text-white font-medium">{book.title}</td>
                    <td className="p-4 text-slate-300">{book.author}</td>
                    <td className="p-4 text-slate-300">{book.isbn}</td>
                    <td className="p-4">
                      {book.isIssued ? (
                        <span className="bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full text-xs font-semibold">
                          Issued
                        </span>
                      ) : (
                        <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
                          Available
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-300">{book.issuedTo || '-'}</td>
                    <td className="p-4 flex gap-2 flex-wrap">
                      {book.isIssued ? (
                        <button
                          onClick={() => handleReturn(book._id!)}
                          className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-emerald-500/20"
                        >
                          Return
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500">-</span>
                      )}
                      <button
                        onClick={() => handleDelete(book._id!)}
                        className="bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-rose-500/20"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}