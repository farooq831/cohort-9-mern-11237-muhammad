const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Auth routes', () => {
  before(async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
      throw new Error(`Failed to connect to test database: ${err.message}`);
    }
  });

  afterEach(async () => {
    try {
      await User.deleteMany({});
    } catch (err) {
      throw new Error(`Failed to clean up users after test: ${err.message}`);
    }
  });

  after(async () => {
    try {
      await mongoose.connection.close();
    } catch (err) {
      throw new Error(`Failed to close test database connection: ${err.message}`);
    }
  });

  describe('POST /api/auth/signup', () => {
    it('creates a new user and returns a token', async () => {
      try {
        const res = await request(app)
          .post('/api/auth/signup')
          .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

        expect(res.status).to.equal(201);
        expect(res.body.success).to.be.true;
        expect(res.body.data.token).to.exist;
        expect(res.body.data.user.email).to.equal('test@example.com');
      } catch (err) {
        throw new Error(`Signup test failed: ${err.message}`);
      }
    });

    it('rejects duplicate email signup', async () => {
      try {
        await User.create({
          name: 'Existing User',
          email: 'test@example.com',
          password_hash: 'hashedvalue',
        });

        const res = await request(app)
          .post('/api/auth/signup')
          .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

        expect(res.status).to.equal(409);
        expect(res.body.success).to.be.false;
      } catch (err) {
        throw new Error(`Duplicate signup test failed: ${err.message}`);
      }
    });

    it('rejects weak password', async () => {
      try {
        const res = await request(app)
          .post('/api/auth/signup')
          .send({ name: 'Test User', email: 'weak@example.com', password: '123' });

        expect(res.status).to.equal(400);
      } catch (err) {
        throw new Error(`Weak password test failed: ${err.message}`);
      }
    });
  });

  describe('POST /api/auth/login', () => {
    it('logs in with correct credentials', async () => {
      try {
        await request(app)
          .post('/api/auth/signup')
          .send({ name: 'Login User', email: 'login@example.com', password: 'password123' });

        const res = await request(app)
          .post('/api/auth/login')
          .send({ email: 'login@example.com', password: 'password123' });

        expect(res.status).to.equal(200);
        expect(res.body.data.token).to.exist;
      } catch (err) {
        throw new Error(`Login test failed: ${err.message}`);
      }
    });

    it('rejects wrong password', async () => {
      try {
        await request(app)
          .post('/api/auth/signup')
          .send({ name: 'Login User', email: 'login2@example.com', password: 'password123' });

        const res = await request(app)
          .post('/api/auth/login')
          .send({ email: 'login2@example.com', password: 'wrongpassword' });

        expect(res.status).to.equal(401);
      } catch (err) {
        throw new Error(`Wrong password test failed: ${err.message}`);
      }
    });
  });
});