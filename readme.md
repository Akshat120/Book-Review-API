# BookReviewAPI

A RESTful API for managing book reviews, built with Node.js, Express.js, Knex.js, and SQLite. Users can create, read, update, and delete reviews for books, with authentication and data validation.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the API](#running-the-api)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [ER Diagram](#er-diagram)
- [Postman Examples](postman-examples)
- [Assumption](#assumptions)

## Project Overview
BookReviewAPI allows users to manage book reviews through a secure, RESTful interface. It supports creating and retrieving books, posting reviews with ratings, and updating or deleting reviews, with foreign key constraints ensuring data integrity. The API uses JWT-based authentication to protect sensitive operations.

## Features
- User authentication (signup, login) with JWT tokens.
- CRUD operations for books and reviews.
- Unique reviews per user per book via database constraints.
- Foreign key validation for books and users.
- Pagination and filtering for book retrieval.
- Error handling for invalid requests.

## Technologies
- **Node.js**: JavaScript runtime (v16+).
- **Express.js**: Web framework for routing.
- **Knex.js**: SQL query builder for database operations.
- **SQLite**: Lightweight relational database.
- **JWT**: JSON Web Tokens for authentication.
- **NPM**: Package manager.

## Prerequisites
Before setting up the project, ensure you have:
- **Node.js**: Version 16 or higher.
- **NPM**: Version 8 or higher.
- **Git**: For cloning the repository.
- **SQLite**: Included with Node.js, no separate installation required.

## Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Akshat120/BookReviewAPI.git
   cd BookReviewAPI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env` file in the project root.
   - Add the following (adjust values as needed):
     ```env
      JWT_SECRET=your-very-secure-secret-key-12345
      JWT_EXPIRES_IN=1h
      DATABASE_PATH=./books.db
      BCRYPT_ROUNDS=10
      PORT=3000
     ```

## Database Setup
The API uses SQLite with Knex.js migrations to manage the database schema.

1. **Initialize the database**:
   - Ensure the SQLite database file (e.g., `books.db`) is created in the specified path (default: project root).

2. **Run migrations**:
   Create the `books`, `users`, and `reviews` tables:
   ```bash
   npx knex migrate:latest
   ```

3. **Enable foreign key constraints**:
   - Foreign keys are enabled via `PRAGMA foreign_keys = ON` in the Knex configuration (`knexfile.js` or equivalent):
     ```javascript
     pool: {
       afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb),
     }
     ```

## Running the API
1. **Start the server**:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3000` (or the port specified in `.env`).

2. **Access the API**:
   Use tools like `curl`, Postman, or a browser to interact with endpoints.

## API Endpoints
All API endpoints are prefixed with `/api`. Authentication is required for write operations.

| Method | Endpoint                              | Description                              | Request Body Example                              |
|--------|---------------------------------------|------------------------------------------|--------------------------------------------------|
| GET    | `/`                                   | API homepage                             | N/A                                              |
| POST   | `/login`                              | Authenticate user, return JWT            | `{ "username": "user1", "password": "pass123" }` |
| POST   | `/signup`                             | Register a new user                      | `{ "name": "user1", "username": "user1", "password": "pass123" }` |
| POST   | `/api/books`                          | Create a book                            | `{ "title": "Book1", "author": "Author1" }`      |
| GET    | `/api/books`                          | Get all books (supports pagination)      | N/A                                              |
| GET    | `/api/books/:bookId`                  | Get a specific book (supports reviews pagination)| N/A                                      |
| POST   | `/api/books/:bookId/reviews`          | Create a review                          | `{ "rating": 5, "description": "Great book!" }`  |
| PUT    | `/api/reviews/:reviewId`              | Update a review (partial)                | `{ "rating": 4, "description": "Updated review" }` |
| DELETE | `/api/reviews/:reviewId`              | Delete a review                          | N/A                                              |

### Status Codes
- **200 OK**: Successful request with response body (e.g., GET, PUT).
- **201 Created**: Resource created (e.g., POST).
- **400 Bad Request**: Invalid or missing input.
- **401 Unauthorized**: Missing or invalid authentication token.
- **404 Not Found**: Resource not found.
- **500 Internal Server Error**: Server-side error.

## Authentication
- **JWT Tokens**: Required for protected routes (`POST /api/books`, `/api/books/:bookId/reviews`, etc.).
- **Obtaining a Token**:
  - Use `POST /login` with valid credentials to receive a token.
  - The token is automatically stored in an HTTP cookie named `jwt` (or your configured cookie name) by the server.
- **User Validation**: Review operations (PUT, DELETE) verify the authenticated user’s ID matches the review’s `user_id`.

## ER Diagram
- https://github.com/Akshat120/Book-Review-API/blob/main/ER_Diagram.png

## Postman Examples 

- GET http://localhost:3000/ <img width="1076" alt="Screenshot 2025-05-31 at 1 17 25 AM" src="https://github.com/user-attachments/assets/12dd60df-cc1b-4d5a-8bc7-5da6148cba39" />

- POST http://localhost:3000/signup <img width="1058" alt="Screenshot 2025-05-31 at 1 18 14 AM" src="https://github.com/user-attachments/assets/472dbbc3-5278-4449-bc53-af3aa274897c" />

- POST http://localhost:3000/login <img width="1076" alt="Screenshot 2025-05-31 at 1 19 07 AM" src="https://github.com/user-attachments/assets/0c3ffb16-28f6-4590-95c1-9497502ad04c" />

- POST http://localhost:3000/api/books <img width="1085" alt="Screenshot 2025-05-31 at 1 25 20 AM" src="https://github.com/user-attachments/assets/946bb031-4e19-4227-817e-eae3a4caf8ba" />

- GET http://localhost:3000/api/books <img width="1075" alt="Screenshot 2025-05-31 at 1 19 33 AM" src="https://github.com/user-attachments/assets/37ba8656-1366-4088-8a87-575f2da289c4" />

- GET http://localhost:3000/api/books <img width="1079" alt="Screenshot 2025-05-31 at 1 28 34 AM" src="https://github.com/user-attachments/assets/712205b7-df7b-4589-8bef-122945bf45b7" />

## Assumption 
- All pagination query supports upto 10 items in a single page.




