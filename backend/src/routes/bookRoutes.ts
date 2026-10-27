import express from 'express';
import {
  createBook,
  getBooks,
  issueBook,
  returnBook,
  deleteBook,
} from '../controllers/bookController';

const router = express.Router();

router.route('/').get(getBooks).post(createBook);
router.route('/:id').delete(deleteBook);
router.route('/:id/issue').put(issueBook);
router.route('/:id/return').put(returnBook);

export default router;