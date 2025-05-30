import knex from 'knex';
import knexConfig from '../knexfile.js';

const db = knex(knexConfig.development);

// Create a review
export async function createReview({ userID, bookID, ratingNum, description }) {
  await db('reviews').insert({
    book_id: bookID,
    user_id: userID,
    rating: ratingNum,
    description: description,
  });
}

// Filter reviews by pagination
export async function filterReviews(page = 1, book_id, limit=10) {

  const offset = (page - 1) * limit;
  return db('reviews')
        .select('*')
        .where('book_id',book_id)
        .limit(limit)
        .offset(offset)
}


export async function updateReview({ reviewID, ratingNum, description }) {

  const updateData = {};
  if (ratingNum) updateData.rating = ratingNum;
  if (description) updateData.description = description;

  return await db('reviews')
  .where({ id: reviewID })
  .update(updateData);
}

export function getUserIdOfReview(reviewID) {
  return db("reviews").select("user_id").where({ id: reviewID }).first()
}

export async function deleteReview(reviewID) {
  return db("reviews").where({id:reviewID}).del()
}

export async function getReviewByUserIDAndBookID({userID, bookID}) {
  return db("reviews").where({user_id: userID, book_id: bookID}).first()
}