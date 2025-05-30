import { createBook, getBookByID, filterBook } from '../repositories/bookRepository.js';
import { filterReviews } from '../repositories/reviewRepository.js';

export async function createBookController(req,res) {
    const userID = req.user.id
    
    const { title, author, genre } = req.body

    const validation = validateCreateFields({title, author})
    if(!validation.isValid) {
        return res.status(200).json({ error: validation.error })
    }

    try {
        await createBook({ title, author, genre, userID });
        return res.status(201).json({ message: 'Book created successfully' });
      } catch (err) {
        console.error('createBook error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getBookController(req,res) {

    const {page, author, genre } = req.query

    const pageNum = parseInt(page, 10);
    if(isNaN(pageNum) || pageNum<1) {
        return res.status(400).json({ message: 'Bad Page Number!' });
    }

    const books = await filterBook(pageNum, author, genre)
    
    res.json(books);
}

export async function getBookByIdController(req,res) {

    const id  = req.params.bookId
    const idNum = parseInt(id, 10);
    if(isNaN(idNum)) {
        return res.status(400).json({ message: 'Wrong book ID!' });
    }

    const page = req.query.page
    const pageNum = parseInt(page, 10);
    if(isNaN(pageNum) || pageNum<1) {
        return res.status(400).json({ message: 'Bad Page Number!' });
    }

    const book = await getBookByID(idNum)
    const reviews = await filterReviews(pageNum, idNum)
    let totalRating = 0, avgRating = 0
    reviews.forEach((review) => {
        totalRating += review.rating;
    });

    if(reviews.length > 0) {
        avgRating = totalRating / reviews.length
    }

    res.json({
        book: book,
        avgRating: avgRating,
        reviews: reviews,
    });
}

function validateCreateFields({ title, author  }) {
    if (!title || !author) {
        return { isValid: false, error: 'All fields (title, author) are required.' };
    }
    
    return { isValid: true };
}

