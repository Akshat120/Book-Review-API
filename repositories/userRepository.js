import knex from 'knex';
import knexConfig from '../knexfile.js';

const db = knex(knexConfig.development);

// Create a user with hashed password
export async function createUser({ name, username, hashedPassword }) {
  await db('users').insert({
    name,
    username,
    password: hashedPassword,
  });
}

// Find a user by username
export async function findUserByUsername(username) {
    return db('users').where({ username: username }).first();
}