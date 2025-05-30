import knex from 'knex';
import knexConfig from '../knexfile.js';

const db = knex(knexConfig.development);

// Create a book
export async function createBook({ title, author, genre, userID }) {
  await db('books').insert({
    title,
    author,
    genre,
    created_by: userID,
  });
}

// Filter book by page, author and genre
export async function filterBook(page = 1, author = null, genre=null, limit=10) {

  const offset = (page - 1) * limit;

  let query = db('books').select('*');


  if (author || genre) {
    query = query.where((builder) => {
      if (author) builder.where('author', author);
      if (genre) builder.where('genre', genre);
    });
  }


  query = query.limit(limit).offset(offset);


  const books = await query;
  return books;

}

export async function getBookByID(id) {
  return db('books').where({ id: id }).first();
}