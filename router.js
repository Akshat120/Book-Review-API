import { Router } from "express";
import { homePage, signup, login } from "./controllers/home.js";
import { authenticateToken } from './middleware/auth.js';
import { createBookController, getBookController, getBookByIdController } from "./controllers/books.js";
import { createReviewController, updateReviewController, deleteReviewController } from "./controllers/reviews.js";

const router = Router();

router.get("/", homePage);
router.post("/login", login);
router.post("/signup", signup);

router.post('/api/books', authenticateToken, createBookController)
router.get('/api/books', getBookController)
router.get('/api/books/:bookId', getBookByIdController)

router.post('/api/books/:bookId/reviews', authenticateToken, createReviewController)
router.put('/api/reviews/:reviewId', authenticateToken, updateReviewController)
router.delete('/api/reviews/:reviewId', authenticateToken, deleteReviewController)


export default router;
