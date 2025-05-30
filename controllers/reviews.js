import { createReview, getReviewByUserIDAndBookID, updateReview, getUserIdOfReview, deleteReview } from "../repositories/reviewRepository.js"

export async function createReviewController(req,res) {
    const userID = req.user.id
    const bookID = req.params.bookId
    const { rating, description } = req.body
    
    const ratingNum = parseInt(rating, 10)
    if(isNaN(ratingNum) && ratingNum>=1 && ratingNum<=5) {
        return res.status(200).json({ error: "Wrong rating!" })
    }

    try {
        const review = await getReviewByUserIDAndBookID({userID, bookID})
        if(review) {
            return res.status(400).json({ message: 'User already have review for this book.' });
        }

        await createReview({ userID, bookID, ratingNum, description });
        return res.status(201).json({ message: 'Review created successfully' });
    } catch (err) {
        console.error('createReview error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function updateReviewController(req,res) {
    const userID = req.user.id
    const reviewID = req.params.reviewId
    
    const { rating, description } = req.body
    const ratingNum = parseInt(rating, 10)
    if(isNaN(ratingNum) && ratingNum>=1 && ratingNum<=5) {
        return res.status(200).json({ error: "Wrong rating!" })
    }

    try {
        const rev = await getUserIdOfReview(reviewID)
        if(rev && rev.user_id != userID) {
            return res.status(401).json({ message: 'Unauthorized to update review' });
        }

        const review = await updateReview({ reviewID, ratingNum, description });
        if(review == 0) {
            return res.status(404).json({ message: 'No review found to get updated' });
        }
        return res.status(200).json({ message: 'Review updated successfully' });
      } catch (err) {
        console.error('createReview error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


export async function deleteReviewController(req,res) {
    const userID = req.user.id
    const reviewID = req.params.reviewId
    

    try {
        const rev = await getUserIdOfReview(reviewID)
        if(rev && rev.user_id != userID) {
            return res.status(401).json({ message: 'Unauthorized to delete review' });
        }

        const review = await deleteReview(reviewID);
        if(review == 0) {
            return res.status(404).json({ message: 'No review found to get deleted' });
        }
        return res.status(200).json({ message: 'Review deleted successfully' });
      } catch (err) {
        console.error('deleteReview error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}



