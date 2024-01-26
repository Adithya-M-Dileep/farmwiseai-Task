const app = require('../server');
const request = require('supertest');
// const request = supertest(app);

beforeAll(async () => {
  // Add any setup code
});

afterAll(async () => {
  await app.close();
});



// Mock user data for testing
const adminUser = {
  username: 'admin',
  password: 'pass',
};

// Mock book data for testing
const mockBook = {
  title: 'Test Book',
  author: 'Test Author',
  ISBN: '1234567890',
  price: 19.99,
  quantity: 10,
};

let adminToken;

beforeEach(async () => {
  // Login as admin to get the authentication token
  const response = await request(app)
    .post('/api/login')
    .send(adminUser);

  adminToken = response.body.token;
});

describe('Authentication Endpoints', () => {


  it('should register a new user', async () => {
    // Register a new user with a unique username
    const responseUnique = await request(app)
      .post('/api/register')
      .set('Authorization', `${adminToken}`)
      .send({ username: 'uniqueuser', password: 'testpassword' });
  
    expect(responseUnique.statusCode).toBe(200);
    expect(responseUnique.body.message).toBe('Registration successful');
  
    // Attempt to register a new user with the same username
    const responseDuplicate = await request(app)
      .post('/api/register')
      .set('Authorization', `${adminToken}`)
      .send({ username: 'uniqueuser', password: 'anotherpassword' });
  
    // Expect a conflict status (409) indicating that the username already exists
    expect(responseDuplicate.statusCode).toBe(409);
    expect(responseDuplicate.body.message).toBe('Username already exists');
  });
  

  it('should login a user and return a token', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ username: 'uniqueuser', password: 'testpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('should login a user and return a token with wrong password', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ username: 'uniqueuser', password: 'testpassword1' });

    expect(response.statusCode).toBe(401);
  });
});

describe('Book Endpoints', () => {
  it('should create a new book', async () => {
    const response = await request(app)
      .post('/api/books')
      .set('Authorization', `${adminToken}`)
      .send(mockBook);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(mockBook.title);
  });

  it('should create a new book with no authorization', async () => {
    const response = await request(app)
      .post('/api/books')
      .send(mockBook);
    expect(response.statusCode).toBe(401);
  });
  

  it('should get all books without authentication', async () => {
    const response = await request(app)
      .get('/api/books');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it('should get a book by ISBN without authentication', async () => {
    const response = await request(app)
      .get(`/api/books/${mockBook.ISBN}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(mockBook.title);
  });

  it('should get a non-existent book by ISBN without authentication', async () => {
    const nonExistentISBN = 'nonexistentisbn';
    const response = await request(app)
      .get(`/api/books/${nonExistentISBN}`);
    expect(response.statusCode).toBe(404);
  });
  

  it('should update a book by ISBN', async () => {
    const updatedBookData = {
      title: 'Updated Book Title',
      author: 'Updated Author',
      price: 24.99,
    };

    const response = await request(app)
      .put(`/api/books/${mockBook.ISBN}`)
      .set('Authorization', `${adminToken}`)
      .send(updatedBookData);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(updatedBookData.title);
  });

  it('should update a book by ISBN with no authorization', async () => {
    const updatedBookData = {
      title: 'Updated Book Title',
      author: 'Updated Author',
      price: 24.99,
    };
  
    const response = await request(app)
      .put(`/api/books/${mockBook.ISBN}`)
      .send(updatedBookData);
  
    expect(response.statusCode).toBe(401);
  });
  

  it('should delete a book by ISBN', async () => {
    const response = await request(app)
      .delete(`/api/books/${mockBook.ISBN}`)
      .set('Authorization', `${adminToken}`);

    expect(response.statusCode).toBe(204);
  });

  it('should delete a book by ISBN with no authorization', async () => {
    const response = await request(app)
      .delete(`/api/books/${mockBook.ISBN}`);
    expect(response.statusCode).toBe(401);
  });
  
});
