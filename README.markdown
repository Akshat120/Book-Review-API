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
- [Example Usage](#example-usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Project Overview
BookReviewAPI allows users to manage book reviews through a secure, RESTful interface. It supports creating and retrieving books, posting reviews with ratings, and updating or deleting reviews, with foreign key constraints ensuring data integrity. The API uses JWT-based authentication to protect sensitive operations.

## Features
- User authentication (signup, login) with JWT tokens.
- CRUD operations for books and reviews.
- Nested review routes under books (e.g., `/api/books/:bookId/reviews`).
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
   git clone https://github.com/your-username/BookReviewAPI.git
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
     PORT=3000
     DATABASE_URL=./database.db
     JWT_SECRET=your-secret-key
     ```

## Database Setup
The API uses SQLite with Knex.js migrations to manage the database schema.

1. **Initialize the database**:
   - Ensure the SQLite database file (e.g., `database.db`) is created in the specified path (default: project root).

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

4. **(Optional) Seed the database**:
   Populate with sample data:
   ```bash
   npx knex seed:run
   ```

5. **Verify the schema**:
   Check the `reviews` table structure:
   ```bash
   sqlite3 database.db
   .schema reviews
   ```
   Expected schema:
   ```sql
   CREATE TABLE reviews (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     book_id VARCHAR(255) NOT NULL,
     user_id VARCHAR(255) NOT NULL,
     rating INTEGER NOT NULL,
     description VARCHAR(255),
     FOREIGN KEY(book_id) REFERENCES books(id),
     FOREIGN KEY(user_id) REFERENCES users(id),
     UNIQUE(book_id, user_id)
   );
   ```

## Running the API
1. **Start the server**:
   ```bash
   npm start
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
| POST   | `/signup`                             | Register a new user                      | `{ "username": "user1", "password": "pass123" }` |
| POST   | `/api/books`                          | Create a book                            | `{ "title": "Book1", "author": "Author1" }`      |
| GET    | `/api/books`                          | Get all books (supports pagination)      | N/A                                              |
| GET    | `/api/books/:bookId`                  | Get a specific book                      | N/A                                              |
| POST   | `/api/books/:bookId/reviews`          | Create a review                          | `{ "user_id": "2", "rating": 5, "description": "Great book!" }` |
| GET    | `/api/books/:bookId/reviews`          | Get all reviews for a book               | N/A                                              |
| PATCH  | `/api/books/:bookId/reviews/:reviewId`| Update a review (partial)                | `{ "rating": 4, "description": "Updated review" }` |
| DELETE | `/api/books/:bookId/reviews/:reviewId`| Delete a review                          | N/A                                              |

### Status Codes
- **200 OK**: Successful request with response body (e.g., GET, PATCH).
- **201 Created**: Resource created (e.g., POST).
- **204 No Content**: Successful deletion, no response body (e.g., DELETE).
- **400 Bad Request**: Invalid or missing input.
- **401 Unauthorized**: Missing or invalid authentication token.
- **404 Not Found**: Resource not found.
- **500 Internal Server Error**: Server-side error.

## Authentication
- **JWT Tokens**: Required for protected routes (`POST /api/books`, `/api/books/:bookId/reviews`, etc.).
- **Obtaining a Token**:
  - Use `POST /login` with valid credentials to receive a token.
  - Include the token in the `Authorization` header for protected requests:
    ```
    Authorization: Bearer <your-token>
    ```
- **User Validation**: Review operations (PATCH, DELETE) verify the authenticated user’s ID matches the review’s `user_id`.

## Example Usage
### Authenticate User
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "pass123"}'
```
**Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Create a Review
```bash
curl -X POST http://localhost:3000/api/books/1/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"user_id": "2", "rating": 5, "description": "Amazing book!"}'
```
**Response** (201):
```json
{
  "message": "Review created",
  "book_id": "1",
  "user_id": "2",
  "rating": 5,
  "description": "Amazing book!"
}
```

### Get Reviews for a Book
```bash
curl http://localhost:3000/api/books/1/reviews
```
**Response** (200):
```json
{
  "book_id": "1",
  "totalRating": 9,
  "reviews": [
    { "id": 1, "book_id": "1", "user_id": "2", "rating": 5, "description": "Amazing book!" },
    { "id": 2, "book_id": "1", "user_id": "3", "rating": 4, "description": "Great read!" }
  ]
}
```

### Update a Review
```bash
curl -X PATCH http://localhost:3000/api/books/1/reviews/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"rating": 4, "description": "Updated review"}'
```
**Response** (200):
```json
{
  "message": "Review updated",
  "reviewId": "1",
  "bookId": "1",
  "rating": 4,
  "description": "Updated review"
}
```

### Delete a Review
```bash
curl -X DELETE http://localhost:3000/api/books/1/reviews/1 \
  -H "Authorization: Bearer <your-token>"
```
**Response** (204): No content.

## Testing
To test the API:
1. **Manual Testing**:
   - Use Postman or `curl` to send requests to endpoints.
2. **Automated Testing**:
   - Install a testing framework (e.g., Jest, Mocha):
     ```bash
     npm install --save-dev jest supertest
     ```
   - Run tests:
     ```bash
     npm test
     ```
   - Example test cases:
     - Verify `POST /login` returns a valid JWT.
     - Ensure `POST /api/books/:bookId/reviews` fails without authentication.
     - Check `GET /api/books` returns paginated results.

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request.

Please include tests and follow the project’s coding style.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For questions or feedback, contact:
- **Your Name**: your.email@example.com
- **GitHub**: [your-username](https://github.com/your-username)
- **Issues**: Open an issue on this repository.