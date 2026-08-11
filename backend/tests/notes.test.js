const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Note = require('../src/models/Note');

describe('Notes routes', () => {
  let token;

  before(async () => {
    const testUri = process.env.MONGO_TEST_URI;

    if (!testUri || !testUri.includes('test')) {
      throw new Error(
        'MONGO_TEST_URI is missing or does not point to a test database. Refusing to run tests.'
      );
    }

    try {
      await mongoose.connect(testUri);
    } catch (err) {
      throw new Error(`Failed to connect to test database: ${err.message}`);
    }
  });

  beforeEach(async () => {
    try {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Notes User', email: 'notesuser@example.com', password: 'password123' });

      token = res.body.data.token;
    } catch (err) {
      throw new Error(`Failed to create test user: ${err.message}`);
    }
  });

  afterEach(async () => {
    try {
      await Note.deleteMany({});
      await User.deleteMany({});
    } catch (err) {
      throw new Error(`Failed to clean up test data: ${err.message}`);
    }
  });

  after(async () => {
    try {
      await mongoose.connection.close();
    } catch (err) {
      throw new Error(`Failed to close test database connection: ${err.message}`);
    }
  });

  describe('POST /api/notes', () => {
    it('creates a note for the logged-in user', async () => {
      try {
        const res = await request(app)
          .post('/api/notes')
          .set('Authorization', `Bearer ${token}`)
          .send({ title: 'My first note', content: 'Some content' });

        expect(res.status).to.equal(201);
        expect(res.body.data.title).to.equal('My first note');
      } catch (err) {
        throw new Error(`Create note test failed: ${err.message}`);
      }
    });

    it('rejects a note without a title', async () => {
      try {
        const res = await request(app)
          .post('/api/notes')
          .set('Authorization', `Bearer ${token}`)
          .send({ content: 'No title here' });

        expect(res.status).to.equal(400);
      } catch (err) {
        throw new Error(`Missing title test failed: ${err.message}`);
      }
    });

    it('rejects the request without a token', async () => {
      try {
        const res = await request(app)
          .post('/api/notes')
          .send({ title: 'No auth' });

        expect(res.status).to.equal(401);
      } catch (err) {
        throw new Error(`No auth test failed: ${err.message}`);
      }
    });
  });

  describe('GET /api/notes', () => {
    it('returns only the logged-in user\'s notes', async () => {
      try {
        await request(app)
          .post('/api/notes')
          .set('Authorization', `Bearer ${token}`)
          .send({ title: 'Note one' });

        const res = await request(app)
          .get('/api/notes')
          .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body.data).to.have.lengthOf(1);
      } catch (err) {
        throw new Error(`List notes test failed: ${err.message}`);
      }
    });
  });

  describe('PUT /api/notes/:id and DELETE /api/notes/:id', () => {
    it('updates and then deletes a note owned by the user', async () => {
      try {
        const createRes = await request(app)
          .post('/api/notes')
          .set('Authorization', `Bearer ${token}`)
          .send({ title: 'Original title' });

        const noteId = createRes.body.data._id;

        const updateRes = await request(app)
          .put(`/api/notes/${noteId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ title: 'Updated title' });

        expect(updateRes.status).to.equal(200);
        expect(updateRes.body.data.title).to.equal('Updated title');

        const deleteRes = await request(app)
          .delete(`/api/notes/${noteId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(deleteRes.status).to.equal(200);

        const getRes = await request(app)
          .get(`/api/notes/${noteId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(getRes.status).to.equal(404);
      } catch (err) {
        throw new Error(`Update/delete note test failed: ${err.message}`);
      }
    });

    it('rejects access to another user\'s note', async () => {
      try {
        const createRes = await request(app)
          .post('/api/notes')
          .set('Authorization', `Bearer ${token}`)
          .send({ title: 'Owned by user one' });

        const noteId = createRes.body.data._id;

        const otherUserRes = await request(app)
          .post('/api/auth/signup')
          .send({ name: 'Other User', email: 'otheruser@example.com', password: 'password123' });

        const otherToken = otherUserRes.body.data.token;

        const res = await request(app)
          .get(`/api/notes/${noteId}`)
          .set('Authorization', `Bearer ${otherToken}`);

        expect(res.status).to.equal(403);
      } catch (err) {
        throw new Error(`Ownership check test failed: ${err.message}`);
      }
    });
  });
});